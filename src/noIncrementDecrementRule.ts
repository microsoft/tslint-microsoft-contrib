import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const OPTION_ALLOW_FOR_LOOPS = 'allow-for-loops';

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
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoIncrementDecrementWalker(sourceFile, this.getOptions()));
    }
}

class NoIncrementDecrementWalker extends Lint.RuleWalker {
    private readonly allowForLoops: boolean;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.allowForLoops = options.ruleArguments.indexOf(OPTION_ALLOW_FOR_LOOPS) > -1;
    }

    protected visitForStatement(node: ts.ForStatement): void {
        if (this.allowForLoops) {
            // If for loops are allowed to contain increment and decrement,
            // check everything except the incrementor
            super.visitNode(node.statement);
            if (node.initializer) {
                super.visitNode(node.initializer);
            }
            if (node.condition) {
                super.visitNode(node.condition);
            }
        } else {
            // Otherwise check the node
            super.visitForStatement(node);
        }
    }

    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPostfixUnaryExpression(node);
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    private validateUnaryExpression(node: ts.PrefixUnaryExpression | ts.PostfixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden ++ operator');
        } else if (node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden -- operator');
        }
    }
}
