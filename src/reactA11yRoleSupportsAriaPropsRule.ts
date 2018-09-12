/**
 * Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getImplicitRole } from './utils/getImplicitRole';
import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';
import { IRole, IRoleSchema } from './utils/attributes/IRole';
import { IAria } from './utils/attributes/IAria';

// tslint:disable:no-require-imports no-var-requires
const ROLE_SCHEMA: IRoleSchema = require('./utils/attributes/roleSchema.json');
const ARIA_ATTRIBUTES: { [attributeName: string]: IAria } = require('./utils/attributes/ariaSchema.json');
// tslint:enable:no-require-imports no-var-requires

const ROLES: IRole[] = ROLE_SCHEMA.roles;
const ROLE_STRING: string = 'role';

export function getFailureStringForNotImplicitRole(roleNamesInElement: string[], invalidPropNames: string[]): string {
    return `Attribute(s) ${invalidPropNames.join(', ')} are not supported by role(s) ${roleNamesInElement.join(', ')}. \
You are using incorrect role or incorrect aria-* attribute`;
}

export function getFailureStringForImplicitRole(tagName: string, roleName: string, invalidPropNames: string[]): string {
    return `Attribute(s) ${invalidPropNames.join(', ')} not supported \
by role ${roleName} which is implicitly set by the HTML tag ${tagName}.`;
}

export function getFailureStringForNoRole(tagName: string, invalidPropNames: string[]): string {
    return `Attribute(s) ${invalidPropNames} are not supported by no corresponding role. \
There is no corresponding role for the HTML tag ${tagName}. \
A reference about no corresponding role: https://www.w3.org/TR/html-aria/#dfn-no-corresponding-role.`;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-role-supports-aria-props',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Enforce that elements with explicit or implicit roles defined contain ' +
        'only `aria-*` properties supported by that `role`.',
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
            ? this.applyWithWalker(new A11yRoleSupportsAriaPropsWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class A11yRoleSupportsAriaPropsWalker extends Lint.RuleWalker {
    public visitJsxElement(node: ts.JsxElement): void {
        this.checkJsxElement(node.openingElement);
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.checkJsxElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private checkJsxElement(node: ts.JsxOpeningLikeElement): void {
        const attributesInElement: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const roleProp: ts.JsxAttribute = attributesInElement[ROLE_STRING];
        let roleValue: string | undefined;

        // Match react custom element whose tag name starts with uppercase character.
        if (node.tagName.getText().match(/^[A-Z].*/)) {
            return;
        }
        if (roleProp != null) {
            roleValue = getStringLiteral(roleProp);
            if (!isEmpty(roleProp) && roleValue == null) { // Do NOT check if can't retrieve the right role.
                return;
            }
        } else {
            roleValue = getImplicitRole(node); // Get implicit role if not specified.
        }

        const isImplicitRole: boolean = !roleProp && !!roleValue;
        const normalizedRoles = (roleValue || '').toLowerCase().split(' ')
            .filter((role: string) => role in ROLES);

        let supportedAttributeNames: string[] = ROLE_SCHEMA.globalSupportedProps;

        normalizedRoles.forEach((role) => {
            supportedAttributeNames = supportedAttributeNames.concat((<any>ROLES)[role].additionalSupportedProps || []);
        });

        const attributeNamesInElement: string[] = Object.keys(attributesInElement)
            .filter((attributeName: string) => !!ARIA_ATTRIBUTES[attributeName.toLowerCase()]);

        // Get the list of not-supported aria-* attributes in current element.
        const invalidAttributeNamesInElement: string[] = attributeNamesInElement
            .filter((attributeName: string) => supportedAttributeNames.indexOf(attributeName) === -1);
        let failureString: string;

        if (normalizedRoles.length === 0) {
            failureString = getFailureStringForNoRole(node.tagName.getText(), invalidAttributeNamesInElement);
        } else if (isImplicitRole) {
            failureString = getFailureStringForImplicitRole(
                node.tagName.getText(),
                normalizedRoles[0],
                invalidAttributeNamesInElement
            );
        } else {
            failureString = getFailureStringForNotImplicitRole(normalizedRoles, invalidAttributeNamesInElement);
        }

        if (invalidAttributeNamesInElement.length > 0) {
            this.addFailureAt(
                node.getStart(),
                node.getWidth(),
                failureString
            );
        }
    }
}
