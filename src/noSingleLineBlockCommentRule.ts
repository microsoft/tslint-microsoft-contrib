import * as ts from 'typescript';
import * as Lint from 'tslint';

import {AstUtils} from './utils/AstUtils';
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

class NoSingleLineBlockCommentRuleWalker extends Lint.SkippableTokenAwareRuleWalker {

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

            if (scanner.getToken() === ts.SyntaxKind.MultiLineCommentTrivia) {
                const commentText: string = scanner.getTokenText();
                const startPosition: number = scanner.getTokenPos();

                if (this.isSingleLineComment(commentText)
                        && this.isNextTokenOnANewLine(scanner)
                        && this.isTsLintSuppression(commentText) === false) {
                    this.addFailure(this.createFailure(startPosition, commentText.length, FAILURE_STRING));
                }
            }
        });
    }

    private isNextTokenOnANewLine(scanner: ts.Scanner): boolean {
        return scanner.lookAhead((): boolean => {
            scanner.scan();  // scan the next token
            return scanner.hasPrecedingLineBreak(); // if the token is preceded by line break then it was on a new line
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
