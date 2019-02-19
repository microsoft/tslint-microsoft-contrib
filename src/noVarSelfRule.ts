import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

interface Options {
    bannedVariableNames: RegExp;
}

const FAILURE_STRING: string = 'Assigning this reference to local variable: ';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-var-self',
        type: 'maintainability',
        description: 'Do not use var self = this; instead, manage scope with arrow functions/lambdas.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false',
        commonWeaknessEnumeration: '398, 710'
    };

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-var-self rule is deprecated. Replace your usage with the TSLint no-this-assignment rule.');
            Rule.isWarningShown = true;
        }

        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        const opt: Options = {
            bannedVariableNames: /.*/
        };

        if (options.ruleArguments && options.ruleArguments.length > 0) {
            opt.bannedVariableNames = new RegExp(options.ruleArguments[0]);
        }

        return opt;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { bannedVariableNames } = ctx.options;

    function cb(node: ts.Node): void {
        if (tsutils.isVariableDeclaration(node)) {
            if (node.initializer && node.initializer.kind === ts.SyntaxKind.ThisKeyword) {
                if (tsutils.isIdentifier(node.name)) {
                    const identifier: ts.Identifier = node.name;
                    if (bannedVariableNames.test(identifier.text)) {
                        ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
