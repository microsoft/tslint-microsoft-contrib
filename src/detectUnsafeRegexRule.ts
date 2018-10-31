import * as ts from 'typescript';
import * as Lint from 'tslint';
// tslint:disable-next-line:no-require-imports safe-regex isn't a module
import safeRegex = require('safe-regex');

import { ExtendedMetadata } from './utils/ExtendedMetadata';

/**
 * Implementation of the detect-unsafe-regex rule.
 */
export class Rule extends Lint.Rules.TypedRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'detect-unsafe-regex',
        type: 'functionality',
        description: 'Checks for safe regular expressions',
        options: undefined,
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Non-SDL',
        issueType: 'Error',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Security',
        commonWeaknessEnumeration: '624'
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithWalker(new DetectUnsafeRegexRuleWalker(sourceFile, this.getOptions(), program));
    }
}

const ERROR_MESSAGE_UNSAFE = 'Unsafe RegExp detected, this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS';
const ERROR_MESSAGE_NON_LITERAL = 'Non literal RegExp detected, '
    + 'this can lead to ReDos vulnerabilities: https://en.wikipedia.org/wiki/ReDoS if the pattern comes from untrusted input';

class DetectUnsafeRegexRuleWalker extends Lint.RuleWalker {

    private readonly typeChecker: ts.TypeChecker;
    // keep track of visited pattern litterals to avoid double reporting on `new RegExp(/a/)`
    private readonly visitedPatternLitterals: Set<ts.Node> = new Set();

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, program: ts.Program) {
        super(sourceFile, options);
        this.typeChecker = program.getTypeChecker();
    }

    protected visitCallExpression(node: ts.CallExpression): void {
        this.visitCallOrNew(node);
        super.visitCallExpression(node);
    }

    protected visitNewExpression(node: ts.NewExpression): void {
        this.visitCallOrNew(node);
        super.visitNewExpression(node);
    }

    protected visitRegularExpressionLiteral(node: ts.Node): void {
        this.visitPattern(node);
        super.visitRegularExpressionLiteral(node);
    }

    private visitCallOrNew(node: ts.CallExpression | ts.NewExpression): void {

        const nodeType = this.typeChecker.getTypeAtLocation(node);
        // NB: this is a bug in ts where IntrinsicType has no symbol property
        const name = nodeType.symbol && this.typeChecker.getFullyQualifiedName(nodeType.symbol);
        if (name !== 'RegExp' || !node.arguments) {
            return;
        }

        const pattern = node.arguments[0];
        const flags = node.arguments[1];

        this.visitPattern(pattern);

        if (flags && !ts.isStringLiteralLike(flags)) {
            this.addFailureAtNode(node.arguments[1], ERROR_MESSAGE_NON_LITERAL);
        }
    }

    private visitPattern(node?: ts.Node) {
        if (!node || this.visitedPatternLitterals.has(node)) {
            return;
        }
        this.visitedPatternLitterals.add(node);
        let text: string | undefined;

        if (ts.isStringLiteralLike(node)) {
            text = node.text;
        } else {
            if (ts.isRegularExpressionLiteral(node)) {
                const matches = (/^\/(.*)\/[a-z]*$/i).exec(node.text);
                text = matches && matches[1] || undefined;
            } else {
                this.addFailureAtNode(node, ERROR_MESSAGE_NON_LITERAL);
                return;
            }
        }

        const isSafe = !text || (text && safeRegex(text));

        if (!isSafe) {
            this.addFailureAtNode(node, ERROR_MESSAGE_UNSAFE);
        }
    }
}
