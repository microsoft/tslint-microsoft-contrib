/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import * as chai from 'chai';
import {TestHelper} from './TestHelper';
import {Formatter} from '../src/fixPreferConstFormatter';

class FixPreferConstFormatterForTesting extends Formatter {

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

    const ruleName : string = 'prefer-const';

    it('should fix a let keyword', () : void => {
        const input : string = `
let foo = bar;
`;

        const formatter = new FixPreferConstFormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
`
const foo = bar;
`.trim());
    });

    it('should fix a let keyword and preserve whitespace', () : void => {
        const input : string = `
let   foo = bar;
`;

        const formatter = new FixPreferConstFormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
            `
const   foo = bar;
`.trim());
    });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
