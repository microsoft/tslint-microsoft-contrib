import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { Utils } from './utils/Utils';
import { getImplicitRole } from './utils/getImplicitRole';
import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';
import { isObject } from './utils/TypeGuard';

export const OPTION_IGNORE_CASE: string = 'ignore-case';
export const OPTION_IGNORE_WHITESPACE: string = 'ignore-whitespace';

const ROLE_STRING: string = 'role';

export const NO_HASH_FAILURE_STRING: string = 'Do not use # as anchor href.';
export const MISSING_HREF_FAILURE_STRING: string = 'Do not leave href undefined or null';
export const LINK_TEXT_TOO_SHORT_FAILURE_STRING: string =
    'Link text or the alt text of image in link should be at least 4 characters long. ' +
    "If you are not using <a> element as anchor, please specify explicit role, e.g. role='button'";
export const UNIQUE_ALT_FAILURE_STRING: string =
    'Links with images and text content, the alt attribute should be unique to the text content or empty.';
export const SAME_HREF_SAME_TEXT_FAILURE_STRING: string = 'Links with the same HREF should have the same link text.';
export const DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING: string = 'Links that point to different HREFs should have different link text.';
export const ACCESSIBLE_HIDDEN_CONTENT_FAILURE_STRING: string =
    'Link content can not be hidden for screen-readers by using aria-hidden attribute.';

