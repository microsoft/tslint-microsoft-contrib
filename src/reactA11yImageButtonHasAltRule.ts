/**
 * Enforce that inputs element with type="image" must have alt attribute.
 */
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';
import { isStringLiteral } from './utils/TypeGuard';

const NO_ALT_ATTRIBUTE_FAILURE_STRING: string = 'Inputs element with type="image" must have alt attribute.';
const EMPTY_ALT_ATTRIBUTE_FAILURE_STRING: string = 'Inputs element with type="image" must have non-empty alt attribute.';
const TYPE_STRING: string = 'type';
const ALT_STRING: string = 'alt';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-image-button-has-alt',
        type: 'maintainability',
        description: 'Enforce that inputs element with type="image" must have alt attribute.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX ? this.applyWithFunction(sourceFile, walk) : [];
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function validateOpeningElement(node: ts.JsxOpeningLikeElement): void {
        const tagName: string = node.tagName.getText();

        if (tagName !== 'input') {
            return;
        }

        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const typeAttribute: ts.JsxAttribute = attributes[TYPE_STRING];

        if (!typeAttribute || typeAttribute.initializer === undefined || !isStringLiteral(typeAttribute.initializer)) {
            return;
        }

        const stringLiteral = getStringLiteral(typeAttribute);
        if (stringLiteral === undefined || stringLiteral.toLowerCase() !== 'image') {
            return;
        }

        const altAttribute: ts.JsxAttribute = attributes[ALT_STRING];

        if (!altAttribute) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), NO_ALT_ATTRIBUTE_FAILURE_STRING);
        } else if (isEmpty(altAttribute) || !getStringLiteral(altAttribute)) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), EMPTY_ALT_ATTRIBUTE_FAILURE_STRING);
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxElement(node)) {
            validateOpeningElement(node.openingElement);
        } else if (tsutils.isJsxSelfClosingElement(node)) {
            validateOpeningElement(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
