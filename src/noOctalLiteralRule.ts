export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "octal literals should not be used: ";

    public apply(sourceFile): Lint.RuleFailure[] {
        const noOctalLiteral = new NoOctalLiteral(sourceFile, this.getOptions());
        return this.applyWithWalker(noOctalLiteral);
    }
}

class NoOctalLiteral extends Lint.RuleWalker {

    public visitNode(node: ts.Node) {
        this.handleNode(node);
        super.visitNode(node);
    }

    private handleNode(node: ts.Node) {

        if (node.kind === ts.SyntaxKind.SourceFile) {
            const text: string = node.getText();

            // Note: regex also matches commented code.
            // Match: backslash(\), optional minus sign, then 1 to 3 numbers in range 0 to 7, followed by
            // something that is not a number.
            this.matchRegexAndFail(text, /(".*(\\-?[0-7]{1,3}(?![0-9])).*")/g);
            // same match for single quotes
            this.matchRegexAndFail(text, /('.*(\\-?[0-7]{1,3}(?![0-9])).*')/g);
        }

    }

    private matchRegexAndFail(text: string, regex: RegExp) {
        let match;
        while (match = regex.exec(text)) {
            // match[1] is the entire text. Note that if there are multiple occurances of this match
            // only the first one will be reported.
            var startOfMatch = text.indexOf(match[1]);

            let failure: Lint.RuleFailure;
            // match[2] is the matched octal value.
            failure = this.createFailure(startOfMatch, match[2].length, Rule.FAILURE_STRING + match[2]);
            if (failure != null) {
                this.addFailure(failure);
            }
        }
    }
}
