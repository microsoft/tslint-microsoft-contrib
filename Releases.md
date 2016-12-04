# Overview
* The npm package is published by the [Microsoft account](https://www.npmjs.com/~microsoft)
* [Directions for publishing](https://opensourcehub2.microsoft.com/articles/how-to-publish-npm-package) with the Microsoft Account are available with CORPNET access
* Releases are made from the "master" branch and tagged with the format "[version]"
* The npm packages are pushed to the "releases" branch and tagged with the format "npm-[version]"

# Prepare the tslint-microsoft-contrib master branch
* Make sure there are 0 closed issues without a milestone. Assign milestone as needed using [this query](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=no%3Amilestone%20is%3Aclosed%20)
* Close the milestone
* Open the next milestone
* Update the [Release Notes](https://github.com/Microsoft/tslint-microsoft-contrib/wiki/Release-Notes
)
* make sure package.json contains the version you which to publish
* update README.md to have the correct version numbers and links
* git pull
```
    git pull
```
* tag the master branch with the format [version]
```
    git tag 0.0.1
    git push --tags
```

# Prepare the tslint-microsoft-contrib releases branch
* git clone git@github.com:Microsoft/tslint-microsoft-contrib.git tslint-microsoft-contrib-releases
* Checkout branch releases
* Replace all files with the contents of /dist/build directory created from master
* Commit and push to remote
* tag the releases branch with the format npm-[version]

```
git tag npm-2.0.10
git push --tags
```
* Go back to the master branch, increase the version number in package.json and README.md, and push


# Publish the Package with the Microsoft npmjs Account
* Follow the steps at https://opensourcehub2.microsoft.com/articles/how-to-publish-npm-package
  * Basically just send the email they want and wait a little while
  * Include the npmjs.org user ids of all contributors: brndkfr, hamletdrc, dmanesku