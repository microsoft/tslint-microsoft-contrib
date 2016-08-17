/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:max-func-body-length */
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noStringBasedSetImmediateRule', () : void => {
    const RULE_NAME : string = 'no-string-based-set-immediate';

    it('should produce violations ', () : void => {
        const inputFile : string = `
var typedStringVariable = 'string variable';
var functionVariable = () => {};
var anyVariable : any = () => {};
var createFunction : () => (() => void) = () => {}; // function that produces a function
var untypedCreateFunction: () => any = () => {};    // function that produces a function
var stringFunction : () => string = () => { return ''; }; // function that produces a string

// lambdas are OK
setImmediate(() => {});
this.setImmediate(() => {});
window.setImmediate(() => {});
// functions are OK
setImmediate(function () {});
this.setImmediate(function () {});
window.setImmediate(function () {});
// expressions of type function are OK
setImmediate(functionVariable);
this.setImmediate(functionVariable);
window.setImmediate(functionVariable);
var a = setImmediate(functionVariable);
var b = this.setImmediate(functionVariable);
var c = window.setImmediate(functionVariable);
setImmediate(createFunction());
this.setImmediate(createFunction());
window.setImmediate(createFunction());



// this is no longer a false positive
function invoke(functionArg : () => void) {
    setImmediate(functionArg);
}


// these should all create violations
setImmediate("var x = 'should fail'");        // example 1
setImmediate(typedStringVariable);            // example 2
setImmediate(anyVariable);                    // example 3
setImmediate(untypedCreateFunction());        // example 4
setImmediate(stringFunction());               // example 5
this.setImmediate("var x = 'should fail'");   // example 6
this.setImmediate(typedStringVariable);       // example 7
this.setImmediate(anyVariable);               // example 8
this.setImmediate(untypedCreateFunction());   // example 9
this.setImmediate(stringFunction());          // example 10
window.setImmediate("var x = 'should fail'"); // example 11
window.setImmediate(typedStringVariable);     // example 12
window.setImmediate(anyVariable);             // example 13
window.setImmediate(untypedCreateFunction()); // example 14
window.setImmediate(stringFunction());        // example 15
function invoke2(stringArg : string) {
    setImmediate(stringArg);                  // example 16
}
function invoke3(anyArg : any) {
    setImmediate(anyArg);                     // example 17
}
`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 37, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 38, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 39, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 40, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 41, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 42, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 43, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 44, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 45, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 46, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: \"var x = 'should fail'\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 47, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: typedStringVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 48, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyVariable",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 49, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: untypedCreateFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 50, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringFunction()",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 51, "character": 1 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: stringArg",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 53, "character": 5 }
            },
            {
                "failure": "Forbidden setImmediate string parameter: anyArg",
                "name": "file.ts",
                "ruleName": "no-string-based-set-immediate",
                "startPosition": { "line": 56, "character": 5 }
            }
        ]);
    });

});

/* tslint:enable:max-func-body-length */
