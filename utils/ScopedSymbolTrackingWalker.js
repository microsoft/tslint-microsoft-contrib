var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ts = require('typescript');
var ErrorTolerantWalker = require('./ErrorTolerantWalker');
var SyntaxKind = require('./SyntaxKind');
var AstUtils = require('./AstUtils');
var ScopedSymbolTrackingWalker = (function (_super) {
    __extends(ScopedSymbolTrackingWalker, _super);
    function ScopedSymbolTrackingWalker(sourceFile, options, languageServices) {
        _super.call(this, sourceFile, options);
        this.languageServices = languageServices;
        this.typeChecker = this.languageServices.getProgram().getTypeChecker();
    }
    ScopedSymbolTrackingWalker.prototype.isExpressionEvaluatingToFunction = function (expression) {
        if (expression.kind === SyntaxKind.current().ArrowFunction
            || expression.kind === SyntaxKind.current().FunctionExpression) {
            return true;
        }
        if (expression.kind === SyntaxKind.current().StringLiteral
            || expression.kind === SyntaxKind.current().NoSubstitutionTemplateLiteral
            || expression.kind === SyntaxKind.current().TemplateExpression
            || expression.kind === SyntaxKind.current().TaggedTemplateExpression
            || expression.kind === SyntaxKind.current().BinaryExpression) {
            return false;
        }
        if (this.scope.isFunctionSymbol(expression.getText())) {
            return true;
        }
        if (expression.kind === SyntaxKind.current().Identifier) {
            var typeInfo = this.languageServices.getTypeDefinitionAtPosition('file.ts', expression.getStart());
            if (typeInfo != null && typeInfo[0] != null) {
                if (typeInfo[0].kind === 'function' || typeInfo[0].kind === 'local function') {
                    return true;
                }
            }
            return false;
        }
        if (expression.kind === SyntaxKind.current().CallExpression) {
            if (expression.expression.name && expression.expression.name.getText() === 'bind') {
                return true;
            }
            try {
                var signature = this.typeChecker.getResolvedSignature(expression);
                var expressionType = this.typeChecker.getReturnTypeOfSignature(signature);
                return this.isTypeFunction(expressionType, this.typeChecker);
            }
            catch (e) {
                return false;
            }
        }
        return this.isTypeFunction(this.typeChecker.getTypeAtLocation(expression), this.typeChecker);
    };
    ScopedSymbolTrackingWalker.prototype.isTypeFunction = function (expressionType, typeChecker) {
        var signatures = typeChecker.getSignaturesOfType(expressionType, 0);
        if (signatures != null && signatures.length > 0) {
            var signatureDeclaration = signatures[0].declaration;
            if (signatureDeclaration.kind === SyntaxKind.current().FunctionType) {
                return true;
            }
        }
        return false;
    };
    ScopedSymbolTrackingWalker.prototype.visitSourceFile = function (node) {
        this.scope = new Scope(null);
        this.scope.addGlobalScope(node, node, this.getOptions());
        _super.prototype.visitSourceFile.call(this, node);
        this.scope = null;
    };
    ScopedSymbolTrackingWalker.prototype.visitModuleDeclaration = function (node) {
        this.scope = new Scope(this.scope);
        this.scope.addGlobalScope(node.body, this.getSourceFile(), this.getOptions());
        _super.prototype.visitModuleDeclaration.call(this, node);
        this.scope = this.scope.parent;
    };
    ScopedSymbolTrackingWalker.prototype.visitClassDeclaration = function (node) {
        var _this = this;
        this.scope = new Scope(this.scope);
        node.members.forEach(function (element) {
            var prefix = AstUtils.isStatic(element)
                ? node.name.getText() + '.'
                : 'this.';
            if (element.kind === SyntaxKind.current().MethodDeclaration) {
                _this.scope.addFunctionSymbol(prefix + element.name.getText());
            }
            else if (element.kind === SyntaxKind.current().PropertyDeclaration) {
                var prop = element;
                if (isDeclarationFunctionType(prop)) {
                    _this.scope.addFunctionSymbol(prefix + element.name.getText());
                }
                else {
                    _this.scope.addNonFunctionSymbol(prefix + element.name.getText());
                }
            }
        });
        _super.prototype.visitClassDeclaration.call(this, node);
        this.scope = this.scope.parent;
    };
    ScopedSymbolTrackingWalker.prototype.visitFunctionDeclaration = function (node) {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        _super.prototype.visitFunctionDeclaration.call(this, node);
        this.scope = this.scope.parent;
    };
    ScopedSymbolTrackingWalker.prototype.visitConstructorDeclaration = function (node) {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        _super.prototype.visitConstructorDeclaration.call(this, node);
        this.scope = this.scope.parent;
    };
    ScopedSymbolTrackingWalker.prototype.visitMethodDeclaration = function (node) {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        _super.prototype.visitMethodDeclaration.call(this, node);
        this.scope = this.scope.parent;
    };
    ScopedSymbolTrackingWalker.prototype.visitArrowFunction = function (node) {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        _super.prototype.visitArrowFunction.call(this, node);
        this.scope = this.scope.parent;
    };
    ScopedSymbolTrackingWalker.prototype.visitFunctionExpression = function (node) {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        _super.prototype.visitFunctionExpression.call(this, node);
        this.scope = this.scope.parent;
    };
    ScopedSymbolTrackingWalker.prototype.visitSetAccessor = function (node) {
        this.scope = new Scope(this.scope);
        this.scope.addParameters(node.parameters);
        _super.prototype.visitSetAccessor.call(this, node);
        this.scope = this.scope.parent;
    };
    return ScopedSymbolTrackingWalker;
})(ErrorTolerantWalker);
function isDeclarationFunctionType(node) {
    if (node.type != null) {
        return node.type.kind === SyntaxKind.current().FunctionType;
    }
    else if (node.initializer != null) {
        return (node.initializer.kind === SyntaxKind.current().ArrowFunction
            || node.initializer.kind === SyntaxKind.current().FunctionExpression);
    }
    return false;
}
var GlobalReferenceCollector = (function (_super) {
    __extends(GlobalReferenceCollector, _super);
    function GlobalReferenceCollector() {
        _super.apply(this, arguments);
        this.functionIdentifiers = [];
        this.nonFunctionIdentifiers = [];
    }
    GlobalReferenceCollector.prototype.visitModuleDeclaration = function (node) { };
    GlobalReferenceCollector.prototype.visitClassDeclaration = function (node) { };
    GlobalReferenceCollector.prototype.visitArrowFunction = function (node) { };
    GlobalReferenceCollector.prototype.visitFunctionExpression = function (node) { };
    GlobalReferenceCollector.prototype.visitNode = function (node) {
        _super.prototype.visitNode.call(this, node);
    };
    GlobalReferenceCollector.prototype.visitVariableDeclaration = function (node) {
        if (isDeclarationFunctionType(node)) {
            this.functionIdentifiers.push(node.name.getText());
        }
        else {
            this.nonFunctionIdentifiers.push(node.name.getText());
        }
    };
    return GlobalReferenceCollector;
})(ErrorTolerantWalker);
var Scope = (function () {
    function Scope(parent) {
        this.symbols = {};
        this.parent = parent;
    }
    Scope.prototype.addFunctionSymbol = function (symbolString) {
        this.symbols[symbolString] = SyntaxKind.current().FunctionType;
    };
    Scope.prototype.addNonFunctionSymbol = function (symbolString) {
        this.symbols[symbolString] = SyntaxKind.current().Unknown;
    };
    Scope.prototype.isFunctionSymbol = function (symbolString) {
        if (this.symbols[symbolString] === SyntaxKind.current().FunctionType) {
            return true;
        }
        if (this.symbols[symbolString] === SyntaxKind.current().Unknown) {
            return false;
        }
        if (this.parent != null) {
            return this.parent.isFunctionSymbol(symbolString);
        }
        return false;
    };
    Scope.prototype.addParameters = function (parameters) {
        var _this = this;
        parameters.forEach(function (parm) {
            if (isDeclarationFunctionType(parm)) {
                _this.addFunctionSymbol(parm.name.getText());
            }
            else {
                _this.addNonFunctionSymbol(parm.name.getText());
            }
        });
    };
    Scope.prototype.addGlobalScope = function (node, sourceFile, options) {
        var _this = this;
        var refCollector = new GlobalReferenceCollector(sourceFile, options);
        refCollector.visitNode(node);
        refCollector.functionIdentifiers.forEach(function (identifier) { _this.addFunctionSymbol(identifier); });
        refCollector.nonFunctionIdentifiers.forEach(function (identifier) { _this.addNonFunctionSymbol(identifier); });
    };
    return Scope;
})();
module.exports = ScopedSymbolTrackingWalker;
//# sourceMappingURL=ScopedSymbolTrackingWalker.js.map