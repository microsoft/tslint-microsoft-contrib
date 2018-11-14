import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('reactA11yAccessibleHeadingsRule', (): void => {
    const ruleName: string = 'react-a11y-accessible-headings';
    describe('react accessible heading rules for plain heading elements', (): void => {
        it('should pass on when heading is non empty expression', (): void => {
            const script: string = `
                import React = require('react');
                <h1>{"test"}</h1>;
                <h2>{"test"}</h2>;
                <h3>{"test"}</h3>;
                <h4>{"test"}</h4>;
                <h5>{"test"}</h5>;
                <h6>{"test"}</h6>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
        it('should pass on when heading is non empty string', (): void => {
            const script: string = `
                import React = require('react');
                <h1>test</h1>;
                <h2>test</h2>;
                <h3>test</h3>;
                <h4>test</h4>;
                <h5>test</h5>;
                <h6>test</h6>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('should fail on empty heading', (): void => {
            const script: string = `
                import React = require('react');
                <h1></h1>;
                <h2></h2>;
                <h3></h3>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'Heading elements must not be empty',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 3 }
                },
                {
                    failure: 'Heading elements must not be empty',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 4 }
                },
                {
                    failure: 'Heading elements must not be empty',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 5 }
                }
            ]);
        });

        it('should fail on self-closing heading', (): void => {
            const script: string = `
                import React = require('react');
                <h1/>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'Heading elements must not be empty',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 3 }
                }
            ]);
        });
        it('should pass when headings are ordered correctly', (): void => {
            const script: string = `
                import React = require('react');
                <h1>test</h1>;
                <h2>test</h2>;
                <h3>test</h3>;
                <h3>test</h3>;
                <h4>test</h4>;
                <h5>test</h5>;
                <h6>test</h6>;
                <h6>test</h6>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
        it('should fail when headings are ordered incorrectly', (): void => {
            const script: string = `
                import React = require('react');
                <h3>test</h3>;
                <h2>test</h2>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'Heading elements should be used for structuring information on the page',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 4 }
                }
            ]);
        });
        it('should fail when heading numbers are not increasing by one at a time', (): void => {
            const script: string = `
                import React = require('react');
                <h3>test</h3>;
                <h5>test</h5>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'Heading elements should be used for structuring information on the page',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 4 }
                }
            ]);
        });
        it('should pass when there are less or exactly 2 H1 heading elements', (): void => {
            const script: string = `
                import React = require('react');
                <h1>test</h1>;
                <h1>test</h1>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
        it('should fail when there are more than 2 H1 heading elements', (): void => {
            const script: string = `
                import React = require('react');
                <h1>test</h1>;
                <h1>test</h1>;
                <h1>test</h1>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'H1 heading cannot exceed 2 elements',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 5 }
                }
            ]);
        });
        it('should pass when heading text length is less than rule argument', (): void => {
            const maxTextLength = 60;
            const script: string = `
                import React = require('react');
                <h1>test</h1>;
            `;

            TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, []);
        });
        it('should fail when heading text length is more than rule argument', (): void => {
            const maxTextLength = 10;
            const script: string = `
                import React = require('react');
                <h1>I'm way beyond 10 characters!!!</h1>;
            `;

            TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, [
                {
                    failure: 'Heading content should be concise',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 17, line: 3 }
                }
            ]);
        });
    });
    describe('react accessible heading rules for variable binded heading elements', (): void => {
        it('should pass on when heading is non empty expression', (): void => {
            const script: string = `
                import React = require('react');
                const heading = <h1>{"test"}</h1>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
        it('should pass on when heading is non empty string', (): void => {
            const script: string = `
                import React = require('react');
                const heading = <h1>test</h1>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('should fail on empty heading', (): void => {
            const script: string = `
                import React = require('react');
                const heading = <h1></h1>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'Heading elements must not be empty',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 33, line: 3 }
                }
            ]);
        });

        it('should fail on self-closing heading', (): void => {
            const script: string = `
                import React = require('react');
                const heading = <h1/>;
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'Heading elements must not be empty',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 33, line: 3 }
                }
            ]);
        });
        it('should pass when headings are ordered incorrectly', (): void => {
            const script: string = `
                import React = require('react');
                export const heading1 = () => <h3>test</h3>;
                export const heading2 = () =><h2>test</h2>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
        it('should pass when heading numbers are not increasing by one at a time', (): void => {
            const script: string = `
                import React = require('react');
                export const heading1 = () => <h3>test</h3>;
                export const heading2 = () => <h5>test</h5>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
        it('should pass when there are more than 2 H1 heading elements', (): void => {
            const script: string = `
                import React = require('react');
                export const heading1 = () => <h1>test</h1>;
                export const heading2 = () => <h1>test</h1>;
                export const heading3 = () => <h1>test</h1>;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
        it('should pass when heading text length is less than rule argument', (): void => {
            const maxTextLength = 60;
            const script: string = `
                import React = require('react');
                const heading = <h1>test</h1>;
            `;

            TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, []);
        });
        it('should fail when heading text length is more than rule argument', (): void => {
            const maxTextLength = 10;
            const script: string = `
                import React = require('react');
                const heading = <h1>I'm way beyond 10 characters!!!</h1>;
            `;

            TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, [
                {
                    failure: 'Heading content should be concise',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-a11y-accessible-headings',
                    startPosition: { character: 33, line: 3 }
                }
            ]);
        });
    });
});
