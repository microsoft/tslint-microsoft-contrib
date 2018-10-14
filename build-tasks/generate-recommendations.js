/**
 * Generates the recommended_ruleset.js file.
 */

const common = require('./common');
const groupedRows = {};
const warnings = [];

common.getAllRules().forEach(ruleFile => {
    const metadata = common.getMetadataFromFile(ruleFile);

    const groupName = common.getMetadataValue(metadata, 'group');
    if (groupName === 'Ignored') {
        return;
    }
    if (groupName === '') {
        warnings.push('Could not generate recommendation for rule file: ' + ruleFile);
    }
    if (groupedRows[groupName] === undefined) {
        groupedRows[groupName] = [];
    }

    let recommendation = common.getMetadataValue(metadata, 'recommendation', true, true);
    if (recommendation === '') {
        recommendation = 'true,';
    }
    const ruleName = common.getMetadataValue(metadata, 'ruleName');
    groupedRows[groupName].push(`        "${ruleName}": ${recommendation}`);
});

if (warnings.length > 0) {
    console.warn('\n' + warnings.join('\n'));
    process.exit(1);
}
Object.keys(groupedRows).forEach(groupName => groupedRows[groupName].sort());

let data = common.readFile('templates/recommended_ruleset.js.snippet');
data = data.replace('%security_rules%',       groupedRows.Security.join('\n'));
data = data.replace('%correctness_rules%',    groupedRows.Correctness.join('\n'));
data = data.replace('%clarity_rules%',        groupedRows.Clarity.join('\n'));
data = data.replace('%whitespace_rules%',     groupedRows.Whitespace.join('\n'));
data = data.replace('%configurable_rules%',   groupedRows.Configurable.join('\n'));
data = data.replace('%deprecated_rules%',     groupedRows.Deprecated.join('\n'));
data = data.replace('%accessibilityy_rules%', groupedRows.Accessibility.join('\n'));

common.writeFile('recommended_ruleset.js', data);
