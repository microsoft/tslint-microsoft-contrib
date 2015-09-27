
tslint-microsoft-contrib
======

A set of [TSLint](https://github.com/palantir/tslint) rules used on some Microsoft projects.

Version 0.0.4
-------------
This software is not yet released with a 1.0 version. 
All [release blockers](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0) are listed in the issues page.

Installation
------------

    npm install tslint-microsoft-contrib

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
* `no-http-string` Do not use strings that start with 'http:'. URL strings should start with 'https:'. Http strings can be a security problem and indicator that your software may suffer from cookie-stealing attacks.
* `no-increment-decrement` Avoid use of increment and decrement operators particularly as part of complicated expressions
* `no-multiline-string` Do not declare multiline strings
* `no-unnecessary-semicolons` Remove unnecessary semicolons
* `no-octal-literal` Do not use octal literals or escaped octal sequences
* `no-reserved-keywords` Do not use reserved keywords as names of local variables, fields, functions, or other identifiers.
* `no-string-based-set-immediate` Do not use the version of setImmediate that accepts code as a string argument. However, it is acceptable to use the version of setImmediate where a direct reference to a function is provided as the callback argument
* `no-string-based-set-interval` Do not use the version of setInterval that accepts code as a string argument. However, it is acceptable to use the version of setInterval where a direct reference to a function is provided as the callback argument
* `no-string-based-set-timeout` Do not use the version of setTimeout that accepts code as a string argument. However, it is acceptable to use the version of setTimeout where a direct reference to a function is provided as the callback argument
* `no-unused-imports` Remove unused imports
* `no-with-statement` Do not use with statements. Assign the item to a new variable instead
* `react-no-dangerous-html` Do not use React's dangerouslySetInnerHTML API. This rule finds usages of the dangerouslySetInnerHTML API (but not any JSX references). For more info see the [react-no-dangerous-html Rule wiki page](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/react-no-dangerous-html-Rule).
* `use-named-parameter` Do not reference the arguments object by numerical index; instead, use a named parameter. This rule is similar to JSLint's [Use a named parameter](https://jslinterrors.com/use-a-named-parameter) rule.


Development
-----------

To develop tslint-microsoft-contrib simply clone the repository, install dependencies and run grunt:

    git config --global core.autocrlf input
    git config --global core.eol lf
    git clone git@github.com:Microsoft/tslint-microsoft-contrib.git
    cd tslint-microsoft-contrib
    npm install
    grunt all
    
Debug code
-----------
If command fails because of file access permissions, prefix it with sudo.

    npm install -g node-inspector
    node-inspector

In another terminal window run:

    # on *nix machines: 
    node --debug-brk /usr/local/bin/grunt mochaTest
    # on Windows machines: 
    node --debug-brk /c/Users/[your alias]/AppData/Roaming/npm/node_modules/grunt-cli/bin/grunt
    
Open in browser:
    
    http://127.0.0.1:8080/?ws=127.0.0.1:8080&port=5858
    
Set a breakpoint somewhere in your code and resume execution. Your breakpoint should be hit.

Creating a new Release
----------------------

Refer to the [Releases Wiki Page](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Releases)
