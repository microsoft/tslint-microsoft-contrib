import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-with-statement',
        type: 'maintainability',
        description: 'Do not use with statements. Assign the item to a new variable instead',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Forbidden with statement';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.WithStatement) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING);
        }
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
