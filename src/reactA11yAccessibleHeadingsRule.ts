import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const BAD_ORDER_HEADING_FAILURE_STRING: string = 'Heading elements should be used for structuring information on the page';
const EMPTY_HEADING_FAILURE_STRING: string = 'Heading elements must not be empty';
const BAD_HEADING_LENGTH_STRING: string = 'Heading content should be concise';
const BAD_NUMBER_H1_HEADING_FAILURE_STRING: string = 'H1 heading cannot exceed 2 elements';
const VALID_HEADING_TYPES: Set<string> = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const MAX_NUMBER_OF_H1_HEADINGS: number = 2;
const MAX_HEADING_LENGTH_ATTRIBUTE_NAME: string = 'maxHeadingLength';

interface IValidationOptions {
    validateText?: boolean;
    validateOrder?: boolean;
    validateH1Count?: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-accessible-headings',
        type: 'functionality',
        description:
            'For accessibility of your website, there should be no more than 2 H1 heading elements, HTML heading elements must be concise, used for structuring information on the page and non-empty.',
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
    //private headings: { [id: string] : IHeadingResult; } = {};
    private lastKnownHeadingNumber: number | undefined;
    private numberOfH1Headings: number = 0;
    private readonly maxHeadingTextLength: number | undefined;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        const option = options.ruleArguments.find(a => a.hasOwnProperty(MAX_HEADING_LENGTH_ATTRIBUTE_NAME));
        if (option && typeof option[MAX_HEADING_LENGTH_ATTRIBUTE_NAME] === 'number') {
            this.maxHeadingTextLength = option[MAX_HEADING_LENGTH_ATTRIBUTE_NAME];
        }
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.validateSelfClosingElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): void {
        const options: IValidationOptions = {
            validateText: true,
            validateOrder: false,
            validateH1Count: false
        };

        let element = this.tryGetNode(node, ts.SyntaxKind.JsxElement);
        if (element) {
            this.validateElement(<ts.JsxElement>element, options);
        } else {
            element = this.tryGetNode(node, ts.SyntaxKind.JsxSelfClosingElement);
            if (element) {
                this.validateSelfClosingElement(<ts.JsxSelfClosingElement>element);
            }
        }
        //super.visitVariableDeclaration(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        const options: IValidationOptions = {
            validateText: true,
            validateOrder: true,
            validateH1Count: true
        };
        this.validateElement(node, options);
        super.visitJsxElement(node);
    }

    private validateElement(node: ts.JsxElement, options: IValidationOptions): void {
        if (!node) {
            return;
        }
        const openingElement: ts.JsxOpeningElement = node.openingElement;

        if (VALID_HEADING_TYPES.has(openingElement.tagName.getText())) {
            // Validate heading text
            if (options.validateText) {
                this.validateHeadingText(node);
            }
            // Validate heading elements are structured in increasing order of +1
            if (options.validateOrder) {
                this.validateHeadingsOrder(openingElement);
            }
            // Validate no more than 2 H1 headings
            if (options.validateH1Count) {
                this.validateH1HeadingCount(node);
            }
        }
    }

    private validateSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        if (!node) {
            return;
        }
        if (VALID_HEADING_TYPES.has(node.tagName.getText())) {
            this.addFailureAt(node.getStart(), node.getWidth(), EMPTY_HEADING_FAILURE_STRING);
        }
    }

    private validateH1HeadingCount(node: ts.JsxElement): void {
        if (node.openingElement.tagName.getText().toLowerCase() !== 'h1') {
            return;
        }
        this.numberOfH1Headings += 1;
        if (this.numberOfH1Headings > MAX_NUMBER_OF_H1_HEADINGS) {
            this.addFailureAt(node.getStart(), node.getWidth(), BAD_NUMBER_H1_HEADING_FAILURE_STRING);
        }
    }

    private validateHeadingsOrder(headingNode: ts.JsxOpeningElement): void {
        const headingNumber: number = parseInt(headingNode.tagName.getText()[1], 10);
        if (!this.lastKnownHeadingNumber) {
            this.lastKnownHeadingNumber = headingNumber;
            return;
        }
        if (headingNumber !== this.lastKnownHeadingNumber && headingNumber - 1 !== this.lastKnownHeadingNumber) {
            this.addFailureAt(headingNode.getStart(), headingNode.getWidth(), BAD_ORDER_HEADING_FAILURE_STRING);
        } else {
            this.lastKnownHeadingNumber = headingNumber;
        }
    }

    private validateHeadingText(headingNode: ts.JsxElement): void {
        let headingText: string | undefined;
        const innerNode = headingNode.children[0];
        if (headingNode.children.length === 0) {
            this.addFailureAt(headingNode.getStart(), headingNode.getWidth(), EMPTY_HEADING_FAILURE_STRING);
        } else {
            if (innerNode.kind === ts.SyntaxKind.JsxExpression) {
                headingText = this.extractFromExpression(innerNode);
            } else {
                headingText = this.extractFromText(innerNode);
            }

            if (headingText && this.maxHeadingTextLength && headingText.length > this.maxHeadingTextLength) {
                this.addFailureAt(headingNode.getStart(), headingNode.getWidth(), BAD_HEADING_LENGTH_STRING);
            }
        }
    }

    private extractFromExpression(node: ts.Node): string | undefined {
        if (!(node.kind === ts.SyntaxKind.JsxExpression)) {
            return undefined;
        }
        const expressionNode = <ts.JsxExpression>node;
        if (!expressionNode || !expressionNode.expression) {
            return undefined;
        }
        return (<ts.StringLiteral>expressionNode.expression).text;
    }

    private extractFromText(node: ts.Node): string | undefined {
        if (!(node.kind === ts.SyntaxKind.JsxText)) {
            return undefined;
        }
        return (<ts.JsxText>node).getText();
    }

    private tryGetNode(node: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
        if (node) {
            if (node.kind === kind) {
                return node;
            }
            return node.forEachChild(childNode => this.tryGetNode(childNode, kind));
        }
        return undefined;
    }
}
