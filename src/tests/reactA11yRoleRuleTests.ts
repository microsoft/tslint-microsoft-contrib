import { TestHelper } from './TestHelper';
import { getFailureStringInvalidRole } from '../reactA11yRoleRule';

/**
 * Unit tests for a11y-role
 */

// tslint:disable:no-empty
describe('a11yRoleRule', () => {
  const ruleName: string = 'react-a11y-role';

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
            startPosition: { character: 16, line: 3 },
            failure: getFailureStringInvalidRole('myRoleName')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 4 },
            failure: getFailureStringInvalidRole('wrong')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 5 },
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
            startPosition: { character: 16, line: 3 },
            failure: getFailureStringInvalidRole('input')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 4 },
            failure: getFailureStringInvalidRole('landmark')
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 16, line: 5 },
            failure: getFailureStringInvalidRole('structure')
          }
        ]);
    });

    it('when the role name is not defined', () => {
      const fileName: string = `import React = require('react');

/**
 * It makes no sense to write code below.
 */
const a = <div role='' />
const b = <div role />
const c = <div role="" />
const d = <div role={null} />
const e = <div role={undefined} /> `;

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
            {
                "failure": "'role' attribute empty. Either select a role from https://www.w3.org/TR/wai-aria/roles#role" +
                "_definitions, or simply remove this attribute",
                "name": "file.tsx",
                "ruleName": "react-a11y-role",
                "startPosition": { "character": 16, "line": 6 }
            },
            {
                "failure": "'role' attribute empty. Either select a role from https://www.w3.org/TR/wai-aria/roles#role" +
                "_definitions, or simply remove this attribute",
                "name": "file.tsx",
                "ruleName": "react-a11y-role",
                "startPosition": { "character": 16, "line": 7 }
            },
            {
                "failure": "'role' attribute empty. Either select a role from https://www.w3.org/TR/wai-aria/roles#role" +
                "_definitions, or simply remove this attribute",
                "name": 'file.tsx',
                "ruleName": "react-a11y-role",
                "startPosition": { "character": 16, "line": 8 }
            },
            {
                "failure": "'role' attribute empty. Either select a role from https://www.w3.org/TR/wai-aria/roles#role" +
                "_definitions, or simply remove this attribute",
                "name": 'file.tsx',
                "ruleName": "react-a11y-role",
                "startPosition": { "character": 16, "line": 9 }
            },
            {
                "failure": "'role' attribute empty. Either select a role from https://www.w3.org/TR/wai-aria/roles#role" +
                "_definitions, or simply remove this attribute",
                "name": 'file.tsx',
                "ruleName": "react-a11y-role",
                "startPosition": { "character": 16, "line": 10 }
            }
        ]);
    });
  });
});
