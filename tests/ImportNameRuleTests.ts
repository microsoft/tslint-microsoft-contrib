/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('importNameRule', () : void => {
    const ruleName : string = 'import-name';

    it('should pass on matching names of external module', () : void => {
        const script : string = `
            import App = require('App');
            import App = require('x/y/z/App');
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on matching names of ES6 import', () : void => {
        const script : string = `
            import App from 'App';
            import App from 'x/y/z/App';
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on matching names of simple import', () : void => {
        const script : string = `
            import DependencyManager = DM.DependencyManager;
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on misnamed external module', () : void => {
        const script : string = `
            import MyCoolApp = require('App');
            import MyCoolApp2 = require('x/y/z/App');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Misnamed import. Import should be named 'App' but found 'MyCoolApp'",
                "name": "file.ts",
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Misnamed import. Import should be named 'App' but found 'MyCoolApp2'",
                "name": "file.ts",
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on misnamed import', () : void => {
        const script : string = `
            import MyCoolApp from 'App';
            import MyCoolApp2 from 'x/y/z/App';
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Misnamed import. Import should be named 'App' but found 'MyCoolApp'",
                "name": "file.ts",
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 2 }
            },
            {
                "failure": "Misnamed import. Import should be named 'App' but found 'MyCoolApp2'",
                "name": "file.ts",
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 3 }
            }
        ]);
    });

    it('should fail on misnamed rename', () : void => {
        const script : string = `
            import Service = DM.DependencyManager;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Misnamed import. Import should be named 'DependencyManager' but found 'Service'",
                "name": "file.ts",
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 2 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
