import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { getJsxAttributesFromJsxElement, isEmpty } from './utils/JsxAttribute';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export const MISSING_PLACEHOLDER_INPUT_FAILURE_STRING: string = 'Input elements must include default, place-holding characters if empty';
export const MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING: string =
    'Textarea elements must include default, place-holding characters if empty';
const EXCLUDED_INPUT_TYPES = ['checkbox', 'radio'];

/**
 * Implementation of the react-a11y-input-elements rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-input-elements',
        type: 'functionality',
        description: 'For accessibility of your website, HTML input boxes and text areas must include default, place-holding characters.',
        rationale: `References:
        <ul>
          <li><a href="https://www.w3.org/TR/WAI-WEBCONTENT-TECHS/#tech-place-holders">
            WCAG 10.4
          </a></li>
          <li><a href="https://www.w3.org/TR/WCAG10-HTML-TECHS/#forms-specific">
            WCAG 11.5
          </a></li>
        </ul>`,
        options: undefined,
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
        }

        return [];
    }
}

function isTypeMatchedTo(
    node: ts.JsxSelfClosingElement,
    attributes: { [propName: string]: ts.JsxAttribute },
    condition: (attributeText: string) => boolean
): boolean {
    for (const attribute of node.attributes.properties) {
        if (tsutils.isJsxAttribute(attribute)) {
            const isInputAttributeType = attributes.type;
            if (attribute.initializer !== undefined && tsutils.isStringLiteral(attribute.initializer)) {
                const attributeText = attribute.initializer.text;
                if (isInputAttributeType !== undefined && condition(attributeText)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isExcludedInputType(node: ts.JsxSelfClosingElement, attributes: { [propName: string]: ts.JsxAttribute }): boolean {
    return isTypeMatchedTo(node, attributes, attributeText => EXCLUDED_INPUT_TYPES.indexOf(attributeText) !== -1);
}

function isInputTypeFile(node: ts.JsxSelfClosingElement, attributes: { [propName: string]: ts.JsxAttribute }): boolean {
    return isTypeMatchedTo(node, attributes, attributeText => attributeText === 'file');
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node)) {
            const tagName = node.tagName.getText();

            if (tagName === 'input') {
                const attributes = getJsxAttributesFromJsxElement(node);
                const isExcludedInput = isExcludedInputType(node, attributes);
                const isExcludedInputTypeValueEmpty = isEmpty(attributes.value) && isExcludedInput;
                const isPlaceholderEmpty = isEmpty(attributes.placeholder) && !isExcludedInput;

                if (isInputTypeFile(node, attributes)) {
                    return;
                }

                if ((isEmpty(attributes.value) && isPlaceholderEmpty) || isExcludedInputTypeValueEmpty) {
                    ctx.addFailureAt(node.getStart(), node.getWidth(), MISSING_PLACEHOLDER_INPUT_FAILURE_STRING);
                }
            } else if (tagName === 'textarea') {
                const attributes = getJsxAttributesFromJsxElement(node);
                if (isEmpty(attributes.placeholder)) {
                    ctx.addFailureAt(node.getStart(), node.getWidth(), MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING);
                }
            }
        } else if (tsutils.isJsxElement(node)) {
            const tagName = node.openingElement.tagName.getText();
            const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);

            if (tagName === 'textarea') {
                if (node.children.length === 0 && isEmpty(attributes.placeholder)) {
                    ctx.addFailureAt(node.getStart(), node.getWidth(), MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING);
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
