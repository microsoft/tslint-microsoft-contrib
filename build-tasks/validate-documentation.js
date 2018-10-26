/**
 * Validates that all rules defined in src are documented in README.md
 * and validates that the package.json version is the same version defined in README.md.
 */

const { readFile, readJSON } = require('./common/files');
const { getAllFormatterNames, getAllRuleNames } = require('./common/meta');

const readmeText = readFile('README.md');
const packageJson = readJSON('package.json');
const validationErrors = [];

getAllRuleNames({ skipTsLintRules: true }).forEach(ruleName => {
    if (readmeText.indexOf(ruleName) === -1) {
        validationErrors.push('A rule was found that is not documented in README.md: ' + ruleName);
    }
});

getAllFormatterNames().forEach(formatterName => {
    if (readmeText.indexOf(formatterName) === -1) {
        validationErrors.push('A formatter was found that is not documented in README.md: ' + formatterName);
        validationFailed = true;
    }
});

if (readmeText.indexOf('[npm-' + packageJson.version + ']') === -1) {
    validationErrors.push('Version not documented in README.md correctly.\n' +
    'package.json declares: ' + packageJson.version + '\n' +
    'README.md declares something different.');
}

if (validationErrors.length > 0) {
    console.warn(validationErrors.join('\n'));
    process.exit(1);
}
