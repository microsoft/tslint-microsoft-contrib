/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('jquery-deferred-must-complete', () : void => {
    var ruleName : string = 'jquery-deferred-must-complete';

    describe('should pass', () : void => {
        it('when deferred named jquery completes', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    deferred.resolve();
                } else {
                    if (somethingElse) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }
                return deferred.promise();
            }`;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when deferred named jquery completes - let declaration', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                let deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    deferred.resolve();
                } else {
                    if (somethingElse) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }
                return deferred.promise();
            }`;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when deferred named $ completes', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = $.Deferred<void>();
                if (something) {
                    deferred.resolve();
                } else {
                    if (somethingElse) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }
                return deferred.promise();
            }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('on resolve', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = $.Deferred<void>();
                deferred.resolve();
                return deferred.promise();
            }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('on reject', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = $.Deferred<void>();
                deferred.reject();
                return deferred.promise();
            }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('when single branch is completed - with if-statement', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    deferred.resolve();
                }
                return deferred.promise();
            }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single branch is completed - with if-else-statement', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    deferred.resolve();
                } else {
                    deferred.resolve();
                }
                return deferred.promise();
            }`;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single branch is completed - with if-else-statement', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    if (somethingElse) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                } else {
                    if (somethingElse) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('with nested if-else statement', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    if (somethingElse) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                } else {
                    if (somethingElse) {
                        deferred.somethingElse();
                    } else {
                        deferred.reject();
                    }
                    deferred.reject(); // branches are not even analyzed when main thread resolves
                }
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a function', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                someCall(function () {
                    deferred.resolve();
                });
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a lambda', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                someCall(() => {
                    deferred.resolve();
                });
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a function', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                someCall(function (someParm) {
                    deferred.resolve();
                });
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a lambda', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                someCall((someParm) => { // this parameter actually shadows the one in the enclosing scope
                    deferred.resolve();
                });
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a for loop', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                for(var x = 0; x < something.length; x++) {
                    deferred.resolve();
                }
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a for in loop', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                for(var x in something) {
                    deferred.resolve();
                }
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when resolved within a while loop', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                while (something) {
                    deferred.resolve();
                }
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when deferred reference escaped into a function call', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                doSomething(deferred); // reference escapes and we assume it resolves
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [ ]);
        });
    });

    describe('should fail', () : void => {
        it('when has no complete', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = $.Deferred<void>();
                return deferred.promise();
            }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: " +
                                "'deferred: JQueryDeferred<void> = $.Deferred<void>()'",
                    "name": "file.ts",
                    "ruleName": "jquery-deferred-must-complete",
                    "startPosition": {"character": 21, "line": 3}
                }
            ]);
        });

        it('when has no complete - var declared on two lines', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void>;
                deferred = $.Deferred<void>();
                return deferred.promise();
            }
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: " +
                                "'deferred = $.Deferred<void>()'",
                    "name": "file.ts",
                    "ruleName": "jquery-deferred-must-complete",
                    "startPosition": {"character": 17, "line": 4}
                }
            ]);
        });

        it('when single branch is missing complete - with if-statement', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    deferred.someOtherFunction();
                }
                return deferred.promise();
            }`;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: " +
                                "'deferred: JQueryDeferred<void> = jquery.Deferred<void>()'",
                    "name": "file.ts",
                    "ruleName": "jquery-deferred-must-complete",
                    "startPosition": {"character": 21, "line": 3}
                }
            ]);
        });

        it('when single branch is missing complete - with if-else-statement', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    deferred.resolve();
                } else {
                    deferred.someOtherFunction()
                }
                return deferred.promise();
            }`;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: " +
                                "'deferred: JQueryDeferred<void> = jquery.Deferred<void>()'",
                    "name": "file.ts",
                    "ruleName": "jquery-deferred-must-complete",
                    "startPosition": {"character": 21, "line": 3}
                }
            ]);
        });

        it('with nested if-else statement', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                let deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                if (something) {
                    if (somethingElse) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                } else {
                    if (somethingElse) {
                        deferred.somethingElse();
                    } else {
                        deferred.reject();
                    }
                }
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: " +
                                "'deferred: JQueryDeferred<void> = jquery.Deferred<void>()'",
                    "name": "file.ts",
                    "ruleName": "jquery-deferred-must-complete",
                    "startPosition": { "character": 21, "line": 3 }
                }
            ]);
        });

        it('when shadowed parameter resolved within a function', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                someCall(function (deferred) {  // this parameter actually shadows the one in the enclosing scope
                    deferred.resolve();
                });
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: " +
                                "'deferred: JQueryDeferred<void> = jquery.Deferred<void>()'",
                    "name": "file.ts",
                    "ruleName": "jquery-deferred-must-complete",
                    "startPosition": { "character": 21, "line": 3 }
                }
            ]);
        });

        it('when shadowed parameter resolved within a lambda', () : void => {
            var script : string = `
            function myMethod() : JQueryPromise<void> {
                var deferred: JQueryDeferred<void> = jquery.Deferred<void>();
                someCall((arg1, deferred) => { // this parameter actually shadows the one in the enclosing scope
                    deferred.resolve();
                });
                return deferred.promise();
            }`;
            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "A JQuery deferred was found that appears to not have resolve or reject invoked on all code paths: " +
                                "'deferred: JQueryDeferred<void> = jquery.Deferred<void>()'",
                    "name": "file.ts",
                    "ruleName": "jquery-deferred-must-complete",
                    "startPosition": { "character": 21, "line": 3 }
                }
            ]);
        });

    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
