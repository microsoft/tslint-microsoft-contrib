/**
 * Converts recommended_ruleset.js to ./dist/build/tslint.json.
 */

const path = require('path');
const { writeFile } = require('./common/files');

const data = require(path.resolve('recommended_ruleset.js'));
data.rulesDirectory = './';

writeFile('dist/build/tslint.json', JSON.stringify(data, undefined, 2));
