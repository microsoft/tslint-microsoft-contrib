import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');

/**
 * Implementation of the no-duplicate-parameter-names rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Duplicate parameter name: ';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDuplicateParameterNamesWalker(sourceFile, this.getOptions()));
    }
}

class NoDuplicateParameterNamesWalker extends ErrorTolerantWalker {

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.validateParameterNames(node);
        super.visitMethodDeclaration(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        this.validateParameterNames(node);
        super.visitConstructorDeclaration(node);
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        this.validateParameterNames(node);
        super.visitArrowFunction(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.validateParameterNames(node);
        super.visitFunctionDeclaration(node);
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        this.validateParameterNames(node);
        super.visitFunctionExpression(node);
    }

    private validateParameterNames(node : ts.SignatureDeclaration) {
        var seenNames : {[index: string]: boolean} = {};
        node.parameters.forEach((parameter : ts.ParameterDeclaration) : void => {
            var parameterName : string = (<any>parameter.name).text;  // how does one check if the union type is Identifier?
            if (parameterName != null) {
                if (seenNames[parameterName]) {
                    this.addFailure(this.createFailure(
                        parameter.name.getStart(), parameterName.length, Rule.FAILURE_STRING + '\'' + parameterName + '\''));
                } else {
                    seenNames[parameterName] = true;
                }
            }
        });
    }
}
