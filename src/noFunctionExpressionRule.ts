import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-function-expression rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-function-expression',
        type: 'maintainability',
        description: 'Do not use function expressions; use arrow functions (lambdas) instead.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Use arrow function instead of function expression';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoFunctionExpressionRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoFunctionExpressionRuleWalker extends ErrorTolerantWalker {
    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        const walker = new SingleFunctionWalker(this.getSourceFile(), this.getOptions());
        node.getChildren().forEach((node: ts.Node) => {
            walker.walk(node);
        });
        // function expression that access 'this' is allowed
        if (!walker.isAccessingThis) {
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }
        super.visitFunctionExpression(node);
    }
}

class SingleFunctionWalker extends ErrorTolerantWalker {
    public isAccessingThis: boolean = false;
    protected visitNode(node: ts.Node): void {
        if (node.getText() === 'this') {
            this.isAccessingThis = true;
        }
        super.visitNode(node);
    }
    /* tslint:disable:no-empty */
    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        // do not visit inner blocks
    }
    protected visitArrowFunction(node: ts.ArrowFunction): void {
        // do not visit inner blocks
    }
    /* tslint:enable:no-empty */
}