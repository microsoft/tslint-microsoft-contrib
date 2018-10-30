import * as ts from 'typescript';
import * as Lint from 'tslint';

import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_INNER: string = 'Writing a string to the innerHTML property is insecure: ';
const FAILURE_OUTER: string = 'Writing a string to the outerHTML property is insecure: ';
const FAILURE_HTML_LIB: string = 'Using the html() function to write a string to innerHTML is insecure: ';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-inner-html',
        type: 'maintainability',
        description: 'Do not write values to innerHTML, outerHTML, or set HTML using the JQuery html() function.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '79, 85, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoInnerHtmlRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoInnerHtmlRuleWalker extends Lint.RuleWalker {

    private readonly htmlLibExpressionRegex: RegExp = /^(jquery|[$])/i;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        const opt = this.getOptions();
        if (typeof opt[1] === 'object' && opt[1]['html-lib-matcher']) {
            this.htmlLibExpressionRegex = new RegExp(opt[1]['html-lib-matcher']);
        }
    }

    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        // look for assignments to property expressions where the
        // left hand side is either innerHTML or outerHTML
        if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
            if (node.left.kind === ts.SyntaxKind.PropertyAccessExpression) {
                const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.left;
                const propName: string = propAccess.name.text;
                if (propName === 'innerHTML') {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_INNER + node.getText());
                } else if (propName === 'outerHTML') {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_OUTER + node.getText());
                }
            }
        }
        super.visitBinaryExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        const functionName = AstUtils.getFunctionName(node);
        if (functionName === 'html') {
            if (node.arguments.length > 0) {
                const functionTarget = AstUtils.getFunctionTarget(node);
                if (functionTarget !== undefined && this.htmlLibExpressionRegex.test(functionTarget)) {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_HTML_LIB + node.getText());
                }
            }
        }
        super.visitCallExpression(node);
    }
}
