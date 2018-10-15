import {Utils} from '../utils/Utils';
import { TestHelper } from './TestHelper';

/**
 * Unit test for react-a11y-onclick-has-role rule.
 */
describe('reactA11yEventHasRoleRule', () => {
    const ruleName: string = 'react-a11y-event-has-role';

    it('should pass when element is not a dom element', () => {
        const script: string = `
            import React = require('react');

            const a = <Div onclick />;
            const b = <DIV></DIV>;
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });
    it('should pass when dom element with event handlers has implicit role', () => {
        const script: string = `
            import React = require('react');

            const a = <a href='hrefValue' onclick />;
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should pass when dom element with event handlers has role attribute', () => {
        const script: string = `
            import React = require('react');

            const a = <div onclick role />;
            const b = <div click role></div>;
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should fail when dom element with event handlers has no role attribute and implicit role', () => {
        const script: string = `
            import React = require('react');

            const a = <div onclick />;
            const b = <div onkeyup></div>;
        `;
        TestHelper.assertViolations(
            ruleName,
            script,
            [
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 23, line: 4 },
                    failure: 'Elements with event handlers must have role attribute.'
                },
                {
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: ruleName,
                    startPosition: { character: 23, line: 5 },
                    failure: 'Elements with event handlers must have role attribute.'
                }
            ]
        );
    });
});
