The [Security Development Lifecycle (SDL)](https://www.microsoft.com/en-us/sdl/) is a software development process that helps developers build more secure software and address security compliance requirements while reducing development cost.

Together TypeScript, TSLint, and tslint-microsoft-contrib have automated most of the rules and recommendations made by the MS SDL.

Enable these rules in order to be compliant with the SDL:

<table>
    <thead>
    <tr>
        <th>Rule Name</th>
        <th>From</th>
        <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><code>no-eval</code></td>
        <td>tslint</td>
        <td>Do not use the `eval` function or its functional equivalents.</td>
    </tr>
    <tr>
        <td><code>use-strict</code></td>
        <td>tslint</td>
        <td>Always enable strict mode when possible.</td>
    </tr>
    <tr>
        <td><code>no-octal-literal</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not use octal literals or escaped octal sequences in strict-mode compatible code.</td>
    </tr>
    <tr>
        <td><code>no-duplicate-parameter-names</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not duplicate parameter names.</td>
    </tr>
    <tr>
        <td><code>no-delete-expression</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not delete expressions.</td>
    </tr>
    <tr>
        <td><code>no-disable-auto-sanitization</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not disable auto-sanitization in frameworks or application helper code.</td>
    </tr>
    <tr>
        <td><code>no-exec-script</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Banned term - `execScript`.</td>
    </tr>
    <tr>
        <td><code>no-string-based-set-timeout</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not use the version of `setTimeout` that accepts code as a string argument. However, it is acceptable to use the version of `setTimeout` where a direct reference to a function is provided as the callback argument.</td>
    </tr>
    <tr>
        <td><code>no-string-based-set-interval</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not use the version of `setInterval` that accepts code as a string argument. However, it is acceptable to use the version of `setInterval` where a direct reference to a function is provided as the callback argument.</td>
    </tr>
    <tr>
        <td><code>no-string-based-set-immediate</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not use the version of `setImmediate` that accepts code as a string argument. However, it is acceptable to use the version of ``setImmediate` where a direct reference to a function is provided as the callback argument.</td>
    </tr>
    <tr>
        <td><code>no-function-constructor-with-string-args</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not use the version of the Function constructor that accepts a string argument to define the body of the function.</td>
    </tr>
    <tr>
        <td><code>no-banned-terms</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not access terms or variables that create ambiguity or are banned in strict mode.</td>
    </tr>
    <tr>
        <td><code>no-reserved-keywords</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not use reserved and future reserved keywords as identifiers.</td>
    </tr>
    <tr>
        <td><code>no-document-domain</code></td>
        <td>tslint-microsoft-contrib</td>
        <td>Do not write to `document.domain`. Scripts setting `document.domain` to any value should be validated to ensure that the value is on a list of allowed sites.</td>
    </tr>
    </tbody>
</table>

You will want your tslint ruleset defined similarly to this if you'd like to enable all of these rules:

```json
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
```

There are also some other security related rules that are not specifically part of the SDL. We recommend that you also use these rules:

-   `no-document-write` - Do not use `document.write` (because it accepts unsanitized input)
-   `no-http-string` – It can cause an http connection without TLS thus allowing a cookie stealing attack
-   `no-inner-html` - Do not write values to `innerHTML`, `outerHTML`, or set HTML using the JQuery `html()` function
-   `react-no-dangerous-html` - Do not use React's `dangerouslySetInnerHTML` API (because it accepts unsanitized input)

Additionally, some [tsc compiler options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) should be enabled:

-   `--alwaysStrict` - Parse in strict mode and emit `"use strict"` for each source file
