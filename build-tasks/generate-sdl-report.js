/**
 * Generates an SDL report in csv format.
 */

const { readJSON, writeFile } = require('./common/files');
const { getAllRules, getMetadataFromFile, getMetadataValue } = require('./common/meta');
const allCweDescriptions = readJSON('cwe_descriptions.json');
const rows = [];
const resolution = 'See description on the tslint or tslint-microsoft-contrib website';
const procedure = 'TSLint Procedure';
const header = 'Title,Description,ErrorID,Tool,IssueClass,IssueType,SDL Bug Bar Severity,' +
    'SDL Level,Resolution,SDL Procedure,CWE,CWE Description';

getAllRules().forEach(ruleFile => {
    const metadata = getMetadataFromFile(ruleFile);

    const issueClass = getMetadataValue(metadata, 'issueClass');
    if (issueClass === 'Ignored') {
        return;
    }
    const ruleName = getMetadataValue(metadata, 'ruleName');
    const errorId = 'TSLINT' + getHash(ruleName);
    const issueType = getMetadataValue(metadata, 'issueType');
    const severity = getMetadataValue(metadata, 'severity');
    const level = getMetadataValue(metadata, 'level');
    const description = getMetadataValue(metadata, 'description');
    const cwe = getMetadataValue(metadata, 'commonWeaknessEnumeration', true, false);
    const cweDescription = createCweDescription(metadata);

    const row = [
        ruleName,
        description,
        errorId,
        'tslint',
        issueClass,
        issueType,
        severity,
        level,
        resolution,
        procedure,
        cwe,
        cweDescription
    ].join(',');
    rows.push(row);
});

rows.sort();
rows.unshift(header);

writeFile('tslint-warnings.csv', rows.join('\n'));

function getHash(input) {
    // initialized with a prime number
    let hash = 31;
    let i = 0;
    for (i = 0; i < input.length; i++) {
        // multiply by prime so to get the better distribution of the values
        hash = 31 * hash + input.charCodeAt(i); // run the hash function on all chars
        hash = hash | 0; // convert to 32 bit signed integer
    }
    return Math.abs(hash).toString(32).toUpperCase();
}

function createCweDescription(metadata) {
    const cwe = getMetadataValue(metadata, 'commonWeaknessEnumeration', true, true);
    if (cwe === '') {
        return '';
    }

    let result = '';
    cwe.split(',').forEach(cweNumber => {
        cweNumber = cweNumber.trim();
        const description = allCweDescriptions[cweNumber];
        if (description === undefined) {
            console.warn(`Cannot find description of ${cweNumber} for rule ${metadata.ruleName} in cwe_descriptions.json`);
            process.exit(1);
        }
        if (result !== '') {
            result = result + '\n';
        }
        result = result + `CWE ${cweNumber} - ${description}`;
    });
    if (result !== '') {
        return `"${result}"`;
    }
    return result;
}
