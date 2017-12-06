import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-document-domain rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-document-domain',
        type: 'maintainability',
        description: 'Do not write to document.domain. Scripts setting document.domain to any value should be ' +
                    'validated to ensure that the value is on a list of allowed sites.',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security'
    };

    public static FAILURE_STRING: string = 'Forbidden write to document.domain: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDocumentDomainRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoDocumentDomainRuleWalker extends ErrorTolerantWalker {
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        if (node.operatorToken.getText() === '='
            && node.left.kind === ts.SyntaxKind.PropertyAccessExpression
            && this.isDocumentDomainProperty(<ts.PropertyAccessExpression>node.left)) {
            const msg: string = Rule.FAILURE_STRING + node.getFullText().trim();
            this.addFailureAt(node.getStart(), node.getWidth(), msg);
        }
        super.visitBinaryExpression(node);
    }

    private isDocumentDomainProperty(node: ts.PropertyAccessExpression): boolean {
        if (node.name.text !== 'domain') {
            return false;
        }
        return node.expression.getText() === 'document'
            || node.expression.getText() === 'window.document';

    }
}
