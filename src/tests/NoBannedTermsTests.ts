import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noBannedTermsRule', () : void => {
    const RULE_NAME : string = 'no-banned-terms';

    describe('module variables', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var caller;
                }`,
                [{
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 25, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var callee;
                }`,
                [{
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 25, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var arguments;
                }`,
                [{
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 25, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var eval;
                }`,
                [{
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 25, "line": 2 }
                }]);
        });
    });

    describe('module functions', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function caller() {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function callee() {}
                }`,
                [{
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function arguments() {}
                }`,
                [{
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function eval() {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });
    });

    describe('class variables', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private caller;
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private callee;
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private arguments;
                }`,
                [  {
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private eval;
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });
    });

    describe('class properties', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private var;
                    set caller(value) {}
                    get caller() { return var;}
                }`,
                [  {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 3 }
                },
                {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 4 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private var;
                    set callee(value) {}
                    get callee() { return var;}
                }`,
                [  {
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 3 }
                },
                {
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 4 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private var;
                    set arguments(value) {}
                    get arguments() { return var;}
                }`,
                [  {
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 3 }
                },
                    {
                        "failure": "Forbidden reference to banned term: arguments",
                        "name": Utils.absolutePath("file.ts"),
                        "ruleName": "no-banned-terms",
                        "startPosition": { "character": 21, "line": 4 }
                    }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    private var;
                    set eval(value) {}
                    get eval() { return var;}
                }`,
                [  {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 3 }
                },
                {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 4 }
                }]);
        });
    });

    describe('class methods', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    caller() {}
                }`,
                [{
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    callee() {}
                }`,
                [{
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    arguments() {}
                }`,
                [{
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    eval() {}
                }`,
                [{
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });
    });

    describe('methods parameters', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    method(caller) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 28, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    method(callee) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 28, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    method(arguments) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 28, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `class Sample {
                    method(eval) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 28, "line": 2 }
                }]);
        });
    });

    describe('function parameters', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function method(caller) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 37, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function method(callee) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 37, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function method(arguments) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 37, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    function method(eval) {}
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 37, "line": 2 }
                }]);
        });
    });

    describe('arrow function parameters', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var func = (caller) => {};
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 33, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var func = (callee) => {};
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 33, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var func = (arguments) => {};
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 33, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `module Sample {
                    var func = (eval) => {};
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 33, "line": 2 }
                }]);
        });
    });

    describe('local variables', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `var caller;`,
                [ {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 5, "line": 1 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `var callee;`,
                [{
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 5, "line": 1 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `var arguments`,
                [ {
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 5, "line": 1 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `var eval;`,
                [  {
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 5, "line": 1 }
                }]);
        });
    });

    describe('interface declarations', () => {
        it('should not refer to caller', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `interface Sample {
                    caller: any;
                }`,
                [  {
                    "failure": "Forbidden reference to banned term: caller",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to callee', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `interface Sample {
                    callee: any;
                }`,
                [ {
                    "failure": "Forbidden reference to banned term: callee",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to arguments', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `interface Sample {
                    arguments: any;
                }`,
                [{
                    "failure": "Forbidden reference to banned term: arguments",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });

        it('should not refer to eval', () : void => {
            TestHelper.assertViolations(RULE_NAME,
                `interface Sample {
                    eval: any;
                }`,
                [{
                    "failure": "Forbidden reference to banned term: eval",
                    "name": Utils.absolutePath("file.ts"),
                    "ruleName": "no-banned-terms",
                    "startPosition": { "character": 21, "line": 2 }
                }]);
        });
    });

});
