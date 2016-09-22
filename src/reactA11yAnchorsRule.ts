/// <reference path="../typings/underscore.d.ts" />

import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import * as _ from 'underscore';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';

const NO_HASH_FAILURE_STRING: string =
    'Do not use # as anchor href.';
const LINK_TEXT_TOO_SHORT_FAILURE_STRING: string =
    'Link text should be at least 4 characters long.';
const UNIQUE_ALT_FAILURE_STRING: string =
    'Links with images and text content, the alt attribute should be unique to the text content or empty.';
const SAME_HREF_SAME_TEXT_FAILURE_STRING: string =
    'Links with the same HREF should have the same link text.';
const DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING: string =
    'Links that point to different HREFs should have different link text.';

/**
 * Implementation of the react-a11y-anchors rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-anchors',
        type: 'functionality',
        description: 'For accessibility of your website, anchor elements must have a href different from # and a text longer than 4.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            const rule: ReactA11yAnchorsRuleWalker = new ReactA11yAnchorsRuleWalker(sourceFile, this.getOptions());
            this.applyWithWalker(rule);
            rule.validateAllAnchors();

            return rule.getFailures();
        }

        return [];
    }
}

class ReactA11yAnchorsRuleWalker extends ErrorTolerantWalker {

    private anchorInfoList: AnchorInfo[] = [];

    public validateAllAnchors(): void {
        const sameHrefDifferentTexts: AnchorInfo[] = [];
        const differentHrefSameText: AnchorInfo[] = [];

        while (_(this.anchorInfoList).isEmpty() === false) {
            const current: AnchorInfo = this.anchorInfoList.shift();
            this.anchorInfoList.forEach((anchorInfo: AnchorInfo): void => {
                if (current.href === anchorInfo.href &&
                    current.text !== anchorInfo.text &&
                    !_(sameHrefDifferentTexts).include(anchorInfo)) {

                    // Same href - different text...
                    sameHrefDifferentTexts.push(anchorInfo);
                    this.addFailure(this.createFailure(anchorInfo.start, anchorInfo.width,
                        SAME_HREF_SAME_TEXT_FAILURE_STRING + this.firstPosition(current)));
                }

                if (current.href !== anchorInfo.href &&
                    current.text === anchorInfo.text &&
                    !_(differentHrefSameText).include(anchorInfo)) {

                    // Different href - same text...
                    differentHrefSameText.push(anchorInfo);
                    this.addFailure(this.createFailure(anchorInfo.start, anchorInfo.width,
                        DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING + this.firstPosition(current)));
                }
            });
        }
    }

    private firstPosition(anchorInfo: AnchorInfo): string {
        const startPosition: ts.LineAndCharacter =
            this.createFailure(anchorInfo.start, anchorInfo.width, '').getStartPosition().getLineAndCharacter();

        // Position is zero based - add 1...
        const character: number = startPosition.character + 1;
        const line: number = startPosition.line + 1;

        return ` First link at character: ${character} line: ${line}`;
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.validateAnchor(node, node);
        super.visitJsxSelfClosingElement(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        this.validateAnchor(node, node.openingElement);
        super.visitJsxElement(node);
    }

    private validateAnchor(parent: ts.Node, openingElement: ts.JsxOpeningElement): void {
        if (openingElement.tagName.getText() === 'a') {

            const anchorInfo: AnchorInfo = {
                href: this.getAttribute(openingElement, 'href'),
                text: this.anchorText(parent),
                start: parent.getStart(),
                width: parent.getWidth()
            };

            if (anchorInfo.href === '#') {
                this.addFailure(this.createFailure(anchorInfo.start, anchorInfo.width, NO_HASH_FAILURE_STRING));
            }

            if (!anchorInfo.text || anchorInfo.text.length <= 4) {
                this.addFailure(this.createFailure(anchorInfo.start, anchorInfo.width, LINK_TEXT_TOO_SHORT_FAILURE_STRING));
            }

            const imageAltText: string = this.imageAlt(parent);
            if (imageAltText && imageAltText === anchorInfo.text) {
                this.addFailure(this.createFailure(anchorInfo.start, anchorInfo.width, UNIQUE_ALT_FAILURE_STRING));
            }

            this.anchorInfoList.push(anchorInfo);
        }
    }

    private getAttribute(openingElement: ts.JsxOpeningElement, attributeName: string): string {
        const attributes: ts.NodeArray<ts.JsxAttribute | ts.JsxSpreadAttribute> = openingElement.attributes;
        let attributeValue: string;

        attributes.forEach((attribute: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
            if (attribute.kind === SyntaxKind.current().JsxAttribute) {
                const jsxAttribute: ts.JsxAttribute = <ts.JsxAttribute>attribute;
                if (jsxAttribute.name.getText() === attributeName &&
                    jsxAttribute.initializer &&
                    jsxAttribute.initializer.kind === SyntaxKind.current().StringLiteral) {
                    const literal: ts.StringLiteral = <ts.StringLiteral>jsxAttribute.initializer;

                    attributeValue = literal.text;
                }
            }
        });

        return attributeValue;
    }

    private anchorText(root: ts.Node): string {
        let title: string = '';
        if (root.kind === SyntaxKind.current().JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            jsxElement.children.forEach((child: ts.JsxChild): void => {
                title += this.anchorText(child);
            });
        } else if (root.kind === SyntaxKind.current().JsxText) {
            const jsxText: ts.JsxText = <ts.JsxText>root;
            title += jsxText.getText();
        } else if (root.kind === SyntaxKind.current().StringLiteral) {
            const literal: ts.StringLiteral = <ts.StringLiteral>root;
            title += literal.text;
        } else if (root.kind === SyntaxKind.current().JsxExpression) {
            const expression: ts.JsxExpression = <ts.JsxExpression>root;
            title += this.anchorText(expression.expression);
        } else if (root.kind !== SyntaxKind.current().JsxSelfClosingElement) {
            title += '<unknown>';
        }

        return title;
    }

    private imageAltAttribute(openingElement: ts.JsxOpeningElement): string {
        if (openingElement.tagName.getText() === 'img') {
            const altAttribute: string = this.getAttribute(openingElement, 'alt');
            if (altAttribute) {
                return altAttribute;
            }
        }

        return '';
    }

    private imageAlt(root: ts.Node): string {
        let altText: string = '';
        if (root.kind === SyntaxKind.current().JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            altText += this.imageAltAttribute(jsxElement.openingElement);

            jsxElement.children.forEach((child: ts.JsxChild): void => {
                altText += this.imageAlt(child);
            });
        }

        if (root.kind === SyntaxKind.current().JsxSelfClosingElement) {
            const jsxSelfClosingElement: ts.JsxSelfClosingElement = <ts.JsxSelfClosingElement>root;
            altText += this.imageAltAttribute(jsxSelfClosingElement);
        }

        return altText;
    }
}

class AnchorInfo {
    public href: string = '';
    public text: string = '';
    public start: number = 0;
    public width: number = 0;
}