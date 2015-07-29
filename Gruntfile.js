"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: {
            src: ['dist'],
            options: {
                force: true
            },
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

        mochaTest: {
            test: {
                src: ['dist/tests/**/*.js']
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
                    }
                ]
            }
        },

        tslint: {
            prod: {
                files: {
                    src: [
                        'src/**/*.ts',
                        'tests/**/*.ts',
                        '!src/references.ts'
                    ]
                }
            },
            "self-test": {
                files: {
                    src: [
                        'test-data/**/*.ts'
                    ]
                }
            },
            options: {
                configuration: grunt.file.readJSON("tslint.json"),
                rulesDirectory: 'dist/src'
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


    grunt.registerTask('all', 'Performs a cleanup and a full build with all tasks', [
        'clean',
        'ts',
        'mochaTest',
        'tslint:prod',
        'copy:package',
        'create-package-json-for-npm'
    ]);

    grunt.registerTask('default', ['all']);

};
