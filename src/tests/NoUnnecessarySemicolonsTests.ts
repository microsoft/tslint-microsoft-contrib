import * as path from 'path';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noUnnecessarySemiColons', () : void => {
    const ruleName : string = 'no-unnecessary-semicolons';

    it('should produce violations', () : void => {
        const inputFile : string = 'test-data/NoUnnecessarySemicolonsTestInput.ts';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": { "line": 2, "character": 1 }
                },
                {
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": { "line": 3, "character": 1 }
                },
                {
                    "failure": "unnecessary semi-colon",
                    "name": "test-data/NoUnnecessarySemicolonsTestInput.ts",
                    "ruleName": "no-unnecessary-semicolons",
                    "startPosition": {"line": 3, "character": 2}
                }
            ]
        );
    });

    it('should pass on empty while loops', () : void => {
        const script : string = `
            while (false);
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should fail on empty while loops with semicolon', () : void => {
        const script : string = `
            while (false) {
            };
        `;
        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "unnecessary semi-colon",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-semicolons",
                "startPosition": { "character": 14, "line": 3 }
            }
        ]);
    });

    it('should pass on empty for loops', () : void => {
        const script : string = `
            for (var i = 0; i < 7; i += 1);
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should pass on short form lambda expression', () : void => {
        const script : string = `
            class MyClass {
                public static myField = () => '';
                public static FAILURE_STRING_FACTORY: (identifier: string) => string =
                    (identifier: string) => 'whatever';
            }
        `;
        TestHelper.assertNoViolation(ruleName, script);
    });

    it('should fail on empty for loops with semicolon', () : void => {
        const script : string = `
            for (var i = 0; i < 7; i += 1) {
            };
        `;
        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "unnecessary semi-colon",
                "name": path.resolve("file.ts"),
                "ruleName": "no-unnecessary-semicolons",
                "startPosition": { "character": 14, "line": 3 }
            }
        ]);
    });
});
