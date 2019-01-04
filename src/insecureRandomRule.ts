import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const MATH_FAIL_STRING: string =
    'Math.random produces insecure random numbers. Use crypto.randomBytes() or window.crypto.getRandomValues() instead';

const NODE_FAIL_STRING: string = 'crypto.pseudoRandomBytes produces insecure random numbers. Use crypto.randomBytes() instead';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'insecure-random',
        type: 'functionality',
        description: 'Do not use insecure sources for random bytes',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Security',
        commonWeaknessEnumeration: '330'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isPropertyAccessExpression(node)) {
            if (node.expression.getText() === 'Math' && node.name.text === 'random') {
                ctx.addFailureAt(node.getStart(), node.getWidth(), MATH_FAIL_STRING);
            } else if (node.name.text === 'pseudoRandomBytes') {
                ctx.addFailureAt(node.getStart(), node.getWidth(), NODE_FAIL_STRING);
            }
        }

        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}
