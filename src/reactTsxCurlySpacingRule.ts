import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

enum Spacing {
    always,
    never
}

interface Options {
    spacing: Spacing;
    allowMultiline: boolean;
}

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
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        recommendation: 'false',
        group: 'Deprecated'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        const parsed: Options = {
            spacing: Spacing.always,
            allowMultiline: false
        };

        if (options.ruleArguments[0] === 'never') {
            parsed.spacing = Spacing.never;
        }

        if (options.ruleArguments[1] !== undefined) {
            parsed.allowMultiline = options.ruleArguments[1].allowMultiline !== false;
        }

        return parsed;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    function validateBraceSpacing(
        node: ts.Node,
        first: ts.Node | undefined,
        second: ts.Node | undefined,
        violationRoot: ts.Node | undefined
    ): void {
        if (first === undefined || second === undefined || violationRoot === undefined) {
            return;
        }

        if (isMultiline(first, second)) {
            if (!ctx.options.allowMultiline) {
                reportFailure(node, violationRoot, getFailureForNewLine(first, violationRoot));
            }
        } else if (ctx.options.spacing === Spacing.always) {
            if (!isSpaceBetweenTokens(first, second)) {
                reportFailure(node, violationRoot, getFailureForSpace(first, violationRoot));
            }
        } else {
            // never space
            if (isSpaceBetweenTokens(first, second)) {
                reportFailure(node, violationRoot, getFailureForSpace(first, violationRoot));
            }
        }
    }

    function getFailureForSpace(first: ts.Node, violationRoot: ts.Node): string {
        if (ctx.options.spacing === Spacing.always) {
            if (first === violationRoot) {
                return `A space is required after '${violationRoot.getText()}'`;
            }

            return `A space is required before '${violationRoot.getText()}'`;
        }

        if (first === violationRoot) {
            return `There should be no space after '${violationRoot.getText()}'`;
        }

        return `There should be no space before '${violationRoot.getText()}'`;
    }

    function getFailureForNewLine(first: ts.Node, violationRoot: ts.Node): string {
        if (first === violationRoot) {
            return `There should be no newline after '${violationRoot.getText()}'`;
        }

        return `There should be no newline before '${violationRoot.getText()}'`;
    }

    function reportFailure(start: ts.Node, endNode: ts.Node, failure: string): void {
        ctx.addFailureAt(start.getStart(), endNode.getStart() - start.getStart(), failure);
    }

    function isSpaceBetweenTokens(left: ts.Node, right: ts.Node): boolean {
        // Inspired from https://github.com/eslint/eslint/blob/master/lib/util/source-code.js#L296
        const text: string = ctx.sourceFile.getText().slice(left.getEnd(), right.getStart());
        return /\s/.test(text.replace(/\/\*.*?\*\//g, ''));
    }

    function isMultiline(left: ts.Node, right: ts.Node): boolean {
        const sourceFile: ts.SourceFile = ctx.sourceFile;
        const leftLine: number = sourceFile.getLineAndCharacterOfPosition(left.getStart()).line;
        const rightLine: number = sourceFile.getLineAndCharacterOfPosition(right.getStart()).line;
        return leftLine !== rightLine;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxExpression(node)) {
            const childrenCount: number = node.getChildCount();

            if (childrenCount > 2) {
                // not empty code block (eg. only comments)
                const first = node.getFirstToken(); // '{' sign
                const last = node.getLastToken(); // '}' sign
                const second: ts.Node = node.getChildAt(1); // after '{' sign
                const penultimate: ts.Node = node.getChildAt(childrenCount - 2); // before '}' sign
                validateBraceSpacing(node, first, second, first);
                validateBraceSpacing(node, penultimate, last, last);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
