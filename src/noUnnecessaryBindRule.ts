import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-bind',
        type: 'maintainability',
        description: 'Do not bind `this` as the context for a function literal or lambda expression.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        recommendation: 'false',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_FUNCTION_WITH_BIND: string = "Binding function literal with 'this' context. Use lambdas instead";
    public static FAILURE_ARROW_WITH_BIND: string = "Binding lambda with 'this' context. Lambdas already have 'this' bound";

    public static UNDERSCORE_BINARY_FUNCTION_NAMES: string[] = [
        'all',
        'any',
        'collect',
        'countBy',
        'detect',
        'each',
        'every',
        'filter',
        'find',
        'forEach',
        'groupBy',
        'indexBy',
        'map',
        'max',
        'max',
        'min',
        'partition',
        'reject',
        'select',
        'some',
        'sortBy',
        'times',
        'uniq',
        'unique'
    ];
    public static UNDERSCORE_TERNARY_FUNCTION_NAMES: string[] = ['foldl', 'foldr', 'inject', 'reduce', 'reduceRight'];

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-unnecessary-bind rule is deprecated. Replace your usage with the TSLint unnecessary-bind rule.');
            Rule.isWarningShown = true;
        }

        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            const analyzers: CallAnalyzer[] = [
                new TypeScriptFunctionAnalyzer(),
                new UnderscoreStaticAnalyzer(),
                new UnderscoreInstanceAnalyzer()
            ];

            analyzers.forEach(
                (analyzer: CallAnalyzer): void => {
                    if (analyzer.canHandle(node)) {
                        const contextArgument = analyzer.getContextArgument(node);
                        const functionArgument = analyzer.getFunctionArgument(node);
                        if (contextArgument === undefined || functionArgument === undefined) {
                            return;
                        }
                        if (contextArgument.getText() === 'this') {
                            if (isArrowFunction(functionArgument)) {
                                ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_ARROW_WITH_BIND);
                            } else if (isFunctionLiteral(functionArgument)) {
                                ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_FUNCTION_WITH_BIND);
                            }
                        }
                    }
                }
            );
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
interface CallAnalyzer {
    canHandle(node: ts.CallExpression): boolean;
    getContextArgument(node: ts.CallExpression): ts.Expression | undefined;
    getFunctionArgument(node: ts.CallExpression): ts.Expression | undefined;
}

class TypeScriptFunctionAnalyzer implements CallAnalyzer {
    public canHandle(node: ts.CallExpression): boolean {
        return !!(
            AstUtils.getFunctionName(node) === 'bind' &&
            node.arguments.length === 1 &&
            node.expression.kind === ts.SyntaxKind.PropertyAccessExpression
        );
    }

    public getContextArgument(node: ts.CallExpression): ts.Expression {
        return node.arguments[0];
    }

    public getFunctionArgument(node: ts.CallExpression): ts.Expression {
        return (<ts.PropertyAccessExpression>node.expression).expression;
    }
}

class UnderscoreStaticAnalyzer implements CallAnalyzer {
    public canHandle(node: ts.CallExpression): boolean {
        const isUnderscore: boolean = AstUtils.getFunctionTarget(node) === '_';
        if (isUnderscore) {
            const functionName: string = AstUtils.getFunctionName(node);
            if (functionName === 'bind') {
                return node.arguments.length === 2;
            }
        }
        return isUnderscore;
    }

    public getContextArgument(node: ts.CallExpression): ts.Expression | undefined {
        const functionName: string = AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[2];
        } else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[3];
        } else if (functionName === 'sortedIndex') {
            return node.arguments[3];
        } else if (functionName === 'bind') {
            return node.arguments[1];
        }
        return undefined;
    }

    public getFunctionArgument(node: ts.CallExpression): ts.Expression | undefined {
        const functionName: string = AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[1];
        } else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[1];
        } else if (functionName === 'sortedIndex') {
            return node.arguments[2];
        } else if (functionName === 'bind') {
            return node.arguments[0];
        }
        return undefined;
    }
}

class UnderscoreInstanceAnalyzer implements CallAnalyzer {
    public canHandle(node: ts.CallExpression): boolean {
        if (node.expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
            const propExpression: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.expression;
            if (propExpression.expression.kind === ts.SyntaxKind.CallExpression) {
                const call: ts.CallExpression = <ts.CallExpression>propExpression.expression;
                return call.expression.getText() === '_';
            }
        }
        return false;
    }

    public getContextArgument(node: ts.CallExpression): ts.Expression | undefined {
        const functionName: string = AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[1];
        } else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[2];
        } else if (functionName === 'sortedIndex') {
            return node.arguments[2];
        }
        return undefined;
    }

    public getFunctionArgument(node: ts.CallExpression): ts.Expression | undefined {
        const functionName: string = AstUtils.getFunctionName(node);
        if (Rule.UNDERSCORE_BINARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[0];
        } else if (Rule.UNDERSCORE_TERNARY_FUNCTION_NAMES.indexOf(functionName) !== -1) {
            return node.arguments[0];
        } else if (functionName === 'sortedIndex') {
            return node.arguments[1];
        }
        return undefined;
    }
}

function isFunctionLiteral(expression: ts.Expression): boolean {
    if (expression.kind === ts.SyntaxKind.FunctionExpression) {
        return true;
    }
    if (expression.kind === ts.SyntaxKind.ParenthesizedExpression) {
        return isFunctionLiteral((<ts.ParenthesizedExpression>expression).expression);
    }
    return false;
}

function isArrowFunction(expression: ts.Expression): boolean {
    if (expression.kind === ts.SyntaxKind.ArrowFunction) {
        return true;
    }
    if (expression.kind === ts.SyntaxKind.ParenthesizedExpression) {
        return isArrowFunction((<ts.ParenthesizedExpression>expression).expression);
    }
    return false;
}
