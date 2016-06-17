/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noUnusedImportsRule', () : void => {

    const ruleName : string = 'no-unused-imports';

    it('should pass on require import', () : void => {
        const inputFile : string = `
            import chai = require('chai')

            class NoUnusedImportsTestInput {
                constructor() {
                    console.log(chai);
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, []);
    });

    it('should pass on ES6 star import', () : void => {
        const inputFile : string = `
            import * as chai2 from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                    console.log(chai2);
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, []);
    });

    it('should pass on ES6 import', () : void => {
        const inputFile : string = `
            import chai3 from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                    console.log(chai3);
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, []);
    });

    it('should pass on ES6 braced import', () : void => {
        const inputFile : string = `
            import { chai4 } from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                    console.log(chai4);
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, []);
    });

    it('should pass on ES6 braced multi-import', () : void => {
        const inputFile : string = `
            import { chai5, chai6 } from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                    console.log(chai5);
                    console.log(chai6);
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, []);
    });

    it('should fail on unused require import', () : void => {
        const inputFile : string = `
            import NoUnusedImportsRule = require('../src/noUnusedImportsRule');

            class NoUnusedImportsTestInput {
                constructor() {
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, [
            {
                "failure": "unused import: 'NoUnusedImportsRule'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 2, "character": 20 }
            }
        ]);
    });

    it('should be able to handle React imports in tsx files', () : void => {
        const inputFile : string = 'test-data/NoUnusedImports/NoUnusedImportsPassingReactInput.tsx';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            []
        );
    });

    it('should be able to handle React ES6 imports in tsx files', () : void => {
        const inputFile : string = 'test-data/NoUnusedImports/NoUnusedImportsPassingReactES6Input.tsx';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            []
        );
    });

    it('should be able to handle import static references in tsx files', () : void => {
        const inputFile : string = 'test-data/NoUnusedImports/NoUnusedImportsFailingInput.tsx';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            []
        );
    });

    it('should flag an unused relative import', () : void => {
        const inputScript : string = `
import DM = require("DM");
import AB = DM.Dependency;
console.log(DM);`; // AB import is not used!

        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "unused import: 'AB'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 3, "character": 8 }
            }
        ]);
    });

    it('should flag an unused relative ES6 import', () : void => {
        const inputScript : string = `
import DM from "DM";
import AB as DM.Dependency;
console.log(DM);`; // AB import is not used!

        TestHelper.assertViolations(ruleName, inputScript, [
            {
                "failure": "unused import: 'AB'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 3, "character": 8 }
            }
        ]);
    });

    it('should not flag imports that are used as other imports', () : void => {
        const inputScript : string = `
import DM = require("DM");
import AB = DM.Dependency;
console.log(AB);`;

        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should not flag imports that are used as other ES6 imports', () : void => {
        const inputScript : string = `
import DM as "DM";
import AB as DM.Dependency;
console.log(AB);`;

        TestHelper.assertViolations(ruleName, inputScript, []);
    });

    it('should pass on dot-import (from MSE)', (): void => {
        const inputScript: string = `
            import React = require('react');
            import Simulate = React.addons.TestUtils.Simulate;
            Simulate.doit();
        `;

        TestHelper.assertViolations( ruleName, inputScript, []);
    });

    it('should fail on ES6 star import', () : void => {
        const inputFile : string = `
            import * as chai2 from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, [
            {
                "failure": "unused import: 'chai2'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 2, "character": 25 }
            }
        ]);
    });

    it('should fail on ES6 import', () : void => {
        const inputFile : string = `
            import chai3 from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, [
            {
                "failure": "unused import: 'chai3'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 2, "character": 20 }
            }
        ]);
    });

    it('should fail on ES6 braced import', () : void => {
        const inputFile : string = `
            import { chai4 } from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, [
            {
                "failure": "unused import: 'chai4'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 2, "character": 22 }
            }
        ]);
    });

    it('should fail on ES6 braced multi-import', () : void => {
        const inputFile : string = `
            import { chai5, chai6 } from 'chai'

            class NoUnusedImportsTestInput {
                constructor() {
                    console.log(chai5);
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, [
            {
                "failure": "unused import: 'chai6'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 2, "character": 29 }
            }
        ]);
    });

    it('should fail on unused require import', () : void => {
        const inputFile : string = `
            import NoUnusedImportsRule = require('../src/noUnusedImportsRule');

            class NoUnusedImportsTestInput {
                constructor() {
                }
            }
        `;
        TestHelper.assertViolations( ruleName, inputFile, [
            {
                "failure": "unused import: 'NoUnusedImportsRule'",
                "name": "file.ts",
                "ruleName": "no-unused-imports",
                "startPosition": { "line": 2, "character": 20 }
            }
        ]);
    });

    it('should fail on missing reference in tsx files', () : void => {
        const inputFile : string = 'test-data/NoUnusedImports/NoUnusedImportsFailingReactInput.tsx';
        TestHelper.assertViolations(
            ruleName,
            inputFile,
            [
                {
                    "failure": "unused import: 'I18nFacade'",
                    "name": "test-data/NoUnusedImports/NoUnusedImportsFailingReactInput.tsx",
                    "ruleName": "no-unused-imports",
                    "startPosition": { "character": 8, "line": 3 }
                }
            ]
        );
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
