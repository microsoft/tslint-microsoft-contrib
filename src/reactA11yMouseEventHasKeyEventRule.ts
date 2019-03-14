import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';

const MOUSE_EVENTS: {
    onMouseOver: {
        value: 'onmouseover';
        jsxValue: 'onMouseOver';
    };
    onMouseOut: {
        value: 'onmouseout';
        jsxValue: 'onMouseOut';
    };
} = {
    onMouseOver: {
        value: 'onmouseover',
        jsxValue: 'onMouseOver'
    },
    onMouseOut: {
        value: 'onmouseout',
        jsxValue: 'onMouseOut'
    }
};

const FOCUS_EVENTS: {
    onFocus: {
        value: 'onfocus';
        jsxValue: 'onFocus';
    };
    onBlur: {
        value: 'onblur';
        jsxValue: 'onBlur';
    };
} = {
    onFocus: {
        value: 'onfocus',
        jsxValue: 'onFocus'
    },
    onBlur: {
        value: 'onblur',
        jsxValue: 'onBlur'
    }
};

type MouseEvents = keyof typeof MOUSE_EVENTS;
type FocusEvents = keyof typeof FOCUS_EVENTS;
type AttributeType = { [propName: string]: ts.JsxAttribute };

function getFailureString(mouseEvent: MouseEvents, focusEvent: FocusEvents) {
    return `${mouseEvent} must be accompanied by ${focusEvent}.`;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-mouse-event-has-key-event',
        type: 'maintainability',
        description:
            'For accessibility of your website, elements with mouseOver/mouseOut should be accompanied by onFocus/onBlur keyboard events.',
        rationale: `References:
        <ul>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/59/">Focusable elements with mouseOver should also have onFocus event handlers.</a></li>
          <li><a href="http://oaa-accessibility.org/wcag20/rule/60/">Focusable elements with onMouseOut should also have onBlur event handlers.</a></li>
        </ul>`,
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        function checkMouseEventForFocus(
            mouseEvent: typeof MOUSE_EVENTS.onMouseOver | typeof MOUSE_EVENTS.onMouseOut,
            focusEvent: typeof FOCUS_EVENTS.onBlur | typeof FOCUS_EVENTS.onFocus
        ): void {
            const attributes: AttributeType = getJsxAttributesFromJsxElement(node);

            if (attributes === undefined) {
                return;
            }

            const attributeKeys = Object.keys(attributes);
            if (attributeKeys.indexOf(mouseEvent.value) !== -1 && attributeKeys.indexOf(focusEvent.value) === -1) {
                const errorMessage = getFailureString(mouseEvent.jsxValue, focusEvent.jsxValue);
                ctx.addFailureAt(node.getStart(), node.getWidth(), errorMessage);
            }
        }

        if (tsutils.isJsxSelfClosingElement(node) || tsutils.isJsxOpeningElement(node)) {
            checkMouseEventForFocus(MOUSE_EVENTS.onMouseOver, FOCUS_EVENTS.onFocus);
            checkMouseEventForFocus(MOUSE_EVENTS.onMouseOut, FOCUS_EVENTS.onBlur);
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
