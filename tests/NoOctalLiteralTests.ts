/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import TestHelper = require('./utils/TestHelper');

/* tslint:disable:no-octal-literal */
/**
 * Unit tests.
 */
describe('noOctalLiteralRule', () : void => {

     var ruleName : string = 'no-octal-literal';

     it('should not fail on similar but acceptable strings', () : void => {
         var script : string = `
/**
 * The following code should have no errors:
 */
function demoScriptPass1() {
    var x = "Sample text \xB2";
    var y = "Sample text \0111"; // longer than octal
}`;

         TestHelper.assertViolations(ruleName, null, script, [ ]);
     });

     it('should fail on 3 digit octal literals', () : void => {
         var script : string = `
/**
 * The following code should have no errors:
 */
function demoScriptFail() {
    var a = "Sample text \251";
    var b = "Sample text \254 more text";
    var c = 'Sample text \351';
    var d = 'Sample text \354 more text';
}`;

         TestHelper.assertViolations(ruleName, null, script, [ ]);
     });

     it('should produce violations ', () : void => {
         var inputFile : string = 'test-data/NoOctalLiteralTestInput.ts';
         TestHelper.assertViolations(ruleName, null, inputFile, [
             {
                 "failure": "Octal literals should not be used: \\251",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 6, "character": 25}
             },
             {
                 "failure": "Octal literals should not be used: \\254",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 7, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\23",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 8, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\7",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 9, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\025",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 10, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\0",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 11, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-0",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 12, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-035",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 13, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-235",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 14, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\351",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 18, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\354",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 19, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\33",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 20, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\6",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 21, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\125",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 22, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\0",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 23, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-0",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 24, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-035",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 25, "character": 25 }
             },
             {
                 "failure": "Octal literals should not be used: \\-235",
                 "name": "test-data/NoOctalLiteralTestInput.ts",
                 "ruleName": "no-octal-literal",
                 "startPosition": { "line": 26, "character": 25 }
             }
         ]);
     });

 });
/* tslint:enable:quotemark */
/* tslint:enable:no-octal-literal */
/* tslint:enable:no-multiline-string */
