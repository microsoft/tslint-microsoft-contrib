import * as ts from 'typescript';
import * as Lint from 'tslint';

import { forEachTokenWithTrivia } from 'tsutils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

interface Options {
    exceptionRegex: RegExp[];
}

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
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.getOptions()));
    }
}

function parseOptions(options: Lint.IOptions): Options {
    const value: RegExp[] = [];

    (options.ruleArguments || []).forEach((regexStr: string) => {
        value.push(new RegExp(regexStr));
    });

    return {
        exceptionRegex: value
    };
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { exceptionRegex } = ctx.options;

    function cb(node: ts.Node): void {
        forEachTokenWithTrivia(node, (text, tokenSyntaxKind, range) => {
            if (tokenSyntaxKind === ts.SyntaxKind.SingleLineCommentTrivia || tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                scanCommentForSuspiciousWords(range.pos, text.substring(range.pos, range.end));
            }
        });
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function scanCommentForSuspiciousWords(startPosition: number, commentText: string): void {
        if (commentContainsExceptionRegex(exceptionRegex, commentText)) {
            return;
        }
        SUSPICIOUS_WORDS.forEach((suspiciousWord: string) => {
            scanCommentForSuspiciousWord(suspiciousWord, commentText, startPosition);
        });
    }

    function scanCommentForSuspiciousWord(suspiciousWord: string, commentText: string, startPosition: number) {
        const regexExactCaseNoColon = new RegExp('\\b' + suspiciousWord + '\\b');
        const regexCaseInsensistiveWithColon = new RegExp('\\b' + suspiciousWord + '\\b:', 'i');
        if (regexExactCaseNoColon.test(commentText) || regexCaseInsensistiveWithColon.test(commentText)) {
            foundSuspiciousComment(startPosition, commentText, suspiciousWord);
        }
    }

    function foundSuspiciousComment(startPosition: number, commentText: string, suspiciousWord: string) {
        let errorMessage: string = FAILURE_STRING + suspiciousWord;
        if (exceptionRegex.length > 0) {
            errorMessage += '. ' + getFailureMessageWithExceptionRegexOption();
        }
        ctx.addFailureAt(startPosition, commentText.length, errorMessage);
    }

    function commentContainsExceptionRegex(exceptionRegexes: RegExp[], commentText: string): boolean {
        for (const regex of exceptionRegexes) {
            if (regex.test(commentText)) {
                return true;
            }
        }
        return false;
    }

    function getFailureMessageWithExceptionRegexOption(): string {
        let message: string = FAILURE_STRING_OPTION;
        exceptionRegex.forEach((regex: RegExp) => {
            message += regex.toString();
        });
        return message;
    }
}
