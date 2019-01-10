import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-regex-spaces',
        type: 'maintainability',
        description: 'Do not use multiple spaces in a regular expression literal. Similar to the ESLint no-regex-spaces rule',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public static FAILURE_STRING: string = 'Spaces in regular expressions are hard to count. Use ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isRegularExpressionLiteral(node)) {
            const match = /( {2,})+?/.exec(node.getText());
            if (match !== null) {
                const replacement: string = '{' + match[0].length + '}';
                ctx.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + replacement);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
