import * as Lint from 'tslint';
import * as tsutils from 'tsutils';
import * as ts from 'typescript';
import { AstUtils } from './utils/AstUtils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FORBIDDEN_IMPORT_FAILURE_STRING: string = 'Found child_process import';
const FOUND_EXEC_FAILURE_STRING: string = 'Found child_process.exec() with non-literal first argument';
const FORBIDDEN_MODULE_NAME = 'child_process';
const FORBIDDEN_FUNCTION_NAME = 'exec';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'detect-child-process',
        type: 'maintainability',
        description: 'Detects instances of child_process and child_process.exec',
        rationale: Lint.Utils.dedent`
            It is dangerous to pass a string constructed at runtime as the first argument to the child_process.exec().
            <code>child_process.exec(cmd)</code> runs <code>cmd</code> as a shell command which allows attacker 
            to execute malicious code injected into <code>cmd</code> string.
            Instead of <code>child_process.exec(cmd)</code> you should use <code>child_process.spawn(cmd)</code> 
            or specify the command as a literal, e.g. <code>child_process.exec('ls')</code>.
        `,
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Security',
        commonWeaknessEnumeration: '88'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function getProhibitedImportedNames(namedImports: ts.NamedImports) {
    return namedImports.elements
        .filter(x => {
            let originalIdentifier: ts.Identifier;

            if (x.propertyName === undefined) {
                originalIdentifier = x.name;
            } else {
                originalIdentifier = x.propertyName;
            }
            return tsutils.getIdentifierText(originalIdentifier) === FORBIDDEN_FUNCTION_NAME;
        })
        .map(x => tsutils.getIdentifierText(x.name));
}

function isNotUndefined<TValue>(value: TValue | undefined): value is TValue {
    return value !== undefined;
}

function getProhibitedBoundNames(namedBindings: ts.ObjectBindingPattern) {
    return namedBindings.elements
        .filter(x => {
            if (!ts.isIdentifier(x.name)) {
                return false;
            }
            let importedName: string | undefined;

            if (x.propertyName === undefined) {
                importedName = tsutils.getIdentifierText(x.name);
            } else {
                if (ts.isIdentifier(x.propertyName)) {
                    importedName = tsutils.getIdentifierText(x.propertyName);
                } else if (ts.isStringLiteral(x.propertyName)) {
                    importedName = x.propertyName.text;
                }
            }
            return importedName === FORBIDDEN_FUNCTION_NAME;
        })
        .map(x => {
            if (ts.isIdentifier(x.name)) {
                return tsutils.getIdentifierText(x.name);
            }
            return undefined;
        })
        .filter(isNotUndefined);
}

function walk(ctx: Lint.WalkContext<void>) {
    const childProcessModuleAliases = new Set<string>();
    const childProcessFunctionAliases = new Set<string>();

    function processImport(node: ts.Node, moduleAlias: string | undefined, importedFunctionsAliases: string[], importedModuleName: string) {
        if (importedModuleName === FORBIDDEN_MODULE_NAME) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), FORBIDDEN_IMPORT_FAILURE_STRING);
            if (moduleAlias !== undefined) {
                childProcessModuleAliases.add(moduleAlias);
            }
            importedFunctionsAliases.forEach(x => childProcessFunctionAliases.add(x));
        }
    }

    function processRequire(node: ts.CallExpression) {
        const functionTarget = AstUtils.getFunctionTarget(node);

        if (functionTarget !== undefined || node.arguments.length === 0) {
            return;
        }

        const firstArg = node.arguments[0];
        if (tsutils.isStringLiteral(firstArg) && firstArg.text === FORBIDDEN_MODULE_NAME) {
            let alias: string | undefined;
            let importedNames: string[] = [];

            if (tsutils.isVariableDeclaration(node.parent)) {
                if (tsutils.isIdentifier(node.parent.name)) {
                    alias = tsutils.getIdentifierText(node.parent.name);
                } else if (tsutils.isObjectBindingPattern(node.parent.name)) {
                    importedNames = getProhibitedBoundNames(node.parent.name);
                }
            }

            processImport(node, alias, importedNames, firstArg.text);
        }
    }

    function isProhibitedCall(node: ts.CallExpression): boolean {
        const functionName: string = AstUtils.getFunctionName(node);
        const functionTarget = AstUtils.getFunctionTarget(node);
        const hasNonStringLiteralFirstArgument = node.arguments.length > 0 && !tsutils.isStringLiteral(node.arguments[0]);

        if (functionTarget === undefined) {
            return childProcessFunctionAliases.has(functionName) && hasNonStringLiteralFirstArgument;
        }

        return (
            childProcessModuleAliases.has(functionTarget) && functionName === FORBIDDEN_FUNCTION_NAME && hasNonStringLiteralFirstArgument
        );
    }

    function processCallExpression(node: ts.CallExpression) {
        const functionName: string = AstUtils.getFunctionName(node);

        if (functionName === 'require') {
            processRequire(node);
        }

        if (isProhibitedCall(node)) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), FOUND_EXEC_FAILURE_STRING);
        }
    }

    function processImportDeclaration(node: ts.ImportDeclaration) {
        if (!tsutils.isStringLiteral(node.moduleSpecifier)) {
            return;
        }

        const moduleName: string = node.moduleSpecifier.text;

        let alias: string | undefined;
        let importedNames: string[] = [];

        if (node.importClause !== undefined) {
            if (node.importClause.name !== undefined) {
                alias = tsutils.getIdentifierText(node.importClause.name);
            }
            if (node.importClause.namedBindings !== undefined) {
                if (tsutils.isNamespaceImport(node.importClause.namedBindings)) {
                    alias = tsutils.getIdentifierText(node.importClause.namedBindings.name);
                } else if (tsutils.isNamedImports(node.importClause.namedBindings)) {
                    importedNames = getProhibitedImportedNames(node.importClause.namedBindings);
                }
            }
        }

        processImport(node, alias, importedNames, moduleName);
    }

    function processImportEqualsDeclaration(node: ts.ImportEqualsDeclaration) {
        if (tsutils.isExternalModuleReference(node.moduleReference)) {
            const moduleRef: ts.ExternalModuleReference = node.moduleReference;
            if (tsutils.isStringLiteral(moduleRef.expression)) {
                const moduleName: string = moduleRef.expression.text;
                const alias: string = node.name.text;
                processImport(node, alias, [], moduleName);
            }
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isImportEqualsDeclaration(node)) {
            processImportEqualsDeclaration(node);
        }

        if (tsutils.isImportDeclaration(node)) {
            processImportDeclaration(node);
        }

        if (tsutils.isCallExpression(node)) {
            processCallExpression(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
