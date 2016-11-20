'use strict';

import {RuleFailure, RuleFailurePosition} from 'tslint/lib/language/rule/rule';
import {BaseFormatter} from './utils/BaseFormatter';

/**
 * Formatter that fixes your unused imports.
 */
/* tslint:disable:export-name */
export class Formatter extends BaseFormatter {
/* tslint:enable:export-name */

    constructor() {
        super('no-unused-imports', function (this: Formatter, failure: RuleFailure): void {
            const fileName: string = failure.getFileName();
            const start: RuleFailurePosition = failure.getStartPosition();
            const end: RuleFailurePosition = failure.getEndPosition();

            let fileContents: string = this.readFile(fileName);

            let startOfViolation: number = fileContents.lastIndexOf('\n', start.getPosition());
            if (startOfViolation === -1) {
                startOfViolation = 0; // make sure to handle the first line in the file
            }
            const endOfViolation: number = fileContents.indexOf('\n', end.getPosition());

            let line: string = fileContents.substring(startOfViolation, endOfViolation);
            line = line.trim(); // trim off any new lines, handle those in regular expression
            line = line.replace(/\(/, '\\(').replace(/\)/, '\\)');
            const regex: RegExp = new RegExp('\\n*' + line + '\\n*', 'mg');

            if (startOfViolation === 0) {
                fileContents = fileContents.replace(regex, '');
            } else {
                fileContents = fileContents.replace(regex, '\n');
            }
            this.writeFile(fileName, fileContents);
            /* tslint:disable:no-console */
            console.log('Automatically removing unused import. Please re-compile and re-lint: ' + fileName);
            /* tslint:enable:no-console */
        });
    }
}