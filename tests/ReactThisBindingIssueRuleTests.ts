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

    it('should fail on anonymous listeners', () : void => {
        const file : string = 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: this.listener.bind(this)",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 35, "line": 11 }
            },
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: _.bind(this.listener, this)",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 35, "line": 12 }
            },
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: this.listener.bind(this, 'so...",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 35, "line": 13 }
            },
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: () => {}",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 35, "line": 16 }
            },
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: function() {}",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 35, "line": 17 }
            }
        ]);
    });

    it('should fail on locally instantiated listeners', () : void => {
        const file : string = 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: listener1",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 22, "line": 14 }
            },
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: listener2",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 26, "line": 15 }
            },
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: listener3",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 26, "line": 16 }
            },
            {
                "failure": "A new instance of an anonymous method is passed as a JSX attribute: listener4",
                "name": "test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx",
                "ruleName": "react-this-binding-issue",
                "startPosition": { "character": 25, "line": 17 }
            }
        ]);
    });

    it('should pass on anonymous listeners when allow-anonymous-listeners is true', () : void => {

        const options: any = [ true, { 'allow-anonymous-listeners': true } ];
        const file : string = 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx';

        TestHelper.assertViolationsWithOptions(ruleName, options, file, []);
    });

    it('should pass on locally instantiated listeners when allow-anonymous-listeners is true', () : void => {

        const options: any = [ true, { 'allow-anonymous-listeners': true } ];
        const file : string = 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx';

        TestHelper.assertViolationsWithOptions(ruleName, options, file, []);
    });
});