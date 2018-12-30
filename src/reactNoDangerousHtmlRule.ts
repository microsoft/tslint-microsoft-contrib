import * as ts from 'typescript';
import { Utils } from './utils/Utils';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export interface Exception {
    file: string;
    method: string;
    comment: string;
}

interface Options {
    exceptions?: Exception[];
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'react-no-dangerous-html',
        type: 'maintainability',
        description: "Do not use React's dangerouslySetInnerHTML API.",
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '79, 85, 710'
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, { exceptions: Rule.getExceptions(this.getOptions()) });
    }

    /**
     * Exposed for testing.
     */
    /* tslint:disable:function-name */
    public static getExceptions(options: Lint.IOptions): Exception[] | undefined {
        /* tslint:enable:function-name */
        if (options.ruleArguments instanceof Array) {
            return options.ruleArguments[0];
        }
        if (options instanceof Array) {
            return options;
        }
        return undefined;
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    let currentMethodName: string = '<unknown>';

    function handleJsxOpeningElement(node: ts.JsxOpeningLikeElement): void {
        node.attributes.properties.forEach(
            (attribute: ts.JsxAttribute | ts.JsxSpreadAttribute): void => {
                if (attribute.kind === ts.SyntaxKind.JsxAttribute) {
                    const jsxAttribute: ts.JsxAttribute = <ts.JsxAttribute>attribute;
                    const attributeName = jsxAttribute.name.text;
                    if (attributeName === 'dangerouslySetInnerHTML') {
                        addFailureIfNotSuppressed(node, <ts.Identifier>jsxAttribute.name);
                    }
                }
            }
        );
    }

    function addFailureIfNotSuppressed(parent: ts.Node, node: { text: string }): void {
        if (!isSuppressed(currentMethodName)) {
            const failureString =
                'Invalid call to dangerouslySetInnerHTML in method "' +
                currentMethodName +
                '".\n' +
                '    Do *NOT* add a suppression for this warning. If you absolutely must use this API then you need\n' +
                '    to review the usage with a security expert/QE representative. If they decide that this is an\n' +
                '    acceptable usage then add the exception to xss_exceptions.json';
            const position = parent.getStart();
            ctx.addFailureAt(position, node.text.length, failureString);
        }
    }

    function isSuppressed(methodName: string): boolean {
        if (ctx.options.exceptions === undefined || ctx.options.exceptions.length === 0) {
            return false; // no file specified means the usage is not suppressed
        }
        let found = false;
        ctx.options.exceptions.forEach(
            (exception: Exception): void => {
                if (Utils.absolutePath(exception.file) === ctx.sourceFile.fileName) {
                    if (exception.method === methodName) {
                        if (exception.comment !== undefined) {
                            found = true;
                        }
                    }
                }
            }
        );
        return found;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isMethodDeclaration(node)) {
            currentMethodName = node.name.getText();
            ts.forEachChild(node, cb);
            currentMethodName = '<unknown>';
            return;
        }

        if (tsutils.isPropertyAssignment(node)) {
            const keyNode: ts.DeclarationName = node.name;

            if (keyNode.kind === ts.SyntaxKind.Identifier) {
                if (keyNode.text === 'dangerouslySetInnerHTML') {
                    addFailureIfNotSuppressed(node, <ts.Identifier>keyNode);
                }
            }
        } else if (tsutils.isJsxElement(node)) {
            handleJsxOpeningElement(node.openingElement);
        } else if (tsutils.isJsxSelfClosingElement(node)) {
            handleJsxOpeningElement(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
