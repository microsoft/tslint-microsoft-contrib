# react-no-dangerous-html Rule

This rule finds usages of React's [dangerouslySetInnerHTML](https://facebook.github.io/react/tips/dangerously-set-inner-html.html). One should not use this API because it possible opens your system up to an XSS attack. 

## Suppressions
Suppressions can be specified in your tslint.json configuration file like this: 

    "react-no-dangerous-html": true, [
        { 
            file: 'MyFile.ts', 
            method: 'render', 
            comment: 'Usage has been approved by our Security Group on 2015-03-12' 
        }
    ]

Or as a better alternative you can just extract all our suppressions into a separate file: 

    "react-no-dangerous-html": [true].concat(
        grunt.file.readJSON('../xss_exceptions.json')
    )

## Audit Trail
This rule is designed to provide you with an audit trail of all dangerouslySetInnerHTML usages so that they can be reviewed by a security team before a release is made. We suggest you do the following (which is what our team does): 
* Enable this rule
* Audit each usage of dangerouslySetInnerHTML to make sure they are safe
* Extract all your suppressions into a separate file (xss_exceptions.json)
* Add the xss_exceptions.json to version control
* Review the file before each release to make sure it only contains approved usages. 

Of course, you're free to automate this even more if you'd like! This works for us though.