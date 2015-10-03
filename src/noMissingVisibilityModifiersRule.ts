import ErrorTolerantWalker = require('./ErrorTolerantWalker');
import AstUtils = require('./AstUtils');

/**
 * Implementation of the mo-missing-visibility-modifiers rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MissingVisibilityModifierWalker(sourceFile, this.getOptions()));
    }
}

class MissingVisibilityModifierWalker extends ErrorTolerantWalker {


    protected visitPropertyDeclaration(node: ts.PropertyDeclaration): void {
        if (this.isMissingVisibilityModifier(node)) {
            var failureString = 'Field missing visibility modifier: ' + node.getText();
            var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
            this.addFailure(failure);
        }
        super.visitPropertyDeclaration(node);
    }


    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        if (this.isMissingVisibilityModifier(node)) {
            var failureString = 'Method missing visibility modifier: ' + node.getText();
            var failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
            this.addFailure(failure);
        }
        super.visitMethodDeclaration(node);
    }

    private isMissingVisibilityModifier(node: ts.Node) : boolean {
        return !(AstUtils.isPrivate(node) || AstUtils.isProtected(node) || AstUtils.isPublic(node));
    }
}
