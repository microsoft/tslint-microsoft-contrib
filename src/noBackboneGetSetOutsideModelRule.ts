import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import SyntaxKind = require('./utils/SyntaxKind');
import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import AstUtils = require('./utils/AstUtils');

/**
 * Implementation of the no-backbone-get-set-outside-model rule.
 *
 * Currently only makes sure that get and set Backbone methods are called
 * on the this reference.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static GET_FAILURE_STRING = 'Backbone get() called outside of owning model: ';
    public static SET_FAILURE_STRING = 'Backbone set() called outside of owning model: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoBackboneGetSetOutsideModelRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoBackboneGetSetOutsideModelRuleWalker extends ErrorTolerantWalker {

    protected visitCallExpression(node: ts.CallExpression): void {
        if (AstUtils.getFunctionTarget(node) !== 'this') {
            let functionName: string = AstUtils.getFunctionName(node);
            if (functionName === 'get' && node.arguments.length === 1 && node.arguments[0].kind === SyntaxKind.current().StringLiteral) {
                var msg: string = Rule.GET_FAILURE_STRING + node.getText();
                this.addFailure(this.createFailure(node.getStart(), node.getEnd(), msg));
            }
            if (functionName === 'set' && node.arguments.length === 2 && node.arguments[0].kind === SyntaxKind.current().StringLiteral) {
                var msg: string = Rule.SET_FAILURE_STRING + node.getText();
                this.addFailure(this.createFailure(node.getStart(), node.getEnd(), msg));
            }
        }
        super.visitCallExpression(node);
    }
}
