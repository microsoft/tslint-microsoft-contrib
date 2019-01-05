import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-multiple-var-decl',
        type: 'maintainability',
        description: "Deprecated - This rule is now part of the base TSLint product as the rule named 'one-variable-per-declaration'",
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false, // use tslint one-variable-per-declaration rule instead',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING: string = 'Do not use comma separated variable declarations: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isVariableStatement(node)) {
            const declarations: ts.NodeArray<ts.VariableDeclaration> = node.declarationList.declarations;
            if (declarations.length > 1) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + declarations[0].getText() + ',');
            }
        }

        ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
