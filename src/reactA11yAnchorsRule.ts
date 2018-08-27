import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {Utils} from './utils/Utils';
import {getImplicitRole} from './utils/getImplicitRole';
import {
    getJsxAttributesFromJsxElement,
    getStringLiteral
} from './utils/JsxAttribute';

const ROLE_STRING: string = 'role';

export const NO_HASH_FAILURE_STRING: string =
    'Do not use # as anchor href.';
export const LINK_TEXT_TOO_SHORT_FAILURE_STRING: string =
    'Link text or the alt text of image in link should be at least 4 characters long. ' +
    'If you are not using <a> element as anchor, please specify explicit role, e.g. role=\'button\'';
export const UNIQUE_ALT_FAILURE_STRING: string =
    'Links with images and text content, the alt attribute should be unique to the text content or empty.';
export const SAME_HREF_SAME_TEXT_FAILURE_STRING: string =
    'Links with the same HREF should have the same link text.';
export const DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING: string =
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
        optionsDescription: '',
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

    private anchorInfoList: IAnchorInfo[] = [];

    public validateAllAnchors(): void {
        const sameHrefDifferentTexts: IAnchorInfo[] = [];
        const differentHrefSameText: IAnchorInfo[] = [];

        while (this.anchorInfoList.length > 0) {
            const current: IAnchorInfo = this.anchorInfoList.shift()!;
            this.anchorInfoList.forEach((anchorInfo: IAnchorInfo): void => {
                if (current.href &&
                    current.href === anchorInfo.href &&
                    (current.text !== anchorInfo.text || current.altText !== anchorInfo.altText) &&
                    !Utils.contains(sameHrefDifferentTexts, anchorInfo)) {

                    // Same href - different text...
                    sameHrefDifferentTexts.push(anchorInfo);
                    this.addFailureAt(anchorInfo.start, anchorInfo.width,
                        SAME_HREF_SAME_TEXT_FAILURE_STRING + this.firstPosition(current));
                }

                if (current.href !== anchorInfo.href &&
                    current.text === anchorInfo.text &&
                    current.altText === anchorInfo.altText &&
                    !Utils.contains(differentHrefSameText, anchorInfo)) {

                    // Different href - same text...
                    differentHrefSameText.push(anchorInfo);
                    this.addFailureAt(anchorInfo.start, anchorInfo.width,
                        DIFFERENT_HREF_DIFFERENT_TEXT_FAILURE_STRING + this.firstPosition(current));
                }
            });
        }
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

            const anchorInfo: IAnchorInfo = {
                href: this.getAttribute(openingElement, 'href') || '',
                text: this.anchorText(parent),
                altText: this.imageAlt(parent),
                start: parent.getStart(),
                width: parent.getWidth()
            };

            if (anchorInfo.href === '#') {
                this.addFailureAt(anchorInfo.start, anchorInfo.width, NO_HASH_FAILURE_STRING);
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

    private getAttribute(openingElement: ts.JsxOpeningLikeElement, attributeName: string): string | undefined {
        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(openingElement);
        const attribute: ts.JsxAttribute = attributes[attributeName];
        return attribute ? getStringLiteral(attribute) : '';
    }

    /**
     * Return a string which contains literal text and text in 'alt' attribute.
     */
    private anchorText(root: ts.Node | undefined): string {
        let title: string = '';
        if (root === undefined) {
            return title;
        } else if (root.kind === ts.SyntaxKind.JsxElement) {
            const jsxElement: ts.JsxElement = <ts.JsxElement>root;
            jsxElement.children.forEach((child: ts.JsxChild): void => {
                title += this.anchorText(child);
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
            const altAttribute = this.getAttribute(openingElement, 'alt');
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
}

interface IAnchorInfo {
    href: string;
    text: string;
    altText: string;
    start: number;
    width: number;
}
