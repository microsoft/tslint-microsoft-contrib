import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';
/**
 * Unit tests.
 */
const IFRAME_EMPTY_TITLE_ERROR_STRING: string = 'An iframe element must have a non-empty title.';
const IFRAME_EMPTY_OR_HIDDEN_ERROR_STRING: string = 'An iframe element should not be hidden or empty.';
const IFRAME_UNIQUE_TITLE_ERROR_STRING: string = 'An iframe element must have a unique title.';

describe('reactA11yIframesRuleTests', (): void => {
    const ruleName: string = 'react-a11y-iframes';
    it('should pass if iframe title is not empty and iframe is not hidden or empty', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <iframe title="I'm a non empty title" src="http://someSource.com"/>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should pass if iframe title is non-empty expression and iframe is not hidden or empty', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <iframe title={"hello there"} src="http://someSource.com"/>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail if iframe title is empty', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <iframe title="" src="http://someSource.com"/>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: IFRAME_EMPTY_TITLE_ERROR_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 37, line: 3 }
            }
        ]);
    });
    it('should fail if iframe has no title', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <iframe src="http://someSource.com" />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: IFRAME_EMPTY_TITLE_ERROR_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 37, line: 3 }
            }
        ]);
    });
    it('should fail if iframe has no source', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <iframe title="hi there"></iframe>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: IFRAME_EMPTY_OR_HIDDEN_ERROR_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 37, line: 3 }
            }
        ]);
    });
    it('should fail if iframe source is empty', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <iframe title="hi there" src=""/>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: IFRAME_EMPTY_OR_HIDDEN_ERROR_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 37, line: 3 }
            }
        ]);
    });
    it('should fail if iframe is hidden', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <iframe title="hi there" src="http://someSource.com" hidden></iframe>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: IFRAME_EMPTY_OR_HIDDEN_ERROR_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 37, line: 3 }
            }
        ]);
    });
    it('should pass if iframe title is unique', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <>
            <iframe title="hi there" src="http://someSource.com"></iframe>
            <iframe title="hello there" src="http://someSource.com"></iframe>
        </>
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });
    it('should fail if iframe title is not unique', (): void => {
        const script: string = `
        import React = require('react');
        const someComponent = () => <>
            <iframe title="hi there" src="http://someSource.com"></iframe>
            <iframe title="hi there" src="http://someSource.com"></iframe>
        </>
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: IFRAME_UNIQUE_TITLE_ERROR_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 13, line: 5 }
            }
        ]);
    });
});
