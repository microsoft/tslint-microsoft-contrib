import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';
import {AstUtils} from './utils/AstUtils';
import {Utils} from './utils/Utils';

const FAILURE_STRING: string = 'Non-literal (insecure) parameter passed to require(): ';

/**
 * Implementation of the non-literal-require rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'non-literal-require',
        type: 'functionality',
        description: 'Detect require includes that are not for string literals',
        options: null,
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '95,676'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NonLiteralRequireRuleWalker(sourceFile, this.getOptions()));
    }
}

class NonLiteralRequireRuleWalker extends ErrorTolerantWalker {

    protected visitCallExpression(node: ts.CallExpression): void {
        if (AstUtils.getFunctionName(node) === 'require'
            && AstUtils.getFunctionTarget(node) == null
            && node.arguments.length > 0) {

            if (node.arguments[0].kind === SyntaxKind.current().ArrayLiteralExpression) {
                const arrayExp: ts.ArrayLiteralExpression = <ts.ArrayLiteralExpression>node.arguments[0];
                arrayExp.elements.forEach((initExpression: ts.Expression): void => {
                    if (initExpression.kind !== SyntaxKind.current().StringLiteral) {
                        this.fail(initExpression);
                    }
                });
            } else if (node.arguments[0].kind !== SyntaxKind.current().StringLiteral) {
                this.fail(node.arguments[0]);
            }
        }
        super.visitCallExpression(node);
    }

    private fail(expression: ts.Expression): void {
        const start: number = expression.getStart();
        const width: number  = expression.getWidth();
        const message: string  = FAILURE_STRING + Utils.trimTo(expression.getText(), 25);
        this.addFailure(this.createFailure(start, width, message));

    }
}
