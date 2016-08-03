import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

import {NoStringParameterToFunctionCallWalker} from './utils/NoStringParameterToFunctionCallWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-string-based-set-interval rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-string-based-set-interval',
        type: 'maintainability',
        description: 'Do not use the version of setInterval that accepts code as a string argument.',
        options: null,
        issueClass: 'SDL',
        issueType: 'Error',
        severity: 'Critical',
        level: 'Mandatory',
        group: 'Security',
        commonWeaknessEnumeration: '95, 676, 242, 116'
    };

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
