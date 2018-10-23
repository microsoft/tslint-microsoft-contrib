import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-delete-expression',
        type: 'maintainability',
        description: 'Do not delete expressions. Only properties should be deleted',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security'
    };

    public static FAILURE_STRING: string = 'Variables should not be deleted: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        const noDeleteExpression = new NoDeleteExpression(sourceFile, this.getOptions());
        return this.applyWithWalker(noDeleteExpression);
    }
}

class NoDeleteExpression extends ErrorTolerantWalker {

    public visitExpressionStatement(node: ts.ExpressionStatement) {
        super.visitExpressionStatement(node);
        if (node.expression.kind === ts.SyntaxKind.DeleteExpression) {
            // first child is delete keyword, second one is what is being deleted.
            const deletedObject: ts.Node = node.expression.getChildren()[1];
            if (deletedObject !== undefined && deletedObject.kind === ts.SyntaxKind.Identifier) {
                this.addNoDeleteFailure(deletedObject);
            }
        }
    }

    public addNoDeleteFailure(deletedObject: ts.Node): void {
        const msg: string = Rule.FAILURE_STRING + deletedObject.getFullText().trim();
        this.addFailureAt(deletedObject.getStart(), deletedObject.getWidth(), msg);
    }

}
