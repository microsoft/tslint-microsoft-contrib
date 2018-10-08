import * as ts from 'typescript';

/**
 * General utility class.
 */
export module AstUtils {

    export function getLanguageVariant(node: ts.SourceFile): ts.LanguageVariant {
        if (node.fileName.endsWith('.tsx')) {
            return ts.LanguageVariant.JSX;
        } else {
            return ts.LanguageVariant.Standard;
        }
    }

    export function getFunctionName(node: ts.CallExpression | ts.NewExpression): string {
        const expression: ts.Expression = node.expression;
        let functionName: string = (<any>expression).text;
        if (functionName === undefined && (<any>expression).name) {
            functionName = (<any>expression).name.text;
        }
        return functionName;
    }

    export function getFunctionTarget(expression: ts.CallExpression): string | null {
        if (expression.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const propExp: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>expression.expression;
            return propExp.expression.getText();
        }
        return null;
    }

    export function isJQuery(functionTarget: string): boolean {
        return functionTarget === '$' || /^(jquery)$/i.test(functionTarget);
    }

    export function hasModifier(modifiers: ts.ModifiersArray, modifierKind: number): boolean {
        if (modifiers == null) {
            return false;
        }
        let result: boolean = false;
        modifiers.forEach((modifier: ts.Node): void => {
            if (modifier.kind === modifierKind) {
                result = true;
            }
        });
        return result;
    }

