import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {AstUtils} from './utils/AstUtils';
import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {Scope} from './utils/Scope';
import {SyntaxKind} from './utils/SyntaxKind';
import {Utils} from './utils/Utils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_ANONYMOUS_LISTENER: string = 'A new instance of an anonymous method is passed as a JSX attribute: ';
const FAILURE_DOUBLE_BIND: string = 'A function is having its \'this\' reference bound twice in the constructor: ';
const FAILURE_UNBOUND_LISTENER: string = 'A class method is passed as a JSX attribute without having the \'this\' ' +
    'reference bound in the constructor: ';

/**
 * Implementation of the react-this-binding-issue rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-this-binding-issue',
        type: 'maintainability',
        description: 'When using React components you must be careful to correctly bind the `this` reference ' +
                     'on any methods that you pass off to child components as callbacks.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactThisBindingIssueRuleWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactThisBindingIssueRuleWalker extends ErrorTolerantWalker {

    private allowAnonymousListeners: boolean = false;
    private boundListeners: string[] = [];
    private declaredMethods: string[] = [];
    private scope: Scope;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'object') {
                this.allowAnonymousListeners = opt['allow-anonymous-listeners'] === true;
            }
        });
    }

    protected visitClassDeclaration(node: ts.ClassDeclaration): void {
        // reset all state when a class declaration is found because a SourceFile can contain multiple classes
        this.boundListeners = [];
        // find all method names and prepend 'this.' to it so we can compare array elements to method names easily
        this.declaredMethods = [];
        AstUtils.getDeclaredMethodNames(node).forEach((methodName: string): void => {
            this.declaredMethods.push('this.' + methodName);
        });
        super.visitClassDeclaration(node);
    }

    protected visitConstructorDeclaration(node: ts.ConstructorDeclaration): void {
        this.boundListeners = this.getSelfBoundListeners(node);
        super.visitConstructorDeclaration(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        this.visitJsxOpeningElement(node.openingElement); // a normal JSX element has-a OpeningElement
        super.visitJsxElement(node);
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.visitJsxOpeningElement(node);  // a self closing JSX element is-a OpeningElement
        super.visitJsxSelfClosingElement(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        // reset variable scope when we encounter a method. Start tracking variables that are instantiated
        // in scope so we can make sure new function instances are not passed as JSX attributes
        this.scope = new Scope(null);
        super.visitMethodDeclaration(node);
        this.scope = null;
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        if (this.scope != null) {
            this.scope = new Scope(this.scope);
        }
        super.visitArrowFunction(node);
        if (this.scope != null) {
            this.scope = this.scope.parent;
        }
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): void {
        if (this.scope != null) {
            this.scope = new Scope(this.scope);
        }
        super.visitFunctionExpression(node);
        if (this.scope != null) {
            this.scope = this.scope.parent;
        }
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        if (this.scope != null) {
            if (node.name.kind === SyntaxKind.current().Identifier) {
                const variableName = (<ts.Identifier>node.name).text;
                if (this.isExpressionAnonymousFunction(node.initializer)) {
                    this.scope.addFunctionSymbol(variableName);
                }
            }
        }
        super.visitVariableDeclaration(node);
    }

    private visitJsxOpeningElement(node: ts.JsxOpeningElement): void {
        // create violations if the listener is a reference to a class method that was not bound to 'this' in the constructor
        node.attributes.forEach((attributeLikeElement: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
            if (this.isUnboundListener(attributeLikeElement)) {
                const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
                const jsxExpression: ts.JsxExpression = attribute.initializer;
                const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>jsxExpression.expression;
                const listenerText: string = propAccess.getText();
                if (this.declaredMethods.indexOf(listenerText) > -1 && this.boundListeners.indexOf(listenerText) === -1) {
                    const start: number = propAccess.getStart();
                    const widget: number = propAccess.getWidth();
                    const message: string = FAILURE_UNBOUND_LISTENER + listenerText;
                    this.addFailure(this.createFailure(start, widget, message));
                }
            } else if (this.isAttributeAnonymousFunction(attributeLikeElement)) {
                const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
                const jsxExpression: ts.JsxExpression = attribute.initializer;
                const expression: ts.Expression = jsxExpression.expression;
                const start: number = expression.getStart();
                const widget: number = expression.getWidth();
                const message: string = FAILURE_ANONYMOUS_LISTENER + Utils.trimTo(expression.getText(), 30);
                this.addFailure(this.createFailure(start, widget, message));
            }
        });
    }

    private isAttributeAnonymousFunction(attributeLikeElement: ts.JsxAttribute | ts.JsxSpreadAttribute): boolean {
        if (this.allowAnonymousListeners) {
            return false;
        }
        if (attributeLikeElement.kind === SyntaxKind.current().JsxAttribute) {
            const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
            if (attribute.initializer != null && attribute.initializer.kind === SyntaxKind.current().JsxExpression) {
                const jsxExpression: ts.JsxExpression = attribute.initializer;
                const expression: ts.Expression = jsxExpression.expression;
                return this.isExpressionAnonymousFunction(expression);
            }
        }
        return false;
    }

    private isExpressionAnonymousFunction(expression: ts.Expression): boolean {
        if (expression == null) {
            return false;
        }

        // Arrow functions and Function expressions create new anonymous function instances
        if (expression.kind === SyntaxKind.current().ArrowFunction
            || expression.kind === SyntaxKind.current().FunctionExpression) {
            return true;
        }

        if (expression.kind === SyntaxKind.current().CallExpression) {
            const callExpression = <ts.CallExpression>expression;
            const functionName = AstUtils.getFunctionName(callExpression);
            if (functionName === 'bind') {
                return true; // bind functions on Function or _ create a new anonymous instance of a function
            }
        }
        if (expression.kind === SyntaxKind.current().Identifier) {
            const symbolText: string = expression.getText();
            return this.scope.isFunctionSymbol(symbolText);
        }
        return false;
    }

    private isUnboundListener(attributeLikeElement: ts.JsxAttribute | ts.JsxSpreadAttribute): boolean {
        if (attributeLikeElement.kind === SyntaxKind.current().JsxAttribute) {
            const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
            if (attribute.initializer != null && attribute.initializer.kind === SyntaxKind.current().JsxExpression) {
                const jsxExpression: ts.JsxExpression = attribute.initializer;
                if (jsxExpression.expression != null && jsxExpression.expression.kind === SyntaxKind.current().PropertyAccessExpression) {
                    const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>jsxExpression.expression;
                    if (propAccess.expression.getText() === 'this') {
                        const listenerText: string = propAccess.getText();

                        // an unbound listener is a class method reference that was not bound to 'this' in the constructor
                        if (this.declaredMethods.indexOf(listenerText) > -1 && this.boundListeners.indexOf(listenerText) === -1) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private getSelfBoundListeners(node: ts.ConstructorDeclaration): string[] {
        const result: string[] = [];
        if (node.body != null && node.body.statements != null) {
            node.body.statements.forEach((statement: ts.Statement): void => {
                if (statement.kind === SyntaxKind.current().ExpressionStatement) {
                    const expressionStatement: ts.ExpressionStatement = <ts.ExpressionStatement>statement;
                    const expression = expressionStatement.expression;
                    if (expression.kind === SyntaxKind.current().BinaryExpression) {
                        const binaryExpression: ts.BinaryExpression = <ts.BinaryExpression>expression;
                        const operator: ts.Node = binaryExpression.operatorToken;
                        if (operator.kind === SyntaxKind.current().EqualsToken) {
                            if (binaryExpression.left.kind === SyntaxKind.current().PropertyAccessExpression) {
                                const leftPropText: string = binaryExpression.left.getText();

                                if (binaryExpression.right.kind === SyntaxKind.current().CallExpression) {
                                    const callExpression = <ts.CallExpression>binaryExpression.right;

                                    if (AstUtils.getFunctionName(callExpression) === 'bind'
                                        && callExpression.arguments != null
                                        && callExpression.arguments.length === 1
                                        && callExpression.arguments[0].getText() === 'this') {

                                        const rightPropText: string = AstUtils.getFunctionTarget(callExpression);
                                        if (leftPropText === rightPropText) {
                                            if (result.indexOf(rightPropText) === -1) {
                                                result.push(rightPropText);
                                            } else {
                                                const start = binaryExpression.getStart();
                                                const width = binaryExpression.getWidth();
                                                const msg = FAILURE_DOUBLE_BIND + binaryExpression.getText();
                                                this.addFailure(this.createFailure(start, width, msg));
                                            }
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
    }
}
