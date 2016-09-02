import { TestHelper } from './TestHelper';
import {
  getFailureStringForImplicitRole,
  getFailureStringForNotImplicitRole
} from '../src/a11yRoleSupportsAriaPropsRule';

/**
 * Unit test for a11y-role-supports-aria-props rule.
 */
describe('a11yRoleSupportsAriaPropsRule', () => {
  const ruleName: string = 'a11y-role-supports-aria-props';

  describe('should pass', () => {
    describe('implicit role test', () => {
      const fileDirectory: string = 'test-data/a11yRoleSupportsAriaProps/PassingTestInputs/ImplicitRoleTestInputs/';

      it('when a tag implicit role is link', () => {
        const fileName: string = fileDirectory + 'a/ImplicitLinkRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when area tag implicit role is link', () => {
        const fileName: string = fileDirectory + 'area/ImplicitLinkRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when img tag implicit role is img', () => {
        const fileName: string = fileDirectory + 'img/ImplicitImgRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when img tag implicit role is presentation', () => {
        const fileName: string = fileDirectory + 'img/ImplicitPresentationRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when input tag implicit role is button', () => {
        const fileName: string = fileDirectory + 'input/ImplicitButtonRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when input tag implicit role is checkbox', () => {
        const fileName: string = fileDirectory + 'input/ImplicitCheckboxRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when input tag implicit role is slider', () => {
        const fileName: string = fileDirectory + 'input/ImplicitSliderRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when input tag implicit role is textbox', () => {
        const fileName: string = fileDirectory + 'input/ImplicitTextboxRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when input tag implicit role is radio', () => {
        const fileName: string = fileDirectory + 'input/ImplicitRadioRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when link tag implicit role is link', () => {
        const fileName: string = fileDirectory + 'link/ImplicitLinkRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when menu tag implicit role is toolbar', () => {
        const fileName: string = fileDirectory + 'menu/ImplicitToolbarRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when menuitem tag implicit role is menuitemcheckbox', () => {
        const fileName: string = fileDirectory + 'menuitem/ImplicitMenuitemcheckboxRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when menuitem tag implicit role is menuitemradio', () => {
        const fileName: string = fileDirectory + 'menuitem/ImplicitMenuitemradioRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when menuitem tag implicit role is menuitem', () => {
        const fileName: string = fileDirectory + 'menuitem/ImplicitMenuitemRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when other tags has implicit role', () => {
        const fileName: string = fileDirectory + 'otherTags.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });
    });

    describe('not implicit role test', () => {
      const fileDirectory: string = 'test-data/a11yRoleSupportsAriaProps/PassingTestInputs/NotImplicitRoleTestInputs/';

      it('when undefined role or empty role value', () => {
        const fileName: string = fileDirectory + 'UndefinedRoleOrEmptyRoleValue.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when not empty role value', () => {
        const fileName: string = fileDirectory + 'NotEmptyRoleValue.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when empty role supports global aria props', () => {
        const fileName: string = fileDirectory + 'GlobalSupportsAriaProp.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });
    });
  });

  describe('should fail', () => {
    const fileDirectory: string = 'test-data/a11yRoleSupportsAriaProps/FailingTestInputs/';

    it('when role name not supports aria prop', () => {
      const fileName: string = fileDirectory + 'RoleNameNotSupportsAriaProp.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 2 },
            failure: getFailureStringForNotImplicitRole(['button'], ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 5 },
            failure: getFailureStringForNotImplicitRole(['button', 'img'], ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 8 },
            failure: getFailureStringForNotImplicitRole(['button'], ['aria-checked'])
          }
        ]
      );
    });

    it('when implicit role not supports aria prop', () => {
      const fileName: string = fileDirectory + 'ImplicitRoleNotSupportsAriaProp.tsx';

      TestHelper.assertViolations(
        ruleName,
        fileName,
        [
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 1 },
            failure: getFailureStringForImplicitRole('a', 'link', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 2 },
            failure: getFailureStringForImplicitRole('area', 'link', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 3 },
            failure: getFailureStringForImplicitRole('link', 'link', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 4 },
            failure: getFailureStringForImplicitRole('img', 'img', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 5 },
            failure: getFailureStringForImplicitRole('menu', 'toolbar', ['aria-checked'])
          },
          {
            name: fileName,
            ruleName: ruleName,
            startPosition: { character: 1, line: 6 },
            failure: getFailureStringForImplicitRole('aside', 'complementary', ['aria-checked'])
          }
        ]
      );
    });
  });
});
