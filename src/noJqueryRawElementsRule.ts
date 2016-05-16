import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

const FAILURE_STRING: string = 'HTML string manipulation is a security risk; use jQuery instead';

/**
 * Implementation of the no-jquery-raw-elements rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoJqueryRawElementsRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoJqueryRawElementsRuleWalker extends Lint.RuleWalker {
    protected visitCallExpression(node): void {
        const expressionText: string = node.expression.getText();

        if (expressionText !== "$" && expressionText.toLowerCase() !== "jquery") {
            return;
        }

        const argument = node.arguments[0].getText();

        if (this.argumentContainsAttribute(argument.trim())) {
            this.addFailure(
                this.createFailure(
                    node.getStart(),
                    node.getWidth(),
                    FAILURE_STRING));
        }

        super.visitCallExpression(node);
    }

    private argumentContainsAttribute(argument: string): boolean {
        // Case: "input"
        if (argument.indexOf(`"<`) === -1) {
            return false;
        }

        // Case: "<input readonly='true' />"
        if (argument.indexOf("=") !== -1) {
            return true;
        }

        const spaceIndex: number = argument.indexOf(" ");

        // Case: "<input/>"
        // Case: "<input/>"
        if (spaceIndex === -1) {
            return false;
        }

        // Case: "<input />"
        if (argument.substring(spaceIndex).trim() === "/>\"") {
            return false;
        }

        // Case: "<input readonly />"
        // Case: "<input readonly>"
        return true;
    }
}
