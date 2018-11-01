import * as ts from "typescript";
import * as Lint from "tslint";

import { getJsxAttributesFromJsxElement, isEmpty } from "./utils/JsxAttribute";
import { ExtendedMetadata } from "./utils/ExtendedMetadata";

export const MISSING_PLACEHOLDER_INPUT_FAILURE_STRING: string = "Input elements must include default, place-holding characters if empty";
export const MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING: string =
    "Textarea elements must include default, place-holding characters if empty";

/**
 * Implementation of the react-a11y-input-elements rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: "react-a11y-input-elements",
        type: "functionality",
        description: "For accessibility of your website, HTML input boxes and text areas must include default, place-holding characters.",
        options: undefined,
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: "Non-SDL",
        issueType: "Warning",
        severity: "Moderate",
        level: "Opportunity for Excellence",
        group: "Accessibility"
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactA11yInputElementsRuleWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactA11yInputElementsRuleWalker extends Lint.RuleWalker {
    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        const tagName = node.tagName.getText();

        if (tagName === "input") {
            const attributes = getJsxAttributesFromJsxElement(node);
            if (isEmpty(attributes.value) && isEmpty(attributes.placeholder)) {
                this.addFailureAt(node.getStart(), node.getWidth(), MISSING_PLACEHOLDER_INPUT_FAILURE_STRING);
            }
        } else if (tagName === "textarea") {
            const attributes = getJsxAttributesFromJsxElement(node);
            if (isEmpty(attributes.placeholder)) {
                this.addFailureAt(node.getStart(), node.getWidth(), MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING);
            }
        }
        super.visitJsxSelfClosingElement(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        const tagName = node.openingElement.tagName.getText();
        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);

        if (tagName === "textarea") {
            if (node.children.length === 0 && isEmpty(attributes.placeholder)) {
                this.addFailureAt(node.getStart(), node.getWidth(), MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING);
            }
        }
        super.visitJsxElement(node);
    }
}
