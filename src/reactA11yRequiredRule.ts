import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement, isEmpty, getBooleanLiteral } from './utils/JsxAttribute';

const FAILURE_STRING: string = 'Required input elements must have an aria-required set to true';
const REQUIRED_STRING: string = 'required';
const ARIA_REQUIRED_STRING = 'aria-required';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-required',
        type: 'functionality',
        description: 'Enforce that required input elements must have aria-required set to true',
        rationale: `References:
        <ul>
          <li><a href="http://www.clarissapeterson.com/2012/11/html5-accessibility/">Acessibility in HTML5</a></li>
        </ul>`,
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
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
        const requiredAttribute: ts.JsxAttribute = attributes[REQUIRED_STRING];

        if (!requiredAttribute) {
            return;
        }

        const ariaRequiredAttribute: ts.JsxAttribute = attributes[ARIA_REQUIRED_STRING];

        if (!ariaRequiredAttribute || isEmpty(ariaRequiredAttribute) || !getBooleanLiteral(ariaRequiredAttribute)) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
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
