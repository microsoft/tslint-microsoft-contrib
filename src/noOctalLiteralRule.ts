import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-octal-literal rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-octal-literal',
        type: 'maintainability',
        description: 'Do not use octal literals or escaped octal sequences',
        options: undefined,
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
        const noOctalLiteral = new NoOctalLiteral(sourceFile, this.getOptions());
        return this.applyWithWalker(noOctalLiteral);
    }
}

class NoOctalLiteral extends ErrorTolerantWalker {
    public visitNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.StringLiteral || node.kind === ts.SyntaxKind.FirstTemplateToken) {
            this.failOnOctalString(<ts.LiteralExpression>node);
        }
        super.visitNode(node);
    }

    private failOnOctalString(node: ts.LiteralExpression) {
        const match = /("|'|`)[^\\]*(\\+-?[0-7]{1,3}(?![0-9]))(?:.|\n|\t|\u2028|\u2029)*(?:\1)/g.exec(node.getText());

        if (match) {
            let octalValue: string = match[2]; // match[2] is the matched octal value.
            const backslashCount: number = octalValue.lastIndexOf('\\') + 1;
            if (backslashCount % 2 === 1) { // Make sure the string starts with an odd number of backslashes
                octalValue = octalValue.substr(backslashCount - 1);

                const startOfMatch = node.getStart() + node.getText().indexOf(octalValue);
                const width = octalValue.length;

                this.addFailureAt(startOfMatch, width, Rule.FAILURE_STRING + octalValue);
            }
        }
    }
}
