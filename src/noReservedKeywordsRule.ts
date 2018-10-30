import * as ts from 'typescript';
import * as Lint from 'tslint';

import {BannedTermWalker} from './utils/BannedTermWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

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
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '398'
    };

    private static readonly FAILURE_STRING: string = 'Forbidden reference to reserved keyword: ';
    // taken from https://github.com/Microsoft/TypeScript/issues/2536

    private static readonly BANNED_TERMS: string[] = [
        // reserved keywords
        'break', 'case', 'catch', 'class',
        'const', 'continue', 'debugger', 'default',
        'delete', 'do', 'else', 'enum', 'export',
        'extends', 'false', 'finally', 'for',
        'function', 'if', 'import', 'in',
        'instanceof', 'new', 'null', 'return',
        'super', 'switch', 'this', 'throw',
        'true', 'try', 'typeof', 'var',
        'void', 'while', 'with',
        // reserved keywords in strict mode
        'as', 'implements', 'interface', 'let',
        'package', 'private', 'protected',
        'public', 'static', 'yield',
        // contextual keywords
        'any', 'boolean', 'constructor',
        'declare', 'get', 'module',
        'require', 'number', 'set',
        'string', 'symbol', 'type',
        'from', 'of'
    ];

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const walker: Lint.RuleWalker = new BannedTermWalker(
            sourceFile,
            this.getOptions(),
            Rule.FAILURE_STRING,
            Rule.BANNED_TERMS
        );
        return this.applyWithWalker(walker);
    }
}