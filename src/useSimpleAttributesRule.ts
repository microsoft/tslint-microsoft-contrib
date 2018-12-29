import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getJsxAttributesFromJsxElement } from './utils/JsxAttribute';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'use-simple-attributes',
        type: 'functionality',
        description: 'Enforce usage of only simple attribute types.',
        rationale:
            'Simpler attributes in JSX and TSX files helps keep code clean and readable.\
            Separate complex expressions into their own line and use clear variable names to make your code more understandable.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Correctness'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX ? this.applyWithFunction(sourceFile, walk) : [];
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function checkJsxOpeningElement(node: ts.JsxOpeningLikeElement) {
        const attributes = getJsxAttributesFromJsxElement(node);
        for (const key of Object.keys(attributes)) {
            const attribute = attributes[key];

            // Handle Binary Expressions
            const binaryExpression = <ts.BinaryExpression>getNextNodeRecursive(attribute, ts.SyntaxKind.BinaryExpression);
            if (binaryExpression && !isSimpleBinaryExpression(binaryExpression)) {
                const binaryExpressionErrorMessage: string = 'Attribute contains a complex binary expression';
                ctx.addFailureAt(node.getStart(), node.getWidth(), binaryExpressionErrorMessage);
            }

            // Handle Ternary Expression
            const ternaryExpression = <ts.ConditionalExpression>getNextNodeRecursive(attribute, ts.SyntaxKind.ConditionalExpression);
            if (ternaryExpression) {
                const ternaryExpressionErrorMessage: string = 'Attribute contains a ternary expression';
                ctx.addFailureAt(node.getStart(), node.getWidth(), ternaryExpressionErrorMessage);
            }
        }
    }

    function getNextNodeRecursive(node: ts.Node, kind: ts.SyntaxKind): ts.Node | undefined {
        if (!node) {
            return undefined;
        }
        const childNodes = node.getChildren();
        let match = childNodes.find(cn => cn.kind === kind);
        if (!match) {
            for (const childNode of childNodes) {
                match = getNextNodeRecursive(childNode, kind);
            }
        }
        return match;
    }

    function isSimpleBinaryExpression(binaryExpression: ts.BinaryExpression): boolean {
        if (binaryExpression.kind !== ts.SyntaxKind.BinaryExpression) {
            return false;
        }

        // Both children of a Binary Expression should be primitives, constants or identifiers
        const allowedBinaryNodes: ts.SyntaxKind[] = [
            ts.SyntaxKind.NumericLiteral,
            ts.SyntaxKind.StringLiteral,
            ts.SyntaxKind.TrueKeyword,
            ts.SyntaxKind.FalseKeyword,
            ts.SyntaxKind.Identifier
        ];

        const leftTerm = allowedBinaryNodes.find(kind => kind === binaryExpression.left.kind);
        const rightTerm = allowedBinaryNodes.find(kind => kind === binaryExpression.right.kind);
        return leftTerm ? (rightTerm ? true : false) : false;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node)) {
            checkJsxOpeningElement(node);
        } else if (tsutils.isJsxElement(node)) {
            checkJsxOpeningElement(node.openingElement);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
