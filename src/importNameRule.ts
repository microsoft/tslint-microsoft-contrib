import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { Utils } from './utils/Utils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'import-name',
        type: 'maintainability',
        description: 'The name of the imported module must match the name of the thing being imported',
        hasFix: true,
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        optionExamples: [
            [true],
            [true, { moduleName: 'importedName' }],
            [true, { moduleName: 'importedName' }, ['moduleName1', 'moduleName2']],
            [true, { moduleName: 'importedName' }, ['moduleName1', 'moduleName2'], { ignoreExternalModule: false }]
        ],
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Option {
        const result: Option = {
            replacements: {},
            ignoredList: [],
            config: {
                ignoreExternalModule: true,
                case: StringCase.camel
            }
        };

        if (options.ruleArguments instanceof Array) {
            options.ruleArguments.forEach((opt: unknown, index: number) => {
                if (index === 1 && isObject(opt)) {
                    result.replacements = this.extractReplacements(opt);
                }

                if (index === 2 && Array.isArray(opt)) {
                    result.ignoredList = this.extractIgnoredList(opt);
                }

                if (index === 3 && isObject(opt)) {
                    result.config = this.extractConfig(opt);
                }
            });
        }

        return result;
    }

    private extractReplacements(opt: Replacement | unknown): Replacement {
        const result: Replacement = {};
        if (isObject(opt)) {
            Object.keys(opt).forEach(
                (key: string): void => {
                    const value: unknown = opt[key];
                    if (typeof value === 'string') {
                        result[key] = value;
                    }
                }
            );
        }
        return result;
    }

    private extractIgnoredList(opt: IgnoredList): IgnoredList {
        return opt.filter((moduleName: string) => typeof moduleName === 'string');
    }

    private extractConfig(opt: unknown): Config {
        const result: Config = { ignoreExternalModule: true, case: StringCase.camel };
        const configKeyList: ConfigKey[] = ['ignoreExternalModule', 'case'];
        if (isObject(opt)) {
            return Object.keys(opt).reduce(
                (accum: Config, key: string) => {
                    if (configKeyList.filter((configKey: string) => configKey === key).length >= 1) {
                        accum[<ConfigKey>key] = <boolean | StringCase>opt[key];
                        return accum;
                    }
                    return accum;
                },
                { ignoreExternalModule: true, case: StringCase.camel }
            );
        }
        return result;
    }
}

enum StringCase {
    any = 'any-case',
    pascal = 'PascalCase',
    camel = 'camelCase'
}
type Replacement = { [index: string]: string };
type IgnoredList = string[];
type ConfigKey = 'ignoreExternalModule' | 'case';
type Config = {
    ignoreExternalModule: boolean;
    case: StringCase;
};

// This is for temporarily resolving type errors. Actual runtime Node, SourceFile object
// has those properties.
interface RuntimeSourceFile extends ts.SourceFile {
    resolvedModules: Map<string, ts.ResolvedModuleFull>;
}
interface RuntimeNode extends ts.Node {
    parent: RuntimeSourceFile;
}

type Option = {
    replacements: Replacement;
    ignoredList: IgnoredList;
    config: Config;
};

