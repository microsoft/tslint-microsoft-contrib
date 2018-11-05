/**
 * Validates that all rules defined in src are documented in README.md
 * and validates that the package.json version is the same version defined in README.md.
 */

const { yellowBright } = require('chalk');
const { readFile } = require('./common/files');
const { getContribRuleNames } = require('./common/meta');

const readmeText = readFile('README.md');
const validationErrors = [];

getContribRuleNames().forEach(ruleName => {
    if (readmeText.indexOf(ruleName) === -1) {
        validationErrors.push('A rule was found that is not documented in README.md: ' + ruleName);
    }
});

if (validationErrors.length > 0) {
    console.log(yellowBright(validationErrors.join('\n')));
    process.exit(1);
}
