
/**
 * General utility class.
 */
module AstUtils {


    export function getFunctionName(node : ts.CallExpression) : string {
        var expression: ts.Expression = node.expression;
        var functionName : string = (<any>expression).text;
        if (functionName === undefined && (<any>expression).name) {
            functionName = (<any>expression).name.text;
        }
        return functionName;
    }

    export function isExpressionEvaluatingToFunction(expression : ts.Expression,
                                                     languageServices: ts.LanguageService,
                                                     typeChecker : ts.TypeChecker) : boolean {
        if (expression.kind === ts.SyntaxKind.ArrowFunction) {
            return true; // arrow function literals are acceptable to pass to setTimeout
        }
        if (expression.kind === ts.SyntaxKind.FunctionExpression) {
            return true; // function expressions are OK to pass
        }
        if (expression.kind === ts.SyntaxKind.Identifier) {
            let typeInfo : ts.DefinitionInfo[] = languageServices.getTypeDefinitionAtPosition('file.ts', expression.getStart());
            if (typeInfo != null && typeInfo[0] != null && typeInfo[0].kind === 'function') {
                return true; // variables with type function are OK to pass
            }
            return false;
        }

        if (expression.kind === ts.SyntaxKind.CallExpression) {

            // seems like another tslint error of some sort TODO: follow up with tslint about this
            // calling Function.bind is a special case that makes tslint throw an exception
            if ((<any>expression).expression.name && (<any>expression).expression.name.text === 'bind') {
                return true; // for now assume invoking a function named bind returns a function. Follow up with tslint.
            }

            try {
                // seems like another tslint error of some sort TODO: follow up with tslint about this
                let signature : ts.Signature = typeChecker.getResolvedSignature(<ts.CallExpression>expression);
                let expressionType : ts.Type = typeChecker.getReturnTypeOfSignature(signature);
                return isTypeFunction(expressionType, typeChecker);
            } catch (e) {
                // this exception is only thrown in unit tests, not the node debugger :(
                return false;
            }
        }

        if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            // seems like another tslint error of some sort TODO: follow up with tslint about this
            let definitionInfo : ts.DefinitionInfo[] = languageServices.getDefinitionAtPosition('file.ts', expression.getStart());
            if (definitionInfo != null && definitionInfo.length === 1) {
                if (definitionInfo[0].kind === 'class') {
                    // looks like we have a class member, just suppress the warning
                    return true;
                }
            }
        }

        if (isTypeFunction(typeChecker.getTypeAtLocation(expression), typeChecker)) {
            return true;
        }

        if (expression.getFullText() === 'functionArg') {
            //AstUtils.dumpTypeInfo(expression, this.languageServices, this.typeChecker);
        }

        return false; // by default the expression does not evaluate to a function
    }

    function isTypeFunction(expressionType : ts.Type, typeChecker : ts.TypeChecker) : boolean {
        let signatures : ts.Signature[] = typeChecker.getSignaturesOfType(expressionType, ts.SignatureKind.Call);
        if (signatures != null && signatures.length > 0) {
            let signatureDeclaration : ts.SignatureDeclaration = signatures[0].declaration;
            if (signatureDeclaration.kind === ts.SyntaxKind.FunctionType) {
                return true; // variables of type function are allowed to be passed as parameters
            }
        }
        return false;
    }

    export function dumpTypeInfo(expression : ts.Expression, languageServices: ts.LanguageService, typeChecker : ts.TypeChecker) : void {
        /* tslint:disable:no-console */
        console.log(expression.getFullText());
        console.log('\tkind: ' + expression.kind);

        if (expression.kind === ts.SyntaxKind.Identifier
            || expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            var definitionInfo : ts.DefinitionInfo[] = languageServices.getDefinitionAtPosition('file.ts', expression.getStart());
            if (definitionInfo) {
                definitionInfo.forEach((definitionInfo : ts.DefinitionInfo, index : number) : void => {
                    console.log('\tdefinitionInfo-' + index);
                    console.log('\t\tkind: ' + definitionInfo.kind);
                    console.log('\t\tname: ' + definitionInfo.name);
                });
            }

            var typeInfo : ts.DefinitionInfo[] = languageServices.getTypeDefinitionAtPosition('file.ts', expression.getStart());
            if (typeInfo) {
                typeInfo.forEach((definitionInfo : ts.DefinitionInfo, index : number) : void => {
                    console.log('\ttypeDefinitionInfo-' + index);
                    console.log('\t\tkind: ' + definitionInfo.kind);
                    console.log('\t\tname: ' + definitionInfo.name);
                });
            }

            var quickInfo : ts.QuickInfo = languageServices.getQuickInfoAtPosition('file.ts', expression.getStart());
            console.log('\tquickInfo.kind         = ' + quickInfo.kind);
            console.log('\tquickInfo.kindModifiers= ' + quickInfo.kindModifiers);
            console.log('\tquickInfo.textSpan     = ' + quickInfo.textSpan.start);
            console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].text);
            console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].kind);

            var expressionType : ts.Type = typeChecker.getTypeAtLocation(expression);
            console.log('\ttypeChecker.typeToString : ' + typeChecker.typeToString(expressionType));
            console.log('\ttype.flags: ' + expressionType.flags);
            console.log('\ttype.symbol: ' + expressionType.symbol);

            var expressionSymbol : ts.Symbol = typeChecker.getSymbolAtLocation(expression);
            if (expressionSymbol == null) {
                console.log('\tsymbol: ' + expressionSymbol);
            } else {
                console.log('\tsymbol.flags: ' + expressionSymbol.flags);
                console.log('\tsymbol.name: ' + expressionSymbol.name);
                console.log('\tsymbol.declarations: ' + expressionSymbol.declarations);
            }

            var contextualType : ts.Type = typeChecker.getContextualType(expression);
            if (contextualType == null) {
                console.log('\tcontextualType: ' + contextualType);
            } else {
                console.log('\tcontextualType.flags: ' + contextualType.flags);
                console.log('\tcontextualType.symbol: ' + contextualType.symbol);
            }
        }
        /* tslint:enable:no-console */
    }

    export function isPrivate(node: ts.Node) : boolean {
        /* tslint:disable:no-bitwise */
        return !!(node.flags & ts.NodeFlags.Private);
        /* tslint:enable:no-bitwise */
    }

    export function isProtected(node: ts.Node) : boolean {
        /* tslint:disable:no-bitwise */
        return !!(node.flags & ts.NodeFlags.Protected);
        /* tslint:enable:no-bitwise */
    }

    export function isPublic(node: ts.Node) : boolean {
        /* tslint:disable:no-bitwise */
        return !!(node.flags & ts.NodeFlags.Public);
        /* tslint:enable:no-bitwise */
    }
}

export = AstUtils;