import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_MISSING_LANG: string = 'An html element is missing the lang attribute';
const FAILURE_WRONG_LANG_CODE: string = 'Lang attribute does not have a valid value. Found: ';

const LANGUAGE_CODES: string[] = [
    'ab',
    'aa',
    'af',
    'sq',
    'am',
    'ar',
    'an',
    'hy',
    'as',
    'ay',
    'az',
    'ba',
    'eu',
    'bn',
    'dz',
    'bh',
    'bi',
    'br',
    'bg',
    'my',
    'be',
    'km',
    'ca',
    'zh',
    'zh-Hans',
    'zh-Hant',
    'co',
    'hr',
    'cs',
    'da',
    'nl',
    'en',
    'eo',
    'et',
    'fo',
    'fa',
    'fj',
    'fi',
    'fr',
    'fy',
    'gl',
    'gd',
    'gv',
    'ka',
    'de',
    'el',
    'kl',
    'gn',
    'gu',
    'ht',
    'ha',
    'he',
    'iw',
    'hi',
    'hu',
    'is',
    'io',
    'id',
    'in',
    'ia',
    'ie',
    'iu',
    'ik',
    'ga',
    'it',
    'ja',
    'jv',
    'kn',
    'ks',
    'kk',
    'rw',
    'ky',
    'rn',
    'ko',
    'ku',
    'lo',
    'la',
    'lv',
    'li',
    'ln',
    'lt',
    'mk',
    'mg',
    'ms',
    'ml',
    'mt',
    'mi',
    'mr',
    'mo',
    'mn',
    'na',
    'ne',
    'no',
    'oc',
    'or',
    'om',
    'ps',
    'pl',
    'pt',
    'pa',
    'qu',
    'rm',
    'ro',
    'ru',
    'sm',
    'sg',
    'sa',
    'sr',
    'sh',
    'st',
    'tn',
    'sn',
    'ii',
    'sd',
    'si',
    'ss',
    'sk',
    'sl',
    'so',
    'es',
    'su',
    'sw',
    'sv',
    'tl',
    'tg',
    'ta',
    'tt',
    'te',
    'th',
    'bo',
    'ti',
    'to',
    'ts',
    'tr',
    'tk',
    'tw',
    'ug',
    'uk',
    'ur',
    'uz',
    'vi',
    'vo',
    'wa',
    'cy',
    'wo',
    'xh',
    'yi',
    'ji',
    'yo',
    'zu'
];

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-a11y-lang',
        type: 'functionality',
        description: 'For accessibility of your website, html elements must have a valid lang attribute.',
        rationale: `References:
        <ul>
          <li><a href="https://www.w3.org/TR/WCAG20-TECHS/H58.html">
            H58: Using language attributes to identify changes in the human language
          </a></li>
          <li><a href="https://dequeuniversity.com/rules/axe/1.1/valid-lang">
            lang attribute must have a valid value
          </a></li>
          <li><a href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes">
            List of ISO 639-1 codes
          </a></li>
        </ul>`,
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
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
    function validateOpeningElement(parent: ts.Node, openingElement: ts.JsxOpeningLikeElement): void {
        if (openingElement.tagName.getText() === 'html') {
            const attributes: ts.JsxAttributes = openingElement.attributes;
            let langFound: boolean = false;

            attributes.properties.forEach(
                (attribute: ts.JsxAttributeLike): void => {
                    if (attribute.kind === ts.SyntaxKind.JsxAttribute) {
                        if (attribute.name.getText() === 'lang') {
                            langFound = true;
                            if (attribute.initializer !== undefined && attribute.initializer.kind === ts.SyntaxKind.StringLiteral) {
                                const langText: string = (<ts.StringLiteral>(<ts.JsxAttribute>attribute).initializer).text;
                                if (LANGUAGE_CODES.indexOf(langText) === -1) {
                                    ctx.addFailureAt(parent.getStart(), parent.getWidth(), FAILURE_WRONG_LANG_CODE + langText);
                                }
                            }
                        }
                    }
                }
            );
            if (!langFound) {
                ctx.addFailureAt(parent.getStart(), parent.getWidth(), FAILURE_MISSING_LANG);
            }
        }
    }

    function cb(node: ts.Node): void {
        if (tsutils.isJsxSelfClosingElement(node)) {
            validateOpeningElement(node, node);
        } else if (tsutils.isJsxElement(node)) {
            validateOpeningElement(node, node.openingElement);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
