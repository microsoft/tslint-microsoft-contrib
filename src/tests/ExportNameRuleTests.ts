import {TestHelper} from './TestHelper';
import {Rule} from '../exportNameRule';

/**
 * Unit tests.
 */
describe('exportNameRule', () : void => {
    const ruleName : string = 'export-name';
    const exceptions : string[] = [];
    let original: any;

    beforeEach(() : void => {
        original = Rule.getExceptions;
        Rule.getExceptions = () : any => { return exceptions; };
    });

    afterEach(() : void => {
        Rule.getExceptions = original;
    });

    describe('should pass', (): void => {
        it('when export equals assignment matches', () : void => {
            exceptions.length = 0;
            const inputFile : string = 'test-data/ExportName/ExportNameRulePassingTestInput.ts';
            TestHelper.assertViolations(ruleName, inputFile, []);
        });

        it('when export equals assignment matches in tsx file', () : void => {
            exceptions.length = 0;
            const inputFile : string = 'test-data/ExportName/ExportNameRulePassingTestInput2.tsx';
            TestHelper.assertViolations(ruleName, inputFile, []);
        });

        it('for conflicting name when suppressed', () : void => {
            exceptions.push('ThisIsNot.*NameOfTheFile');
            const inputFile : string = 'test-data/ExportName/ExportNameRuleFailingTestInput.ts';
            TestHelper.assertViolations(ruleName, inputFile, [ ]);
        });

        it('when single module is named same as the file', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export module file {
                }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single module is named same as the file with nested elements', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export module file {
                    export module file2 {
                    }
                    export class file3 {
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single class is named same as the file', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export class file {
                }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when a single namespaced class is named the same as the file', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                namespace com.example {
                    export class file {
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single class is name same as the file with nested elements', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export class file {
                    export module file2 {
                    }
                    export class file3 {
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when multiple classes are exported within a namespace', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                namespace com.example {
                    export class file2 {
                    }
                    export class file3 {
                    }
                }
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single let is named same as the file', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export let file = [];
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single const is named same as the file', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export const file = [];
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single function is named same as the file', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export function file() {};
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when single function is named same as the file exported in separate statement', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                function file() {};
                export { file };
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when anonymous Object is exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export {};
            `;

            TestHelper.assertViolations(ruleName, script, [ ]);
        });

        it('when multiple classes are exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export class file { }
                export class file2 { }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('multiple modules are exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export module file { }
                export module file2 { }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('multiple variables are exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export var x, y;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('when multiple consts are exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export const x = '', y = '';
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('when multiple lets are exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export let x = '', y = '';
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('when a variety of things are exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export let y = '';
                export module file2 { }
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });

        it('when a module and a function are exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                module file {
                    export function toErrorReport() {
                    }
                }
                export = file;
            `;

            TestHelper.assertViolations(ruleName, script, []);
        });
    });

    describe('should fail', (): void => {
        it('for conflicting name', () : void => {
            exceptions.length = 0;
            const inputFile : string = 'test-data/ExportName/ExportNameRuleFailingTestInput.ts';
            TestHelper.assertViolations(ruleName, inputFile, [
                {
                    "failure": "The exported module or identifier name must match the file name. " +
                    "Found: test-data/ExportName/ExportNameRuleFailingTestInput.ts and ThisIsNotTheNameOfTheFile",
                    "name": "test-data/ExportName/ExportNameRuleFailingTestInput.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 10, "line": 4 }
                }
            ]);
        });

        it('for conflicting name in tsx file', () : void => {
            exceptions.length = 0;
            const inputFile : string = 'test-data/ExportName/ExportNameRuleFailingTestInput2.tsx';
            TestHelper.assertViolations(ruleName, inputFile, [
                {
                    "failure": "The exported module or identifier name must match the file name. " +
                    "Found: test-data/ExportName/ExportNameRuleFailingTestInput2.tsx and ThisIsNotTheNameOfTheFile",
                    "name": "test-data/ExportName/ExportNameRuleFailingTestInput2.tsx",
                    "ruleName": "export-name",
                    "startPosition": { "character": 10, "line": 4 }
                }
            ]);
        });

        it('for conflicting name in namespace', () : void => {
            exceptions.length = 0;
            const inputScript : string = `
                namespace com.example {
                    export class NotMatching {
                    }
                }
            `;
            TestHelper.assertViolations(ruleName, inputScript, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and NotMatching",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 21, "line": 3 }
                }
            ]);
        });

        it('when mis-named module is exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export module Example1 {}
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and Example1",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 17, "line": 2
                    }
                }
            ]);
        });

        it('when mis-named class is exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export class Example2 {}
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and Example2",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 17, "line": 2 }
                }
            ]);
        });

        it('when mis-named function is exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export function Example3() {}
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and Example3",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 17, "line": 2 }
                }

            ]);
        });

        it('when mis-named function is exported in a separate statement', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                function Example3a() {}
                export { Example3a };
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and Example3a",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 17, "line": 3 }
                }

            ]);
        });

        it('when mis-named let defined variable is exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export let Example4 = [];
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and Example4",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 28, "line": 2 }
                }
            ]);
        });

        it('when mis-named const is exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export const Example5 = [];
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and Example5",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 30, "line": 2 }
                }
            ]);
        });

        it('when mis-named var defined variable is exported', () : void => {
            // TestHelper assumes that all scripts are within file.ts
            const script : string = `
                export var Example6 = [];
            `;

            TestHelper.assertViolations(ruleName, script, [
                {
                    "failure": "The exported module or identifier name must match the file name. Found: file.ts and Example6",
                    "name": "file.ts",
                    "ruleName": "export-name",
                    "startPosition": { "character": 28, "line": 2 }
                }
            ]);
        });

    });
});
