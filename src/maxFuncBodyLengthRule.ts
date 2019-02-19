import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { Utils } from './utils/Utils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { isObject } from './utils/TypeGuard';

interface Options {
    maxBodyLength: number;
    maxFuncBodyLength: number;
    maxFuncExpressionBodyLength: number;
    maxArrowBodyLength: number;
    maxMethodBodyLength: number;
    maxCtorBodyLength: number;
    ignoreComments: boolean;
    ignoreParametersToFunctionRegex: RegExp;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'max-func-body-length',
        type: 'maintainability',
        description: 'Avoid long functions.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        recommendation: '[true, 100, { "ignore-parameters-to-function-regex": "^describe$" }]',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        let maxBodyLength!: number;
        let maxFuncBodyLength!: number;
        let maxFuncExpressionBodyLength!: number;
        let maxArrowBodyLength!: number;
        let maxMethodBodyLength!: number;
        let maxCtorBodyLength!: number;
        let ignoreComments!: boolean;
        let ignoreParametersToFunctionRegex!: RegExp;

        if (options.ruleArguments instanceof Array) {
            options.ruleArguments.forEach((opt: unknown) => {
                if (typeof opt === 'number') {
                    maxBodyLength = opt;
                    return;
                }

                if (isObject(opt)) {
                    maxFuncBodyLength = <number>opt[FUNC_BODY_LENGTH];
                    maxFuncExpressionBodyLength = <number>opt[FUNC_EXPRESSION_BODY_LENGTH];
                    maxArrowBodyLength = <number>opt[ARROW_BODY_LENGTH];
                    maxMethodBodyLength = <number>opt[METHOD_BODY_LENGTH];
                    maxCtorBodyLength = <number>opt[CTOR_BODY_LENGTH];
                    ignoreComments = !!opt[IGNORE_COMMENTS];
                    const regex: string = <string>opt[IGNORE_PARAMETERS_TO_FUNCTION];
                    if (regex) {
                        ignoreParametersToFunctionRegex = new RegExp(regex);
                    }
                }
            });
        }

        return {
            maxBodyLength,
            maxFuncBodyLength,
            maxFuncExpressionBodyLength,
            maxArrowBodyLength,
            maxMethodBodyLength,
            maxCtorBodyLength,
            ignoreComments,
            ignoreParametersToFunctionRegex
        };
    }
}

const FUNC_BODY_LENGTH = 'func-body-length';
const FUNC_EXPRESSION_BODY_LENGTH = 'func-express-body-length';
const ARROW_BODY_LENGTH = 'arrow-body-length';
const METHOD_BODY_LENGTH = 'method-body-length';
const CTOR_BODY_LENGTH = 'ctor-body-length';
const IGNORE_PARAMETERS_TO_FUNCTION = 'ignore-parameters-to-function-regex';
const IGNORE_COMMENTS = 'ignore-comments';

