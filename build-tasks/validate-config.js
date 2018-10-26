/**
 * Makes sure all the rules in the project are defined to run during the build.
 */

const { yellowBright } = require('chalk');
const { readJSON } = require('./common/files');
const { getAllRuleNames } = require('./common/meta');

const tslintConfig = readJSON('tslint.json');

const rulesToSkip = new Set([
    'align',                              // no need
    'ban-types',
    'comment-format',                     // no need
    'completed-docs',                     // no need
    'cyclomatic-complexity',              // too strict
    'deprecation',                        // requires type checking
    'file-header',                        // no need
    'file-name-casing',                   // too strict
    'interface-name',                     // no need
    'match-default-export-name',          // requires type checking
    'max-classes-per-file',               // no need
    'max-file-line-count',                // no need
    'member-ordering',                    // too strict
    'newline-before-return',              // kind of a silly rule
    'newline-per-chained-call',           // too strict
    'no-dynamic-delete',                  // too strict
    'no-empty-line-after-opening-brace',  // too strict
    'no-inferrable-types',                // we prefer the opposite
    'no-multiline-string',                // too strict
    'no-non-null-assertion',              // in fact we prefer the opposite rule
    'no-parameter-reassignment',          // turn this on eventually
    'no-relative-imports',                // this project uses relative imports
    'no-unexternalized-strings',          // this is a VS Code specific rule
    'no-unnecessary-type-assertion',      // requires type checking
    'no-unused-variable',                 // requires type checking
    'ordered-imports',                    // too difficult to turn on
    'prefer-conditional-expression',      // not sure if this is needed
    'prefer-switch',                      // no need
    'prefer-template',                    // rule does not handle multi-line strings nicely
    'prefer-while',                       // not sure if this is needed
    'return-undefined',                   // requires type checking
    'type-literal-delimiter',             // not sure if this is needed
    'typedef-whitespace',                 // too strict
    'use-default-type-parameter'          // requires type checking
]);

const errors = [];
getAllRuleNames().forEach(ruleName => {
    if (rulesToSkip.has(ruleName)) {
        return;
    }
    if (tslintConfig.rules[ruleName] !== true && tslintConfig.rules[ruleName] !== false) {
        if (tslintConfig.rules[ruleName] === undefined || tslintConfig.rules[ruleName][0] !== true) {
            errors.push('A rule was found that is not enabled on the project: ' + ruleName);
        }
    }
});

if (errors.length > 0) {
    console.log(yellowBright(errors.join('\n')));
    process.exit(1);
}
