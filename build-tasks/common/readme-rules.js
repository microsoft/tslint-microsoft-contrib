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

function addNewRule(name, ruleMarkup) {
    let match;
    let insertPosition;

    while ((match = praseRe.exec(readmeContent))) {
        const existingName = match[1];
        // Looks for first rule that should follow new rule.
        // Match position will be used to insert new rule row
        if (name < existingName) {
            insertPosition = match.index;
            break;
        }
    }

    // In case when new rule should be added to the end of the table - look for insret position before </tbody>
    if (insertPosition === undefined) {
        insertPosition = readmeContent.match(/\s+<\/tbody>\s+<\/table>/).index;
    }
    const contentBeforeNewRule = readmeContent.slice(0, insertPosition);
    const contentAfterNewRule = readmeContent.slice(insertPosition);
    const newContent = contentBeforeNewRule + ruleMarkup + contentAfterNewRule;
    writeFile(README_NAME, newContent);

    // To position cursor on the same line with new rule name should add 3 lines to match lines added with template
    return `./${README_NAME}:${contentBeforeNewRule.split('\n').length + 3}`;
}

module.exports = {
    getAllRules,
    addNewRule
};
