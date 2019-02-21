import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unexternalized-strings',
        type: 'maintainability',
        description: 'Ensures that double quoted strings are passed to a localize call to provide proper strings for different locales',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Configurable',
        recommendation: 'false'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    }

    private parseOptions(options: Lint.IOptions): Options {
        let messageIndex: number | undefined;
        /* tslint:disable:no-null-keyword */
        const signatures: Map<boolean> = Object.create(null);
        const ignores: Map<boolean> = Object.create(null);
        /* tslint:enable:no-null-keyword */

        if (options.ruleArguments instanceof Array) {
            const args = options.ruleArguments.length > 0 ? options.ruleArguments[0] : undefined;
            if (args) {
                if (Array.isArray(args.signatures)) {
                    args.signatures.forEach((signature: string) => (signatures[signature] = true));
                }
                if (Array.isArray(args.ignores)) {
                    args.ignores.forEach((ignore: string) => (ignores[ignore] = true));
                }
                if (args.messageIndex !== undefined) {
                    messageIndex = args.messageIndex;
                }
            }
        }

        return {
            signatures,
            messageIndex,
            ignores
        };
    }
}

interface Map<V> {
    [key: string]: V;
}

interface Options {
    readonly signatures: Map<boolean>;
    readonly messageIndex: number | undefined;
    readonly ignores: Map<boolean>;
}

type DescribingParent = {
    callInfo?: {
        callExpression: ts.CallExpression;
        argIndex: number;
    };
    ignoreUsage?: boolean;
};

function walk(ctx: Lint.WalkContext<Options>) {
    const SINGLE_QUOTE: string = `'`;
    const { signatures, messageIndex, ignores } = ctx.options;

    function checkStringLiteral(node: ts.StringLiteral): void {
        const text = node.getText();
        // The string literal is enclosed in single quotes. Treat as OK.
        if (text.length >= 2 && text[0] === SINGLE_QUOTE && text[text.length - 1] === SINGLE_QUOTE) {
            return;
        }
        const info = findDescribingParent(node);
        // Ignore strings in import and export nodes.
        if (info && info.ignoreUsage) {
            return;
        }
        const callInfo = info ? info.callInfo : undefined;
        if (callInfo && ignores[callInfo.callExpression.expression.getText()]) {
            return;
        }
        if (!callInfo || callInfo.argIndex === -1 || !signatures[callInfo.callExpression.expression.getText()]) {
            ctx.addFailureAt(node.getStart(), node.getWidth(), `Unexternalized string found: ${node.getText()}`);
            return;
        }
        // We have a string that is a direct argument into the localize call.
        const messageArg = callInfo.argIndex === messageIndex ? callInfo.callExpression.arguments[messageIndex] : undefined;
        if (messageArg && messageArg !== node) {
            ctx.addFailureAt(
                node.getStart(),
                node.getWidth(),
                `Message argument to '${callInfo.callExpression.expression.getText()}' must be a string literal.`
            );
            return;
        }
    }

    function findDescribingParent(node: ts.Node): DescribingParent | undefined {
        while (node.parent) {
            const parent: ts.Node = node.parent;

            if (tsutils.isCallExpression(parent)) {
                const callExpression = parent;
                return {
                    callInfo: {
                        callExpression,
                        argIndex: callExpression.arguments.indexOf(<ts.Expression>node)
                    }
                };
            }

            if (tsutils.isImportEqualsDeclaration(parent) || tsutils.isImportDeclaration(parent) || tsutils.isExportDeclaration(parent)) {
                return { ignoreUsage: true };
            }

            if (
                tsutils.isVariableDeclaration(parent) ||
                tsutils.isFunctionDeclaration(parent) ||
                tsutils.isPropertyDeclaration(parent) ||
                tsutils.isMethodDeclaration(parent) ||
                tsutils.isVariableDeclarationList(parent) ||
                tsutils.isInterfaceDeclaration(parent) ||
                tsutils.isClassDeclaration(parent) ||
                tsutils.isEnumDeclaration(parent) ||
                tsutils.isModuleDeclaration(parent) ||
                tsutils.isTypeAliasDeclaration(parent) ||
                tsutils.isSourceFile(parent)
            ) {
                return undefined;
            }

            node = parent;
        }
        return undefined;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isStringLiteral(node)) {
            checkStringLiteral(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
