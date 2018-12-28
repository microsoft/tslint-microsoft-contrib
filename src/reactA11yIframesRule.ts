import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';

const IFRAME_ELEMENT_NAME: string = 'iframe';
const TITLE_ATTRIBUTE_NAME: string = 'title';
const SRC_ATTRIBUTE_NAME: string = 'src';
const HIDDEN_ATTRIBUTE_NAME: string = 'hidden';
const IFRAME_EMPTY_TITLE_ERROR_STRING: string = 'An iframe element must have a non-empty title.';
const IFRAME_EMPTY_OR_HIDDEN_ERROR_STRING: string = 'An iframe element should not be hidden or empty.';
const IFRAME_UNIQUE_TITLE_ERROR_STRING: string = 'An iframe element must have a unique title.';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-iframes',
        type: 'functionality',
        description: 'Enforce that iframe elements are not empty, have title and are unique.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ReactA11yIframesRuleWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class ReactA11yIframesRuleWalker extends Lint.RuleWalker {
    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        this.validate(node);
        super.visitVariableDeclaration(node);
    }

    private validate(node: ts.Node) {
        const titles: Set<String> = new Set();

        this.getJsxElements(node).forEach((element: ts.Node) => {
            const attributes = getJsxAttributesFromJsxElement(element);

            // Validate that iframe has a non-empty title
            const titleAttribute = attributes[TITLE_ATTRIBUTE_NAME];
            const titleAttributeText = this.getAttributeText(titleAttribute);
            if (!titleAttribute || !titleAttributeText) {
                this.addFailureAt(element.getStart(), element.getWidth(), IFRAME_EMPTY_TITLE_ERROR_STRING);
            }

            // Validate the iframe title is unique
            if (titleAttributeText && titles.has(titleAttributeText)) {
                this.addFailureAt(element.getStart(), element.getWidth(), IFRAME_UNIQUE_TITLE_ERROR_STRING);
            } else if (titleAttributeText) {
                titles.add(titleAttributeText);
            }

            // Validate that iframe is not empty or hidden
            const hiddenAttribute = attributes[HIDDEN_ATTRIBUTE_NAME];
            const srcAttribute = attributes[SRC_ATTRIBUTE_NAME];
            if (hiddenAttribute || !srcAttribute || !this.getAttributeText(srcAttribute)) {
                this.addFailureAt(element.getStart(), element.getWidth(), IFRAME_EMPTY_OR_HIDDEN_ERROR_STRING);
            }
        });
    }

    private getJsxElements(node: ts.Node): (ts.JsxElement | ts.JsxSelfClosingElement)[] {
        const elements: (ts.JsxElement | ts.JsxSelfClosingElement)[] = [];
        tsutils.forEachToken(node, (childNode: ts.Node) => {
            const parentNode = childNode.parent;
            if (childNode.getText() === IFRAME_ELEMENT_NAME) {
                if (tsutils.isJsxOpeningElement(parentNode)) {
                    elements.push(parentNode.parent);
                }
                if (tsutils.isJsxSelfClosingElement(parentNode)) {
                    elements.push(parentNode);
                }
            }
        });
        return elements;
    }

    private getAttributeText(attribute: ts.JsxAttribute): string | undefined {
        if (attribute && attribute.initializer) {
            if (tsutils.isJsxExpression(attribute.initializer)) {
                return attribute.initializer.expression ? attribute.initializer.expression.getText() : undefined;
            }
            if (tsutils.isStringLiteral(attribute.initializer)) {
                return attribute.initializer.text;
            }
        }
        return undefined;
    }
}
