import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';

import { ExtendedMetadata } from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: ExtendedMetadata = {
        ruleName: 'no-cookies',
        type: 'maintainability',
        description: 'Do not use cookies',
        options: null, // tslint:disable-line:no-null-keyword
        optionsDescription: '',
        typescriptOnly: true,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '315, 539, 565, 614'
    };

    public static FAILURE_STRING: string = 'Forbidden call to document.cookie';

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, undefined, program);
    }
}

function walk(ctx: Lint.WalkContext<void>, program: ts.Program) {
    const typeChecker: ts.TypeChecker = program.getTypeChecker();

    function cb(node: ts.Node): void {
        if (tsutils.isPropertyAccessExpression(node)) {
            const propertyName = node.name.text;
            if (propertyName === 'cookie') {
                const leftSide: ts.Expression = node.expression;
                try {
                    const leftSideType: ts.Type = typeChecker.getTypeAtLocation(leftSide);
                    const typeAsString: string = typeChecker.typeToString(leftSideType);
                    if (leftSideType.flags === ts.TypeFlags.Any || typeAsString === 'Document') {
                        ctx.addFailureAt(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING);
                    }
                } catch (e) {
                    // the error thrown seems like a tslint error
                    if (leftSide.getFullText().trim() === 'document') {
                        ctx.addFailureAt(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING);
                    }
                }
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
