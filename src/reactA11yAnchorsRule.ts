import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {Utils} from './utils/Utils';
import {getImplicitRole} from './utils/getImplicitRole';
import {
    getJsxAttributesFromJsxElement,
    getStringLiteral,
    isEmpty
} from './utils/JsxAttribute';

export const OPTION_IGNORE_CASE: string = 'ignore-case';
export const OPTION_IGNORE_WHITESPACE: string = 'ignore-whitespace';

const ROLE_STRING: string = 'role';

export const NO_HASH_FAILURE_STRING: string =
    'Do not use # as anchor href.';
export const MISSING_HREF_FAILURE_STRING: string =
    'Do not leave href undefined or null';
export const LINK_TEXT_TOO_SHORT_FAILURE_STRING: string =
    'Link text or the alt text of image in link should be at least 4 characters long. ' +
    'If you are not using <a> element as anchor, please specify explicit role, e.g. role=\'button\'';
export const UNIQUE_ALT_FAILURE_STRING: string =
    'Links with images and text content, the alt attribute should be unique to the text content or empty.';
export const SAME_HREF_SAME_TEXT_FAILURE_STRING: string =
    'Links with the same HREF should have the same link text.';
export const DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING: string =
    'Links that point to different HREFs should have different link text.';
export const ACCESSIBLE_HIDDEN_CONTENT_FAILURE_STRING: string =
    'Link content can not be hidden for screen-readers by using aria-hidden attribute.';

