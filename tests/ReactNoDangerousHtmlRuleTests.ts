/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./TestHelper');
import reactNoDangerousHtmlRule = require('../src/reactNoDangerousHtmlRule');

var dangerousScript : string = `
class MyComponent {
    public render() : ReactTypes.ReactElement<any> {
        return React.createElement("div", {
                dangerouslySetInnerHTML: {__html: this.props.text}
            }
        );
    }
}`;


describe('reactNoDangerousHtmlRule', () : void => {

    var ruleName : string = 'react-xss-report';
    var exceptions : {}[] = [];
    var original: any;

    beforeEach(() : void => {
        original = reactNoDangerousHtmlRule.Rule.getExceptions;
        reactNoDangerousHtmlRule.Rule.getExceptions = () : any => { return exceptions; };
    });

    afterEach(() : void => {
        reactNoDangerousHtmlRule.Rule.getExceptions = original;
    });

    it('should produce violation when function called with no suppression', () : void => {
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
                    "ruleName": "react-xss-report",
                    "startPosition": { "character": 17, "line": 5 }
                }
            ]
        );
    });

    it.only('should not produce violation when call exists in exception list', () : void => {
        exceptions.push({ file: 'file.ts', method: 'render', comment: 'this usage is OK' });

        TestHelper.assertViolations(
            ruleName,
            dangerousScript,
            []
        );
    });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
