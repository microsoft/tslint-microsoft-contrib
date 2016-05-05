/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noStatelessClassRule', () : void => {

    var ruleName : string = 'no-stateless-class';

    it('should pass on when class has some state', () : void => {
        var script : string = `
            // classes with instance fields have state
            class ClassWithField {
                private field;
            }

            // classes with instance methods have state
            class ClassWithMethod {
                private someMethod() {
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when class has parent', () : void => {
        var script : string = `
            class ClassWithParent extends MyOtherClass {
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when class has parent and parent interface', () : void => {
        var script : string = `
            // classes that extend others have state from parent
            class ClassWithParentAndInterface implements MyInterface extends MyOtherClass {
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on empty class', () : void => {
        var script : string = `
            // empty class can be a module instead
            class MyClass {
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "A stateless class was found. This indicates a failure in the object model: MyClass",
                "name": "file.ts",
                "ruleName": "no-stateless-class",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on empty class with only a constructor', () : void => {
        var script : string = `
            // empty class can be a module instead
            class MyClass {
              constructor() {
              }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "A stateless class was found. This indicates a failure in the object model: MyClass",
                "name": "file.ts",
                "ruleName": "no-stateless-class",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on empty class that implements an interface', () : void => {
        var script : string = `
            class MyClass implements MyInterface{
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "A stateless class was found. This indicates a failure in the object model: MyClass",
                "name": "file.ts",
                "ruleName": "no-stateless-class",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on class with only static fields', () : void => {
        var script : string = `
            class MyClass {
              private static field;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "A stateless class was found. This indicates a failure in the object model: MyClass",
                "name": "file.ts",
                "ruleName": "no-stateless-class",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on class with only static methods', () : void => {
        var script : string = `
            class MyClass {
              private static myMethod() {
              }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "A stateless class was found. This indicates a failure in the object model: MyClass",
                "name": "file.ts",
                "ruleName": "no-stateless-class",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
