/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noConstantConditionRule', () : void => {

    var ruleName : string = 'no-constant-condition';

    it('should pass on comparisons', () : void => {
        var script : string = `
            if (something === false) {}
            if (something === true) {}
            if (something > 1) {}
            if (1 > something) {}
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on if-booleans', () : void => {
        var script : string = `
            if (false) {}
            if (true) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (false)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (true)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on if-numbers', () : void => {
        var script : string = `
            if (0) {}
            if (1) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (1)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on ternary-booleans', () : void => {
        var script : string = `
            var x = true ? 1 : 0;
            var y = false ? 1 : 0;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: true ?",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 21, "line": 2 }
            },
            {
                "failure": "Found constant conditional: false ?",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 21, "line": 3 }
            }
        ]);
    });

    it('should fail on ternary-numbers', () : void => {
        var script : string = `
            var x = 1 ? 1 : 0;
            var y = 0 ? 1 : 0;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: 1 ?",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 21,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: 0 ?",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 21,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on while-booleans', () : void => {
        var script : string = `
            while (false) {}
            while (true) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (false)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (true)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on while-numbers', () : void => {
        var script : string = `
            while (0) {}
            while (1) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (0)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (1)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on do-while-booleans', () : void => {
        var script : string = `
            do {} while (true)
            do {} while (false)
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (true)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (false)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on do-while-numbers', () : void => {
        var script : string = `
            do {} while (1)
            do {} while (0)
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (1)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (0)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on for-booleans', () : void => {
        var script : string = `
            for (;true;) { }
            for (;false;) { }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: ;true;",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: ;false;",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on for-numbers', () : void => {
        var script : string = `
            for (;1;) { }
            for (;0;) { }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: ;1;",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: ;0;",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
