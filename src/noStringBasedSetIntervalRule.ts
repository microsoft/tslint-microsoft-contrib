import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import NoStringParameterToFunctionCallWalker = require('./utils/NoStringParameterToFunctionCallWalker');

/**
 * Implementation of the no-string-based-set-interval rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile : ts.SourceFile): Lint.RuleFailure[] {
        const documentRegistry = ts.createDocumentRegistry();
        const languageServiceHost = Lint.createLanguageServiceHost('file.ts', sourceFile.getFullText());
        const languageService = ts.createLanguageService(languageServiceHost, documentRegistry);

        const walker : Lint.RuleWalker = new NoStringParameterToFunctionCallWalker(
            sourceFile , 'setInterval', this.getOptions(), languageService
        );
        return this.applyWithWalker(walker);
    }
}
