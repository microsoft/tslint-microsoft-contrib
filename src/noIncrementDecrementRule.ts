import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-increment-decrement',
        type: 'maintainability',
        description: 'Avoid use of increment and decrement operators particularly as part of complicated expressions',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
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

class NoIncrementDecrementWalker extends ErrorTolerantWalker {
    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPostfixUnaryExpression(node);
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): void {
        this.validateUnaryExpression(node);
        super.visitPrefixUnaryExpression(node);
    }

    private validateUnaryExpression(node : ts.PrefixUnaryExpression | ts.PostfixUnaryExpression) {
        if (node.operator === ts.SyntaxKind.PlusPlusToken) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden ++ operator');
        } else if (node.operator === ts.SyntaxKind.MinusMinusToken) {
            this.addFailureAt(node.getStart(), node.getWidth(), 'Forbidden -- operator');
        }
    }

}
