/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import chai = require('chai');
import TestHelper = require('./TestHelper');
import {Formatter} from '../src/fixNoUnusedImportsFormatter';

class FixNoUnusedImportsFormatterForTesting extends Formatter {

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
describe('fixNoUnusedImportsFormatter', () : void => {

    const ruleName : string = 'no-unused-imports';

    it('should fix an unused import at start of file', () : void => {
        var input : string = `import Unused = require('Unused');
class NoUnusedImportsTestInput {
    constructor() {
    }
}`;

        const formatter = new FixNoUnusedImportsFormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
`class NoUnusedImportsTestInput {
    constructor() {
    }
}`.trim());
    });

    it('should fix an unused import at last import line', () : void => {
        var input : string = `import Used = require('Used');
import Unused = require('Unused');

class NoUnusedImportsTestInput {
    constructor() {
        console.log(Used);
    }
}`;

        const formatter = new FixNoUnusedImportsFormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
`import Used = require('Used');
class NoUnusedImportsTestInput {
    constructor() {
        console.log(Used);
    }
}`);
    });

});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
