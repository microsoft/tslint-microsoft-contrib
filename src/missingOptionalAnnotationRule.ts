import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'missing-optional-annotation',
        type: 'maintainability',
        description: 'Deprecated - This rule is now enforced by the TypeScript compiler',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        level: 'Opportunity for Excellence',
        group: 'Deprecated',
        recommendation: 'false'
    };

    public static FAILURE_STRING: string = 'Argument following optional argument missing optional annotation: ';

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk);
    }
}

function walk(ctx: Lint.WalkContext<void>) {
    function cb(node: ts.Node): void {
        if (
            tsutils.isMethodDeclaration(node) ||
            tsutils.isConstructorDeclaration(node) ||
            tsutils.isArrowFunction(node) ||
            tsutils.isFunctionDeclaration(node) ||
            tsutils.isFunctionExpression(node)
        ) {
            validateParameters(node);
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);

    function validateParameters(node: ts.SignatureDeclaration) {
        let optionalParameterFound = false;
        if (node.parameters === undefined) {
            return;
        }
        node.parameters.forEach(
            (parameter: ts.ParameterDeclaration): void => {
                if (parameter.questionToken !== undefined || parameter.initializer !== undefined) {
                    optionalParameterFound = true;
                } else if (optionalParameterFound && parameter.initializer === undefined) {
                    // we found a non-optional parameter that comes *after* an optional parameter
                    const msg = Rule.FAILURE_STRING + parameter.getFullText();
                    ctx.addFailureAt(parameter.name.getStart(), parameter.name.getWidth(), msg);
                }
            }
        );
    }
}
