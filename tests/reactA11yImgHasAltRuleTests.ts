import { TestHelper } from './TestHelper';
import { getFailureStringNoAlt, getFailureStringEmptyAlt } from '../src/reactA11yImgHasAltRule';

/**
 * Unit test for a11y-img-has-alt rule
 */
describe('a11yImgHasAlt', () => {
  const ruleName: string = 'react-a11y-img-has-alt';

  describe('default tests', () => {
    describe('should pass', () => {
      const fileDirectory: string = 'test-data/a11yImgHasAlt/DefaltTests/PassingTestInputs/';

      it('when the element name is not img', () => {
        const fileName: string = fileDirectory + 'ElementNotImg.tsx';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has presentation role', () => {
        const fileName: string = fileDirectory + 'ImgElementHasPresentationRole';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has no empty alt value', () => {
        const fileName: string = fileDirectory + 'ImgElementHasAltAndAltValueNotEmpty';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img tag name is not lower case', () => {
        const fileName: string = fileDirectory + 'ImgElementNotLowerCase';
        TestHelper.assertNoViolation(ruleName, fileName);
      });

      it('when the img element has spread attribute', () => {
        const fileName: string = fileDirectory + 'ImgElementHasSpreadAttribute';
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
              startPosition: { character: 1, line: 1 },
              failure: getFailureStringNoAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 1, line: 2 },
              failure: getFailureStringNoAlt('img')
            }
          ]
        );
      });

      it('when the img element has empty alt value', () => {
        const fileName: string = fileDirectory + 'ImgElementHasEmptyAltValue.tsx';

        TestHelper.assertViolations(
          ruleName,
          fileName,
          [
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 6, line: 1 },
              failure: getFailureStringEmptyAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 6, line: 2 },
              failure: getFailureStringEmptyAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 6, line: 3 },
              failure: getFailureStringEmptyAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 6, line: 4 },
              failure: getFailureStringEmptyAlt('img')
            }
          ]
        );
      });
    });
  });

  describe('custom element tests', () => {
    const options: any[] = [true, ['Picture']]; // tslint:disable-line:no-any

    describe('should pass', () => {
      const fileDirectory: string = 'test-data/a11yImgHasAlt/CustomElementTests/PassingTestInputs/';

      it('when the element is neither img nor custom element', () => {
        const fileName: string = fileDirectory + 'ElementNeitherImgNorCustomElement.tsx';
        TestHelper.assertNoViolationWithOptions(ruleName, options, fileName);
      });

      it('when custom element or img has presentation role', () => {
        const fileName: string = fileDirectory + 'CustomElementHasPresentationRole.tsx';
        TestHelper.assertNoViolationWithOptions(ruleName, options, fileName);
      });

      it('when custom element or img has not empty alt value', () => {
        const fileName: string = fileDirectory + 'CustomElementHasValidAltValue.tsx';
        TestHelper.assertNoViolationWithOptions(ruleName, options, fileName);
      });
    });

    describe('should fail', () => {
      const fileDirectory: string = 'test-data/a11yImgHasAlt/CustomElementTests/FailingTestInputs/';

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
              startPosition: { character: 1, line: 1 },
              failure: getFailureStringNoAlt('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 1, line: 2 },
              failure: getFailureStringNoAlt('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 1, line: 3 },
              failure: getFailureStringNoAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 1, line: 4 },
              failure: getFailureStringNoAlt('img')
            }
          ]
        );
      });

      it('when custom element or img has empty alt value', () => {
        const fileName: string = fileDirectory + 'CustomElementHasEmptyAltValue.tsx';

        TestHelper.assertViolationsWithOptions(
          ruleName,
          options,
          fileName,
          [
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 10, line: 1 },
              failure: getFailureStringEmptyAlt('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 10, line: 2 },
              failure: getFailureStringEmptyAlt('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 10, line: 3 },
              failure: getFailureStringEmptyAlt('Picture')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 6, line: 4 },
              failure: getFailureStringEmptyAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 6, line: 5 },
              failure: getFailureStringEmptyAlt('img')
            },
            {
              name: fileName,
              ruleName: ruleName,
              startPosition: { character: 6, line: 6 },
              failure: getFailureStringEmptyAlt('img')
            }
          ]
        );
      });
    });
  });
});
