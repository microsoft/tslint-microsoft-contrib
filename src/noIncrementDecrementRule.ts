import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const OPTION_ALLOW_FOR_LOOPS = 'allow-for-loops';

interface Options {
    allowForLoops: boolean;
}

/**
 * Implementation of the no-increment-decrement rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-increment-decrement',
        type: 'maintainability',
        description: 'Avoid use of increment and decrement operators particularly as part of complicated expressions',
        options: {
            type: 'array',
            items: {
                type: 'string',
                enum: [OPTION_ALLOW_FOR_LOOPS]
            },
            minLength: 0,
            maxLength: 1
        },
        optionsDescription: `One argument may be optionally provided: \n\n' +
        '* \`${OPTION_ALLOW_FOR_LOOPS}\` allows increments and decrement operators to be used in for loop headers.`,
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        recommendation: 'false',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn(
                'Warning: no-increment-decrement rule is deprecated. Replace your usage with the TSLint increment-decrement rule.'
            );
            Rule.isWarningShown = true;
        }

        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        return {
            allowForLoops: options.ruleArguments.indexOf(OPTION_ALLOW_FOR_LOOPS) > -1
        };
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    function validateUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden ++ operator');
        } else if (node.operator === ts.SyntaxKind.MinusMinusToken) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden -- operator');
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isForStatement(node)) {
            if (ctx.options.allowForLoops) {
                // If for loops are allowed to contain increment and decrement,
                // check everything except the incrementor
                cb(node.statement);
                if (node.initializer) {
                    cb(node.initializer);
                }
                if (node.condition) {
                    cb(node.condition);
                }
            } else {
                // Otherwise check the node
                ts.forEachChild(node, cb);
            }

            return;
        }

        if (tsutils.isPostfixUnaryExpression(node)) {
            validateUnaryExpression(node);
        } else if (tsutils.isPrefixUnaryExpression(node)) {
            validateUnaryExpression(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
