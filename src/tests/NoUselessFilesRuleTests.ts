import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noUselessFilesRule', () : void => {

    const ruleName : string = 'no-useless-files';

    it('should pass on a normal file that contains code', () : void => {
        const script : string = `
            export class MyClass {
                constructor () {
                    console.log("foo");
                }
            }`;

        TestHelper.assertViolations(ruleName, script, [ ]);
    });

    it('should fail on a file that only contains single-line comments', () : void => {
        const script : string = `// This is the only comment in this file`;

        TestHelper.assertViolations(ruleName, script, [{
            'failure': 'This file only contains comments and should be deleted.',
            'name': Utils.absolutePath('file.ts'),
            'ruleName': ruleName,
            'startPosition': { 'character': 1, 'line': 1 }
        }]);
    });

    it('should fail on a file that only contains multi-line comments', () : void => {
        const script : string = `/*
          export class MyClass {
              constructor () {
                  console.log("foo");
              }
          }
        */`;

        TestHelper.assertViolations(ruleName, script, [{
            'failure': 'This file only contains comments and should be deleted.',
            'name': Utils.absolutePath('file.ts'),
            'ruleName': ruleName,
            'startPosition': { 'character': 1, 'line': 1 }
        }]);
    });

    it('should fail on a file that only contains several comments', () : void => {
        const script : string = `/*
          export class MyClass {
              constructor () {
                  console.log("foo");
              }
          }
        */

        // here is a single line comment

        /* and another
           multline comment */`;

        TestHelper.assertViolations(ruleName, script, [{
            'failure': 'This file only contains comments and should be deleted.',
            'name': Utils.absolutePath('file.ts'),
            'ruleName': ruleName,
            'startPosition': { 'character': 1, 'line': 1 }
        }]);
    });

    it('should fail on a file that only contains whitespace', () : void => {
        //The below string contains spaces, tabs, and linebreaks
        const script : string = `


            			`;

        TestHelper.assertViolations(ruleName, script, [{
            'failure': 'This file is empty and should be deleted.',
            'name': Utils.absolutePath('file.ts'),
            'ruleName': ruleName,
            'startPosition': { 'character': 1, 'line': 1 }
        }]);
    });

    it('should fail on a file that has no content', () : void => {
        const script : string = ``;

        TestHelper.assertViolations(ruleName, script, [{
            'failure': 'This file is empty and should be deleted.',
            'name': Utils.absolutePath('file.ts'),
            'ruleName': ruleName,
            'startPosition': { 'character': 1, 'line': 1 }
        }]);
    });

});
