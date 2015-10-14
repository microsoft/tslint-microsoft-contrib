import SyntaxKind = require('./SyntaxKind');
import ErrorTolerantWalker = require('./ErrorTolerantWalker');

/**
 * Implementation of the no-with-statement rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Forbidden with statement';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoWithStatementWalker(sourceFile, this.getOptions()));
    }
}

class NoWithStatementWalker extends ErrorTolerantWalker {

    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().WithStatement) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitNode(node);
    }
}
