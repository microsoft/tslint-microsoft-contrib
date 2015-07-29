
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
            var typeInfo : ts.DefinitionInfo[] = languageServices.getTypeDefinitionAtPosition('file.ts', expression.getStart());
            if (typeInfo != null && typeInfo[0] != null && typeInfo[0].kind === 'function') {
                return true; // variables with type function are OK to pass
            }
        }

        var type : ts.Type = typeChecker.getTypeAtLocation(expression);
        var signatures : ts.Signature[] = typeChecker.getSignaturesOfType(type, ts.SignatureKind.Call);
        if (signatures != null && signatures.length > 0) {
            var signatureDeclaration : ts.SignatureDeclaration = signatures[0].declaration;
            if (signatureDeclaration.kind === ts.SyntaxKind.FunctionType) {
                return true; // variables of type function are allowed to be passed as parameters
            }
        }

        if (expression.getFullText() === 'functionArg') {
            //AstUtils.dumpTypeInfo(expression, this.languageServices, this.typeChecker);
        }

        return false; // by default the expression does not evaluate to a function
    }

    export function dumpTypeInfo(expression : ts.Expression, languageServices: ts.LanguageService, typeChecker : ts.TypeChecker) : void {
        console.log(expression.getFullText());
        console.log('\tkind: ' + expression.kind);

        if (expression.kind === ts.SyntaxKind.Identifier) {
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

            var quickInfo : ts.QuickInfo = languageServices.getQuickInfoAtPosition("file.ts", expression.getStart());
            console.log('\tquickInfo.kind         = ' + quickInfo.kind);
            console.log('\tquickInfo.kindModifiers= ' + quickInfo.kindModifiers);
            console.log('\tquickInfo.textSpan     = ' + quickInfo.textSpan.start);
            console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].text);
            console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].kind);

            var type : ts.Type = typeChecker.getTypeAtLocation(expression);
            console.log('\ttypeChecker.typeToString : ' + typeChecker.typeToString(type));
            console.log('\ttype.flags: ' + type.flags);
            console.log('\ttype.symbol: ' + type.symbol);

            var symbol : ts.Symbol = typeChecker.getSymbolAtLocation(expression);
            if (symbol == null) {
                console.log('\tsymbol: ' + symbol);
            } else {
                console.log('\tsymbol.flags: ' + symbol.flags);
                console.log('\tsymbol.name: ' + symbol.name);
                console.log('\tsymbol.declarations: ' + symbol.declarations);
            }

            var contextualType : ts.Type = typeChecker.getContextualType(expression);
            if (contextualType == null) {
                console.log('\tcontextualType: ' + contextualType);
            } else {
                console.log('\tcontextualType.flags: ' + contextualType.flags);
                console.log('\tcontextualType.symbol: ' + contextualType.symbol);
            }
        }
    }
}

export = AstUtils;