import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('reactAnchorBlankNoopenerRule', () : void => {

    const ruleName : string = 'react-anchor-blank-noopener';

    it('should pass on blank anchor with noopener and noreferrer', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_blank" rel="noopener noreferrer">link</a>;
            const b = <a target="_blank" rel="noreferrer noopener">link</a>;
            const c = <a target="_blank" rel="whatever noopener noreferrer">link</a>;
            const d = <a target="_blank" rel="noreferrer whatever noopener">link</a>;
            const e = <a target="_blank" rel="noreferrer noopener whatever">link</a>;
            const f = <a target="_blank" rel="noopener noreferrer"/>;
            const g = <a target="_blank" rel="noreferrer noopener"/>;
            const h = <a target="_blank" rel="whatever noopener noreferrer"/>;
            const i = <a target="_blank" rel="noreferrer whatever noopener"/>;
            const j = <a target="_blank" rel="noreferrer noopener whatever"/>;

            const k = <a target={ something() } rel="noreferrer noopener whatever"/>;
            const l = <a target="_blank" rel={ something() }/>;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on anchors without blank', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_self" >link</a>;
            const b = <a target="_whatever" >link</a>;
            const c = <a target="_self" />;
            const d = <a target="_whatever" />;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on MSE example', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a href={'somelink'}>
                    {'some text'}
                </a>
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on missing rel', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_blank">link</a>;
            const b = <a target={"_blank"}>link</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [  {
            "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
            "name": Utils.absolutePath("file.tsx"),
            "ruleName": "react-anchor-blank-noopener",
            "startPosition": { "character": 23, "line": 4 }
        },
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 5 }
            }
        ]);
    });

    it('should fail on missing rel - self-closing', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_blank" />;
            const b = <a target={"_blank"} />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 4 }
            },
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 5 }
            }
        ]);
    });

    it('should fail on empty rel', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_blank" rel="" >link</a>;
            const b = <a target={"_blank"} rel={""} >link</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 4 }
            },
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 5 }
            }
        ]);
    });

    it('should fail on rel with only one term', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_blank" rel="noreferrer" >link</a>;
            const b = <a target={"_blank"} rel={"noopener"} >link</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 4 }
            },
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 5 }
            }
        ]);
    });

    it('should fail on rel with only one term but other terms as well', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_blank" rel="noreferrer whatever" >link</a>;
            const b = <a target={"_blank"} rel={"whatever noopener"} >link</a>;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 4 }
            },
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 5 }
            }
        ]);
    });

    it('should fail on rel with only one term but other terms as well - self closing', () : void => {
        const script : string = `
            import React = require('react');

            const a = <a target="_blank" rel="noreferrer whatever" />;
            const b = <a target={"_blank"} rel={"whatever noopener"} />;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 4 }
            },
            {
                "failure": "Anchor tags with target=\"_blank\" should also include rel=\"noopener noreferrer\"",
                "name": Utils.absolutePath("file.tsx"),
                "ruleName": "react-anchor-blank-noopener",
                "startPosition": { "character": 23, "line": 5 }
            }
        ]);
    });
});
