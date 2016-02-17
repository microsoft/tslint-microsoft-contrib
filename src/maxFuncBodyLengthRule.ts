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

const FUNC_LENGTH_OPTION = 'func-body-length';
const ARROW_BODY_LENGTH = 'arrow-body-length';
const METHOD_BODY_LENGTH = 'method-body-length';

class MaxFunctionBodyLengthRuleWalker extends Lint.RuleWalker {

    private static NON_EMPTY: RegExp = /^\s*\S/gm;

    private enabled: boolean;
    private maxBodyLength: number;
    private maxFuncBodyLength: number;
    private maxArrowBodyLength: number;
    private maxMethodBodyLength: number;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);

        let opts: any[] = this.getOptions();
        this.parseOptions(opts);
    }

    public visitNode(node: ts.Node) {
        if (!node) {
            return;
        }

        if (!this.enabled) {
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

    private parseOptions (opts: any) {
        let firstOpt = opts && opts.length > 0 ? opts[0] : null;
        if (!firstOpt) {
            this.enabled = false;
            return;
        }

        this.enabled = true;

        opts.slice(1).forEach((opt: any) => {

            if (typeof(opt) === 'number') {
                this.maxBodyLength = opt;
                return;
            }

            let [ optName, val ] = opt;
            switch (optName) {
                case FUNC_LENGTH_OPTION:
                this.maxFuncBodyLength = val;
                break;
                case ARROW_BODY_LENGTH:
                this.maxArrowBodyLength = val;
                break;
                case METHOD_BODY_LENGTH:
                this.maxMethodBodyLength = val;
                break;
            }
        });
    }

    private addFuncBodyTooLongFailure(node: ts.Node, length: number) {
        let failure = this.createFailure(node.pos, node.end, this.formatFailureText(node.kind, length));
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
