/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('reactThisBindingIssueRule', () : void => {

    const ruleName : string = 'react-this-binding-issue';

    it('should pass on passing input', () : void => {
        const file : string = 'test-data/ReactThisBinding/ReactThisBindingIssue-passing.tsx';

        TestHelper.assertViolations(ruleName, file, [ ]);
    });

    it('should fail on double binding', () : void => {
        const file : string = 'test-data/ReactThisBinding/ReactThisBindingIssue-doublebinding.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                "failure": "A function is having its 'this' reference bound twice in the constructor: " +
                "this.listener = this.listener.bind(this)",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-doublebinding.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 9, "line": 8 }
            }
        ]);
    });

    it('should fail on unbound listener', () : void => {
        const file : string = 'test-data/ReactThisBinding/ReactThisBindingIssue-unbound.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                "failure": "A class method is passed as a JSX attribute without having the 'this' reference " +
                "bound in the constructor: this.listener",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-unbound.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 22, "line": 11  }
            },
            {
                "failure": "A class method is passed as a JSX attribute without having the 'this' reference " +
                "bound in the constructor: this.listener",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-unbound.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 28, "line": 14 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
