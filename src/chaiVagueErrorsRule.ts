import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ChaiUtils } from './utils/ChaiUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const BASE_ERROR: string = 'Found chai call with vague failure message. ';
const FAILURE_STRING: string = BASE_ERROR + 'Please add an explicit failure message';
const FAILURE_STRING_COMPARE_TRUE: string =
    BASE_ERROR + 'Move the strict equality comparison from the expect call into the assertion value.';
const FAILURE_STRING_COMPARE_FALSE: string =
    BASE_ERROR + 'Move the strict inequality comparison from the expect call into the assertion value';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'chai-vague-errors',
        type: 'maintainability',
        description: 'Avoid Chai assertions that result in vague errors',
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
        if (tsutils.isPropertyAccessExpression(node)) {
            if (ChaiUtils.isExpectInvocation(node)) {
                if (/ok|true|false|undefined|null/.test(node.name.getText())) {
                    const expectInvocation = ChaiUtils.getExpectInvocation(node);
                    if (!expectInvocation || expectInvocation.arguments.length !== 2) {
                        ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
                    }
                }
            }
        }

        if (tsutils.isCallExpression(node)) {
            if (ChaiUtils.isExpectInvocation(node)) {
                if (tsutils.isPropertyAccessExpression(node.expression)) {
                    if (ChaiUtils.isEqualsInvocation(node.expression)) {
                        if (node.arguments.length === 1) {
                            if (/true|false|null|undefined/.test(node.arguments[0].getText())) {
                                ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
                            }
                        }
                    }
                }

                const actualValue = ChaiUtils.getFirstExpectCallParameter(node);
                if (actualValue && tsutils.isBinaryExpression(actualValue)) {
                    const expectedValue = ChaiUtils.getFirstExpectationParameter(node);
                    if (expectedValue) {
                        const operator: string = actualValue.operatorToken.getText();
                        const expectingBooleanKeyword: boolean =
                            expectedValue.kind === ts.SyntaxKind.TrueKeyword || expectedValue.kind === ts.SyntaxKind.FalseKeyword;

                        if (operator === '===' && expectingBooleanKeyword) {
                            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING_COMPARE_TRUE);
                        } else if (operator === '!==' && expectingBooleanKeyword) {
                            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING_COMPARE_FALSE);
                        }
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
