import { TestHelper } from './TestHelper';
import {
  getFailureStringForNotImplicitRole,
  getFailureStringForImplicitRole
} from '../reactA11yRoleHasRequiredAriaPropsRule';

/**
 * Unit test for a11y-role-has-required-aria-props rule
 */
describe('a11yRoleHasRequiredAriaPropsRule', () => {
  const ruleName: string = 'react-a11y-role-has-required-aria-props';

  describe('should pass', () => {
    const fileDirectory: string = 'test-data/a11yRoleHasRequiredAriaProps/PassingTestInputs/';

    it('when the attribute has no valid role', () => {
      const fileName: string = fileDirectory + 'AttributeHasNoValidRole.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the role value is not string', () => {
      const fileName: string = fileDirectory + 'RoleValueNotLiteralString.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the role value has no required props', () => {
      const fileName: string = fileDirectory + 'RoleHasNoRequiredProps.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the role value and attributes have required props', () => {
      const fileName: string = fileDirectory + 'RoleValueAndAttributesHaveRequiredProps.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });
  });

  describe('should fail', () => {
    const fileDirectory: string = 'test-data/a11yRoleHasRequiredAriaProps/FailingTestInputs/';

    it('when explcit role missing required props', () => {
      const fileName: string = fileDirectory + 'ExplicitRoleMissingRequiredProps.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNotImplicitRole(
              ['checkbox'],
              ['aria-checked']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(
              ['menuitemcheckbox'],
              ['aria-checked']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 5 },
            failure: getFailureStringForNotImplicitRole(
              ['radio'],
              ['aria-checked']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 6 },
            failure: getFailureStringForNotImplicitRole(
              ['spinbutton'],
              ['aria-valuemax', 'aria-valuemin', 'aria-valuenow']
            )
          }
        ]
      );
    });

    it('when implicit role missing required props', () => {
      const fileName: string = `import React = require('react');

const a = <input type='text' list />
const b = <menuitem type='radio' />`;

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: 'file.tsx',
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForImplicitRole(
              'input',
              'combobox',
              ['aria-expanded', 'aria-controls']
            )
          },
          {
            name: 'file.tsx',
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForImplicitRole(
              'menuitem',
              'menuitemradio',
              ['aria-checked']
            )
          }
        ]
      );
    });
  });
});
