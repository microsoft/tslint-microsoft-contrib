import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the use-isnan rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Found an invalid comparison for NaN: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UseIsnanRuleWalker(sourceFile, this.getOptions()));
    }
}

class UseIsnanRuleWalker extends ErrorTolerantWalker {

    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if (this.isExpressionNaN(node.left) || this.isExpressionNaN(node.right)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + node.getText()));
        }
        super.visitBinaryExpression(node);
    }

    private isExpressionNaN(node: ts.Node) {
        return node.kind === SyntaxKind.current().Identifier && node.getText() === 'NaN';
    }
}
