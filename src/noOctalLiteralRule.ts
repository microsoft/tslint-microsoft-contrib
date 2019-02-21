import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-octal-literal',
        type: 'maintainability',
        description: 'Do not use octal literals or escaped octal sequences',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security'
    };

    public static FAILURE_STRING: string = 'Octal literals should not be used: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isStringLiteral(node) || node.kind === ts.SyntaxKind.FirstTemplateToken) {
            failOnOctalString(<ts.LiteralExpression>node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function failOnOctalString(node: ts.LiteralExpression) {
        const match = /("|'|`)[^\\]*(\\+-?[0-7]{1,3}(?![0-9]))(?:.|\n|\t|\u2028|\u2029)*(?:\1)/g.exec(node.getText());

        if (match) {
            let octalValue: string = match[2]; // match[2] is the matched octal value.
            const backslashCount: number = octalValue.lastIndexOf('\\') + 1;
            if (backslashCount % 2 === 1) {
                // Make sure the string starts with an odd number of backslashes
                octalValue = octalValue.substr(backslashCount - 1);

                const startOfMatch = node.getStart() + node.getText().indexOf(octalValue);
                const width = octalValue.length;

                ctx.addFailureAt(startOfMatch, width, Rule.FAILURE_STRING + octalValue);
            }
        }
    }
}
