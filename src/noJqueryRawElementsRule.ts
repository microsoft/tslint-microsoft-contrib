import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import {AstUtils} from './utils/AstUtils';
import {SyntaxKind} from './utils/SyntaxKind';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_STRING_MANIPULATION: string = 'Replace HTML string manipulation with jQuery API: ';
const FAILURE_STRING_COMPLEX: string = 'Replace complex HTML strings with jQuery API: ';

/**
 * Implementation of the no-jquery-raw-elements rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-jquery-raw-elements',
        type: 'maintainability',
        description: 'Do not create HTML elements using JQuery and string concatenation. It is error prone and can hide subtle defects.',
        options: null,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness',
        commonWeaknessEnumeration: '398, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoJqueryRawElementsRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoJqueryRawElementsRuleWalker extends Lint.RuleWalker {
    protected visitCallExpression(node: ts.CallExpression): void {

        const functionName: string = AstUtils.getFunctionName(node);
        if (AstUtils.isJQuery(functionName) && node.arguments.length > 0) {
            const firstArg: ts.Expression = node.arguments[0];
            if (firstArg.kind === SyntaxKind.current().StringLiteral) {
                if (this.isComplexHtmlElement(<ts.StringLiteral>firstArg)) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING_COMPLEX + node.getText()));
                }
            } else {
                const finder = new HtmlLikeStringLiteralFinder(this.getSourceFile(), this.getOptions());
                finder.walk(node.arguments[0]);
                if (finder.isFound()) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_STRING_MANIPULATION + node.getText()));
                }
            }
        }
        super.visitCallExpression(node);
    }

    private isComplexHtmlElement(literal: ts.StringLiteral): boolean {
        const text: string = literal.text.trim();
        if (/^<.*>$/.test(text) === false) {
            // element does not look like an html tag
            return false;
        }

        if (/^<[A-Za-z]+\s*\/?>$/.test(text) === true) {
            // element looks like a simple self-closing tag or a simple opening tag
            return false;
        }

        if (/^<[A-Za-z]+\s*>\s*<\/[A-Za-z]+\s*>$/m.test(text) === true) {
            // element looks like a simple open and closed tag
            return false;
        }

        const match: RegExpMatchArray = text.match(/^<[A-Za-z]+\s*>(.*)<\/[A-Za-z]+\s*>$/m);
        if (match != null && match[1] != null) {
            const enclosedContent: string = match[1]; // get the stuff inside the tag
            if (enclosedContent.indexOf('<') === -1 && enclosedContent.indexOf('>') === -1) {
                return false; // enclosed content looks like it contains no html elements
            }
        }
        return true;
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
