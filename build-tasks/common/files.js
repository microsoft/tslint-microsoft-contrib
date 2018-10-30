const { red } = require('chalk');
const fs = require('fs');
const stripJsonComments = require("strip-json-comments");

function readFile(fileName) {
    try {
        return fs.readFileSync(fileName, { encoding: 'utf8' });
    } catch (e) {
        console.log(red(`Unable to read file: ${ fileName }. Error code: ${ e.code }`));
        process.exit(1);
    }
}

function writeFile(fileName, data) {
    try {
        return fs.writeFileSync(fileName, data, { encoding: 'utf8' });
    } catch (e) {
        console.log(red(`Unable to write file: ${ fileName }. Error code: ${ e.code }`));
        process.exit(1);
    }
}

function readJSON(fileName) {
    try {
        return JSON.parse(readFile(fileName));
    } catch (e) {
        console.log(red(`Unable to parse JSON file: ${ fileName }. \n ${ e }`));
        process.exit(1);
    }
}

function readJSONWithComments(fileName) {
    try {
        return JSON.parse(stripJsonComments(readFile(fileName)));
    } catch (e) {
        console.log(red(`Unable to parse commented JSON file: ${ fileName }. \n ${ e }`));
        process.exit(1);
    }
}

module.exports = {
    readFile,
    readJSON,
    readJSONWithComments,
    writeFile
};
