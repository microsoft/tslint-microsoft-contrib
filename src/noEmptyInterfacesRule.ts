import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-empty-interfaces rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Do not declare empty interfaces: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoEmptyInterfacesRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoEmptyInterfacesRuleWalker extends ErrorTolerantWalker {

    protected visitInterfaceDeclaration(node: ts.InterfaceDeclaration): void {

        // do we have an empty interface?
        if (this.isInterfaceEmpty(node) && !this.hasMultipleParents(node)) {
            this.addFailure(
                this.createFailure(
                    node.getStart(), node.getWidth(), Rule.FAILURE_STRING + '\'' + node.name.getText() + '\''
                    )
            );
        }
        super.visitInterfaceDeclaration(node);
    }

    private isInterfaceEmpty(node: ts.InterfaceDeclaration): boolean {
        return node.members == null || node.members.length === 0;
    }

    private hasMultipleParents(node: ts.InterfaceDeclaration): boolean {
        if (node.heritageClauses == null || node.heritageClauses.length === 0) {
            return false;
        }
        return node.heritageClauses[0].types.length >= 2;
    }
}
