import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = "Avoid typeof x === 'undefined' comparisons. Prefer x == undefined or x === undefined: ";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-typeof-undefined',
        type: 'maintainability',
        description:
            "Do not use the idiom typeof `x === 'undefined'`. You can safely use the simpler x === undefined " +
            'or perhaps x == null if you want to check for either null or undefined.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function isTypeOfExpression(node: ts.Node): boolean {
        return node.kind === ts.SyntaxKind.TypeOfExpression;
    }

    function isUndefinedString(node: ts.Node): boolean {
        if (tsutils.isStringLiteral(node)) {
            if (node.text === 'undefined') {
                return true;
            }
        }
        return false;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isBinaryExpression(node)) {
            if (
                (isUndefinedString(node.left) && isTypeOfExpression(node.right)) ||
                (isUndefinedString(node.right) && isTypeOfExpression(node.left))
            ) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText());
            }
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
