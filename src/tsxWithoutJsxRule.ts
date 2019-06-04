import * as ts from 'typescript';
import * as Lint from 'tslint';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

const FAILURE_STRING: string = 'Files with .tsx/.jsx extension should contain JSX Elements. Rename to .ts/.js instead.';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'tsx-without-jsx',
        type: 'maintainability',
        description: "All .tsx/.jsx files should contain JSX elements to clarify the file's purpose.",
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: false,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        commonWeaknessEnumeration: '1164'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    if (!ctx.sourceFile.fileName.match(/\.(t|j)sx$/i)) {
        return;
    }

    let jsxElementFound = false;
    const walker = (node: ts.Node) => {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
            jsxElementFound = true;
            return;
        }

        ts.forEachChild(node, walker);
    };

    ts.forEachChild(ctx.sourceFile, walker);

    if (!jsxElementFound) {
        ctx.addFailureAtNode(ctx.sourceFile, FAILURE_STRING);
    }
}
