import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noFunctionExpressionRule', (): void => {
    const ruleName: string = 'no-function-expression';

    it('should pass on arrow function', (): void => {
        const script: string = `
            var x = (): void => {
            }
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on generator', (): void => {
        const script: string = `
            var x = function *() {
            }
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on named generator', (): void => {
        const script: string = `
            var x = function * namedGenerator() {
            }
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on function with this', (): void => {
        const script: string = `
            var x = function() {
                this.accessBoundProperty;
            }
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

    it('should pass on function expression within a .tsx file', (): void => {
        TestHelper.assertViolations(ruleName, 'test-data/NoFunctionExpressionTests-passing.tsx', [ ]);
    });

    it('should fail on function expression', (): void => {
        const script: string = `
            var x = function() {
                var y = function() {
                    this.accessProperty;
                }
            }
        `;

        TestHelper.assertViolations(ruleName, script, [{
            "failure": "Use arrow function instead of function expression",
            "name": "file.ts",
            "ruleName": "no-function-expression",
            "startPosition": {
                "character": 21,
                "line": 2
            }
        }]);
    });

    it('should fail on nested function expression', (): void => {
        const script: string = `
            var x = function() {
                this.someReference;
                var y = function() {
                    this.someOtherReference;
                    var z = function() {
                        // violation here
                        var z1 = function() {
                            // violation here
                        }
                    }
                }
            ab}
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Use arrow function instead of function expression",
                "name": "file.ts",
                "ruleName": "no-function-expression",
                "startPosition": {"character": 29, "line": 6}
            },
            {
                "failure": "Use arrow function instead of function expression",
                "name": "file.ts",
                "ruleName": "no-function-expression",
                "startPosition": {"character": 34, "line": 8}
            }
        ]);
    });
});
