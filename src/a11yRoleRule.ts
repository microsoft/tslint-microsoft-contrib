/**
 * @copyright Microsoft Corporation. All rights reserved.
 *
 * @a11yRole tslint rule for accessibility.
 */

import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import { getPropName, getStringLiteral } from './utils/JsxAttribute';
import { IRole, IRoleSchema } from './utils/attributes/IRole';

// tslint:disable-next-line:no-require-imports no-var-requires
const roleSchema: IRoleSchema = require('./utils/attributes/roleSchema.json');
const roles: IRole[] = roleSchema.roles;

// The array of non-abstract valid rules.
const validRoles: string[] = Object.keys(roles).filter(role => roles[role].isAbstract === false);

export function getFailureStringUndefinedRole(): string {
  return '\'role\' attribute empty. Either select a role from https://www.w3.org/TR/wai-aria/roles#role_definitions, ' +
    'or simply remove this attribute';
}

export function getFailureStringInvalidRole(invalidRoleName: string): string {
  return `Invalid role attribute value '${invalidRoleName}', elements with ARIA roles must use a valid, \
non-abstract ARIA role. A reference to role definitions can be found at \
https://www.w3.org/TR/wai-aria/roles#role_definitions.`;
}

export class Rule extends Lint.Rules.AbstractRule {
  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return sourceFile.languageVariant === ts.LanguageVariant.JSX
      ? this.applyWithWalker(new A11yRoleRuleWalker(sourceFile, this.getOptions()))
      : [];
  }
}

class A11yRoleRuleWalker extends Lint.RuleWalker {
  public visitJsxAttribute(node: ts.JsxAttribute): void {
    const name: string = getPropName(node);

    if (!name || name.toLowerCase() !== 'role') {
      return;
    }

    const roleValue: string = getStringLiteral(node);

    if (roleValue) {
      // Splitted by space doesn't mean the multiple role definition is correct,
      // just because this rule is not checking if it is using multiple role definition.
      const normalizedValues: string[] = roleValue.toLowerCase().split(' ');

      if (normalizedValues.some(value => value && validRoles.indexOf(value) === -1)) {
        this.addFailure(this.createFailure(
          node.getStart(),
          node.getWidth(),
          getFailureStringInvalidRole(roleValue)
        ));
      }
    } else if (roleValue === '') {
      this.addFailure(this.createFailure(
        node.getStart(),
        node.getWidth(),
        getFailureStringUndefinedRole()
      ));
    }

    super.visitJsxAttribute(node);
  }
}
