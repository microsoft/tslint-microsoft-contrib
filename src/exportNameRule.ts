
import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {Utils} from './utils/Utils';
import {SyntaxKind} from './utils/SyntaxKind';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the export-name rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'export-name',
        type: 'maintainability',
        description: 'The name of the exported module must match the filename of the source file',
        options: null,
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING = 'The exported module or identifier name must match the file name. Found: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ExportNameWalker(sourceFile, this.getOptions()));
    }

    /* tslint:disable:function-name */
    public static getExceptions(options : Lint.IOptions) : string[] {
    /* tslint:enable:function-name */
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return <string[]><any>options; // MSE version of tslint somehow requires this
        }
        return null;
    }
}

export class ExportNameWalker extends ErrorTolerantWalker {
    protected visitSourceFile(node: ts.SourceFile): void {

        // look for single export assignment from file first
        const singleExport: ts.Statement[] = node.statements.filter((element: ts.Statement): boolean => {
            return element.kind === SyntaxKind.current().ExportAssignment;
        });
        if (singleExport.length === 1) {
            const exportAssignment: ts.ExportAssignment = <ts.ExportAssignment>singleExport[0];
            this.validateExport(exportAssignment.expression.getText(), exportAssignment.expression);
            return; // there is a single export and it is valid, so do not proceed
        }

        let exportedTopLevelElements: ts.Statement[] = [];

        // exports are normally declared at the top level
        node.statements.forEach((element: ts.Statement): void => {
            const exportStatements: ts.Statement[] = this.getExportStatements(element);
            exportedTopLevelElements = exportedTopLevelElements.concat(exportStatements);
        });

        // exports might be hidden inside a namespace
        if (exportedTopLevelElements.length === 0) {
            node.statements.forEach((element: ts.Statement): void => {
                if (element.kind === SyntaxKind.current().ModuleDeclaration) {
                    const exportStatements: ts.Statement[] = this.getExportStatementsWithinModules((<ts.ModuleDeclaration>element));
                    exportedTopLevelElements = exportedTopLevelElements.concat(exportStatements);
                }
            });
        }
        this.validateExportedElements(exportedTopLevelElements);
    }

    private getExportStatementsWithinModules(moduleDeclaration: ts.ModuleDeclaration): ts.Statement[] {
        if (moduleDeclaration.body.kind === SyntaxKind.current().ModuleDeclaration) {
            // modules may be nested so recur into the structure
            return this.getExportStatementsWithinModules(<ts.ModuleDeclaration>moduleDeclaration.body);
        } else if (moduleDeclaration.body.kind === SyntaxKind.current().ModuleBlock) {
            let exportStatements: ts.Statement[] = [];
            const moduleBlock: ts.ModuleBlock = <ts.ModuleBlock>moduleDeclaration.body;
            moduleBlock.statements.forEach((element: ts.Statement): void => {
                exportStatements = exportStatements.concat(this.getExportStatements(element));
            });
            return exportStatements;
        }
    }

    private getExportStatements(element: ts.Statement): ts.Statement[] {
        const exportStatements: ts.Statement[] = [];
        if (element.kind === SyntaxKind.current().ExportAssignment) {
            const exportAssignment: ts.ExportAssignment = <ts.ExportAssignment>element;
            this.validateExport(exportAssignment.expression.getText(), exportAssignment.expression);
        } else if (AstUtils.hasModifier(element.modifiers, SyntaxKind.current().ExportKeyword)) {
            exportStatements.push(element);
        }
        return exportStatements;
    }

    private validateExportedElements(exportedElements: ts.Statement[]): void {
        // only validate the exported elements when a single export statement is made
        if (exportedElements.length === 1) {
            if (exportedElements[0].kind === SyntaxKind.current().ModuleDeclaration ||
                exportedElements[0].kind === SyntaxKind.current().ClassDeclaration ||
                exportedElements[0].kind === SyntaxKind.current().FunctionDeclaration) {
                this.validateExport((<any>exportedElements[0]).name.text, exportedElements[0]);
            } else if (exportedElements[0].kind === SyntaxKind.current().VariableStatement) {
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
        const regex : RegExp = new RegExp(exportedName + '\..*'); // filename must be exported name plus any extension
        if (!regex.test(this.getFilename())) {
            if (!this.isSuppressed(exportedName)) {
                const failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName + ' and ' + exportedName;
                const failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                this.addFailure(failure);
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
        const allExceptions : string[] = Rule.getExceptions(this.getOptions());

        return Utils.exists(allExceptions, (exception: string) : boolean => {
            return new RegExp(exception).test(exportedName);
        });
    }
}
