
import NoStringParameterToFunctionCallWalker = require('./utils/NoStringParameterToFunctionCallWalker');

/**
 * Implementation of the no-string-parameter-to-function-call rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        var languageServiceHost;
        var documentRegistry = ts.createDocumentRegistry();
        languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        var languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        var walker : Lint.RuleWalker = new NoStringParameterToFunctionCallWalker(
            sourceFile , 'setImmediate', this.getOptions(), languageService
        );
        return this.applyWithWalker(walker);
    }
}
