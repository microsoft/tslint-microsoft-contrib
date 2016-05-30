import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-for-in rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Do not use for in statements, use Object.keys instead: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoForInRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoForInRuleWalker extends ErrorTolerantWalker {
    protected visitForInStatement(node: ts.ForInStatement): void {
        let initializer: string = node.initializer.getText();
        let expression: string = node.expression.getText();

        let msg: string = Rule.FAILURE_STRING + 'for (' + initializer + ' in ' + expression + ')';
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), msg));
    }
}
