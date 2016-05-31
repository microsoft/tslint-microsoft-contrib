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
        super('no-var-keyword', (failure: RuleFailure): void => {
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
        });
    }
}