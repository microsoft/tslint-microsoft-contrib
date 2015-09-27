import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Forbidden http url in string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoHttpStringWalker(sourceFile, this.getOptions()));
    }
}

class NoHttpStringWalker extends ErrorTolerantWalker {

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.StringLiteral) {
            var stringText : string = (<ts.LiteralExpression>node).text;
            if (/.*http:.*/.test(stringText)) {
                var failureString = Rule.FAILURE_STRING + '\'' + stringText + '\'';
                var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                this.addFailure(failure);
            }
        }
        super.visitNode(node);
    }
}
