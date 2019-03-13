/**
 * Enforce ARIA state and property values are valid.
 */

import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { AstUtils } from './utils/AstUtils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { getPropName, getStringLiteral, getBooleanLiteral } from './utils/JsxAttribute';
import { IAria } from './utils/attributes/IAria';
import { isStringLiteral, isNumericLiteral, isJsxExpression, isFalseKeyword, isTrueKeyword, isNullKeyword } from './utils/TypeGuard';

// tslint:disable-next-line:no-require-imports no-var-requires
const aria: { [attributeName: string]: IAria } = require('./utils/attributes/ariaSchema.json');

export function getFailureString(propName: string, expectedType: string, permittedValues: string[]): string {
    switch (expectedType) {
        case 'tristate':
            return `The value for ${propName} must be a boolean or the string 'mixed'.`;
        case 'token':
            return `The value for ${propName} must be a single token from the following: ${permittedValues}.`;
        case 'tokenlist':
            return `The value for ${propName} must be a list of one or more tokens from the following: ${permittedValues}.`;
        case 'boolean':
        case 'string':
        case 'integer':
        case 'number':
        default:
            // tslint:disable-line:no-switch-case-fall-through
            return `The value for ${propName} must be a ${expectedType}.`;
    }
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-proptypes',
        type: 'maintainability',
        description: 'Enforce ARIA state and property values are valid.',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Important',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return sourceFile.languageVariant === ts.LanguageVariant.JSX ? this.applyWithFunction(sourceFile, walk) : [];
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (tsutils.isJsxAttribute(node)) {
            const propNameNode = getPropName(node);
            if (propNameNode === undefined) {
                return;
            }

            const propName = propNameNode.toLowerCase();

            // If there is no aria-* attribute, skip it.
            if (!aria[propName]) {
                return;
            }

            const allowUndefined: boolean = aria[propName].allowUndefined !== undefined ? aria[propName].allowUndefined : false;
            const expectedType: string = aria[propName].type;
            const permittedValues: string[] = aria[propName].values;
            const propValue: string = getStringLiteral(node) || String(getBooleanLiteral(node));

            if (isUndefined(node.initializer)) {
                if (!allowUndefined) {
                    ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureString(propName, expectedType, permittedValues));
                }
                return;
            }

            if (isComplexType(node.initializer)) {
                return;
            }

            if (!validityCheck(node.initializer, propValue, expectedType, permittedValues)) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), getFailureString(propName, expectedType, permittedValues));
            }
        } else {
            return ts.forEachChild(node, cb);
        }
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}

function validityCheck(
    propValueExpression: ts.Expression | undefined,
    propValue: string,
    expectedType: string,
    permittedValues: string[]
): boolean {
    if (propValueExpression === undefined) {
        return true;
    }

    switch (expectedType) {
        case 'boolean':
            return isBoolean(propValueExpression);
        case 'tristate':
            return isBoolean(propValueExpression) || isMixed(propValueExpression);
        case 'integer':
            return isInteger(propValueExpression);
        case 'number':
            return isNumber(propValueExpression);
        case 'string':
            return isString(propValueExpression);
        case 'token':
            return (
                (isString(propValueExpression) || isBoolean(propValueExpression)) && permittedValues.indexOf(propValue.toLowerCase()) > -1
            );
        case 'tokenlist':
            return (
                (isString(propValueExpression) || isBoolean(propValueExpression)) &&
                propValue.split(' ').every(token => permittedValues.indexOf(token.toLowerCase()) > -1)
            );
        default:
            return false;
    }
}

function isUndefined(node: ts.Expression | undefined): boolean {
    if (!node) {
        return true;
    }

    if (isJsxExpression(node)) {
        const expression = node.expression;
        if (!expression) {
            return true;
        }

        if (AstUtils.isUndefined(expression)) {
            return true;
        }

        if (isNullKeyword(expression)) {
            return true;
        }
    }

    return false;
}

/**
 * For this case <div prop={ x + 1 } />
 * we can't check the type of atrribute's expression until running time.
 */
function isComplexType(node: ts.Expression | undefined): boolean {
    return node !== undefined && !isUndefined(node) && isJsxExpression(node) && !AstUtils.isConstant(node.expression);
}

function isBoolean(node: ts.Expression): boolean {
    if (isStringLiteral(node)) {
        const propValue: string = node.text.toLowerCase();

        return propValue === 'true' || propValue === 'false';
    }

    if (isJsxExpression(node)) {
        const expression = node.expression;
        if (expression === undefined) {
            return false;
        }

        if (isStringLiteral(expression)) {
            const propValue: string = expression.text.toLowerCase();

            return propValue === 'true' || propValue === 'false';
        }

        return isFalseKeyword(expression) || isTrueKeyword(expression);
    }

    return false;
}

function isMixed(node: ts.Expression): boolean {
    if (isStringLiteral(node)) {
        return node.text.toLowerCase() === 'mixed';
    }

    if (isJsxExpression(node)) {
        const expression = node.expression;
        if (expression === undefined) {
            return false;
        }

        return isStringLiteral(expression) && expression.text.toLowerCase() === 'mixed';
    }

    return false;
}

function isNumber(node: ts.Expression): boolean {
    if (isStringLiteral(node)) {
        return !isNaN(Number(node.text));
    }

    if (isJsxExpression(node)) {
        const expression = node.expression;
        if (expression === undefined) {
            return false;
        }

        if (isStringLiteral(expression)) {
            return !isNaN(Number(expression.text));
        }

        return isNumericLiteral(expression);
    }

    return false;
}

function isInteger(node: ts.Expression): boolean {
    if (isStringLiteral(node)) {
        const value: number = Number(node.text);

        return !isNaN(value) && Math.round(value) === value;
    }

    if (isJsxExpression(node)) {
        const expression = node.expression;
        if (expression === undefined) {
            return false;
        }

        if (isStringLiteral(expression)) {
            const value: number = Number(expression.text);

            return !isNaN(value) && Math.round(value) === value;
        }

        if (isNumericLiteral(expression)) {
            const value: number = Number(expression.text);

            return Math.round(value) === value;
        }

        return false;
    }

    return false;
}

function isString(node: ts.Expression): boolean {
    return isStringLiteral(node) || (isJsxExpression(node) && node.expression !== undefined && isStringLiteral(node.expression));
}
