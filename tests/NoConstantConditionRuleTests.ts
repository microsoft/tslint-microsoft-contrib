/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noConstantConditionRule', () : void => {
    let ruleName : string = 'no-constant-condition';

    it('should pass on comparisons', () : void => {
        let script : string = `
            if (something === false) {}
            if (something === true) {}
            if (something > 1) {}
            if (1 > something) {}
            if (0 < 9 < 4 > something) {}
            if (something < 9 < 4 > 2) {}
            if (0 && 9 || 4 && !something) {}
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on if-booleans', () : void => {
        let script : string = `
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

    it('should fail on constant comparisons', () : void => {
        let script : string = `
            if (0 < 9) {}
            if (0 > 9) {}
            if (0 <= 9) {}
            if (0 >= 9) {}
            if (0 == 9) {}
            if (0 != 9) {}
            if (0 === 9) {}
            if (0 !== 9) {}
            if (0 >= 9) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0 < 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (0 > 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found constant conditional: if (0 <= 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found constant conditional: if (0 >= 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 5 }
            },
            {
                "failure": "Found constant conditional: if (0 == 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 6 }
            },
            {
                "failure": "Found constant conditional: if (0 != 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 7 }
            },
            {
                "failure": "Found constant conditional: if (0 === 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 8 }
            },
            {
                "failure": "Found constant conditional: if (0 !== 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 9 }
            },
            {
                "failure": "Found constant conditional: if (0 >= 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 10 }
            }
        ]);
    });

    it('should fail on nested constant comparison', () : void => {
        let script : string = `
            if (0 < 9 < 4 > 2) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0 < 9 < 4 > 2)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on constant infix arithmetic', () : void => {
        let script : string = `
            if (0 + 9) {}
            if (0 - 9) {}
            if (0 * 9) {}
            if (0 / 9) {}
            if (0 % 9) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0 + 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (0 - 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found constant conditional: if (0 * 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found constant conditional: if (0 / 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 5 }
            },
            {
                "failure": "Found constant conditional: if (0 % 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 6 }
            }
        ]);
    });

    it('should fail on constant postfix arithmetic', () : void => {
        let script : string = `
            if (0++) {}
            if (0--) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0++)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (0--)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on constant prefix arithmetic', () : void => {
        let script : string = `
            if (++0) {}
            if (--0) {}
            if (!true) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (++0)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (--0)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found constant conditional: if (!true)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 4 }
            }
        ]);
    });

    it('should fail on logic operators', () : void => {
        let script : string = `
            if (0 && 2) {}
            if (3 || 9) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0 && 2)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (3 || 9)",
                "name": "file.ts",
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on if-numbers', () : void => {
        let script : string = `
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
        let script : string = `
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
        let script : string = `
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
        let script : string = `
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
        let script : string = `
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
        let script : string = `
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
        let script : string = `
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
        let script : string = `
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
        let script : string = `
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
