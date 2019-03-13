import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { Utils } from './utils/Utils';
import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

interface Options {
    allExceptions: string[] | undefined;
    ignoreCase: boolean;
}

export const OPTION_IGNORE_CASE: string = 'ignore-case';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'export-name',
        type: 'maintainability',
        description: 'The name of the exported module must match the filename of the source file',
        options: {
            type: 'list',
            listType: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'object',
                        properties: {
                            'ignore-case': {
                                type: 'boolean'
                            },
                            allow: {
                                type: 'array',
                                items: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                ]
            }
        },
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING: string = 'The exported module or identifier name must match the file name. Found: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        return {
            allExceptions: this.getExceptions(options),
            ignoreCase: this.getIgnoreCase(options)
        };
    }

    /* tslint:disable:function-name */
    public getExceptions(options: Lint.IOptions): string[] | undefined {
        /* tslint:enable:function-name */
        if (options.ruleArguments instanceof Array) {
            const ruleArg = options.ruleArguments[0];
            return typeof ruleArg === 'object' ? ruleArg.allow : options.ruleArguments;
        }

        if (options instanceof Array) {
            return typeof options[0] === 'object' ? options[0].allow : options;
        }
        return undefined;
    }

    /* tslint:disable:function-name */
    public getIgnoreCase(options: Lint.IOptions): boolean {
        /* tslint:enable:function-name */
        if (options instanceof Array) {
            return typeof options[0] === 'object' ? options[0]['ignore-case'] : true;
        }
        return true;
    }
}

function isExportedDeclaration(element: ts.Statement): boolean {
    return element.modifiers !== undefined && AstUtils.hasModifier(element.modifiers, ts.SyntaxKind.ExportKeyword);
}

type ExportStatement = ts.ExportDeclaration | ts.ExportAssignment;
function isExportStatement(node: ts.Statement): node is ExportStatement {
    return ts.isExportAssignment(node) || ts.isExportDeclaration(node);
}

function getExportsFromStatement(node: ExportStatement): [string, ts.Node][] {
    if (ts.isExportAssignment(node)) {
        return [[node.expression.getText(), node.expression]];
    } else if (node.exportClause) {
        const symbolAndNodes: [string, ts.Node][] = [];
        node.exportClause.elements.forEach(e => {
            symbolAndNodes.push([e.name.getText(), node]);
        });
        return symbolAndNodes;
    } else {
        // Re-exports `export * from ...` do not have export clause - no names to validate.
        // Effectively will be skipped in check later.
        return [];
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { allExceptions, ignoreCase } = ctx.options;

    function getExportStatementsWithinModules(moduleDeclaration: ts.ModuleDeclaration): ts.Statement[] | undefined {
        if (moduleDeclaration.body === undefined) {
            return undefined;
        }

        if (moduleDeclaration.body.kind === ts.SyntaxKind.ModuleDeclaration) {
            // modules may be nested so recur into the structure
            return getExportStatementsWithinModules(<ts.ModuleDeclaration>moduleDeclaration.body);
        } else if (moduleDeclaration.body.kind === ts.SyntaxKind.ModuleBlock) {
            const moduleBlock: ts.ModuleBlock = <ts.ModuleBlock>moduleDeclaration.body;
            return moduleBlock.statements.filter(isExportedDeclaration);
        }

        return undefined;
    }

    function validateExportedElements(exportedElements: ts.Statement[]): void {
        // only validate the exported elements when a single export statement is made
        if (exportedElements.length === 1) {
            const element = exportedElements[0];
            if (ts.isModuleDeclaration(element) || ts.isClassDeclaration(element) || ts.isFunctionDeclaration(element)) {
                if (element.name !== undefined) {
                    validateExport(element.name.text, exportedElements[0]);
                }
            } else if (exportedElements[0].kind === ts.SyntaxKind.VariableStatement) {
                const variableStatement: ts.VariableStatement = <ts.VariableStatement>exportedElements[0];
                // ignore comma separated variable lists
                if (variableStatement.declarationList.declarations.length === 1) {
                    const variableDeclaration: ts.VariableDeclaration = variableStatement.declarationList.declarations[0];
                    validateExport(variableDeclaration.name.getText(), variableDeclaration);
                }
            }
        }
    }

    function validateExport(exportedName: string, tsNode: ts.Node): void {
        const flags = ignoreCase ? 'i' : '';
        const regex: RegExp = new RegExp(`^${exportedName}\\..+`, flags); // filename must be exported name plus any extension
        const fileName = Utils.fileBasename(ctx.sourceFile.fileName);
        const fileNameAsCamelCase = convertSnakeOrKebabCaseName(fileName);

        if (!regex.test(fileNameAsCamelCase)) {
            if (!isSuppressed(exportedName)) {
                const failureString: string = Rule.FAILURE_STRING + fileName + ' and ' + exportedName;
                ctx.addFailureAt(tsNode.getStart(), tsNode.getWidth(), failureString);
            }
        }
    }

    function convertSnakeOrKebabCaseName(rawName: string): string {
        const snakeOrKebabRegex = /((\-|\_)\w)/g;

        return rawName.replace(snakeOrKebabRegex, (match: string): string => match[1].toUpperCase());
    }

    function isSuppressed(exportedName: string): boolean {
        return Utils.exists(
            allExceptions,
            (exception: string): boolean => {
                return new RegExp(exception).test(exportedName);
            }
        );
    }

    const node: ts.SourceFile = ctx.sourceFile;

    // look for single export assignment from file first
    const singleExport = node.statements.filter(isExportStatement);
    if (singleExport.length === 1) {
        const symbolsAndNodes = getExportsFromStatement(singleExport[0]);
        if (symbolsAndNodes.length === 1) {
            validateExport(symbolsAndNodes[0][0], symbolsAndNodes[0][1]);
        }

        return; // there is a single export and it is valid, so do not proceed
    }

    // exports are normally declared at the top level
    let exportedTopLevelElements: ts.Statement[] = node.statements.filter(isExportedDeclaration);

    // exports might be hidden inside a namespace
    if (exportedTopLevelElements.length === 0) {
        node.statements.forEach(
            (element: ts.Statement): void => {
                if (tsutils.isModuleDeclaration(element)) {
                    const exportStatements = getExportStatementsWithinModules(element) || [];
                    exportedTopLevelElements = exportedTopLevelElements.concat(exportStatements);
                }
            }
        );
    }
    validateExportedElements(exportedTopLevelElements);
}
