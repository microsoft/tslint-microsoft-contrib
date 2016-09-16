import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';
import {Utils} from './utils/Utils';

const FAILURE_STRING: string = 'Possible timing attack detected. Direct comparison found: ';
const SENSITIVE_VAR_NAME: RegExp = /^(password|secret|api|apiKey|token|auth|pass|hash)$/im;

/**
 * Implementation of the possible-timing-attack rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'possible-timing-attack',
        type: 'functionality',
        description: 'Avoid timing attacks by not making direct comaprisons to sensitive data',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Security',
        commonWeaknessEnumeration: '710,749'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PossibleTimingAttackRuleWalker(sourceFile, this.getOptions()));
    }
}

class PossibleTimingAttackRuleWalker extends ErrorTolerantWalker {

    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if (node.operatorToken.kind === SyntaxKind.current().EqualsEqualsToken
            || node.operatorToken.kind === SyntaxKind.current().EqualsEqualsEqualsToken
            || node.operatorToken.kind === SyntaxKind.current().ExclamationEqualsToken
            || node.operatorToken.kind === SyntaxKind.current().ExclamationEqualsEqualsToken) {

            if (SENSITIVE_VAR_NAME.test(node.left.getText()) || SENSITIVE_VAR_NAME.test(node.right.getText())) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + Utils.trimTo(node.getText(), 20)));
            } else {
                super.visitBinaryExpression(node);
            }
        } else {
            // be sure not to post duplicate errors
            super.visitBinaryExpression(node);
        }
    }
}
