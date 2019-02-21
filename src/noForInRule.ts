import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-for-in',
        type: 'maintainability',
        description: 'Avoid use of for-in statements. They can be replaced by Object.keys',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING_FACTORY(initializer: string, expression: string): string {
        //tslint:disable-next-line:max-line-length
        return `Do not use the 'for in' statement: 'for (${initializer} in ${expression})'. If this is an object, use 'Object.keys' instead. If this is an array use a standard 'for' loop instead.`;
    }

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isForInStatement(node)) {
            const initializer: string = node.initializer.getText();
            const expression: string = node.expression.getText();

            const msg: string = Rule.FAILURE_STRING_FACTORY(initializer, expression);
            ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
