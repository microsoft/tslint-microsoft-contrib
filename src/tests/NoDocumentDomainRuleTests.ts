import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

describe('noDocumentDomainRule', () : void => {
    const ruleName : string = 'no-document-domain';

    it('should pass when not setting a value to document.domain', () : void => {
        const script : string = `
            console.log(document.domain);
            console.log(document.domain.value);
            let x = document.domain;
            let y = document.domain.value;

            document.domain.value = 'some value';
            model.domain = 'some model value';
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on assigning constant', () : void => {
        const script : string = `
            document.domain = 'some value';
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Forbidden write to document.domain: document.domain = 'some value'",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-document-domain",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on assigning variable', () : void => {
        const script : string = `
            document.domain = someValue;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Forbidden write to document.domain: document.domain = someValue",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-document-domain",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should fail on assigning variable on window', () : void => {
        const script : string = `
            window.document.domain = someValue;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Forbidden write to document.domain: window.document.domain = someValue",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "no-document-domain",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

    it('should pass when document is aliased because the type checker is so weak', () : void => {
        const script : string = `
            let doc: Document = document;
            doc.domain = 'some value';
        `;

        TestHelper.assertViolations(ruleName, script, []);
    });

});
