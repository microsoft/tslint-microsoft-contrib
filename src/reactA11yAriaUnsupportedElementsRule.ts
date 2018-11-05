/**
 * Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.
 */
import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';
import { IDom } from './utils/attributes/IDom';
import { IAria } from './utils/attributes/IAria';

// tslint:disable:no-require-imports no-var-requires
const DOM_SCHEMA: { [key: string]: IDom } = require('./utils/attributes/domSchema.json');
const ARIA_SCHEMA: { [key: string]: IAria } = require('./utils/attributes/ariaSchema.json');
// tslint:enable:no-require-imports no-var-requires

export function getFailureString(tagName: string, ariaAttributeNames: string[]): string {
    return (
        `This element ${tagName} does not support ARIA roles, states and properties. ` +
        `Try removing attribute(s): ${ariaAttributeNames.join(', ')}.`
    );
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-aria-unsupported-elements',
        type: 'maintainability',
        description: 'Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.',
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
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ReactA11yAriaUnsupportedElementsWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class ReactA11yAriaUnsupportedElementsWalker extends Lint.RuleWalker {
    public visitJsxElement(node: ts.JsxElement): void {
        this.validateOpeningElement(node.openingElement);
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.validateOpeningElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private validateOpeningElement(node: ts.JsxOpeningLikeElement): void {
        const tagName: string = node.tagName.getText();

        if (!DOM_SCHEMA[tagName]) {
            return;
        }

        const supportAria: boolean = DOM_SCHEMA[tagName].supportAria !== undefined ? DOM_SCHEMA[tagName].supportAria : false;

        if (supportAria) {
            return;
        }

        const checkAttributeNames: string[] = Object.keys(ARIA_SCHEMA).concat('role');
        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const invalidAttributeNames: string[] = checkAttributeNames.filter((attributeName: string): boolean => !!attributes[attributeName]);

        if (invalidAttributeNames.length > 0) {
            const message: string = getFailureString(tagName, invalidAttributeNames);
            this.addFailureAt(node.getStart(), node.getWidth(), message);
        }
    }
}
