'use strict';

import * as fs from 'fs';
import {AbstractFormatter} from 'tslint/lib/language/formatter/abstractFormatter';
import {RuleFailure, RuleFailurePosition} from 'tslint/lib/language/rule/rule';

/**
 * Formatter that fixes your unused imports.
 */
/* tslint:disable:export-name */
export class Formatter extends AbstractFormatter {
/* tslint:enable:export-name */

    public format(allFailures: RuleFailure[]): string {
        this.replaceVarWithLet(allFailures);
        const outputLines = allFailures.map(this.formatFailure);
        return outputLines.join('\n') + '\n';
    }

    protected readFile(fileName: string): string {
        return fs.readFileSync(fileName, { encoding: 'UTF-8' });
    }

    protected writeFile(fileName: string, fileContents: string): void {
        fs.writeFileSync(fileName, fileContents, { encoding: 'UTF-8' });
    }

    private replaceVarWithLet(allFailures: RuleFailure[]): void {
        /* tslint:disable:no-increment-decrement */
        for (let index = allFailures.length - 1; index >= 0; index--) {
        /* tslint:enable:no-increment-decrement */
            const failure = allFailures[index];
            if (failure.getRuleName() === 'no-var-keyword') {
                const fileName: string = failure.getFileName();
                const start: RuleFailurePosition = failure.getStartPosition();
                const fileContents: string = this.readFile(fileName);

                const leftSide: string = fileContents.substring(0, start.getPosition());
                const rightSide: string = fileContents.substring(start.getPosition() + 3);

                const newContent: string = leftSide + 'let' + rightSide;
                this.writeFile(fileName, newContent);
                /* tslint:disable:no-console */
                console.log('Automatically converting var to let. Please re-compile and re-lint: ' + fileName);
                /* tslint:enable:no-console */
            }
        }
    }

    private formatFailure(failure: RuleFailure): string {
        let fileName: string = failure.getFileName();
        let failureString: string = failure.getFailure();
        let ruleName: string = failure.getRuleName();
        let lineAndCharacter = failure.getStartPosition().getLineAndCharacter();
        let positionTuple = '[' + (lineAndCharacter.line + 1) + ', ' + (lineAndCharacter.character + 1) + ']';
        return '(' + ruleName + ') ' + fileName + positionTuple + ': ' + failureString;
    }
}