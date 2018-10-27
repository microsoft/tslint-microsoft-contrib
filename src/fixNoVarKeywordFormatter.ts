'use strict';

import {RuleFailure} from 'tslint';
import {BaseFormatter} from './utils/BaseFormatter';

let warnedForDeprecation = false;

/**
 * Formatter that fixes your var keywords.
 */
/* tslint:disable:export-name */
export class Formatter extends BaseFormatter {
/* tslint:enable:export-name */

    constructor() {
        if (!warnedForDeprecation) {
            console.warn('The fix-no-var-keyword formatter is deprecated. Use --fix instead.');
            warnedForDeprecation = true;
        }

        super('no-var-keyword', function (this: Formatter, failure: RuleFailure): void {
            const fileName: string = failure.getFileName();
            const fileContents: string = this.readFile(fileName);
            const end: number = failure.getEndPosition().getPosition();

            let leftSide: string = fileContents.substring(0, end);
            leftSide = leftSide.replace(/var$/, 'let');
            const rightSide: string = fileContents.substring(end);
            const newContent: string = leftSide + rightSide;

            this.writeFile(fileName, newContent);
            /* tslint:disable:no-console */
            console.log('Automatically converting var to let. Please re-compile and re-lint: ' + fileName);
            /* tslint:enable:no-console */
        });
    }
}