import { TestHelper } from './TestHelper';
import { getFailureString } from '../reactA11yAriaUnsupportedElementsRule';

/**
 * Unit test for react-a11y-aria-unsupported-elements rule.
 */
describe('reactA11yAriaUnsupportedElementsRule', () => {
    const ruleName: string = 'react-a11y-aria-unsupported-elements';

    it('should pass when tag name is not dom elements', (): void => {
        const script: string = `
            import React = require('react);

            const a = <DIV aria-label/>;
            const b = <DIV role></DIV>;
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should pass when tag name is supported aria element', (): void => {
        const script: string = `
            import React = require('react);

            const a = <div />;
            const b = <div aria-label role { ...this.props }></div>;
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should fail when unsupported aria elements have aria-* or role attributes', (): void => {
        const script: string = `
            import React = require('react');

            const a = <base aria-label role { ...this.props }></base>;
            const b = <base aria-label role { ...this.props } />;
        `;
        TestHelper.assertViolations(
            ruleName,
            script,
            [
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 23, line: 4 },
                    failure: getFailureString('base', ['aria-label', 'role'])
                },
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 23, line: 5 },
                    failure: getFailureString('base', ['aria-label', 'role'])
                }
            ]
        );
    });
});
