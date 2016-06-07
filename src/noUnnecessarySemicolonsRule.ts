import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {SyntaxKind} from './utils/SyntaxKind';
import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';

/**
 * Implementation of the no-unnecessary-semicolons rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'unnecessary semi-colon';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnnecessarySemicolonsWalker(sourceFile, this.getOptions()));
    }
}

class NoUnnecessarySemicolonsWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().EmptyStatement) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
        super.visitNode(node);
    }
}
