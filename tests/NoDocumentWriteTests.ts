/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noDocumentWriteRule', () : void => {
    const RULE_NAME : string = 'no-document-write';

    it('should not produce violations ', () : void => {
        const script : string = `
interface DocumentLikeAPI {
    write: ((arg : string) => void);
    writeln: ((arg : string) => void);
}

function documentLikeAPIFunction() : DocumentLikeAPI {
    return {
        write: () => {},
        writeln: () => {},
    };
}

// These usages are OK because they are not on the DOM document
var documentAPI : DocumentLikeAPI = documentLikeAPIFunction();
documentAPI.write('...');
documentAPI.writeln('...');
documentLikeAPIFunction().write('...');
documentLikeAPIFunction().writeln('...');

// wrong # of args
document.write();
document.write('', '');
document.writeln();
document.writeln('', '');

// type system has no idea what 'doc' is
var doc = document;
doc.write('...');
doc.writeln('...');

// type system has no idea what 'documentFunction' returns
function documentFunction() : Document {
    return window.document;
}
documentFunction().write('...');
documentFunction().writeln('...');

// this is not the window presumably
this.document.write('...');
this.document.writeln('...');
`;
        TestHelper.assertViolations(RULE_NAME, script, []);
    });

    it('should produce violations ', () : void => {
        const script : string = `
document.write('...');
document.writeln('...');
window.document.write('...');
window.document.writeln('...');
`;
        TestHelper.assertViolations(RULE_NAME, script, [
            {
                "failure": "Forbidden call to document.write",
                "name": "file.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 1, "line": 2 }
            },
            {
                "failure": "Forbidden call to document.writeln",
                "name": "file.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 1, "line": 3 }
            },
            {
                "failure": "Forbidden call to document.write",
                "name": "file.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 1, "line": 4 }
            },
            {
                "failure": "Forbidden call to document.writeln",
                "name": "file.ts",
                "ruleName": "no-document-write",
                "startPosition": { "character": 1, "line": 5 }
            }
        ]);
    });

});