import SyntaxKind = require('./SyntaxKind');
import ErrorTolerantWalker = require('./ErrorTolerantWalker');

/**
 * Implementation of the prefer-array-literal rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Replace generic-typed Array with array literal: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoGenericArrayWalker(sourceFile, this.getOptions()));
    }
}

class NoGenericArrayWalker extends ErrorTolerantWalker {

    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().TypeReference) {
            let ref : ts.TypeReferenceNode = <ts.TypeReferenceNode>node;
            if ((<ts.Identifier>ref.typeName).text === 'Array') {
                var failureString = Rule.FAILURE_STRING + node.getText();
                var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                this.addFailure(failure);
            }
        }
        super.visitNode(node);
    }
}
