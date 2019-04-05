import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Do not use http-equiv="refresh"';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-meta',
        type: 'functionality',
        description: 'For accessibility of your website, HTML meta elements must not have http-equiv="refresh".',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithFunction(sourceFile, walk);
        }

        return [];
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function validateOpeningElement(parent: ts.Node, openElement: ts.JsxOpeningLikeElement): void {
        if (openElement.tagName.getText() === 'meta') {
            const attributes: ts.JsxAttributes = openElement.attributes;
            attributes.properties.forEach(
                (parameter: ts.JsxAttributeLike): void => {
                    if (parameter.kind === ts.SyntaxKind.JsxAttribute) {
                        const attribute: ts.JsxAttribute = <ts.JsxAttribute>parameter;
                        if (attribute.name.getText() === 'http-equiv') {
                            if (attribute.initializer !== undefined && isStringLiteral(attribute.initializer, 'refresh')) {
                                ctx.addFailureAt(parent.getStart(), openElement.getWidth(), FAILURE_STRING);
                            }
                        }
                    }
                }
            );
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node)) {
            validateOpeningElement(node, node);
            return;
        }

        if (tsutils.isJsxElement(node)) {
            validateOpeningElement(node, node.openingElement);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}

function isStringLiteral(expression: ts.Expression, literal: string): boolean | undefined {
    if (expression !== undefined) {
        if (expression.kind === ts.SyntaxKind.StringLiteral) {
            const value: string = (<ts.StringLiteral>expression).text;
            return value === literal;
        }

        if (expression.kind === ts.SyntaxKind.JsxExpression) {
            const exp: ts.JsxExpression = <ts.JsxExpression>expression;
            if (exp.expression !== undefined && exp.expression.kind === ts.SyntaxKind.StringLiteral) {
                const value: string = (<ts.StringLiteral>exp.expression).text;
                return value === literal;
            }
        }
    }
    return undefined;
}
