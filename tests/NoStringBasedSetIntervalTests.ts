/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:max-func-body-length */
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noStringBasedSetIntervalRule', () : void => {
    const RULE_NAME : string = 'no-string-based-set-interval';

    it('should produce violations ', () : void => {
        const inputFile : string = `
var typedStringVariable = 'string variable';
var functionVariable = () => {};
var anyVariable : any = () => {};
var createFunction : () => (() => void) = () => {}; // function that produces a function
var untypedCreateFunction: () => any = () => {};    // function that produces a function
var stringFunction : () => string = () => { return ''; }; // function that produces a string

// lambdas are OK
setInterval(() => {});
this.setInterval(() => {});
window.setInterval(() => {});
// functions are OK
setInterval(function () {});
this.setInterval(function () {});
window.setInterval(function () {});
// expressions of type function are OK
setInterval(functionVariable);
this.setInterval(functionVariable);
window.setInterval(functionVariable);
var a = setInterval(functionVariable);
var b = this.setInterval(functionVariable);
var c = window.setInterval(functionVariable);
setInterval(createFunction());
this.setInterval(createFunction());
window.setInterval(createFunction());



// this used to be a false positive.
function invoke(functionArg : () => void) {
    setInterval(functionArg);
}


// these should all create violations
setInterval("var x = 'should fail'");        // example 1
setInterval(typedStringVariable);            // example 2
setInterval(anyVariable);                    // example 3
setInterval(untypedCreateFunction());        // example 4
setInterval(stringFunction());               // example 5
this.setInterval("var x = 'should fail'");   // example 6
this.setInterval(typedStringVariable);       // example 7
this.setInterval(anyVariable);               // example 8
this.setInterval(untypedCreateFunction());   // example 9
this.setInterval(stringFunction());          // example 10
window.setInterval("var x = 'should fail'"); // example 11
window.setInterval(typedStringVariable);     // example 12
window.setInterval(anyVariable);             // example 13
window.setInterval(untypedCreateFunction()); // example 14
window.setInterval(stringFunction());        // example 15
function invoke2(stringArg : string) {
    setInterval(stringArg);                  // example 16
}
function invoke3(anyArg : any) {
    setInterval(anyArg);                     // example 17
}
`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 37, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 38, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 39, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 40, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 41, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 42, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 43, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 44, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 45, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 46, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: \"var x = 'should fail'\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 47, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: typedStringVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 48, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 49, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: untypedCreateFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 50, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 51, "character": 1 }
            },
            {
                "failure": "Forbidden setInterval string parameter: stringArg",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 53, "character": 5 }
            },
            {
                "failure": "Forbidden setInterval string parameter: anyArg",
                "name": "file.ts",
                "ruleName": "no-string-based-set-interval",
                "startPosition": { "line": 56, "character": 5 }
            }
        ]);
    });

});

/* tslint:enable:max-func-body-length */
