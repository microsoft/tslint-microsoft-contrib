const path = require('path');
const glob = require('glob');
const { readJSON } = require('./files');

function getAllRules() {
    const contribRules = glob.sync('dist/src/*Rule.js');
    const baseRules = glob.sync('node_modules/tslint/lib/rules/*Rule.js');

    return contribRules.concat(baseRules);
}

function getMetadataFromFile(ruleFile) {
    const moduleName = path.resolve(ruleFile.replace(/\.js$/, ''));
    const module = require(moduleName);
    if (module.Rule.metadata === undefined) {
        console.log(red('No metadata found for ' + moduleName));
        process.exit(1);
    }
    return module.Rule.metadata;
}

let additionalMetadata;
function getMetadataValue(metadata, name, allowEmpty, doNotEscape) {
    additionalMetadata = additionalMetadata || readJSON('additional_rule_metadata.json');

    let value = metadata[name];
    if (value === undefined) {
        if (additionalMetadata[metadata.ruleName] === undefined) {
            if (allowEmpty === false) {
                console.log(red(`Could not read metadata for rule ${metadata.ruleName} from additional_rule_metadata.json`));
                process.exit(1);
            } else {
                return '';
            }
        }
        value = additionalMetadata[metadata.ruleName][name];
        if (value === undefined) {
            if (allowEmpty === false) {
                console.log(red(`Could not read attribute ${name} of rule ${metadata.ruleName}`));
                process.exit(1);
            }
            return '';
        }
    }
    if (doNotEscape === true) {
        return value;
    }
    value = value.replace(/^\n+/, ''); // strip leading newlines
    value = value.replace(/\n/g, ' '); // convert newlines
    if (value.indexOf(',') > -1) {
        return '"' + value + '"';
    } else {
        return value;
    }
}

function kebabCase(input) {
    return input.split('').reduce((memo, element) => {
        if (element.toLowerCase() === element) {
            memo = memo + element;
        } else {
            memo = memo + '-' + element.toLowerCase();
        }
        return memo;
    }, '');
}

function getContribRuleNames() {
    const convertToRuleNames = filename => {
        filename = filename
            .replace(/Rule\..*/, '') // file extension plus Rule suffix
            .replace(/.*\//, ''); // leading path

        return kebabCase(filename);
    };

    return glob
        .sync('src/*Rule.ts')
        .map(convertToRuleNames)
        .sort();
}

module.exports = {
    getContribRuleNames,
    getAllRules,
    getMetadataFromFile,
    getMetadataValue
};
