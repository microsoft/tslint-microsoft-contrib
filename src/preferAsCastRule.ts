import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

const FAILURE_STRING: string = 'Found type-cast that does not use the as keyword. Please convert to an as-cast: ';

/**
 * Implementation of the prefer-as-cast rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferAsCastRuleWalker(sourceFile, this.getOptions()));
    }
}

class PreferAsCastRuleWalker extends ErrorTolerantWalker {

    protected visitTypeAssertionExpression(node: ts.TypeAssertion): void {
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText()));
        super.visitTypeAssertionExpression(node);
    }
}
