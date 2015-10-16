
import NoStringParameterToFunctionCallWalker = require('./utils/NoStringParameterToFunctionCallWalker');

/**
 * Implementation of the no-string-based-set-timeout rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var documentRegistry = ts.createDocumentRegistry();
        var languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        var walker : Lint.RuleWalker = new NoStringParameterToFunctionCallWalker(
            sourceFile , 'setTimeout', this.getOptions(), languageService
        );
        return this.applyWithWalker(walker);
    }
}
