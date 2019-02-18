/**
 * Generates config/stable.json.
 * The `recommended` metadata for each rule is added there, except if...
 *  - ...the rule's `metadata.group` is `'Ignored'`
 *  - ...the rule is also mentioned in config/latest.json (which would be a breaking change)
 *  - ...the recommended setting starts with `false` (the rule is likely deprecated)
 */

const { writeFile } = require('./common/files');
const { getAllRules, getMetadataFromFile, getMetadataValue } = require('./common/meta');

const recommendations = [];

const latestRules = new Set(Object.keys(require('../configs/latest.json').rules));

getAllRules({
    ignoreTslintRules: true
}).forEach(ruleFile => {
    const metadata = getMetadataFromFile(ruleFile);
    const ruleName = getMetadataValue(metadata, 'ruleName');

    const groupName = getMetadataValue(metadata, 'group');
    if (groupName === 'Ignored') {
        return;
    }

    let recommendation = getMetadataValue(metadata, 'recommendation', true, true);
    if (recommendation === '') {
        recommendation = 'true';
    }

    // Don't mention rules recommended as disabled
    if (recommendation.startsWith('false')) {
        return;
    }

    // Don't mention rules added to the 'latest' preset, as adding them to stable.json would be a breaking change
    if (latestRules.has(ruleName)) {
        return;
    }

    recommendations.push(`        "${ruleName}": ${recommendation}`);
});

const stableTemplate = require('./templates/stable.json.template');

writeFile('configs/stable.json', stableTemplate(recommendations));
