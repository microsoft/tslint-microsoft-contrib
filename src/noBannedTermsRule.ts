import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { bannedTermWalker, BannedTermOptions } from './utils/BannedTermWalker';

import { isObject } from './utils/TypeGuard';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-banned-terms',
        type: 'maintainability',
        description: 'Do not use banned terms: caller, callee, eval, arguments.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '676, 242, 116'
    };

    private static readonly FAILURE_STRING: string = 'Forbidden reference to banned term: ';
    private static readonly BANNED_TERMS: string[] = ['caller', 'callee', 'arguments', 'eval'];

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, bannedTermWalker, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): BannedTermOptions {
        let allowQuotedProperties: boolean = false;

        if (options.ruleArguments instanceof Array) {
            options.ruleArguments.forEach(opt => {
                if (isObject(opt)) {
                    allowQuotedProperties = opt['allow-quoted-properties'] === true;
                }
            });
        }

        return {
            failureString: Rule.FAILURE_STRING,
            bannedTerms: Rule.BANNED_TERMS,
            allowQuotedProperties
        };
    }
}