/**
 * Implementation of the react-a11y-anchors rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-anchors',
        type: 'functionality',
        description: 'For accessibility of your website, anchor elements must have a href different from # and a text longer than 4.',
        options: {
            type: 'array',
            items: {
                type: 'string',
                enum: [OPTION_IGNORE_CASE, OPTION_IGNORE_WHITESPACE]
            },
            minLength: 0,
            maxLength: 2
        },
        optionsDescription: Lint.Utils.dedent`
        Optional arguments to relax the same HREF same link text rule are provided:
        * \`${OPTION_IGNORE_CASE}\` ignore differences in cases.
        * \`{"${OPTION_IGNORE_WHITESPACE}": "trim"}\` ignore differences only in leading/trailing whitespace.
        * \`{"${OPTION_IGNORE_WHITESPACE}": "all"}\` ignore differences in all whitespace.
        `,
        typescriptOnly: true,
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
    private ignoreCase: boolean = false;
    private ignoreWhitespace: string = '';
    private anchorInfoList: IAnchorInfo[] = [];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.parseOptions();
    }

    private parseOptions(): void {
        this.getOptions().forEach((opt: any) => {
            if (typeof opt === 'string' && opt === OPTION_IGNORE_CASE) {
                this.ignoreCase = true;
            }

            if (typeof opt === 'object') {
                this.ignoreWhitespace = opt[OPTION_IGNORE_WHITESPACE];
            }
        });
    }

    public validateAllAnchors(): void {
        const sameHrefDifferentTexts: IAnchorInfo[] = [];
        const differentHrefSameText: IAnchorInfo[] = [];

        while (this.anchorInfoList.length > 0) {
            const current: IAnchorInfo = this.anchorInfoList.shift()!;
            this.anchorInfoList.forEach((anchorInfo: IAnchorInfo): void => {
                if (current.href &&
                    current.href === anchorInfo.href &&
                    !this.compareAnchorsText(current, anchorInfo) &&
                    !Utils.contains(sameHrefDifferentTexts, anchorInfo)) {

                    // Same href - different text...
                    sameHrefDifferentTexts.push(anchorInfo);
                    this.addFailureAt(anchorInfo.start, anchorInfo.width,
                        SAME_HREF_SAME_TEXT_FAILURE_STRING + this.firstPosition(current));
                }

                if (current.href !== anchorInfo.href &&
                    this.compareAnchorsText(current, anchorInfo) &&
                    !Utils.contains(differentHrefSameText, anchorInfo)) {

                    // Different href - same text...
                    differentHrefSameText.push(anchorInfo);
                    this.addFailureAt(anchorInfo.start, anchorInfo.width,
                        DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING + this.firstPosition(current));
                }
            });
        }
    }

    private compareAnchorsText(anchor1: IAnchorInfo, anchor2: IAnchorInfo): boolean {
        let text1: string = anchor1.text;
        let text2: string = anchor2.text;
        let altText1: string = anchor1.altText;
        let altText2: string = anchor2.altText;

        if (this.ignoreCase) {
            text1 = text1.toLowerCase();
            text2 = text2.toLowerCase();
            altText1 = altText1.toLowerCase();
            altText2 = altText2.toLowerCase();
        }

        if (this.ignoreWhitespace === 'trim') {
            text1 = text1.trim();
            text2 = text2.trim();
            altText1 = altText1.trim();
            altText2 = altText2.trim();
        }

        if (this.ignoreWhitespace === 'all') {
            const regex: RegExp = /\s/g;
            text1 = text1.replace(regex, '');
            text2 = text2.replace(regex, '');
            altText1 = altText1.replace(regex, '');
            altText2 = altText2.replace(regex, '');
        }

        return text1 === text2 && altText1 === altText2;
    }

    private firstPosition(anchorInfo: IAnchorInfo): string {
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

    private validateAnchor(parent: ts.Node, openingElement: ts.JsxOpeningLikeElement): void {
        if (openingElement.tagName.getText() === 'a') {
            const hrefAttribute = this.getAttribute(openingElement, 'href');

            const anchorInfo: IAnchorInfo = {
                href: hrefAttribute ? getStringLiteral(hrefAttribute) || '' : '',
                text: this.anchorText(parent),
                altText: this.imageAlt(parent),
                hasAriaHiddenCount: this.jsxElementAriaHidden(parent),
                start: parent.getStart(),
                width: parent.getWidth()
            };

            if (isEmpty(hrefAttribute)) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, MISSING_HREF_FAILURE_STRING);
            }

            if (anchorInfo.href === '#') {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, NO_HASH_FAILURE_STRING);
            }

            if (anchorInfo.hasAriaHiddenCount > 0) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, ACCESSIBLE_HIDDEN_CONTENT_FAILURE_STRING);
            }

            if (anchorInfo.altText && anchorInfo.altText === anchorInfo.text) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, UNIQUE_ALT_FAILURE_STRING);
            }

            const anchorInfoTextLength: number = anchorInfo.text ? anchorInfo.text.length : 0;
            const anchorImageAltTextLength: number = anchorInfo.altText ? anchorInfo.altText.length : 0;

            if (
                this.anchorRole(openingElement) === 'link' &&
                anchorInfoTextLength < 4 &&
                anchorImageAltTextLength < 4
            ) {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, LINK_TEXT_TOO_SHORT_FAILURE_STRING);
            }

            this.anchorInfoList.push(anchorInfo);
        }
    }

    private getAttribute(openingElement: ts.JsxOpeningLikeElement, attributeName: string): ts.JsxAttribute {
        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(openingElement);
        return attributes[attributeName];
    }

    /**
     * Return a string which contains literal text and text in 'alt' attribute.
     */
    private anchorText(root: ts.Node | undefined, isChild: boolean = false): string {
        let title: string = '';
        if (root === undefined) {
            return title;
        } else if (root.kind === ts.SyntaxKind.JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            jsxElement.children.forEach((child: ts.JsxChild): void => {
                title += this.anchorText(child, true);
            });
        } else if (root.kind === ts.SyntaxKind.JsxText) {
            const jsxText: ts.JsxText = <ts.JsxText>root;
            title += jsxText.getText();
        } else if (root.kind === ts.SyntaxKind.StringLiteral) {
            const literal: ts.StringLiteral = <ts.StringLiteral>root;
            title += literal.text;
        } else if (root.kind === ts.SyntaxKind.JsxExpression) {
            const expression: ts.JsxExpression = <ts.JsxExpression>root;
            title += this.anchorText(expression.expression);
        } else if (isChild && root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            const jsxSelfClosingElement = <ts.JsxSelfClosingElement>root;
            if (jsxSelfClosingElement.tagName.getText() !== 'img') {
                title += '<component>';
            }
        } else if (root.kind !== ts.SyntaxKind.JsxSelfClosingElement) {
            title += '<unknown>';
        }

        return title;
    }

    private anchorRole(root: ts.Node): string | undefined {
        const attributesInElement: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(root);
        const roleProp: ts.JsxAttribute = attributesInElement[ROLE_STRING];

        // If role attribute is specified, get the role value. Otherwise get the implicit role from tag name.
        return roleProp ? getStringLiteral(roleProp) : getImplicitRole(root);
    }

    private imageAltAttribute(openingElement: ts.JsxOpeningLikeElement): string {
        if (openingElement.tagName.getText() === 'img') {
            const altAttribute = getStringLiteral(this.getAttribute(openingElement, 'alt'));
            return altAttribute === undefined ? '<unknown>' : altAttribute;
        }

        return '';
    }

    private imageAlt(root: ts.Node): string {
        let altText: string = '';
        if (root.kind === ts.SyntaxKind.JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            altText += this.imageAltAttribute(jsxElement.openingElement);

            jsxElement.children.forEach((child: ts.JsxChild): void => {
                altText += this.imageAlt(child);
            });
        }

        if (root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            const jsxSelfClosingElement: ts.JsxSelfClosingElement = <ts.JsxSelfClosingElement>root;
            altText += this.imageAltAttribute(jsxSelfClosingElement);
        }

        return altText;
    }

    private ariaHiddenAttribute(openingElement: ts.JsxOpeningLikeElement): boolean {
        return this.getAttribute(openingElement, 'aria-hidden') === undefined;
    }

    private jsxElementAriaHidden(root: ts.Node): number {
        let hasAriaHiddenCount: number = 0;

        if (root.kind === ts.SyntaxKind.JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            hasAriaHiddenCount += this.ariaHiddenAttribute(jsxElement.openingElement) ? 0 : 1;

            jsxElement.children.forEach((child: ts.JsxChild): void => {
                hasAriaHiddenCount += this.jsxElementAriaHidden(child);
            });
        }

        if (root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            const jsxSelfClosingElement: ts.JsxSelfClosingElement = <ts.JsxSelfClosingElement>root;
            hasAriaHiddenCount += this.ariaHiddenAttribute(jsxSelfClosingElement) ? 0 : 1;
        }

        return hasAriaHiddenCount;
    }
}

interface IAnchorInfo {
    href: string;
    text: string;
    altText: string;
    hasAriaHiddenCount: number;
    start: number;
    width: number;
}
