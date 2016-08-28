import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';
import {AstUtils} from './utils/AstUtils';

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

class NoSuspiciousCommentRuleWalker extends Lint.SkippableTokenAwareRuleWalker {

    public visitSourceFile(node: ts.SourceFile) {
        const scanner: ts.Scanner = ts.createScanner(
            ts.ScriptTarget.ES5,
            false,  // do not skip comments
            AstUtils.getLanguageVariant(node),
            node.text
        );
        Lint.scanAllTokens(scanner, (scanner: ts.Scanner): void => {
            const startPos = scanner.getStartPos();
            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                return;
            }

            if (scanner.getToken() === SyntaxKind.current().SingleLineCommentTrivia ||
                scanner.getToken() === SyntaxKind.current().MultiLineCommentTrivia) {
                const commentText: string = scanner.getTokenText();
                const startPosition: number = scanner.getTokenPos();

                this.scanCommentForSuspiciousWords(startPosition, commentText);
            }
        });
        super.visitSourceFile(node);
    }

    private scanCommentForSuspiciousWords(startPosition: number, commentText: string): void {
        SUSPICIOUS_WORDS.forEach((suspiciousWord: string) => {
            this.scanCommentForSuspiciousWord(suspiciousWord, commentText, startPosition);
        });
    }

    private scanCommentForSuspiciousWord(suspiciousWord: string, commentText: string, startPosition: number) {
        const regexNoColon = new RegExp('\\b' + suspiciousWord + '\\b');
        const regexColonIgnorCase = new RegExp('\\b' + suspiciousWord + '\\b\:', 'i');
        if (regexNoColon.test(commentText) || regexColonIgnorCase.test(commentText)) {
            this.foundSuspiciousComment(startPosition, commentText, suspiciousWord);
        }
    }

    private foundSuspiciousComment(startPosition: number, commentText: string, suspiciousWord: string) {
        const errorMessage: string = FAILURE_STRING + suspiciousWord;
        this.addFailure(this.createFailure(startPosition, commentText.length, errorMessage));
    }
}
