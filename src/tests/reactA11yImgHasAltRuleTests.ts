import {Utils} from '../utils/Utils';
import { TestHelper } from './TestHelper';
import {
  getFailureStringEmptyAltAndNotEmptyTitle,
  getFailureStringEmptyAltAndNotPresentationRole,
  getFailureStringNoAlt,
  getFailureStringNonEmptyAltAndPresentationRole
} from '../reactA11yImgHasAltRule';

/**
 * Unit test for react-a11y-img-has-alt rule
 */
describe('reactA11yImgHasAlt', () => {
  const ruleName: string = 'react-a11y-img-has-alt';

  describe('default tests', () => {
    describe('should pass', () => {
      const fileDirectory: string = 'test-data/a11yImgHasAlt/DefaltTests/PassingTestInputs/';

      it('when the element name is not img', () => {
        const fileName: string = fileDirectory + 'ElementNotImg.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img tag name is not lower case', () => {
        const fileName: string = fileDirectory + 'ImgElementNotLowerCase.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has spread attribute', () => {
        const fileName: string = fileDirectory + 'ImgElementHasSpreadAttribute.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has empty alt value and presentation role', () => {
        const fileName: string = `
            import React = require('react');

            const a = <img role='presentation' alt />
            const b = <img role='presentation' alt='' />
            const c = <img role='button presentation' alt={ undefined } />
            const d = <img role={'presentation button'} alt={''} /> `;
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has non-empty alt value and not presentation role', () => {
        const fileName: string = fileDirectory + 'ImgElementHasNonEmptyAltValueAndNotPresentationRole.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has non-empty alt value and undefined presentation role', () => {
          const fileName: string = fileDirectory + 'ImgElementHasNonEmptyAltValueAndUndefinedPresentationRole.tsx';
          TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has non-empty alt value and presentation role when option is enabled', () => {
        const fileName: string = fileDirectory + 'ImgElementHasNonEmptyAltValueAndPresentationRole.tsx';
        const ruleOptions: any[] = [[], { allowNonEmptyAltWithRolePresentation: true }];
        TestHelper.assertNoViolationWithOptions(ruleName, ruleOptions, fileName);
      });

      it('when the img element has empty alt value, empty title, and presentation role', () => {
        const fileName: string = `
            import React = require('react');

            const a = <img role='presentation' alt title/>;
            const b = <img role='presentation' alt='' title=''/>;
            const c = <img role='button presentation' alt={ undefined } title={ undefined }/>;
            const d = <img role={'presentation button'} alt={''} title={''}/>;
        `;
        TestHelper.assertNoViolation(ruleName, fileName);
      });
    });

    describe('should fail', () => {
      const fileDirectory: string = 'test-data/a11yImgHasAlt/DefaltTests/FailingTestInputs/';

      it('when the img element has no alt prop', () => {
        const fileName: string = fileDirectory + 'ImgElementHasNoAlt.tsx';

        TestHelper.assertViolations(
          ruleName,
          fileName,
          [
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 3 },
              failure: getFailureStringNoAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 4 },
              failure: getFailureStringNoAlt('img')
            }
          ]
        );
      });

      it('when the img element has empty alt value and not presentation role', () => {
        const fileName: string = `import React = require('react');

const a = <img alt role='button'/>
const b = <img Alt='' />
const c = <img ALT={undefined} />
const d = <img alt={''} /> `;

        TestHelper.assertViolations(
          ruleName,
          fileName,
          [
            {
              name: Utils.absolutePath('file.tsx'),
              ruleName: ruleName,
              startPosition: { character: 11, line: 3 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('img')
            },
            {
              name: Utils.absolutePath('file.tsx'),
              ruleName: ruleName,
              startPosition: { character: 11, line: 4 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('img')
            },
            {
              name: Utils.absolutePath('file.tsx'),
              ruleName: ruleName,
              startPosition: { character: 11, line: 5 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('img')
            },
            {
              name: Utils.absolutePath('file.tsx'),
              ruleName: ruleName,
              startPosition: { character: 11, line: 6 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('img')
            }
          ]
        );
      });

      it('when the img element has non-empty alt value and presentation role', () => {
        const fileName: string = fileDirectory + 'ImgElementHasNonEmptyAltValueAndPresentationRole.tsx';

        TestHelper.assertViolations(
          ruleName,
          fileName,
          [
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 5 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 6 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 7 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 8 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('img')
            }
          ]
        );
      });

      it('when the img tag has empty attribute alt but not-empty attribute title', () => {
        const fileName: string = `import React = require('react');

const a = <img alt='' title='Some image' role='presentation' />;
const b = <img alt title='Some image' role='presentation' />;
const c = <img alt={''} title='Some image' role='presentation' />;
`;

        TestHelper.assertViolations(
          ruleName,
          fileName,
          [
            {
              name: 'file.tsx',
              ruleName: ruleName,
              startPosition: { character: 11, line: 3 },
              failure: getFailureStringEmptyAltAndNotEmptyTitle('img')
            },
            {
              name: 'file.tsx',
              ruleName: ruleName,
              startPosition: { character: 11, line: 4 },
              failure: getFailureStringEmptyAltAndNotEmptyTitle('img')
            },
            {
              name: 'file.tsx',
              ruleName: ruleName,
              startPosition: { character: 11, line: 5 },
              failure: getFailureStringEmptyAltAndNotEmptyTitle('img')
            },
          ]
        );
      });
    });
  });

  describe('custom element tests', () => {
    const options: any[] = [['Picture']]; // tslint:disable-line:no-any

    describe('should pass', () => {
      const fileDirectory: string = 'test-data/a11yImgHasAlt/CustomElementTests/PassingTestInputs/';

      it('when the element is neither img nor custom element', () => {
        const fileName: string = fileDirectory + 'ElementNeitherImgNorCustomElement.tsx';
        TestHelper.assertNoViolationWithOptions(ruleName, options, fileName);
      });

      it('when custom element or img has empty alt value and presentation role', () => {
        const fileName: string = `
            import React = require('react');

            let Picture;

            const a = <Picture role='presentation' alt />
            const b = <Picture role={'presentation'} alt='' />
            const c = <Picture role='button presentation' alt={undefined} />
            const d = <img role='presentation' alt={ null } />
            const e = <img role={'presentation'} alt={ '' } />
            const f = <img role='button presentation' alt />
                    `;
        TestHelper.assertNoViolationWithOptions(ruleName, options, fileName);
      });

      it('when custom element or img has non-empty alt value and not presentation role', () => {
        const fileName: string = fileDirectory + 'CustomElementHasNonEmptyAltValueAndNotPresentationRole.tsx';
        TestHelper.assertNoViolationWithOptions(ruleName, options, fileName);
      });
    });

    describe('should fail', () => {
      const fileDirectory: string = 'test-data/a11yImgHasAlt/CustomElementTests/FailingTestInputs/';

      it('when the custom element has empty attribute alt but not-empty attribute title', () => {
        const fileName: string = `import React = require('react');

let Picture;

const a = <Picture alt='' title='Some image' role='presentation' />;
const b = <Picture alt title='Some image' role='presentation' />;
const c = <Picture alt={''} title='Some image' role='presentation' />;
`;

        TestHelper.assertViolationsWithOptions(
          ruleName,
          options,
          fileName,
          [
            {
              name: 'file.tsx',
              ruleName: ruleName,
              startPosition: { character: 11, line: 5 },
              failure: getFailureStringEmptyAltAndNotEmptyTitle('Picture')
            },
            {
              name: 'file.tsx',
              ruleName: ruleName,
              startPosition: { character: 11, line: 6 },
              failure: getFailureStringEmptyAltAndNotEmptyTitle('Picture')
            },
            {
              name: 'file.tsx',
              ruleName: ruleName,
              startPosition: { character: 11, line: 7 },
              failure: getFailureStringEmptyAltAndNotEmptyTitle('Picture')
            },
          ]
        );
      });

      it('when custom element or img has no alt prop', () => {
        const fileName: string = fileDirectory + 'CustomElementHasNoAltProp.tsx';

        TestHelper.assertViolationsWithOptions(
          ruleName,
          options,
          fileName,
          [
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 5 },
              failure: getFailureStringNoAlt('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 6 },
              failure: getFailureStringNoAlt('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 7 },
              failure: getFailureStringNoAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 8 },
              failure: getFailureStringNoAlt('img')
            }
          ]
        );
      });

      it('when custom element or img has non-empty alt value and presentation role', () => {
        const fileName: string = fileDirectory + 'CustomElementHasNonEmptyAltValueAndPresentationRole.tsx';

        TestHelper.assertViolationsWithOptions(
          ruleName,
          options,
          fileName,
          [
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 6 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 7 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 8 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 9 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 10 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 11 },
              failure: getFailureStringNonEmptyAltAndPresentationRole('img')
            }
          ]
        );
      });

      it('when custom element or img has empty alt value and not presentation role', () => {
        const fileName: string = fileDirectory + 'CustomElementHasEmptyAltValueAndNotPresentationRole.tsx';

        TestHelper.assertViolationsWithOptions(
          ruleName,
          options,
          fileName,
          [
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 5 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 6 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 7 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 8 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 9 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 11, line: 10 },
              failure: getFailureStringEmptyAltAndNotPresentationRole('img')
            }
          ]
        );
      });
    });
  });
});
