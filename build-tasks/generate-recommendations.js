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

const recommendedTemplate = require('./templates/recommended_ruleset.template');
const data = recommendedTemplate(groupedRows);

common.writeFile('recommended_ruleset.js', data);
