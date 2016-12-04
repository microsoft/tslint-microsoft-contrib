import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const FAILURE_INNER: string = 'Writing a string to the innerHTML property is insecure: ';
const FAILURE_OUTER: string = 'Writing a string to the outerHTML property is insecure: ';
const FAILURE_JQUERY: string = 'Using the html() function to write a string to innerHTML is insecure: ';

/**
 * Implementation of the no-inner-html rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-inner-html',
        type: 'maintainability',
        description: 'Do not write values to innerHTML, outerHTML, or set HTML using the JQuery html() function.',
        options: null,
        optionsDescription: "",
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

class NoInnerHtmlRuleWalker extends ErrorTolerantWalker {
    protected visitBinaryExpression(node: ts.BinaryExpression): void {
        // look for assignments to property expressions where the
        // left hand side is either innerHTML or outerHTML
        if (node.operatorToken.kind === SyntaxKind.current().EqualsToken) {
            if (node.left.kind === SyntaxKind.current().PropertyAccessExpression) {
                const propAccess: ts.PropertyAccessExpression = <ts.PropertyAccessExpression>node.left;
                const propName: string = propAccess.name.text;
                if (propName === 'innerHTML') {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_INNER + node.getText()));
                } else if (propName === 'outerHTML') {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_OUTER + node.getText()));
                }
            }
        }
        super.visitBinaryExpression(node);
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        const functionName = AstUtils.getFunctionName(node);
        if (functionName === 'html') {
            if (node.arguments.length > 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), FAILURE_JQUERY + node.getText()));
            }
        }
        super.visitCallExpression(node);
    }
}
