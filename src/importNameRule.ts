import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the import-name rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ImportNameRuleWalker(sourceFile, this.getOptions()));
    }
}

class ImportNameRuleWalker extends ErrorTolerantWalker {

    protected visitImportEqualsDeclaration(node: ts.ImportEqualsDeclaration): void {
        let name: string = node.name.text;

        if (node.moduleReference.kind === SyntaxKind.current().ExternalModuleReference) {
            let moduleRef: ts.ExternalModuleReference = <ts.ExternalModuleReference>node.moduleReference;
            if (moduleRef.expression.kind === SyntaxKind.current().StringLiteral) {
                let moduleName: string = (<ts.StringLiteral>moduleRef.expression).text;
                this.validateImport(node, name, moduleName);
            }
        } else if (node.moduleReference.kind === SyntaxKind.current().QualifiedName) {
            let moduleName = node.moduleReference.getText();
            moduleName = moduleName.replace(/.*\./, ''); // chop off the qualified parts
            this.validateImport(node, name, moduleName);
        }
        super.visitImportEqualsDeclaration(node);
    }


    protected visitImportDeclaration(node: ts.ImportDeclaration): void {
        if (node.importClause.name != null) {
            let name: string = node.importClause.name.text;
            if (node.moduleSpecifier.kind === SyntaxKind.current().StringLiteral) {
                let moduleName: string = (<ts.StringLiteral>node.moduleSpecifier).text;
                this.validateImport(node, name, moduleName);
            }
        }
        super.visitImportDeclaration(node);
    }

    private validateImport(node: ts.Node, importedName: string, moduleName: string): void {
        moduleName = moduleName.replace(/.*\//, ''); // chop off the path
        if (moduleName !== importedName) {
            let message: string = `Misnamed import. Import should be named '${moduleName}' but found '${importedName}'`;
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), message));
        }
    }

}
