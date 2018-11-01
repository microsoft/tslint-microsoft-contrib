"use strict";

import * as fs from "fs";
import { Formatters, RuleFailure } from "tslint";

/**
 * A base class for formatters that fix linting issues.
 */
export class BaseFormatter extends Formatters.AbstractFormatter {
    private readonly ruleName: string;
    private readonly applyFix: (this: BaseFormatter, failure: RuleFailure) => void;

    constructor(ruleName: string, applyFix: (this: BaseFormatter, failure: RuleFailure) => void) {
        super();
        this.ruleName = ruleName;
        this.applyFix = applyFix.bind(this);
    }

    public format(allFailures: RuleFailure[]): string {
        /* tslint:disable:no-increment-decrement */
        for (let index = allFailures.length - 1; index >= 0; index--) {
            /* tslint:enable:no-increment-decrement */
            const failure = allFailures[index];
            if (failure.getRuleName() === this.ruleName) {
                this.applyFix(failure);
            }
        }
        const outputLines = allFailures.map(this.formatFailure);
        return outputLines.join("\n") + "\n";
    }

    protected readFile(fileName: string): string {
        // tslint:disable-next-line non-literal-fs-path
        return fs.readFileSync(fileName, { encoding: "UTF-8" });
    }

    protected writeFile(fileName: string, fileContents: string): void {
        // tslint:disable-next-line non-literal-fs-path
        fs.writeFileSync(fileName, fileContents, { encoding: "UTF-8" });
    }

    private formatFailure(failure: RuleFailure): string {
        const fileName: string = failure.getFileName();
        const failureString: string = failure.getFailure();
        const ruleName: string = failure.getRuleName();
        const lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
        const positionTuple = "[" + (lineAndCharacter.line + 1) + ", " + (lineAndCharacter.character + 1) + "]";
        return "(" + ruleName + ") " + fileName + positionTuple + ": " + failureString;
    }
}
