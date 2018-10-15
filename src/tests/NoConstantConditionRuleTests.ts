import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

describe('noConstantConditionRule', () : void => {
    const ruleName : string = 'no-constant-condition';

    it('should pass on comparisons', () : void => {
        const script : string = `
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

    it('should pass on hard coded loops when checkLoops is false', () : void => {
        const script : string = `
            while (true) {
                doSomething();
            };

            for (;true;) {
                doSomething();
            };

            do {
                doSomething();
            } while (true)`;

        const options: any[] = [ true, { 'checkLoops': false } ];
        TestHelper.assertViolationsWithOptions(ruleName, options, script, [ ]);
    });

    it('should fail on if-booleans', () : void => {
        const script : string = `
            if (false) {}
            if (true) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (false)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (true)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on constant comparisons', () : void => {
        const script : string = `
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (0 > 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found constant conditional: if (0 <= 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found constant conditional: if (0 >= 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 5 }
            },
            {
                "failure": "Found constant conditional: if (0 == 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 6 }
            },
            {
                "failure": "Found constant conditional: if (0 != 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 7 }
            },
            {
                "failure": "Found constant conditional: if (0 === 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 8 }
            },
            {
                "failure": "Found constant conditional: if (0 !== 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 9 }
            },
            {
                "failure": "Found constant conditional: if (0 >= 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 10 }
            }
        ]);
    });

    it('should fail on nested constant comparison', () : void => {
        const script : string = `
            if (0 < 9 < 4 > 2) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0 < 9 < 4 > 2)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on constant infix arithmetic', () : void => {
        const script : string = `
            if (0 + 9) {}
            if (0 - 9) {}
            if (0 * 9) {}
            if (0 / 9) {}
            if (0 % 9) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0 + 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (0 - 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found constant conditional: if (0 * 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 4 }
            },
            {
                "failure": "Found constant conditional: if (0 / 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 5 }
            },
            {
                "failure": "Found constant conditional: if (0 % 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 6 }
            }
        ]);
    });

    it('should fail on constant postfix arithmetic', () : void => {
        const script : string = `
            if (0++) {}
            if (0--) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0++)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (0--)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on constant prefix arithmetic', () : void => {
        const script : string = `
            if (++0) {}
            if (--0) {}
            if (!true) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (++0)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (--0)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            },
            {
                "failure": "Found constant conditional: if (!true)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 4 }
            }
        ]);
    });

    it('should fail on logic operators', () : void => {
        const script : string = `
            if (0 && 2) {}
            if (3 || 9) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0 && 2)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (3 || 9)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on if-numbers', () : void => {
        const script : string = `
            if (0) {}
            if (1) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: if (0)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Found constant conditional: if (1)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on ternary-booleans', () : void => {
        const script : string = `
            var x = true ? 1 : 0;
            var y = false ? 1 : 0;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: true ?",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 21, "line": 2 }
            },
            {
                "failure": "Found constant conditional: false ?",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": { "character": 21, "line": 3 }
            }
        ]);
    });

    it('should fail on ternary-numbers', () : void => {
        const script : string = `
            var x = 1 ? 1 : 0;
            var y = 0 ? 1 : 0;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: 1 ?",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 21,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: 0 ?",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 21,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on while-booleans', () : void => {
        const script : string = `
            while (false) {}
            while (true) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (false)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (true)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on while-numbers', () : void => {
        const script : string = `
            while (0) {}
            while (1) {}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (0)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (1)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on do-while-booleans', () : void => {
        const script : string = `
            do {} while (true)
            do {} while (false)
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (true)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (false)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on do-while-numbers', () : void => {
        const script : string = `
            do {} while (1)
            do {} while (0)
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: while (1)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: while (0)",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on for-booleans', () : void => {
        const script : string = `
            for (;true;) { }
            for (;false;) { }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: ;true;",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: ;false;",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

    it('should fail on for-numbers', () : void => {
        const script : string = `
            for (;1;) { }
            for (;0;) { }
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Found constant conditional: ;1;",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 2
                }
            },
            {
                "failure": "Found constant conditional: ;0;",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-constant-condition",
                "startPosition": {
                    "character": 13,
                    "line": 3
                }
            }
        ]);
    });

});
