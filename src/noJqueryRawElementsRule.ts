import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import {AstUtils} from './utils/AstUtils';
import {SyntaxKind} from './utils/SyntaxKind';

const FAILURE_STRING: string = 'Replace HTML string manipulation with jQuery API: ';

/**
 * Implementation of the no-jquery-raw-elements rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoJqueryRawElementsRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoJqueryRawElementsRuleWalker extends Lint.RuleWalker {
    protected visitCallExpression(node: ts.CallExpression): void {

        const functionName: string = AstUtils.getFunctionName(node);
        if (AstUtils.isJQuery(functionName) && node.arguments.length > 0) {
            const firstArg: ts.Expression = node.arguments[0];
            if (firstArg.kind !== SyntaxKind.current().StringLiteral) {
                const finder = new HtmlLikeStringLiteralFinder(this.getSourceFile(), this.getOptions());
                finder.walk(node.arguments[0]);
                if (finder.isFound()) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING + node.getText()));
                }
            }
        }
        super.visitCallExpression(node);
    }
}

class HtmlLikeStringLiteralFinder extends Lint.RuleWalker {

    private found: boolean = false;

    public isFound(): boolean {
        return this.found;
    }

    protected visitStringLiteral(node: ts.StringLiteral): void {
        if (node.text.indexOf('<') > -1 || node.text.indexOf('>') > -1) {
            this.found = true;
        } else {
            super.visitStringLiteral(node);
        }
    }
}
