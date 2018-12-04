import * as ts from 'typescript';
import * as Lint from 'tslint';

import { forEachTokenWithTrivia } from 'tsutils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Suspicious comment found: ';
const SUSPICIOUS_WORDS = ['BUG', 'HACK', 'FIXME', 'LATER', 'LATER2', 'TODO'];
const FAILURE_STRING_OPTION: string = 'To disable this warning, the comment should include one of the following regex: ';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-suspicious-comment',
        type: 'maintainability',
        description: `Do not use suspicious comments, such as ${SUSPICIOUS_WORDS.join(', ')}`,
        options: {
            type: 'array',
            items: {
                type: 'string'
            }
        },
        optionsDescription: `One argument may be optionally provided: \n\n' +
            '* an array of regex that disable the warning if one or several of them
            are found in the comment text. (Example: \`['https://github.com/my-org/my-project/*']\`)`,
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
    private readonly exceptionRegex: RegExp[] = [];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        if (options.ruleArguments !== undefined && options.ruleArguments.length > 0) {
            options.ruleArguments.forEach((regexStr: string) => {
                this.exceptionRegex.push(new RegExp(regexStr));
            });
        }
    }

    public visitSourceFile(node: ts.SourceFile) {
        forEachTokenWithTrivia(node, (text, tokenSyntaxKind, range) => {
            if (tokenSyntaxKind === ts.SyntaxKind.SingleLineCommentTrivia || tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                this.scanCommentForSuspiciousWords(range.pos, text.substring(range.pos, range.end));
            }
        });
    }

    private scanCommentForSuspiciousWords(startPosition: number, commentText: string): void {
        if (this.commentContainsExceptionRegex(this.exceptionRegex, commentText)) {
            return;
        }
        SUSPICIOUS_WORDS.forEach((suspiciousWord: string) => {
            this.scanCommentForSuspiciousWord(suspiciousWord, commentText, startPosition);
        });
    }

    private scanCommentForSuspiciousWord(suspiciousWord: string, commentText: string, startPosition: number) {
        const regexExactCaseNoColon = new RegExp('\\b' + suspiciousWord + '\\b');
        const regexCaseInsensistiveWithColon = new RegExp('\\b' + suspiciousWord + '\\b:', 'i');
        if (regexExactCaseNoColon.test(commentText) || regexCaseInsensistiveWithColon.test(commentText)) {
            this.foundSuspiciousComment(startPosition, commentText, suspiciousWord);
        }
    }

    private foundSuspiciousComment(startPosition: number, commentText: string, suspiciousWord: string) {
        let errorMessage: string = FAILURE_STRING + suspiciousWord;
        if (this.exceptionRegex.length > 0) {
            errorMessage += '. ' + this.getFailureMessageWithExceptionRegexOption();
        }
        this.addFailureAt(startPosition, commentText.length, errorMessage);
    }

    private commentContainsExceptionRegex(exceptionRegex: RegExp[], commentText: string): boolean {
        for (const regex of exceptionRegex) {
            if (regex.test(commentText)) {
                return true;
            }
        }
        return false;
    }

    private getFailureMessageWithExceptionRegexOption(): string {
        let message: string = FAILURE_STRING_OPTION;
        this.exceptionRegex.forEach((regex: RegExp) => {
            message += regex.toString();
        });
        return message;
    }
}
