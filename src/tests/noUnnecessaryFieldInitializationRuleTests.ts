import * as path from 'path';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('unnecessaryFieldInitializationRule', () : void => {

    const ruleName : string = 'no-unnecessary-field-initialization';

    it('should pass on settings fields to different values', () : void => {
        const script : string = `
            class MyClass {
                private myField1;
                private myField2 = 'value';
                private myField3 = null;

                constructor() {
                    this.myField1 = 'something';
                    this.myField2 = undefined;
                    this.myField3 = undefined;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on initializing to undefined', () : void => {
        const script : string = `
            class MyClass {
                private myField = undefined;
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary field initialization. Field explicitly initialized to undefined: myField",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-field-initialization",
                "startPosition": { "character": 35, "line": 3 }
            }
        ]);
    });

    it('should fail on setting to undefined', () : void => {
        const script : string = `
            class MyClass {
                private myField;
                constructor() {
                    this.myField = undefined;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary field initialization. Field explicitly initialized to undefined: this.myField",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-field-initialization",
                "startPosition": { "character": 21, "line": 5 }
            }
        ]);
    });

    it('should fail on initializing and setting to same values', () : void => {
        const script : string = `
            class MyClass {
                private myField1 = null;
                private myField2 = 'value';
                private myField3 = 12345;
                private myField4 = true;
                private myField5 = false;

                constructor() {
                    this.myField1 = null;
                    this.myField2 = 'value';
                    this.myField3 = 12345;
                    this.myField4 = true;
                    this.myField5 = false;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Unnecessary field initialization. Field value already initialized in declaration: this.myField1 = null",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-field-initialization",
                "startPosition": { "character": 21, "line": 10 }
            },
            {
                "failure": "Unnecessary field initialization. Field value already initialized in declaration: this.myField2 = 'value'",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-field-initialization",
                "startPosition": { "character": 21, "line": 11 }
            },
            {
                "failure": "Unnecessary field initialization. Field value already initialized in declaration: this.myField3 = 12345",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-field-initialization",
                "startPosition": { "character": 21, "line": 12 }
            },
            {
                "failure": "Unnecessary field initialization. Field value already initialized in declaration: this.myField4 = true",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-field-initialization",
                "startPosition": { "character": 21, "line": 13 }
            },
            {
                "failure": "Unnecessary field initialization. Field value already initialized in declaration: this.myField5 = false",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-field-initialization",
                "startPosition": { "character": 21, "line": 14 }
            }
        ]);
    });

});
