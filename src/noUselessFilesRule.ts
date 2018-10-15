import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING_EMPTY: string = 'This file is empty and should be deleted.';
const FAILURE_STRING_COMMENTS: string = 'This file only contains comments and should be deleted.';

/**
 * Implementation of the no-useless-files rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-useless-files',
        type: 'maintainability',
        description: 'Locates files that only contain commented out code, whitespace characters, or have no content',
        options: undefined,
        optionsDescription: '',
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398' //Indicator of Poor Code Quality
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const ruleFailures: Lint.RuleFailure[] = [];

        const fileContent = sourceFile.getFullText().trim();
        const fileContentNoComments = sourceFile.getText().trim();

        if (fileContent.length === 0) {
            //This file only contains whitespace characters, a totally empty & useless file
            ruleFailures.push(new Lint.RuleFailure(sourceFile, 0, 0, FAILURE_STRING_EMPTY, this.getOptions().ruleName));
        } else if (fileContentNoComments.length === 0) {
            //This file only contains code comments, not empty but completely useless
            ruleFailures.push(new Lint.RuleFailure(sourceFile, 0, 0, FAILURE_STRING_COMMENTS, this.getOptions().ruleName));
        }
        return ruleFailures;
    }
}
