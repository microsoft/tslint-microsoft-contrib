import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { Utils } from './utils/Utils';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

interface Options {
    allExceptions?: string[] | undefined;
}

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-http-string',
        type: 'maintainability',
        /* tslint:disable:no-http-string */
        description: "Do not use strings that start with 'http:'. URL strings should start with 'https:'. ",
        /* tslint:enable:no-http-string */
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        recommendation: '[true, "http://www.example.com/?.*", "http://localhost:?.*"],',
        commonWeaknessEnumeration: '319'
    };

    public static FAILURE_STRING: string = 'Forbidden http url in string: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.getOptions()));
    }
}

function parseOptions(options: Lint.IOptions): Options {
    let value;

    if (options.ruleArguments instanceof Array) {
        value = options.ruleArguments;
    } else if (options instanceof Array) {
        value = options;
    }

    return {
        allExceptions: value
    };
}

function walk(ctx: Lint.WalkContext<Options>) {
    function cb(node: ts.Node): void {
        if (tsutils.isTextualLiteral(node)) {
            visitLiteralExpression(node);
        } else if (node.kind === ts.SyntaxKind.TemplateHead) {
            visitLiteralExpression(<ts.TemplateHead>node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function visitLiteralExpression(node: ts.LiteralExpression | ts.LiteralLikeNode): void {
        const stringText: string = node.text;
        // tslint:disable-next-line no-http-string
        if (stringText.indexOf('http:') === 0) {
            if (!isSuppressed(stringText)) {
                const failureString = Rule.FAILURE_STRING + "'" + stringText + "'";
                ctx.addFailureAt(node.getStart(), node.getWidth(), failureString);
            }
        }
    }

    function isSuppressed(stringText: string): boolean {
        const { allExceptions } = ctx.options;
        return Utils.exists(
            allExceptions,
            (exception: string): boolean => {
                return new RegExp(exception).test(stringText);
            }
        );
    }
}
