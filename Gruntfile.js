"use strict";

var _ = require('underscore');
var RecommendedRuleset = require('./recommended_ruleset');

module.exports = function(grunt) {

    function camelize(input) {
        return _(input).reduce(function(memo, element) {
            if (element.toLowerCase() === element) {
                memo = memo + element;
            } else {
                memo = memo + '-' + element.toLowerCase();
            }
            return memo;
        }, '');
    }

    function getAllRuleNames(options) {
        options = options || { skipTsLintRules: false }

        var convertToRuleNames = function(filename) {
            filename = filename
                .replace(/Rule\..*/, '')  // file extension plus Rule name
                .replace(/.*\//, '');     // leading path
            return camelize(filename);
        };

        var contribRules = _(grunt.file.expand('src/*Rule.ts')).map(convertToRuleNames);
        var baseRules = [];
        if (!options.skipTsLintRules) {
            baseRules = _(grunt.file.expand('node_modules/tslint/lib/rules/*Rule.js')).map(convertToRuleNames);
        }
        var allRules = baseRules.concat(contribRules);
        allRules.sort();
        return allRules;
    }

    function getAllFormatterNames() {

        var convertToRuleNames = function(filename) {
            filename = filename
                .replace(/Formatter\..*/, '')  // file extension plus Rule name
                .replace(/.*\//, '');     // leading path
            return camelize(filename);
        };

        var formatters = _(grunt.file.expand('src/*Formatter.ts')).map(convertToRuleNames);
        formatters.sort();
        return formatters;
    }

    function camelCase(input) {
        return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
            return group1.toUpperCase();
        });
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            src: ['dist'],
            options: {
                force: true
            }
        },

        copy: {
            options: {
                encoding: 'UTF-8'
            },
            package: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/src',
                        src: ['**/*.js', '!references.js'],
                        dest: 'dist/build'
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: ['README.md'],
                        dest: 'dist/build'
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: ['recommended_ruleset.js'],
                        dest: 'dist/build'
                    }
                ]
            }
        },

        mochaTest: {
            test: {
                src: ['dist/tests/**/*.js']
            }
        },

        ts: {
            default: {
                src: [
                    './src/**/*.ts',
                    './tests/**/*.ts'
                ],
                outDir: 'dist',
                options: {
                    module: 'commonjs',
                    target: 'es5'
                }
            },
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json"),
                rulesDirectory: 'dist/src',
                //formattersDirectory: 'dist/src',
                //formatter: 'fix-no-var-keyword'
            },
            files: {
                src: [
                    'src/**/*.ts',
                    'tests/**/*.ts',
                    '!src/references.ts'
                ]
            }
        },

        watch: {
            scripts: {
                files: [
                    './src/**/*.ts',
                    './tests/**/*.ts'
                ],
                tasks: [
                    'ts',
                    'mochaTest',
                    'tslint'
                ]
            }
        }

    });

    require('load-grunt-tasks')(grunt); // loads all grunt-* npm tasks
    require('time-grunt')(grunt);

    grunt.registerTask('create-package-json-for-npm', 'A task that creates a package.json file for the npm module', function () {
        var basePackageJson = grunt.file.readJSON('package.json');
        delete basePackageJson.devDependencies;
        grunt.file.write('dist/build/package.json', JSON.stringify(basePackageJson, null, 2), { encoding: 'UTF-8' });
    });

    grunt.registerTask('validate-documentation', 'A task that validates that all rules defined in src are documented in README.md\n' +
        'and validates that the package.json version is the same version defined in README.md', function () {

        var readmeText = grunt.file.read('README.md', { encoding: 'UTF-8' });
        var packageJson = grunt.file.readJSON('package.json', { encoding: 'UTF-8' });
        getAllRuleNames({ skipTsLintRules: true }).forEach(function(ruleName) {
            if (readmeText.indexOf(ruleName) === -1) {
                grunt.fail.warn('A rule was found that is not documented in README.md: ' + ruleName);
            }
        });
        getAllFormatterNames().forEach(function(formatterName) {
            if (readmeText.indexOf(formatterName) === -1) {
                grunt.fail.warn('A formatter was found that is not documented in README.md: ' + formatterName);
            }
        });

        if (readmeText.indexOf('\nVersion ' + packageJson.version + '\n') === -1) {
            grunt.fail.warn('Version not documented in README.md correctly.\n' +
                'package.json declares: ' + packageJson.version + '\n' +
                'README.md declares something different.');
        }
    });

    grunt.registerTask('validate-config', 'A task that makes sure all the rules in the project are defined to run during the build.', function () {

        var tslintConfig = grunt.file.readJSON('tslint.json', { encoding: 'UTF-8' });
        var rulesToSkip = {
            'no-unexternalized-strings': true,
            'no-relative-imports': true,
            'no-empty-line-after-opening-brace': true
        };
        var errors = [];
        getAllRuleNames().forEach(function(ruleName) {
            if (rulesToSkip[ruleName]) {
                return;
            }
            if (tslintConfig.rules[ruleName] !== true && tslintConfig.rules[ruleName] !== false) {
                if (tslintConfig.rules[ruleName] == null || tslintConfig.rules[ruleName][0] !== true) {
                    errors.push('A rule was found that is not enabled on the project: ' + ruleName);
                }
            }
        });

        if (errors.length > 0) {
            grunt.fail.warn(errors.join('\n'));
        }
    });

    grunt.registerTask('validate-recommendations', 'A task that makes sure all the rules in the project are defined in the recommended_ruleset.js.', function () {
        var errors = [];
        var allRules = RecommendedRuleset.rules;
        getAllRuleNames().forEach(function(ruleName) {
            if (allRules[ruleName] !== true && allRules[ruleName] !== false) {
                if (allRules[ruleName] == null || allRules[ruleName][0] !== true) {
                    errors.push('A rule was found that is not found in recommended_ruleset.js: ' + ruleName);
                }
            }
        });

        if (errors.length > 0) {
            grunt.fail.warn(errors.join('\n'));
        }
    });

    grunt.registerTask('create-rule', 'A task that creates a new rule from the rule templates. --rule-name parameter required', function () {

        function applyTemplates(source) {
            return source.replace(/%RULE_NAME%/gm, ruleName)
                .replace(/%RULE_FILE_NAME%/gm, ruleFile)
                .replace(/%WALKER_NAME%/gm, walkerName);
        }

        var ruleName = grunt.option('rule-name');
        if (!ruleName) {
            grunt.fail.warn('--rule-name parameter is required');
        } else {

            var ruleFile = camelCase(ruleName) + 'Rule';
            var sourceFileName = './src/' + ruleFile + '.ts';
            var testFileName = './tests/' + ruleFile.charAt(0).toUpperCase() + ruleFile.substr(1) + 'Tests.ts';
            var walkerName = ruleFile.charAt(0).toUpperCase() + ruleFile.substr(1) + 'Walker';

            var ruleTemplateText = grunt.file.read('./templates/rule.snippet', {encoding: 'UTF-8'});
            var testTemplateText = grunt.file.read('./templates/rule-tests.snippet', {encoding: 'UTF-8'});

            grunt.file.write(sourceFileName, applyTemplates(ruleTemplateText), {encoding: 'UTF-8'});
            grunt.file.write(testFileName, applyTemplates(testTemplateText), {encoding: 'UTF-8'});
        }
    });

    grunt.registerTask('all', 'Performs a cleanup and a full build with all tasks', [
        'clean',
        'ts',
        'mochaTest',
        'tslint',
        'validate-documentation',
        'validate-config',
        'validate-recommendations',
        'copy:package',
        'create-package-json-for-npm'
    ]);

    grunt.registerTask('default', ['all']);

};
