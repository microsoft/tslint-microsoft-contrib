import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {MochaUtils} from './utils/MochaUtils';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'mocha-avoid-only',
        type: 'maintainability',
        description: 'Do not invoke Mocha\'s describe.only, it.only or context.only functions.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public static FAILURE_STRING_IT: string = 'Do not commit Mocha it.only function call';
    public static FAILURE_STRING_SPECIFY: string = 'Do not commit Mocha specify.only function call';
    public static FAILURE_STRING_DESCRIBE: string = 'Do not commit Mocha describe.only function call';
    public static FAILURE_STRING_CONTEXT: string = 'Do not commit Mocha context.only function call';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MochaAvoidOnlyRuleWalker(sourceFile, this.getOptions()));
    }

}

class MochaAvoidOnlyRuleWalker extends ErrorTolerantWalker {

    protected visitSourceFile(node: ts.SourceFile): void {
        if (MochaUtils.isMochaTest(node)) {
            super.visitSourceFile(node);
        }
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            if (node.arguments.length === 2) {
                if (node.arguments[0].kind === ts.SyntaxKind.StringLiteral) {
                    if (node.arguments[1].kind === ts.SyntaxKind.FunctionExpression
                        || node.arguments[1].kind === ts.SyntaxKind.ArrowFunction) {
                        if (node.expression.getText() === 'it.only') {
                            this.addFailureAt(node.getStart(),  node.expression.getText().length, Rule.FAILURE_STRING_IT);
                        } else if (node.expression.getText() === 'specify.only') {
                            this.addFailureAt(node.getStart(),  node.expression.getText().length, Rule.FAILURE_STRING_SPECIFY);
                        } else if (node.expression.getText() === 'describe.only') {
                            this.addFailureAt(node.getStart(),  node.expression.getText().length, Rule.FAILURE_STRING_DESCRIBE);
                        } else if (node.expression.getText() === 'context.only') {
                            this.addFailureAt(node.getStart(),  node.expression.getText().length, Rule.FAILURE_STRING_CONTEXT);
                        }
                    }
                }
            }
        }
        super.visitCallExpression(node);
    }
}
