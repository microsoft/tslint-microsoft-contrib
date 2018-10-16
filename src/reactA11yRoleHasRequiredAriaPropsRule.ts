/**
 * Elements with aria roles must have all required attributes according to the role
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getImplicitRole } from './utils/getImplicitRole';
import {
    getJsxAttributesFromJsxElement,
    getStringLiteral
} from './utils/JsxAttribute';
import { IRole, IRoleSchema } from './utils/attributes/IRole';
import { IAria } from './utils/attributes/IAria';

// tslint:disable-next-line:no-require-imports no-var-requires
const ROLES_SCHEMA: IRoleSchema = require('./utils/attributes/roleSchema.json');
const ROLES: IRole[] = ROLES_SCHEMA.roles;

// tslint:disable-next-line:no-require-imports no-var-requires
const ARIA_ATTRIBUTES: { [attributeName: string]: IAria } = require('./utils/attributes/ariaSchema.json');
const ROLE_STRING: string = 'role';

// h1-h6 tags have implicit role heading with aria-level attribute.
const TAGS_WITH_ARIA_LEVEL: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export function getFailureStringForNotImplicitRole(roleNamesInElement: string[],
                                                   missingProps: string[]): string {
    return `Element with ARIA role(s) '${roleNamesInElement.join(', ')}' \
are missing required attribute(s): ${missingProps.join(', ')}. \
A reference to role definitions can be found at https://www.w3.org/TR/wai-aria/roles#role_definitions.`;
}

export function getFailureStringForImplicitRole(tagName: string,
                                                roleNamesInElement: string,
                                                missingProps: string[]): string {
    return `Tag '${tagName}' has implicit role '${roleNamesInElement}'. \
It requires aria-* attributes: ${missingProps.join(', ')} that are missing in the element. \
A reference to role definitions can be found at https://www.w3.org/TR/wai-aria/roles#role_definitions.`;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-role-has-required-aria-props',
        type: 'maintainability',
        description: 'Elements with aria roles must have all required attributes according to the role.',
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
            ? this.applyWithWalker(new A11yRoleHasRequiredAriaPropsWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class A11yRoleHasRequiredAriaPropsWalker extends Lint.RuleWalker {
    public visitJsxElement(node: ts.JsxElement): void {
        this.checkJsxElement(node.openingElement);
        super.visitJsxElement(node);
    }

    public visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.checkJsxElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private checkJsxElement(node: ts.JsxOpeningLikeElement): void {
        const tagName: string = node.tagName.getText();
        const attributesInElement: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
        const roleProp: ts.JsxAttribute = attributesInElement[ROLE_STRING];

        // If role attribute is specified, get the role value. Otherwise get the implicit role from tag name.
        const roleValue = roleProp ? getStringLiteral(roleProp) : getImplicitRole(node);
        const isImplicitRole: boolean = !roleProp && !!roleValue;
        const normalizedRoles: string[] = (roleValue || '').toLowerCase().split(' ')
            .filter((role: string) => !!(<any>ROLES)[role]);

        if (normalizedRoles.length === 0) {
            return;
        }

        let requiredAttributeNames: string[] = [];

        normalizedRoles.forEach((role: string) => {
            requiredAttributeNames = requiredAttributeNames.concat((<any>ROLES)[role].requiredProps || []);
        });

        const attributeNamesInElement: string[] = Object.keys(attributesInElement)
            .filter((attributeName: string) => !!ARIA_ATTRIBUTES[attributeName.toLowerCase()])
            // h1-h6 tags have aria-level
            .concat(TAGS_WITH_ARIA_LEVEL.indexOf(tagName) === -1 ? [] : ['aria-level']);

        // Get the list of missing required aria-* attributes in current element.
        const missingAttributes: string[] = requiredAttributeNames
            .filter((attributeName: string) => attributeNamesInElement.indexOf(attributeName) === -1);

        if (missingAttributes.length > 0) {
            this.addFailureAt(
                node.getStart(),
                node.getWidth(),
                isImplicitRole ?
                    getFailureStringForImplicitRole(node.tagName.getText(), normalizedRoles[0], missingAttributes) :
                    getFailureStringForNotImplicitRole(normalizedRoles, missingAttributes)
            );
        }
    }
}
