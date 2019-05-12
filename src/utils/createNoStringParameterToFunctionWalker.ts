import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';
import { Scope } from './Scope';
import { isNamed } from './TypeGuard';
import { AstUtils } from './AstUtils';

export function createNoStringParameterToFunctionWalker(
    targetFunctionName: string,
    options: Lint.IOptions,
    program?: ts.Program
): (ctx: Lint.WalkContext<void>) => void {
    const failureString = 'Forbidden ' + targetFunctionName + ' string parameter: ';
    const typeChecker = program ? program.getTypeChecker() : undefined;
    let scope: Scope | undefined;

    return (ctx: Lint.WalkContext<void>) => {
        function cb(node: ts.Node): void {
            if (tsutils.isModuleDeclaration(node)) {
                scope = new Scope(scope);

                if (node.body !== undefined) {
                    scope.addGlobalScope(node.body, node.getSourceFile(), options);
                }

                ts.forEachChild(node, cb);
                scope = scope.parent;
            } else if (tsutils.isClassDeclaration(node)) {
                const classScope = (scope = new Scope(scope));
                node.members.forEach(
                    (element: ts.ClassElement): void => {
                        const prefix: string = AstUtils.isStatic(element) && node.name !== undefined ? node.name.getText() + '.' : 'this.';

                        if (element.kind === ts.SyntaxKind.MethodDeclaration) {
                            // add all declared methods as valid functions
                            classScope.addFunctionSymbol(prefix + (<ts.MethodDeclaration>element).name.getText());
                        } else if (element.kind === ts.SyntaxKind.PropertyDeclaration) {
                            const prop: ts.PropertyDeclaration = <ts.PropertyDeclaration>element;
                            // add all declared function properties as valid functions
                            if (AstUtils.isDeclarationFunctionType(prop)) {
                                classScope.addFunctionSymbol(prefix + (<ts.MethodDeclaration>element).name.getText());
                            } else {
                                classScope.addNonFunctionSymbol(prefix + (<ts.MethodDeclaration>element).name.getText());
                            }
                        }
                    }
                );
                ts.forEachChild(node, cb);
                scope = scope.parent;
            } else if (
                tsutils.isFunctionDeclaration(node) ||
                tsutils.isConstructorDeclaration(node) ||
                tsutils.isMethodDeclaration(node) ||
                tsutils.isArrowFunction(node) ||
                tsutils.isFunctionExpression(node) ||
                tsutils.isSetAccessorDeclaration(node)
            ) {
                scope = new Scope(scope);
                scope.addParameters(node.parameters);
                ts.forEachChild(node, cb);
                scope = scope.parent;
            } else {
                if (tsutils.isVariableDeclaration(node)) {
                    // scope is always set upon entering a source file, so we know it exists here
                    // tslint:disable:no-non-null-assertion
                    if (AstUtils.isDeclarationFunctionType(node)) {
                        scope!.addFunctionSymbol(node.name.getText());
                    } else {
                        scope!.addNonFunctionSymbol(node.name.getText());
                    }
                    // tslint:enable:no-non-null-assertion
                } else if (tsutils.isCallExpression(node)) {
                    validateExpression(node, ctx);
                }

                ts.forEachChild(node, cb);
            }
        }

        scope = new Scope(undefined);
        scope.addGlobalScope(ctx.sourceFile, ctx.sourceFile, options);
        ts.forEachChild(ctx.sourceFile, cb);
    };

    function validateExpression(node: ts.CallExpression, ctx: Lint.WalkContext<void>): void {
        const functionName = AstUtils.getFunctionName(node);
        const functionTarget = AstUtils.getFunctionTarget(node);
        const firstArg: ts.Expression = node.arguments[0];
        if (functionName === targetFunctionName && firstArg !== undefined) {
            if (functionTarget) {
                const functionTargetType = getFunctionTargetType(node);
                if (functionTargetType) {
                    if (!functionTargetType.match(/^(any|Window|Worker)$/)) {
                        return;
                    }
                } else {
                    if (!functionTarget.match(/^(this|window)$/)) {
                        return;
                    }
                }
            }
            if (!isExpressionEvaluatingToFunction(firstArg)) {
                const msg: string =
                    failureString +
                    firstArg
                        .getFullText()
                        .trim()
                        .substring(0, 40);
                ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
            }
        }
    }

    function getFunctionTargetType(expression: ts.CallExpression): string | undefined {
        if (expression.expression.kind === ts.SyntaxKind.PropertyAccessExpression && typeChecker) {
            const propExp: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>expression.expression;
            const targetType: ts.Type = typeChecker.getTypeAtLocation(propExp.expression);
            return typeChecker.typeToString(targetType);
        }
        return undefined;
    }

    function isExpressionEvaluatingToFunction(expression: ts.Expression): boolean {
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
        if (scope !== undefined && scope.isFunctionSymbol(expression.getText())) {
            return true;
        }

        if (expression.kind === ts.SyntaxKind.Identifier && typeChecker) {
            const tsSymbol = typeChecker.getSymbolAtLocation(expression);
            if (tsSymbol && tsSymbol.flags === ts.SymbolFlags.Function) {
                return true; // variables with type function are OK to pass
            }
            return false;
        }

        if (ts.isCallExpression(expression)) {
            // calling Function.bind is a special case that makes tslint throw an exception
            if (isNamed(expression.expression) && expression.expression.name.getText() === 'bind') {
                return true; // for now assume invoking a function named bind returns a function. Follow up with tslint.
            }

            try {
                // seems like another tslint error of some sort
                if (!typeChecker) {
                    return true;
                }

                const signature = typeChecker.getResolvedSignature(<ts.CallExpression>expression);

                if (signature !== undefined) {
                    const expressionType = typeChecker.getReturnTypeOfSignature(signature);
                    return isFunctionType(expressionType, typeChecker);
                }
            } catch (e) {
                // this exception is only thrown in unit tests, not the node debugger :(
                return false;
            }
        }

        if (!typeChecker) {
            return true;
        }

        return isFunctionType(typeChecker.getTypeAtLocation(expression), typeChecker);
    }
}

function isFunctionType(expressionType: ts.Type, typeChecker: ts.TypeChecker): boolean {
    const signatures = typeChecker.getSignaturesOfType(expressionType, ts.SignatureKind.Call);
    if (signatures !== undefined && signatures.length > 0) {
        const signatureDeclaration = signatures[0].declaration;
        if (signatureDeclaration !== undefined && signatureDeclaration.kind === ts.SyntaxKind.FunctionType) {
            return true; // variables of type function are allowed to be passed as parameters
        }
    }
    return false;
}
