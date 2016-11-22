import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Avoid typeof x === \'undefined\' comparisons. Prefer x == undefined or x === undefined: ';

/**
 * Implementation of the no-typeof-undefined rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-typeof-undefined',
        type: 'maintainability',
        description: 'Do not use the idiom typeof `x === \'undefined\'`. You can safely use the simpler x === undefined ' +
                    'or perhaps x == null if you want to check for either null or undefined.',
        options: null,
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoTypeofUndefinedRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoTypeofUndefinedRuleWalker extends ErrorTolerantWalker {

    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if ((this.isUndefinedString(node.left) && this.isTypeOfExpression(node.right))
            || this.isUndefinedString(node.right) && this.isTypeOfExpression(node.left)) {

            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText()));
        }
        super.visitBinaryExpression(node);
    }

    private isTypeOfExpression(node: ts.Node): boolean {
        return node.kind === SyntaxKind.current().TypeOfExpression;
    }

    private isUndefinedString(node: ts.Node): boolean {
        if (node.kind === SyntaxKind.current().StringLiteral) {
            if ((<ts.StringLiteral>node).text === 'undefined') {
                return true;
            }
        }
        return false;
    }
}
