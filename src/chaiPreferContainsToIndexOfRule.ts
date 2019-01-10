import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ChaiUtils } from './utils/ChaiUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Found chai call with indexOf that can be converted to .contain assertion:';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'chai-prefer-contains-to-index-of',
        type: 'maintainability',
        description: 'Avoid Chai assertions that invoke indexOf and compare for a -1 result.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            if (ChaiUtils.isExpectInvocation(node)) {
                if (isFirstArgumentIndexOfResult(node)) {
                    if (tsutils.isPropertyAccessExpression(node.expression)) {
                        if (ChaiUtils.isEqualsInvocation(node.expression)) {
                            if (isFirstArgumentNegative1(node)) {
                                ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
                            }
                        }
                    }
                }
            }
        }
        return ts.forEachChild(node, cb);
    }

    function isFirstArgumentNegative1(node: ts.CallExpression): boolean {
        if (node.arguments && node.arguments.length > 0) {
            const firstArgument: ts.Expression = node.arguments[0];
            return firstArgument.getText() === '-1';
        }
        return false;
    }

    function isFirstArgumentIndexOfResult(node: ts.CallExpression): boolean {
        const expectCall = ChaiUtils.getLeftMostCallExpression(node);
        if (expectCall && expectCall.arguments && expectCall.arguments.length > 0) {
            const firstArgument: ts.Expression = expectCall.arguments[0];
            if (tsutils.isCallExpression(firstArgument)) {
                return AstUtils.getFunctionName(firstArgument) === 'indexOf';
            }
        }
        return false;
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
