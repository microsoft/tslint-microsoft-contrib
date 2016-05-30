import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import BannedTermWalker = require('./utils/BannedTermWalker');

/**
 * Implementation of the no-reserved-keywords rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    private static FAILURE_STRING = 'Forbidden reference to reserved keyword: ';
    // taken from https://github.com/Microsoft/TypeScript/issues/2536

    private static BANNED_TERMS: string[] = [
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

