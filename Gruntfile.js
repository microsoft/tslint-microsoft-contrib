"use strict";

var _ = require('underscore');

module.exports = function(grunt) {

    let additionalMetadata;
    let allCweDescriptions;

    function getAllRules() {
        const contribRules = grunt.file.expand('dist/build/*Rule.js');
        const baseRules = grunt.file.expand('node_modules/tslint/lib/rules/*Rule.js');
        return contribRules.concat(baseRules);
    }

    function hash(input) {
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

    function getMetadataFromFile(ruleFile) {
        const moduleName = './' + ruleFile.replace(/\.js$/, '');
        const module = require(moduleName);
        if (module.Rule.metadata == null) {
            grunt.fail.warn('No metadata found for ' + moduleName);
            return;
        }
        return module.Rule.metadata;
    }

    function createCweDescription(metadata) {
        allCweDescriptions = allCweDescriptions || grunt.file.readJSON('./cwe_descriptions.json', {encoding: 'UTF-8'});

        const cwe = getMetadataValue(metadata, 'commonWeaknessEnumeration', true, true);
        if (cwe === '') {
            return '';
        }

        let result = '';
        cwe.split(',').forEach(function (cweNumber) {
            cweNumber = cweNumber.trim();
            const description = allCweDescriptions[cweNumber];
            if (description == null) {
                grunt.fail.warn(`Cannot find description of ${cweNumber} for rule ${metadata['ruleName']} in cwe_descriptions.json`)
            }
            if (result !== '') {
                result = result + '\n';
            }
            result = result + `CWE ${cweNumber} - ${description}`
        });
        if (result !== '') {
            return '"' + result + '"';
        }
        return result;
    }

    function getMetadataValue(metadata, name, allowEmpty, doNotEscape) {
        additionalMetadata = additionalMetadata || grunt.file.readJSON('./additional_rule_metadata.json', {encoding: 'UTF-8'});

        let value = metadata[name];
        if (value == null) {
            if (additionalMetadata[metadata.ruleName] == null) {
                if (allowEmpty == false) {
                    grunt.fail.warn(`Could not read metadata for rule ${metadata.ruleName} from additional_rule_metadata.json`);
                } else {
                    return '';
                }
            }
            value = additionalMetadata[metadata.ruleName][name];
            if (value == null) {
                if (allowEmpty == false) {
                    grunt.fail.warn(`Could not read attribute ${name} of rule ${metadata.ruleName}`);
                }
                return '';
            }
        }
        if (doNotEscape == true) {
            return value;
        }
        value = value.replace(/^\n+/, ''); // strip leading newlines
        value = value.replace(/\n/, ' '); // convert newlines
        if (value.indexOf(',') > -1) {
            return '"' + value + '"';
        } else {
            return value;
        }
    }

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
                        src: [
                            '**/*.js',
                            '**/*.json',
                            '!tests/**',
                            'tests/TestHelper.js',
                            'tests/TestHelper.d.ts',
                            '!references.js'
                        ],
                        dest: 'dist/build'
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: [
                            'README.md',
                            'recommended_ruleset.js'
                        ],
                        dest: 'dist/build'
                    }
                ]
            },
            json: {
                expand: true,
                cwd: '.',
                src: ['src/**/*.json'],
                dest: 'dist'
            }
        },

        mochaTest: {
            test: {
                src: ['dist/src/tests/**/*.js']
            }
        },

        ts: {
            default: {
                src: [
                    './src/**/*.ts{,x}'
                ],
                outDir: 'dist/src',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: true,
                    failOnTypeErrors: true,
                    jsx: 'react'
                }
            },
            'test-data': {
                src: [
                    './test-data/**/*.ts{,x}'
                ],
                outDir: 'dist/test-data',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: false,
                    failOnTypeErrors: true,
                    jsx: 'react'
                }
            }
        },

        tslint: {
            options: {
                rulesDirectory: 'dist/src'
            },
            prod: {
                options: {
                    configuration: grunt.file.readJSON("tslint.json", { encoding: 'UTF-8' })
                },
                files: {
                    src: [
                        'src/**/*.ts',
                        '!src/tests/**'
                    ]
                }
            },
            tests: {
                options: {
                    configuration: (function() {
                        let tslintJson = grunt.file.readJSON("tslint.json", { encoding: 'UTF-8' });
                        tslintJson.rules['no-multiline-string'] = false;
                        tslintJson.rules['quotemark'] = false;
                        tslintJson.rules['max-func-body-length'] = false;
                        return tslintJson;
                    })()
                },
                files: {
                    src: [
                        'src/tests/**/*.ts',
                        '!src/tests/references.ts'
                    ]
                }
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
        var basePackageJson = grunt.file.readJSON('package.json', { encoding: 'UTF-8' });
        delete basePackageJson.devDependencies;
        grunt.file.write('dist/build/package.json', JSON.stringify(basePackageJson, null, 2), { encoding: 'UTF-8' });
    });

    grunt.registerTask('validate-debug-mode', 'A task that makes sure ErrorTolerantWalker.DEBUG is false', function () {
        // DON'T MAKE A RELEASE IN DEBUG MODE
        var fileText = grunt.file.read('src/utils/ErrorTolerantWalker.ts', { encoding: 'UTF-8' });
        if (fileText.indexOf('DEBUG: boolean = false') === -1) {
            grunt.fail.warn('ErrorTolerantWalker.DEBUG is turned on. Turn off debugging to make a release');
        }
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

        if (readmeText.indexOf('\nVersion ' + packageJson.version + ' ') === -1) {
            grunt.fail.warn('Version not documented in README.md correctly.\n' +
                'package.json declares: ' + packageJson.version + '\n' +
                'README.md declares something different.');
        }
    });

    grunt.registerTask('validate-config', 'A task that makes sure all the rules in the project are defined to run during the build.', function () {

        var tslintConfig = grunt.file.readJSON('tslint.json', { encoding: 'UTF-8' });
        var rulesToSkip = {
            'no-unused-variable': true,
            'no-unexternalized-strings': true,
            'object-literal-key-quotes': true,
            'no-relative-imports': true,
            'no-empty-line-after-opening-brace': true,
            'no-duplicate-key': true,
            'align': true,
            'comment-format': true,
            'interface-name': true,
            'max-file-line-count': true,
            'member-ordering': true,
            'no-inferrable-types': true,
            'only-arrow-functions': true,
            'ordered-imports': true,
            'typedef-whitespace': true,
            'array-type': true,
            'completed-docs': true,
            'cyclomatic-complexity': true,
            'file-header': true,
            'max-classes-per-file': true
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

    grunt.registerTask('generate-sdl-report', 'A task that generates an SDL report in csv format', function () {

        const rows = [];
        const resolution = 'See description on the tslint or tslint-microsoft-contrib website';
        const procedure = 'TSLint Procedure';
        const header = 'Title,Description,ErrorID,Tool,IssueClass,IssueType,SDL Bug Bar Severity,' +
            'SDL Level,Resolution,SDL Procedure,CWE,CWE Description';
        getAllRules().forEach(function(ruleFile) {
            const metadata = getMetadataFromFile(ruleFile);

            const issueClass = getMetadataValue(metadata, 'issueClass');
            if (issueClass === 'Ignored') {
                return;
            }
            const ruleName = getMetadataValue(metadata, 'ruleName');
            const errorId = 'TSLINT' + hash(ruleName);
            const issueType = getMetadataValue(metadata, 'issueType');
            const severity = getMetadataValue(metadata, 'severity');
            const level = getMetadataValue(metadata, 'level');
            const description = getMetadataValue(metadata, 'description');
            const cwe = getMetadataValue(metadata, 'commonWeaknessEnumeration', true, false);
            const cweDescription = createCweDescription(metadata);

            const row = `${ruleName},${description},${errorId},tslint,${issueClass},${issueType},${severity},${level},${resolution},${procedure},${cwe},${cweDescription}`;
            rows.push(row);
        });
        rows.sort();
        rows.unshift(header);
        grunt.file.write('tslint-warnings.csv', rows.join('\n'), {encoding: 'UTF-8'});

    });

    grunt.registerTask('generate-recommendations', 'A task that generates the recommended_ruleset.js file', function () {

        const groupedRows = {};
        const warnings = [];

        getAllRules().forEach(function(ruleFile) {
            const metadata = getMetadataFromFile(ruleFile);

            const groupName = getMetadataValue(metadata, 'group');
            if (groupName === 'Ignored') {
                return;
            }
            if (groupName === '') {
                warnings.push('Could not generate recommendation for rule file: ' + ruleFile);
            }
            if (groupedRows[groupName] == null) {
                groupedRows[groupName] = [];
            }

            let recommendation = getMetadataValue(metadata, 'recommendation', true, true);
            if (recommendation === '') {
                recommendation = 'true,';
            }
            const ruleName = getMetadataValue(metadata, 'ruleName');
            groupedRows[groupName].push(`        "${ruleName}": ${recommendation}`);
        });

        if (warnings.length > 0) {
            grunt.fail.warn('\n' + warnings.join('\n'));
        }
        _.values(groupedRows).forEach(function (element) { element.sort(); });

        let data = grunt.file.read('./templates/recommended_ruleset.js.snippet', {encoding: 'UTF-8'});
        data = data.replace('%security_rules%',       groupedRows['Security'].join('\n'));
        data = data.replace('%correctness_rules%',    groupedRows['Correctness'].join('\n'));
        data = data.replace('%clarity_rules%',        groupedRows['Clarity'].join('\n'));
        data = data.replace('%whitespace_rules%',     groupedRows['Whitespace'].join('\n'));
        data = data.replace('%configurable_rules%',   groupedRows['Configurable'].join('\n'));
        data = data.replace('%deprecated_rules%',     groupedRows['Deprecated'].join('\n'));
        data = data.replace('%accessibilityy_rules%', groupedRows['Accessibility'].join('\n'));
        grunt.file.write('recommended_ruleset.js', data, {encoding: 'UTF-8'});
    });

    grunt.registerTask('generate-default-tslint-json', 'A task that converts recommended_ruleset.js to ./dist/build/tslint.json', function () {
        const data = require('./recommended_ruleset.js');
        data['rulesDirectory'] = './';
        grunt.file.write('./dist/build/tslint.json', JSON.stringify(data, null, 2), {encoding: 'UTF-8'});
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
            var testFileName = './src/tests/' + ruleFile.charAt(0).toUpperCase() + ruleFile.substr(1) + 'Tests.ts';
            var walkerName = ruleFile.charAt(0).toUpperCase() + ruleFile.substr(1) + 'Walker';

            var ruleTemplateText = grunt.file.read('./templates/rule.snippet', {encoding: 'UTF-8'});
            var testTemplateText = grunt.file.read('./templates/rule-tests.snippet', {encoding: 'UTF-8'});

            grunt.file.write(sourceFileName, applyTemplates(ruleTemplateText), {encoding: 'UTF-8'});
            grunt.file.write(testFileName, applyTemplates(testTemplateText), {encoding: 'UTF-8'});

            var currentRuleset = grunt.file.readJSON('./tslint.json', {encoding: 'UTF-8'});
            currentRuleset.rules[ruleName] = true;
            grunt.file.write('./tslint.json', JSON.stringify(currentRuleset, null, 2), {encoding: 'UTF-8'});
        }
    });

    grunt.registerTask('all', 'Performs a cleanup and a full build with all tasks', [
        'clean',
        'copy:json',
        'ts',
        'mochaTest',
        'tslint',
        'validate-documentation',
        'validate-config',
        'validate-debug-mode',
        'copy:package',
        'generate-recommendations',
        'generate-default-tslint-json',
        'generate-sdl-report',
        'create-package-json-for-npm'
    ]);

    grunt.registerTask('default', ['all']);

};
