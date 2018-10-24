import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {Utils} from './utils/Utils';

const EMPTY_TITLE_FAILURE_STRING: string = 'Title elements must not be empty';
const LONG_TITLE_FAILURE_STRING: string = 'Title length must not be longer than 60 characters';
const WORD_TITLE_FAILURE_STRING: string = 'Title must contain more than one word';
const MAX_TITLE_LENGTH: number = 60;

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-titles',
        type: 'functionality',
        description: 'For accessibility of your website, HTML title elements must be concise and non-empty.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactA11yTitlesRuleWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactA11yTitlesRuleWalker extends Lint.RuleWalker {

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        if (node.tagName.getText() === 'title') {
            this.addFailureAt(node.getStart(),
                node.getWidth(), EMPTY_TITLE_FAILURE_STRING);
        }
        super.visitJsxSelfClosingElement(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        const openingElement: ts.JsxOpeningElement = node.openingElement;
        if (openingElement.tagName.getText() === 'title') {
            if (node.children.length === 0) {
                this.addFailureAt(node.getStart(),
                    node.getWidth(), EMPTY_TITLE_FAILURE_STRING);
            } else if (node.children.length === 1) {
                if (node.children[0].kind === ts.SyntaxKind.JsxText) {
                    const value: ts.JsxText = <ts.JsxText>node.children[0];
                    this.validateTitleText(value.getText(), node);
                } else if (node.children[0].kind === ts.SyntaxKind.JsxExpression) {
                    const exp: ts.JsxExpression = <ts.JsxExpression>node.children[0];
                    if (exp.expression !== undefined && exp.expression.kind === ts.SyntaxKind.StringLiteral) {
                        this.validateTitleText((<ts.StringLiteral>exp.expression).text, node);
                    }
                }
            }
        }
        super.visitJsxElement(node);
    }

    private validateTitleText(text: string, titleNode: ts.Node): void {
        if (text.length > MAX_TITLE_LENGTH) {
            this.addFailureAt(
                titleNode.getStart(),
                titleNode.getWidth(),
                LONG_TITLE_FAILURE_STRING + ': ' + Utils.trimTo(text, 20));
        } else if (!(text.indexOf(' ') > 0)) {
            this.addFailureAt(
                titleNode.getStart(),
                titleNode.getWidth(),
                WORD_TITLE_FAILURE_STRING + ': ' + Utils.trimTo(text, 20));
        }
    }
}
