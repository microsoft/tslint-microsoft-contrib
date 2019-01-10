/**
 * Makes sure all the rules in the project are defined to run during the build.
 */

const { yellow, yellowBright } = require('chalk');
const { readJSONWithComments } = require('./common/files');
const { getContribRuleNames } = require('./common/meta');

const tslintConfig = readJSONWithComments('tslint.json');

function ruleIsEnabled(value) {
    if (value === undefined) {
        return false;
    }

    if (typeof value === 'boolean') {
        return value;
    }

    return value[0];
}

const disabledRules = new Set([
    'missing-jsdoc',
    'no-duplicate-case',
    'no-empty-interfaces',
    'no-empty-line-after-opening-brace',
    'no-function-constructor-with-string-args',
    'no-increment-decrement',
    'no-multiline-string',
    'no-reserved-keywords',
    'no-relative-imports',
    'no-stateless-class',
    'no-unexternalized-strings',
    'no-unnecessary-bind',
    'no-unnecessary-semicolons',
    'no-var-self',
    'react-tsx-curly-spacing',
    'valid-typeof'
]);

const errors = [];
getContribRuleNames().forEach(ruleName => {
    if (disabledRules.has(ruleName)) {
        return;
    }

    if (!ruleIsEnabled(tslintConfig.rules[ruleName])) {
        errors.push('A tslint-microsoft-contrib rule was found that is not enabled on the project: ' + ruleName);
    }
});

if (errors.length > 0) {
    console.log(yellow(errors.join('\n')));
    console.log(yellowBright(`Add the missing rule${errors.length === 1 ? '' : 's'} to tslint.json.`));
    process.exit(1);
}
