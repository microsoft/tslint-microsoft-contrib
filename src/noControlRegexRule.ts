import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-control-regex',
        type: 'maintainability',
        description: 'Do not use control characters in regular expressions',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public static FAILURE_STRING: string = 'Unexpected control character in regular expression';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isNewExpression(node) || tsutils.isCallExpression(node)) {
            validateCall(node);
        }

        if (tsutils.isRegularExpressionLiteral(node)) {
            if (/(\\x[0-1][0-9a-f])/.test(node.getText())) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
            }
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    /* tslint:disable:no-control-regex */
    function validateCall(expression: ts.CallExpression | ts.NewExpression): void {
        if (expression.expression.getText() === 'RegExp' && expression.arguments && expression.arguments.length > 0) {
            const arg: ts.Expression = expression.arguments[0];
            if (tsutils.isStringLiteral(arg)) {
                const regexpText: string = arg.text;
                if (/[\x00-\x1f]/.test(regexpText)) {
                    ctx.addFailureAt(arg.getStart(), arg.getWidth(), Rule.FAILURE_STRING);
                }
            }
        }
    }
    /* tslint:enable:no-control-regex */
}
