/**
 * Generates rule-metadata.json which contains a json array of all rule metadata.
 */

const { writeFile } = require('./common/files');
const { getAllRules, getMetadataFromFile } = require('./common/meta');
const allMetadata = [];

getAllRules().forEach(ruleFile => {
    const metadata = getMetadataFromFile(ruleFile);
    allMetadata.push(metadata);
});

writeFile('rule-metadata.json', JSON.stringify(allMetadata, undefined, 4));
