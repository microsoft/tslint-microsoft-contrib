import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';
import {SyntaxKind} from './utils/SyntaxKind';

const FAILURE_MISSING_LANG: string = 'An html element is missing the lang attribute';
const FAILURE_WRONG_LANG_CODE: string = 'Lang attribute does not have a valid value.';

/**
 * Implementation of the react-a11y-lang rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-lang',
        type: 'functionality',
        description: 'html element should have a valid lang attribute',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Accessibility'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new ReactA11yLangRuleWalker(sourceFile, this.getOptions()));
    }
}

class ReactA11yLangRuleWalker extends ErrorTolerantWalker {
    private static languagesISO = [
        'ab', 'aa', 'af', 'sq', 'am', 'ar', 'an', 'hy', 'as', 'ay', 'az', 'ba', 'eu', 'bn',
        'dz', 'bh', 'bi', 'br', 'bg', 'my', 'be', 'km', 'ca', 'zh', 'zh-Hans', 'zh-Hant',
        'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fo', 'fa', 'fj', 'fi', 'fr', 'fy',
        'gl', 'gd', 'gv', 'ka', 'de', 'el', 'kl', 'gn', 'gu', 'ht', 'ha', 'he', 'iw', 'hi',
        'hu', 'is', 'io', 'id', 'in', 'ia', 'ie', 'iu', 'ik', 'ga', 'it', 'ja', 'jv', 'kn',
        'ks', 'kk', 'rw', 'ky', 'rn', 'ko', 'ku', 'lo', 'la', 'lv', 'li', 'ln', 'lt', 'mk',
        'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mo', 'mn', 'na', 'ne', 'no', 'oc', 'or', 'om',
        'ps', 'pl', 'pt', 'pa', 'qu', 'rm', 'ro', 'ru', 'sm', 'sg', 'sa', 'sr', 'sh', 'st',
        'tn', 'sn', 'ii', 'sd', 'si', 'ss', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl',
        'tg', 'ta', 'tt', 'te', 'th', 'bo', 'ti', 'to', 'ts', 'tr', 'tk', 'tw', 'ug', 'uk',
        'ur', 'uz', 'vi', 'vo', 'wa', 'cy', 'wo', 'xh', 'yi', 'ji', 'yo', 'zu'
    ];

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
            let langFound: boolean = false;
            let validLangCode: boolean = false;

            attributes.forEach((attribute: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
                if (attribute.kind === SyntaxKind.current().JsxAttribute) {
                    if ((<ts.JsxAttribute>attribute).name.getText() === 'lang') {
                        langFound = true;
                        let langText: string = (<ts.JsxAttribute>attribute).initializer.getText().trim();
                        langText = langText.slice(1, -1); // 'en' ->  en
                        if ((ReactA11yLangRuleWalker.languagesISO.indexOf(langText)) > -1) {
                            validLangCode = true;
                        }
                    }
                }
            });

            if (!langFound) {
                this.addFailure(this.createFailure(parent.getStart(), parent.getWidth(), FAILURE_MISSING_LANG));
            } else if (!validLangCode) {
                this.addFailure(this.createFailure(parent.getStart(), parent.getWidth(), FAILURE_WRONG_LANG_CODE));
            }
        }
    }
}
