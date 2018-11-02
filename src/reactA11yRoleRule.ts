/**
 * Elements with aria roles must use a **valid**, **non-abstract** aria role
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getPropName, getStringLiteral, isEmpty } from './utils/JsxAttribute';
import { IRole, IRoleSchema } from './utils/attributes/IRole';

// tslint:disable-next-line:no-require-imports no-var-requires
const ROLE_SCHEMA: IRoleSchema = require('./utils/attributes/roleSchema.json');
const ROLES: { [key: string]: IRole } = ROLE_SCHEMA.roles;

// The array of non-abstract valid rules.
const VALID_ROLES: string[] = Object.keys(ROLES).filter(role => ROLES[role].isAbstract === false);

export function getFailureStringUndefinedRole(): string {
    return (
        "'role' attribute empty. Either select a role from https://www.w3.org/TR/wai-aria/roles#role_definitions, " +
        'or simply remove this attribute'
    );
}

export function getFailureStringInvalidRole(invalidRoleName: string): string {
    return `Invalid role attribute value '${invalidRoleName}', elements with ARIA roles must use a valid, \
non-abstract ARIA role. A reference to role definitions can be found at \
https://www.w3.org/TR/wai-aria/roles#role_definitions.`;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-role',
        type: 'maintainability',
        description: 'Elements with aria roles must use a **valid**, **non-abstract** aria role.',
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
            ? this.applyWithWalker(new A11yRoleRuleWalker(sourceFile, this.getOptions()))
            : [];
    }
}

class A11yRoleRuleWalker extends Lint.RuleWalker {
    public visitJsxAttribute(node: ts.JsxAttribute): void {
        const name = getPropName(node);

        if (!name || name.toLowerCase() !== 'role') {
            return;
        }

        const roleValue = getStringLiteral(node);

        if (roleValue) {
            // Splitted by space doesn't mean the multiple role definition is correct,
            // just because this rule is not checking if it is using multiple role definition.
            const normalizedValues: string[] = roleValue.toLowerCase().split(' ');

            if (normalizedValues.some(value => !!(value && VALID_ROLES.indexOf(value) === -1))) {
                this.addFailureAt(node.getStart(), node.getWidth(), getFailureStringInvalidRole(roleValue));
            }
        } else if (roleValue === '' || isEmpty(node)) {
            this.addFailureAt(node.getStart(), node.getWidth(), getFailureStringUndefinedRole());
        }

        super.visitJsxAttribute(node);
    }
}
