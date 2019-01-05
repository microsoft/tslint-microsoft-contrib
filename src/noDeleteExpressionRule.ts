import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

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
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isExpressionStatement(node)) {
            if (tsutils.isDeleteExpression(node.expression)) {
                // first child is delete keyword, second one is what is being deleted.
                const deletedObject: ts.Node = node.expression.getChildren()[1];
                if (deletedObject && tsutils.isIdentifier(deletedObject)) {
                    addNoDeleteFailure(deletedObject);
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function addNoDeleteFailure(deletedObject: ts.Node): void {
        const msg: string = Rule.FAILURE_STRING + deletedObject.getFullText().trim();
        ctx.addFailureAt(deletedObject.getStart(), deletedObject.getWidth(), msg);
    }
}
