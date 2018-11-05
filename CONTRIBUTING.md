# Contributing

Thanks for your interest in contributing to `tslint-microsoft-contrib`!
Be sure to read our [code of conduct](./CODE_OF_CONDUCT.md) first.

To develop `tslint-microsoft-contrib`, clone the repository, install dependencies, and run `npm test`:

```shell
git clone git@github.com:Microsoft/tslint-microsoft-contrib.git --config core.autocrlf=input --config core.eol=lf
cd tslint-microsoft-contrib
npm install
npm test
```

You can create new rule from template with `create-rule` script:

```shell
npm run create-rule -- --rule-name=no-something-or-other
```

> NOTE: `--` is required before script arguments.

This script will create file for rule implementation (inside `src`) as well as folder with rule tests (inside `test`).

More information about writing rule tests can be found in [TSLint documentation](https://palantir.github.io/tslint/develop/testing-rules/).

## Watchers

Two npm scripts can be used to watch files and simplify testing and linting with constant changes.

Use `npm start` to start watcher that will rebuild rules and Mocha tests.

Use `npm run watch:run-tests` that will re-run tests (both Mocha and TSLint) and lint code when: files changed in `tests`, `test-data` or `npm start` compiled rules or tests code.

> NOTE: It is recommended to wait when `npm start` will finish initial compilation before starting `npm run watch:run-tests` (in separate terminal).

## Debug code

**VS Code**

This repo provides pre-configured launch tasks for VS Code debugging rules and tests.

-   Pick `Run Mocha Tests` to debug rules which have Mocha unit tests inside `src/tests` folder.
-   Pick `Run TSLint Tests` to debug rules that have tests in TSLint format inside `tests` folder.

**Node.js**

Starting from Node.js v6.3 has built-in debugger that can be used with Chrom DevTools. For earlier versions use [`node-inspector`](https://www.npmjs.com/package/node-inspector) package.

To debug rules that have Mocha tests use:

```shell
node --inspect-brk ./node_modules/mocha/bin/_mocha --no-timeouts --colors "dist/src/tests/**/*.js"
```

To debug rules that have tests in TSLint format use:

```shell
node --inspect-brk ./node_modules/tslint/bin/tslint --test -r dist/src "tests/**"
```

Then open [chrome://inspect/](chrome://inspect/), click on `inspect` link for proper target in Remote Target section and add `tslint-microsoft-contrib` folder to Workspace (in Sources tab).

Set a breakpoint somewhere in your code and resume execution. Your breakpoint should be hit.

You can use `npm start` watcher that will rebuild TS files from `src` before launching debug commands.

> NOTE: If breakpoints are not hit you can try to use `inlineSourceMaps` instead of `sourceMaps` in `tsconfig.json`

## Creating a new Release

Refer to the [Releases Wiki Page](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Releases).
