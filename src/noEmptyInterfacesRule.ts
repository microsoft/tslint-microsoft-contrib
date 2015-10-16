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

        if (node.members == null || node.members.length === 0) {
            this.addFailure(
                this.createFailure(
                    node.getStart(), node.getWidth(), Rule.FAILURE_STRING + '\'' + node.name.getText() + '\''
                    )
            );
        }
        super.visitInterfaceDeclaration(node);
    }

}
