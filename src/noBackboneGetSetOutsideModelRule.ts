import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-backbone-get-set-outside-model',
        type: 'maintainability',
        description: "Avoid using `model.get('x')` and `model.set('x', value)` Backbone accessors outside of the owning model.",
        options: null, // tslint:disable-line:no-null-keyword
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
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            if (AstUtils.getFunctionTarget(node) !== 'this') {
                const functionName: string = AstUtils.getFunctionName(node);

                if (functionName === 'get' && node.arguments.length === 1 && tsutils.isStringLiteral(node.arguments[0])) {
                    const msg: string = Rule.GET_FAILURE_STRING + node.getText();
                    ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
                }

                if (functionName === 'set' && node.arguments.length === 2 && tsutils.isStringLiteral(node.arguments[0])) {
                    const msg: string = Rule.SET_FAILURE_STRING + node.getText();
                    ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
                }
            }
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
