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
                "failure": "The value of tabindex attribute is invalid or undefined. It must be either -1 or 0.",
                "name": "test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueUndefined.tsx",
                "ruleName": "react-a11y-tabindex-no-positive",
                "startPosition": { "character": 16, "line": 3 }
            },
            {
                "failure": "The value of tabindex attribute is invalid or undefined. It must be either -1 or 0.",
                "name": "test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueUndefined.tsx",
                "ruleName": "react-a11y-tabindex-no-positive",
                "startPosition": { "character": 16, "line": 4 }
            },
            {
                "failure": "The value of tabindex attribute is invalid or undefined. It must be either -1 or 0.",
                "name": "test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueUndefined.tsx",
                "ruleName": "react-a11y-tabindex-no-positive",
                "startPosition": { "character": 16, "line": 5 }
            },
            {
                "failure": "The value of tabindex attribute is invalid or undefined. It must be either -1 or 0.",
                "name": "test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueUndefined.tsx",
                "ruleName": "react-a11y-tabindex-no-positive",
                "startPosition": { "character": 16, "line": 6 }
            },
            {
                "failure": "The value of tabindex attribute is invalid or undefined. It must be either -1 or 0.",
                "name": "test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueUndefined.tsx",
                "ruleName": "react-a11y-tabindex-no-positive",
                "startPosition": { "character": 16, "line": 7 }
            },
            {
                "failure": "The value of tabindex attribute is invalid or undefined. It must be either -1 or 0.",
                "name": "test-data/a11yTabindexNoPositive/FailingTestInputs/TabindexValueUndefined.tsx",
                "ruleName": "react-a11y-tabindex-no-positive",
                "startPosition": { "character": 16, "line": 8 }
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
            startPosition: { character: 16, line: 3 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 4 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 5 },
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
            startPosition: { character: 16, line: 3 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 4 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 5 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 6 },
            failure: getFailureString()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 7 },
            failure: getFailureString()
          }
        ]
      );
    });
  });
});
