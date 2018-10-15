import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ErrorTolerantWalker } from './utils/ErrorTolerantWalker';
import { ChaiUtils } from './utils/ChaiUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const BASE_ERROR: string = 'Found chai call with vague failure message. ';
const FAILURE_STRING: string = BASE_ERROR + 'Please add an explicit failure message';
const FAILURE_STRING_COMPARE_TRUE: string = BASE_ERROR + 'Move the strict equality comparison from the expect ' +
    'call into the assertion value';
const FAILURE_STRING_COMPARE_FALSE: string = BASE_ERROR + 'Move the strict inequality comparison from the expect ' +
    'call into the assertion value. ';

/**
 * Implementation of the chai-vague-errors rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'chai-vague-errors',
        type: 'maintainability',
        description: 'Avoid Chai assertions that result in vague errors',
        options: undefined,
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
        return this.applyWithWalker(new ChaiVagueErrorsRuleWalker(sourceFile, this.getOptions()));
    }
}

class ChaiVagueErrorsRuleWalker extends ErrorTolerantWalker {
    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        if (ChaiUtils.isExpectInvocation(node)) {
            if (/ok|true|false|undefined|null/.test(node.name.getText())) {
                const expectInvocation = ChaiUtils.getExpectInvocation(node);
                if (!expectInvocation || expectInvocation.arguments.length !== 2) {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
                }
            }
        }
        super.visitPropertyAccessExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        if (ChaiUtils.isExpectInvocation(node)) {
            if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                if (ChaiUtils.isEqualsInvocation(<ts.PropertyAccessExpression>node.expression)) {
                    if (node.arguments.length === 1) {
                        if (/true|false|null|undefined/.test(node.arguments[0].getText())) {
                            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
                        }
                    }
                }
            }

            const actualValue = ChaiUtils.getFirstExpectCallParameter(node);
            if (actualValue !== undefined && actualValue.kind === ts.SyntaxKind.BinaryExpression) {
                const expectedValue = ChaiUtils.getFirstExpectationParameter(node);
                if (expectedValue !== undefined) {
                    const binaryExpression: ts.BinaryExpression = <ts.BinaryExpression>actualValue;
                    const operator: string = binaryExpression.operatorToken.getText();
                    const expectingBooleanKeyword: boolean = expectedValue.kind === ts.SyntaxKind.TrueKeyword
                        || expectedValue.kind === ts.SyntaxKind.FalseKeyword;

                    if (operator === '===' && expectingBooleanKeyword) {
                        this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING_COMPARE_TRUE);
                    } else if (operator === '!==' && expectingBooleanKeyword) {
                        this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING_COMPARE_FALSE);
                    }
                }
            }
        }
        super.visitCallExpression(node);
    }
}
