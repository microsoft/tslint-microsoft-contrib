/**
 * Converts configs/*.json to ./dist/build/*.json.
 */

const mkdirp = require('mkdirp');
const path = require('path');

const { readDirectory, readFile, writeFile } = require('./common/files');

const copyConfigFile = (configFileName, destinationFileName) => {
    const resolvedDestination = path.resolve(destinationFileName);
    const data = readFile(path.resolve(configFileName));

    writeFile(resolvedDestination, data.replace(/"rulesDirectory": \[(.*)\]/, `"rulesDirectory": ["./"]`));
};

mkdirp.sync('./dist/build');

for (const configFileName of readDirectory('./configs')) {
    copyConfigFile(`./configs/${configFileName}`, `./dist/build/${configFileName}`);
}
