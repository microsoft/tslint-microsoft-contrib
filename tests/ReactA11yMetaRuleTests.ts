import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('reactA11yMetaRule', () : void => {

    const ruleName : string = 'react-a11y-meta';

    it('should pass on meta tags without refresh', () : void => {
        const script : string = `
            import React = require('react');

            const x = <meta http-equiv="not_refresh" />
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on meta tags with refresh - self closing', () : void => {
        const script : string = `
            import React = require('react');

            const x = <meta http-equiv="refresh" />
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Do not use http-equiv=\"refresh\"",
                "name": "file.tsx",
                "ruleName": "react-a11y-meta",
                "startPosition": { "character": 23, "line": 4 }
            }
        ]);
    });

    it('should fail on meta tags with refresh', () : void => {
        const script : string = `
            import React = require('react');

            const x = <meta http-equiv="refresh" ></meta>
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Do not use http-equiv=\"refresh\"",
                "name": "file.tsx",
                "ruleName": "react-a11y-meta",
                "startPosition": { "character": 23, "line": 4 }
            }
        ]);
    });

    it('should fail on meta tags with refresh - self-closing', () : void => {
        const script : string = `
            import React = require('react');

            const x = <meta http-equiv={"refresh"} />
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Do not use http-equiv=\"refresh\"",
                "name": "file.tsx",
                "ruleName": "react-a11y-meta",
                "startPosition": { "character": 23, "line": 4 }
            }
        ]);
    });

});