function walk(ctx: Lint.WalkContext<Option>) {
    const option = ctx.options;

    function getNameNodeFromImportNode(node: ts.ImportEqualsDeclaration | ts.ImportDeclaration): ts.Node | undefined {
        if (tsutils.isImportEqualsDeclaration(node)) {
            return node.name;
        }

        const importClause = node.importClause;

        return importClause === undefined ? undefined : importClause.name;
    }

    // Ignore NPM installed modules by checking its module path at runtime
    function checkIgnoreExternalModule(moduleName: string, node: unknown, opt: Config): boolean {
        const runtimeNode: RuntimeNode = <RuntimeNode>node;
        if (opt.ignoreExternalModule === true && runtimeNode.parent !== undefined && runtimeNode.parent.resolvedModules !== undefined) {
            let ignoreThisExternalModule = false;
            runtimeNode.parent.resolvedModules.forEach((value: ts.ResolvedModuleFull, key: string) => {
                if (key === moduleName && value.isExternalLibraryImport === true) {
                    ignoreThisExternalModule = true;
                }
            });
            return ignoreThisExternalModule;
        }
        return false;
    }

    // Ignore array of strings that comes from third argument.
    function checkIgnoredListExists(moduleName: string, ignoredList: IgnoredList): boolean {
        return ignoredList.filter((ignoredModule: string) => ignoredModule === moduleName).length >= 1;
    }

    function checkReplacementsExist(
        importedName: string,
        expectedImportedName: string,
        moduleName: string,
        replacements: Replacement
    ): boolean {
        // Allowed Replacement keys are specifiers that are allowed when overriding or adding exceptions
        // to import-name rule.
        // Example: for below import statement
        // `import cgi from 'fs-util/cgi-common'`
        // The Valid specifiers are: [cgiCommon, fs-util/cgi-common, cgi-common]
        const allowedReplacementKeys: string[] = [
            makeCamelCase(expectedImportedName),
            makePascalCase(expectedImportedName),
            moduleName,
            moduleName.replace(/.*\//, '')
        ];
        return Utils.exists(
            Object.keys(replacements),
            (replacementKey: string): boolean => {
                for (let index = 0; allowedReplacementKeys.length > index; index = index + 1) {
                    if (replacementKey === allowedReplacementKeys[index]) {
                        return importedName === replacements[replacementKey];
                    }
                }
                return false;
            }
        );
    }

    function isImportNameValid(
        importedName: string,
        expectedImportedName: string,
        moduleName: string,
        node: ts.ImportEqualsDeclaration | ts.ImportDeclaration
    ): boolean {
        if (option.config.case === StringCase.any) {
            if (makeCamelCase(expectedImportedName) === importedName || makePascalCase(expectedImportedName) === importedName) {
                return true;
            }
        } else if (transformName(expectedImportedName).includes(importedName)) {
            return true;
        }

        const isReplacementsExist = checkReplacementsExist(importedName, expectedImportedName, moduleName, option.replacements);
        if (isReplacementsExist) {
            return true;
        }

        const isIgnoredModuleExist = checkIgnoredListExists(moduleName, option.ignoredList);
        if (isIgnoredModuleExist) {
            return true;
        }

        const ignoreThisExternalModule = checkIgnoreExternalModule(moduleName, node, option.config);
        if (ignoreThisExternalModule) {
            return true;
        }

        return false;
    }

    function transformName(input: string) {
        switch (option.config.case) {
            case StringCase.camel:
                return [makeCamelCase(input)];
            case StringCase.pascal:
                return [makePascalCase(input)];
            case StringCase.any:
                return [makeCamelCase(input), makePascalCase(input)];
            default:
                throw new Error(`Unknown case for import-name rule: "${option.config.case}"`);
        }
    }

    function makeCamelCase(input: string): string {
        return input.replace(
            /[-|\.|_](.)/g, // tslint:disable-next-line:variable-name
            (_match: string, group1: string): string => {
                return group1.toUpperCase();
            }
        );
    }

    function makePascalCase(input: string): string {
        return input.replace(/(?:^|[-|\.|_|])([a-z])/g, (_, group1) => group1.toUpperCase());
    }

    function validateImport(node: ts.ImportEqualsDeclaration | ts.ImportDeclaration, importedName: string, moduleName: string): void {
        const expectedImportedName = moduleName.replace(/.*\//, ''); // chop off the path
        if (expectedImportedName === '' || expectedImportedName === '.' || expectedImportedName === '..') {
            return;
        }
        if (isImportNameValid(importedName, expectedImportedName, moduleName, node)) {
            return;
        }
        const expectedImportedNames = transformName(expectedImportedName);
        const expectedNames = expectedImportedNames.map(name => `'${name}'`).join(' or ');
        const message: string = `Misnamed import. Import should be named ${expectedNames} but found '${importedName}'`;

        const nameNode = getNameNodeFromImportNode(node);
        if (nameNode === undefined) {
            return;
        }

        const nameNodeStartPos = nameNode.getStart();
        const fix = new Lint.Replacement(nameNodeStartPos, nameNode.end - nameNodeStartPos, expectedImportedNames[0]);
        ctx.addFailureAt(node.getStart(), node.getWidth(), message, fix);
    }

    function cb(node: ts.Node): void {
        if (tsutils.isImportEqualsDeclaration(node)) {
            const name: string = node.name.text;

            if (tsutils.isExternalModuleReference(node.moduleReference)) {
                const moduleRef: ts.ExternalModuleReference = node.moduleReference;
                if (tsutils.isStringLiteral(moduleRef.expression)) {
                    const moduleName: string = moduleRef.expression.text;
                    validateImport(node, name, moduleName);
                }
            } else if (tsutils.isQualifiedName(node.moduleReference)) {
                let moduleName = node.moduleReference.getText();
                moduleName = moduleName.replace(/.*\./, ''); // chop off the qualified parts
                validateImport(node, name, moduleName);
            }
        }

        if (tsutils.isImportDeclaration(node)) {
            if (node.importClause !== undefined && node.importClause.name !== undefined) {
                const name: string = node.importClause.name.text;
                if (tsutils.isStringLiteral(node.moduleSpecifier)) {
                    const moduleName: string = node.moduleSpecifier.text;
                    validateImport(node, name, moduleName);
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
