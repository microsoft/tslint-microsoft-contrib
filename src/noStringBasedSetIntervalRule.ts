import * as ts from 'typescript';
import * as Lint from 'tslint';

import { createNoStringParameterToFunctionWalker } from './utils/createNoStringParameterToFunctionWalker';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.OptionallyTypedRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-string-based-set-interval',
        type: 'maintainability',
        description: 'Do not use the version of setInterval that accepts code as a string argument.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '95, 676, 242, 116'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithProgram(sourceFile, undefined);
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program | undefined): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, createNoStringParameterToFunctionWalker('setInterval', this.getOptions(), program));
    }
}
