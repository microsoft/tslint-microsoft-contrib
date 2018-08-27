import * as ts from 'typescript';
import * as Lint from 'tslint';

import {NoStringParameterToFunctionCallWalker} from './utils/NoStringParameterToFunctionCallWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-string-based-set-timeout rule.
 */
export class Rule extends Lint.Rules.OptionallyTypedRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-string-based-set-timeout',
        type: 'maintainability',
        description: 'Do not use the version of setTimeout that accepts code as a string argument.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '95, 676, 242, 116'
    };

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithProgram(sourceFile, undefined);
    }

    public applyWithProgram(sourceFile : ts.SourceFile, program : ts.Program | undefined): Lint.RuleFailure[] {
        const walker : Lint.RuleWalker = new NoStringParameterToFunctionCallWalker(
            sourceFile , 'setTimeout', this.getOptions(), program
        );
        return this.applyWithWalker(walker);
    }
}
