import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');
import Utils = require('./utils/Utils');

/**
 * Implementation of the valid-typeof rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = 'Invalid comparison in typeof. Did you mean ';

    public static VALID_TERMS = [ 'undefined', 'object', 'boolean', 'number', 'string', 'function' ];

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
            let start: number = node.getStart();
            let width: number = node.getWidth();
            this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING + this.getClosestTerm(node.text) + '?'));
        }
    }

    private getClosestTerm(term: string): string {
        var closestMatch: number = 99999999;
        return Utils.reduce(Rule.VALID_TERMS, (closestTerm: string, thisTerm: string) : string => {
            var distance = this.hammingDistance(term, thisTerm);
            if (distance < closestMatch) {
                closestMatch = distance;
                closestTerm = thisTerm;
            }
            return closestTerm;
        }, '');
    }

    /**
     * Calculates the Hamming distance between two strings. Easier to implement than Levenstein distance.
     */
    private hammingDistance(source: string, target: string): number {
        if (source.length === 0) {
            return target.length;
        }
        if (target.length === 0) {
            return source.length;
        }

        return Math.min(
                this.hammingDistance(source.substr(1), target) + 1,
                this.hammingDistance(target.substr(1), source) + 1,
                this. hammingDistance(source.substr(1), target.substr(1)) + (source[0] !== target[0] ? 1 : 0)
            ) + 1;
    }
}
