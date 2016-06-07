import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';

const FAILURE_STRING: string = 'Found as-cast instead of a traditional type-cast. Please convert to a type-cast: ';

/**
 * Implementation of the prefer-type-cast rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new PreferTypeCastRuleWalker(sourceFile, this.getOptions()));
    }
}

class PreferTypeCastRuleWalker extends ErrorTolerantWalker {
    protected visitSourceFile(node: ts.SourceFile): void {
        if (/.*\.tsx/.test(node.fileName) === false) {
            super.visitSourceFile(node);
        }
    }

    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().AsExpression) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText()));
        }
        super.visitNode(node);
    }
}
