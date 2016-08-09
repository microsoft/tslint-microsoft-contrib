import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {SyntaxKind} from './utils/SyntaxKind';
import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the use-isnan rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'use-isnan',
        type: 'maintainability',
        description: 'enforces that you use the isNaN() function to check for NaN references instead of a comparison to the NaN constant.',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Ignored',
    };

    public static FAILURE_STRING = 'Found an invalid comparison for NaN: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new UseIsnanRuleWalker(sourceFile, this.getOptions()));
    }
}

class UseIsnanRuleWalker extends ErrorTolerantWalker {
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if (this.isExpressionNaN(node.left) || this.isExpressionNaN(node.right)) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + node.getText()));
        }
        super.visitBinaryExpression(node);
    }

    private isExpressionNaN(node: ts.Node) {
        return node.kind === SyntaxKind.current().Identifier && node.getText() === 'NaN';
    }
}
