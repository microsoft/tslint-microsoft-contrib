//// <reference path='../../typings/node/node.d.ts'/>

import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

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

class MaxFunctionBodyLengthRuleWalker extends Lint.RuleWalker {

    private static NON_EMPTY: RegExp = /^\s*\S/gm;

    private maxBodyLength: number;
    private maxFuncBodyLength: number;
    private maxArrowBodyLength: number;
    private maxMethodBodyLength: number;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        this.parseOptions();
    }

    public visitNode(node: ts.Node) {
        if (!node) {
            return;
        }

        let kind = node.kind;
        if (kind === ts.SyntaxKind.FunctionDeclaration ||
            kind === ts.SyntaxKind.MethodDeclaration ||
            kind === ts.SyntaxKind.ArrowFunction) {

                let bodyLength = this.calcBodyLength(node);
                if (this.isFunctionTooLong(kind, bodyLength)) {
                    this.addFuncBodyTooLongFailure(node, bodyLength);
                }
        }

        super.visitNode(node);
    }

    private calcBodyLength (node: ts.Node) {
        let sourceFileText = this.getSourceFile().text;
        let funPart = sourceFileText.slice(node.pos, node.end);
        let nonEmptyLinesCount = (funPart.match(MaxFunctionBodyLengthRuleWalker.NON_EMPTY) || []).length;
        return nonEmptyLinesCount;
    }

    private isFunctionTooLong (nodeKind: ts.SyntaxKind, length: number): boolean {
        return length > this.getMaxLength(nodeKind);
    }

    private parseOptions () {
        this.getOptions()
        .forEach((opt: any) => {

            if (typeof(opt) === 'number') {
                this.maxBodyLength = opt;
                return;
            }

            if (typeof(opt) === 'object') {
                this.maxFuncBodyLength = opt[FUNC_BODY_LENGTH];
                this.maxArrowBodyLength = opt[ARROW_BODY_LENGTH];
                this.maxMethodBodyLength = opt[METHOD_BODY_LENGTH];
            }

        });
    }

    private addFuncBodyTooLongFailure(node: ts.Node, length: number) {
        let failure = this.createFailure(node.getStart(), node.getWidth(), this.formatFailureText(node.kind, length));
        this.addFailure(failure);
    }

    private formatFailureText (nodeKind: ts.SyntaxKind, length: number) {
        let funcTypeText: string = this.getFuncTypeText(nodeKind);
        let maxLength: number = this.getMaxLength(nodeKind);

        return `Max ${ funcTypeText } body length exceeded - max: ${ maxLength }, actual: ${ length }`;
    }

    private getFuncTypeText (nodeKind: ts.SyntaxKind) {
        if (nodeKind === ts.SyntaxKind.FunctionDeclaration) {
            return 'function';
        } else if (nodeKind === ts.SyntaxKind.MethodDeclaration) {
            return 'method';
        } else if (nodeKind === ts.SyntaxKind.ArrowFunction) {
            return 'arrow function';
        } else {
            throw new Error(`Unsupported node kind: ${ nodeKind }`);
        }
    }

    private getMaxLength (nodeKind: ts.SyntaxKind) {
        let result: number;

        if (nodeKind === ts.SyntaxKind.FunctionDeclaration) {
            result = this.maxFuncBodyLength;
        } else if (nodeKind === ts.SyntaxKind.MethodDeclaration) {
            result = this.maxMethodBodyLength;
        } else if (nodeKind === ts.SyntaxKind.ArrowFunction) {
            result = this.maxArrowBodyLength;
        } else {
            throw new Error(`Unsupported node kind: ${ nodeKind }`);
        }

        return result || this.maxBodyLength;
    }
}
