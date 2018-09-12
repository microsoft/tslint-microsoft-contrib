import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-backbone-get-set-outside-model rule.
 *
 * Currently only makes sure that get and set Backbone methods are called
 * on the this reference.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-backbone-get-set-outside-model',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Avoid using `model.get(\'x\')` and `model.set(\'x\', value)` Backbone accessors outside of the owning model.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public static GET_FAILURE_STRING: string = 'Backbone get() called outside of owning model: ';
    public static SET_FAILURE_STRING: string = 'Backbone set() called outside of owning model: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoBackboneGetSetOutsideModelRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoBackboneGetSetOutsideModelRuleWalker extends ErrorTolerantWalker {
    protected visitCallExpression(node: ts.CallExpression): void {
        if (AstUtils.getFunctionTarget(node) !== 'this') {
            const functionName: string = AstUtils.getFunctionName(node);
            if (functionName === 'get' && node.arguments.length === 1 && node.arguments[0].kind === ts.SyntaxKind.StringLiteral) {
                const msg: string = Rule.GET_FAILURE_STRING + node.getText();
                this.addFailureAt(node.getStart(), node.getEnd(), msg);
            }
            if (functionName === 'set' && node.arguments.length === 2 && node.arguments[0].kind === ts.SyntaxKind.StringLiteral) {
                const msg: string = Rule.SET_FAILURE_STRING + node.getText();
                this.addFailureAt(node.getStart(), node.getEnd(), msg);
            }
        }
        super.visitCallExpression(node);
    }
}
