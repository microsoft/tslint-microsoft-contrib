import { TestHelper } from './TestHelper';
import { getFailureString } from '../src/a11yPropsRule';

/**
 * Unit tests for aria-props rule.
 */
describe('a11yPropsRule', () => {
  const ruleName: string = 'a11y-props';

  describe('should pass', () => {
    it('when the aria-* attribute name is correct', () => {
      const fileName: string = 'test-data/a11yProps/PassingTestInputs/CorrectAriaAttributeName.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the attribute name is not aria-*', () => {
      const fileName: string = 'test-data/a11yProps/PassingTestInputs/AttributeNotAria.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });
  });

  describe('should fail', () => {
    it('when the aria-* attribute name is not defined', () => {
      const fileName: string = 'test-data/a11yProps/FailingTestInputs/InvalidAriaAttributeName.tsx';
      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 1 },
            failure: getFailureString('aria-')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 2 },
            failure: getFailureString('Aria-')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 3 },
            failure: getFailureString('aria-a')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 4 },
            failure: getFailureString('aria-lable')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 5 },
            failure: getFailureString('aria-la')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 19, line: 5 },
            failure: getFailureString('aria-unchecked')
          }
        ]
      );
    });
  });
});
