import * as ts from 'typescript';
import * as Lint from 'tslint';

import {AstUtils} from './utils/AstUtils';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

const UNSPECIFIED_BROWSER_VERSION: string = 'unspecified version';
const JSDOC_BROWSERSPECIFIC: string = '@browserspecific';
const COMMENT_BROWSERSPECIFIC: string = 'Browser Specific:';
const FAILURE_BROWSER_STRING: string = 'Unsupported browser';
const FAILURE_VERSION_STRING: string = 'Unsupported browser version';

interface BrowserVersion {
    name: string;
    comparison: string;
    version: number | string;
}

/**
 * Implementation of the no-unsupported-browser-code rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unsupported-browser-code',
        type: 'maintainability',
        description: 'Avoid writing browser-specific code for unsupported browser versions',
        options: null,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnsupportedBrowserCodeRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoUnsupportedBrowserCodeRuleWalker extends Lint.SkippableTokenAwareRuleWalker {
    private supportedBrowsers: { [key: string]: BrowserVersion };

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.supportedBrowsers = this.parseSupportedBrowsers();
    }

    protected visitSourceFile(node: ts.SourceFile): void {
        // do not call super.visitSourceFile because we're already scanning the full file below

        const scanner = ts.createScanner(
            ts.ScriptTarget.ES5,
            false,
            AstUtils.getLanguageVariant(node),
            node.text
        );

        Lint.scanAllTokens(scanner, (scanner: ts.Scanner) => {
            const startPos = scanner.getStartPos();
            if (this.tokensToSkipStartEndMap[startPos] != null) {
                // tokens to skip are places where the scanner gets confused
                // about what the token is, without the proper context
                // (specifically, regex, identifiers, and templates). So skip
                // those tokens.
                scanner.setTextPos(this.tokensToSkipStartEndMap[startPos]);
                return;
            }

            let regex;
            if (scanner.getToken() === ts.SyntaxKind.MultiLineCommentTrivia) {
                regex = new RegExp(`${JSDOC_BROWSERSPECIFIC}\\s*(.*)`, 'gi');
            } else if (scanner.getToken() === ts.SyntaxKind.SingleLineCommentTrivia) {
                regex = new RegExp(`${COMMENT_BROWSERSPECIFIC}\\s*(.*)`, 'gi');
            } else {
                return;
            }

            let match;
            /* tslint:disable-next-line:no-conditional-assignment */
            while ((match = regex.exec(scanner.getTokenText()))) {
                const browser = this.parseBrowserString(match[1]);
                const startPos = scanner.getTokenPos() + match.index;
                const length = match[0].length;

                this.findUnsupportedBrowserFailures(browser, startPos, length);
            }
        });
    }

    private parseBrowserString(browser: string): BrowserVersion {
        // This case-insensitive regex contains 3 capture groups:
        //     #1 looks for a browser name (combination of spaces and alpha)
        //     #2 looks for an optional comparison operator (>=, <=, etc)
        //     #3 looks for a version number
        const regex = /([a-zA-Z ]*)(>=|<=|<|>)?\s*(\d*)/i;
        const match = browser.match(regex);

        return {
            name: match[1].trim(),
            comparison: match[2] || '=',
            version: parseInt(match[3], 10) || UNSPECIFIED_BROWSER_VERSION
        };
    }

    private parseSupportedBrowsers(): { [key: string]: BrowserVersion } {
        const result: { [key: string]: BrowserVersion } = {};

        this.getOptions().forEach((option: any) => {
            if (option instanceof Array) {
                option.forEach((browserString: string) => {
                    const browser = this.parseBrowserString(browserString);
                    result[browser.name.toLowerCase()] = browser;
                });
            }
        });
        return result;
    }

    private isSupportedBrowser(targetBrowser: BrowserVersion): boolean {
        return targetBrowser.name.toLowerCase() in this.supportedBrowsers;
    }

    private isSupportedBrowserVersion(targetBrowser: BrowserVersion): boolean {
        const supportedBrowser = this.supportedBrowsers[targetBrowser.name.toLowerCase()];

        if (supportedBrowser.version === UNSPECIFIED_BROWSER_VERSION) {
            // If the supplied browser supports every version (aka unspecified
            // version number) then the target browser version is irrelevant.
            return true;
        }

        switch (supportedBrowser.comparison) {
            case '>':
                return targetBrowser.version > supportedBrowser.version;
            case '>=':
                return targetBrowser.version >= supportedBrowser.version;
            case '<':
                return targetBrowser.version < supportedBrowser.version;
            case '<=':
                return targetBrowser.version <= supportedBrowser.version;
            case '=':
                return targetBrowser.version === supportedBrowser.version;
            default:
                return false;
        }
    }

    private findUnsupportedBrowserFailures(targetBrowser: BrowserVersion, startPos: number, length: number) {
        if (!this.isSupportedBrowser(targetBrowser)) {
            this.addFailure(this.createFailure(
                startPos,
                length,
                `${FAILURE_BROWSER_STRING}: ${targetBrowser.name}`
            ));
        } else if (!this.isSupportedBrowserVersion(targetBrowser)) {
            this.addFailure(this.createFailure(
                startPos,
                length,
                `${FAILURE_VERSION_STRING}: ${targetBrowser.name} ${targetBrowser.version}`
            ));
        }
    }
}
