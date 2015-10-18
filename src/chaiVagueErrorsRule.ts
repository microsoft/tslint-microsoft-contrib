import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the chai-vague-errors rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Found chai call with vague failure message. Please add an explicit failure message';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ChaiVagueErrorsRuleWalker(sourceFile, this.getOptions()));
    }

}

class ChaiVagueErrorsRuleWalker extends ErrorTolerantWalker {


    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        if (this.isExpectInvocation(node)) {
            if (/ok|true|false|undefined|null/.test(node.name.getText())) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        super.visitPropertyAccessExpression(node);
    }


    protected visitCallExpression(node: ts.CallExpression): void {
        if (this.isExpectInvocation(node)) {
            if (node.expression.kind === SyntaxKind.current().PropertyAccessExpression) {
                let propExpression: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.expression;
                if (/equal|equals|eql/.test(propExpression.name.getText())) {
                    if (node.arguments.length === 1) {
                        if (/true|false|null|undefined/.test(node.arguments[0].getText())) {
                            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                        }
                    }
                }
            }
        }
        super.visitCallExpression(node);
    }

    private isExpectInvocation(node: ts.PropertyAccessExpression | ts.CallExpression): boolean {
        let callExpression: ts.CallExpression = ChaiVagueErrorsRuleWalker.getLeftMostCallExpression(node);
        if (callExpression == null) {
            return false;
        }
        return /.*\.?expect/.test(callExpression.expression.getText());
    }

    private static getLeftMostCallExpression(node: ts.PropertyAccessExpression | ts.CallExpression): ts.CallExpression {
        var leftSide: ts.Node = node.expression;
        while (leftSide != null) {
            if (leftSide.kind === SyntaxKind.current().CallExpression) {
                return <ts.CallExpression>leftSide;
            } else if (leftSide.kind === (SyntaxKind.current().PropertyAccessExpression)) {
                leftSide = (<ts.PropertyAccessExpression>leftSide).expression;
            } else {
                return null; // cannot walk any further left in the property expression
            }
        }
        return null;
    }
}
