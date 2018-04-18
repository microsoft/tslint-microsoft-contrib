import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-document-write rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-document-write',
        // tslint:disable-next-line:no-reserved-keywords
        type: 'maintainability',
        description: 'Do not use document.write',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '79, 85'
    };

    public static WRITE_FAILURE: string = 'Forbidden call to document.write';
    public static WRITELN_FAILURE: string = 'Forbidden call to document.writeln';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoDocumentWriteWalker(sourceFile, this.getOptions()));
    }
}

class NoDocumentWriteWalker extends ErrorTolerantWalker {

    protected visitCallExpression(node: ts.CallExpression) {

        const functionTarget: string = AstUtils.getFunctionTarget(node);
        if (functionTarget === 'document' || functionTarget === 'window.document') {
            if (node.arguments.length === 1) {
                const functionName: string = AstUtils.getFunctionName(node);
                if (functionName === 'write') {
                    this.addFailureAt(node.getStart(), node.getWidth(), Rule.WRITE_FAILURE);
                } else if (functionName === 'writeln') {
                    this.addFailureAt(node.getStart(), node.getWidth(), Rule.WRITELN_FAILURE);
                }
            }
        }

        super.visitCallExpression(node);
    }
}
