var AstUtils;
(function (AstUtils) {
    function getFunctionName(node) {
        var expression = node.expression;
        var functionName = expression.text;
        if (functionName === undefined && expression.name) {
            functionName = expression.name.text;
        }
        return functionName;
    }
    AstUtils.getFunctionName = getFunctionName;
    function isExpressionEvaluatingToFunction(expression, languageServices, typeChecker) {
        if (expression.kind === 164) {
            return true;
        }
        if (expression.kind === 163) {
            return true;
        }
        if (expression.kind === 65) {
            var typeInfo = languageServices.getTypeDefinitionAtPosition('file.ts', expression.getStart());
            if (typeInfo != null && typeInfo[0] != null && typeInfo[0].kind === 'function') {
                return true;
            }
            return false;
        }
        if (expression.kind === 158) {
            if (expression.expression.name && expression.expression.name.text === 'bind') {
                return true;
            }
            try {
                var signature = typeChecker.getResolvedSignature(expression);
                var expressionType = typeChecker.getReturnTypeOfSignature(signature);
                return isTypeFunction(expressionType, typeChecker);
            }
            catch (e) {
                return false;
            }
        }
        if (expression.kind === 156) {
            var definitionInfo = languageServices.getDefinitionAtPosition('file.ts', expression.getStart());
            if (definitionInfo != null && definitionInfo.length === 1) {
                if (definitionInfo[0].kind === 'class') {
                    return true;
                }
            }
        }
        if (isTypeFunction(typeChecker.getTypeAtLocation(expression), typeChecker)) {
            return true;
        }
        if (expression.getFullText() === 'functionArg') {
        }
        return false;
    }
    AstUtils.isExpressionEvaluatingToFunction = isExpressionEvaluatingToFunction;
    function isTypeFunction(expressionType, typeChecker) {
        var signatures = typeChecker.getSignaturesOfType(expressionType, 0);
        if (signatures != null && signatures.length > 0) {
            var signatureDeclaration = signatures[0].declaration;
            if (signatureDeclaration.kind === 143) {
                return true;
            }
        }
        return false;
    }
    function dumpTypeInfo(expression, languageServices, typeChecker) {
        console.log(expression.getFullText());
        console.log('\tkind: ' + expression.kind);
        if (expression.kind === 65
            || expression.kind === 156) {
            var definitionInfo = languageServices.getDefinitionAtPosition('file.ts', expression.getStart());
            if (definitionInfo) {
                definitionInfo.forEach(function (definitionInfo, index) {
                    console.log('\tdefinitionInfo-' + index);
                    console.log('\t\tkind: ' + definitionInfo.kind);
                    console.log('\t\tname: ' + definitionInfo.name);
                });
            }
            var typeInfo = languageServices.getTypeDefinitionAtPosition('file.ts', expression.getStart());
            if (typeInfo) {
                typeInfo.forEach(function (definitionInfo, index) {
                    console.log('\ttypeDefinitionInfo-' + index);
                    console.log('\t\tkind: ' + definitionInfo.kind);
                    console.log('\t\tname: ' + definitionInfo.name);
                });
            }
            var quickInfo = languageServices.getQuickInfoAtPosition('file.ts', expression.getStart());
            console.log('\tquickInfo.kind         = ' + quickInfo.kind);
            console.log('\tquickInfo.kindModifiers= ' + quickInfo.kindModifiers);
            console.log('\tquickInfo.textSpan     = ' + quickInfo.textSpan.start);
            console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].text);
            console.log('\tquickInfo.displayParts = ' + quickInfo.displayParts[0].kind);
            var expressionType = typeChecker.getTypeAtLocation(expression);
            console.log('\ttypeChecker.typeToString : ' + typeChecker.typeToString(expressionType));
            console.log('\ttype.flags: ' + expressionType.flags);
            console.log('\ttype.symbol: ' + expressionType.symbol);
            var expressionSymbol = typeChecker.getSymbolAtLocation(expression);
            if (expressionSymbol == null) {
                console.log('\tsymbol: ' + expressionSymbol);
            }
            else {
                console.log('\tsymbol.flags: ' + expressionSymbol.flags);
                console.log('\tsymbol.name: ' + expressionSymbol.name);
                console.log('\tsymbol.declarations: ' + expressionSymbol.declarations);
            }
            var contextualType = typeChecker.getContextualType(expression);
            if (contextualType == null) {
                console.log('\tcontextualType: ' + contextualType);
            }
            else {
                console.log('\tcontextualType.flags: ' + contextualType.flags);
                console.log('\tcontextualType.symbol: ' + contextualType.symbol);
            }
        }
    }
    AstUtils.dumpTypeInfo = dumpTypeInfo;
})(AstUtils || (AstUtils = {}));
module.exports = AstUtils;
//# sourceMappingURL=AstUtils.js.map