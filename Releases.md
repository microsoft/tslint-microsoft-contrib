# Overview
* The npm package is published by the [Microsoft account](https://www.npmjs.com/~microsoft)
* [Directions for publishing](https://opensourcehub2.microsoft.com/articles/how-to-publish-npm-package) with the Microsoft Account are available with CORPNET access
* Releases are made from the "master" branch and tagged with the format "[version]"
* The npm packages are pushed to the "releases" branch and tagged with the format "npm-[version]"

# Prepare the tslint-microsoft-contrib master branch
* git pull and do a full build
```
    git pull
    npm install
    grunt 
```

* tag the master branch with the format [version]
```
    git tag 0.0.1
    git push --tags
```

* Increase version number in package.json and push

# Prepare the tslint-microsoft-contrib releases branch
* git clone git@github.com:Microsoft/tslint-microsoft-contrib.git tslint-microsoft-contrib-releases
* Checkout branch releases
* Replace all files with the contents of /dist/build directory created from master
* Commit and push to remote
* tag the releases branch with the format npm-[version]

```
git tag npm-0.0.1
git push --tags
```

# Publish the Package with the Microsoft npmjs Account
* Follow the steps at https://opensourcehub2.microsoft.com/articles/how-to-publish-npm-package
  * Basically just send the email they want and wait a little while