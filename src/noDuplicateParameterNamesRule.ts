import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-duplicate-parameter-names',
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
        recommendation: 'false, // now supported by TypeScript compiler'
    };

    public static FAILURE_STRING: string = 'Duplicate parameter name: ';

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
            const seenNames: { [index: string]: boolean } = {};
            node.parameters.forEach(
                (parameter: ts.ParameterDeclaration): void => {
                    const parameterName: string = parameter.name.getText(); // how does one check if the union type is Identifier?
                    if (parameterName !== undefined) {
                        if (seenNames[parameterName]) {
                            ctx.addFailureAt(
                                parameter.name.getStart(),
                                parameterName.length,
                                Rule.FAILURE_STRING + "'" + parameterName + "'"
                            );
                        } else {
                            seenNames[parameterName] = true;
                        }
                    }
                }
            );
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
