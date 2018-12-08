/**
 * Enforce tabindex value is **not greater than zero**
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';

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
        return sourceFile.languageVariant === ts.LanguageVariant.JSX
            ? this.applyWithWalker(new A11yTabindexNoPositiveWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class A11yTabindexNoPositiveWalker extends Lint.RuleWalker {
    public visitJsxAttribute(node: ts.JsxAttribute): void {
        const name = getPropName(node);

        if (!name || name.toLowerCase() !== 'tabindex') {
            return;
        }

        const literalString = getNumericLiteral(node) || getStringLiteral(node);

        // In case the attribute has no value of empty value.
        if (literalString === '') {
            this.addFailureAt(node.getStart(), node.getWidth(), getFailureString());
        } else if (literalString && literalString !== '-1' && literalString !== '0') {
            this.addFailureAt(node.getStart(), node.getWidth(), getFailureString());
        } else if (isEmpty(node)) {
            this.addFailureAt(node.getStart(), node.getWidth(), getFailureString());
        }
    }
}
