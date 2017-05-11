import * as ts from 'typescript';
import * as Lint from 'tslint';

import {forEachTokenWithTrivia} from 'tsutils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Replace block comment with a single-line comment';

/**
 * Implementation of the no-single-line-block-comment rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-single-line-block-comment',
        type: 'maintainability',
        description: 'Avoid single line block comments; use single line comments instead',
        options: null,
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
        return this.applyWithWalker(new NoSingleLineBlockCommentRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoSingleLineBlockCommentRuleWalker extends Lint.RuleWalker {

    public visitSourceFile(node: ts.SourceFile) {
        forEachTokenWithTrivia(node, (fullText, tokenSyntaxKind, range) => {
            const tokenText = fullText.substring(range.pos, range.end);
            if (tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia
                           && this.isSingleLineComment(tokenText)
                           && !this.isTsLintSuppression(tokenText)) {
                this.addFailureAt(range.pos, range.end - range.pos, FAILURE_STRING);
            }
        });
    }

    private isSingleLineComment(commentText: string): boolean {
        const lines: string[] = commentText.split(/\r?\n/);
        return lines.length === 1;
    }

    private isTsLintSuppression(commentText: string): boolean {
        return /\/*\s*tslint:(enable|disable):.*/.test(commentText);
    }
}
