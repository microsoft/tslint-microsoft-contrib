const fs = require('fs');
const { red } = require('chalk');
const { readJSON, writeFile } = require('./common/files');

const ruleName = getRuleName();
validateAguments();

const ruleFile = camelCase(ruleName) + 'Rule';
const sourceFileName = 'src/' + ruleFile + '.ts';
const testsFolder = 'tests/' + ruleName;
const testFile = testsFolder + '/test.ts.lint';
const lintFile = testsFolder + '/tslint.json';

createImplementationFile();
createTestFiles();
addToConfig();

console.log('Rule created');
console.log('Rule source: ' + sourceFileName);
console.log('Test file: ' + testFile);

function getRuleName() {
    const option = process.argv.find(str => str.startsWith('--rule-name'));

    if (!option) {
        return;
    }

    return option.split('=')[1];
}

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}

function validateAguments() {
    const USAGE_EXAMPLE = '\nUsage example:\nnpm run create-rule -- --rule-name=no-something-or-other\n';

    if (!ruleName) {
        console.log(red('--rule-name parameter is required.' + USAGE_EXAMPLE));
        process.exit(1);
    }

    if (!/^[a-z0-9]+(\-[a-z0-9]+)*$/.test(ruleName)) {
        console.log(red('Rule name should consist of lowercase letters and numbers separated with "-" character.' + USAGE_EXAMPLE));
        process.exit(1);
    }
}

function createImplementationFile() {
    const walkerName = ruleFile.charAt(0).toUpperCase() + ruleFile.substr(1) + 'Walker';

    const ruleTemplate = require('./templates/rule.template');
    const ruleSource = ruleTemplate({ruleName, walkerName});

    writeFile(sourceFileName, ruleSource);
}

function createTestFiles() {
    const testContent = '// Code that should be checked by rule';
    const tslintContent = {
        rules: {
            [ruleName]: true
        }
    };

    fs.mkdirSync(testsFolder);

    writeFile(testFile, testContent);
    writeFile(lintFile, JSON.stringify(tslintContent, undefined, 2));
}

function addToConfig() {
    const currentRuleset = readJSON('tslint.json');

    currentRuleset.rules[ruleName] = true;

    writeFile('tslint.json', JSON.stringify(currentRuleset, undefined, 2));
}
