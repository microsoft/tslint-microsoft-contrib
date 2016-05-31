/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import chai = require('chai');
import TestHelper = require('./TestHelper');
import {Formatter} from '../src/fixNoRequireImportsFormatter';

class FormatterForTesting extends Formatter {

    private input: string;
    private output: string;

    constructor(input: string) {
        super();
        this.input = input;
    }

    public getOutput(): string {
        return this.output;
    }

    protected readFile(fileName: string): string {
        return this.input;
    }

    protected writeFile(fileName: string, fileContents: string): void {
        this.output = fileContents;
    }
}

/**
 * Unit tests.
 */
describe('fixPreferConstFormatter', () : void => {

    const ruleName : string = 'no-require-imports';

    it('should fix imports in middle of list', () : void => {
        const input : string = `
import {BaseFormatter} from './utils/BaseFormatter';
import TestHelper = require('./TestHelper');
import {SyntaxKind} from './utils/SyntaxKind';
`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `
import {BaseFormatter} from './utils/BaseFormatter';
import {TestHelper} from './TestHelper';
import {SyntaxKind} from './utils/SyntaxKind';
`.trim());
    });

    it('should fix imports at start of list', () : void => {
        const input : string = `import TestHelper = require('./TestHelper');
import {SyntaxKind} from './utils/SyntaxKind';
`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `import {TestHelper} from './TestHelper';
import {SyntaxKind} from './utils/SyntaxKind';
`.trim());
    });

    it('should fix imports at end of list', () : void => {
        const input : string = `import {SyntaxKind} from './utils/SyntaxKind';
import TestHelper = require('./TestHelper');

console.log(TestHelper);`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `import {SyntaxKind} from './utils/SyntaxKind';
import {TestHelper} from './TestHelper';

console.log(TestHelper);`.trim());
    });

    it('should fix multiline import', () : void => {
        const input : string = `
import TestHelper = require(
    './TestHelper'
);
`;

        const formatter = new FormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `
import {TestHelper} from
    './TestHelper'
;
`.trim());
    });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
