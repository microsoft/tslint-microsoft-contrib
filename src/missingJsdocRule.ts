import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the missing-jsdoc rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'missing-jsdoc',
        type: 'maintainability',
        description: 'All files must have a top level JSDoc comment.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'File missing JSDoc comment at the top-level: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MissingJSDocWalker(sourceFile, this.getOptions()));
    }
}

class MissingJSDocWalker extends ErrorTolerantWalker {
    protected visitSourceFile(node: ts.SourceFile): void {
        if (!/^\/\*\*\s*$/gm.test(node.getFullText())) {
            const failureString = Rule.FAILURE_STRING + this.getSourceFile().fileName;
            this.addFailureAt(node.getStart(), node.getWidth(), failureString);
        }
        // do not continue walking
    }
}
