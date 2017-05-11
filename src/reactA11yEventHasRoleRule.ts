/**
 * Elements with event handlers must have role attribute.
 */
import * as ts from 'typescript';
import * as Lint from 'tslint';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';
import { getImplicitRole } from './utils/getImplicitRole';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { IDom } from './utils/attributes/IDom';

// tslint:disable-next-line:no-require-imports no-var-requires
const DOM_SCHEMA: IDom[] = require('./utils/attributes/domSchema.json');
const FAILURE_STRING: string = 'Elements with event handlers must have role attribute.';
const ROLE_STRING: string = 'role';
const TARGET_EVENTS: string[] = ['click', 'keyup', 'keydown', 'keypress', 'mousedown', 'mouseup',
    'mousemove', 'mouseout', 'mouseover', 'onclick', 'onkeyup', 'onkeydown', 'onkeypress', 'onmousedown',
    'onmouseup', 'onmousemove', 'onmouseout', 'onmouseover'];

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-event-has-role',
        type: 'maintainability',
        description: 'Elements with event handlers must have role attribute.',
        options: null,
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
            ? this.applyWithWalker(new ReactA11yEventHasRoleWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class ReactA11yEventHasRoleWalker extends Lint.RuleWalker {
    public visitJsxElement(node: ts.JsxElement): void {
        this.checkJsxOpeningElement(node.openingElement);
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.checkJsxOpeningElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private checkJsxOpeningElement(node: ts.JsxOpeningLikeElement): void {
        const tagName: string = node.tagName.getText();

        if (!DOM_SCHEMA[tagName]) {
            return;
        }

        const attributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const events: string[] = TARGET_EVENTS.filter((eventName: string): boolean => !!attributes[eventName]);
        const hasAriaRole: boolean = !!attributes[ROLE_STRING] || !!getImplicitRole(node);

        if (events.length > 0 && !hasAriaRole) {
            this.addFailureAt(
                node.getStart(),
                node.getWidth(),
                FAILURE_STRING
            );
        }
    }
}
