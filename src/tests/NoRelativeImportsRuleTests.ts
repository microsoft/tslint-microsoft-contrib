/* tslint:disable:no-irregular-whitespace */
import * as path from 'path';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noRelativeImportsRule', () : void => {
    const ruleName : string = 'no-relative-imports';

    describe('no options', () : void => {
        it('should pass on absolute path require imports', () : void => {
            const script : string = `
                import App = require('App');
                import App = require('common/App');
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('should pass on absolute path ES6 imports', () : void => {
            const script : string = `
                import OfficeApp from 'OfficeApp';
                import OfficeApp from 'common/OfficeApp';
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('should fail on relative path require import', () : void => {
            const script : string = `
                import App = require('./App');
                import App = require('./common/App');
                import App = require('../common/App');
                import App = require('./../common/App');
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'External module is being loaded from a relative path. ' +
                        'Please use an absolute path: require(\'./App\')',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 30, line: 2 }
                },
                {
                    failure: 'External module is being loaded from a relative path. ' +
                        'Please use an absolute path: require(\'./common/App\')',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 30, line: 3 }
                },
                {
                    failure: 'External module is being loaded from a relative path. ' +
                        'Please use an absolute path: require(\'../common/App\')',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 30, line: 4 }
                },
                {
                    failure: 'External module is being loaded from a relative path. ' +
                        'Please use an absolute path: require(\'./../common/App\')',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 30, line: 5 }
                }
            ]);
        });

        it('should fail on relative path ES6 import', () : void => {
            const script : string = `
                import OfficeApp from './OfficeApp';
                import OfficeApp from './common/OfficeApp';
                import OfficeApp from '../common/OfficeApp';
                import OfficeApp from './../common/OfficeApp';
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    failure: 'Imported module is being loaded from a relative path. ' +
                        'Please use an absolute path: import OfficeApp from \'./OfficeApp\';',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 17, line: 2 }
                },
                {
                    failure: 'Imported module is being loaded from a relative path. ' +
                        'Please use an absolute path: import OfficeApp from \'./common/OfficeApp\';',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 17, line: 3 }
                },
                {
                    failure: 'Imported module is being loaded from a relative path. ' +
                        'Please use an absolute path: import OfficeApp from \'../common/OfficeApp\';',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 17, line: 4 }
                },
                {
                    failure: 'Imported module is being loaded from a relative path. ' +
                        'Please use an absolute path: import OfficeApp from \'./../common/OfficeApp\';',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 17, line: 5 }
                }
            ]);
        });
    });

    describe('allow-siblings enabled', (): void => {
        const options = ['allow-siblings'];

        it('should pass on absolute path require imports when siblings allowed', () : void => {
            const script : string = `
                import App = require('App');
                import App = require('common/App');
            `;
            TestHelper.assertViolationsWithOptions(ruleName, options, script, [ ]);
        });

        it('should pass on absolute path ES6 imports when siblings allowed', () : void => {
            const script : string = `
                import OfficeApp from 'OfficeApp';
                import OfficeApp from 'common/OfficeApp';
            `;

            TestHelper.assertViolationsWithOptions(ruleName, options, script, [ ]);
        });

        it('should fail only when path starts with \'..\' in require import when siblings allowed', () : void => {
            const script : string = `
                import App = require('./App');
                import App = require('./common/App');
                import App = require('../common/App');
                import App = require('./../common/App');
            `;

            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    failure: 'External module path starts with reference to parent directory. ' +
                        'Please use an absolute path or sibling files/folders: require(\'../common/App\')',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 30, line: 4 }
                }
            ]);
        });

        it('should fail only when path starts with \'..\' in ES6 import when siblings allowed', () : void => {
            const script : string = `
                import OfficeApp from './OfficeApp';
                import OfficeApp from './common/OfficeApp';
                import OfficeApp from '../common/OfficeApp';
                import OfficeApp from './../common/OfficeApp';
            `;

            TestHelper.assertViolationsWithOptions(ruleName, options, script, [
                {
                    failure: 'Imported module path starts with reference to parent directory. ' +
                        'Please use an absolute path or sibling files/folders: import OfficeApp from \'../common/OfficeApp\';',
                    name: path.resolve('file.ts'),
                    ruleName: 'no-relative-imports',
                    startPosition: { character: 17, line: 4 }
                }
            ]);
        });
    });
});
/* tslint:enable:no-irregular-whitespace */
