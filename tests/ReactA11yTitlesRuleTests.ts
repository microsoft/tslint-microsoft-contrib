/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('reactA11yTitlesRule', () : void => {

    const ruleName : string = 'react-a11y-titles';

    it('should pass on when title is not empty', () : void => {
        const script : string = `
            import React = require('react');

            const title = <title>some title</title>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on empty title', () : void => {
        const script : string = `
            import React = require('react');

            const title = <title></title>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Title elements must not be empty",
                "name": "file.tsx",
                "ruleName": "react-a11y-titles",
                "startPosition": { "character": 27, "line": 4 }
            }
        ]);
    });

    it('should fail on self-closing title', () : void => {
        const script : string = `
            import React = require('react');

            const title = <title />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Title elements must not be empty",
                "name": "file.tsx",
                "ruleName": "react-a11y-titles",
                "startPosition": { "character": 27, "line": 4 }
            }
        ]);
    });

    it.only('should fail on longer than 60 charactes title', () : void => {
        let title: string = Array(61).join("a")
        const script : string = `
            import React = require('react');

            const title = <title>${title}</title>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Title length must not be longer than 60 characters: aaaaaaaaaaaaaaaaaa...",
                "name": "file.tsx",
                "ruleName": "react-a11y-titles",
                "startPosition": { "character": 27, "line": 4 }
            }
        ]);
    });
});
