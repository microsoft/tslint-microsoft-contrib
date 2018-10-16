
import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {Utils} from './utils/Utils';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

export const OPTION_IGNORE_CASE: string = 'ignore-case';
/**
 * Implementation of the export-name rule.
 */
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
        return this.applyWithWalker(new ExportNameWalker(sourceFile, this.getOptions()));
    }

    /* tslint:disable:function-name */
    public static getExceptions(options : Lint.IOptions): string[] | undefined {
    /* tslint:enable:function-name */
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return typeof options[0] === 'object' ?
                options[0].allow :
                <string[]><any>options; // MSE version of tslint somehow requires this
        }
        return undefined;
    }

    /* tslint:disable:function-name */
    public static getIgnoreCase(options: Lint.IOptions): boolean {
        /* tslint:enable:function-name */
        if (options instanceof Array) {
            return typeof options[0] === 'object' ?
                options[0]['ignore-case'] :
                true;
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
  } else {
      const symbolAndNodes: [string, ts.Node][] = [];
      node.exportClause!.elements.forEach(e => {
          symbolAndNodes.push([e.name.getText(), node]);
      });
      return symbolAndNodes;
  }
}

export class ExportNameWalker extends ErrorTolerantWalker {
    protected visitSourceFile(node: ts.SourceFile): void {

        // look for single export assignment from file first
        const singleExport = node.statements.filter(isExportStatement);
        if (singleExport.length === 1) {
            const symbolsAndNodes = getExportsFromStatement(singleExport[0]);
            if (symbolsAndNodes.length === 1) {
                this.validateExport(symbolsAndNodes[0][0], symbolsAndNodes[0][1]);
            }

            return; // there is a single export and it is valid, so do not proceed
        }

        // exports are normally declared at the top level
        let exportedTopLevelElements: ts.Statement[] = node.statements.filter(isExportedDeclaration);

        // exports might be hidden inside a namespace
        if (exportedTopLevelElements.length === 0) {
            node.statements.forEach((element: ts.Statement): void => {
                if (element.kind === ts.SyntaxKind.ModuleDeclaration) {
                    const exportStatements = this.getExportStatementsWithinModules((<ts.ModuleDeclaration>element)) || [];
                    exportedTopLevelElements = exportedTopLevelElements.concat(exportStatements);
                }
            });
        }
        this.validateExportedElements(exportedTopLevelElements);
    }

    private getExportStatementsWithinModules(moduleDeclaration: ts.ModuleDeclaration): ts.Statement[] | undefined {
        if (moduleDeclaration.body!.kind === ts.SyntaxKind.ModuleDeclaration) {
            // modules may be nested so recur into the structure
            return this.getExportStatementsWithinModules(<ts.ModuleDeclaration>moduleDeclaration.body);
        } else if (moduleDeclaration.body!.kind === ts.SyntaxKind.ModuleBlock) {
            const moduleBlock: ts.ModuleBlock = <ts.ModuleBlock>moduleDeclaration.body;
            return moduleBlock.statements.filter(isExportedDeclaration);
        }
        return undefined;
    }

    private validateExportedElements(exportedElements: ts.Statement[]): void {
        // only validate the exported elements when a single export statement is made
        if (exportedElements.length === 1) {
            if (exportedElements[0].kind === ts.SyntaxKind.ModuleDeclaration ||
                exportedElements[0].kind === ts.SyntaxKind.ClassDeclaration ||
                exportedElements[0].kind === ts.SyntaxKind.FunctionDeclaration) {
                this.validateExport((<any>exportedElements[0]).name.text, exportedElements[0]);
            } else if (exportedElements[0].kind === ts.SyntaxKind.VariableStatement) {
                const variableStatement: ts.VariableStatement = <ts.VariableStatement>exportedElements[0];
                // ignore comma separated variable lists
                if (variableStatement.declarationList.declarations.length === 1) {
                    const variableDeclaration: ts.VariableDeclaration = variableStatement.declarationList.declarations[0];
                    this.validateExport((<any>variableDeclaration.name).text, variableDeclaration);
                }
            }
        }
    }

    private validateExport(exportedName: string, node: ts.Node): void {
        const flags = Rule.getIgnoreCase(this.getOptions()) ? 'i' : '';
        const regex : RegExp = new RegExp(exportedName + '\..*', flags); // filename must be exported name plus any extension
        if (!regex.test(this.getFilename())) {
            if (!this.isSuppressed(exportedName)) {
                const failureString: string = Rule.FAILURE_STRING + this.getSourceFile().fileName + ' and ' + exportedName;
                this.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }
    }

    private getFilename(): string {
        const filename = this.getSourceFile().fileName;
        const lastSlash = filename.lastIndexOf('/');
        if (lastSlash > -1) {
            return filename.substring(lastSlash + 1);
        }
        return filename;
    }

    private isSuppressed(exportedName: string) : boolean {
        const allExceptions = Rule.getExceptions(this.getOptions());

        return Utils.exists(allExceptions, (exception: string): boolean => {
            return new RegExp(exception).test(exportedName);
        });
    }
}
