/**
 * Generates rule-metadata.json which contains a json array of all rule metadata.
 */

const common = require('./common');
const allMetadata = [];

common.getAllRules().forEach(ruleFile => {
    const metadata = common.getMetadataFromFile(ruleFile);
    allMetadata.push(metadata);
});

common.writeFile('rule-metadata.json', JSON.stringify(allMetadata, undefined, 2));
