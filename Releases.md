# Overview

* The npm package is published by the [Microsoft account](https://www.npmjs.com/~microsoft)
* [Directions for publishing](https://opensourcehub.microsoft.com/articles/how-to-publish-npm-package) with the Microsoft Account are available with CORPNET access
* Releases are made from the "master" branch and tagged with the format "[version]"

## Prepare the tslint-microsoft-contrib master branch

* Make sure there are 0 closed issues without a milestone. Assign milestone as needed using [this query](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=no%3Amilestone%20is%3Aclosed%20)
* Close the milestone
* Open the next milestone
* Update the [Release Notes](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Release-Notes
)
* Make sure `package.json` and `package-lock.json` contain the version you wish to publish
* Update `README.md` to have the correct version numbers and links
* Pull any recent git changes and rebuild:

```shell
git pull
npm run test
```

* Tag the master branch with the format [version]

```shell
git tag 0.0.1
git push --tags
```

* Increase the version number in package.json and README.md to the next minor version and push

## Publish the Package with the Microsoft npmjs Account

* Follow the steps at https://docs.opensource.microsoft.com/releasing/build-your-project.html#npm
  * Basically just send the email they want and wait a little while
  * Include the npmjs.org user ids of all contributors: brndkfr, hamletdrc, dmanesku, joshuakgoldberg