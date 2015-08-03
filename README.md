
tslint-microsoft-contrib
======

A set of [TSLint](https://github.com/palantir/tslint) rules used on some Microsoft projects.

Installation
------------

    git clone git@dse1-git1:prototypes/tslint-microsoft-contrib
    tslint-microsoft-contrib
    grunt all
    cd $PROJECT_DIR
    npm install ../tslint-microsoft-contrib/dist/build/

Configuration
-------------

##### Configure your Grunt build task

Add the new rulesDirectory to your tslint task: 

    grunt.initConfig({
      tslint: {
        options: {
          rulesDirectory: 'node_modules/tslint-microsoft-contrib',
          configuration: grunt.file.readJSON("tslint-contrib.json")
        },
        files: {
          src: ['src/file1.ts', 'src/file2.ts']
        }
      }
    })

The tslint-contrib.json file follows the same conventions as other tslint rules. 

Supported Rules
-----

A sample configuration file with all options is available under tslint-microsoft-contrig/tslint.json

* `missing-optional-annotation` A parameter that follows one or more parameters marked as optional is not itself marked optional
* `no-banned-terms` Do not use banned terms: [caller](https://msdn.microsoft.com/library/7t96kt3h(v=vs.94).aspx), [callee](https://msdn.microsoft.com/library/334e1zza(v=vs.94).aspx), [eval](https://msdn.microsoft.com/library/12k71sw7(v=vs.94).aspx), [arguments](https://msdn.microsoft.com/library/he95z461(v=vs.94).aspx). These terms refer to functions or properties that should not be used, so it is best practice to simply avoid them.
* `no-cookies` Do not use cookies
* `no-delete-expression` Do not delete expressions. Only properties should be deleted
* `no-disable-auto-sanitization` Do not disable auto-sanitization of HTML because this opens up your page to an XSS attack. Specifically, do not use the [execUnsafeLocalFunction](https://msdn.microsoft.com/en-us/library/windows/apps/hh767331.aspx) or [setInnerHTMLUnsafe](https://msdn.microsoft.com/en-us/library/windows/apps/br211696.aspx) functions.
* `no-document-write` Do not use document.write
* `no-duplicate-parameter-names` Do not write functions or methods with duplicate parameter names
* `no-exec-script` Do not use the execScript functions
* `no-function-constructor-with-string-args` Do not use the version of the Function constructor that accepts a string argument to define the body of the function
* `no-increment-decrement` Avoid use of increment and decrement operators particularly as part of complicated expressions
* `no-multiline-string` Do not declare multiline strings
* `no-unnecessary-semicolons` Remove unnecessary semicolons
* `no-octal-literal` Do not use octal literals or escaped octal sequences
* `no-string-based-set-immediate` Do not use the version of setImmediate that accepts code as a string argument. However, it is acceptable to use the version of setImmediate where a direct reference to a function is provided as the callback argument
* `no-string-based-set-interval` Do not use the version of setInterval that accepts code as a string argument. However, it is acceptable to use the version of setInterval where a direct reference to a function is provided as the callback argument
* `no-string-based-set-timeout` Do not use the version of setTimeout that accepts code as a string argument. However, it is acceptable to use the version of setTimeout where a direct reference to a function is provided as the callback argument
* `no-unused-imports` Remove unused imports
* `no-with-statement` Do not use with statements. Assign the item to a new variable instead


Development
-----------

To develop TSLint simply clone the repository, install dependencies and run grunt:

    git clone git@dse1-git1:prototypes/tslint-microsoft-contrib
    cd tslint-microsoft-contrib
    npm install
    grunt all

Creating a new Release
----------------------

1. Bump up the version number in package.json 
2. Run `grunt all` to build the latest sources
3. Commit
4. Create a git tag for the new release and push it