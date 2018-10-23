import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {forEachTokenWithTrivia} from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-empty-line-after-opening-brace',
        type: 'maintainability',
        description: 'Avoid an empty line after an opening brace',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Whitespace',
        recommendation: 'false,',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING: string = 'Opening brace cannot be followed by empty line';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoEmptyLineAfterOpeningBraceWalker(sourceFile, this.getOptions()));
    }
}

class NoEmptyLineAfterOpeningBraceWalker extends ErrorTolerantWalker {
    private scanner: ts.Scanner;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.scanner = ts.createScanner(1, false, 0, sourceFile.text);
    }

    public visitSourceFile(node: ts.SourceFile): void {
        this.scanAllTokens(node);
        super.visitSourceFile(node);
    }

    private scanAllTokens(node: ts.SourceFile): void {
        this.scanner.setTextPos(0);
        let previous: ts.SyntaxKind;
        let previousPrevious: ts.SyntaxKind;

        forEachTokenWithTrivia(node, ({}, tokenSyntaxKind, range) => {
            if (previousPrevious === ts.SyntaxKind.OpenBraceToken &&
                previous === ts.SyntaxKind.NewLineTrivia &&
                tokenSyntaxKind === ts.SyntaxKind.NewLineTrivia) {

                this.addFailureAt(range.pos, 1, Rule.FAILURE_STRING);
            }

            //ignore empty spaces
            if (tokenSyntaxKind !== ts.SyntaxKind.WhitespaceTrivia) {
                previousPrevious = previous;
                previous = tokenSyntaxKind;
            }
        });
    }
}