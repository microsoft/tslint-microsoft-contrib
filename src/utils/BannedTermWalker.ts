import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { isNamed } from './TypeGuard';

export interface BannedTermOptions {
    readonly failureString: string;
    readonly bannedTerms: string[];
    allowQuotedProperties: boolean;
}

export function bannedTermWalker(ctx: Lint.WalkContext<BannedTermOptions>) {
    const { failureString, bannedTerms, allowQuotedProperties } = ctx.options;

    function isBannedTerm(text: string): boolean {
        return bannedTerms.indexOf(text) !== -1;
    }

    function validateNode(node: ts.Node): void {
        if (isNamed(node)) {
            const text: string = node.name.getText();
            if (text !== undefined) {
                if (isBannedTerm(text)) {
                    ctx.addFailureAt(node.getStart(), node.getWidth(), failureString + text);
                }
            }
        }
    }

    function cb(node: ts.Node): void {
        if (
            tsutils.isVariableDeclaration(node) ||
            tsutils.isFunctionDeclaration(node) ||
            tsutils.isPropertyDeclaration(node) ||
            tsutils.isAccessorDeclaration(node) ||
            tsutils.isMethodDeclaration(node)
        ) {
            validateNode(node);
        }

        if (tsutils.isParameterDeclaration(node)) {
            // typescript 2.0 introduces function level 'this' types
            if (node.name.getText() !== 'this') {
                validateNode(node);
            }
        }

        if (tsutils.isPropertySignature(node)) {
            // ignore StringLiteral property names if that option is set
            if (allowQuotedProperties === false || !tsutils.isStringLiteral(node.name)) {
                validateNode(node);
            }
        }

        return ts.forEachChild(node, cb);
    }
    return ts.forEachChild(ctx.sourceFile, cb);
}
