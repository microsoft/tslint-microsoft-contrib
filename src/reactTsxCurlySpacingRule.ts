import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import {SyntaxKind} from './utils/SyntaxKind';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * TSX curly spacing rule.
 *
 * Allows you to specify how spacing works around JSX Expressions.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-tsx-curly-spacing',
        type: 'style',
        description: 'Consistently use spaces around the brace characters of JSX attributes.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Whitespace'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new TsxCurlySpacingWalker(sourceFile, this.getOptions()));
    }
}

enum Spacing {
    always,
    never
}

class TsxCurlySpacingWalker extends Lint.RuleWalker {

    private spacing: Spacing;
    private allowMultiline: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        // default value is always
        this.spacing = options.ruleArguments[0] === 'never' ? Spacing.never : Spacing.always;
        // default value is to not allow multiline
        this.allowMultiline = false;
        if (options.ruleArguments[1] != null) {
            this.allowMultiline = !(options.ruleArguments[1].allowMultiline === false);
        }
    }

    public visitJsxExpression(node: ts.JsxExpression): void {
        const childrenCount: number = node.getChildCount();
        const first: ts.Node = node.getFirstToken(); // '{' sign
        const last: ts.Node = node.getLastToken(); // '}' sign
        const second: ts.Node = node.getChildAt(1); // after '{' sign
        const penultimate: ts.Node = node.getChildAt(childrenCount - 2); // before '}' sign
        this.validateBraceSpacing(node, first, second, first);
        this.validateBraceSpacing(node, penultimate, last, last);
    }

    protected visitNode(node: ts.Node): void {
        // This is hacked to visit JSX Expression. See https://github.com/palantir/tslint/pull/1292
        // newer versions of tslint have a public visitJsxExpression but older versions do not
        if (node.kind === SyntaxKind.current().JsxExpression) {
            this.visitJsxExpression(<ts.JsxExpression> node);
            this.walkChildren(node);
        } else {
            super.visitNode(node);
        }
    }

    private validateBraceSpacing(node: ts.Node, first: ts.Node, second: ts.Node, violationRoot: ts.Node): void {

        if (this.isMultiline(first, second)) {
            if (!this.allowMultiline) {
                this.reportFailure(node, violationRoot, this.getFailureForNewLine(first, violationRoot));
            }
        } else if (this.spacing === Spacing.always) {
            if (!this.isSpaceBetweenTokens(first, second)) {
                this.reportFailure(node, violationRoot, this.getFailureForSpace(first, violationRoot));
            }
        } else { // never space
            if (this.isSpaceBetweenTokens(first, second)) {
                this.reportFailure(node, violationRoot, this.getFailureForSpace(first, violationRoot));
            }
        }
    }

    private getFailureForSpace(first: ts.Node, violationRoot: ts.Node): string {
        if (this.spacing === Spacing.always) {
            if (first === violationRoot) {
                return `A space is required after '${violationRoot.getText()}'`;
            } else {
                return `A space is required before '${violationRoot.getText()}'`;
            }
        } else {
            if (first === violationRoot) {
                return `There should be no space after '${violationRoot.getText()}'`;
            } else {
                return `There should be no space before '${violationRoot.getText()}'`;
            }
        }
    }

    private getFailureForNewLine(first: ts.Node, violationRoot: ts.Node): string {
        if (first === violationRoot) {
            return `There should be no newline after '${violationRoot.getText()}'`;
        } else {
            return `There should be no newline before '${violationRoot.getText()}'`;
        }
    }

    private reportFailure(start: ts.Node, endNode: ts.Node, failure: string): void {
        this.addFailure(this.createFailure(start.getStart(), endNode.getStart() - start.getStart(), failure));
    }

    private isSpaceBetweenTokens(left: ts.Node, right: ts.Node): boolean {
        // Inspired from https://github.com/eslint/eslint/blob/master/lib/util/source-code.js#L296
        const text: string = this.getSourceFile().getText().slice(left.getEnd(), right.getStart());
        return /\s/.test(text.replace(/\/\*.*?\*\//g, ''));
    }

    private isMultiline(left: ts.Node, right: ts.Node): boolean {
        const sourceFile: ts.SourceFile = this.getSourceFile();
        const leftLine: number = sourceFile.getLineAndCharacterOfPosition(left.getStart()).line;
        const rightLine: number = sourceFile.getLineAndCharacterOfPosition(right.getStart()).line;
        return leftLine !== rightLine;
    }
}
