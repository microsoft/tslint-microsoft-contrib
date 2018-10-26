const fs = require('fs');

function readFile(fileName) {
    try {
        return fs.readFileSync(fileName, { encoding: 'utf8' });
    } catch (e) {
        console.error(`Unable to read file: ${ fileName }. Error code: ${ e.code }`);
        process.exit(1);
    }
}

function writeFile(fileName, data) {
    try {
        return fs.writeFileSync(fileName, data, { encoding: 'utf8' });
    } catch (e) {
        console.error(`Unable to write file: ${ fileName }. Error code: ${ e.code }`);
        process.exit(1);
    }
}

function readJSON(fileName) {
    try {
        return JSON.parse(readFile(fileName));
    } catch (e) {
        console.error(`Unable to parse JSON file: ${ fileName }.`, e);
        process.exit(1);
    }
}

module.exports = {
    readFile,
    readJSON,
    writeFile
};
