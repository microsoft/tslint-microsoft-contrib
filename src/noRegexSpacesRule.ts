import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-regex-spaces rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Spaces in regular expressions are hard to count. Use ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoRegexSpacesRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoRegexSpacesRuleWalker extends ErrorTolerantWalker {
    protected visitRegularExpressionLiteral(node: ts.Node): void {
        const match: RegExpExecArray = /( {2,})+?/.exec(node.getText());
        if (match != null) {
            const replacement: string = '{' + match[0].length + '}';
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + replacement));
        }

        super.visitRegularExpressionLiteral(node);
    }

}
