import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {Utils} from './utils/Utils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-http-string rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-http-string',
        type: 'maintainability',
        /* tslint:disable:no-http-string */
        description: 'Do not use strings that start with \'http:\'. URL strings should start with \'https:\'. ',
        /* tslint:enable:no-http-string */
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        recommendation: '[true, "http://www.example.com/?.*", "http://localhost:?.*"],',
        commonWeaknessEnumeration: '319'
    };

    public static FAILURE_STRING: string = 'Forbidden http url in string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoHttpStringWalker(sourceFile, this.getOptions()));
    }

}

class NoHttpStringWalker extends ErrorTolerantWalker {
    protected visitStringLiteral(node: ts.StringLiteral): void {
        this.visitLiteralExpression(node);
        super.visitStringLiteral(node);
    }

    protected visitNode(node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
            this.visitLiteralExpression(<ts.NoSubstitutionTemplateLiteral>node);
        } else if (node.kind === ts.SyntaxKind.TemplateHead) {
            this.visitLiteralExpression(<ts.TemplateHead>node);
        }
        super.visitNode(node);
    }

    private visitLiteralExpression(node: ts.LiteralExpression | ts.LiteralLikeNode): void {
        const stringText: string = node.text;
        // tslint:disable-next-line no-http-string
        if (stringText.indexOf('http:') === 0) {
            if (!this.isSuppressed(stringText)) {
                const failureString = Rule.FAILURE_STRING + '\'' + stringText + '\'';
                this.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }
    }

    private isSuppressed(stringText: string): boolean {
        const allExceptions = NoHttpStringWalker.getExceptions(this.getOptions());
        return Utils.exists(allExceptions, (exception: string): boolean => {
            return new RegExp(exception).test(stringText);
        });
    }

    private static getExceptions(options: Lint.IOptions): string[] | null {
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return <string[]><any>options; // MSE version of tslint somehow requires this
        }
        return null;
    }
}
