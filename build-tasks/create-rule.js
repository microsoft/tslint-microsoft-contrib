const fs = require('fs');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const { writeFile } = require('./common/files');

const questions = [
    {
        name: 'name',
        message: 'Name:',
        type: 'input',
        validate: value => {
            if (!/^[a-z0-9]+(\-[a-z0-9]+)*$/.test(value)) {
                return 'The name should consist of lowercase letters and numbers separated with "-" character.';
            }

            return true;
        }
    },
    {
        name: 'description',
        message: 'Description:',
        type: 'input',
        validate: value => {
            if (!!value && !!value.trim()) {
                return true;
            }
            return 'Please enter a description for the rule.';
        }
    },
    {
        name: 'type',
        message: 'Rule type:',
        type: 'list',
        choices: ['functionality', 'maintainability', 'style', 'typescript'],
        default: 'maintainability'
    },
    {
        name: 'issueClass',
        message: 'Issue class:',
        type: 'list',
        choices: ['SDL', 'Non-SDL', 'Ignored'],
        default: 'Non-SDL'
    },
    {
        name: 'issueType',
        message: 'Issue type:',
        type: 'list',
        choices: ['Error', 'Warning'],
        default: 'Warning'
    },
    {
        name: 'severity',
        message: 'Severity:',
        type: 'list',
        choices: ['Critical', 'Important', 'Moderate', 'Low'],
        default: 'Low'
    },
    {
        name: 'level',
        message: 'Level:',
        type: 'list',
        choices: ['Mandatory', 'Opportunity for Excellence'],
        default: 'Opportunity for Excellence'
    },
    {
        name: 'group',
        message: 'Group:',
        type: 'list',
        choices: ['Clarity', 'Configurable', 'Correctness', 'Deprecated', 'Ignored', 'Security', 'Whitespace'],
        default: 'Clarity'
    }
];

inquirer.prompt(questions).then(answers => {
    const sourceFileName = createImplementationFile(answers);
    const testFileName = createTestFiles(answers.name);

    console.log(`Rule '${answers.name}' created.`);
    console.log(`Source file: ${sourceFileName}`);
    console.log(`Test file:   ${testFileName}`);

    // If we're running in the VS Code terminal, try to open the
    // new files. If we can't do it, then it's not a big deal.
    if (process.env.VSCODE_CWD) {
        try {
            execSync(`code "${testFileName}"`);
            execSync(`code "${sourceFileName}"`);
        } catch (ex) {
            // Couldn't open VS Code.
            console.log(ex);
        }
    }
});

function createImplementationFile(answers) {
    const ruleFile = camelCase(answers.name) + 'Rule';
    const sourceFileName = 'src/' + ruleFile + '.ts';
    const walkerName = pascalCase(ruleFile) + 'Walker';

    const ruleTemplate = require('./templates/rule.template');
    const ruleSource = ruleTemplate({
        ruleName: answers.name,
        walkerName,
        type: answers.type,
        description: answers.description,
        issueClass: answers.issueClass,
        issueType: answers.issueType,
        severity: answers.severity,
        level: answers.level,
        group: answers.group
    });

    writeFile(sourceFileName, ruleSource);

    return sourceFileName;
}

function createTestFiles(ruleName) {
    const testsFolder = 'tests/' + ruleName;
    const testFile = testsFolder + '/test.ts.lint';
    const lintFile = testsFolder + '/tslint.json';
    const testContent = '// Code that should be checked by rule';
    const tslintContent = {
        rules: {
            [ruleName]: true
        }
    };

    if (!fs.existsSync(testsFolder)) {
        fs.mkdirSync(testsFolder);
    }

    writeFile(testFile, testContent);
    writeFile(lintFile, JSON.stringify(tslintContent, undefined, 4));

    return testFile;
}

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}

function pascalCase(input) {
    return input.charAt(0).toUpperCase() + input.substr(1);
}
