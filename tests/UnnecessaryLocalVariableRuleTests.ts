/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('unnecessaryLocalVariableRule', () : void => {
    let ruleName : string = 'no-unnecessary-local-variable';

    it('should pass on good usages', () : void => {
        let script : string = `
            class MyClass {
                private myMethod1() {
                    let x = 1;
                    return y;
                }
                private myMethod2() {
                    let y = 1;
                    return x;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on class function', () : void => {
        let script : string = `
            class MyClass {
                private myMethod() {
                    let x = 1;
                    return x;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary local variable: x",
                "name": "file.ts",
                "ruleName": "no-unnecessary-local-variable",
                "startPosition": { "character": 21, "line": 4 }
            }
        ]);
    });

    it('should fail on if statement inside function', () : void => {
        let script : string = `
            class MyClass {
                private myMethod() {
                    if (foo) {
                        let x = 1;
                        return x;
                    }
                    return x;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary local variable: x",
                "name": "file.ts",
                "ruleName": "no-unnecessary-local-variable",
                "startPosition": { "character": 25, "line": 5 }
            }
        ]);
    });

    it('should fail on statements inside source file', () : void => {
        let script : string = `
            let x = 1;
            return x;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary local variable: x",
                "name": "file.ts",
                "ruleName": "no-unnecessary-local-variable",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on statements inside module', () : void => {
        let script : string = `
            module MyModule {
                let x = 1;
                return x;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary local variable: x",
                "name": "file.ts",
                "ruleName": "no-unnecessary-local-variable",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

    it('should fail on statements inside case clause', () : void => {
        let script : string = `
            switch (whatever) {
                case 1:
                    let x = 1;
                    return x;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary local variable: x",
                "name": "file.ts",
                "ruleName": "no-unnecessary-local-variable",
                "startPosition": { "character": 21, "line": 4 }
            }
        ]);
    });

    it('should fail on statements inside default clause of switch statement', () : void => {
        let script : string = `
            switch (whatever) {
                default:
                    let x = 1;
                    return x;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary local variable: x",
                "name": "file.ts",
                "ruleName": "no-unnecessary-local-variable",
                "startPosition": { "character": 21, "line": 4 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
