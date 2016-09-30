import {TestHelper} from './TestHelper';

/* tslint:disable:no-octal-literal */
/* tslint:disable:max-func-body-length */
/**
 * Unit tests.
 */
describe('noOctalLiteralRule', () : void => {
     const ruleName : string = 'no-octal-literal';

     it('should not fail on similar but acceptable strings', () : void => {
         const script : string = 'test-data/NoOctalLiteral/NoOctalLiteralTestInput-passing.ts';
         TestHelper.assertViolations(ruleName, script, [ ]);
     });

     it('should fail on 3 digit octal literals', () : void => {
         const script : string = `
/**
 * The following code should have no errors:
 */
function demoScriptFail() {
    var a = "Sample text \\251";
    var b = "Sample text \\254 more text";
    var c = 'Sample text \\351';
    var d = 'Sample text \\354 more text';
}`;

         TestHelper.assertViolations(ruleName, script, [
             {
                 "failure": "Octal literals should not be used: \\251",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "character": 26, "line": 6 }
             },
             {
                 "failure": "Octal literals should not be used: \\254",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "character": 26, "line": 7 }
             },
             {
                 "failure": "Octal literals should not be used: \\351",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "character": 26, "line": 8 }
             },
             {
                 "failure": "Octal literals should not be used: \\354",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "character": 26, "line": 9 }
             }
         ]);
     });

    it('should produce violations ', () : void => {
         const inputFile : string = `
/**
 * The following code should have errors:
 */
function demoScriptFail1() {
    return "Sample text \\251";
    return "Sample text \\254 more text";
    return "Sample text \\23";
    return "Sample text \\7";
    return "Sample text \\025";
    return "Sample text \\0";
    return "Sample text \\-0";
    return "Sample text \\-035";
    return "Sample text \\-235";
}

function demoScriptFail2() {
    return 'Sample text \\351';
    return 'Sample text \\354 more text';
    return 'Sample text \\33';
    return 'Sample text \\6';
    return 'Sample text \\125';
    return 'Sample text \\0';
    return 'Sample text \\-0';
    return 'Sample text \\-035';
    return 'Sample text \\-235';
}

`;
         TestHelper.assertViolations(ruleName, inputFile, [
             {
                 "failure": "Octal literals should not be used: \\251",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 6, "character": 25}
             },
             {
                 "failure": "Octal literals should not be used: \\254",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 7, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\23",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 8, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\7",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 9, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\025",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 10, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\0",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 11, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-0",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 12, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-035",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 13, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-235",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 14, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\351",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 18, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\354",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 19, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\33",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 20, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\6",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 21, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\125",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 22, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\0",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 23, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-0",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 24, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-035",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 25, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-235",
                 "name": "file.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 26, "character": 25 }
             }
         ]);
     });

 });

/* tslint:enable:no-octal-literal */
/* tslint:enable:max-func-body-length */
