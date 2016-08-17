/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />


import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('reactIframeMissingSandboxRule', () : void => {

    const ruleName : string = 'react-iframe-missing-sandbox';

    it('should pass on empty attribute', () : void => {
        const script : string = `
            import React = require('react');
            <iframe sandbox='' />
            <iframe sandbox={''} />
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on non-iframe tags', () : void => {
        const script : string = `
            import React = require('react');
            <div sandbox='__unknown__' />
            <div></div>
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on empty single attribute - open tag', () : void => {
        const script : string = `
            import React = require('react');
            <iframe sandbox='allow-forms'></iframe>
            <iframe sandbox='allow-modals'></iframe>
            <iframe sandbox='allow-orientation-lock'></iframe>
            <iframe sandbox='allow-pointer-lock'></iframe>
            <iframe sandbox='allow-popups'></iframe>
            <iframe sandbox='allow-popups-to-escape-sandbox'></iframe>
            <iframe sandbox='allow-same-origin'></iframe>
            <iframe sandbox='allow-scripts'></iframe>
            <iframe sandbox='allow-top-navigation'></iframe>
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on empty single attribute - self closing tag', () : void => {
        const script : string = `
            import React = require('react');
            <iframe sandbox='allow-forms' />
            <iframe sandbox='allow-modals' />
            <iframe sandbox='allow-orientation-lock' />
            <iframe sandbox='allow-pointer-lock' />
            <iframe sandbox='allow-popups' />
            <iframe sandbox='allow-popups-to-escape-sandbox' />
            <iframe sandbox='allow-same-origin' />
            <iframe sandbox='allow-scripts' />
            <iframe sandbox='allow-top-navigation' />
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on multiple attributes', () : void => {
        const script : string = `
            import React = require('react');
            <iframe sandbox='allow-forms allow-modals'></iframe>
            <iframe sandbox='allow-orientation-lock allow-scripts'></iframe>
            <iframe sandbox='allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-top-navigation'>
            </iframe>
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on missing attribute', () : void => {
        const script : string = `
            import React = require('react');
            <iframe></iframe>
            <iframe/>
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "An iframe element requires a sandbox attribute",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "An iframe element requires a sandbox attribute",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 13, "line": 4 }
            }
        ]);
    });

    it('should fail on invalid attribute', () : void => {
        const script : string = `
            import React = require('react');
            <iframe sandbox='__unknown__'></iframe>
            <iframe sandbox='allow-popups __unknown__'/>
            <iframe sandbox='__unknown__ allow-popups'/>
            <iframe sandbox='allow-forms __unknown__ allow-popups'/>
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "An iframe element defines an invalid sandbox attribute: __unknown__",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 29, "line": 3 }
            },
            {
                "failure": "An iframe element defines an invalid sandbox attribute: __unknown__",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 29, "line": 4 }
            },
            {
                "failure": "An iframe element defines an invalid sandbox attribute: __unknown__",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 29, "line": 5 }
            },
            {
                "failure": "An iframe element defines an invalid sandbox attribute: __unknown__",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 29, "line": 6 }
            }
        ]);
    });

    it('should fail on allowing both "allow-scripts" and "allow-same-origin"', () : void => {
        const script : string = `
            import React = require('react');
            <iframe sandbox='allow-scripts allow-same-origin'></iframe>
            <iframe sandbox='allow-same-origin allow-scripts'/>
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "An iframe element defines a sandbox with both allow-scripts and allow-same-origin",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 29, "line": 3 }
            },
            {
                "failure": "An iframe element defines a sandbox with both allow-scripts and allow-same-origin",
                "name": "file.tsx",
                "ruleName": "react-iframe-missing-sandbox",
                "startPosition": { "character": 29, "line": 4 }
            }
        ]);
    });

});

