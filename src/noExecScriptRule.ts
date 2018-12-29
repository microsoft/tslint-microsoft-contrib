import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

import { AstUtils } from './utils/AstUtils';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-exec-script',
        type: 'maintainability',
        description: 'Do not use the execScript functions',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '95, 676'
    };

    public static FAILURE_STRING: string = 'forbidden execScript: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isCallExpression(node)) {
            const expression: ts.Expression = node.expression;
            const functionName: string = AstUtils.getFunctionName(node);
            if (functionName === 'execScript') {
                const msg: string = Rule.FAILURE_STRING + expression.getFullText().trim();
                ctx.addFailureAt(expression.getStart(), expression.getWidth(), msg);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
