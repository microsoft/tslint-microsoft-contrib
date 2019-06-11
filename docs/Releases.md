# Overview

-   The npm package is published by the [Microsoft account](https://www.npmjs.com/~microsoft)
-   [Directions for publishing](https://opensourcehub.microsoft.com/articles/how-to-publish-npm-package) with the Microsoft Account are available with CORPNET access
-   Releases are made from the "master" branch and tagged with the format "[version]"

## Prepare the tslint-microsoft-contrib master branch

-   Make sure there are 0 closed issues without a milestone. Assign milestone as needed using [this query](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=no%3Amilestone%20is%3Aclosed%20)
-   Close the milestone
-   Open the next milestone
-   Update `CHANGELOG.md`. Stable releases should contain list of new changes as well as full list of changes since previous stable release.
-   Make sure `package.json` and `package-lock.json` contain the version you wish to publish
-   Update `README.md` to have the correct links and version numbers for new rules (replace `@next` placeholder with next version)
-   Pull any recent git changes and rebuild:

```shell
git pull
npm run test
```

-   Tag the master branch with the format [version]

```shell
git tag 0.0.1
git push --tags
```

-   Create [release](https://github.com/Microsoft/tslint-microsoft-contrib/releases) for newly pushed tag
-   Increase the version number in package.json and README.md to the next minor version and push

## Publish the npm package

Package should be published only from `dist/build` folder.

-   For beta release run `npm publish --tag beta`

-   For stable release run `npm publish`

If you need to promote package from beta to stable use `npm dist-tag add tslint-microsoft-contrib@<version> latest`
