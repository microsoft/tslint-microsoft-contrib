import * as ts from 'typescript';
import * as Lint from 'tslint';

import { forEachTokenWithTrivia } from 'tsutils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Replace block comment with a single-line comment';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-single-line-block-comment',
        type: 'maintainability',
        description: 'Avoid single line block comments; use single line comments instead',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Whitespace',
        commonWeaknessEnumeration: '710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        forEachTokenWithTrivia(node, (fullText, tokenSyntaxKind, range: ts.TextRange) => {
            const tokenText = fullText.substring(range.pos, range.end);
            if (
                tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia &&
                isSingleLineComment(tokenText) &&
                !isTsLintSuppression(tokenText) &&
                !isFollowedByMoreCodeOnSameLine(fullText, range)
            ) {
                ctx.addFailureAt(range.pos, range.end - range.pos, FAILURE_STRING);
            }
        });
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function isSingleLineComment(commentText: string): boolean {
        const lines: string[] = commentText.split(/\r?\n/);
        return lines.length === 1;
    }

    function isTsLintSuppression(commentText: string): boolean {
        return /\/*\s*tslint:(enable|disable):.*/.test(commentText);
    }

    function isFollowedByMoreCodeOnSameLine(fullText: string, range: ts.TextRange): boolean {
        const restOfText: string = fullText.substring(range.end);
        return /^\s*\r?\n/.test(restOfText) === false;
    }
}
