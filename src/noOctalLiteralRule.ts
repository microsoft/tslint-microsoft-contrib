import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {SyntaxKind} from './utils/SyntaxKind';
import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';

/**
 * Implementation of the no-octal-literal rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Octal literals should not be used: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const noOctalLiteral = new NoOctalLiteral(sourceFile, this.getOptions());
        return this.applyWithWalker(noOctalLiteral);
    }
}

class NoOctalLiteral extends ErrorTolerantWalker {
    public visitNode(node: ts.Node) {
        if (node.kind === SyntaxKind.current().StringLiteral) {
            this.failOnOctalString(<ts.LiteralExpression>node);
        }
        super.visitNode(node);
    }

    private failOnOctalString(node: ts.LiteralExpression) {
        const match = /("|')(.*(\\-?[0-7]{1,3}(?![0-9])).*("|'))/g.exec(node.getText());

        if (match) {
            const octalValue : string = match[3]; // match[3] is the matched octal value.
            const startOfMatch = node.getStart() + node.getText().indexOf(octalValue);
            const width = octalValue.length;

            this.addFailure(this.createFailure(startOfMatch, width, Rule.FAILURE_STRING + octalValue));
        }
    }
}
