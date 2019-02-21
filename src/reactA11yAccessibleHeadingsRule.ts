import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const BAD_ORDER_HEADING_FAILURE_STRING: string = "Heading elements shouldn't increase by more then one level consecutively";
const EMPTY_HEADING_FAILURE_STRING: string = 'Heading elements must not be empty';
const BAD_HEADING_LENGTH_STRING: string = 'Heading content should be concise';
const BAD_NUMBER_H1_HEADING_FAILURE_STRING: string = 'H1 heading cannot exceed 2 elements';
const VALID_HEADING_TYPES: Set<string> = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const MAX_NUMBER_OF_H1_HEADINGS: number = 2;
const MAX_HEADING_LENGTH_DEFAULT: number = 60;
const MAX_HEADING_LENGTH_ATTRIBUTE_NAME: string = 'maxHeadingLength';

interface Options {
    maxHeadingTextLength?: number;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-accessible-headings',
        type: 'functionality',
        description:
            "For accessibility of your website, there should be no more than 2 H1 heading elements, HTML heading elements must be concise, shouldn't increase by more then one level consecutively and non-empty.",
        options: {
            maxHeadingLength: 'number'
        },
        optionsDescription: 'An optional number for a maximum text length of heading elements.',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
        } else {
            return [];
        }
    }

    private parseOptions(options: Lint.IOptions): Options {
        const parsed: Options = {};
        const option = options.ruleArguments.find(a => a.hasOwnProperty(MAX_HEADING_LENGTH_ATTRIBUTE_NAME));
        if (option && typeof option[MAX_HEADING_LENGTH_ATTRIBUTE_NAME] === 'number') {
            parsed.maxHeadingTextLength = option[MAX_HEADING_LENGTH_ATTRIBUTE_NAME];
        }
        return parsed;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    function validate(node: ts.Node): void {
        const elements: ts.JsxElement[] = [];
        let h1HeadingCounter: number = 0;
        let previousHeadingNumber: number | undefined;

        // Get JsxElements in scope
        tsutils.forEachToken(node, (childNode: ts.Node) => {
            const parentNode = childNode.parent;
            if (tsutils.isJsxOpeningElement(parentNode) && VALID_HEADING_TYPES.has(childNode.getText())) {
                elements.push(parentNode.parent);
            }
        });

        elements.forEach((element: ts.JsxElement) => {
            const openingElement: ts.JsxOpeningElement = element.openingElement;

            // Validate heading elements are structured in increasing order of +1
            const headingNumber: number = parseInt(openingElement.tagName.getText()[1], 10);
            if (!previousHeadingNumber) {
                previousHeadingNumber = headingNumber;
            } else if (headingNumber > previousHeadingNumber && previousHeadingNumber + 1 !== headingNumber) {
                ctx.addFailureAt(openingElement.getStart(), openingElement.getWidth(), BAD_ORDER_HEADING_FAILURE_STRING);
            } else {
                previousHeadingNumber = headingNumber;
            }

            // Validate no more than 2 H1 headings
            if (openingElement.tagName.getText().toLowerCase() === 'h1') {
                h1HeadingCounter += 1;
                if (h1HeadingCounter > MAX_NUMBER_OF_H1_HEADINGS) {
                    ctx.addFailureAt(node.getStart(), node.getWidth(), BAD_NUMBER_H1_HEADING_FAILURE_STRING);
                }
            }

            // Validate heading text
            validateHeadingText(element);
        });
    }

    function validateHeadingText(headingNode: ts.JsxElement): void {
        if (headingNode.children.length === 0) {
            ctx.addFailureAt(headingNode.getStart(), headingNode.getWidth(), EMPTY_HEADING_FAILURE_STRING);
        } else {
            const textResults: string[] = [];
            getTextRecursive(headingNode, textResults);

            if (textResults.length) {
                const maxHeadingLength = ctx.options.maxHeadingTextLength ? ctx.options.maxHeadingTextLength : MAX_HEADING_LENGTH_DEFAULT;
                if (textResults.join('').length > maxHeadingLength) {
                    ctx.addFailureAt(headingNode.getStart(), headingNode.getWidth(), BAD_HEADING_LENGTH_STRING);
                }
            }
        }
    }

    function getTextRecursive(node: ts.Node, textResults: string[] = []): void {
        if (!node) {
            return;
        }
        if (tsutils.isJsxElement(node)) {
            for (const childNode of node.children) {
                let textResult: string | undefined;
                if (tsutils.isJsxExpression(childNode)) {
                    textResult = extractFromExpression(childNode);
                } else if (tsutils.isJsxText(childNode)) {
                    textResult = childNode.getText();
                }
                if (textResult) {
                    textResults.push(textResult);
                }
                getTextRecursive(childNode, textResults);
            }
        }
    }

    function extractFromExpression(expressionNode: ts.JsxExpression): string | undefined {
        if (!expressionNode.expression || !tsutils.isStringLiteral(expressionNode.expression)) {
            return undefined;
        }
        return expressionNode.expression.text;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isFunctionDeclaration(node)) {
            validate(node);
        } else if (tsutils.isMethodDeclaration(node)) {
            validate(node);
        } else if (tsutils.isVariableDeclaration(node)) {
            validate(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
