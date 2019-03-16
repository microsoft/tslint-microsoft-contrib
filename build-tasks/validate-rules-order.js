const { yellowBright } = require('chalk');
const { getAllRules } = require('./common/readme-rules');

const rules = getAllRules();
const sortedRules = [].concat(rules).sort();
const mismatchIndex = rules.findIndex((name, i) => name !== sortedRules[i]);

if (mismatchIndex === -1) {
    process.exit(0);
}

const message =
    mismatchIndex === 0
        ? `First rule expecteded to be ${sortedRules[0]} but found ${rules[0]}.`
        : `Rule ${rules[mismatchIndex - 1]} should be followed by ${sortedRules[mismatchIndex]} but found ${rules[mismatchIndex]}.`;
console.log(yellowBright('Incorrect order of rules in README.md.'));
console.log(message);
process.exit(1);
