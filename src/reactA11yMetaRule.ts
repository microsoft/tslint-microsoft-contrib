import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';

const FAILURE_STRING: string = 'Do not use http-equiv="refresh"';

/**
 * Implementation of the react-a11y-meta rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-meta',
        type: 'functionality',
        description: '... add a meaningful one line description',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ReactA11yMetaRuleWalker(sourceFile, this.getOptions()));
    }
}

class ReactA11yMetaRuleWalker extends ErrorTolerantWalker {


    protected visitJsxElement(node: ts.JsxElement): void {
        this.validateOpeningElement(node, node.openingElement);
        super.visitJsxElement(node);
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.validateOpeningElement(node, node);
    }

    private validateOpeningElement(parent: ts.Node, openElement: ts.JsxOpeningElement): void {
        if (openElement.tagName.getText() === 'meta') {
            const attributes: ts.NodeArray<ts.JsxAttribute | ts.JsxSpreadAttribute> = openElement.attributes;
            attributes.forEach((parameter: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
                if (parameter.kind === SyntaxKind.current().JsxAttribute) {
                    const attribute: ts.JsxAttribute = <ts.JsxAttribute>parameter;
                    if (attribute.name.getText() === 'http-equiv') {
                        if (attribute.initializer != null) {
                            if (attribute.initializer.kind === SyntaxKind.current().StringLiteral) {
                                const value: string = (<ts.StringLiteral>attribute.initializer).text;
                                if (value === 'refresh') {
                                    this.addFailure(this.createFailure(parent.getStart(), openElement.getWidth(), FAILURE_STRING));
                                }
                            } else if (attribute.initializer.kind === SyntaxKind.current().JsxExpression) {
                                const exp: ts.JsxExpression = <ts.JsxExpression>attribute.initializer;
                                if (exp.expression.kind === SyntaxKind.current().StringLiteral) {
                                    const value: string = (<ts.StringLiteral>exp.expression).text;
                                    if (value === 'refresh') {
                                        this.addFailure(
                                            this.createFailure(openElement.getStart(), openElement.getWidth(), FAILURE_STRING)
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}
