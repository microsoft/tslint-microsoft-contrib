import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {AstUtils} from './utils/AstUtils';
import {SyntaxKind} from './utils/SyntaxKind';

const UNSPECIFIED_BROWSER_VERSION: string = 'unspecified version';

/**
 * Implementation of the no-unsupported-browser-code rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static JSDOC_BROWSERSPECIFIC: string = '@browserspecific';
    public static COMMENT_BROWSERSPECIFIC: string = 'Browser Specific:';

    public static FAILURE_BROWSER_STRING: string = 'Unsupported browser';
    public static FAILURE_VERSION_STRING: string = 'Unsupported browser version';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnsupportedBrowserCodeRuleWalker(sourceFile, this.getOptions()));
    }
}

class NoUnsupportedBrowserCodeRuleWalker extends Lint.SkippableTokenAwareRuleWalker {
    private supportedBrowsers: { [key: string]: BrowserVersion };

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
        this.parseSupportedBrowsers();
    }

    protected visitSourceFile(node: ts.SourceFile): void {
        super.visitSourceFile(node);

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
            if (scanner.getToken() === SyntaxKind.current().MultiLineCommentTrivia) {
                regex = new RegExp(`${Rule.JSDOC_BROWSERSPECIFIC}\\s*(.*)`, 'gi');
            } else if (scanner.getToken() === SyntaxKind.current().SingleLineCommentTrivia) {
                regex = new RegExp(`${Rule.COMMENT_BROWSERSPECIFIC}\\s*(.*)`, 'gi');
            } else {
                return;
            }

            let match;
            while ((match = regex.exec(scanner.getTokenText()))) {
                const browser = this.parseBrowserString(match[1]);
                const startPos = scanner.getTokenPos() + match.index;
                const length = match[0].length;

                this.findUnsupportedBrowserFailures(browser, startPos, length);
            }
        });
    }

    protected parseBrowserString(browser: string): BrowserVersion {
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

    protected parseSupportedBrowsers() {
        this.supportedBrowsers = {};

        this.getOptions().forEach((option: any) => {
            if (option instanceof Array) {
                option.forEach((browserString: string) => {
                    const browser = this.parseBrowserString(browserString);
                    this.supportedBrowsers[browser.name.toLowerCase()] = browser;
                });
            }
        });
    }

    protected isSupportedBrowser(targetBrowser: BrowserVersion): boolean {
        return targetBrowser.name.toLowerCase() in this.supportedBrowsers;
    }

    protected isSupportedBrowserVersion(targetBrowser: BrowserVersion): boolean {
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

    protected findUnsupportedBrowserFailures(targetBrowser: BrowserVersion, startPos: number, length: number) {
        if (!this.isSupportedBrowser(targetBrowser)) {
            this.addFailure(this.createFailure(
                startPos,
                length,
                `${Rule.FAILURE_BROWSER_STRING}: ${targetBrowser.name}`
            ));
        } else if (!this.isSupportedBrowserVersion(targetBrowser)) {
            this.addFailure(this.createFailure(
                startPos,
                length,
                `${Rule.FAILURE_VERSION_STRING}: ${targetBrowser.name} ${targetBrowser.version}`
            ));
        }
    }
}

interface BrowserVersion {
    name: string;
    comparison: string;
    version: number | string;
}
