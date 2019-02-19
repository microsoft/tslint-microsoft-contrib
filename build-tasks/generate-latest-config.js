/**
 * Generates config/latest.json.
 * The `recommended` metadata for each rule is added there, except if...
 *  - ...the rule's `metadata.group` is `'Ignored'`
 *  - ...the rule is also mentioned in config/recommended.json
 *  - ...the recommended setting starts with `false` (the rule is likely deprecated)
 */

const { writeFile } = require('./common/files');
const { getAllRules, getMetadataFromFile, getMetadataValue } = require('./common/meta');

const recommendations = [];

const recommendedRules = new Set(Object.keys(require('../configs/recommended.json').rules));

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

    // Don't redundantly mention rules added to the 'recommended' preset
    if (recommendedRules.has(ruleName)) {
        return;
    }

    recommendations.push(`        "${ruleName}": ${recommendation}`);
});

const latestTemplate = require('./templates/latest.json.template');

writeFile('configs/latest.json', latestTemplate(recommendations));
