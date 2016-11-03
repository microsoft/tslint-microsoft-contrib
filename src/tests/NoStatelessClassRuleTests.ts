import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noStatelessClassRule', () : void => {
    const ruleName : string = 'no-stateless-class';

    it('should pass on when class has some state', () : void => {
        const script : string = `
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
        const script : string = `
            class ClassWithParent extends MyOtherClass {
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when class has parent and parent interface', () : void => {
        const script : string = `
            // classes that extend others have state from parent
            class ClassWithParentAndInterface implements MyInterface extends MyOtherClass {
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when constructor declares public properties', () : void => {
        const script : string = `
            class Point {
                constructor(public x: number, public y: number) { }
            }`;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when constructor declares protected properties', () : void => {
        const script : string = `
            class Point {
                constructor(protected x: number, protected y: number) { }
            }`;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when constructor declares private properties', () : void => {
        const script : string = `
            class Point {
                constructor(private x: number, private y: number) { }
            }`;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass when constructor declares readonly properties', () : void => {
        const script : string = `
            class Point {
                constructor(readonly x: number, readonly y: number) { }
            }`;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on empty class', () : void => {
        const script : string = `
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
        const script : string = `
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
        const script : string = `
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
        const script : string = `
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
        const script : string = `
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