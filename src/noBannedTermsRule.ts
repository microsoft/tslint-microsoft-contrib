import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {BannedTermWalker} from './utils/BannedTermWalker';

/**
 * Implementation of the no-banned-terms rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-banned-terms',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Do not use banned terms: caller, callee, eval, arguments.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '676, 242, 116'
    };

    private static FAILURE_STRING: string = 'Forbidden reference to banned term: ';
    private static BANNED_TERMS : string[] = [ 'caller', 'callee', 'arguments', 'eval' ];

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        const walker : Lint.RuleWalker = new BannedTermWalker(
            sourceFile,
            this.getOptions(),
            Rule.FAILURE_STRING,
            Rule.BANNED_TERMS
        );
        return this.applyWithWalker(walker);
    }
}