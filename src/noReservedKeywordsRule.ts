import * as ts from 'typescript';
import * as Lint from 'tslint';

import { bannedTermWalker, BannedTermOptions } from './utils/BannedTermWalker';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

import { isObject } from './utils/TypeGuard';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-reserved-keywords',
        type: 'maintainability',
        description: 'Do not use reserved keywords as names of local variables, fields, functions, or other identifiers.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        recommendation: 'false,',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Deprecated',
        commonWeaknessEnumeration: '398'
    };

    private static readonly FAILURE_STRING: string = 'Forbidden reference to reserved keyword: ';
    // taken from https://github.com/Microsoft/TypeScript/issues/2536

    private static readonly BANNED_TERMS: string[] = [
        // reserved keywords
        'break',
        'case',
        'catch',
        'class',
        'const',
        'continue',
        'debugger',
        'default',
        'delete',
        'do',
        'else',
        'enum',
        'export',
        'extends',
        'false',
        'finally',
        'for',
        'function',
        'if',
        'import',
        'in',
        'instanceof',
        'new',
        'null',
        'return',
        'super',
        'switch',
        'this',
        'throw',
        'true',
        'try',
        'typeof',
        'var',
        'void',
        'while',
        'with',
        // reserved keywords in strict mode
        'as',
        'implements',
        'interface',
        'let',
        'package',
        'private',
        'protected',
        'public',
        'static',
        'yield',
        // contextual keywords
        'any',
        'boolean',
        'constructor',
        'declare',
        'get',
        'module',
        'require',
        'number',
        'set',
        'string',
        'symbol',
        'type',
        'from',
        'of'
    ];

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-reserved-keywords rule is deprecated. Replace your usage with the TSLint variable-name rule.');
            Rule.isWarningShown = true;
        }

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
