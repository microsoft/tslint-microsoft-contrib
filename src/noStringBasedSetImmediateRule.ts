import * as ts from 'typescript';
import * as Lint from 'tslint';

import {NoStringParameterToFunctionCallWalker} from './utils/NoStringParameterToFunctionCallWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-string-parameter-to-function-call rule.
 */
export class Rule extends Lint.Rules.OptionallyTypedRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-string-based-set-immediate',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Do not use the version of setImmediate that accepts code as a string argument.',
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

    public applyWithProgram(sourceFile : ts.SourceFile, program : ts.Program): Lint.RuleFailure[] {
        const walker : Lint.RuleWalker = new NoStringParameterToFunctionCallWalker(
            sourceFile , 'setImmediate', this.getOptions(), program
        );
        return this.applyWithWalker(walker);
    }
}
