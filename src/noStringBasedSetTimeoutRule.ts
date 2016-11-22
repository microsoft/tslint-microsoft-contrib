import * as ts from 'typescript';
import * as Lint from 'tslint';

import {NoStringParameterToFunctionCallWalker} from './utils/NoStringParameterToFunctionCallWalker';
import {ExtendedMetadata} from './utils/ExtendedMetadata';

/**
 * Implementation of the no-string-based-set-timeout rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

    public static metadata: ExtendedMetadata = {
        ruleName: 'no-string-based-set-timeout',
        type: 'maintainability',
        description: 'Do not use the version of setTimeout that accepts code as a string argument.',
        options: null,
        optionsDescription: "",
        typescriptOnly: true,
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
            sourceFile , 'setTimeout', this.getOptions(), languageService
        );
        return this.applyWithWalker(walker);
    }
}
