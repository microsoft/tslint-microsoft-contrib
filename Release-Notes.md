## 6.0.0

The major version 6 comes with all the greatness of the 6.0.0-beta milestone along with:

➕ New rules:

* [#147](https://github.com/Microsoft/tslint-microsoft-contrib/issues/147) New rule: `use-simple-attributes`

## 6.0.0-beta
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A6.0.0-beta0)

This was a _huge_ one.
Thanks so much to our many contributors, both during #hacktoberfest and in the surrounding weeks!

⚠️ Breaking changes:

* [#632](https://github.com/Microsoft/tslint-microsoft-contrib/issues/632) Update `export-name`: fixed overly permissive validator
* [#624](https://github.com/Microsoft/tslint-microsoft-contrib/issues/624) Update `no-relative-imports`: disallow `.` and `..` path components
* [#594](https://github.com/Microsoft/tslint-microsoft-contrib/issues/594) Update `import-name`: fixed for long `../..` paths and similar
* [#527](https://github.com/Microsoft/tslint-microsoft-contrib/issues/527) Allow `.jsx` files to be considered as TSX

➕ New rules:

* [#457](https://github.com/Microsoft/tslint-microsoft-contrib/issues/457) New rule: `informative docs`
* [#280](https://github.com/Microsoft/tslint-microsoft-contrib/issues/280) New rule: `react-a11y-required`
* [#278](https://github.com/Microsoft/tslint-microsoft-contrib/issues/278) New rule: `react-a11y-no-onchange`
* [#275](https://github.com/Microsoft/tslint-microsoft-contrib/issues/275) New rule: `react-a11y-input-elements`
* [#253](https://github.com/Microsoft/tslint-microsoft-contrib/issues/253) New rule: `non-literal-fs-path`

✅ General changes:

* [#634](https://github.com/Microsoft/tslint-microsoft-contrib/issues/634) Remove absolute paths from error messages
* [#588](https://github.com/Microsoft/tslint-microsoft-contrib/issues/588) Update `import-name`: better documentation on complex packages
* [#571](https://github.com/Microsoft/tslint-microsoft-contrib/issues/571) Update `react-anchor-blank-noopener`: option to avoid redundant rel values
* [#545](https://github.com/Microsoft/tslint-microsoft-contrib/issues/545) Update `mocha-no-side-effect-code`: ignore `.forEach` setups
* [#541](https://github.com/Microsoft/tslint-microsoft-contrib/issues/541) Update `import-name`: option for ignoring node_modules
* [#537](https://github.com/Microsoft/tslint-microsoft-contrib/issues/537) Update `react-no-dangerous-html`: suppressions no longer require absolute paths
* [#535](https://github.com/Microsoft/tslint-microsoft-contrib/issues/535) Update `react-this-binding-issue`: performance boost from internal `Set`s
* [#531](https://github.com/Microsoft/tslint-microsoft-contrib/issues/531) Update `export-name`: case-insensitive by default
* [#525](https://github.com/Microsoft/tslint-microsoft-contrib/issues/525) Don't consider `.tsx.ts` files as TSX
* [#518](https://github.com/Microsoft/tslint-microsoft-contrib/issues/518) Update `no-function-expression`: exclude generics in `.tsx` files
* [#498](https://github.com/Microsoft/tslint-microsoft-contrib/issues/498) Update `function-name`: add options for overlapping private and/or static method types
* [#493](https://github.com/Microsoft/tslint-microsoft-contrib/issues/493) Update `no-relative-import`: allow same folder imports
* [#486](https://github.com/Microsoft/tslint-microsoft-contrib/issues/486) Remove `newline-before-return` from recommended preset
* [#459](https://github.com/Microsoft/tslint-microsoft-contrib/issues/459) Update `function-name`: support symbol properties as names
* [#451](https://github.com/Microsoft/tslint-microsoft-contrib/issues/451) Update `import-name`: allow more forms of specifies with hyphens
* [#440](https://github.com/Microsoft/tslint-microsoft-contrib/issues/440) Update `no-suspicious-comment`: allow links to issues
* [#437](https://github.com/Microsoft/tslint-microsoft-contrib/issues/437) Update `react-a11y-image-button-has-alt`: no longer throw on input elements
* [#434](https://github.com/Microsoft/tslint-microsoft-contrib/issues/434) Update `react-a11y-anchors`: warn when there is no `'href'` attribute
* [#433](https://github.com/Microsoft/tslint-microsoft-contrib/issues/433) Update `react-a11y-anchors`: allow children and hidden content
* [#430](https://github.com/Microsoft/tslint-microsoft-contrib/issues/430) Update `export-name`: add `ignore-case` option
* [#429](https://github.com/Microsoft/tslint-microsoft-contrib/issues/429) Update `import-name`: clear documentation examples
* [#424](https://github.com/Microsoft/tslint-microsoft-contrib/issues/424) Update `import-name`: allow snake_case file names
* [#394](https://github.com/Microsoft/tslint-microsoft-contrib/issues/394) Update `react-a11y-anchors`: add `ignore-case` and `ignore-whitespace` options
* [#393](https://github.com/Microsoft/tslint-microsoft-contrib/issues/393) Update `max-func-body-length`: allow `default` classes
* [#392](https://github.com/Microsoft/tslint-microsoft-contrib/issues/392) Update `react-this-binding`: add detection for `@bind` decorators
* [#378](https://github.com/Microsoft/tslint-microsoft-contrib/issues/378) Update `import-name`: ignore modules with dotted paths
* [#362](https://github.com/Microsoft/tslint-microsoft-contrib/issues/362) Update `no-increment-decrement`: add an `allow-for-loop` option
* [#353](https://github.com/Microsoft/tslint-microsoft-contrib/issues/353) Update `react-tsx-curly-spacing`: empty `{}` node when it only contains comments
* [#317](https://github.com/Microsoft/tslint-microsoft-contrib/issues/317) Update `react-a11y-img-has-alt`: alt-text cannot be an image file name
* [#276](https://github.com/Microsoft/tslint-microsoft-contrib/issues/276) Update `img-alt-ignored-image-support`: add check for title attribute for images

☑️ Internal source code improvements:

* [#622](https://github.com/Microsoft/tslint-microsoft-contrib/issues/622) Added Node versions 10 and 11 on Travis
* [#616](https://github.com/Microsoft/tslint-microsoft-contrib/pulls/616) Add watcher that will run tests and lint
* [#610](https://github.com/Microsoft/tslint-microsoft-contrib/issues/610) Simplified release process to remove `npm-*` and `releases` branches
* [#602](https://github.com/Microsoft/tslint-microsoft-contrib/issues/602) Enabled `prefer-readonly` in source code
* [#587](https://github.com/Microsoft/tslint-microsoft-contrib/issues/587) Added Windows builds to Travis configuration
* [#568](https://github.com/Microsoft/tslint-microsoft-contrib/issues/568) Completely removed `ErrorTolerantWalker`
* [#566](https://github.com/Microsoft/tslint-microsoft-contrib/issues/566) Enabled `no-any` in source code
* [#558](https://github.com/Microsoft/tslint-microsoft-contrib/issues/558) Added Prettier
* [#556](https://github.com/Microsoft/tslint-microsoft-contrib/issues/556) Mark `ErrorTolerantWalker` as deprecated
* [#528](https://github.com/Microsoft/tslint-microsoft-contrib/issues/528) Added `launch.json` for VS Code
* [#512](https://github.com/Microsoft/tslint-microsoft-contrib/issues/512) Bumped Node versions on Travis to 6 and 8
* [#490](https://github.com/Microsoft/tslint-microsoft-contrib/issues/490) Stopped using `null` unnecessarily in source code
* [#484](https://github.com/Microsoft/tslint-microsoft-contrib/issues/484) Replaced Grunt dependency with npm scripts
* [#461](https://github.com/Microsoft/tslint-microsoft-contrib/issues/461) Used TypeScript's `--strict` mode in source code


## 5.2.1
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A5.2.1)
* [#479](https://github.com/Microsoft/tslint-microsoft-contrib/issues/479) Source control improvement: repository forces `\n` endline style on Windows
* [#485](https://github.com/Microsoft/tslint-microsoft-contrib/issues/485) Adjusted `tsutils` peer dependency to not allow versions that break either TypeScript 2.X or 3.X

## 5.2.0
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A5.2.0)
* [#207](https://github.com/Microsoft/tslint-microsoft-contrib/issues/207) Checked second expect() messages in chai-vague-errors
* [#454](https://github.com/Microsoft/tslint-microsoft-contrib/issues/454) Disable no-multiline-string in recommended ruleset
* [#465](https://github.com/Microsoft/tslint-microsoft-contrib/issues/465) Avoided matching describe() calls in max-func-body-length
* [#468](https://github.com/Microsoft/tslint-microsoft-contrib/issues/468) Fixed max-func-body-length off-by-one counts
* [#475](https://github.com/Microsoft/tslint-microsoft-contrib/issues/475) Added TypeScript@3 as allowed peer dependency
* [#476](https://github.com/Microsoft/tslint-microsoft-contrib/issues/476) Fixed react-a11y-image-button-has-alt crashes on expression types

## 5.1.0
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A5.1.0)
* [#115](https://github.com/Microsoft/tslint-microsoft-contrib/issues/115) Single line block comments allowed to be nested inside code or JSX
* [#291](https://github.com/Microsoft/tslint-microsoft-contrib/issues/291) Excluded generators in no-function-expression 
* [#381](https://github.com/Microsoft/tslint-microsoft-contrib/issues/381) Fixed no-unnecessary-local-variable false positive 
* [#389](https://github.com/Microsoft/tslint-microsoft-contrib/issues/389) Ignored test inclusions/exclusions for mocha-no-side-effect-code
* [#412](https://github.com/Microsoft/tslint-microsoft-contrib/pull/412) Fixed several no-octal-literal edge cases
* [#413](https://github.com/Microsoft/tslint-microsoft-contrib/issues/413) Fixed backslashes in no-octal-literal 
* [#417](https://github.com/Microsoft/tslint-microsoft-contrib/pull/417) Type-checking for noStringBased rules 
* [#423](https://github.com/Microsoft/tslint-microsoft-contrib/pull/423) Allowed `http://localhost` for recommended no-http-string setting
* [#425](https://github.com/Microsoft/tslint-microsoft-contrib/issues/425) Added config setting for `no-inner-html` for which expressions to flag
* [#427](https://github.com/Microsoft/tslint-microsoft-contrib/pull/427) Added console.error to recommended ruleset for `no-console`
* [#444](https://github.com/Microsoft/tslint-microsoft-contrib/issues/444) Started flagging `export { ... }` declarations in export-name
* [#446](https://github.com/Microsoft/tslint-microsoft-contrib/issues/446) Allowed this.timeout in mocha-no-side-effect-code 
* [#447](https://github.com/Microsoft/tslint-microsoft-contrib/pull/447) Update broken accessibility link in README.md  
* [#449](https://github.com/Microsoft/tslint-microsoft-contrib/pull/449) Removed invalid examples.com domain from recommended ruleset

## 5.0.3
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A5.0.3)
* [#390](https://github.com/Microsoft/tslint-microsoft-contrib/issues/390) react-a11y-image-button-has-alt toLowerCase error throws
* [#414](https://github.com/Microsoft/tslint-microsoft-contrib/issues/414) Remove TypeError in reactA11yImgHasAltRule.ts for undefined role attribute 
* [#411](https://github.com/Microsoft/tslint-microsoft-contrib/issues/411) Removed default configuration of deprecated rules. 
* [#405](https://github.com/Microsoft/tslint-microsoft-contrib/issues/405) Deprecated several rules that are now duplicates
* [#410](https://github.com/Microsoft/tslint-microsoft-contrib/issues/410) Removed default configuration of deprecated rules. 

## 5.0.2
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A5.0.2)
* [#402](https://github.com/Microsoft/tslint-microsoft-contrib/issues/402) fix false positive for no-string-based-set-timeout
* [#406](https://github.com/Microsoft/tslint-microsoft-contrib/issues/406) deprecate no-stateless-class rule in favor of no-unnecessary-class
* [#382](https://github.com/Microsoft/tslint-microsoft-contrib/issues/382) Deprecate the `no-var-self` rule and replace with no-this-assignment
* [#401](https://github.com/Microsoft/tslint-microsoft-contrib/issues/401) add grunt rule to generate rule-metadata.json which contains all rule…
* [#400](https://github.com/Microsoft/tslint-microsoft-contrib/issues/400) Audit rules that have already been added in TSLint
* [#399](https://github.com/Microsoft/tslint-microsoft-contrib/issues/399) Use ReadonlyArray for node arrays
* [#391](https://github.com/Microsoft/tslint-microsoft-contrib/issues/391) Upgrade grunt and other library versions in build
* [#386](https://github.com/Microsoft/tslint-microsoft-contrib/issues/386) Add 'typescript' to peer dependencies
* [#379](https://github.com/Microsoft/tslint-microsoft-contrib/issues/379) The use-isnan rule is fully removed

## 5.0.1
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A5.0.1)
* [#373](https://github.com/Microsoft/tslint-microsoft-contrib/issues/373) Fix tsutils peer dependency issue with tslint-microsoft-contrib@5.0.0
* [#371](https://github.com/Microsoft/tslint-microsoft-contrib/issues/371) relax tsutils peer dependency  
* [#375](https://github.com/Microsoft/tslint-microsoft-contrib/issues/375) Fix mocha-avoid-only. Only return expression length to stop annoying whole block underlining
* [#372](https://github.com/Microsoft/tslint-microsoft-contrib/issues/372) Remove the use-isnan rule
* [#370](https://github.com/Microsoft/tslint-microsoft-contrib/issues/370) Fix no-http-string. Do not ignore template strings


## 5.0.0
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A5.0.0)

* [#359](https://github.com/Microsoft/tslint-microsoft-contrib/issues/359) Update TSLint to v5
* [#354](https://github.com/Microsoft/tslint-microsoft-contrib/issues/354) tslint 5.0.0 contains custom rule breaking changes
* [#367](https://github.com/Microsoft/tslint-microsoft-contrib/issues/367) Add support for tslint version to 5.1.0  
* [#369](https://github.com/Microsoft/tslint-microsoft-contrib/issues/369) Support typescript 2.3
* [#349](https://github.com/Microsoft/tslint-microsoft-contrib/issues/349) New rule: no-useless-files  
* [#368](https://github.com/Microsoft/tslint-microsoft-contrib/issues/368) Remove deprecated rule 'no-unused-imports'
* [#364](https://github.com/Microsoft/tslint-microsoft-contrib/issues/364) remove no-sparse-arrays rule
* [#361](https://github.com/Microsoft/tslint-microsoft-contrib/issues/361) Use TypeScript config files for compilation 
* [#360](https://github.com/Microsoft/tslint-microsoft-contrib/issues/360) gruntfile and tsconfig are inconsistent
* [#350](https://github.com/Microsoft/tslint-microsoft-contrib/issues/350) Add AppVeyor configuration  
* [#348](https://github.com/Microsoft/tslint-microsoft-contrib/issues/348) Fix the new rule snippet to not create an immediately broken file 

## 4.0.1
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A4.0.1)

* [#345](https://github.com/Microsoft/tslint-microsoft-contrib/issues/345) Remove no-unused-variable to suppress tslint warning 
* [#344](https://github.com/Microsoft/tslint-microsoft-contrib/issues/344) typedef rule - Change recommended parameters so to something meaningful bug
* [#343](https://github.com/Microsoft/tslint-microsoft-contrib/issues/343) object-literal-key-quotes false positive when linting empty string
* [#341](https://github.com/Microsoft/tslint-microsoft-contrib/issues/341) Recommended value for member-ordering rule is pointless enhancement
* [#338](https://github.com/Microsoft/tslint-microsoft-contrib/issues/338) no-http-string rule - false positive when http:// occurs in the middle of a string
* [#337](https://github.com/Microsoft/tslint-microsoft-contrib/issues/337) Performance - no-http-string should replace regex with indexOf 
* [#336](https://github.com/Microsoft/tslint-microsoft-contrib/issues/336) no-http-string rule should support very large source files and string input
* [#333](https://github.com/Microsoft/tslint-microsoft-contrib/issues/333) remove "prefer-const" rule - tslint has same rule with same name so our's is unusable
* [#332](https://github.com/Microsoft/tslint-microsoft-contrib/issues/332) Performance - no-http-string should use visitStringLiteral not visitNode 
* [#331](https://github.com/Microsoft/tslint-microsoft-contrib/issues/331) no-http-string's NoHttpStringWalker should use visitStringLiteral
* [#328](https://github.com/Microsoft/tslint-microsoft-contrib/issues/328) Deprecate no-empty-interfaces - rule is now in TSLint bug
* [#327](https://github.com/Microsoft/tslint-microsoft-contrib/issues/327) Improve import-name failure message when import filenames contain a dot enhancement
* [#326](https://github.com/Microsoft/tslint-microsoft-contrib/issues/326) update recommended ruleset with new tslint 4.0 rules

## 4.0.0
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A3.0.0)

* [#313](https://github.com/Microsoft/tslint-microsoft-contrib/issues/313) Enhancement - tslint 4.0 support
* [#319](https://github.com/Microsoft/tslint-microsoft-contrib/issues/319) Enhancement - react-a11y-anchors-rule now includes innerimage alt text as its text content
* [#318](https://github.com/Microsoft/tslint-microsoft-contrib/issues/318) Enhancement - Fix line endings errors in IDE by providing an .editorconfig file
* [#320](https://github.com/Microsoft/tslint-microsoft-contrib/issues/320) Bug - react-a11y-img-has-alt not working when passing options

## 2.0.14
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?q=milestone%3A2.0.14)

* [#302](https://github.com/Microsoft/tslint-microsoft-contrib/issues/302) New Rule - react-tsx-curly-spacing - Port TSX curly spacing rule.
* [#255](https://github.com/Microsoft/tslint-microsoft-contrib/issues/255) New Rule - new security rule: detect-non-literal-require
* [#311](https://github.com/Microsoft/tslint-microsoft-contrib/issues/311) Enhancement - Configurable Props and State interface names
* [#310](https://github.com/Microsoft/tslint-microsoft-contrib/issues/310) Enhancement - Rule no-stateless-class does not account for constructors using parameter properties bug
* [#308](https://github.com/Microsoft/tslint-microsoft-contrib/issues/308) Enhancement - function-name rule - add support for linting protected methods
* [#303](https://github.com/Microsoft/tslint-microsoft-contrib/issues/303) Enhancement - mocha-no-side-effect: Add support for "BeforeAll()" and "afterAll()" methods (Jasmine)
* [#301](https://github.com/Microsoft/tslint-microsoft-contrib/issues/301) Enhancement - Declare TypeScript SDK path in VSCode settings.
* [#292](https://github.com/Microsoft/tslint-microsoft-contrib/issues/292) Enhancement - support checkLoops for noConstantConditionRule
* [#240](https://github.com/Microsoft/tslint-microsoft-contrib/issues/240) Enhancement - mocha rules: support context and specify feature-request
* [#317](https://github.com/Microsoft/tslint-microsoft-contrib/issues/317) Documentation - Use inline code in `prefer-type-cast` doc to improve readability
* [#312](https://github.com/Microsoft/tslint-microsoft-contrib/issues/312) Bug Fix - Support for Typescript 2.1
* [#307](https://github.com/Microsoft/tslint-microsoft-contrib/issues/307) Bug Fix - False positive for no-unnecessary-semicolons on empty loops bug
* [#306](https://github.com/Microsoft/tslint-microsoft-contrib/issues/306) Bug Fix - false positive in string timeout methods: Function is treated as string
* [#305](https://github.com/Microsoft/tslint-microsoft-contrib/issues/305) Bug Fix - fix anchors rule not correctly apply 4 chars rule
* [#304](https://github.com/Microsoft/tslint-microsoft-contrib/issues/304) Bug Fix - Remove deprecated no-duplicate-key rule
* [#298](https://github.com/Microsoft/tslint-microsoft-contrib/issues/298) Bug Fix - update rule: react-a11y-img-has-alt - should allow role='presentation' with non-empty alt text.
* [#296](https://github.com/Microsoft/tslint-microsoft-contrib/issues/296) Bug Fix - update rule: react-a11y-role-supports-aria-props - Do not check custom element
* [#295](https://github.com/Microsoft/tslint-microsoft-contrib/issues/295) Bug Fix - update rule: react-a11y-anchors - Do not check if role='button'
* [#261](https://github.com/Microsoft/tslint-microsoft-contrib/issues/261) Bug Fix - 'this' banned term conflicts with Typescript's function this-types

## 2.0.13
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aclosed%20milestone%3A2.0.13)

* [#268](https://github.com/Microsoft/tslint-microsoft-contrib/issues/268) Make extends tslint.json easier by adding "rulesDirectory": "./".
* [#270](https://github.com/Microsoft/tslint-microsoft-contrib/issues/270) TestHelper fail in version 2.0.12
* [#289](https://github.com/Microsoft/tslint-microsoft-contrib/issues/289) react-a11y-anchors false positive when anchor href is undefined bug
* [#288](https://github.com/Microsoft/tslint-microsoft-contrib/issues/288) react-a11y-proptypes: fix rule to scan boolean types when analyzing tokens bug
* [#287](https://github.com/Microsoft/tslint-microsoft-contrib/issues/287) aria-role-supports-props: false positive when role is defined by an expression bug
* [#269](https://github.com/Microsoft/tslint-microsoft-contrib/issues/269) react-a11y-anchors fails on links that contact exactly 4 characters of text bug

## 2.0.11/2.0.12
A big release and a big thank you to all the contributors: 
From the Suzhou SOX Publishing team
* Liubin Guo (huge thanks!), Liaoliang Ye, and Evgeniia Firsova

From the Microsoft Social Engagement team
* MogensFogh, Daniel Manesku - @danielmanesku, Cosmin Cojocar - @cosmincojocar, and @loicraux 

From the world outside Microsoft! 
* Matteo Ferrando - @chamini2, Gaurav Ramanan - @gaurav21r, Przemysław Duszyński - @Przemek-at-Ais, @studds, and Saurabh Sharma

[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aclosed%20milestone%3A2.0.11)

* [#267](https://github.com/Microsoft/tslint-microsoft-contrib/issues/267) remove underscore dependency in 2.0.11
* [#256](https://github.com/Microsoft/tslint-microsoft-contrib/issues/256) new security rule: detect-possible-timing-attacks
* [#210](https://github.com/Microsoft/tslint-microsoft-contrib/issues/210) new security rule: react-anchor-blank-noopener
* [#187](https://github.com/Microsoft/tslint-microsoft-contrib/issues/187) new security rule: insecure random (CWE-330)
* [#186](https://github.com/Microsoft/tslint-microsoft-contrib/issues/186) new security rule: suspicious comment (CWE 546)
* [#257](https://github.com/Microsoft/tslint-microsoft-contrib/issues/257) new rule: react-a11y-event-has-role
* [#247](https://github.com/Microsoft/tslint-microsoft-contrib/issues/247) new rule: react-a11y-aria-unsupported-elements
* [#246](https://github.com/Microsoft/tslint-microsoft-contrib/issues/246) new rule: react-a11y-image-button-has-alt rule
* [#245](https://github.com/Microsoft/tslint-microsoft-contrib/issues/245) new rule: react-a11y-proptypes
* [#216](https://github.com/Microsoft/tslint-microsoft-contrib/issues/216) new rule: react-a11y-role-supports-aria-props - Enforce that elements with explicit or implicit roles defined contain only aria-* properties supported by that role
* [#215](https://github.com/Microsoft/tslint-microsoft-contrib/issues/215) new rule: react-a11y-role - Elements with aria roles must use a **valid**, **non-abstract** aria role
* [#214](https://github.com/Microsoft/tslint-microsoft-contrib/issues/214) new rule: react-a11y-role-has-required-aria-props - Elements with aria roles must have all required attributes according to the role
* [#213](https://github.com/Microsoft/tslint-microsoft-contrib/issues/213) new rule: react-a11y-props - Enforce all aria-* props are valid.
* [#212](https://github.com/Microsoft/tslint-microsoft-contrib/issues/212) new rule: react-a11y-img-has-alt - <img> elements must have an alt-text defined
* [#211](https://github.com/Microsoft/tslint-microsoft-contrib/issues/211) new rule: react-a11y-tabindex-no-positive - Enforce tabIndex value is not greater than zero.
* [#199](https://github.com/Microsoft/tslint-microsoft-contrib/issues/199) new rule: react-a11y-anchors
* [#197](https://github.com/Microsoft/tslint-microsoft-contrib/issues/197) new rule: react-a11y-titles
* [#194](https://github.com/Microsoft/tslint-microsoft-contrib/issues/194) new rule: react-a11y-lang
* [#239](https://github.com/Microsoft/tslint-microsoft-contrib/issues/239) Support for context.only in Mocha related rules
* [#265](https://github.com/Microsoft/tslint-microsoft-contrib/issues/265) allow other projects to use extends for our tslint.json
* [#234](https://github.com/Microsoft/tslint-microsoft-contrib/issues/234) react-aria rules: update implicit roles, aria schema, and role schema to support ARIA 1.1
* [#218](https://github.com/Microsoft/tslint-microsoft-contrib/issues/218) Update react-a11y-img-has-alt - If an image has an alt or title attribute, it should not have a presentation role

## 2.0.10
[All Issues](https://github.com/Microsoft/tslint-microsoft-contrib/issues?utf8=%E2%9C%93&q=is%3Aissue%20milestone%3A2.0.10)

* [#189](https://github.com/Microsoft/tslint-microsoft-contrib/issues/189) new security rule: iframe has invalid or missing sandbox attribute
* [#73](https://github.com/Microsoft/tslint-microsoft-contrib/issues/73) new rule: unused react interface property
* [#180](https://github.com/Microsoft/tslint-microsoft-contrib/issues/180) new rule: chai - indexOf can be .contains call
* [#179](https://github.com/Microsoft/tslint-microsoft-contrib/issues/179) new rule: unneeded mocha done
* [#171](https://github.com/Microsoft/tslint-microsoft-contrib/issues/171) new rule: no-unsupported-browser-code
* [#115](https://github.com/Microsoft/tslint-microsoft-contrib/issues/115) new rule: no single line block comment
* [#85](https://github.com/Microsoft/tslint-microsoft-contrib/issues/85) new rule: mocha-no-side-effect-code
* [#44](https://github.com/Microsoft/tslint-microsoft-contrib/issues/44) new rule: enforce one of the two Underscore function call forms
* [#190](https://github.com/Microsoft/tslint-microsoft-contrib/issues/190) Add tslint.json to npm release
* [#184](https://github.com/Microsoft/tslint-microsoft-contrib/issues/184) Export TestHelper in npm package
* [#183](https://github.com/Microsoft/tslint-microsoft-contrib/issues/183) add Common Weakness Enumeration info to all rules and generate spreadsheet
* [#173](https://github.com/Microsoft/tslint-microsoft-contrib/issues/173) rewrite formatters adding extra white space
* [#172](https://github.com/Microsoft/tslint-microsoft-contrib/issues/172) `import-name` needs to be configurable for kebab-cased imports
* [#110](https://github.com/Microsoft/tslint-microsoft-contrib/issues/110) prefer-array-literal: Error when using Array in a type annotation
* [#83](https://github.com/Microsoft/tslint-microsoft-contrib/issues/83) enhance chai-vague-error rule
* [#64](https://github.com/Microsoft/tslint-microsoft-contrib/issues/64) Update development section of the doc