import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {getJsxAttributesFromJsxElement} from './utils/JsxAttribute';

/**
 * Implementation of the react-a11y-no-onchange rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-no-onchange',
        type: 'functionality',
        description: 'For accessibility of select menus, onChange event handler should not be used with the select element.',
        options: 'string[]',
        optionsDescription: 'Additional tag name to validate.',
        optionExamples: ['true', '[true, ["Select"]]'],
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX ?
            this.applyWithWalker(new ReactA11yNoOnchangeRuleWalker(sourceFile, this.getOptions())) :
            [];
    }
}

class ReactA11yNoOnchangeRuleWalker extends ErrorTolerantWalker {
    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.checkJsxOpeningElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        this.checkJsxOpeningElement(node.openingElement);
        super.visitJsxElement(node);
    }

    private checkJsxOpeningElement(node: ts.JsxOpeningLikeElement) {
        const tagName: string = node.tagName.getText();
        const options: any[] = this.getOptions();

        const additionalTagNames: string[] = options.length > 0 ? options[0] : [];

        const targetTagNames: string[] = ['select', ...additionalTagNames];

        if (!tagName || targetTagNames.indexOf(tagName) === -1) {
            return;
        }

        const attributes = getJsxAttributesFromJsxElement(node);
        if (attributes.hasOwnProperty('onchange')) {
            const errorMessage = `onChange event handler should not be used with the <${tagName}>. Please use onBlur instead.`;
            this.addFailureAt(node.getStart(), node.getWidth(), errorMessage);
        }
    }
}
