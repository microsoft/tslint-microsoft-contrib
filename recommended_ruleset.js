module.exports = {
    "rules": {

        /**
         * Security Rules. The following rules should be turned on because they find security issues
         * or are recommended in the Microsoft Secure Development Lifecycle (SDL)
         */
        "no-banned-terms": true,
        "no-cookies": true,
        "no-delete-expression": true,
        "no-disable-auto-sanitization": true,
        "no-document-domain": true,
        "no-document-write": true,
        "no-duplicate-key": true,
        "no-eval": true,
        "no-exec-script": true,
        "no-function-constructor-with-string-args": true,
        "no-http-string": [true, "http://www.example.com/?.*", "http://www.examples.com/?.*"],
        "no-inner-html": true,
        "no-octal-literal": true,
        "no-reserved-keywords": true,
        "no-string-based-set-immediate": true,
        "no-string-based-set-interval": true,
        "no-string-based-set-timeout": true,
        "react-no-dangerous-html": true,
        "use-strict": true,

        /**
         * Common Bugs and Correctness. The following rules should be turned on because they find
         * common bug patterns in the code or enforce type safety.
         */
        "chai-vague-errors": true,
        "forin": true,
        "jquery-deferred-must-complete": true,
        "label-position": true,
        "label-undefined": true,
        "mocha-avoid-only": true,
        "no-any": true,
        "no-arg": true,
        "no-backbone-get-set-outside-model": true,
        "no-bitwise": true,
        "no-conditional-assignment": true,
        "no-console": [true, "debug", "info", "log", "time", "timeEnd", "trace"],
        "no-constant-condition": true,
        "no-control-regex": true,
        "no-debugger": true,
        "no-duplicate-case": true,
        "no-duplicate-variable": true,
        "no-empty": true,
        "no-increment-decrement": true,
        "no-invalid-regexp": true,
        "no-invalid-this": true,
        "no-jquery-raw-elements": true,
        "no-regex-spaces": true,
        "no-sparse-arrays": true,
        "no-stateless-class": true,
        "no-string-literal": true,
        "no-unnecessary-bind": true,
        "no-unnecessary-override": true,
        "no-unused-expression": true,
        "no-unused-variable": true,
        "no-use-before-declare": true,
        "no-with-statement": true,
        "promise-must-complete": true,
        "radix": true,
        "react-this-binding-issue": true,
        "switch-default": true,
        "triple-equals": [true, "allow-null-check"],
        "use-isnan": true,
        "use-named-parameter": true,
        "valid-typeof": true,

        /**
         * Code Clarity. The following rules should be turned on because they make the code
         * generally more clear to the reader.
         */
        "class-name": true,
        "comment-format": true,
        "export-name": true,
        "function-name": true,
        "import-name": true,
        "interface-name": true,
        "jsdoc-format": true,
        "max-func-body-length": [true, 100, {"ignore-parameters-to-function-regex": "describe"}],
        "max-line-length": [true, 140],
        "member-access": true,
        "member-ordering": true,
        "missing-jsdoc": true,
        "new-parens": true,
        "no-construct": true,
        "no-constructor-vars": true,
        "no-default-export": true,
        "no-empty-interfaces": true,
        "no-for-in": true,
        "no-function-expression": true,
        "no-inferrable-types": false, // turn no-inferrable-types off in order to make the code consistent in its use of type decorations
        "no-multiline-string": true, // multiline-strings often introduce unnecessary whitespace into the string literals
        "no-null-keyword": false, // turn no-null-keyword off and use undefined to mean not initialized and null to mean without a value
        "no-relative-imports": true,
        "no-require-imports": true,
        "no-shadowed-variable": true,
        "no-typeof-undefined": true,
        "no-unnecessary-local-variable": true,
        "no-unnecessary-field-initialization": true,
        "no-var-keyword": true,
        "no-var-requires": true,
        "no-var-self": true,
        "object-literal-sort-keys": false, // turn object-literal-sort-keys off and sort keys in a meaningful manner
        "one-variable-per-declaration": true,
        "prefer-array-literal": true,
        "prefer-const": true,
        "typedef": [true, "callSignature", "indexSignature", "parameter", "propertySignature", "variableDeclarator", "memberVariableDeclarator"],
        "variable-name": true,

        /**
         * Whitespace related rules. The only recommended whitespace strategy is to pick a single format and
         * be consistent.
         */
        "align": [true, "parameters", "arguments", "statements"],
        "curly": true,
        "eofline": true,
        "indent": [true, "spaces"],
        "no-consecutive-blank-lines": true,
        "no-empty-line-after-opening-brace": false,
        "no-trailing-whitespace": true,
        "no-unnecessary-semicolons": true,
        "one-line": [true, "check-open-brace", "check-catch", "check-else", "check-whitespace"],
        "quotemark": [true, "single"],
        "semicolon": [true, "always"],
        // forcing trailing commas for multi-line lists results in lists that are easier to reorder and version
        // control diffs that are more clear. Many teams like to have multiline be 'always'. There is no
        // clear consensus on this rule but the internal MS JavaScript coding standard does discourage it.
        "trailing-comma": [true, {"singleline": "never", "multiline": "never"}],
        "typedef-whitespace": false,
        "whitespace": [true, "check-branch", "check-decl", "check-operator", "check-separator", "check-type"],

        /**
         * Controversial/Configurable rules.
         */
        "ban": false,                // only enable this if you have some code pattern that you want to ban
        "no-internal-module": false, // only enable this if you are not using internal modules
        "no-namespace": false,       // only enable this if you are not using modules/namespaces
        "no-reference": true,        // in general you should use a module system and not /// reference imports
        "no-unexternalized-strings": false, // the VS Code team has a specific localization process that this rule enforces
        // pick one of the two following type-cast formats and use it consistently
        "prefer-type-cast": true,
        "no-angle-bracket-type-assertion": false,

        /**
         * Deprecated rules.  The following rules are deprecated for various reasons.
         */
        "missing-optional-annotation": false,  // now supported by TypeScript compiler
        "no-duplicate-parameter-names": false, // now supported by TypeScript compiler
        "no-missing-visibility-modifiers": true, // use tslint member-access rule instead
        "no-multiple-var-decl": false,         // use tslint one-variable-per-declaration rule instead
        "no-switch-case-fall-through": false,  // now supported by TypeScript compiler
        "no-unreachable": false,               // now supported by TypeScript compiler
        "no-unused-imports": false             // use tslint no-unused-variable rule instead

    }
};

