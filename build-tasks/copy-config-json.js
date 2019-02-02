/**
 * Converts configs/ to ./dist/build/configs/ and configs/recommended.json to ./dist/build/recommended.json.
 */

const mkdirp = require('mkdirp');
const path = require('path');

const { readDirectory, readFile, writeFile } = require('./common/files');

const copyConfigFile = (configFileName, destinationFileName, newRulesDirectory) => {
    const resolvedDestination = path.resolve(destinationFileName);
    const data = readFile(path.resolve(configFileName));

    writeFile(resolvedDestination, data.replace(/"rulesDirectory": \[(.*)\]/, `"rulesDirectory": ["${newRulesDirectory}"]`));
};

mkdirp.sync('./dist/build/configs');

for (const configFileName of readDirectory('./configs')) {
    copyConfigFile(`./configs/${configFileName}`, `./dist/build/configs/${configFileName}`, '../');
}

copyConfigFile('./configs/recommended.json', './dist/build/tslint.json', './');
