import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-invalid-regexp',
        type: 'maintainability',
        description: 'Do not use invalid regular expression strings in the RegExp constructor.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isNewExpression(node) || tsutils.isCallExpression(node)) {
            if (node.expression.getText() === 'RegExp' && node.arguments && node.arguments.length > 0) {
                const arg: ts.Expression = node.arguments[0];
                if (tsutils.isStringLiteral(arg)) {
                    try {
                        // tslint:disable-next-line:no-unused-expression
                        new RegExp(arg.text);
                    } catch (e) {
                        ctx.addFailureAt(arg.getStart(), arg.getWidth(), e.message);
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
