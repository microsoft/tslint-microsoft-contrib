import * as ts from 'typescript';
import * as Lint from 'tslint';

import { forEachTokenWithTrivia } from 'tsutils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

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

interface Options {
    readonly supportedBrowsers: { [key: string]: BrowserVersion };
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unsupported-browser-code',
        type: 'maintainability',
        description: 'Avoid writing browser-specific code for unsupported browser versions',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseSupportedBrowsers(this.getOptions()));
    }

    private parseSupportedBrowsers(options: Lint.IOptions): Options {
        const result: { [key: string]: BrowserVersion } = {};

        const ruleArguments: unknown[] = options.ruleArguments;

        (ruleArguments || []).forEach((option: unknown) => {
            if (option instanceof Array) {
                option.forEach((browserString: string) => {
                    const browser = parseBrowserString(browserString);
                    if (browser !== undefined) {
                        result[browser.name.toLowerCase()] = browser;
                    }
                });
            }
        });

        return {
            supportedBrowsers: result
        };
    }
}

function parseBrowserString(browser: string): BrowserVersion | undefined {
    // This case-insensitive regex contains 3 capture groups:
    //     #1 looks for a browser name (combination of spaces and alpha)
    //     #2 looks for an optional comparison operator (>=, <=, etc)
    //     #3 looks for a version number
    const regex = /([a-zA-Z ]*)(>=|<=|<|>)?\s*(\d*)/i;
    const match = browser.match(regex);
    if (match === null) {
        return undefined;
    }

    return {
        name: match[1].trim(),
        comparison: match[2] || '=',
        version: parseInt(match[3], 10) || UNSPECIFIED_BROWSER_VERSION
    };
}

function walk(ctx: Lint.WalkContext<Options>) {
    const { supportedBrowsers } = ctx.options;

    function findUnsupportedBrowserFailures(targetBrowser: BrowserVersion, startPos: number, length: number) {
        if (!isSupportedBrowser(targetBrowser)) {
            ctx.addFailureAt(startPos, length, `${FAILURE_BROWSER_STRING}: ${targetBrowser.name}`);
        } else if (!isSupportedBrowserVersion(targetBrowser)) {
            ctx.addFailureAt(startPos, length, `${FAILURE_VERSION_STRING}: ${targetBrowser.name} ${targetBrowser.version}`);
        }
    }

    function isSupportedBrowser(targetBrowser: BrowserVersion): boolean {
        return targetBrowser.name.toLowerCase() in supportedBrowsers;
    }

    function isSupportedBrowserVersion(targetBrowser: BrowserVersion): boolean {
        const supportedBrowser = supportedBrowsers[targetBrowser.name.toLowerCase()];

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

    function cb(node: ts.Node): void {
        forEachTokenWithTrivia(node, (text, tokenSyntaxKind, range) => {
            let regex;
            if (tokenSyntaxKind === ts.SyntaxKind.MultiLineCommentTrivia) {
                regex = new RegExp(`${JSDOC_BROWSERSPECIFIC}\\s*(.*)`, 'gi');
            } else if (tokenSyntaxKind === ts.SyntaxKind.SingleLineCommentTrivia) {
                regex = new RegExp(`${COMMENT_BROWSERSPECIFIC}\\s*(.*)`, 'gi');
            } else {
                return;
            }

            let match;
            const tokenText = text.substring(range.pos, range.end);
            // tslint:disable-next-line:no-conditional-assignment
            while ((match = regex.exec(tokenText))) {
                const browser = parseBrowserString(match[1]);
                if (browser === undefined) {
                    break;
                }

                findUnsupportedBrowserFailures(browser, range.pos, range.end - range.pos);
            }
        });
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
