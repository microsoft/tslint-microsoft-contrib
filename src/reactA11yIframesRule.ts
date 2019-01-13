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
        description: 'Enforce that iframe elements are not empty, have title, and are unique.',
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
        return sourceFile.languageVariant === ts.LanguageVariant.JSX ? this.applyWithFunction(sourceFile, walk) : [];
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    const previousTitles: Set<string> = new Set();
    function cb(node: ts.Node): void {
        if (tsutils.isVariableDeclaration(node) || tsutils.isMethodDeclaration(node) || tsutils.isFunctionDeclaration(node)) {
            previousTitles.clear();
        }
        if (tsutils.isJsxOpeningElement(node) || tsutils.isJsxSelfClosingElement(node)) {
            if (node.tagName.getText() === IFRAME_ELEMENT_NAME) {
                const attributes = getJsxAttributesFromJsxElement(node);
                // Validate that iframe has a non-empty title
                const titleAttribute = attributes[TITLE_ATTRIBUTE_NAME];
                const titleAttributeText = getAttributeText(titleAttribute);
                if (!titleAttribute || !titleAttributeText) {
                    ctx.addFailureAtNode(node.tagName, IFRAME_EMPTY_TITLE_ERROR_STRING);
                }

                // Validate the iframe title is unique
                if (titleAttributeText && previousTitles.has(titleAttributeText)) {
                    ctx.addFailureAtNode(node.tagName, IFRAME_UNIQUE_TITLE_ERROR_STRING);
                } else if (titleAttributeText) {
                    previousTitles.add(titleAttributeText);
                }

                // Validate that iframe is not empty or hidden
                const hiddenAttribute = attributes[HIDDEN_ATTRIBUTE_NAME];
                const srcAttribute = attributes[SRC_ATTRIBUTE_NAME];
                if (hiddenAttribute || !srcAttribute || !getAttributeText(srcAttribute)) {
                    ctx.addFailureAtNode(node.tagName, IFRAME_EMPTY_OR_HIDDEN_ERROR_STRING);
                }
            }
        }
        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}

function getAttributeText(attribute: ts.JsxAttribute): string | undefined {
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
