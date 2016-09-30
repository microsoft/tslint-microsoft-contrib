import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('preferConstRule', (): void => {
    const ruleName: string = 'prefer-const';

    describe('global scoped variables', (): void => {
        it('should allow a const declaration', (): void => {
            const inputScript: string = 'const x = 123;';

            TestHelper.assertViolations(ruleName, inputScript, []);
        });

        it('should allow a let declaration if the variable is reassigned', (): void => {
            const inputScript: string = `
                let x = 123;
                x = 456;
            `;

            TestHelper.assertViolations(ruleName, inputScript, []);
        });

        it('should ban a let declaration if the variable is never reassigned', (): void => {
            const inputScript: string = 'let x = 123;';

            TestHelper.assertViolations(ruleName, inputScript, [
                {
                    failure: 'Identifier \'x\' never appears on the LHS of an assignment - use const instead of let for its declaration.',
                    name: 'file.ts',
                    ruleName: ruleName,
                    startPosition: {
                        character: 5,
                        line: 1
                    }
                }
            ]);
        });
    });

    describe('function scoped variables', (): void => {
        it('should allow a const declaration', (): void => {
            const inputScript: string = `
                function () {
                    const x = 123;
                }
            `;

            TestHelper.assertViolations(ruleName, inputScript, []);
        });

        it('should allow a let declaration if the variable is reassigned', (): void => {
            const inputScript: string = `
                function () {
                    let x = 123;
                    x = 456;
                }
            `;

            TestHelper.assertViolations(ruleName, inputScript, []);
        });

        it('should ban a let declaration if the variable is never reassigned', (): void => {
            const inputScript: string = `
                function () {
                    let x = 123;
                }
            `;

            TestHelper.assertViolations(ruleName, inputScript, [
                {
                    failure: 'Identifier \'x\' never appears on the LHS of an assignment - use const instead of let for its declaration.',
                    name: 'file.ts',
                    ruleName: ruleName,
                    startPosition: {
                        character: 25,
                        line: 3
                    }
                }
            ]);
        });
    });

    describe('mixed scope variables', (): void => {
        it('should allow a let declaration if the variable is reassigned', (): void => {
            const inputScript: string = `
                let x = 123;
                function () {
                    x = 456;
                }
            `;

            TestHelper.assertViolations(ruleName, inputScript, []);
        });
    });

    describe('for loop variables', (): void => {
        it('should allow a for-in loop variable const declaration that is never reassigned', (): void => {
            const inputScript: string = 'for (const x in []) { }';

            TestHelper.assertViolations(ruleName, inputScript, []);
        });

        it('should ban a for-in loop variable let declaration that is never reassigned', (): void => {
            const inputScript: string = 'for (let x in []) { }';

            TestHelper.assertViolations(ruleName, inputScript, [
                {
                    failure: 'Identifier \'x\' never appears on the LHS of an assignment - use const instead of let for its declaration.',
                    name: 'file.ts',
                    ruleName: ruleName,
                    startPosition: {
                        character: 10,
                        line: 1
                    }
                }
            ]);
        });

        it('should allow a for-in loop variable let declaration that is reassigned', (): void => {
            const inputScript: string = `
                for (let x in []) {
                    x = 123;
                }
            `;

            TestHelper.assertViolations(ruleName, inputScript, []);
        });

        it('should allow a for-of loop variable const declaration that is never reassigned', (): void => {
            const inputScript: string = 'for (const x of []) { }';

            TestHelper.assertViolations(ruleName, inputScript, []);
        });

        it('should ban a for-of loop variable let declaration that is never reassigned', (): void => {
            const inputScript: string = 'for (let x of []) { }';

            TestHelper.assertViolations(ruleName, inputScript, [
                {
                    failure: 'Identifier \'x\' never appears on the LHS of an assignment - use const instead of let for its declaration.',
                    name: 'file.ts',
                    ruleName: ruleName,
                    startPosition: {
                        character: 10,
                        line: 1
                    }
                }
            ]);
        });

        it('should allow a for-of loop variable let declaration that is reassigned', (): void => {
            const inputScript: string = `
                for (let x of []) {
                    x = 123;
                }
            `;

            TestHelper.assertViolations(ruleName, inputScript, []);
        });
    });

    it('should allow a let declaration that is incremented', (): void => {
        const inputScript: string = `
            let x = 123;
            x++;
        `;

        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should allow a let declaration that is decremented', (): void => {
        const inputScript: string = `
            let x = 123;
            x--;
        `;

        TestHelper.assertViolations(ruleName, inputScript, []);
    });
});
