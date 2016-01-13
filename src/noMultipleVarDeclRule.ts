import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-multiple-var-decl rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Do not use comma separated variable declarations: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoMultipleVarDeclRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoMultipleVarDeclRuleWalker extends ErrorTolerantWalker {

    protected visitVariableStatement(node: ts.VariableStatement): void {
        if (node.declarationList.declarations.length > 1) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(),
                Rule.FAILURE_STRING + node.declarationList.declarations[0].getText() + ','));
        }
        super.visitVariableStatement(node);
    }
}
