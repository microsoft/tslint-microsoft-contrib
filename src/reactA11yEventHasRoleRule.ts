/**
 * Elements with event handlers must have role attribute.
 */
import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';
import { getImplicitRole } from './utils/getImplicitRole';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { IDom } from './utils/attributes/IDom';

// tslint:disable-next-line:no-require-imports no-var-requires
const DOM_SCHEMA: { [key: string]: IDom } = require('./utils/attributes/domSchema.json');
const FAILURE_STRING: string = 'Elements with event handlers must have role attribute.';
const ROLE_STRING: string = 'role';
const TARGET_EVENTS: string[] = [
    'click',
    'keyup',
    'keydown',
    'keypress',
    'mousedown',
    'mouseup',
    'mousemove',
    'mouseout',
    'mouseover',
    'onclick',
    'onkeyup',
    'onkeydown',
    'onkeypress',
    'onmousedown',
    'onmouseup',
    'onmousemove',
    'onmouseout',
    'onmouseover'
];

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-event-has-role',
        type: 'maintainability',
        description: 'Elements with event handlers must have role attribute.',
        rationale: `References:
        <ul>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/94">WCAG Rule 94</a></li>
          <li><a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role">
            Using the button role
          </a></li>
        </ul>
        `,
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
    function checkJsxOpeningElement(node: ts.JsxOpeningLikeElement): void {
        const tagName: string = node.tagName.getText();

        if (!DOM_SCHEMA[tagName]) {
            return;
        }

        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const events: string[] = TARGET_EVENTS.filter((eventName: string): boolean => !!attributes[eventName]);
        const hasAriaRole: boolean = !!attributes[ROLE_STRING] || !!getImplicitRole(node);

        if (events.length > 0 && !hasAriaRole) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING);
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
