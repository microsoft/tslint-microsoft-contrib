import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');
import Utils = require('./utils/Utils');

/**
 * Implementation of the valid-typeof rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Invalid comparison in typeof. Did you mean ';

    public static VALID_TERMS = [ 'undefined', 'object', 'boolean', 'number', 'string', 'function', 'symbol' ];

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ValidTypeofRuleWalker(sourceFile, this.getOptions()));
    }

}

class ValidTypeofRuleWalker extends ErrorTolerantWalker {
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if (node.left.kind === SyntaxKind.current().TypeOfExpression && node.right.kind === SyntaxKind.current().StringLiteral) {
            this.validateTypeOf(<ts.StringLiteral>node.right);
        } else if (node.right.kind === SyntaxKind.current().TypeOfExpression && node.left.kind === SyntaxKind.current().StringLiteral) {
            this.validateTypeOf(<ts.StringLiteral>node.left);
        }
        super.visitBinaryExpression(node);
    }

    private validateTypeOf(node: ts.StringLiteral): void {
        if (Rule.VALID_TERMS.indexOf(node.text) === -1) {
            const start: number = node.getStart();
            const width: number = node.getWidth();
            this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING + this.getClosestTerm(node.text) + '?'));
        }
    }

    private getClosestTerm(term: string): string {
        let closestMatch: number = 99999999;
        return Utils.reduce(Rule.VALID_TERMS, (closestTerm: string, thisTerm: string) : string => {
            let distance = this.levenshteinDistance(term, thisTerm);
            if (distance < closestMatch) {
                closestMatch = distance;
                closestTerm = thisTerm;
            }
            return closestTerm;
        }, '');
    }

    /**
     Copyright (c) 2011 Andrei Mackenzie
     Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
     associated documentation files (the "Software"), to deal in the Software without restriction,
     including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
     and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
     subject to the following conditions:
     The above copyright notice and this permission notice shall be included in all copies or substantial
     portions of the Software.
     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
     LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
     IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
     WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     */
    /**
     * Inspired from: https://gist.github.com/andrei-m/982927
     */
    /* tslint:disable:no-increment-decrement */
    private levenshteinDistance(a: string, b: string): number {
        if (a.length === 0) {
            return b.length;
        }
        if (b.length === 0) {
            return a.length;
        }

        const matrix = [];

        // increment first column
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        // increment first row
        for (let i = 0; i <= a.length; i++) {
            matrix[0][i] = i;
        }

        // populate matrix
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    const substitutionValue: number = matrix[i - 1][j - 1] + 1;
                    const insertionValue: number = matrix[i][j - 1] + 1;
                    const deletionDistance: number = matrix[i - 1][j] + 1;
                    const minDistance = Math.min(substitutionValue, insertionValue, deletionDistance);
                    matrix[i][j] = minDistance;
                }
            }
        }

        return matrix[b.length][a.length];
    };
    /* tslint:enable:no-increment-decrement */
}
