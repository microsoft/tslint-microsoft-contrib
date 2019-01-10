import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-document-domain',
        type: 'maintainability',
        description:
            'Do not write to document.domain. Scripts setting document.domain to any value should be ' +
            'validated to ensure that the value is on a list of allowed sites.',
        options: null, // tslint:disable-line:no-null-keyword
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
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (
            tsutils.isBinaryExpression(node) &&
            node.operatorToken.getText() === '=' &&
            tsutils.isPropertyAccessExpression(node.left) &&
            isDocumentDomainProperty(<ts.PropertyAccessExpression>node.left)
        ) {
            const msg: string = Rule.FAILURE_STRING + node.getFullText().trim();
            ctx.addFailureAt(node.getStart(), node.getWidth(), msg);
        }
        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function isDocumentDomainProperty(node: ts.PropertyAccessExpression): boolean {
        if (node.name.text !== 'domain') {
            return false;
        }
        return node.expression.getText() === 'document' || node.expression.getText() === 'window.document';
    }
}
