import { TestHelper } from './TestHelper';

describe('reactThisBindingIssueRule', (): void => {
    const ruleName: string = 'react-this-binding-issue';

    it('should pass on passing input', (): void => {
        const file: string = 'test-data/ReactThisBinding/ReactThisBindingIssue-passing.tsx';

        TestHelper.assertViolations(ruleName, file, []);

        const fileWithDecorator: string = 'test-data/ReactThisBinding/ReactThisBindingIssueWithDecorator-passing.tsx';
        TestHelper.assertNoViolationWithOptions(ruleName, [true, { 'bind-decorators': ['autobind'] }], fileWithDecorator);
    });

    it('should fail if decorator is not whitelisted in config', () => {
        const fileWithDecorator: string = 'test-data/ReactThisBinding/ReactThisBindingIssueWithDecorator-passing.tsx';
        const expectedMsg = `A class method is passed as a JSX attribute without having the 'this' reference bound: `;
        TestHelper.assertViolationsWithOptions(ruleName, [true], fileWithDecorator, [
            {
                ruleName: 'react-this-binding-issue',
                name: fileWithDecorator,
                failure: expectedMsg + 'this.listener1',
                startPosition: { line: 20, character: 27 }
            }
        ]);
    });

    it('should fail on double binding', (): void => {
        const file: string = 'test-data/ReactThisBinding/ReactThisBindingIssue-doublebinding.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                failure:
                    "A function is having its 'this' reference bound twice in the constructor: " +
                    'this.listener = this.listener.bind(this)',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-doublebinding.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 9, line: 7 }
            }
        ]);
    });

    it('should fail on unbound listener', (): void => {
        const file: string = 'test-data/ReactThisBinding/ReactThisBindingIssue-unbound.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                failure: "A class method is passed as a JSX attribute without having the 'this' reference bound: this.listener",
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-unbound.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 27, line: 9 }
            },
            {
                failure: "A class method is passed as a JSX attribute without having the 'this' reference bound: this.listener",
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-unbound.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 32, line: 11 }
            }
        ]);
    });

    it('should fail on anonymous listeners', (): void => {
        const file: string = 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: this.listener.bind(this)',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 32, line: 10 }
            },
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: _.bind(this.listener, this)',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 32, line: 11 }
            },
            {
                failure: "A new instance of an anonymous method is passed as a JSX attribute: this.listener.bind(this, 'so...",
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 32, line: 12 }
            },
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: () => {}',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 32, line: 14 }
            },
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: function() {}',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 32, line: 15 }
            }
        ]);
    });

    it('should fail on locally instantiated listeners', (): void => {
        const file: string = 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx';

        TestHelper.assertViolations(ruleName, file, [
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: listener1',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 30, line: 12 }
            },
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: listener2',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 54, line: 12 }
            },
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: listener3',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 78, line: 12 }
            },
            {
                failure: 'A new instance of an anonymous method is passed as a JSX attribute: listener4',
                name: 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx',
                ruleName: 'react-this-binding-issue',
                startPosition: { character: 101, line: 12 }
            }
        ]);
    });

    it('should pass on anonymous listeners when allow-anonymous-listeners is true', (): void => {
        const options = [true, { 'allow-anonymous-listeners': true }];
        const file: string = 'test-data/ReactThisBinding/ReactThisBindingIssue-anon-instance.tsx';

        TestHelper.assertViolationsWithOptions(ruleName, options, file, []);
    });

    it('should pass on locally instantiated listeners when allow-anonymous-listeners is true', (): void => {
        const options = [true, { 'allow-anonymous-listeners': true }];
        const file: string = 'test-data/ReactThisBinding/ReactThisBindingIssue-local-instance.tsx';

        TestHelper.assertViolationsWithOptions(ruleName, options, file, []);
    });
});
