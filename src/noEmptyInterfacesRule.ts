import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-empty-interfaces',
        type: 'maintainability',
        description: 'Do not use empty interfaces.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false',
        commonWeaknessEnumeration: '398, 710'
    };

    public static FAILURE_STRING: string = 'Do not declare empty interfaces: ';

    private static isWarningShown: boolean = false;

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (Rule.isWarningShown === false) {
            console.warn('Warning: no-empty-interfaces rule is deprecated. Replace your usage with the TSLint no-empty-interface rule.');
            Rule.isWarningShown = true;
        }
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isInterfaceDeclaration(node) && isInterfaceEmpty(node) && !hasMultipleParents(node)) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + "'" + node.name.getText() + "'");
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function isInterfaceEmpty(node: ts.InterfaceDeclaration): boolean {
        return node.members === undefined || node.members.length === 0;
    }

    function hasMultipleParents(node: ts.InterfaceDeclaration): boolean {
        if (node.heritageClauses === undefined || node.heritageClauses.length === 0) {
            return false;
        }

        return node.heritageClauses[0].types.length >= 2;
    }
}
