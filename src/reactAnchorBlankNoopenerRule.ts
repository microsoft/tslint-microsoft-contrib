import * as ts from "typescript";
import * as Lint from "tslint";

import { ExtendedMetadata } from "./utils/ExtendedMetadata";
import { Utils } from "./utils/Utils";

import { getJsxAttributesFromJsxElement, getStringLiteral, isEmpty } from "./utils/JsxAttribute";

const OPTION_FORCE_REL_REDUNDANCY = "force-rel-redundancy";

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: "react-anchor-blank-noopener",
        type: "functionality",
        description: 'Anchor tags with target="_blank" should also include rel="noreferrer"',
        options: {
            type: "array",
            items: {
                type: "string",
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
        issueClass: "SDL",
        issueType: "Error",
        severity: "Critical",
        level: "Mandatory",
        group: "Security",
        commonWeaknessEnumeration: "242,676"
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactAnchorBlankNoopenerRuleWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactAnchorBlankNoopenerRuleWalker extends Lint.RuleWalker {
    private readonly forceRelRedundancy: boolean = false;
    private readonly failureString: string = 'Anchor tags with target="_blank" should also include rel="noreferrer"';

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        if (options.ruleArguments !== undefined && options.ruleArguments.length > 0) {
            this.forceRelRedundancy = options.ruleArguments.indexOf(OPTION_FORCE_REL_REDUNDANCY) > -1;
        }
        if (this.forceRelRedundancy) {
            this.failureString = 'Anchor tags with target="_blank" should also include rel="noopener noreferrer"';
        }
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        const openingElement: ts.JsxOpeningElement = node.openingElement;
        this.validateOpeningElement(openingElement);
        super.visitJsxElement(node);
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.validateOpeningElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private validateOpeningElement(openingElement: ts.JsxOpeningLikeElement): void {
        if (openingElement.tagName.getText() === "a") {
            const allAttributes: { [propName: string]: ts.JsxAttribute } = getJsxAttributesFromJsxElement(openingElement);
            /* tslint:disable:no-string-literal */
            const target: ts.JsxAttribute = allAttributes["target"];
            const rel: ts.JsxAttribute = allAttributes["rel"];
            /* tslint:enable:no-string-literal */
            if (target !== undefined && getStringLiteral(target) === "_blank" && !isRelAttributeValue(rel, this.forceRelRedundancy)) {
                this.addFailureAt(openingElement.getStart(), openingElement.getWidth(), this.failureString);
            }
        }
    }
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
        ? Utils.contains(relValues, "noreferrer") && Utils.contains(relValues, "noopener")
        : Utils.contains(relValues, "noreferrer");
}