interface Options {
    ignoreCase: boolean;
    ignoreWhitespace: string;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-anchors',
        type: 'functionality',
        description: 'For accessibility of your website, anchor elements must have a href different from # and a text longer than 4.',
        rationale: `References:
        <ul>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/38">WCAG Rule 38: Link text should be as least four 4 characters long</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/39">WCAG Rule 39: Links with the same HREF should have the same link text</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/41">WCAG Rule 41: Links that point to different HREFs should have different link text</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/43">WCAG Rule 43: Links with images and text content, the alt attribute should be unique to the text content or empty</a></li>
        </ul>`,
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
            return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
        }

        return [];
    }

    private parseOptions(options: Lint.IOptions): Options {
        const parsed: Options = {
            ignoreCase: false,
            ignoreWhitespace: ''
        };

        options.ruleArguments.forEach((opt: unknown) => {
            if (typeof opt === 'string' && opt === OPTION_IGNORE_CASE) {
                parsed.ignoreCase = true;
            }

            if (isObject(opt)) {
                parsed.ignoreWhitespace = <string>opt[OPTION_IGNORE_WHITESPACE];
            }
        });
        return parsed;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const anchorInfoList: IAnchorInfo[] = [];

    function validateAllAnchors(): void {
        const sameHrefDifferentTexts: IAnchorInfo[] = [];
        const differentHrefSameText: IAnchorInfo[] = [];

        while (anchorInfoList.length > 0) {
            // tslint:disable-next-line:no-non-null-assertion
            const current: IAnchorInfo = anchorInfoList.shift()!;
            anchorInfoList.forEach(
                (anchorInfo: IAnchorInfo): void => {
                    if (
                        current.href &&
                        current.href === anchorInfo.href &&
                        !compareAnchorsText(current, anchorInfo) &&
                        !Utils.contains(sameHrefDifferentTexts, anchorInfo)
                    ) {
                        // Same href - different text...
                        sameHrefDifferentTexts.push(anchorInfo);
                        ctx.addFailureAt(anchorInfo.start, anchorInfo.width, SAME_HREF_SAME_TEXT_FAILURE_STRING + firstPosition(current));
                    }

                    if (
                        current.href !== anchorInfo.href &&
                        compareAnchorsText(current, anchorInfo) &&
                        !Utils.contains(differentHrefSameText, anchorInfo)
                    ) {
                        // Different href - same text...
                        differentHrefSameText.push(anchorInfo);
                        ctx.addFailureAt(
                            anchorInfo.start,
                            anchorInfo.width,
                            DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING + firstPosition(current)
                        );
                    }
                }
            );
        }
    }

    function compareAnchorsText(anchor1: IAnchorInfo, anchor2: IAnchorInfo): boolean {
        let text1: string = anchor1.text;
        let text2: string = anchor2.text;
        let altText1: string = anchor1.altText;
        let altText2: string = anchor2.altText;

        if (ctx.options.ignoreCase) {
            text1 = text1.toLowerCase();
            text2 = text2.toLowerCase();
            altText1 = altText1.toLowerCase();
            altText2 = altText2.toLowerCase();
        }

        if (ctx.options.ignoreWhitespace === 'trim') {
            text1 = text1.trim();
            text2 = text2.trim();
            altText1 = altText1.trim();
            altText2 = altText2.trim();
        }

        if (ctx.options.ignoreWhitespace === 'all') {
            const regex: RegExp = /\s/g;
            text1 = text1.replace(regex, '');
            text2 = text2.replace(regex, '');
            altText1 = altText1.replace(regex, '');
            altText2 = altText2.replace(regex, '');
        }

        return text1 === text2 && altText1 === altText2;
    }

    function firstPosition(anchorInfo: IAnchorInfo): string {
        const startPosition = ctx.sourceFile.getLineAndCharacterOfPosition(Math.min(anchorInfo.start, ctx.sourceFile.end));

        // Position is zero based - add 1...
        const character: number = startPosition.character + 1;
        const line: number = startPosition.line + 1;

        return ` First link at character: ${character} line: ${line}`;
    }

    function validateAnchor(parent: ts.Node, openingElement: ts.JsxOpeningLikeElement): void {
        if (openingElement.tagName.getText() === 'a') {
            const hrefAttribute = getAttribute(openingElement, 'href');

            const anchorInfo: IAnchorInfo = {
                href: hrefAttribute ? getStringLiteral(hrefAttribute) || '' : '',
                text: anchorText(parent),
                altText: imageAlt(parent),
                hasAriaHiddenCount: jsxElementAriaHidden(parent),
                start: parent.getStart(),
                width: parent.getWidth()
            };

            if (isEmpty(hrefAttribute)) {
                ctx.addFailureAt(anchorInfo.start, anchorInfo.width, MISSING_HREF_FAILURE_STRING);
            }

            if (anchorInfo.href === '#') {
                ctx.addFailureAt(anchorInfo.start, anchorInfo.width, NO_HASH_FAILURE_STRING);
            }

            if (anchorInfo.hasAriaHiddenCount > 0) {
                ctx.addFailureAt(anchorInfo.start, anchorInfo.width, ACCESSIBLE_HIDDEN_CONTENT_FAILURE_STRING);
            }

            if (anchorInfo.altText && anchorInfo.altText === anchorInfo.text) {
                ctx.addFailureAt(anchorInfo.start, anchorInfo.width, UNIQUE_ALT_FAILURE_STRING);
            }

            const anchorInfoTextLength: number = anchorInfo.text ? anchorInfo.text.length : 0;
            const anchorImageAltTextLength: number = anchorInfo.altText ? anchorInfo.altText.length : 0;

            if (anchorRole(openingElement) === 'link' && anchorInfoTextLength < 4 && anchorImageAltTextLength < 4) {
                ctx.addFailureAt(anchorInfo.start, anchorInfo.width, LINK_TEXT_TOO_SHORT_FAILURE_STRING);
            }

            anchorInfoList.push(anchorInfo);
        }
    }

    function getAttribute(openingElement: ts.JsxOpeningLikeElement, attributeName: string): ts.JsxAttribute {
        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(openingElement);
        return attributes[attributeName];
    }

    /**
     * Return a string which contains literal text and text in 'alt' attribute.
     */
    function anchorText(root: ts.Node | undefined, isChild: boolean = false): string {
        let title: string = '';
        if (root === undefined) {
            return title;
        } else if (root.kind === ts.SyntaxKind.JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            jsxElement.children.forEach(
                (child: ts.JsxChild): void => {
                    title += anchorText(child, true);
                }
            );
        } else if (root.kind === ts.SyntaxKind.JsxText) {
            const jsxText: ts.JsxText = <ts.JsxText>root;
            title += jsxText.getText();
        } else if (root.kind === ts.SyntaxKind.StringLiteral) {
            const literal: ts.StringLiteral = <ts.StringLiteral>root;
            title += literal.text;
        } else if (root.kind === ts.SyntaxKind.JsxExpression) {
            const expression: ts.JsxExpression = <ts.JsxExpression>root;
            title += anchorText(expression.expression);
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

    function anchorRole(root: ts.Node): string | undefined {
        const attributesInElement: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(root);
        const roleProp: ts.JsxAttribute = attributesInElement[ROLE_STRING];

        // If role attribute is specified, get the role value. Otherwise get the implicit role from tag name.
        return roleProp ? getStringLiteral(roleProp) : getImplicitRole(root);
    }

    function imageAltAttribute(openingElement: ts.JsxOpeningLikeElement): string {
        if (openingElement.tagName.getText() === 'img') {
            const altAttribute = getStringLiteral(getAttribute(openingElement, 'alt'));
            return altAttribute === undefined ? '<unknown>' : altAttribute;
        }

        return '';
    }

    function imageAlt(root: ts.Node): string {
        let altText: string = '';
        if (root.kind === ts.SyntaxKind.JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            altText += imageAltAttribute(jsxElement.openingElement);

            jsxElement.children.forEach(
                (child: ts.JsxChild): void => {
                    altText += imageAlt(child);
                }
            );
        }

        if (root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            const jsxSelfClosingElement: ts.JsxSelfClosingElement = <ts.JsxSelfClosingElement>root;
            altText += imageAltAttribute(jsxSelfClosingElement);
        }

        return altText;
    }

    function ariaHiddenAttribute(openingElement: ts.JsxOpeningLikeElement): boolean {
        return getAttribute(openingElement, 'aria-hidden') === undefined;
    }

    function jsxElementAriaHidden(root: ts.Node): number {
        let hasAriaHiddenCount: number = 0;

        if (root.kind === ts.SyntaxKind.JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            hasAriaHiddenCount += ariaHiddenAttribute(jsxElement.openingElement) ? 0 : 1;

            jsxElement.children.forEach(
                (child: ts.JsxChild): void => {
                    hasAriaHiddenCount += jsxElementAriaHidden(child);
                }
            );
        }

        if (root.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            const jsxSelfClosingElement: ts.JsxSelfClosingElement = <ts.JsxSelfClosingElement>root;
            hasAriaHiddenCount += ariaHiddenAttribute(jsxSelfClosingElement) ? 0 : 1;
        }

        return hasAriaHiddenCount;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node)) {
            validateAnchor(node, node);
        } else if (tsutils.isJsxElement(node)) {
            validateAnchor(node, node.openingElement);
        }

        return ts.forEachChild(node, cb);
    }

    ts.forEachChild(ctx.sourceFile, cb);

    validateAllAnchors();
}

interface IAnchorInfo {
    href: string;
    text: string;
    altText: string;
    hasAriaHiddenCount: number;
    start: number;
    width: number;
}
