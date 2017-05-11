import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-regex-spaces rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-regex-spaces',
        type: 'maintainability',
        description: 'Do not use multiple spaces in a regular expression literal. Similar to the ESLint no-regex-spaces rule',
        options: null,
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
        return this.applyWithWalker(new NoRegexSpacesRuleWalker(sourceFile, this.getOptions()));
    }

}

class NoRegexSpacesRuleWalker extends ErrorTolerantWalker {
    protected visitRegularExpressionLiteral(node: ts.Node): void {
        const match: RegExpExecArray = /( {2,})+?/.exec(node.getText());
        if (match != null) {
            const replacement: string = '{' + match[0].length + '}';
            this.addFailureAt(node.getStart(), node.getWidth(), Rule.FAILURE_STRING + replacement);
        }

        super.visitRegularExpressionLiteral(node);
    }

}
