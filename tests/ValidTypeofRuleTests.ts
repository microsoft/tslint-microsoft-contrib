/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('validTypeofRule', () : void => {

    var ruleName : string = 'valid-typeof';

    it('should pass on valid typeofs', () : void => {
        var script : string = `
            typeof bar === "undefined"
            typeof bar == "undefined"
            typeof bar !== "undefined"
            typeof bar != "undefined"
            "undefined" === typeof bar
            typeof foo === "object"
            typeof foo === "boolean"
            typeof foo === "number"
            typeof foo === "string"
            "function" === typeof foo
            typeof foo == baz
            typeof bar === typeof qux
            typeof Symbol() === "symbol"
            typeof Symbol("foo") === "symbol"
            typeof Symbol.iterator === "symbol"
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on invalid string with ===', () : void => {
        var script : string = `
            typeof foo === "strnig"
            "strnig" === typeof foo
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Invalid comparison in typeof. Did you mean string?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 28, "line": 2 }
            },
            {
                "failure": "Invalid comparison in typeof. Did you mean string?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 13, "line": 3
                }
            }
        ]);
    });

    it('should fail on invalid string with ==', () : void => {
        var script : string = `
            typeof foo == "funcion"
            "fction" == typeof foo
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Invalid comparison in typeof. Did you mean function?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 27, "line": 2 }
            },
            {
                "failure": "Invalid comparison in typeof. Did you mean function?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on invalid string with !==', () : void => {
        var script : string = `
            typeof foo !== "undfind"
            "ndefined" !== typeof foo
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Invalid comparison in typeof. Did you mean undefined?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 28, "line": 2 }
            },
            {
                "failure": "Invalid comparison in typeof. Did you mean undefined?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on invalid string with !=', () : void => {
        var script : string = `
            typeof foo != "bollean"
            "bollen" != typeof foo
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Invalid comparison in typeof. Did you mean boolean?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 27, "line": 2 }
            },
            {
                "failure": "Invalid comparison in typeof. Did you mean boolean?",
                "name": "file.ts",
                "ruleName": "valid-typeof",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
