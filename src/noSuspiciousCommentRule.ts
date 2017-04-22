import * as ts from 'typescript';
import * as Lint from 'tslint';

import {forEachTokenWithTrivia} from 'tsutils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Suspicious comment found: ';
const SUSPICIOUS_WORDS = ['BUG', 'HACK', 'FIXME', 'LATER', 'LATER2', 'TODO'];

/**
 * Implementation of the no-suspicious-comment rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-suspicious-comment',
        type: 'maintainability',
        description: 'Do not use suspicious comments, such as BUG, HACK, FIXME, LATER, LATER2, TODO',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '546'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSuspiciousCommentRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoSuspiciousCommentRuleWalker extends Lint.RuleWalker {

    public visitSourceFile(node: ts.SourceFile) {
        forEachTokenWithTrivia(node, (text, tokenSyntaxKind, range) => {
            if (tokenSyntaxKind === ts.SyntaxKind.SingleLineCommentTrivia ||
                tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                this.scanCommentForSuspiciousWords(range.pos, text.substring(range.pos, range.end));
            }
        });
    }

    private scanCommentForSuspiciousWords(startPosition: number, commentText: string): void {
        SUSPICIOUS_WORDS.forEach((suspiciousWord: string) => {
            this.scanCommentForSuspiciousWord(suspiciousWord, commentText, startPosition);
        });
    }

    private scanCommentForSuspiciousWord(suspiciousWord: string, commentText: string, startPosition: number) {
        const regexExactCaseNoColon = new RegExp('\\b' + suspiciousWord + '\\b');
        const regexCaseInsensistiveWithColon = new RegExp('\\b' + suspiciousWord + '\\b\:', 'i');
        if (regexExactCaseNoColon.test(commentText) || regexCaseInsensistiveWithColon.test(commentText)) {
            this.foundSuspiciousComment(startPosition, commentText, suspiciousWord);
        }
    }

    private foundSuspiciousComment(startPosition: number, commentText: string, suspiciousWord: string) {
        const errorMessage: string = FAILURE_STRING + suspiciousWord;
        this.addFailure(this.createFailure(startPosition, commentText.length, errorMessage));
    }
}
