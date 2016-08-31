import { TestHelper } from './TestHelper';
import { getFailureStringInvalidRole, getFailureStringUndefinedRole } from '../src/a11yRoleRule';

/**
 * Unit tests for a11y-role
 */

// tslint:disable:no-empty
describe('a11yRoleRule', () => {
  const ruleName: string = 'a11y-role';

  describe('should pass', () => {
    it('when the role name is correct', () => {
      const fileName: string = 'test-data/a11yRole/PassingTestInputs/CorrectName.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the attribute name is not role', () => {
      const fileName: string = 'test-data/a11yRole/PassingTestInputs/AttributeNotRole.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('when the role name is not string literal', () => {
      const fileName: string = 'test-data/a11yRole/PassingTestInputs/RoleNameNotStringLiteral.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });

    it('for multiple correct role names', () => {
      const fileName: string = 'test-data/a11yRole/PassingTestInputs/MultipleCorrectRole.tsx';
      TestHelper.assertNoViolation(ruleName, fileName);
    });
  });

  describe('should fail', () => {
    it('for role name not existant', () => {
      const fileName: string = 'test-data/a11yRole/FailingTestInputs/InvalidRole.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 1 },
            failure: getFailureStringInvalidRole('myRoleName')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 2 },
            failure: getFailureStringInvalidRole('wrong')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 3 },
            failure: getFailureStringInvalidRole('role')
          }
        ]);
    });

    it('for role name that is abstract', () => {
      const fileName: string = 'test-data/a11yRole/FailingTestInputs/AbstractRole.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 1 },
            failure: getFailureStringInvalidRole('input')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 2 },
            failure: getFailureStringInvalidRole('landmark')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 3 },
            failure: getFailureStringInvalidRole('structure')
          }
        ]);
    });

    it('when the role name is not defined', () => {
      const fileName: string = 'test-data/a11yRole/FailingTestInputs/UndefinedRole.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 4 },
            failure: getFailureStringUndefinedRole()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 5 },
            failure: getFailureStringUndefinedRole()
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 6, line: 6 },
            failure: getFailureStringUndefinedRole()
          }
        ]);
    });
  });
});
