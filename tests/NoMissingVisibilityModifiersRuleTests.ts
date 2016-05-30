/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noMissingVisibilityModifiers', () : void => {
    const ruleName : string = 'no-missing-visibility-modifiers';

    it('should allow field modifiers', () : void => {
        const inputScript : string = `
class {
    private myField1;
    protected myField2;
    public myField3;
    private static myField4;
    protected static myField5;
    public static myField6;
}`;

        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should allow method modifiers', () : void => {
        const inputScript : string = `
class {
    private myMethod1() {};
    protected myMethod2() {};
    public myMethod3() {};
    private static myMethod4() {};
    protected static myMethod5() {};
    public static myMethod6() {};
}`;

        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should not allow missing field modifiers', () : void => {
        const inputScript : string = `
class {
    myField1;
    static myField2;
}`;

        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Field missing visibility modifier: myField1;",
                "name": "file.ts",
                "ruleName": "no-missing-visibility-modifiers",
                "startPosition": { "character": 5, "line": 3 }
            },
            {
                "failure": "Field missing visibility modifier: static myField2;",
                "name": "file.ts",
                "ruleName": "no-missing-visibility-modifiers",
                "startPosition": { "character": 5, "line": 4 }
            }
        ]);
    });

    it('should not allow missing method modifiers', () : void => {
        const inputScript : string = `
class {
    myMethod1() {
    };
    static myMethod2() {};
}`;

        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "Method missing visibility modifier: myMethod1() {",
                "name": "file.ts",
                "ruleName": "no-missing-visibility-modifiers",
                "startPosition": { "character": 5, "line": 3 }
            },
            {
                "failure": "Method missing visibility modifier: static myMethod2() {}",
                "name": "file.ts",
                "ruleName": "no-missing-visibility-modifiers",
                "startPosition": { "character": 5, "line": 5 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
