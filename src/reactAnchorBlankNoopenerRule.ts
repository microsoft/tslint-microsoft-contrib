import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';
import { Utils } from './utils/Utils';

import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from './utils/JsxAttribute';

const OPTION_FORCE_REL_REDUNDANCY = 'force-rel-redundancy';

interface Options {
    forceRelRedundancy: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-anchor-blank-noopener',
        type: 'functionality',
        description: 'Anchor tags with target="_blank" should also include rel="noreferrer"',
        options: {
            type: 'array',
            items: {
                type: 'string',
                enum: [OPTION_FORCE_REL_REDUNDANCY]
            },
            minLength: 0,
            maxLength: 1
        },
        optionsDescription: `One argument may be optionally provided: \n\n' +
            '* \`${OPTION_FORCE_REL_REDUNDANCY}\` ignores the default \`rel="noreferrer"\`
            behaviour which implies \`rel="noreferrer noopener"\`. Instead, force redundancy
            for \`rel\` attribute.`,
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '242,676'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
        } else {
            return [];
        }
    }

    private parseOptions(options: Lint.IOptions): Options {
        const parsed: Options = {
            forceRelRedundancy: false
        };

        if (options.ruleArguments !== undefined && options.ruleArguments.length > 0) {
            parsed.forceRelRedundancy = options.ruleArguments.indexOf(OPTION_FORCE_REL_REDUNDANCY) > -1;
        }

        return parsed;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const failureString: string = ctx.options.forceRelRedundancy
        ? 'Anchor tags with target="_blank" should also include rel="noopener noreferrer"'
        : 'Anchor tags with target="_blank" should also include rel="noreferrer"';

    function validateOpeningElement(openingElement: ts.JsxOpeningLikeElement): void {
        if (openingElement.tagName.getText() === 'a') {
            const allAttributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(openingElement);
            /* tslint:disable:no-string-literal */
            const target: ts.JsxAttribute = allAttributes['target'];
            const rel: ts.JsxAttribute = allAttributes['rel'];
            /* tslint:enable:no-string-literal */
            if (
                target !== undefined &&
                getStringLiteral(target) === '_blank' &&
                !isRelAttributeValue(rel, ctx.options.forceRelRedundancy)
            ) {
                ctx.addFailureAt(openingElement.getStart(), openingElement.getWidth(), failureString);
            }
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxElement(node)) {
            validateOpeningElement(node.openingElement);
        } else if (tsutils.isJsxSelfClosingElement(node)) {
            validateOpeningElement(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}

function isRelAttributeValue(attribute: ts.JsxAttribute, forceRedundancy: boolean): boolean {
    if (isEmpty(attribute)) {
        return false;
    }

    if (attribute.initializer !== undefined && attribute.initializer.kind === ts.SyntaxKind.JsxExpression) {
        const expression: ts.JsxExpression = <ts.JsxExpression>attribute.initializer;
        if (expression.expression !== undefined && expression.expression.kind !== ts.SyntaxKind.StringLiteral) {
            return true; // attribute value is not a string literal, so do not validate
        }
    }

    const stringValue = getStringLiteral(attribute);
    if (stringValue === undefined || stringValue.length === 0) {
        return false;
    }

    const relValues: string[] = stringValue.split(/\s+/);

    return forceRedundancy
        ? Utils.contains(relValues, 'noreferrer') && Utils.contains(relValues, 'noopener')
        : Utils.contains(relValues, 'noreferrer');
}
