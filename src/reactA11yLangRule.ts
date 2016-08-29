import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';

const FAILURE_STRING: string = 'An html element is missing the lang attribute';

/**
 * Implementation of the react-a11y-lang rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-lang',
        type: 'functionality',
        description: 'For accessibility of your website, html elements must have a lang attribute.',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactA11yLangRuleWalker(sourceFile, this.getOptions()));
        } else {
            return [];
        }
    }
}

class ReactA11yLangRuleWalker extends ErrorTolerantWalker {

    protected visitJsxSelfClosingElement(node: ts.JsxSelfClosingElement): void {
        this.validateOpeningElement(node, node);
        super.visitJsxSelfClosingElement(node);
    }

    protected visitJsxElement(node: ts.JsxElement): void {
        this.validateOpeningElement(node, node.openingElement);
        super.visitJsxElement(node);
    }

    private validateOpeningElement(parent: ts.Node, openingElement: ts.JsxOpeningElement): void {
        if (openingElement.tagName.getText() === 'html') {
            const attributes: ts.NodeArray<ts.JsxAttribute | ts.JsxSpreadAttribute> = openingElement.attributes;
            let found: boolean = false;
            attributes.forEach((attribute: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
                if (attribute.kind === SyntaxKind.current().JsxAttribute) {
                    if ((<ts.JsxAttribute>attribute).name.getText() === 'lang') {
                        found = true;
                    }
                }
            });
            if (!found) {
                this.addFailure(this.createFailure(parent.getStart(), parent.getWidth(), FAILURE_STRING));
            }
        }
    }
}
