import { TestHelper } from './TestHelper';
import { getFailureString } from '../src/reactA11yTabindexNoPositiveRule';

/**
 * Unit test for tabindex-no-positive
 */
describe('a11yTabindexNoPositive', () => {
  const ruleName: string = 'react-a11y-tabindex-no-positive';

  describe('should pass', () => {
    it('when the attribute name is not tabindex', () => {
      const fileName: string = 'test-data/a11yTabindexNoPositive/PassingTestInputs/AttributeNotTabindex.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the tabindex value is not string or numeric literal', () => {
      const fileName: string =
        'test-data/a11yTabindexNoPositive/PassingTestInputs/TabindexValueNotLiteral.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the tabindex value is -1 or 0', () => {
      const fileName: string = 'test-data/a11yTabindexNoPositive/PassingTestInputs/CorrectTabindexValue.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });
  });

  describe('should fail', () => {
    it('when the tabindex value is undefined', () => {
      const fileName: string =
        'test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueUndefined.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 1 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 2 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 3 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 4 },
            failure: getFailureString()
          }
        ]
      );
    });

    it('when tabindex value is not a number', () => {
      const fileName: string = 'test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueNotNumericLiteral.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 1 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 2 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 3 },
            failure: getFailureString()
          }
        ]
      );
    });

    it('when the tabindex value is not -1 or 0', () => {
      const fileName: string = 'test-data/a11yTabindexNoPositive/FailingTestInputs/InvalidTabindexValue.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 1 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 2 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 3 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 4 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 5 },
            failure: getFailureString()
          }
        ]
      );
    });
  });
});
