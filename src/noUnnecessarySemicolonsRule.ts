import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING: string = 'unnecessary semi-colon';

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unnecessary-semicolons',
        type: 'maintainability',
        description: 'Remove unnecessary semicolons',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Whitespace',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isEmptyStatement(node)) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }

        if (tsutils.isForStatement(node)) {
            if (tsutils.isEmptyStatement(node.statement)) {
                const expression: ts.Expression | ts.VariableDeclarationList | undefined =
                    node.initializer || node.condition || node.incrementor;
                if (expression) {
                    return ts.forEachChild(expression, cb);
                }
            }
        }

        if (tsutils.isWhileStatement(node)) {
            if (tsutils.isEmptyStatement(node.statement)) {
                return ts.forEachChild(node.expression, cb);
            }
        }
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
