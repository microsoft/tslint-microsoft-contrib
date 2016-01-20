var ts = require('typescript');
var SyntaxKind = require('./SyntaxKind');
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
    function getFunctionTarget(expression) {
        if (expression.expression.kind === SyntaxKind.current().PropertyAccessExpression) {
            var propExp = expression.expression;
            return propExp.expression.getText();
        }
        return null;
    }
    AstUtils.getFunctionTarget = getFunctionTarget;
    function hasModifier(modifiers, modifierKind) {
        if (modifiers == null) {
            return false;
        }
        var result = false;
        modifiers.forEach(function (modifier) {
            if (modifier.kind === modifierKind) {
                result = true;
            }
        });
        return result;
    }
    AstUtils.hasModifier = hasModifier;
    function dumpTypeInfo(expression, languageServices, typeChecker) {
        console.log(expression.getFullText());
        console.log('\tkind: ' + expression.kind);
        if (expression.kind === SyntaxKind.current().Identifier
            || expression.kind === SyntaxKind.current().PropertyAccessExpression) {
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
    function isPrivate(node) {
        return !!(node.flags & 32);
    }
    AstUtils.isPrivate = isPrivate;
    function isProtected(node) {
        return !!(node.flags & 64);
    }
    AstUtils.isProtected = isProtected;
    function isPublic(node) {
        return !!(node.flags & 16);
    }
    AstUtils.isPublic = isPublic;
    function isStatic(node) {
        return !!(node.flags & 128);
    }
    AstUtils.isStatic = isStatic;
    function findParentBlock(child) {
        var parent = child.parent;
        while (parent != null) {
            if (parent.kind === SyntaxKind.current().Block) {
                return parent;
            }
            parent = parent.parent;
        }
        throw new Error('Could not determine parent block of node: ' + child);
    }
    AstUtils.findParentBlock = findParentBlock;
    function isSameIdentifer(source, target) {
        if (source == null || target == null) {
            return false;
        }
        if (source.kind === SyntaxKind.current().Identifier && target.kind === SyntaxKind.current().Identifier) {
            return source.getText() === target.getText();
        }
        return false;
    }
    AstUtils.isSameIdentifer = isSameIdentifer;
})(AstUtils || (AstUtils = {}));
module.exports = AstUtils;
//# sourceMappingURL=AstUtils.js.map