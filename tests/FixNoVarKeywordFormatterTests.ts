/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

/* tslint:disable:quotemark */
/* tslint:disable:no-multiline-string */
import chai = require('chai');
import TestHelper = require('./TestHelper');
import {Formatter} from '../src/fixNoVarKeywordFormatter';

class FixNoVarKeywordFormatterForTesting extends Formatter {

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
describe('fixNoVarKeywordFormatter', () : void => {

    const ruleName : string = 'no-var-keyword';

    it('should fix a var keyword', () : void => {
        let input : string = `
var foo = bar;
`;

        const formatter = new FixNoVarKeywordFormatterForTesting(input);
        formatter.format(TestHelper.runRule(ruleName, null, input).failures);
        chai.expect(formatter.getOutput().trim()).to.equal(
`
let foo = bar;
`.trim());
    });
});
/* tslint:enable:quotemark */
/* tslint:enable:no-multiline-string */
