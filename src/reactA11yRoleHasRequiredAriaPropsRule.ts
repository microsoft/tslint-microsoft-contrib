/**
 * Elements with aria roles must have all required attributes according to the role
 */

import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getImplicitRole } from './utils/getImplicitRole';
import {
  getJsxAttributesFromJsxElement,
  getStringLiteral
} from './utils/JsxAttribute';
import { IRole, IRoleSchema } from './utils/attributes/IRole';
import { IAria } from './utils/attributes/IAria';

// tslint:disable-next-line:no-require-imports no-var-requires
const roleSchema: IRoleSchema = require('./utils/attributes/roleSchema.json');
const roles: IRole[] = roleSchema.roles;


// tslint:disable-next-line:no-require-imports no-var-requires
const ariaAttributes: { [attributeName: string]: IAria } = require('./utils/attributes/ariaSchema.json');
const roleString: string = 'role';

export function getFailureStringForNotImplicitRole(
  roleNamesInElement: string[],
  missingProps: string[]
): string {
  return `Element with ARIA role(s) '${roleNamesInElement.join(', ')}' \
are missing required attribute(s): ${missingProps.join(', ')}. \
A reference to role definitions can be found at https://www.w3.org/TR/wai-aria/roles#role_definitions.`;
}

export function getFailureStringForImplicitRole(
  tagName: string,
  roleNamesInElement: string,
  missingProps: string[]
): string {
  return `Tag '${tagName}' has implicit role '${roleNamesInElement}'. \
It requires aria-* attributes: ${missingProps.join(', ')} that are missing in the element. \
A reference to role definitions can be found at https://www.w3.org/TR/wai-aria/roles#role_definitions.`;
}

export class Rule extends Lint.Rules.AbstractRule {
  public static metadata: ExtendedMetadata = {
    ruleName: 'react-a11y-role-has-required-aria-props',
    type: 'maintainability',
    description: 'Elements with aria roles must have all required attributes according to the role.',
    options: null,
    issueClass: 'Non-SDL',
    issueType: 'Warning',
    severity: 'Important',
    level: 'Opportunity for Excellence',
    group: 'Clarity',
    commonWeaknessEnumeration: '398, 710'
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

  private checkJsxElement(node: ts.JsxOpeningElement): void {
    const attributesInElement: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(node);
    const roleProp: ts.JsxAttribute = attributesInElement[roleString];

    // If role attribute is specified, get the role value. Otherwise get the implicit role from tag name.
    const roleValue: string = roleProp ? getStringLiteral(roleProp) : getImplicitRole(node);
    const isImplicitRole: boolean = !roleProp && !!roleValue;
    const normalizedRoles: string[] = (roleValue || '').toLowerCase().split(' ')
      .filter((role: string) => !!roles[role]);

    if (normalizedRoles.length === 0) {
      return;
    }

    let requiredAttributeNames: string[] = [];

    normalizedRoles.forEach((role: string) => {
      requiredAttributeNames = requiredAttributeNames.concat(roles[role].requiredProps || []);
    });

    const attributeNamesInElement: string[] = Object.keys(attributesInElement)
      .filter((attributeName: string) => !!ariaAttributes[attributeName.toLowerCase()]);

    // Get the list of missing required aria-* attributes in current element.
    const missingAttributes: string[] = requiredAttributeNames
      .filter((attributeName: string) => attributeNamesInElement.indexOf(attributeName) === -1);

    if (missingAttributes.length > 0) {
      this.addFailure(this.createFailure(
        node.getStart(),
        node.getWidth(),
        isImplicitRole ?
          getFailureStringForImplicitRole(node.tagName.getText(), normalizedRoles[0], missingAttributes) :
          getFailureStringForNotImplicitRole(normalizedRoles, missingAttributes)
      ));
    }
  }
}
