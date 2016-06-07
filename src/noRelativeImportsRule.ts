import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';

const FAILURE_STRING_EXT: string = 'External module is being loaded from a relative path. Please use an absolute path: ';
const FAILURE_STRING_IMPORT: string = 'Imported module is being loaded from a relative path. Please use an absolute path: ';

/**
 * Implementation of the no-relative-imports rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoRelativeImportsRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoRelativeImportsRuleWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().ExternalModuleReference) {
            const moduleExpression: ts.Expression = (<ts.ExternalModuleReference>node).expression;
            if (!this.isModuleExpressionValid(moduleExpression)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING_EXT + node.getText()));
            }
        } else if (node.kind === SyntaxKind.current().ImportDeclaration) {
            const moduleExpression: ts.Expression = (<ts.ImportDeclaration>node).moduleSpecifier;
            if (!this.isModuleExpressionValid(moduleExpression)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING_IMPORT + node.getText()));
            }
        }
        super.visitNode(node);
    }

    private isModuleExpressionValid(expression: ts.Expression): boolean {
        if (expression.kind === SyntaxKind.current().StringLiteral) {
            const moduleName: ts.StringLiteral = <ts.StringLiteral>expression;
            if (moduleName.text[0] === '.') {
                return false;
            }
        }
        return true;
    }
}
