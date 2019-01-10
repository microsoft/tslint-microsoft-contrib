import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getAllAttributesFromJsxElement, getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';
import { isJsxSpreadAttribute } from './utils/TypeGuard';

const ROLE_STRING: string = 'role';
const ALT_STRING: string = 'alt';
const TITLE_STRING: string = 'title';
const IMAGE_FILENAME_REGEX: RegExp = new RegExp('^.*\\.(jpg|bmp|jpeg|jfif|gif|png|tif|tiff)$', 'i');

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

interface Options {
    additionalTagNames: string[];
    allowNonEmptyAltWithRolePresentation: boolean;
}

/**
 * Enforces that img elements have alt text.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-img-has-alt',
        type: 'maintainability',
        description:
            'Enforce that an img element contains the non-empty alt attribute. ' +
            'For decorative images, using empty alt attribute and role="presentation".',
        options: 'string[]',
        rationale: `References:
        <ul>
          <li><a href="https://www.w3.org/TR/WCAG10/wai-pageauth.html#tech-text-equivalent">Web Content Accessibility Guidelines 1.0</a></li>
          <li><a href="https://www.w3.org/TR/wai-aria/roles#presentation">ARIA Presentation Role</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/31">WCAG Rule 31: If an image has an alt or title attribute, it should not have a presentation role</a></li>
        </ul>`,
        optionsDescription: '',
        optionExamples: ['true', '[true, ["Image"]]'],
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()))
            : [];
    }

    private parseOptions(options: Lint.IOptions): Options {
        const args = options.ruleArguments;
        return {
            // The additionalTagNames are specified by tslint config to check not only 'img' tag but also customized tag.
            // @example checking a customized component 'Image' which should require 'alt' attribute.
            additionalTagNames: args.length > 0 ? args[0] : [],
            allowNonEmptyAltWithRolePresentation: args.length > 1 ? args[1].allowNonEmptyAltWithRolePresentation : false
        };
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    function checkJsxOpeningElement(node: ts.JsxOpeningLikeElement): void {
        // Tag name is sensitive on lowercase or uppercase, we shoudn't normalize tag names in this rule.
        const tagName: string = node.tagName.getText();

        // The targetTagNames is the list of tag names we want to check.
        const targetTagNames: string[] = ['img'].concat(ctx.options.additionalTagNames);

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
            ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureStringNoAlt(tagName));
        } else {
            const roleAttribute: ts.JsxAttribute = attributes[ROLE_STRING];
            const roleAttributeValue = roleAttribute ? getStringLiteral(roleAttribute) : '';
            const titleAttribute: ts.JsxAttribute = attributes[TITLE_STRING];
            const isPresentationRole: boolean = !!String(roleAttributeValue)
                .toLowerCase()
                .match(/\bpresentation\b/);
            const isEmptyAlt: boolean = isEmpty(altAttribute) || getStringLiteral(altAttribute) === '';
            const isEmptyTitle: boolean = isEmpty(titleAttribute) || getStringLiteral(titleAttribute) === '';
            const isAltImageFileName: boolean = !isEmptyAlt && IMAGE_FILENAME_REGEX.test(getStringLiteral(altAttribute) || '');
            // <img alt='altValue' role='presentation' />
            if (!isEmptyAlt && isPresentationRole && !ctx.options.allowNonEmptyAltWithRolePresentation && !titleAttribute) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureStringNonEmptyAltAndPresentationRole(tagName));
            } else if (isEmptyAlt && !isPresentationRole && !titleAttribute) {
                // <img alt='' />
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureStringEmptyAltAndNotPresentationRole(tagName));
            } else if (isEmptyAlt && titleAttribute && !isEmptyTitle) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureStringEmptyAltAndNotEmptyTitle(tagName));
            } else if (isAltImageFileName) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureStringAltIsImageFileName(tagName));
            }
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxElement(node)) {
            checkJsxOpeningElement(node.openingElement);
        } else if (tsutils.isJsxSelfClosingElement(node)) {
            checkJsxOpeningElement(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
