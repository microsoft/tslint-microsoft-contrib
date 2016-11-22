import * as ts from 'typescript';
import * as Lint from 'tslint';

import {SyntaxKind} from './utils/SyntaxKind';
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
        optionsDescription: "",
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        recommendation: '[true, "http://www.example.com/?.*", "http://www.examples.com/?.*"],',
        commonWeaknessEnumeration: '319'
    };

    public static FAILURE_STRING = 'Forbidden http url in string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoHttpStringWalker(sourceFile, this.getOptions()));
    }

}

class NoHttpStringWalker extends ErrorTolerantWalker {
    protected visitNode(node: ts.Node): void {
        if (node.kind === SyntaxKind.current().StringLiteral) {
            const stringText : string = (<ts.LiteralExpression>node).text;
            if (/.*http:.*/.test(stringText)) {
                if (!this.isSuppressed(stringText)) {
                    const failureString = Rule.FAILURE_STRING + '\'' + stringText + '\'';
                    const failure = this.createFailure(node.getStart(), node.getWidth(), failureString);
                    this.addFailure(failure);
                }
            }
        }
        super.visitNode(node);
    }

    private isSuppressed(stringText: string) : boolean {
        const allExceptions : string[] = NoHttpStringWalker.getExceptions(this.getOptions());
        return Utils.exists(allExceptions, (exception: string) : boolean => {
            return new RegExp(exception).test(stringText);
        });
    }

    private static getExceptions(options : Lint.IOptions) : string[] {
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return <string[]><any>options; // MSE version of tslint somehow requires this
        }
        return null;
    }
}
