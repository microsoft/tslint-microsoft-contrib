/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noStringBasedSetTimeoutRule', () : void => {
    const RULE_NAME : string = 'no-string-based-set-timeout';

    it('should not throw error - case 1', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 2', () : void => {
        const inputFile : string = `
var globalProp1: () => void;
var globalProp2 = () => {};
var globalProp3 = function () {};

function globalFunction1() {}

setTimeout(globalProp1, 5);
setTimeout(globalProp2, 5);
setTimeout(globalProp3, 5);
setTimeout(globalFunction1, 5);

module SetTimeoutModule {

    var moduleProp1: () => void;
    var moduleProp2 = () => {};
    var moduleProp3 = function () {};

    function moduleFunction1() {
        setTimeout(moduleProp1, 5);
        setTimeout(moduleProp2, 5);
        setTimeout(moduleProp3, 5);
        setTimeout(moduleFunction1, 5);
    }

    class View {

        private property1: () => void;
        private property2 = () => {};
        private property3 = function () {};

        private static property4: () => void;
        private static property5 = () => {};
        private static property6 = function () {};

        private static method1() {}

        private method2(): void {
            setTimeout(View.method1, 5);
            setTimeout(View.property4, 5);
            setTimeout(View.property5, 5);
            setTimeout(View.property6, 5);

            setTimeout(this.method2, 5);
            setTimeout(this.property1, 5);
            setTimeout(this.property2, 5);

            setTimeout(globalProp1, 5);
            setTimeout(globalProp2, 5);
            setTimeout(globalProp3, 5);
            setTimeout(globalFunction1, 5);

            setTimeout(moduleProp1, 5);
            setTimeout(moduleProp2, 5);
            setTimeout(moduleProp3, 5);
            setTimeout(moduleFunction1, 5);

            setTimeout(this.property1, 5);

            var f = function() {
                setTimeout(this.method2, 5);
                setTimeout(this.property1, 5);
                setTimeout(this.property2, 5);
                setTimeout(this.property3, 5);
            };
        }
    }
}
`;
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should support type inference on shadowed variables', () : void => {
        const inputFile : string = `
var globalProp1: () => void;
var globalProp2 = () => {};
var globalProp3 = function () {};

function globalFunction1() {}

module SetTimeoutModule {

    var moduleProp1: () => void;
    var moduleProp2 = () => {};
    var moduleProp3 = function () {};

    var globalProp1: any;                   // ! shadow !
    var globalFunction1 = 'not a function'; // ! shadow !

    function moduleFunction1(globalProp2: any, moduleProp1: any) {        // ! shadow !
        setTimeout(moduleProp1, 5);         // should fail
        setTimeout(moduleProp2, 5);         // should pass
        setTimeout(globalFunction1, 5);     // should fail
        setTimeout(globalProp2, 5);         // should fail
    }

    class View {

        constructor(moduleProp1, globalProp3) {
            setTimeout(globalProp1, 5);     // should fail
            setTimeout(moduleProp1, 5);     // should fail
            setTimeout(globalProp2, 5);     // should pass
        }

        private method2(globalProp3: any): void {   // ! shadow !
            var f = function(moduleProp1) {         // ! shadow !
                var x = (moduleProp2) => {
                    setTimeout(globalProp1, 5);     // should fail
                    setTimeout(globalProp2, 5);     // should pass
                    setTimeout(globalProp3, 5);     // should fail
                    setTimeout(globalFunction1, 5); // should fail

                    setTimeout(moduleProp1, 5);     // should fail
                    setTimeout(moduleProp2, 5);     // should fail
                    setTimeout(moduleProp3, 5);     // should pass
                }
            };
        }

        public set someSetter(moduleProp1: string) {
            setTimeout(moduleProp1, 5);     // should fail
        }
    }
}
`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 18 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalFunction1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 20 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp2",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 21 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 27 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 28 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 35 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalProp3",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 37 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: globalFunction1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 38 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 40 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp2",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 21, "line": 41 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: moduleProp1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 13, "line": 48 }
            }
        ]);
    });

    it('should not throw error - case 3', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error3.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not throw error - case 4', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error4.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: this.onAnimationEnd()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error4.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 11, "character": 13 }
            }
        ]);
    });

    it('should not throw error - case 5', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutTestInput-error5.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should not produce violations', () : void => {
        const inputFile : string = `
var functionVariable = () => {};
var createFunction : () => (() => void) = () => {}; // function that produces a function

// lambdas are OK
setTimeout(() => {});
this.setTimeout(() => {});
window.setTimeout(() => {});
// functions are OK
setTimeout(function () {});
this.setTimeout(function () {});
window.setTimeout(function () {});
// expressions of type function are OK
setTimeout(functionVariable);
this.setTimeout(functionVariable);
window.setTimeout(functionVariable);
var a = setTimeout(functionVariable);
var b = this.setTimeout(functionVariable);
var c = window.setTimeout(functionVariable);
setTimeout(createFunction());
this.setTimeout(createFunction());
window.setTimeout(createFunction());
`;
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should produce violations for string literals', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 3, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: \"var x = 'should fail'\"",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-literals.ts",
                "startPosition": { "line": 5, "character": 1 }
            }
        ]);
    });

    it('should produce violations for string variables', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: typedStringVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-variables.ts",
                "startPosition": { "line": 6, "character": 1
                }
            }
        ]);
    });

    it('should produce violations for any variables', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "ruleName": "no-string-based-set-timeout",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "ruleName": "no-string-based-set-timeout",
                "failure": "Forbidden setTimeout string parameter: anyVariable",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-variables.ts",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for any functions', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: untypedCreateFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-any-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for string functions', () : void => {
        const inputFile : string = 'test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 5, "character": 1 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: stringFunction()",
                "name": "test-data/NoStringBasedSetTimeout/NoStringBasedSetTimeoutFailingTestInput-string-functions.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 6, "character": 1 }
            }
        ]);
    });

    it('should produce violations for parameters', () : void => {
        const inputFile : string = `
// these should all create violations
function invoke2(stringArg : string) {
    setTimeout(stringArg);                  // example 16
}
function invoke3(anyArg : any) {
    setTimeout(anyArg);                     // example 17
}
`;
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: stringArg",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 4, "character": 5 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: anyArg",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "line": 7, "character": 5 }
            }
        ]);
    });

    it('should not produce violations what used to be a false positive case', () : void => {
        const inputFile : string = `
        function invoke(functionArg1 : () => void, functionArg2 = () => {}) {
            setTimeout(functionArg1);
            setTimeout(functionArg2);
        }`;

        TestHelper.assertViolations(RULE_NAME, inputFile, [ ]);
    });

    it('should not fail within a constructor', () : void => {
        const inputFile : string = `
        class MyClass {
            constructor(arg1) {
                setTimeout(arg1, 5);
            }
        }`;

        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: arg1",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 17, "line": 4 }
            }
        ]);
    });

    it('should create violations on template strings', () : void => {
        const inputFile : string = `var data = 'alert(1)';
$window.setTimeout(\`\${data}\`, 200);`;

        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: `${data}`",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 1, "line": 2 }
            }
        ]);
    });

    it('should pass all Issue #46 usages', () : void => {
        const inputFile : string = `class TestClassIssue46 {

    constructor(private $window: angular.IWindowService) {

        //Arrow Functions
        setTimeout(() => { }, 100);
        $window.setTimeout(() => { }, 100);

        //Standard Functions
        setTimeout(function () { }, 100);
        $window.setTimeout(function () { }, 100);

        //Strings
        const alertNum = 1;
        setTimeout("alert(" + alertNum + ")", 100);
        $window.setTimeout("alert(" + alertNum + ")", 100);

        //TS Template Strings
        setTimeout(\`alert(\${alertNum})\`, 100);
        $window.setTimeout(\`alert(\${alertNum})\`, 100);
    }
}`;

        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "failure": "Forbidden setTimeout string parameter: \"alert(\" + alertNum + \")\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 15 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: \"alert(\" + alertNum + \")\"",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 16 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: `alert(${alertNum})`",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 19 }
            },
            {
                "failure": "Forbidden setTimeout string parameter: `alert(${alertNum})`",
                "name": "file.ts",
                "ruleName": "no-string-based-set-timeout",
                "startPosition": { "character": 9, "line": 20 }
            }
        ]);
    });

});