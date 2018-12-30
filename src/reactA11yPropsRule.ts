/**
 * Enforce all `aria-*` attributes are valid.
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getPropName } from './utils/JsxAttribute';
import { IAria } from './utils/attributes/IAria';

// tslint:disable-next-line:no-require-imports no-var-requires
const ARIA_SCHEMA: { [attributeName: string]: IAria } = require('./utils/attributes/ariaSchema.json');

export function getFailureString(name: string): string {
    return `This attribute name '${name}' is an invalid ARIA attribute. \
A reference to valid ARIA attributes can be found at \
https://www.w3.org/TR/2014/REC-wai-aria-20140320/states_and_properties#state_prop_def `;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-props',
        type: 'maintainability',
        description: 'Enforce all `aria-*` attributes are valid. Elements cannot use an invalid `aria-*` attribute.',
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
            if (!name || !name.match(/^aria-/i)) {
                return;
            }

            if (!ARIA_SCHEMA[name.toLowerCase()]) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureString(name));
            }
        } else {
            return ts.forEachChild(node, cb);
        }
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
