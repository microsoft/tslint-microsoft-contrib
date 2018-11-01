import * as ts from "typescript";
import * as Lint from "tslint";
import { AstUtils } from "./AstUtils";
import { Scope } from "./Scope";
import { isNamed } from "./TypeGuard";

/**
 * This exists so that you can try to tell the types of variables
 * and identifiers in the current scope. It builds the current scope
 * from the SourceFile then -> Module -> Class -> Function
 */
export class ScopedSymbolTrackingWalker extends Lint.RuleWalker {
    private readonly typeChecker?: ts.TypeChecker;
    private scope: Scope | undefined;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, program?: ts.Program) {
        super(sourceFile, options);

        if (program) {
            this.typeChecker = program.getTypeChecker();
        }
    }

    protected getFunctionTargetType(expression: ts.CallExpression): string | undefined {
        if (expression.expression.kind === ts.SyntaxKind.PropertyAccessExpression && this.typeChecker) {
            const propExp: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>expression.expression;
            const targetType: ts.Type = this.typeChecker.getTypeAtLocation(propExp.expression);
            return this.typeChecker.typeToString(targetType);
        }
        return undefined;
    }

    protected isExpressionEvaluatingToFunction(expression: ts.Expression): boolean {
        if (expression.kind === ts.SyntaxKind.ArrowFunction || expression.kind === ts.SyntaxKind.FunctionExpression) {
            return true; // arrow function literals and arrow functions are definitely functions
        }

        if (
            expression.kind === ts.SyntaxKind.StringLiteral ||
            expression.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
            expression.kind === ts.SyntaxKind.TemplateExpression ||
            expression.kind === ts.SyntaxKind.TaggedTemplateExpression ||
            expression.kind === ts.SyntaxKind.BinaryExpression
        ) {
            return false; // strings and binary expressions are definitely not functions
        }

        // is the symbol something we are tracking in scope ourselves?
        if (this.scope !== undefined && this.scope.isFunctionSymbol(expression.getText())) {
            return true;
        }

        if (expression.kind === ts.SyntaxKind.Identifier && this.typeChecker) {
            const tsSymbol = this.typeChecker.getSymbolAtLocation(expression);
            if (tsSymbol && tsSymbol.flags === ts.SymbolFlags.Function) {
                return true; // variables with type function are OK to pass
            }
            return false;
        }

        if (ts.isCallExpression(expression)) {
            // calling Function.bind is a special case that makes tslint throw an exception
            if (isNamed(expression.expression) && expression.expression.name.getText() === "bind") {
                return true; // for now assume invoking a function named bind returns a function. Follow up with tslint.
            }

            try {
                // seems like another tslint error of some sort
                if (!this.typeChecker) {
                    return true;
                }

                const signature = this.typeChecker.getResolvedSignature(<ts.CallExpression>expression);

                if (signature !== undefined) {
                    const expressionType = this.typeChecker.getReturnTypeOfSignature(signature);
                    return this.isFunctionType(expressionType, this.typeChecker);
                }
            } catch (e) {
                // this exception is only thrown in unit tests, not the node debugger :(
                return false;
            }
        }

        if (!this.typeChecker) {
            return true;
        }

        return this.isFunctionType(this.typeChecker.getTypeAtLocation(expression), this.typeChecker);
    }

    private isFunctionType(expressionType: ts.Type, typeChecker: ts.TypeChecker): boolean {
        const signatures = typeChecker.getSignaturesOfType(expressionType, ts.SignatureKind.Call);
        if (signatures !== undefined && signatures.length > 0) {
            const signatureDeclaration = signatures[0].declaration;
            if (signatureDeclaration !== undefined && signatureDeclaration.kind === ts.SyntaxKind.FunctionType) {
                return true; // variables of type function are allowed to be passed as parameters
            }
        }
        return false;
    }

    protected visitSourceFile(node: ts.SourceFile): void {
        this.scope = new Scope(undefined);
        this.scope.addGlobalScope(node, node, this.getOptions());
        super.visitSourceFile(node);
        this.scope = undefined;
    }

    protected visitModuleDeclaration(node: ts.ModuleDeclaration): void {
        this.scope = new Scope(this.scope);
        this.scope.addGlobalScope(node.body!, this.getSourceFile(), this.getOptions());
        super.visitModuleDeclaration(node);
        this.scope = this.scope.parent;
    }

    protected visitClassDeclaration(node: ts.ClassDeclaration): void {
        const scope = (this.scope = new Scope(this.scope));
        node.members.forEach(
            (element: ts.ClassElement): void => {
                const prefix: string = AstUtils.isStatic(element) && node.name !== undefined ? node.name.getText() + "." : "this.";

                if (element.kind === ts.SyntaxKind.MethodDeclaration) {
                    // add all declared methods as valid functions
                    scope.addFunctionSymbol(prefix + (<ts.MethodDeclaration>element).name.getText());
                } else if (element.kind === ts.SyntaxKind.PropertyDeclaration) {
                    const prop: ts.PropertyDeclaration = <ts.PropertyDeclaration>element;
                    // add all declared function properties as valid functions
                    if (AstUtils.isDeclarationFunctionType(prop)) {
                        scope.addFunctionSymbol(prefix + (<ts.MethodDeclaration>element).name.getText());
                    } else {
                        scope.addNonFunctionSymbol(prefix + (<ts.MethodDeclaration>element).name.getText());
                    }
                }
            }
        );
        super.visitClassDeclaration(node);
        this.scope = this.scope.parent;
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        super.visitFunctionDeclaration(node);
        this.scope = this.scope.parent;
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        super.visitConstructorDeclaration(node);
        this.scope = this.scope.parent;
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        super.visitMethodDeclaration(node);
        this.scope = this.scope.parent;
    }

    protected visitArrowFunction(node: ts.ArrowFunction): void {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        super.visitArrowFunction(node);
        this.scope = this.scope.parent;
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        super.visitFunctionExpression(node);
        this.scope = this.scope.parent;
    }

    protected visitSetAccessor(node: ts.AccessorDeclaration): void {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        super.visitSetAccessor(node);
        this.scope = this.scope.parent;
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (AstUtils.isDeclarationFunctionType(node)) {
            this.scope!.addFunctionSymbol(node.name.getText());
        } else {
            this.scope!.addNonFunctionSymbol(node.name.getText());
        }
        super.visitVariableDeclaration(node);
    }
}
