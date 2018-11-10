import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ExtendedMetadata} from './utils/ExtendedMetadata';

const BAD_ORDER_HEADING_FAILURE_STRING: string = 'Heading elements should be used for structuring information on the page';
const EMPTY_HEADING_FAILURE_STRING: string = 'Heading elements must not be empty';
const BAD_HEADING_LENGTH_STRING: string = 'Heading content should be concise';
const H1_HEADING_NOT_SUBSET_OF_TITLE_STRING: string = 'H1 heading should match a subset of the words in the title element';
const BAD_NUMBER_H1_HEADING_FAILURE_STRING: string = 'H1 heading cannot exceed 2 elements';
const VALID_HEADING_TYPES: string[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const MAX_NUMBER_OF_H1_HEADINGS: number = 2;
const MAX_HEADING_LENGTH_ATTRIBUTE_NAME: string = 'maxHeadingLength';
const TITLE_TAG_NAME = 'title';

export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-accessible-headings',
        type: 'functionality',
        description: 'For accessibility of your website, HTML heading elements must be concise, non-empty,\
         should be used for structuring information on the page, and should match a subset of the words in the title element.',
        options: {
            maxHeadingLength: 'number'
        },
        optionsDescription: 'Heading elements maximum text length',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactA11yAccessibleHeadingsWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactA11yAccessibleHeadingsWalker extends Lint.RuleWalker {
    private lastKnownHeadingNumber: number | undefined;
    private capturedTitleText: string | undefined;
    private numberOfH1Headings: number = 0;
    private maxHeadingTextLength: number | undefined;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        const option = options.ruleArguments.find(a => a.hasOwnProperty(MAX_HEADING_LENGTH_ATTRIBUTE_NAME));
        if (option && typeof option[MAX_HEADING_LENGTH_ATTRIBUTE_NAME] === 'number') {
            this.maxHeadingTextLength = option[MAX_HEADING_LENGTH_ATTRIBUTE_NAME];
        }
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        if (VALID_HEADING_TYPES.find(h => h === node.tagName.getText())) {
            this.addFailureAt(node.getStart(),
                node.getWidth(), EMPTY_HEADING_FAILURE_STRING);
        }
        super.visitJsxSelfClosingElement(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        const openingElement: ts.JsxOpeningElement = node.openingElement;
        if (openingElement.tagName.getText().toLowerCase() === TITLE_TAG_NAME) {
            this.captureTitleText(node);
        }
        if (VALID_HEADING_TYPES.find(h => h === openingElement.tagName.getText())) {
            // Validate heading elements are structured in increasing order of +1
            this.validateHeadingsOrder(openingElement);
            // Validate heading text
            this.validateHeadingText(node);
            // Validate no more than 2 H1 headings
            this.validateNumberOfH1Heading(node);
        }
        super.visitJsxElement(node);
    }

    private validateNumberOfH1Heading(node: ts.JsxElement): void {
        if (node.openingElement.tagName.getText().toLowerCase() !== 'h1') {
            return;
        }
        this.numberOfH1Headings += 1;
        if (this.numberOfH1Headings > MAX_NUMBER_OF_H1_HEADINGS) {
            this.addFailureAt(
                node.getStart(),
                node.getWidth(),
                BAD_NUMBER_H1_HEADING_FAILURE_STRING);
        }
    }

    private captureTitleText(node: ts.JsxElement): void {
        if (node.children[0].kind === ts.SyntaxKind.JsxExpression) {
            this.capturedTitleText = this.extractFromExpression(node.children[0]);
        } else {
            this.capturedTitleText = this.extractFromText(node.children[0]);
        }
    }

    private validateHeadingsOrder(headingNode: ts.JsxOpeningElement): void {
        const headingNumber: number = parseInt(headingNode.tagName.getText()[1]);
        if (!this.lastKnownHeadingNumber) {
            this.lastKnownHeadingNumber = headingNumber;
            return;
        }
        if (headingNumber !== this.lastKnownHeadingNumber && (headingNumber - 1) !== this.lastKnownHeadingNumber) {
            this.addFailureAt(headingNode.getStart(),
                headingNode.getWidth(), BAD_ORDER_HEADING_FAILURE_STRING);
        } else {
            this.lastKnownHeadingNumber = headingNumber;
        }
    }

    private validateHeadingText(headingNode: ts.JsxElement): void {
        let headingText: string | undefined;
        const innerNode = headingNode.children[0];
        if (headingNode.children.length === 0) {
            this.addFailureAt(headingNode.getStart(),
            headingNode.getWidth(), EMPTY_HEADING_FAILURE_STRING);
        } else {
            if (innerNode.kind === ts.SyntaxKind.JsxExpression) {
                headingText = this.extractFromExpression(innerNode);
            } else {
                headingText = this.extractFromText(innerNode);
            }

            if (headingText && this.maxHeadingTextLength && headingText.length > this.maxHeadingTextLength) {
                this.addFailureAt(
                    headingNode.getStart(),
                    headingNode.getWidth(),
                    BAD_HEADING_LENGTH_STRING);
            }
            if (headingNode.openingElement.tagName.getText().toLowerCase() === 'h1') {
                if (headingText && this.capturedTitleText  && !((<string>this.capturedTitleText).indexOf(headingText) > 0)) {
                    this.addFailureAt(
                        headingNode.getStart(),
                        headingNode.getWidth(),
                        H1_HEADING_NOT_SUBSET_OF_TITLE_STRING);
                }
            }
        }
    }

    private extractFromExpression(node: ts.Node): string | undefined {
        if (!(node.kind === ts.SyntaxKind.JsxExpression)) {
            return;
        }
        const expressionNode = <ts.JsxExpression>node;
        if (!expressionNode || !expressionNode.expression) {
            return;
        }
        return (<ts.StringLiteral>expressionNode.expression).text;
    }

    private extractFromText(node: ts.Node): string | undefined {
        if (!(node.kind === ts.SyntaxKind.JsxText)) {
            return;
        }
        return (<ts.JsxText>node).getText();
    }
}