function walk(ctx: Lint.WalkContext<Options>) {
    const {
        maxBodyLength,
        maxFuncBodyLength,
        maxFuncExpressionBodyLength,
        maxArrowBodyLength,
        maxMethodBodyLength,
        maxCtorBodyLength,
        ignoreComments,
        ignoreParametersToFunctionRegex
    } = ctx.options;

    const ignoreNodes: ts.Node[] = [];
    let currentClassName: string | undefined;

    function calcBodyLength(node: ts.FunctionLikeDeclaration) {
        if (node.body === undefined) {
            return 0;
        }
        const sourceFile: ts.SourceFile = ctx.sourceFile;
        const startLine: number = sourceFile.getLineAndCharacterOfPosition(node.body.pos).line;
        const endLine: number = sourceFile.getLineAndCharacterOfPosition(node.body.end).line;
        return endLine - startLine + 1;
    }

    function calcBodyCommentLength(node: ts.FunctionLikeDeclaration) {
        let commentLineCount = 0;

        commentLineCount += node
            .getFullText()
            .split(/\n/)
            .filter(line => {
                return line.trim().match(/^\/\//) !== null;
            }).length;

        tsutils.forEachTokenWithTrivia(node, (text, tokenSyntaxKind) => {
            if (tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                commentLineCount += text.split(/\n/).length;
            }
        });

        return commentLineCount;
    }

    function isFunctionTooLong(nodeKind: ts.SyntaxKind, length: number): boolean {
        return length > getMaxLength(nodeKind);
    }

    function getMaxLength(nodeKind: ts.SyntaxKind) {
        let result: number;
        switch (nodeKind) {
            case ts.SyntaxKind.FunctionDeclaration:
                result = maxFuncBodyLength;
                break;
            case ts.SyntaxKind.FunctionExpression:
                result = maxFuncExpressionBodyLength;
                break;
            case ts.SyntaxKind.MethodDeclaration:
                result = maxMethodBodyLength;
                break;
            case ts.SyntaxKind.ArrowFunction:
                result = maxArrowBodyLength;
                break;
            case ts.SyntaxKind.Constructor:
                result = maxCtorBodyLength;
                break;
            default:
                throw new Error(`Unsupported node kind: ${nodeKind}`);
        }

        return result || maxBodyLength;
    }

    function addFuncBodyTooLongFailure(node: ts.FunctionLikeDeclaration, length: number) {
        ctx.addFailureAt(node.getStart(), node.getWidth(), formatFailureText(node, length));
    }

    function formatFailureText(node: ts.FunctionLikeDeclaration, length: number) {
        const funcTypeText: string = getFuncTypeText(node.kind);
        const maxLength: number = getMaxLength(node.kind);
        const placeText: string = formatPlaceText(node);
        return `Max ${funcTypeText} body length exceeded${placeText} - max: ${maxLength}, actual: ${length}`;
    }

    function formatPlaceText(node: ts.FunctionLikeDeclaration) {
        const funcTypeText = getFuncTypeText(node.kind);
        if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) {
            return ` in ${funcTypeText} ${node.name ? node.name.getText() : ''}()`;
        } else if (node.kind === ts.SyntaxKind.Constructor) {
            return ` in class ${currentClassName}`;
        }
        return '';
    }

    function getFuncTypeText(nodeKind: ts.SyntaxKind) {
        switch (nodeKind) {
            case ts.SyntaxKind.FunctionDeclaration:
                return 'function';
            case ts.SyntaxKind.FunctionExpression:
                return 'function expression';
            case ts.SyntaxKind.MethodDeclaration:
                return 'method';
            case ts.SyntaxKind.ArrowFunction:
                return 'arrow function';
            case ts.SyntaxKind.Constructor:
                return 'constructor';
            default:
                throw new Error(`Unsupported node kind: ${nodeKind}`);
        }
    }

    function validate(node: ts.FunctionLikeDeclaration): void {
        if (!Utils.contains(ignoreNodes, node)) {
            let bodyLength = calcBodyLength(node);
            if (ignoreComments) {
                bodyLength -= calcBodyCommentLength(node);
            }
            if (isFunctionTooLong(node.kind, bodyLength)) {
                addFuncBodyTooLongFailure(node, bodyLength);
            }
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            const functionName = AstUtils.getFunctionName(node);
            if (ignoreParametersToFunctionRegex && ignoreParametersToFunctionRegex.test(functionName)) {
                // temporarily store a list of ignored references
                node.arguments.forEach(
                    (argument: ts.Expression): void => {
                        ignoreNodes.push(argument);
                    }
                );
            }
        }

        if (
            tsutils.isArrowFunction(node) ||
            tsutils.isMethodDeclaration(node) ||
            tsutils.isFunctionDeclaration(node) ||
            tsutils.isFunctionExpression(node) ||
            tsutils.isConstructorDeclaration(node)
        ) {
            validate(node);
        }

        if (tsutils.isClassDeclaration(node)) {
            currentClassName = (node.name && node.name.text) || 'default';
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
