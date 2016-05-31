import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {ErrorTolerantWalker} from './utils/ErrorTolerantWalker';
import {AstUtils} from './utils/AstUtils';

/**
 * Implementation of the no-document-write rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static WRITE_FAILURE = 'Forbidden call to document.write';
    public static WRITELN_FAILURE = 'Forbidden call to document.writeln';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        const documentRegistry = ts.createDocumentRegistry();
        const languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        const languageService : ts.LanguageService = ts.createLanguageService(languageServiceHost, documentRegistry);
        return this.applyWithWalker(new NoDocumentWriteWalker(sourceFile, this.getOptions(), languageService));
    }
}

class NoDocumentWriteWalker extends ErrorTolerantWalker {
    private languageService : ts.LanguageService;
    private typeChecker : ts.TypeChecker;

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions, languageService : ts.LanguageService) {
        super(sourceFile, options);
        this.languageService = languageService;
        this.typeChecker = languageService.getProgram().getTypeChecker();
    }

    protected visitCallExpression(node: ts.CallExpression) {
        const functionName = AstUtils.getFunctionName(node);
        if (functionName === 'write' || functionName === 'writeln') {
            const leftSide : ts.Expression = (<any>node.expression).expression;
            if (leftSide) {
                const leftSideType : ts.Type = this.typeChecker.getTypeAtLocation(leftSide);
                const typeAsString : string = this.typeChecker.typeToString(leftSideType);
                if (leftSideType.flags === ts.TypeFlags.Any || typeAsString === 'Document') {
                    if (functionName === 'write') {
                        this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.WRITE_FAILURE));
                    } else {
                        this.addFailure(this.createFailure(leftSide.getStart(), leftSide.getWidth(), Rule.WRITELN_FAILURE));
                    }
                }
            }
        }
        super.visitCallExpression(node);
    }
}
