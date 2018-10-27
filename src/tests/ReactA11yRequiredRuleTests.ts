import {TestHelper} from './TestHelper';
import {Utils} from '../utils/Utils';

/**
 * Unit tests for react-a11y-required rule.
 */
describe('reactA11yRequiredRule', () : void => {

    const ruleName : string = 'react-a11y-required';
    const FAILURE_STRING: string = 'Required input elements must have an aria-required set to true';

    describe('should pass', (): void => {
        it('when there is no required input element', (): void => {
            const script : string = `
                import React = require('react');
                const a = <input type='text' />;
                const b = <input type='text' />;
                const c = <input type='image' />;
                const d = <input type='password' />;
                const e = <input type='checkbox' />;
            `;

            TestHelper.assertNoViolation(ruleName, script);
        });

        it('when there is a required input element with aria-required set to true', (): void => {
            const script : string = `
                import React = require('react');
                const a = <input type='text' required aria-required='true' />;
                const b = <input type='text' required aria-required={ 'true' } />;
                const c = <input type='image' aria-required='true' required />;
                const d = <input type='text' aria-required={true} required />;
                const e = <input type='checkbox' required aria-required='true' />;
            `;

            TestHelper.assertNoViolation(ruleName, script);
        });
    });

    describe('should fail', (): void => {
        it('when there is a required element without aria-required', () : void => {
            const script : string = `
                import React = require('react');
                const a = <input type='text' required />;
                const b = <input required type='text' />;
                const c = <input type='image' required />;
                const d = <input type='password' required />;
                const e = <input required type='checkbox' />;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 3 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 4 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 5 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 6 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 7 },
                    failure: FAILURE_STRING
                }
            ]);
        });

        it('when there is a required element with an invalid value for aria-required', () : void => {
            const script : string = `
                import React = require('react');
                const a = <input type='text' required aria-required='' />;
                const b = <input type='text' required aria-required={ undefined } />;
                const c = <input type='image' aria-required={ '' } required />;
                const d = <input type='password' aria-required={ null } required />;
                const e = <input type='checkbox' required aria-required />;
                const f = <input type='checkbox' required aria-required='carrots' />;
                const g = <input type='checkbox' required aria-required={'pineapples'} />;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 3 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 4 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 5 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 6 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 7 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 8 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 9 },
                    failure: FAILURE_STRING
                }
            ]);
        });

        it('when there is a required element with aria-required set to false', () : void => {
            const script : string = `
                import React = require('react');
                const a = <input type='text' required aria-required='false' />;
                const b = <input type='text' required aria-required={ 'false' } />;
                const c = <input type='image' aria-required='false' required />;
                const d = <input type='password' aria-required={false} required />;
                const e = <input type='checkbox' required aria-required='false' />;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 3 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 4 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 5 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 6 },
                    failure: FAILURE_STRING
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 27, line: 7 },
                    failure: FAILURE_STRING
                }
            ]);
        });
    });

});
