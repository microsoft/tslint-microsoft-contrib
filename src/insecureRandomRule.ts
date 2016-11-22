import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const MATH_FAIL_STRING: string = 'Math.random produces insecure random numbers. ' +
    'Use crypto.randomBytes() or window.crypto.getRandomValues() instead';

const NODE_FAIL_STRING: string = 'crypto.pseudoRandomBytes produces insecure random numbers. ' +
    'Use crypto.randomBytes() instead';

/**
 * Implementation of the insecure-random rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'insecure-random',
        type: 'functionality',
        description: 'Do not use insecure sources for random bytes',
        options: null,
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Security',
        commonWeaknessEnumeration: '330'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new InsecureRandomRuleWalker(sourceFile, this.getOptions()));
    }
}

class InsecureRandomRuleWalker extends ErrorTolerantWalker {

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        if (node.expression.getText() === 'Math' &&  node.name.text === 'random') {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), MATH_FAIL_STRING));
        } else if (node.name.text === 'pseudoRandomBytes') {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), NODE_FAIL_STRING));
        }
        super.visitPropertyAccessExpression(node);
    }
}
