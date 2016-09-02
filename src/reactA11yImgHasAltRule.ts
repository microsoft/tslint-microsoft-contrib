import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import {
  getAllAttributesFromJsxElement,
  getJsxAttributesFromJsxElement,
  getStringLiteral
} from './utils/JsxAttribute';
import { isJsxSpreadAttribute } from './utils/TypeGuard';

const roleString: string = 'role';
const altString: string = 'alt';

export function getFailureStringNoAlt(tagName: string): string {
  return `<${tagName}> elements must have an alt attribute or use role='presentation' for presentational images. \
A reference for the presentation role can be found at https://www.w3.org/TR/wai-aria/roles#presentation.`;
}

export function getFailureStringEmptyAlt(tagName: string): string {
  return `The value of 'alt' attribute in <${tagName}> tag is undefined or empty. \
Add more details in 'alt' attribute or use role='presentation' for presentational images. \
A reference for the presentation role can be found at https://www.w3.org/TR/wai-aria/roles#presentation.`;
}

/**
 * Enforces that img elements have alt text.
 */
export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'react-a11y-img-has-alt',
    type: 'maintainability',
    description: 'Enforce that an `img` element contains the `alt` attribute or `role=\'presentation\'` for decorative image.',
    options: 'string[]',
    optionExamples: ['[true, [\'Image\']]'],
    issueClass: 'Non-SDL',
    issueType: 'Warning',
    severity: 'Important',
    level: 'Opportunity for Excellence',
    group: 'Accessibility'
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return sourceFile.languageVariant === ts.LanguageVariant.JSX
      ? this.applyWithWalker(new ImgHasAltWalker(sourceFile, this.getOptions()))
      : [];
  }
}

class ImgHasAltWalker extends Lint.RuleWalker {
  public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
    // Tag name is sensitive on lowercase or uppercase, we shoudn't normalize tag names in this rule.
    const tagName: string = node.tagName && node.tagName.getText();
    const options: any[] = this.getOptions(); // tslint:disable-line:no-any

    // The additionalTagNames are specified by tslint config to check not only 'img' tag but also customized tag.
    // @example checking a customized component 'Image' which should require 'alt' attribute.
    const additionalTagNames: string[] = options.length > 1 ? options[1] : [];

    // The targetTagNames is the list of tag names we want to check.
    const targetTagNames: string[] = ['img'].concat(additionalTagNames);

    if (!tagName || targetTagNames.indexOf(tagName) === -1) {
      return;
    }

    // If element contains JsxSpreadElement in which there could possibly be alt attribute, don't check it.
    if (getAllAttributesFromJsxElement(node).some(isJsxSpreadAttribute)) {
      return;
    }

    const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
    const role: ts.JsxAttribute = attributes[roleString];
    const roleValue: string = role && getStringLiteral(role);

    // if <img> element has role of 'presentation', it's presentational image, don't check it;
    // @example <img role='presentation' />
    if (roleValue && roleValue.match(/\bpresentation\b/)) {
      return;
    }

    const altProp: ts.JsxAttribute = attributes[altString];

    if (!altProp) {
      this.addFailure(this.createFailure(
        node.getStart(),
        node.getWidth(),
        getFailureStringNoAlt(tagName)
      ));
    } else if (getStringLiteral(altProp) === '') {
      this.addFailure(this.createFailure(
        altProp.getStart(),
        altProp.getWidth(),
        getFailureStringEmptyAlt(tagName)
      ));
    }

    super.visitJsxSelfClosingElement(node);
  }
}
