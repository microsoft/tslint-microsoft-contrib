/**
 * Enforce tabindex value is **not greater than zero**
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getPropName, getStringLiteral, getNumericLiteral, isEmpty } from './utils/JsxAttribute';

export function getFailureString(): string {
    return 'The value of tabindex attribute is invalid or undefined. It must be either -1 or 0.';
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-tabindex-no-positive',
        type: 'maintainability',
        description: 'Enforce tabindex value is **not greater than zero**.',
        rationale: `References:
        <ul>
          <li><a href="https://www.w3.org/TR/2008/REC-WCAG20-20081211/#navigation-mechanisms-focus-order">WCAG 2.4.3 - Focus Order</a></li>
          <li><a href="https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#tabindex-usage">Audit Rules - tabindex-usage</a></li>
          <li><a href="https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_03">Avoid positive integer values for tabIndex</a></li>
        </ul>`,
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
        return sourceFile.languageVariant === ts.LanguageVariant.JSX ? this.applyWithFunction(sourceFile, walk) : [];
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isJsxAttribute(node)) {
            const name = getPropName(node);

            if (!name || name.toLowerCase() !== 'tabindex') {
                return;
            }

            const literalString = getNumericLiteral(node) || getStringLiteral(node);

            // In case the attribute has no value of empty value.
            if (literalString === '') {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureString());
            } else if (literalString && literalString !== '-1' && literalString !== '0') {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureString());
            } else if (isEmpty(node)) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureString());
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
