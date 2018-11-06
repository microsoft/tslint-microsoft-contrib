"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var Lint = require("tslint");
var AstUtils_1 = require("./utils/AstUtils");
var Scope_1 = require("./utils/Scope");
var Utils_1 = require("./utils/Utils");
var TypeGuard_1 = require("./utils/TypeGuard");
var FAILURE_ANONYMOUS_LISTENER = 'A new instance of an anonymous method is passed as a JSX attribute: ';
var FAILURE_DOUBLE_BIND = "A function is having its 'this' reference bound twice in the constructor: ";
var FAILURE_UNBOUND_LISTENER = "A class method is passed as a JSX attribute without having the 'this' reference bound: ";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactThisBindingIssueRuleWalker(sourceFile, this.getOptions()));
        }
        else {
            return [];
        }
    };
    Rule.metadata = {
        ruleName: 'react-this-binding-issue',
        type: 'maintainability',
        description: 'When using React components you must be careful to correctly bind the `this` reference ' +
            'on any methods that you pass off to child components as callbacks.',
        options: {
            type: 'object',
            properties: {
                'allow-anonymous-listeners': {
                    type: 'boolean'
                },
                'bind-decorators': {
                    type: 'list',
                    listType: {
                        anyOf: {
                            type: 'string'
                        }
                    }
                }
            }
        },
        optionExamples: [true, [true, { 'bind-decorators': ['autobind'] }]],
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var ReactThisBindingIssueRuleWalker = (function (_super) {
    __extends(ReactThisBindingIssueRuleWalker, _super);
    function ReactThisBindingIssueRuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.allowAnonymousListeners = false;
        _this.allowedDecorators = new Set();
        _this.boundListeners = new Set();
        _this.declaredMethods = new Set();
        _this.getOptions().forEach(function (opt) {
            if (TypeGuard_1.isObject(opt)) {
                _this.allowAnonymousListeners = opt['allow-anonymous-listeners'] === true;
                if (opt['bind-decorators']) {
                    var allowedDecorators = opt['bind-decorators'];
                    if (!Array.isArray(allowedDecorators) || allowedDecorators.some(function (decorator) { return typeof decorator !== 'string'; })) {
                        throw new Error('one or more members of bind-decorators is invalid, string required.');
                    }
                    _this.allowedDecorators = new Set(allowedDecorators);
                }
            }
        });
        return _this;
    }
    ReactThisBindingIssueRuleWalker.prototype.visitClassDeclaration = function (node) {
        var _this = this;
        this.boundListeners = new Set();
        this.declaredMethods = new Set();
        AstUtils_1.AstUtils.getDeclaredMethodNames(node).forEach(function (methodName) {
            _this.declaredMethods.add('this.' + methodName);
        });
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    ReactThisBindingIssueRuleWalker.prototype.visitConstructorDeclaration = function (node) {
        this.boundListeners = this.getSelfBoundListeners(node);
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    ReactThisBindingIssueRuleWalker.prototype.visitJsxElement = function (node) {
        this.visitJsxOpeningElement(node.openingElement);
        _super.prototype.visitJsxElement.call(this, node);
    };
    ReactThisBindingIssueRuleWalker.prototype.visitJsxSelfClosingElement = function (node) {
        this.visitJsxOpeningElement(node);
        _super.prototype.visitJsxSelfClosingElement.call(this, node);
    };
    ReactThisBindingIssueRuleWalker.prototype.visitMethodDeclaration = function (node) {
        if (this.isMethodBoundWithDecorators(node, this.allowedDecorators)) {
            this.boundListeners = this.boundListeners.add('this.' + node.name.getText());
        }
        this.scope = new Scope_1.Scope(undefined);
        _super.prototype.visitMethodDeclaration.call(this, node);
        this.scope = undefined;
    };
    ReactThisBindingIssueRuleWalker.prototype.isMethodBoundWithDecorators = function (node, allowedDecorators) {
        var _this = this;
        if (!(allowedDecorators.size > 0 && node.decorators && node.decorators.length > 0)) {
            return false;
        }
        return node.decorators.some(function (decorator) {
            if (decorator.kind !== ts.SyntaxKind.Decorator) {
                return false;
            }
            var source = node.getSourceFile();
            var text = decorator.expression.getText(source);
            return _this.allowedDecorators.has(text);
        });
    };
    ReactThisBindingIssueRuleWalker.prototype.visitArrowFunction = function (node) {
        if (this.scope !== undefined) {
            this.scope = new Scope_1.Scope(this.scope);
        }
        _super.prototype.visitArrowFunction.call(this, node);
        if (this.scope !== undefined) {
            this.scope = this.scope.parent;
        }
    };
    ReactThisBindingIssueRuleWalker.prototype.visitFunctionExpression = function (node) {
        if (this.scope !== undefined) {
            this.scope = new Scope_1.Scope(this.scope);
        }
        _super.prototype.visitFunctionExpression.call(this, node);
        if (this.scope !== undefined) {
            this.scope = this.scope.parent;
        }
    };
    ReactThisBindingIssueRuleWalker.prototype.visitVariableDeclaration = function (node) {
        if (this.scope !== undefined) {
            if (node.name.kind === ts.SyntaxKind.Identifier) {
                var variableName = node.name.text;
                if (this.isExpressionAnonymousFunction(node.initializer)) {
                    this.scope.addFunctionSymbol(variableName);
                }
            }
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    ReactThisBindingIssueRuleWalker.prototype.visitJsxOpeningElement = function (node) {
        var _this = this;
        node.attributes.properties.forEach(function (attributeLikeElement) {
            if (_this.isUnboundListener(attributeLikeElement)) {
                var attribute = attributeLikeElement;
                var jsxExpression = attribute.initializer;
                if (jsxExpression === undefined || jsxExpression.kind === ts.SyntaxKind.StringLiteral) {
                    return;
                }
                var propAccess = jsxExpression.expression;
                var listenerText = propAccess.getText();
                if (_this.declaredMethods.has(listenerText) && !_this.boundListeners.has(listenerText)) {
                    var start = propAccess.getStart();
                    var widget = propAccess.getWidth();
                    var message = FAILURE_UNBOUND_LISTENER + listenerText;
                    _this.addFailureAt(start, widget, message);
                }
            }
            else if (_this.isAttributeAnonymousFunction(attributeLikeElement)) {
                var attribute = attributeLikeElement;
                var jsxExpression = attribute.initializer;
                if (jsxExpression === undefined || jsxExpression.kind === ts.SyntaxKind.StringLiteral) {
                    return;
                }
                var expression = jsxExpression.expression;
                if (expression === undefined) {
                    return;
                }
                var start = expression.getStart();
                var widget = expression.getWidth();
                var message = FAILURE_ANONYMOUS_LISTENER + Utils_1.Utils.trimTo(expression.getText(), 30);
                _this.addFailureAt(start, widget, message);
            }
        });
    };
    ReactThisBindingIssueRuleWalker.prototype.isAttributeAnonymousFunction = function (attributeLikeElement) {
        if (this.allowAnonymousListeners) {
            return false;
        }
        if (attributeLikeElement.kind === ts.SyntaxKind.JsxAttribute) {
            var attribute = attributeLikeElement;
            if (attribute.initializer !== undefined && attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
                return this.isExpressionAnonymousFunction(attribute.initializer.expression);
            }
        }
        return false;
    };
    ReactThisBindingIssueRuleWalker.prototype.isExpressionAnonymousFunction = function (expression) {
        if (expression === undefined) {
            return false;
        }
        if (expression.kind === ts.SyntaxKind.ArrowFunction || expression.kind === ts.SyntaxKind.FunctionExpression) {
            return true;
        }
        if (expression.kind === ts.SyntaxKind.CallExpression) {
            var callExpression = expression;
            var functionName = AstUtils_1.AstUtils.getFunctionName(callExpression);
            if (functionName === 'bind') {
                return true;
            }
        }
        if (expression.kind === ts.SyntaxKind.Identifier && this.scope !== undefined) {
            var symbolText = expression.getText();
            return this.scope.isFunctionSymbol(symbolText);
        }
        return false;
    };
    ReactThisBindingIssueRuleWalker.prototype.isUnboundListener = function (attributeLikeElement) {
        if (attributeLikeElement.kind === ts.SyntaxKind.JsxAttribute) {
            var attribute = attributeLikeElement;
            if (attribute.initializer !== undefined && attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
                var jsxExpression = attribute.initializer;
                if (jsxExpression.expression !== undefined && jsxExpression.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    var propAccess = jsxExpression.expression;
                    if (propAccess.expression.getText() === 'this') {
                        var listenerText = propAccess.getText();
                        if (this.declaredMethods.has(listenerText) && !this.boundListeners.has(listenerText)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    ReactThisBindingIssueRuleWalker.prototype.getSelfBoundListeners = function (node) {
        var _this = this;
        var result = new Set();
        if (node.body !== undefined && node.body.statements !== undefined) {
            node.body.statements.forEach(function (statement) {
                if (statement.kind === ts.SyntaxKind.ExpressionStatement) {
                    var expressionStatement = statement;
                    var expression = expressionStatement.expression;
                    if (expression.kind === ts.SyntaxKind.BinaryExpression) {
                        var binaryExpression = expression;
                        var operator = binaryExpression.operatorToken;
                        if (operator.kind === ts.SyntaxKind.EqualsToken) {
                            if (binaryExpression.left.kind === ts.SyntaxKind.PropertyAccessExpression) {
                                var leftPropText = binaryExpression.left.getText();
                                if (binaryExpression.right.kind === ts.SyntaxKind.CallExpression) {
                                    var callExpression = binaryExpression.right;
                                    if (AstUtils_1.AstUtils.getFunctionName(callExpression) === 'bind' &&
                                        callExpression.arguments !== undefined &&
                                        callExpression.arguments.length === 1 &&
                                        callExpression.arguments[0].getText() === 'this') {
                                        var rightPropText = AstUtils_1.AstUtils.getFunctionTarget(callExpression);
                                        if (leftPropText === rightPropText) {
                                            if (result.has(rightPropText)) {
                                                var start = binaryExpression.getStart();
                                                var width = binaryExpression.getWidth();
                                                var msg = FAILURE_DOUBLE_BIND + binaryExpression.getText();
                                                _this.addFailureAt(start, width, msg);
                                            }
                                            result.add(rightPropText);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        return result;
    };
    return ReactThisBindingIssueRuleWalker;
}(Lint.RuleWalker));
//# sourceMappingURL=reactThisBindingIssueRule.js.map