import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import SyntaxKind = require('./utils/SyntaxKind');
import AstUtils = require('./utils/AstUtils');
import Utils = require('./utils/Utils');

/**
 * Implementation of the max-func-body-length rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new MaxFunctionBodyLengthRuleWalker(sourceFile, this.getOptions()));
    }
}

const FUNC_BODY_LENGTH = 'func-body-length';
const ARROW_BODY_LENGTH = 'arrow-body-length';
const METHOD_BODY_LENGTH = 'method-body-length';
const IGNORE_PARAMETERS_TO_FUNCTION = 'ignore-parameters-to-function-regex';

class MaxFunctionBodyLengthRuleWalker extends Lint.RuleWalker {

    private maxBodyLength: number;
    private maxFuncBodyLength: number;
    private maxArrowBodyLength: number;
    private maxMethodBodyLength: number;
    private ignoreParametersToFunctionRegex: RegExp;
    private ignoreNodes: ts.Node[] = [];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.parseOptions();
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        let functionName = AstUtils.getFunctionName(node);
        if (this.ignoreParametersToFunctionRegex && this.ignoreParametersToFunctionRegex.test(functionName)) {
            // temporarily store a list of ignored references
            node.arguments.forEach((argument: ts.Expression): void => {
                this.ignoreNodes.push(argument);
            });
            super.visitCallExpression(node);
            // clear the list of ignored references
            this.ignoreNodes = Utils.removeAll(this.ignoreNodes, node.arguments);
        } else {
            super.visitCallExpression(node);
        }
    }

    protected visitArrowFunction(node: ts.FunctionLikeDeclaration): void {
        this.validate(node);
        super.visitArrowFunction(node);
    }

    protected visitMethodDeclaration(node: ts.MethodDeclaration): void {
        this.validate(node);
        super.visitMethodDeclaration(node);
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): void {
        this.validate(node);
        super.visitFunctionDeclaration(node);
    }

    private validate(node: ts.FunctionLikeDeclaration): void {
        if (!Utils.contains(this.ignoreNodes, node)) {
            let bodyLength = this.calcBodyLength(node);
            if (this.isFunctionTooLong(node.kind, bodyLength)) {
                this.addFuncBodyTooLongFailure(node, bodyLength);
            }
        }
    }

    private calcBodyLength(node: ts.FunctionLikeDeclaration) {
        if (node.body == null) {
            return 0;
        }
        let sourceFile: ts.SourceFile = this.getSourceFile();
        let startLine: number = sourceFile.getLineAndCharacterOfPosition(node.body.pos).line;
        let endLine: number = sourceFile.getLineAndCharacterOfPosition(node.body.end).line;
        return endLine - startLine;
    }

    private isFunctionTooLong (nodeKind: ts.SyntaxKind, length: number): boolean {
        return length > this.getMaxLength(nodeKind);
    }

    private parseOptions () {
        this.getOptions().forEach((opt: any) => {
            if (typeof(opt) === 'number') {
                this.maxBodyLength = opt;
                return;
            }

            if (typeof(opt) === 'object') {
                this.maxFuncBodyLength = opt[FUNC_BODY_LENGTH];
                this.maxArrowBodyLength = opt[ARROW_BODY_LENGTH];
                this.maxMethodBodyLength = opt[METHOD_BODY_LENGTH];
                let regex: string = opt[IGNORE_PARAMETERS_TO_FUNCTION];
                if (regex) {
                    this.ignoreParametersToFunctionRegex = new RegExp(regex);
                }
            }
        });
    }

    private addFuncBodyTooLongFailure(node: ts.FunctionLikeDeclaration, length: number) {
        let failure = this.createFailure(node.getStart(), node.getWidth(), this.formatFailureText(node, length));
        this.addFailure(failure);
    }

    private formatFailureText (node: ts.FunctionLikeDeclaration, length: number) {
        let funcTypeText: string = this.getFuncTypeText(node.kind);
        let maxLength: number = this.getMaxLength(node.kind);

        let methodName: string = '';
        if (node.kind === SyntaxKind.current().MethodDeclaration || node.kind === SyntaxKind.current().FunctionDeclaration) {
            methodName = ' in method ' + (<any>node.name).text;
        }
        return `Max ${ funcTypeText } body length exceeded${ methodName } - max: ${ maxLength }, actual: ${ length }`;
    }

    private getFuncTypeText (nodeKind: ts.SyntaxKind) {
        if (nodeKind === SyntaxKind.current().FunctionDeclaration) {
            return 'function';
        } else if (nodeKind === SyntaxKind.current().MethodDeclaration) {
            return 'method';
        } else if (nodeKind === SyntaxKind.current().ArrowFunction) {
            return 'arrow function';
        } else {
            throw new Error(`Unsupported node kind: ${ nodeKind }`);
        }
    }

    private getMaxLength (nodeKind: ts.SyntaxKind) {
        let result: number;

        if (nodeKind === SyntaxKind.current().FunctionDeclaration) {
            result = this.maxFuncBodyLength;
        } else if (nodeKind === SyntaxKind.current().MethodDeclaration) {
            result = this.maxMethodBodyLength;
        } else if (nodeKind === SyntaxKind.current().ArrowFunction) {
            result = this.maxArrowBodyLength;
        } else {
            throw new Error(`Unsupported node kind: ${ nodeKind }`);
        }

        return result || this.maxBodyLength;
    }
}
