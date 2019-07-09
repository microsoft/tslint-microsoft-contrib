import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';
import { MISSING_PLACEHOLDER_INPUT_FAILURE_STRING, MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING } from '../reactA11yInputElementsRule';

/**
 * Unit tests.
 */
describe('reactA11yInputElementsRule', (): void => {
    const ruleName: string = 'react-a11y-input-elements';

    it('should pass on input elements with placeholder', (): void => {
        const script: string = `
            import React = require('react');
            const a = <input value="someValue" />;
            const b = <input placeholder="default placeholder" />;
            const c = <textarea placeholder="default placeholder" />;
            const d = <textarea>Some text</textarea>;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on input elements of file without value and placeholder', (): void => {
        const script: string = `
            import React = require('react');
            const a = <input type="file" />;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on input elements without placeholder of type radio, checkbox, file', (): void => {
        const script: string = `
            import React = require('react');
            const a = <input type="radio" value="foo" />;
            const b = <input type="checkbox" value="foo" />;
            const c = <input type="file" value="foo" />;
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should fail on input elements without value of type radio, checkbox', (): void => {
        const script: string = `
            import React = require('react');
            const a = <input type="radio" />;
            const b = <input type="checkbox" />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 3 }
            },
            {
                failure: MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 4 }
            }
        ]);
    });

    it('should fail on input elements without placeholder, when attribute is not type', (): void => {
        const script: string = `
            import React = require('react');
            const a = <input foo="radio" />;
            const b = <input bar="checkbox" />;
            const c = <input baz="file" />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 3 }
            },
            {
                failure: MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 4 }
            },
            {
                failure: MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 5 }
            }
        ]);
    });

    it('should fail on empty input elements without placeholder', (): void => {
        const script: string = `
            import React = require('react');
            const a = <input type="button" />;
            const b = <textarea />;
            const c = <textarea></textarea>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 3 }
            },
            {
                failure: MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 4 }
            },
            {
                failure: MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING,
                name: Utils.absolutePath('file.tsx'),
                ruleName: 'react-a11y-input-elements',
                startPosition: { character: 23, line: 5 }
            }
        ]);
    });
});
