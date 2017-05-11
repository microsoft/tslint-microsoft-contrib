The [Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/sdl/) is a software development process that helps developers build more secure software and address security compliance requirements while reducing development cost. 

Together TypeScript, TSLint, and tslint-microsoft-contrib have automated most of the rules and recommendations made by the MS SDL. 

Enable these rules in order to be compliant with the SDL: 

Rule Name              | From          | Description
:--------------------- | :------------ | -------------
`no-eval`                       | tslint        | Do not use the 'eval' function or its functional equivalents.
`use-strict`                    | tslint        | Always enable strict mode when possible.
`no-octal-literal`              | tslint-microsoft-contrib | Do not use octal literals or escaped octal sequences in  strict-mode compatible code.        
`no-duplicate-parameter-names`  | tslint-microsoft-contrib | Do not duplicate parameter names.
`no-delete-expression`          | tslint-microsoft-contrib | Do not delete expressions.
`no-disable-auto-sanitization`  | tslint-microsoft-contrib | Do not disable auto-sanitization in frameworks or application helper code.
`no-exec-script`                | tslint-microsoft-contrib | Banned term - execScript.
`no-string-based-set-timeout`   | tslint-microsoft-contrib | Do not use the version of setTimeout that accepts code as a string argument. However, it is acceptable to use the version of setTimeout where a direct reference to a function is provided as the callback argument.
`no-string-based-set-interval`  | tslint-microsoft-contrib | Do not use the version of setInterval that accepts code as a string argument. However, it is acceptable to use the version of setInterval where a direct reference to a function is provided as the callback argument. 
`no-string-based-set-immediate` | tslint-microsoft-contrib | Do not use the version of setImmediate that accepts code as a string argument. However, it is acceptable to use the version of setImmediate where a direct reference to a function is provided as the callback argument.
`no-function-constructor-with-string-args` | tslint-microsoft-contrib | Do not use the version of the Function constructor that accepts a string argument to define the body of the function.
`no-banned-terms`               | tslint-microsoft-contrib | Do not access terms or variables that create ambiguity or are banned in strict mode.
`no-reserved-keywords`          | tslint-microsoft-contrib | Do not use reserved and future reserved keywords as identifiers.
`no-document-domain`            | tslint-microsoft-contrib | Do not write to document.domain. Scripts setting document.domain to any value should be validated to ensure that the value is on a list of allowed sites.

You will want your tslint ruleset defined similarly to this if you'd like to enable all of these rules: 

      {
        "rules": {
            "no-banned-terms": true,
            "no-delete-expression": true,
            "no-document-domain": true,
            "no-disable-auto-sanitization": true,
            "no-duplicate-parameter-names": true,
            "no-exec-script": true,
            "no-function-constructor-with-string-args": true,
            "no-octal-literal": true,
            "no-reserved-keywords": true,
            "no-string-based-set-immediate": true,
            "no-string-based-set-interval": true,
            "no-string-based-set-timeout": true,
            "no-eval": true
        }
      }

There are also some other security related rules that are not specifically part of the SDL. We recommend that you also use these rules: 
* no-document-write - Do not use document.write (because it accepts unsanitized input)
* no-http-string – It can cause an http connection without TLS thus allowing a cookie stealing attack
* no-inner-html	Do not write values to innerHTML, outerHTML, or set HTML using the JQuery html() function
* react-no-dangerous-html - Do not use React's dangerouslySetInnerHTML API (because it accepts unsanitized input)

Additionally, some [tsc compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) should be enabled: 
* --alwaysStrict - Parse in strict mode and emit "use strict" for each source file
* 