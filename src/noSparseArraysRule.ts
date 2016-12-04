import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {Utils} from './utils/Utils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-sparse-arrays rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-sparse-arrays',
        type: 'maintainability',
        description: 'Do not use sparse arrays. Sparse arrays contain empty slots, most frequently due to multiple ' +
                    'commas being used in an array literal.',
        options: null,
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING = 'Unexpected comma in middle of array';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoSparseArraysRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoSparseArraysRuleWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().ArrayLiteralExpression) {
            if (this.isSparseArray(<ts.ArrayLiteralExpression>node)) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
        }
        super.visitNode(node);
    }

    private isSparseArray(node: ts.ArrayLiteralExpression): boolean {
        return Utils.exists(node.elements, (element: ts.Node): boolean => {
            return element.kind === SyntaxKind.current().OmittedExpression;
        });
    }
}
