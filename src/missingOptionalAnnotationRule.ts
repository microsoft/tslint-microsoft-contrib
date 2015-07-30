
import ErrorTolerantWalker = require('./ErrorTolerantWalker');

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "Argument following optional argument missing optional annotation: ";

    public apply(sourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MissingOptionalAnnotationWalker(sourceFile, this.getOptions()));
    }
}

class MissingOptionalAnnotationWalker extends ErrorTolerantWalker {


    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.validateParameters(node);
        super.visitMethodDeclaration(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        this.validateParameters(node);
        super.visitConstructorDeclaration(node);
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        this.validateParameters(node);
        super.visitArrowFunction(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.validateParameters(node);
        super.visitFunctionDeclaration(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        this.validateParameters(node);
        super.visitFunctionExpression(node);
    }

    private validateParameters(node : ts.SignatureDeclaration) {
        var optionalParameterFound = false;
        if (node.parameters == null) {
            return;
        }
        node.parameters.forEach((parameter : ts.ParameterDeclaration) : void => {
            if (parameter.questionToken != null) {
                optionalParameterFound = true;
            } else if (optionalParameterFound) {
                // we found a non-optional parameter that comes *after* an optional parameter
                this.addFailure(this.createFailure(parameter.name.getStart(), parameter.name.getWidth(), Rule.FAILURE_STRING + parameter.getFullText()));
            }
        });
    }
}
