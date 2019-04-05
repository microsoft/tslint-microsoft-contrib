import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';

interface Options {
    additionalTagNames: string[];
}

/**
 * Implementation of the react-a11y-no-onchange rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-no-onchange',
        type: 'functionality',
        description: 'For accessibility of your website, enforce usage of onBlur over onChange on select menus.',
        rationale: `References:
        <ul>
          <li><a href="http://cita.disability.uiuc.edu/html-best-practices/auto/onchange.php">OnChange Event Accessibility Issues</a></li>
          <li><a href="https://www.w3.org/TR/WCAG10/wai-pageauth.html#gl-own-interface">Guideline 8. Ensure direct accessibility of embedded user interfaces.</a></li>
        </ul>
        `,
        options: 'string[]',
        optionsDescription: 'Additional tag names to validate.',
        optionExamples: ['true', '[true, ["Select"]]'],
        typescriptOnly: false,
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
            additionalTagNames: Array.isArray(args) && args.length > 0 ? args[0] : []
        };
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    function checkJsxOpeningElement(node: ts.JsxOpeningLikeElement) {
        const tagName: string = node.tagName.getText();

        const targetTagNames: string[] = ['select', ...ctx.options.additionalTagNames];

        if (!tagName || targetTagNames.indexOf(tagName) === -1) {
            return;
        }

        const attributes = getJsxAttributesFromJsxElement(node);
        if (attributes.hasOwnProperty('onchange') && !attributes.hasOwnProperty('onblur')) {
            const errorMessage = `onChange event handler should not be used with the <${tagName}>. Please use onBlur instead.`;
            ctx.addFailureAt(node.getStart(), node.getWidth(), errorMessage);
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node)) {
            checkJsxOpeningElement(node);
        } else if (tsutils.isJsxElement(node)) {
            checkJsxOpeningElement(node.openingElement);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
