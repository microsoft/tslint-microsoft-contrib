import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('reactA11yAccessibleHeadingsRule', (): void => {
    const ruleName: string = 'react-a11y-accessible-headings';
    it('should pass when heading is non empty text', (): void => {
        const script: string = `
            import React = require('react');
            export const someComponent  = () => <>
                <h1>test</h1>
                <h2>test</h2>
                <h3>test</h3>
                <h4>test</h4>
                <h5>test</h5>
                <h6>test</h6>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should pass when heading is non empty expression', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>{"test"}</h1>
                <h2>{"test"}</h2>
                <h3>{"test"}</h3>
                <h4>{"test"}</h4>
                <h5>{"test"}</h5>
                <h6>{"test"}</h6>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail when heading is empty', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1></h1>
                <h2></h2>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, [
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
    it('should pass when heading text length is shorter than configurable limit', (): void => {
        const maxTextLength: number = 10;
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h2>I'm good!</h2>
            </>;
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, []);
    });
    it('should pass when heading text length is shorter than configurable limit - expressions', (): void => {
        const maxTextLength: number = 20;
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h2>I'm sooo {someValue()} sooo good!</h2>
            </>;
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, []);
    });
    it('should pass when heading text length is shorter than configurable limit - nested span element', (): void => {
        const maxTextLength: number = 30;
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h2>What is this<span>weird</span>example?</h2>
            </>;
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, []);
    });
    it('should pass when heading text length is shorter than configurable limit - nested headings', (): void => {
        const maxTextLength: number = 100;
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>Here is some Text!!<h2>even more text</h2><h3>and more...<h4>ok that's it!</h4></h3></h1>
            </>;
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, []);
    });
    it('should fail when heading text length is longer than configurable limit - nested headings', (): void => {
        const maxTextLength: number = 15;
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>
                    This is lonnnggggg!
                    <h2>short one..</h2>
                    <h3>longer than everrrr!!!</h3>
                </h1>
            </>;
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, [
            {
                failure: 'Heading content should be concise',
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 17, line: 4 }
            },
            {
                failure: 'Heading content should be concise',
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 21, line: 7 }
            }
        ]);
    });
    it('should fail when heading text length is longer than configurable limit - expressions', (): void => {
        const maxTextLength: number = 20;
        const script: string = `
            import React = require('react');
            const someComponent  = () =>
            const someValue = "ya moshe";
            <>
                <h2>I'm sooo {"evaluated into a string after all"} sooo good!</h2>
            </>;
        `;
        TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, [
            {
                failure: 'Heading content should be concise',
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 17, line: 6 }
            }
        ]);
    });
    it('should fail when heading text length is longer than configurable limit', (): void => {
        const maxTextLength: number = 10;
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h2>I'm sooooo loonnngggggg!!!!</h2>
            </>;
        `;

        TestHelper.assertViolationsWithOptions(ruleName, [true, { maxHeadingLength: maxTextLength }], script, [
            {
                failure: 'Heading content should be concise',
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 17, line: 4 }
            }
        ]);
    });
    it('should pass when heading text length is shorter than default limit', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h2>I'm good!</h2>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail when heading text length is longer than default limit', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h2>I have more than 60 characterssssssssssssssssssssssssssssssss</h2>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'Heading content should be concise',
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 17, line: 4 }
            }
        ]);
    });
    it('should pass when headings are ordered correctly', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>test</h1>
                <h2>test</h2>
                <h3>test</h3>
                <h3>test</h3>
                <h4>test</h4>
                <h5>test</h5>
                <h6>test</h6>
                <h6>test</h6>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail when heading elements numbering increase by more then one level consecutively', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h3>test</h3>
                <h5>test</h5>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Heading elements shouldn't increase by more then one level consecutively",
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 17, line: 5 }
            }
        ]);
    });
    it('should pass when heading elements numbering increase by more then one level consecutively (binded to different variables)', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent1  = () => <h3>test</h3>;
            const someComponent2  = () => <h5>test</h5>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail when heading elements numbering increase by more then one level consecutively - nested heading elements 1', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>
                    <h1>Hello!</h1>
                    <h3>Hello!</h3>
                </h1>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Heading elements shouldn't increase by more then one level consecutively",
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 21, line: 6 }
            }
        ]);
    });
    it('should fail when heading elements numbering increase by more then one level consecutively - nested heading elements 2', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>
                    <h1>Hello!</h1>
                    <h2>Hello!<h2>
                </h1>
                <h4>Text!!</h4>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Heading elements shouldn't increase by more then one level consecutively",
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 17, line: 8 }
            }
        ]);
    });
    it('should pass when there are less or exactly 2 H1 heading elements', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>test</h1>
                <h1>test</h1>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail when there are more than 2 H1 heading elements', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent  = () => <>
                <h1>test</h1>
                <h1>test</h1>
                <h1>test</h1>
            </>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: 'H1 heading cannot exceed 2 elements',
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 19, line: 3 }
            }
        ]);
    });
    it('should pass when there are more than 2 H1 heading elements (binded to different variables)', (): void => {
        const script: string = `
            import React = require('react');
            const someComponent1  = () => <h1>test</h1>;
            const someComponent2  = () => <h1>test</h1>;
            const someComponent3  = () => <h1>test</h1>;

        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail when heading elements numbering increase by more then one level consecutively - react component', (): void => {
        const script: string = `
            import React = require('react');
            export class DontWeJustLoveMultipleApis extends React.Component {
                render() {
                    return <>
                        <h4>test</h4>
                        <h6>test</h6>
                    </>;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Heading elements shouldn't increase by more then one level consecutively",
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 25, line: 7 }
            }
        ]);
    });
    it('should fail when heading elements numbering increase by more then one level consecutively - react function', (): void => {
        const script: string = `
            import React = require('react');
            function Foo(props) {
                return
                    <div>
                        <h4>test</h4>
                        <h6>test</h6>
                    </div>;
              }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: "Heading elements shouldn't increase by more then one level consecutively",
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-accessible-headings',
                startPosition: { character: 25, line: 7 }
            }
        ]);
    });
});
