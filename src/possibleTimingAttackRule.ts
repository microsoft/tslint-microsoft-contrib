import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {Utils} from './utils/Utils';

const FAILURE_STRING: string = 'Possible timing attack detected. Direct comparison found: ';
const SENSITIVE_VAR_NAME: RegExp = /^(password|secret|api|apiKey|token|auth|pass|hash)$/im;

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'possible-timing-attack',
        type: 'functionality',
        description: 'Avoid timing attacks by not making direct comaprisons to sensitive data',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
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

class PossibleTimingAttackRuleWalker extends Lint.RuleWalker {

    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if (node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken
            || node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken
            || node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken
            || node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken) {

            if ((SENSITIVE_VAR_NAME.test(node.left.getText()) || SENSITIVE_VAR_NAME.test(node.right.getText()))
                && node.left.getText() !== 'null' && node.right.getText() !== 'null'
                && node.left.getText() !== 'undefined' && node.right.getText() !== 'undefined') {
                this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + Utils.trimTo(node.getText(), 20));
            } else {
                super.visitBinaryExpression(node);
            }
        } else {
            // be sure not to post duplicate errors
            super.visitBinaryExpression(node);
        }
    }
}
