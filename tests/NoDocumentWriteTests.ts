/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
import TestHelper = require('./TestHelper');

describe('noDocumentWriteRule', () : void => {

    var RULE_NAME : string = 'no-document-write';

    it('should not produce violations ', () : void => {
        var inputFile : string = 'test-data/NoDocumentWritePassingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, []);
    });

    it('should produce violations ', () : void => {
        var inputFile : string = 'test-data/NoDocumentWriteFailingTestInput.ts';
        TestHelper.assertViolations(RULE_NAME, inputFile, [
            {
                "endPosition": { "character": 8, "line": 6, "position": 88 },
                "failure": "Forbidden call to document.write",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 6, "position": 80 }
            },
            {
                "endPosition": { "character": 8, "line": 7, "position": 112 },
                "failure": "Forbidden call to document.writeln",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 7, "position": 104 }
            },
            {
                "endPosition": { "character": 13, "line": 8, "position": 143 },
                "failure": "Forbidden call to document.write",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 8, "position": 130 }
            },
            {
                "endPosition": { "character": 13, "line": 9, "position": 172 },
                "failure": "Forbidden call to document.writeln",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 9, "position": 159 }
            },
            {
                "endPosition": { "character": 15, "line": 10, "position": 205 },
                "failure": "Forbidden call to document.write",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 10, "position": 190 }
            },
            {
                "endPosition": { "character": 15, "line": 11, "position": 236 },
                "failure": "Forbidden call to document.writeln",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 11, "position": 221 }
            },
            {
                "endPosition": { "character": 18, "line": 13, "position": 274 },
                "failure": "Forbidden call to document.write",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 13, "position": 256 }
            },
            {
                "endPosition": { "character": 18, "line": 14, "position": 308 },
                "failure": "Forbidden call to document.writeln",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 14, "position": 290 }
            },
            {
                "endPosition": { "character": 3, "line": 17, "position": 352 },
                "failure": "Forbidden call to document.write",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 17, "position": 349 }
            },
            {
                "endPosition": { "character": 3, "line": 18, "position": 371 },
                "failure": "Forbidden call to document.writeln",
                "name": "test-data/NoDocumentWriteFailingTestInput.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 0, "line": 18, "position": 368 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
