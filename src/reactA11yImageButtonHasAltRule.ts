/**
 * Enforce that inputs element with type="image" must have alt attribute.
 */
import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';

const NO_ALT_ATTRIBUTE_FAILURE_STRING: string =
    'Inputs element with type="image" must have alt attribute.';
const EMPTY_ALT_ATTRIBUTE_FAILURE_STRING: string =
    'Inputs element with type="image" must have non-empty alt attribute.';
const TYPE_STRING: string = 'type';
const ALT_STRING: string = 'alt';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-image-button-has-alt',
        type: 'maintainability',
        description: 'Enforce that inputs element with type="image" must have alt attribute.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ReactA11yImageButtonHasAltWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class ReactA11yImageButtonHasAltWalker extends Lint.RuleWalker {
    public visitJsxElement(node: ts.JsxElement): void {
        this.checkJsxOpeningElement(node.openingElement);
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.checkJsxOpeningElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private checkJsxOpeningElement(node: ts.JsxOpeningElement): void {
        const tagName: string = node.tagName.getText();

        if (tagName !== 'input') {
            return;
        }

        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const typeAttribute: ts.JsxAttribute = attributes[TYPE_STRING];

        if (!typeAttribute || getStringLiteral(typeAttribute).toLowerCase() !== 'image') {
            return;
        }

        const altAttribute: ts.JsxAttribute = attributes[ALT_STRING];

        if (!altAttribute) {
            this.addFailure(this.createFailure(
                node.getStart(),
                node.getWidth(),
                NO_ALT_ATTRIBUTE_FAILURE_STRING
            ));
        } else if (isEmpty(altAttribute) || !getStringLiteral(altAttribute)) {
            this.addFailure(this.createFailure(
                node.getStart(),
                node.getWidth(),
                EMPTY_ALT_ATTRIBUTE_FAILURE_STRING
            ));
        }
    }
}
