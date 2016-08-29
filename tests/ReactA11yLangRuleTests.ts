/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('reactA11yLangRule', () : void => {

    const ruleName : string = 'react-a11y-lang';

    it('should pass on html with lang attribute', () : void => {
        const script : string = `
            import React = require('react');

            const x = <html lang='en'></html>;
            const y = <html lang='en' />;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on missing lang for open and close tag', () : void => {
        const script : string = `
            import React = require('react');

            const x = <html></html>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "An html element is missing the lang attribute",
                "name": "file.tsx",
                "ruleName": "react-a11y-lang",
                "startPosition": { "character": 23, "line": 4 }
            }
        ]);
    });

    it('should fail on missing lang for self closing tag', () : void => {
        const script : string = `
            import React = require('react');

            const x = <html />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "An html element is missing the lang attribute",
                "name": "file.tsx",
                "ruleName": "react-a11y-lang",
                "startPosition": { "character": 23, "line": 4 }
            }
        ]);
    });
});
