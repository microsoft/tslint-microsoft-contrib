import * as ts from 'typescript';
import * as Lint from 'tslint';

import { isNoSubstitutionTemplateLiteral } from 'tsutils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-multiline-string',
        type: 'maintainability',
        description: 'Do not declare multiline strings',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        recommendation: 'false',
        commonWeaknessEnumeration: '710'
    };

    public static FAILURE_STRING: string = 'Forbidden Multiline string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (isNoSubstitutionTemplateLiteral(node)) {
            const fullText: string = node.getFullText();
            const firstLine: string = fullText.substring(0, fullText.indexOf('\n'));
            const trimmed: string = firstLine.substring(0, 40).trim();
            ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + trimmed + '...');
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
