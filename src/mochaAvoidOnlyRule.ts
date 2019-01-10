import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { MochaUtils } from './utils/MochaUtils';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'mocha-avoid-only',
        type: 'maintainability',
        description: "Do not invoke Mocha's describe.only, it.only or context.only functions.",
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public static FAILURE_STRING_IT: string = 'Do not commit Mocha it.only function call';
    public static FAILURE_STRING_SPECIFY: string = 'Do not commit Mocha specify.only function call';
    public static FAILURE_STRING_DESCRIBE: string = 'Do not commit Mocha describe.only function call';
    public static FAILURE_STRING_CONTEXT: string = 'Do not commit Mocha context.only function call';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            if (tsutils.isPropertyAccessExpression(node.expression)) {
                if (node.arguments.length === 2) {
                    if (tsutils.isStringLiteral(node.arguments[0])) {
                        if (tsutils.isFunctionExpression(node.arguments[1]) || tsutils.isArrowFunction(node.arguments[1])) {
                            const text = node.expression.getText();
                            switch (text) {
                                case 'it.only':
                                    ctx.addFailureAt(node.getStart(), text.length, Rule.FAILURE_STRING_IT);
                                    break;

                                case 'specify.only':
                                    ctx.addFailureAt(node.getStart(), text.length, Rule.FAILURE_STRING_SPECIFY);
                                    break;

                                case 'describe.only':
                                    ctx.addFailureAt(node.getStart(), text.length, Rule.FAILURE_STRING_DESCRIBE);
                                    break;

                                case 'context.only':
                                    ctx.addFailureAt(node.getStart(), text.length, Rule.FAILURE_STRING_CONTEXT);
                                    break;

                                default: // required per tslint rules for switch statements.
                            }
                        }
                    }
                }
            }
        }
        return ts.forEachChild(node, cb);
    }

    if (MochaUtils.isMochaTest(ctx.sourceFile)) {
        return ts.forEachChild(ctx.sourceFile, cb);
    }
}
