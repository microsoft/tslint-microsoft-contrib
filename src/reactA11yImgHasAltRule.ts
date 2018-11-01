import * as ts from "typescript";
import * as Lint from "tslint";

import { ExtendedMetadata } from "./utils/ExtendedMetadata";
import { getAllAttributesFromJsxElement, getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from "./utils/JsxAttribute";
import { isJsxSpreadAttribute } from "./utils/TypeGuard";

const ROLE_STRING: string = "role";
const ALT_STRING: string = "alt";
const TITLE_STRING: string = "title";
const IMAGE_FILENAME_REGEX: RegExp = new RegExp("^.*\\.(jpg|bmp|jpeg|jfif|gif|png|tif|tiff)$", "i");

export function getFailureStringNoAlt(tagName: string): string {
    return `<${tagName}> elements must have an non-empty alt attribute or \
use empty alt attribute as well as role='presentation' for decorative/presentational images. \
A reference for the presentation role can be found at https://www.w3.org/TR/wai-aria/roles#presentation.`;
}

export function getFailureStringEmptyAltAndNotPresentationRole(tagName: string): string {
    return `The value of alt attribute in <${tagName}> tag is empty and role value is not presentation. \
Add more details in alt attribute or specify role attribute to equal 'presentation' when 'alt' attribute is empty.`;
}

export function getFailureStringNonEmptyAltAndPresentationRole(tagName: string): string {
    return `The value of alt attribute in <${tagName}> tag is non-empty and role value is presentation. \
Remove role='presentation' or specify 'alt' attribute to be empty when role attributes equals 'presentation'.`;
}

export function getFailureStringEmptyAltAndNotEmptyTitle(tagName: string): string {
    return `The value of alt attribute in <${tagName}> tag is empty and the role is presentation, but the value of \
its title attribute is not empty. Remove the title attribute.`;
}

export function getFailureStringAltIsImageFileName(tagName: string): string {
    return `The value of alt attribute in <${tagName}> tag is an image file name. Give meaningful value to the alt attribute `;
}

/**
 * Enforces that img elements have alt text.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: "react-a11y-img-has-alt",
        type: "maintainability",
        description:
            "Enforce that an img element contains the non-empty alt attribute. " +
            'For decorative images, using empty alt attribute and role="presentation".',
        options: "string[]",
        optionsDescription: "",
        optionExamples: ["true", '[true, ["Image"]]'],
        typescriptOnly: true,
        issueClass: "Non-SDL",
        issueType: "Warning",
        severity: "Important",
        level: "Opportunity for Excellence",
        group: "Accessibility"
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new ImgHasAltWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class ImgHasAltWalker extends Lint.RuleWalker {
    public visitJsxElement(node: ts.JsxElement): void {
        this.checkJsxOpeningElement(node.openingElement);
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.checkJsxOpeningElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private checkJsxOpeningElement(node: ts.JsxOpeningLikeElement): void {
        // Tag name is sensitive on lowercase or uppercase, we shoudn't normalize tag names in this rule.
        const tagName: string = node.tagName.getText();
        const options: any[] = this.getOptions(); // tslint:disable-line:no-any

        // The additionalTagNames are specified by tslint config to check not only 'img' tag but also customized tag.
        // @example checking a customized component 'Image' which should require 'alt' attribute.
        const additionalTagNames: string[] = options.length > 0 ? options[0] : [];

        // The targetTagNames is the list of tag names we want to check.
        const targetTagNames: string[] = ["img"].concat(additionalTagNames);

        if (!tagName || targetTagNames.indexOf(tagName) === -1) {
            return;
        }

        // If element contains JsxSpreadElement in which there could possibly be alt attribute, don't check it.
        const nodeAttributes = getAllAttributesFromJsxElement(node);
        if (nodeAttributes !== undefined && nodeAttributes.some(isJsxSpreadAttribute)) {
            return;
        }

        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const altAttribute: ts.JsxAttribute = attributes[ALT_STRING];

        if (!altAttribute) {
            this.addFailureAt(node.getStart(), node.getWidth(), getFailureStringNoAlt(tagName));
        } else {
            const roleAttribute: ts.JsxAttribute = attributes[ROLE_STRING];
            const roleAttributeValue = roleAttribute ? getStringLiteral(roleAttribute) : "";
            const titleAttribute: ts.JsxAttribute = attributes[TITLE_STRING];
            const isPresentationRole: boolean = !!String(roleAttributeValue)
                .toLowerCase()
                .match(/\bpresentation\b/);
            const isEmptyAlt: boolean = isEmpty(altAttribute) || getStringLiteral(altAttribute) === "";
            const isEmptyTitle: boolean = isEmpty(titleAttribute) || getStringLiteral(titleAttribute) === "";
            const allowNonEmptyAltWithRolePresentation: boolean =
                options.length > 1 ? options[1].allowNonEmptyAltWithRolePresentation : false;
            const isAltImageFileName: boolean = !isEmptyAlt && IMAGE_FILENAME_REGEX.test(getStringLiteral(altAttribute) || "");
            // <img alt='altValue' role='presentation' />
            if (!isEmptyAlt && isPresentationRole && !allowNonEmptyAltWithRolePresentation && !titleAttribute) {
                this.addFailureAt(node.getStart(), node.getWidth(), getFailureStringNonEmptyAltAndPresentationRole(tagName));
            } else if (isEmptyAlt && !isPresentationRole && !titleAttribute) {
                // <img alt='' />
                this.addFailureAt(node.getStart(), node.getWidth(), getFailureStringEmptyAltAndNotPresentationRole(tagName));
            } else if (isEmptyAlt && titleAttribute && !isEmptyTitle) {
                this.addFailureAt(node.getStart(), node.getWidth(), getFailureStringEmptyAltAndNotEmptyTitle(tagName));
            } else if (isAltImageFileName) {
                this.addFailureAt(node.getStart(), node.getWidth(), getFailureStringAltIsImageFileName(tagName));
            }
        }
    }
}
