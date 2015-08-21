"use strict";

var _ = require('underscore');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            src: ['dist'],
            options: {
                force: true
            }
        },

        copy: {
            package: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/src',
                        src: ['*.js', '!references.js'],
                        dest: 'dist/build'
                    },
                    {
                        expand: true,
                        cwd: '.',
                        src: ['README.md'],
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
                rulesDirectory: 'dist/src'
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

    grunt.registerTask('validate-documentation', 'A task that validates that all rules defined in src are documented in README.md', function () {

        function getAllRuleNames() {
            var ruleFiles = grunt.file.expand('src/*Rule.ts');
            return _(ruleFiles).map(function(filename) {
                filename = filename.substring(4, filename.length - 7);
                return _(filename).reduce(function(memo, element) {
                    if (element.toLowerCase() === element) {
                        memo = memo + element;
                    } else {
                        memo = memo + '-' + element.toLowerCase();
                    }
                    return memo;
                }, '');
            });
        }

        var readmeText = grunt.file.read('README.md', { encoding: 'UTF-8' });
        getAllRuleNames().forEach(function(ruleName) {
            if (readmeText.indexOf(ruleName) === -1) {
                grunt.fail.warn('A rule was found that is not documented in README.md: ' + ruleName);
            }
        });
    });


    grunt.registerTask('all', 'Performs a cleanup and a full build with all tasks', [
        'clean',
        'ts',
        'mochaTest',
        'tslint',
        'validate-documentation',
        'copy:package',
        'create-package-json-for-npm'
    ]);

    grunt.registerTask('default', ['all']);

};
