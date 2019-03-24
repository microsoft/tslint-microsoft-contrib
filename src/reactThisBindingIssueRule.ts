import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { Scope } from './utils/Scope';
import { Utils } from './utils/Utils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

const FAILURE_ANONYMOUS_LISTENER: string = 'A new instance of an anonymous method is passed as a JSX attribute: ';
const FAILURE_DOUBLE_BIND: string = "A function is having its 'this' reference bound twice in the constructor: ";
const FAILURE_UNBOUND_LISTENER: string = "A class method is passed as a JSX attribute without having the 'this' reference bound: ";

interface Options {
    allowAnonymousListeners: boolean;
    allowedDecorators: Set<string>;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-this-binding-issue',
        type: 'maintainability',
        description:
            'When using React components you must be careful to correctly bind the `this` reference ' +
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

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
        }

        return [];
    }

    private parseOptions(options: Lint.IOptions): Options {
        const parsed: Options = {
            allowAnonymousListeners: false,
            allowedDecorators: new Set<string>()
        };

        options.ruleArguments.forEach((opt: unknown) => {
            if (isObject(opt)) {
                parsed.allowAnonymousListeners = opt['allow-anonymous-listeners'] === true;
                if (opt['bind-decorators']) {
                    const allowedDecorators: unknown = opt['bind-decorators'];
                    if (!Array.isArray(allowedDecorators) || allowedDecorators.some(decorator => typeof decorator !== 'string')) {
                        throw new Error('one or more members of bind-decorators is invalid, string required.');
                    }
                    // tslint:disable-next-line:prefer-type-cast
                    parsed.allowedDecorators = new Set<string>(allowedDecorators);
                }
            }
        });

        return parsed;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    let boundListeners: Set<string> = new Set<string>();
    let declaredMethods: Set<string> = new Set<string>();
    let scope: Scope | undefined;

    function isMethodBoundWithDecorators(node: ts.MethodDeclaration, allowedDecorators: Set<string>): boolean {
        if (!(allowedDecorators.size > 0 && node.decorators && node.decorators.length > 0)) {
            return false;
        }
        return node.decorators.some(decorator => {
            if (decorator.kind !== ts.SyntaxKind.Decorator) {
                return false;
            }
            const source = node.getSourceFile();
            const text = decorator.expression.getText(source);
            return ctx.options.allowedDecorators.has(text);
        });
    }

    function isAttributeAnonymousFunction(attributeLikeElement: ts.JsxAttribute | ts.JsxSpreadAttribute): boolean {
        if (ctx.options.allowAnonymousListeners) {
            return false;
        }
        if (attributeLikeElement.kind === ts.SyntaxKind.JsxAttribute) {
            const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
            if (attribute.initializer !== undefined && attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
                return isExpressionAnonymousFunction(attribute.initializer.expression);
            }
        }
        return false;
    }

    function isExpressionAnonymousFunction(expression: ts.Expression | undefined): boolean {
        if (expression === undefined) {
            return false;
        }

        // Arrow functions and Function expressions create new anonymous function instances
        if (expression.kind === ts.SyntaxKind.ArrowFunction || expression.kind === ts.SyntaxKind.FunctionExpression) {
            return true;
        }

        if (expression.kind === ts.SyntaxKind.CallExpression) {
            const callExpression = <ts.CallExpression>expression;
            const functionName = AstUtils.getFunctionName(callExpression);
            if (functionName === 'bind') {
                return true; // bind functions on Function or _ create a new anonymous instance of a function
            }
        }
        if (expression.kind === ts.SyntaxKind.Identifier && scope !== undefined) {
            const symbolText: string = expression.getText();
            return scope.isFunctionSymbol(symbolText);
        }
        return false;
    }

    function isUnboundListener(attributeLikeElement: ts.JsxAttribute | ts.JsxSpreadAttribute): boolean {
        if (attributeLikeElement.kind === ts.SyntaxKind.JsxAttribute) {
            const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
            if (attribute.initializer !== undefined && attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
                const jsxExpression = attribute.initializer;
                if (jsxExpression.expression !== undefined && jsxExpression.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>jsxExpression.expression;
                    if (propAccess.expression.getText() === 'this') {
                        const listenerText: string = propAccess.getText();

                        // an unbound listener is a class method reference that was not bound to 'this' in the constructor
                        if (declaredMethods.has(listenerText) && !boundListeners.has(listenerText)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    function getSelfBoundListeners(node: ts.ConstructorDeclaration): Set<string> {
        const result: Set<string> = new Set<string>();
        if (node.body !== undefined && node.body.statements !== undefined) {
            node.body.statements.forEach(
                (statement: ts.Statement): void => {
                    if (statement.kind === ts.SyntaxKind.ExpressionStatement) {
                        const expressionStatement = <ts.ExpressionStatement>statement;
                        const expression = expressionStatement.expression;
                        if (expression.kind === ts.SyntaxKind.BinaryExpression) {
                            const binaryExpression: ts.BinaryExpression = <ts.BinaryExpression>expression;
                            const operator: ts.Node = binaryExpression.operatorToken;
                            if (operator.kind === ts.SyntaxKind.EqualsToken) {
                                if (binaryExpression.left.kind === ts.SyntaxKind.PropertyAccessExpression) {
                                    const leftPropText: string = binaryExpression.left.getText();

                                    if (binaryExpression.right.kind === ts.SyntaxKind.CallExpression) {
                                        const callExpression = <ts.CallExpression>binaryExpression.right;

                                        if (
                                            AstUtils.getFunctionName(callExpression) === 'bind' &&
                                            callExpression.arguments !== undefined &&
                                            callExpression.arguments.length === 1 &&
                                            callExpression.arguments[0].getText() === 'this'
                                        ) {
                                            const rightPropText = AstUtils.getFunctionTarget(callExpression);
                                            if (leftPropText === rightPropText) {
                                                if (result.has(rightPropText)) {
                                                    const start = binaryExpression.getStart();
                                                    const width = binaryExpression.getWidth();
                                                    const msg = FAILURE_DOUBLE_BIND + binaryExpression.getText();
                                                    ctx.addFailureAt(start, width, msg);
                                                }
                                                result.add(rightPropText);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            );
        }
        return result;
    }

    function visitJsxOpeningElement(node: ts.JsxOpeningLikeElement): void {
        // create violations if the listener is a reference to a class method that was not bound to 'this' in the constructor
        node.attributes.properties.forEach(
            (attributeLikeElement: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
                if (isUnboundListener(attributeLikeElement)) {
                    const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
                    const jsxExpression = attribute.initializer;
                    if (jsxExpression === undefined || jsxExpression.kind === ts.SyntaxKind.StringLiteral) {
                        return;
                    }
                    const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>jsxExpression.expression;
                    const listenerText: string = propAccess.getText();
                    if (declaredMethods.has(listenerText) && !boundListeners.has(listenerText)) {
                        const start: number = propAccess.getStart();
                        const widget: number = propAccess.getWidth();
                        const message: string = FAILURE_UNBOUND_LISTENER + listenerText;
                        ctx.addFailureAt(start, widget, message);
                    }
                } else if (isAttributeAnonymousFunction(attributeLikeElement)) {
                    const attribute: ts.JsxAttribute = <ts.JsxAttribute>attributeLikeElement;
                    const jsxExpression = attribute.initializer;
                    if (jsxExpression === undefined || jsxExpression.kind === ts.SyntaxKind.StringLiteral) {
                        return;
                    }

                    const expression = jsxExpression.expression;
                    if (expression === undefined) {
                        return;
                    }

                    const start: number = expression.getStart();
                    const widget: number = expression.getWidth();
                    const message: string = FAILURE_ANONYMOUS_LISTENER + Utils.trimTo(expression.getText(), 30);
                    ctx.addFailureAt(start, widget, message);
                }
            }
        );
    }

    function cb(node: ts.Node): void {
        if (tsutils.isMethodDeclaration(node)) {
            // reset variable scope when we encounter a method. Start tracking variables that are instantiated
            // in scope so we can make sure new function instances are not passed as JSX attributes
            if (isMethodBoundWithDecorators(node, ctx.options.allowedDecorators)) {
                boundListeners = boundListeners.add('this.' + node.name.getText());
            }
            scope = new Scope(undefined);
            ts.forEachChild(node, cb);
            scope = undefined;
            return;
        }

        if (tsutils.isArrowFunction(node)) {
            if (scope !== undefined) {
                scope = new Scope(scope);
            }
            ts.forEachChild(node, cb);
            if (scope !== undefined) {
                scope = scope.parent;
            }
            return;
        }

        if (tsutils.isFunctionExpression(node)) {
            if (scope !== undefined) {
                scope = new Scope(scope);
            }
            ts.forEachChild(node, cb);
            if (scope !== undefined) {
                scope = scope.parent;
            }
            return;
        }

        if (tsutils.isClassDeclaration(node)) {
            // reset all state when a class declaration is found because a SourceFile can contain multiple classes
            boundListeners = new Set<string>();
            // find all method names and prepend 'this.' to it so we can compare array elements to method names easily
            declaredMethods = new Set<string>();
            AstUtils.getDeclaredMethodNames(node).forEach(
                (methodName: string): void => {
                    declaredMethods.add('this.' + methodName);
                }
            );
        } else if (tsutils.isConstructorDeclaration(node)) {
            boundListeners = getSelfBoundListeners(node);
        } else if (tsutils.isJsxElement(node)) {
            visitJsxOpeningElement(node.openingElement); // a normal JSX element has-a OpeningElement
        } else if (tsutils.isJsxSelfClosingElement(node)) {
            visitJsxOpeningElement(node); // a self closing JSX element is-a OpeningElement
        } else if (tsutils.isVariableDeclaration(node)) {
            if (scope !== undefined) {
                if (node.name.kind === ts.SyntaxKind.Identifier) {
                    const variableName = (<ts.Identifier>node.name).text;
                    if (isExpressionAnonymousFunction(node.initializer)) {
                        scope.addFunctionSymbol(variableName);
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