    export function dumpTypeInfo(expression: ts.Expression, languageServices: ts.LanguageService, typeChecker: ts.TypeChecker): void {
        /* tslint:disable:no-console */
        console.log(expression.getFullText());
        console.log('\tkind: ' + expression.kind);

        if (expression.kind === ts.SyntaxKind.Identifier
            || expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const definitionInfo = languageServices.getDefinitionAtPosition('file.ts', expression.getStart());
            if (definitionInfo !== undefined) {
                definitionInfo.forEach((info: ts.DefinitionInfo, index: number): void => {
                    console.log('\tdefinitionInfo-' + index);
                    console.log('\t\tkind: ' + info.kind);
                    console.log('\t\tname: ' + info.name);
                });
            }

            const typeInfo = languageServices.getTypeDefinitionAtPosition('file.ts', expression.getStart());
            if (typeInfo !== undefined) {
                typeInfo.forEach((info: ts.DefinitionInfo, index: number): void => {
                    console.log('\ttypeDefinitionInfo-' + index);
                    console.log('\t\tkind: ' + info.kind);
                    console.log('\t\tname: ' + info.name);
                });
            }

            const quickInfo = languageServices.getQuickInfoAtPosition('file.ts', expression.getStart());
            if (quickInfo !== undefined) {
                console.log('\tquickInfo.kind         = ' + quickInfo.kind);
                console.log('\tquickInfo.kindModifiers= ' + quickInfo.kindModifiers);
                console.log('\tquickInfo.textSpan     = ' + quickInfo.textSpan.start);

                if (quickInfo.displayParts !== undefined) {
                    console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].text);
                    console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].kind);
                }
            }

            const expressionType: ts.Type = typeChecker.getTypeAtLocation(expression);
            console.log('\ttypeChecker.typeToString: ' + typeChecker.typeToString(expressionType));
            console.log('\ttype.flags: ' + expressionType.flags);
            console.log('\ttype.symbol: ' + expressionType.symbol);

            const expressionSymbol = typeChecker.getSymbolAtLocation(expression);
            if (expressionSymbol == null) {
                console.log('\tsymbol: ' + expressionSymbol);
            } else {
                console.log('\tsymbol.flags: ' + expressionSymbol.flags);
                console.log('\tsymbol.name: ' + expressionSymbol.name);
                console.log('\tsymbol.declarations: ' + expressionSymbol.declarations);
            }

            const contextualType = typeChecker.getContextualType(expression);
            if (contextualType == null) {
                console.log('\tcontextualType: ' + contextualType);
            } else {
                console.log('\tcontextualType.flags: ' + contextualType.flags);
                console.log('\tcontextualType.symbol: ' + contextualType.symbol);
            }
        }
        /* tslint:enable:no-console */
    }

    export function isPrivate(node: ts.Node): boolean {
        /* tslint:disable:no-bitwise */
        if ((<any>ts).NodeFlags.Private != null) {
            return !!(node.flags & (<any>ts).NodeFlags.Private);
        } else {
            return !!((<any>ts).getCombinedModifierFlags(node) & (<any>ts).ModifierFlags.Private);
        }
        /* tslint:enable:no-bitwise */
    }

    export function isProtected(node: ts.Node): boolean {
        /* tslint:disable:no-bitwise */
        if ((<any>ts).NodeFlags.Protected != null) {
            return !!(node.flags & (<any>ts).NodeFlags.Protected);
        } else {
            return !!((<any>ts).getCombinedModifierFlags(node) & (<any>ts).ModifierFlags.Protected);
        }
        /* tslint:enable:no-bitwise */
    }

    export function isPublic(node: ts.Node): boolean {
        /* tslint:disable:no-bitwise */
        if ((<any>ts).NodeFlags.Public != null) {
            return !!(node.flags & (<any>ts).NodeFlags.Public);
        } else {
            return !!((<any>ts).getCombinedModifierFlags(node) & (<any>ts).ModifierFlags.Public);
        }
        /* tslint:enable:no-bitwise */
    }

    export function isStatic(node: ts.Node): boolean {
        /* tslint:disable:no-bitwise */
        if ((<any>ts).NodeFlags.Static != null) {
            return !!(node.flags & (<any>ts).NodeFlags.Static);
        } else {
            return !!((<any>ts).getCombinedModifierFlags(node) & (<any>ts).ModifierFlags.Static);
        }
        /* tslint:enable:no-bitwise */
    }

    export function hasComputedName(node: ts.Node & { name?: ts.PropertyName }): boolean {
        if (!node.name) {
            return false;
        }

        return ts.isComputedPropertyName(node.name);
    }

    function isBindingPattern(node: ts.Node): node is ts.BindingPattern {
        return node != null && (node.kind === ts.SyntaxKind.ArrayBindingPattern ||
            node.kind === ts.SyntaxKind.ObjectBindingPattern);
    }

    function walkUpBindingElementsAndPatterns(node: ts.Node): ts.Node {
        while (node && (node.kind === ts.SyntaxKind.BindingElement || isBindingPattern(node))) {
            node = node.parent;
        }

        return node;
    }

    function getCombinedNodeFlags(node: ts.Node): ts.NodeFlags {
        node = walkUpBindingElementsAndPatterns(node);

        let flags = node.flags;
        if (node.kind === ts.SyntaxKind.VariableDeclaration) {
            node = node.parent;
        }

        if (node && node.kind === ts.SyntaxKind.VariableDeclarationList) {
            /* tslint:disable:no-bitwise */
            flags |= node.flags;
            /* tslint:enable:no-bitwise */
            node = node.parent;
        }

        if (node && node.kind === ts.SyntaxKind.VariableStatement) {
            /* tslint:disable:no-bitwise */
            flags |= node.flags;
            /* tslint:enable:no-bitwise */
        }

        return flags;
    }

    export function isLet(node: ts.Node): boolean {
        /* tslint:disable:no-bitwise */
        return !!(getCombinedNodeFlags(node) & ts.NodeFlags.Let);
        /* tslint:enable:no-bitwise */
    }

    export function isExported(node: ts.Node): boolean {
        /* tslint:disable:no-bitwise */
        if ((<any>ts).NodeFlags.Export != null) {
            return !!(getCombinedNodeFlags(node) & (<any>ts).NodeFlags.Export);
        } else {
            // typescript 2.1.4 introduces a new edge case for when
            // top level variables are exported from a source file
            if (node.kind === ts.SyntaxKind.VariableDeclaration
                && node.parent.kind === ts.SyntaxKind.VariableDeclarationList
                && node.parent.parent.kind === ts.SyntaxKind.VariableStatement) {
                if (node.parent.parent.modifiers !== undefined
                    && AstUtils.hasModifier(node.parent.parent.modifiers, ts.SyntaxKind.ExportKeyword)) {
                    return true;
                }
            }
            return !!(getCombinedNodeFlags(node) & ts.NodeFlags.ExportContext);
        }
        /* tslint:enable:no-bitwise */
    }

    export function isAssignmentOperator(token: ts.SyntaxKind): boolean {
        return token >= ts.SyntaxKind.FirstAssignment && token <= ts.SyntaxKind.LastAssignment;
    }

    export function isBindingLiteralExpression(node: ts.Node): node is (ts.ArrayLiteralExpression | ts.ObjectLiteralExpression) {
        return (!!node) &&
            (node.kind === ts.SyntaxKind.ObjectLiteralExpression || node.kind === ts.SyntaxKind.ArrayLiteralExpression);
    }

    export function findParentBlock(child: ts.Node): ts.Node {
        let parent: ts.Node = child.parent;
        while (parent != null) {
            if (parent.kind === ts.SyntaxKind.Block) {
                return parent;
            }
            parent = parent.parent;
        }
        throw new Error('Could not determine parent block of node: ' + child);
    }

    export function isSameIdentifer(source: ts.Node, target: ts.Node): boolean {
        if (source == null || target == null) {
            return false;
        }
        if (source.kind === ts.SyntaxKind.Identifier && target.kind === ts.SyntaxKind.Identifier) {
            return source.getText() === target.getText();
        }
        return false;
    }

    export function getDeclaredMethodNames(node: ts.ClassDeclaration): string[] {
        const result: string[] = [];
        node.members.forEach((classElement: ts.ClassElement): void => {
            if (classElement.kind === ts.SyntaxKind.MethodDeclaration) {
                const methodDeclaration: ts.MethodDeclaration = <ts.MethodDeclaration>classElement;
                if (methodDeclaration.name.kind === ts.SyntaxKind.Identifier) {
                    result.push((<ts.Identifier>methodDeclaration.name).text);
                }
            }
        });
        return result;
    }

    export function isDeclarationFunctionType(node: ts.PropertyDeclaration | ts.VariableDeclaration | ts.ParameterDeclaration): boolean {
        if (node.type != null) {
            if (node.type.getText() === 'Function') {
                return true;
            }
            return node.type.kind === ts.SyntaxKind.FunctionType;
        } else if (node.initializer != null) {
            return (node.initializer.kind === ts.SyntaxKind.ArrowFunction
            || node.initializer.kind === ts.SyntaxKind.FunctionExpression);
        }
        return false;
    }

    export function isUndefined(node: ts.Expression | null | undefined): boolean {
        if (node != null) {
            if (node.kind === ts.SyntaxKind.Identifier) {
                return node.getText() === 'undefined';
            }
        }
        return false;
    }

    export function isConstant(node: ts.Expression | null | undefined): boolean {
        if (node == null) {
            return false;
        }
        return node.kind === ts.SyntaxKind.NullKeyword
            || node.kind === ts.SyntaxKind.StringLiteral
            || node.kind === ts.SyntaxKind.FalseKeyword
            || node.kind === ts.SyntaxKind.TrueKeyword
            || node.kind === ts.SyntaxKind.NumericLiteral;
    }

    export function isConstantExpression(node: ts.Expression): boolean {

        if (node.kind === ts.SyntaxKind.BinaryExpression) {
            const expression: ts.BinaryExpression = <ts.BinaryExpression>node;
            const kind: ts.SyntaxKind = expression.operatorToken.kind;
            if (kind >= ts.SyntaxKind.FirstBinaryOperator && kind <= ts.SyntaxKind.LastBinaryOperator) {
                return isConstantExpression(expression.left) && isConstantExpression(expression.right);
            }
        }
        if (node.kind === ts.SyntaxKind.PrefixUnaryExpression || node.kind === ts.SyntaxKind.PostfixUnaryExpression) {
            const expression: ts.PostfixUnaryExpression | ts.PrefixUnaryExpression =
                <ts.PostfixUnaryExpression | ts.PrefixUnaryExpression>node;
            return isConstantExpression(expression.operand);
        }
        return isConstant(node);
    }
}
