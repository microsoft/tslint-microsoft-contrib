import { TestHelper } from './TestHelper';

/**
 * Unit tests for react-a11y-image-button-has-alt rule.
 */
describe('reactA11yImageButtonHasAlt', (): void => {
    const ruleName: string = 'react-a11y-image-button-has-alt';

    describe('should pass', (): void => {
        it("when there has no input element with type='image'", (): void => {
            const script: string = `
                import React = require('react');
                const a = <input type='button' />;
                const b = <div></div>;
                const c = <INPUT type='image' />;
            `;

            TestHelper.assertNoViolation(ruleName, script);
        });

        it("when input element of type='image' has an not empty alt attribute.", (): void => {
            const script: string = `
                import React = require('react');
                const a = <input type='image' alt='altString' />;
                const b = <input type='IMAGE' alt='altString' />;
            `;

            TestHelper.assertNoViolation(ruleName, script);
        });
    });

    describe('should fail', (): void => {
        it("when input element of type='image' has no an alt attribute.", (): void => {
            const script: string = `
                import React = require('react');
                const a = <input type='image' />;
                const b = <input type='IMAGE' />;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 3 },
                    failure: "Inputs element of type=[image] must have an alt attribute."
                },
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 4 },
                    failure: "Inputs element of type=[image] must have an alt attribute."
                }
            ]);
        });

        it("when input element of type='image' has an empty alt attribute.", (): void => {
            const script: string = `
                import React = require('react');
                const a = <input type='image' alt />;
                const b = <input type='IMAGE' alt="" />;
                const c = <input type='image' alt={ undefined } />;
                const d = <input type='IMAGE' alt={ "" } />;
                const e = <input type='IMAGE' alt={ null } />;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 3 },
                    failure: "Inputs element of type=[image] must have an not empty alt attribute."
                },
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 4 },
                    failure: "Inputs element of type=[image] must have an not empty alt attribute."
                },
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 5 },
                    failure: "Inputs element of type=[image] must have an not empty alt attribute."
                },
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 6 },
                    failure: "Inputs element of type=[image] must have an not empty alt attribute."
                },
                {
                    name: 'file.tsx',
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 7 },
                    failure: "Inputs element of type=[image] must have an not empty alt attribute."
                }
            ]);
        });
    });
});
