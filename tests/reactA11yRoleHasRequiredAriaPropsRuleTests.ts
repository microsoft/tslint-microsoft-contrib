import { TestHelper } from './TestHelper';
import { getFailureStringForNotImplicitRole } from '../src/reactA11yRoleHasRequiredAriaPropsRule';

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

    it('when the slider role missing required props', () => {
      const fileName: string = fileDirectory + 'SliderRoleMissingRequiredProps.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNotImplicitRole(
              ['slider'],
              ['aria-valuemax', 'aria-valuemin', 'aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(
              ['slider'],
              ['aria-valuemax', 'aria-valuemin', 'aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 5 },
            failure: getFailureStringForNotImplicitRole(
              ['slider'],
              ['aria-valuenow']
            )
          }
        ]
      );
    });

    it('when the spinbutton role missing required props', () => {
      const fileName: string = fileDirectory + 'SpinbuttonRoleMissingRequiredProps.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNotImplicitRole(
              ['spinbutton'],
              ['aria-valuemax', 'aria-valuemin', 'aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(
              ['button', 'spinbutton'],
              ['aria-valuemax', 'aria-valuemin', 'aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 5 },
            failure: getFailureStringForNotImplicitRole(
              ['spinbutton'],
              ['aria-valuemin']
            )
          }
        ]
      );
    });

    it('when the checkbox role missing required props', () => {
      const fileName: string = fileDirectory + 'CheckboxRoleMissingRequiredProps.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNotImplicitRole(['checkbox'], ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(['checkbox'], ['aria-checked'])
          }
        ]
      );
    });

    it('when the combobox role missing required props', () => {
      const fileName: string = fileDirectory + 'ComboboxRoleMissingRequiredProps.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNotImplicitRole(['combobox'], ['aria-expanded'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(['combobox'], ['aria-expanded'])
          }
        ]
      );
    });

    it('when the scrollbar role missing required props', () => {
      const fileName: string = fileDirectory + 'ScrollbarRoleMissingRequiredProps.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNotImplicitRole(
              ['scrollbar'],
              ['aria-controls', 'aria-orientation', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(
              ['scrollbar'],
              ['aria-controls', 'aria-orientation', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 5 },
            failure: getFailureStringForNotImplicitRole(
              ['scrollbar'],
              ['aria-valuemin', 'aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 6 },
            failure: getFailureStringForNotImplicitRole(
              ['scrollbar'],
              ['aria-valuenow']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 7 },
            failure: getFailureStringForNotImplicitRole(
              ['scrollbar'],
              ['aria-controls']
            )
          }
        ]
      );
    });

    it('when multiple role missing requiredProps', () => {
      const fileName: string = fileDirectory + 'MultipleRoleMissingRequiredProps.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNotImplicitRole(['button', 'checkbox'], ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(
              ['button', 'checkbox', 'combobox'],
              ['aria-checked', 'aria-expanded']
            )
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 5 },
            failure: getFailureStringForNotImplicitRole(['button', 'checkbox', 'combobox'], ['aria-expanded'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 6 },
            failure: getFailureStringForNotImplicitRole(['button', 'checkbox', 'combobox'], ['aria-checked'])
          }
        ]
      );
    });
  });
});
