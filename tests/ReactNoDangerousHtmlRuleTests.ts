/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';
import {Rule} from '../src/reactNoDangerousHtmlRule';

const dangerousScript : string = `
class MyComponent {
    public render() : ReactTypes.ReactElement<any> {
        return React.createElement("div", {
                dangerouslySetInnerHTML: {__html: this.props.text}
            }
        );
    }
}`;

/**
 * Unit tests.
 */
describe('reactNoDangerousHtmlRule', () : void => {
    const ruleName : string = 'react-no-dangerous-html';
    const exceptions : {}[] = [];
    let original: any;

    beforeEach(() : void => {
        original = Rule.getExceptions;
        Rule.getExceptions = () : any => { return exceptions; };
    });

    afterEach(() : void => {
        Rule.getExceptions = original;
    });

    it('should produce violation when function called with no suppression', () : void => {
        exceptions.length = 0;
        TestHelper.assertViolations(
            ruleName,
            dangerousScript,
            [
                {
                    "failure": "Invalid call to dangerouslySetInnerHTML in method \"render\"\n" +
                        "    of source file file.ts\"\n    Do *NOT* add a suppression for this warning. " +
                    "If you absolutely must use this API then you need\n    to review the usage with a " +
                    "security expert/QE representative. If they decide that this is an\n    acceptable usage " +
                    "then add the exception to xss_exceptions.json",
                    "name": "file.ts",
                    "ruleName": ruleName,
                    "startPosition": { "character": 17, "line": 5 }
                }
            ]
        );
    });

    it('should not produce violation when call exists in exception list', () : void => {
        exceptions.push({ file: 'file.ts', method: 'render', comment: 'this usage is OK' });

        TestHelper.assertViolations(
            ruleName,
            dangerousScript,
            []
        );
    });

    it('should find violations in .tsx files', (): void => {
        TestHelper.assertViolations(
            ruleName,
            `import React = require('react');
let text = '<div>some value</div>div>';

// example of element with start and end tag
<div foo='bar' src={'asdf'} dangerouslySetInnerHTML={{__html: text}} >
</div>;

function someFunction() {
    // example of self-closing element
    return <div dangerouslySetInnerHTML={{__html: text}} />;
}
`,
            [
                {
                    "failure": "Invalid call to dangerouslySetInnerHTML in method \"<unknown>\"\n    of source file " +
                    "file.tsx\"\n    Do *NOT* add a suppression for this warning. " +
                    "If you absolutely must use this API then you need\n    to review the usage with a security expert/QE " +
                    "representative. If they decide that this is an\n    acceptable usage then add the exception " +
                    "to xss_exceptions.json",
                    "name": "file.tsx",
                    "ruleName": "react-no-dangerous-html",
                    "startPosition": { "character": 1, "line": 5 }
                },
                {
                    "failure": "Invalid call to dangerouslySetInnerHTML in method \"<unknown>\"\n    of source file " +
                    "file.tsx\"\n    Do *NOT* add a suppression for this warning. " +
                    "If you absolutely must use this API then you need\n    to review the usage with a security expert/QE " +
                    "representative. If they decide that this is an\n    acceptable usage then add the exception " +
                    "to xss_exceptions.json",
                    "name": "file.tsx",
                    "ruleName": "react-no-dangerous-html",
                    "startPosition": { "character": 12, "line": 10 }
                }
            ]
        );
    });
});