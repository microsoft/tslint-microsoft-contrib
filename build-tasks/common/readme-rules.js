const { readFile, writeFile } = require('./files');

// Matches <tr>, <td>, and <code> openning tags with only whitespace surrounding them
// Capturing group for rule name inside <code> and </code> tags with possible whitespace around it
const praseRe = /\s+<tr>\s*?<td>\s*?<code>\s*?([0-9a-z-]*?)\s*?<\/code>/g;
const README_NAME = 'README.md';
const readmeContent = readFile(README_NAME);

function getAllRules() {
    const rules = [];
    let match;

    while ((match = praseRe.exec(readmeContent))) {
        rules.push(match[1]);
    }

    return rules;
}

module.exports = {
    getAllRules
};
