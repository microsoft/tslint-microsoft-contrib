import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {SyntaxKind} from './utils/SyntaxKind';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-unexternalized-strings rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-unexternalized-strings',
        type: 'maintainability',
        description: 'Ensures that double quoted strings are passed to a localize call to provide proper strings for different locales',
        options: null,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Configurable',
        recommendation: 'false, // the VS Code team has a specific localization process that this rule enforces'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoUnexternalizedStringsRuleWalker(sourceFile, this.getOptions()));
    }
}

interface Map<V> {
    [key: string]: V;
}

interface UnexternalizedStringsOptions {
    signatures?: string[];
    messageIndex?: number;
    ignores?: string[];
}

class NoUnexternalizedStringsRuleWalker extends ErrorTolerantWalker {
    private static SINGLE_QUOTE: string = '\'';

    private signatures: Map<boolean>;
    private messageIndex: number;
    private ignores: Map<boolean>;

    constructor(sourceFile: ts.SourceFile, opt: Lint.IOptions) {
        super(sourceFile, opt);
        this.signatures = Object.create(null);
        this.ignores = Object.create(null);
        const options: any[] = this.getOptions();
        const first: UnexternalizedStringsOptions = options && options.length > 0 ? options[0] : null;
        if (first) {
            if (Array.isArray(first.signatures)) {
                first.signatures.forEach((signature: string) => this.signatures[signature] = true);
            }
            if (Array.isArray(first.ignores)) {
                first.ignores.forEach((ignore: string) => this.ignores[ignore] = true);
            }
            if (first.messageIndex !== undefined) {
                this.messageIndex = first.messageIndex;
            }
        }
    }

    protected visitStringLiteral(node: ts.StringLiteral): void {
        this.checkStringLiteral(node);
        super.visitStringLiteral(node);
    }

    private checkStringLiteral(node: ts.StringLiteral): void {
        const text = node.getText();
        // The string literal is enclosed in single quotes. Treat as OK.
        if (text.length >= 2 && text[0] === NoUnexternalizedStringsRuleWalker.SINGLE_QUOTE
            && text[text.length - 1] === NoUnexternalizedStringsRuleWalker.SINGLE_QUOTE) {
            return;
        }
        const info = this.findDescribingParent(node);
        // Ignore strings in import and export nodes.
        if (info && info.ignoreUsage) {
            return;
        }
        const callInfo = info ? info.callInfo : null;
        if (callInfo  && this.ignores[callInfo.callExpression.expression.getText()]) {
            return;
        }
        if (!callInfo || callInfo.argIndex === -1 || !this.signatures[callInfo.callExpression.expression.getText()]) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), `Unexternalized string found: ${node.getText()}`));
            return;
        }
        // We have a string that is a direct argument into the localize call.
        const messageArg: ts.Expression = callInfo.argIndex === this.messageIndex
            ? callInfo.callExpression.arguments[this.messageIndex]
            : null;
        if (messageArg && messageArg !== node) {
            this.addFailure(this.createFailure(
                messageArg.getStart(), messageArg.getWidth(),
                `Message argument to '${callInfo.callExpression.expression.getText()}' must be a string literal.`));
            return;
        }
    }

    private findDescribingParent(node: ts.Node):
            { callInfo?:  { callExpression: ts.CallExpression, argIndex: number }, ignoreUsage?: boolean; } {
        const kinds = SyntaxKind.current();
        while ((node.parent != null)) {
            const parent: ts.Node = node.parent;
            const kind = parent.kind;
            if (kind === kinds.CallExpression) {
                const callExpression = <ts.CallExpression>parent;
                return { callInfo: { callExpression: callExpression, argIndex: callExpression.arguments.indexOf(<any>node) }};
            } else if (kind === kinds.ImportEqualsDeclaration || kind === kinds.ImportDeclaration || kind === kinds.ExportDeclaration) {
                return { ignoreUsage: true };
            } else if (kind === kinds.VariableDeclaration || kind === kinds.FunctionDeclaration || kind === kinds.PropertyDeclaration
                || kind === kinds.MethodDeclaration || kind === kinds.VariableDeclarationList || kind === kinds.InterfaceDeclaration
                || kind === kinds.ClassDeclaration || kind === kinds.EnumDeclaration || kind === kinds.ModuleDeclaration
                || kind === kinds.TypeAliasDeclaration || kind === kinds.SourceFile) {
                    return null;
            }
            node = parent;
        }
    }
}