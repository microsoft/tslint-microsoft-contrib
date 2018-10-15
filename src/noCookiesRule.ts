import * as ts from 'typescript';
import * as Lint from 'tslint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

export class Rule extends Lint.Rules.TypedRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-cookies',
        type: 'maintainability',
        description: 'Do not use cookies',
        options: null,
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
        return this.applyWithWalker(new NoCookiesWalker(sourceFile, this.getOptions(), program));
    }
}

class NoCookiesWalker extends ErrorTolerantWalker {
    private typeChecker : ts.TypeChecker;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, program: ts.Program) {
        super(sourceFile, options);
        this.typeChecker = program.getTypeChecker();
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        const propertyName = node.name.text;
        if (propertyName === 'cookie') {
            const leftSide : ts.Expression = node.expression;
            try {
                const leftSideType: ts.Type = this.typeChecker.getTypeAtLocation(leftSide);
                const typeAsString: string = this.typeChecker.typeToString(leftSideType);
                if (leftSideType.flags === ts.TypeFlags.Any || typeAsString === 'Document') {
                    this.addFailureAt(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING);
                }
            } catch (e) {
                // the error thrown seems like a tslint error
                if (leftSide.getFullText().trim() === 'document') {
                    this.addFailureAt(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING);
                }
            }
        }

        super.visitPropertyAccessExpression(node);
    }

}
