/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe.only('reactThisBindingIssueRule', () : void => {

    const ruleName : string = 'react-this-binding-issue';

    it('should pass on passing input', () : void => {
        const file : string = 'test-data/ReactThisBindingIssue-passing.tsx';

        TestHelper.assertViolations(ruleName, file, [ ]);
    });

    it('should fail on double binding', () : void => {
        const file : string = 'test-data/ReactThisBindingIssue-doublebinding.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                "failure": "A function is having its 'this' reference bound twice in the constructor: this.listener = this.listener.bind(this)",
                "name": "test-data/ReactThisBindingIssue-doublebinding.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 9, "line": 8 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
