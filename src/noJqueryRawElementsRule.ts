import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING_MANIPULATION: string = 'Replace HTML string manipulation with jQuery API: ';
const FAILURE_STRING_COMPLEX: string = 'Replace complex HTML strings with jQuery API: ';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-jquery-raw-elements',
        type: 'maintainability',
        description: 'Do not create HTML elements using JQuery and string concatenation. It is error prone and can hide subtle defects.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function isComplexHtmlElement(literal: ts.StringLiteral): boolean {
        const text: string = literal.text.trim();
        if (/^<.*>$/.test(text) === false) {
            // element does not look like an html tag
            return false;
        }

        if (/^<[A-Za-z]+\s*\/?>$/.test(text) === true) {
            // element looks like a simple self-closing tag or a simple opening tag
            return false;
        }

        if (/^<[A-Za-z]+\s*>\s*<\/[A-Za-z]+\s*>$/m.test(text) === true) {
            // element looks like a simple open and closed tag
            return false;
        }

        const match = text.match(/^<[A-Za-z]+\s*>(.*)<\/[A-Za-z]+\s*>$/m);
        if (match !== null && match[1] !== undefined) {
            const enclosedContent: string = match[1]; // get the stuff inside the tag
            if (enclosedContent.indexOf('<') === -1 && enclosedContent.indexOf('>') === -1) {
                return false; // enclosed content looks like it contains no html elements
            }
        }
        return true;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            const functionName: string = AstUtils.getFunctionName(node);
            if (AstUtils.isJQuery(functionName) && node.arguments.length > 0) {
                const firstArg: ts.Expression = node.arguments[0];
                if (tsutils.isStringLiteral(firstArg)) {
                    if (isComplexHtmlElement(<ts.StringLiteral>firstArg)) {
                        ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING_COMPLEX + node.getText());
                    }
                } else {
                    htmlLikeStringLiteralFinder(ctx, node);
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}

function htmlLikeStringLiteralFinder(ctx: Lint.WalkContext<void>, expr: ts.CallExpression) {
    const node = expr.arguments[0];
    const textExpr = node.getText();
    if (textExpr.indexOf('<') > -1 || textExpr.indexOf('>') > -1) {
        ctx.addFailureAt(expr.getStart(), expr.getWidth(), FAILURE_STRING_MANIPULATION + expr.getText());
    }
}
