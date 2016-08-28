import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-cookies-rule rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-cookies',
        type: 'maintainability',
        description: 'Do not use cookies',
        options: null,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '315, 539, 565, 614'
    };

    public static FAILURE_STRING = 'Forbidden call to document.cookie';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        const documentRegistry = ts.createDocumentRegistry();
        const languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        const languageService : ts.LanguageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoCookiesWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoCookiesWalker extends ErrorTolerantWalker {
    private languageService : ts.LanguageService;
    private typeChecker : ts.TypeChecker;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService : ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
        this.typeChecker = languageService.getProgram().getTypeChecker();
    }


    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): void {
        const propertyName = node.name.text;
        if (propertyName === 'cookie') {
            const leftSide : ts.Expression = node.expression;
            try {
                const leftSideType: ts.Type = this.typeChecker.getTypeAtLocation(leftSide);
                const typeAsString: string = this.typeChecker.typeToString(leftSideType);
                if (leftSideType.flags === ts.TypeFlags.Any || typeAsString === 'Document') {
                    this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING));
                }
            } catch (e) {
                /* tslint:disable:no-suspicious-comment */
                // TODO: this error seems like a tslint error
                /* tslint:enable:no-suspicious-comment */
                if (leftSide.getFullText().trim() === 'document') {
                    this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.FAILURE_STRING));
                }
            }
        }

        super.visitPropertyAccessExpression(node);
    }

}
