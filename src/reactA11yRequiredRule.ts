import * as ts from "typescript";
import * as Lint from "tslint";

import { ExtendedMetadata } from "./utils/ExtendedMetadata";
import { getJsxAttributesFromJsxElement, isEmpty, getBooleanLiteral } from "./utils/JsxAttribute";

const FAILURE_STRING: string = "Required input elements must have an aria-required set to true";
const REQUIRED_STRING: string = "required";
const ARIA_REQUIRED_STRING = "aria-required";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: "react-a11y-required",
        type: "functionality",
        description: "Enforce that required input elements must have aria-required set to true",
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: "Non-SDL",
        issueType: "Warning",
        severity: "Low",
        level: "Opportunity for Excellence",
        group: "Accessibility"
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ReactA11yRequiredRuleWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class ReactA11yRequiredRuleWalker extends Lint.RuleWalker {
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

        if (tagName !== "input") {
            return;
        }

        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const requiredAttribute: ts.JsxAttribute = attributes[REQUIRED_STRING];

        if (!requiredAttribute) {
            return;
        }

        const ariaRequiredAttribute: ts.JsxAttribute = attributes[ARIA_REQUIRED_STRING];

        if (!ariaRequiredAttribute || isEmpty(ariaRequiredAttribute) || !getBooleanLiteral(ariaRequiredAttribute)) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
        }
    }
}
