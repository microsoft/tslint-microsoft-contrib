/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('missingOptionalAnnotationRule', () : void => {
    const ruleName : string = 'missing-optional-annotation';

    it('should not produce violations', () : void => {
        const inputScript : string = `
class MissingOptionalAnnotationPassingTestInput {

    constructor() {}
    constructor(arg1?) {}
    constructor(arg1, arg2?) {}
    constructor(arg1, arg2?, arg3?) {}

    voidMethod() {}
    unaryMethod(arg1) {}
    bindaryMethod(arg1, arg2?) {}
    ternaryMethod(arg1, arg2?, arg3?) {}

    private arrow0 = () => {};
    private arrow1 = (arg?) => {};
    private arrow2 = (arg1, arg2?) => {};
    private arrow3 = (arg1, arg2?, arg3?) => {};

    private literalFunction0 = function() {};
    private literalFunction1 = function(arg?) {};
    private literalFunction2 = function(arg1, arg2?) {};
    private literalFunction3 = function(arg1, arg2?, arg3?) {};

}

// these declarations need to be made outside of a class
function function0() {}
function function1(arg) {}
function function2(arg1, arg2?) {}
function function3(arg1, arg2?, arg3?) {}`;
        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should not produce violations for 2nd parameter that has a default initializer', () : void => {
        const script : string = 'function something(data? : any, others: Object = {}) { }';
        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should produce a violation when 1st parameter has a default initializer', () : void => {
        const script : string = 'function something(data : Object = {}, others: any) { }';
        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Argument following optional argument missing optional annotation:  others: any",
                "name": "file.ts",
                "ruleName": "missing-optional-annotation",
                "startPosition": {
                    "character": 40,
                    "line": 1
                }
            }
        ]);
    });

    it('should produce violations', () : void => {
        const inputFile : string = `
class MissingOptionalAnnotationPassingTestInput {

    constructor(optionalArg1?, requiredArg2) {}
    constructor(requiredArg1, optionalArg2?, requiredArg3) {}

    bindaryMethod(optionalArg1?, requiredArg2) {}
    ternaryMethod(requiredArg1, optionalArg2?, requiredArg3) {}

    private arrow2 = (optionalArg1?, requiredArg2) => {};
    private arrow3 = (requiredArg1, optionalArg2?, requiredArg3) => {};

    private literalFunction2 = function(optionalArg1?, requiredArg2) {};
    private literalFunction3 = function(requiredArg1, optionalArg2?, requiredArg3) {};

}

// these declarations need to be made outside of a class
function function2(optionalArg1?, requiredArg2) {}
function function3(requiredArg1, optionalArg2?, requiredArg3) {}`;
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 4, "character": 32 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 5, "character": 46 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 7, "character": 34 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 8, "character": 48 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 10, "character": 38 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 11, "character": 52 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 13, "character": 56 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 14, "character": 70 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg2",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 19, "character": 35 }
                },
                {
                    "failure": "Argument following optional argument missing optional annotation:  requiredArg3",
                    "name": "file.ts",
                    "ruleName": "missing-optional-annotation",
                    "startPosition": { "line": 20, "character": 49 }
                }
            ]
        );
    });
});

