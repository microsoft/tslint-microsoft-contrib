/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */

import TestHelper = require('./TestHelper');

/**
 * Unit tests.
 */
describe('noRelativeImportsRule', () : void => {
    var ruleName : string = 'no-relative-imports';

    it('should pass on absolute path require imports', () : void => {
        var script : string = `
            import App = require('App');
            import App = require('common/App');
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on absolute path ES6 imports', () : void => {
        var script : string = `
            ﻿import OfficeApp from 'OfficeApp';
            ﻿import OfficeApp from 'common/OfficeApp';
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on relative path require import', () : void => {
        var script : string = `
            import App = require('./App');
            import App = require('../common/App');
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "External module is being loaded from a relative path. Please use an absolute path: require('./App')",
                "name": "file.ts",
                "ruleName": "no-relative-imports",
                "startPosition": { "character": 26, "line": 2 }
            },
            {
                "failure": "External module is being loaded from a relative path. Please use an absolute path: require('../common/App')",
                "name": "file.ts",
                "ruleName": "no-relative-imports",
                "startPosition": { "character": 26, "line": 3 }
            }
        ]);
    });

    it('should fail on relative path ES6 import', () : void => {
        var script : string = `
            ﻿import OfficeApp from './OfficeApp';
            ﻿import OfficeApp from '../common/OfficeApp';
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Imported module is being loaded from a relative path. " +
                    "Please use an absolute path: import OfficeApp from './OfficeApp';",
                "name": "file.ts",
                "ruleName": "no-relative-imports",
                "startPosition": { "character": 14, "line": 2 }
            },
            {
                "failure": "Imported module is being loaded from a relative path. " +
                    "Please use an absolute path: import OfficeApp from '../common/OfficeApp';",
                "name": "file.ts",
                "ruleName": "no-relative-imports",
                "startPosition": { "character": 14, "line": 3 }
            }
        ]);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
