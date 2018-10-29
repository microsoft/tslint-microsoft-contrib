/**
 * Makes sure all the rules in the project are defined to run during the build.
 */

const { yellow, yellowBright } = require('chalk');
const { readJSONWithComments } = require('./common/files');
const { getContribRuleNames } = require('./common/meta');

const tslintConfig = readJSONWithComments('tslint.json');

const disabledRules = new Set([
    "no-duplicate-case",
    "no-empty-interfaces",
    "no-stateless-class",
    "no-var-self",
    "valid-typeof",
]);

const errors = [];
getContribRuleNames().forEach(ruleName => {
    if (disabledRules.has(ruleName)) {
        return;
    }

    if (tslintConfig.rules[ruleName] !== true && tslintConfig.rules[ruleName] !== false) {
        if (tslintConfig.rules[ruleName] === undefined || tslintConfig.rules[ruleName][0] !== true) {
            errors.push('A tslint-microsoft-contrib rule was found that is not enabled on the project: ' + ruleName);
        }
    }
});

if (errors.length > 0) {
    console.log(yellow(errors.join('\n')));
    console.log(yellowBright(`Add the missing rule${errors.length === 1 ? '' : 's'} to tslint.json.`));
    process.exit(1);
}
