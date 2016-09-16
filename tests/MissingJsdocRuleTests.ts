/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('missing-jsdoc', () : void => {
    const ruleName : string = 'missing-jsdoc';

    it('should not fail on top level comment', () : void => {
        const script : string = `
/**
 * whatever
 */
function whatever() { }`;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should not fail on top level comment with trailing spaces', () : void => {
        const script : string = `
/**
 * whatever
 */
function whatever() { }`;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on missing comment', () : void => {
        const script : string = `
function whatever() { }`;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "File missing JSDoc comment at the top-level: file.ts",
                "name": "file.ts",
                "ruleName": "missing-jsdoc",
                "startPosition": { "character": 1, "line": 2 }
            }
        ]);
    });

    it('should fail on one star comment', () : void => {
        const script : string = `
/*
 * whatever
 */
function whatever() { }`;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "File missing JSDoc comment at the top-level: file.ts",
                "name": "file.ts",
                "ruleName": "missing-jsdoc",
                "startPosition": { "character": 1, "line": 5 }
            }
        ]);
    });

    it('should fail on three star comment', () : void => {
        const script : string = `
/***
 * whatever
 */
function whatever() { }`;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "File missing JSDoc comment at the top-level: file.ts",
                "name": "file.ts",
                "ruleName": "missing-jsdoc",
                "startPosition": { "character": 1, "line": 5 }
            }
        ]);
    });

    it('should fail on trailing chars', () : void => {
        const script : string = `
/** bad format
 * whatever
 */
function whatever() { }`;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "File missing JSDoc comment at the top-level: file.ts",
                "name": "file.ts",
                "ruleName": "missing-jsdoc",
                "startPosition": { "character": 1, "line": 5 }
            }
        ]);
    });

    it('should fail on leading spaces', () : void => {
        const script : string = `
    /**
     * whatever
     */
    function indentedLikeAModuleFunction() { }`;

        TestHelper.assertViolations(ruleName, script, [
            {
                "failure": "File missing JSDoc comment at the top-level: file.ts",
                "name": "file.ts",
                "ruleName": "missing-jsdoc",
                "startPosition": { "character": 5, "line": 5 }
            }
        ]);
    });
});
