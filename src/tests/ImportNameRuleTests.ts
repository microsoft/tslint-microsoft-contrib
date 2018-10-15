import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

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
            import graphqlTag from 'graphql-tag'
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 2 },
                "fix": {
                    "innerStart": 20,
                    "innerLength": 9,
                    "innerText": "App"
                }
            },
            {
                "failure": "Misnamed import. Import should be named 'App' but found 'MyCoolApp2'",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 3 },
                "fix": {
                    "innerStart": 67,
                    "innerLength": 10,
                    "innerText": "App"
                }
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 2 },
                "fix": {
                    "innerStart": 20,
                    "innerLength": 9,
                    "innerText": "App"
                }
            },
            {
                "failure": "Misnamed import. Import should be named 'App' but found 'MyCoolApp2'",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 3 },
                "fix": {
                    "innerStart": 61,
                    "innerLength": 10,
                    "innerText": "App"
                }
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
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 2 },
                "fix": {
                    "innerStart": 20,
                    "innerLength": 7,
                    "innerText": "DependencyManager"
                }
            }
        ]);
    });

    it('should fail import with punctuation and underscore', () : void => {
        const script : string = `
            import UserSettings from "./user-settings.detail_view";
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "Misnamed import. Import should be named 'userSettingsDetailView' but found 'UserSettings'",
                "name": Utils.absolutePath("file.ts"),
                "ruleName": "import-name",
                "startPosition": { "character": 13, "line": 2 },
                "fix": {
                    "innerStart": 20,
                    "innerLength": 12,
                    "innerText": "userSettingsDetailView"
                }
            }
        ]);
    });

    it('should pass on differing names when rule is configured with replacements', () : void => {
        const script : string = `
            import Backbone = require('backbone');
            import React = require('react');
            import isPlainObject from 'is-plain-object';
            import baseChartOptions = require('common/component/chart/options/BaseChartOptions');
        `;

        const options: any[] = [ true, {
            'backbone': 'Backbone',
            'react': 'React',
            'is-plain-object': 'isPlainObject',
            'BaseChartOptions': 'baseChartOptions'
        }];
        TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
    });

    it('should pass on differing names when rule is configured with replacements for ES6', () : void => {
        const script : string = `
        import pkg from 'fs/package-name',
        import abc from 'abc-tag',
        import pqr from 'my-module'
        `;
        const options: any[] = [ true, {
            'fs/package-name': 'pkg',
            'abc-tag': 'abc',
            'myModule': 'pqr'
        }];
        TestHelper.assertViolationsWithOptions(ruleName, options, script, []);
    })
});
