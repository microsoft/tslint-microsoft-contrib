import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the mocha-avoid-only rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING_IT = 'Do not commit Mocha it.only function call';
    public static FAILURE_STRING_DESCRIBE = 'Do not commit Mocha describe.only function call';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MochaAvoidOnlyRuleWalker(sourceFile, this.getOptions()));
    }

}

class MochaAvoidOnlyRuleWalker extends ErrorTolerantWalker {

    protected visitCallExpression(node: ts.CallExpression): void {
        if (node.expression.kind === SyntaxKind.current().PropertyAccessExpression) {
            if (node.arguments.length === 2) {
                if (node.arguments[0].kind === SyntaxKind.current().StringLiteral) {
                    if (node.arguments[1].kind === SyntaxKind.current().FunctionExpression
                        || node.arguments[1].kind === SyntaxKind.current().ArrowFunction) {
                        if (node.expression.getText() === 'it.only') {
                            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_IT));
                        } else if (node.expression.getText() === 'describe.only') {
                            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING_DESCRIBE));
                        }
                    }
                }
            }
        }
        super.visitCallExpression(node);
    }
}
