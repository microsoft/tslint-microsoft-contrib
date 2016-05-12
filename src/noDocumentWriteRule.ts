import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import ErrorTolerantWalker = require('./utils/ErrorTolerantWalker');
import AstUtils = require('./utils/AstUtils');

/**
 * Implementation of the no-document-write rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static WRITE_FAILURE = 'Forbidden call to document.write';
    public static WRITELN_FAILURE = 'Forbidden call to document.writeln';

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService : ts.LanguageService = ts.createLanguageService(languageServiceHost, documentRegistry);
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
        var functionName = AstUtils.getFunctionName(node);
        if (functionName === 'write' || functionName === 'writeln') {
            var leftSide : ts.Expression = (<any>node.expression).expression;
            if (leftSide) {
                var leftSideType : ts.Type = this.typeChecker.getTypeAtLocation(leftSide);
                var typeAsString : string = this.typeChecker.typeToString(leftSideType);
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
