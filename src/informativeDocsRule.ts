import * as Lint from 'tslint';
import * as ts from 'typescript';

import { getApparentJsDoc, getNodeName } from './utils/NodeDocs';
import { ExtendedMetadata } from './utils/ExtendedMetadata';

const defaultUselessWords = ['a', 'an', 'of', 'our', 'the'];

const defaultAliases: { [i: string]: string[] } = {
    a: ['an', 'our']
};

const failureString = 'This comment is roughly the same as the object\'s name. Either be more informative or don\'t include a comment.';

interface RawOptions {
    aliases?: { [i: string]: string[] };
    uselessWords?: string[];
}

interface Options {
    aliases: Map<string, string>;
    uselessWords: Set<string>;
}

/**
 * Implementation of the informative-docs rule.
 */
export class Rule extends Lint.Rules.AbstractRule {
    public static metadata: ExtendedMetadata = {
        description: 'Enforces that comments do more than just reiterate names of objects.',
        options: undefined,
        optionsDescription: 'Not configurable.',
        optionExamples: [
            true,
            [true, {
                aliases: {
                    a: ['an', 'our'],
                    emoji: ['smiley']
                },
                uselessWords: [...defaultUselessWords, 'also']
            }]
        ],
        rationale: Lint.Utils.dedent`
            The documentation for an object should not be equivalent to just the object's name.
            If we strip out non-alphabet characters, common words such as "the" or "a",
            and lowercase everything, they shouldn't be the same.

            Using informative documentation can be helpful for variables to help explain their usage.
            Alternately, if something's name is so descriptive that it doesn't need to be fully documented,
            just leave out documentation altogether.
        `,
        issueClass: 'Non-SDL',
        issueType: 'Warning',
        severity: 'Moderate',
        level: 'Opportunity for Excellence',
        group: 'Clarity',
        recommendation: 'true,',
        ruleName: 'informative-docs',
        type: 'maintainability',
        typescriptOnly: false
    };

    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, parseOptions(this.getOptions().ruleArguments));
    }
}

function parseOptions(ruleArguments: unknown[]): Options {
    const rawOptions: RawOptions = ruleArguments.length === 0
        ? {}
        : <RawOptions>ruleArguments[0];

    return {
        aliases: parseAliasesOption(
            rawOptions.aliases === undefined
                ? defaultAliases
                : rawOptions.aliases
        ),
        uselessWords: new Set(rawOptions.uselessWords === undefined ? defaultUselessWords : rawOptions.uselessWords)
    };
}

function parseAliasesOption(rawAliases: { [i: string]: string[] }): Map<string, string> {
    const aliases = new Map<string, string>();

    for (const alias of Object.keys(rawAliases)) {
        for (const aliasedName of rawAliases[alias]) {
            aliases.set(aliasedName.toLowerCase(), alias.toLowerCase());
        }
    }

    return aliases;
}

function walk(context: Lint.WalkContext<Options>) {
    const { aliases, uselessWords } = context.options;

    function nodeNameContainsUsefulWords(nameWords: string[], docWords: string[]): boolean {
        const realDocWords = new Set(docWords);

        for (const nameWord of nameWords) {
            realDocWords.delete(nameWord);
        }

        uselessWords.forEach((uselessWord: string): void => {
            realDocWords.delete(uselessWord);
        });

        return realDocWords.size !== 0;
    }

    function normalizeWord(word: string): string {
        word = word.toLowerCase();

        const aliasedWord = aliases.get(word);
        if (aliasedWord !== undefined) {
            word = aliasedWord;
        }

        return word;
    }

    function splitNameIntoWords(name: string): string[] | undefined {
        if (name.length > 2 && name[0] === 'I' && Lint.Utils.isUpperCase(name[1])) {
            name = name.substring(1);
        }

        const nameSpaced = name
            .replace(/\W/g, '')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .trim();

        if (nameSpaced.length === 0) {
            return undefined;
        }

        return nameSpaced
            .split(' ')
            .map(normalizeWord);
    }

    function getNodeDocComments(node: ts.Node): string[] | undefined {
        const docsRaw = getApparentJsDoc(node);
        if (docsRaw === undefined) {
            return undefined;
        }

        const docs = docsRaw
            .map((doc) => doc.comment)
            .filter((comment) => comment !== undefined);

        if (docs.length === 0) {
            return undefined;
        }

        return docs
            .join(' ')
            .replace(/[^A-Za-z0-9 ]/g, '')
            .split(' ')
            .map(normalizeWord);
    }

    function verifyNodeWithName(node: ts.Node, name: string): void {
        const docs = getNodeDocComments(node);
        if (docs === undefined) {
            return;
        }

        const nameSplit = splitNameIntoWords(name);
        if (nameSplit === undefined) {
            return;
        }

        if (!nodeNameContainsUsefulWords(nameSplit, docs)) {
            context.addFailureAtNode(node, failureString);
        }
    }

    function visitNode(node: ts.Node): void {
        const name = getNodeName(node);
        if (name !== undefined) {
            verifyNodeWithName(node, name);
        }

        return ts.forEachChild(node, visitNode);
    }

    return ts.forEachChild(context.sourceFile, visitNode);
}
