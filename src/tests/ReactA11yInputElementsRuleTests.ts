import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';
import {
    MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
    MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING
} from '../reactA11yInputElementsRule';

/**
 * Unit tests.
 */
describe('reactA11yInputElementsRule', () : void => {

    const ruleName : string = 'react-a11y-input-elements';

    it('should pass on input elements with placeholder', () : void => {
        const script : string = `
            import React = require('react');
            const a = <input value="someValue" />;
            const b = <input placeholder="default placeholder" />;
            const c = <textarea placeholder="default placeholder" />;
            const d = <textarea>Some text</textarea>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on empty input elements without placeholder', () : void => {
        const script : string = `
            import React = require('react');
            const a = <input />;
            const b = <textarea />;
            const c = <textarea></textarea>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": MISSING_PLACEHOLDER_INPUT_FAILURE_STRING,
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-a11y-input-elements",
                "startPosition": { "character": 23, "line": 3 }
            },
            {
                "failure": MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING,
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-a11y-input-elements",
                "startPosition": { "character": 23, "line": 4 }
            },
            {
                "failure": MISSING_PLACEHOLDER_TEXTAREA_FAILURE_STRING,
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-a11y-input-elements",
                "startPosition": { "character": 23, "line": 5 }}
        ]);
    });

});
