import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noRelativeImportsRule', () : void => {
    const ruleName : string = 'no-relative-imports';

    it('should pass on absolute path require imports', () : void => {
        const script : string = `
            import App = require('App');
            import App = require('common/App');
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should pass on absolute path ES6 imports', () : void => {
        const script : string = `
            ﻿import OfficeApp from 'OfficeApp';
            ﻿import OfficeApp from 'common/OfficeApp';
        `;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on relative path require import', () : void => {
        const script : string = `
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
        const script : string = `
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