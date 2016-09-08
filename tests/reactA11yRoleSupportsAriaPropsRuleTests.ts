import { TestHelper } from './TestHelper';
import {
  getFailureStringForNoRole,
  getFailureStringForImplicitRole,
  getFailureStringForNotImplicitRole
} from '../src/reactA11yRoleSupportsAriaPropsRule';

/**
 * Unit test for a11y-role-supports-aria-props rule.
 */
describe('a11yRoleSupportsAriaPropsRule', () => {
  const ruleName: string = 'react-a11y-role-supports-aria-props';

  describe('should pass', () => {
    const fileDirectory: string = 'test-data/a11yRoleSupportsAriaProps/PassingTestInputs/';

    it('when empty role supports all aria props in element', () => {
      const fileName: string = fileDirectory + 'EmptyRoleSupportsAllAriaPropsInElement.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when explicit role supports all aria props in element', () => {
      const fileName: string = fileDirectory + 'ExplicitRoleSupportsAllAriaPropsInElement.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when implicit role supports all aria props in element', () => {
      const fileName: string = fileDirectory + 'ImplicitRoleSupportsAllAriaPropsInElement.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });
  });

  describe('should fail', () => {
    const fileDirectory: string = 'test-data/a11yRoleSupportsAriaProps/FailingTestInputs/';

    it('when element has not supported aria props for empty role', () => {
      const fileName: string = fileDirectory + 'ElementHasNotSupportedAriaPropsForEmptyRole.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForNoRole('div', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNoRole('a', ['aria-checked'])
          }
        ]
      );
    });

    it('when element has not supported aria props for implicit role', () => {
      const fileName: string = fileDirectory + 'ElementHasNotSupportedAriaPropsForImplicitRole.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 3 },
            failure: getFailureStringForImplicitRole('a', 'link', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForImplicitRole('area', 'link', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 5 },
            failure: getFailureStringForImplicitRole('link', 'link', ['aria-checked'])
          }
        ]
      );
    });

    it('when element has not supported aria props for explicit role', () => {
      const fileName: string = fileDirectory + 'ElementHasNotSupportedAriaPropsForExplicitRole.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 4 },
            failure: getFailureStringForNotImplicitRole(['button'], ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 7 },
            failure: getFailureStringForNotImplicitRole(['button', 'img'], ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 11, line: 10 },
            failure: getFailureStringForNotImplicitRole(['button'], ['aria-checked'])
          }
        ]
      );
    });
  });
});
