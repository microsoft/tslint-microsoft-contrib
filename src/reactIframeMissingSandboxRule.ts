import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_NOT_FOUND: string = 'An iframe element requires a sandbox attribute';
const FAILURE_INVALID_ENTRY: string = 'An iframe element defines an invalid sandbox attribute: ';
const FAILURE_INVALID_COMBINATION: string = 'An iframe element defines a sandbox with both allow-scripts and allow-same-origin';

// If specified as an empty string, this attribute enables extra restrictions on the content that can
// appear in the inline frame. The value of the attribute can either be an empty string (all the restrictions
// are applied), or a space-separated list of tokens that lift particular restrictions.
// Setting both 'allow-scripts'; and 'allow-same-origin' for a single <iframe> tag is not advised. Valid tokens are:
const ALLOWED_VALUES: string[] = [
    '',
    'allow-forms',
    'allow-modals',
    'allow-orientation-lock',
    'allow-pointer-lock',
    'allow-popups',
    'allow-popups-to-escape-sandbox',
    'allow-same-origin',
    'allow-scripts',
    'allow-top-navigation'
];

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-iframe-missing-sandbox',
        type: 'functionality',
        description: 'React iframes must specify a sandbox attribute',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Opportunity for Excellence',
        group: 'Security',
        commonWeaknessEnumeration: '915'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactIframeMissingSandboxRuleWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactIframeMissingSandboxRuleWalker extends Lint.RuleWalker {
    protected visitJsxElement(node: ts.JsxElement): void {
        this.handleJsxOpeningElement(node.openingElement);
        super.visitJsxElement(node);
    }

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.handleJsxOpeningElement(node);
        super.visitJsxSelfClosingElement(node);
    }

    private handleJsxOpeningElement(node: ts.JsxOpeningLikeElement): void {
        if (node.tagName.getText() !== 'iframe') {
            return;
        }

        let sandboxAttributeFound: boolean = false;
        node.attributes.properties.forEach(
            (attribute: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
                if (attribute.kind === ts.SyntaxKind.JsxAttribute) {
                    const jsxAttribute: ts.JsxAttribute = <ts.JsxAttribute>attribute;
                    const attributeName = jsxAttribute.name.text;
                    if (attributeName === 'sandbox') {
                        sandboxAttributeFound = true;
                        if (jsxAttribute.initializer !== undefined && jsxAttribute.initializer.kind === ts.SyntaxKind.StringLiteral) {
                            this.validateSandboxValue(<ts.StringLiteral>jsxAttribute.initializer);
                        }
                    }
                }
            }
        );

        if (!sandboxAttributeFound) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_NOT_FOUND);
        }
    }

    private validateSandboxValue(node: ts.StringLiteral): void {
        const values: string[] = node.text.split(' ');
        let allowScripts: boolean = false;
        let allowSameOrigin: boolean = false;
        values.forEach(
            (attributeValue: string): void => {
                if (ALLOWED_VALUES.indexOf(attributeValue) === -1) {
                    this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_INVALID_ENTRY + attributeValue);
                }
                if (attributeValue === 'allow-scripts') {
                    allowScripts = true;
                }
                if (attributeValue === 'allow-same-origin') {
                    allowSameOrigin = true;
                }
            }
        );
        if (allowScripts && allowSameOrigin) {
            this.addFailureAt(node.getStart(), node.getWidth(), FAILURE_INVALID_COMBINATION);
        }
    }
}
