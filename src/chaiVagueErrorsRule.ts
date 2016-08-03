import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {ChaiUtils} from './utils/ChaiUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the chai-vague-errors rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'chai-vague-errors',
        type: 'maintainability',
        description: 'Avoid Chai assertions that result in vague errors',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING = 'Found chai call with vague failure message. Please add an explicit failure message';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ChaiVagueErrorsRuleWalker(sourceFile, this.getOptions()));
    }
}

class ChaiVagueErrorsRuleWalker extends ErrorTolerantWalker {
    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        if (ChaiUtils.isExpectInvocation(node)) {
            if (/ok|true|false|undefined|null/.test(node.name.getText())) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        super.visitPropertyAccessExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        if (ChaiUtils.isExpectInvocation(node)) {
            if (node.expression.kind === SyntaxKind.current().PropertyAccessExpression) {
                if (ChaiUtils.isEqualsInvocation(<ts.PropertyAccessExpression>node.expression)) {
                    if (node.arguments.length === 1) {
                        if (/true|false|null|undefined/.test(node.arguments[0].getText())) {
                            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                        }
                    }
                }
            }
        }
        super.visitCallExpression(node);
    }
}
