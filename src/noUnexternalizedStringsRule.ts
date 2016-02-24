import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import SyntaxKind = require('./utils/SyntaxKind');

/**
 * Implementation of the no-unexternalized-strings rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
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
        this.messageIndex = undefined;
        let options: any[] = this.getOptions();
        let first: UnexternalizedStringsOptions = options && options.length > 0 ? options[0] : null;
        if (first) {
            if (Array.isArray(first.signatures)) {
                first.signatures.forEach((signature: string) => this.signatures[signature] = true);
            }
            if (Array.isArray(first.ignores)) {
                first.ignores.forEach((ignore: string) => this.ignores[ignore] = true);
            }
            if (typeof first.messageIndex !== 'undefined') {
                this.messageIndex = first.messageIndex;
            }
        }
    }


    protected visitStringLiteral(node: ts.StringLiteral): void {
        this.checkStringLiteral(node);
        super.visitStringLiteral(node);
    }

    private checkStringLiteral(node: ts.StringLiteral): void {
        let text = node.getText();
        // The string literal is enclosed in single quotes. Treat as OK.
        if (text.length >= 2 && text[0] === NoUnexternalizedStringsRuleWalker.SINGLE_QUOTE
            && text[text.length - 1] === NoUnexternalizedStringsRuleWalker.SINGLE_QUOTE) {
            return;
        }
        let info = this.findDescribingParent(node);
        // Ignore strings in import and export nodes.
        if (info && info.ignoreUsage) {
            return;
        }
        let callInfo = info ? info.callInfo : null;
        if (callInfo  && this.ignores[callInfo.callExpression.expression.getText()]) {
            return;
        }
        if (!callInfo || callInfo.argIndex === -1 || !this.signatures[callInfo.callExpression.expression.getText()]) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), `Unexternalized string found: ${node.getText()}`));
            return;
        }
        // We have a string that is a direct argument into the localize call.
        let messageArg: ts.Expression = callInfo.argIndex === this.messageIndex
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
        let kinds = SyntaxKind.current();
        let parent: ts.Node;
        while ((parent = node.parent)) {
            let kind = parent.kind;
            if (kind === kinds.CallExpression) {
                let callExpression = parent as ts.CallExpression;
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