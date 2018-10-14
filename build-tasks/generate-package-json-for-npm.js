/**
 * Creates a package.json file for the npm module
 */

const common = require('./common');

const basePackageJson = common.readJSON('package.json');
delete basePackageJson.devDependencies;

common.writeFile('dist/build/package.json', JSON.stringify(basePackageJson, undefined, 2));
