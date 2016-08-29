import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {Utils} from './utils/Utils';

const EMPTY_TITLE_FAILURE_STRING: string = 'Title elements must not be empty';
const LONG_TITLE_FAILURE_STRING: string = "Title length must not be longer than 60 characters";
const MAX_TITLE_LENGTH: number = 60;

/**
 * Implementation of the react-a11y-titles rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-titles',
        type: 'functionality',
        description: 'For accessibility of your website, HTML x1title elements must not be empty.',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ReactA11yTitlesRuleWalker(sourceFile, this.getOptions()));
    }
}

class ReactA11yTitlesRuleWalker extends ErrorTolerantWalker {

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        if (node.tagName.getText() === 'title') {
            this.addFailure(this.createFailure(node.getStart(),
                node.getWidth(), EMPTY_TITLE_FAILURE_STRING));
        }
        super.visitJsxSelfClosingElement(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        const openingElement: ts.JsxOpeningElement = node.openingElement;
        if (openingElement.tagName.getText() === 'title') {
            if (node.children.length === 0) {
                this.addFailure(this.createFailure(node.getStart(),
                    node.getWidth(), EMPTY_TITLE_FAILURE_STRING));
            } else if (node.children.length === 1) {
                if (node.children[0].kind === ts.SyntaxKind.JsxText) {
                    const value: ts.JsxText = <ts.JsxText>node.children[0];
                    const text: string = value.getText();
                    if (text.length <= MAX_TITLE_LENGTH) {
                       this.addFailure(this.createFailure(node.getStart(),
                       node.getWidth(), LONG_TITLE_FAILURE_STRING + ': ' + Utils.trimTo(text, 20)))
                    }
                }
            }
        }
        super.visitJsxElement(node);
    }

}
