import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { Utils } from './utils/Utils';

const EMPTY_TITLE_FAILURE_STRING: string = 'Title elements must not be empty';
const LONG_TITLE_FAILURE_STRING: string = 'Title length must not be longer than 60 characters';
const WORD_TITLE_FAILURE_STRING: string = 'Title must contain more than one word';
const MAX_TITLE_LENGTH: number = 60;

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-titles',
        type: 'functionality',
        description: 'For accessibility of your website, HTML title elements must be concise and non-empty.',
        rationale: `References:
        <ul>
          <li><a href="http://www.w3.org/TR/WCAG20/#navigation-mechanisms-title">WCAG 2.0 - Requirement 2.4.2 Page Titled (Level A)</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/13">OAA-Accessibility Rule 13: Title element should not be empty</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/24">OAA-Accessibility Rule 24: Title content should be concise</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/25">OAA-Accessibility Rule 25: Title text must contain more than one word</a></li>
        </ul>`,
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithFunction(sourceFile, walk);
        } else {
            return [];
        }
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function validateTitleText(text: string, titleNode: ts.Node): void {
        if (text.length > MAX_TITLE_LENGTH) {
            ctx.addFailureAt(titleNode.getStart(), titleNode.getWidth(), LONG_TITLE_FAILURE_STRING + ': ' + Utils.trimTo(text, 20));
        } else if (!(text.indexOf(' ') > 0)) {
            ctx.addFailureAt(titleNode.getStart(), titleNode.getWidth(), WORD_TITLE_FAILURE_STRING + ': ' + Utils.trimTo(text, 20));
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node)) {
            if (node.tagName.getText() === 'title') {
                ctx.addFailureAt(node.getStart(), node.getWidth(), EMPTY_TITLE_FAILURE_STRING);
            }
        } else if (tsutils.isJsxElement(node)) {
            if (node.openingElement.tagName.getText() === 'title') {
                if (node.children.length === 0) {
                    ctx.addFailureAt(node.getStart(), node.getWidth(), EMPTY_TITLE_FAILURE_STRING);
                } else if (node.children.length === 1) {
                    if (node.children[0].kind === ts.SyntaxKind.JsxText) {
                        const value: ts.JsxText = <ts.JsxText>node.children[0];
                        validateTitleText(value.getText(), node);
                    } else if (node.children[0].kind === ts.SyntaxKind.JsxExpression) {
                        const exp: ts.JsxExpression = <ts.JsxExpression>node.children[0];
                        if (exp.expression !== undefined && exp.expression.kind === ts.SyntaxKind.StringLiteral) {
                            validateTitleText((<ts.StringLiteral>exp.expression).text, node);
                        }
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
