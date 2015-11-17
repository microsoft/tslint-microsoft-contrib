/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./utils/TestHelper');

/**
 * Unit tests.
 */
describe('mochaAvoidOnlyRule', () : void => {

    var ruleName : string = 'mocha-avoid-only';

    it('should pass when only is not invoked', () : void => {
        var script : string = `
            describe('some unit test', () => {
                it('some test', () => {
                    // some test code
                });

                // these are not calls to mocha's it.only
                it.only();
                it.only('');
                it.only(() => {});
                it.only(something, () => {});
                it.only('', something);
                it.only(something, somethingElse);

                // these are not calls to mocha's describe.only
                describe.only();
                describe.only('');
                describe.only(() => {});
                describe.only(something, () => {});
                describe.only('', something);
                describe.only(something, somethingElse);
            });
        `;

        TestHelper.assertViolations(ruleName, null, script, [ ]);
    });

    it('should fail on it.only with lambda', () : void => {
        var script : string = `
            describe('some unit test', () => {
                it.only('some test', () => {
                    // some test code
                });
            });
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Do not commit Mocha it.only function call",
                "name": "file.ts",
                "ruleName": "mocha-avoid-only",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

    it('should fail on it.only with function', () : void => {
        var script : string = `
            describe('some unit test', () => {
                it.only('some test', function() {
                    // some test code
                });
            });
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Do not commit Mocha it.only function call",
                "name": "file.ts",
                "ruleName": "mocha-avoid-only",
                "startPosition": { "character": 17, "line": 3 }
            }
        ]);
    });

    it('should fail on describe.only with lambda', () : void => {
        var script : string = `
            describe.only('some unit test', () => {
                // some test code
            });
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Do not commit Mocha describe.only function call",
                "name": "file.ts",
                "ruleName": "mocha-avoid-only",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on describe.only with function', () : void => {
        var script : string = `
            describe.only('some unit test', function() {
                // some test code
            });
        `;

        TestHelper.assertViolations(ruleName, null, script, [
            {
                "failure": "Do not commit Mocha describe.only function call",
                "name": "file.ts",
                "ruleName": "mocha-avoid-only",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
