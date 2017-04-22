/* tslint:disable:max-func-body-length */

import {TestHelper} from './TestHelper';

/**
 * Unit tests.
 */
describe('noUnsupportedBrowserCodeRule', () : void => {

    const ruleName : string = 'no-unsupported-browser-code';
    const options = [true, [
        'Mobile IE 10',
        'IE >= 10',
        'Chrome > 45',
        'Firefox',
        'Mobile Safari < 10'
    ]];

    it('should pass on matching supported browsers', () : void => {
        const script : string = `
            class Test {
                // Browser Specific: Chrome 49
                sayHey() {
                    console.log('hey');
                }

                // browser specific: IE 10
                sayHello() {
                    console.log('hello');
                }

                /**
                 * Says hi
                 *
                 * @browserspecific Firefox 48
                 */
                sayHi() {
                    console.log('hi');
                }

                // Browser specific: firefox
                sayBye() {
                    console.log('bye');
                }

                /**
                 * goes boom
                 *
                 * @browserspecific mobile safari 9
                 * @browserspecific            IE 10
                 */
                goBoom() {
                    throw new Error('boom');
                }

                /**
                 * goes vroom
                 *
                 * @browserspecific mobile ie 10
                 */
                goVroom() {
                    console.log('vroom');
                }
            }
        `;

        TestHelper.assertNoViolationWithOptions(ruleName, options, script);
    });

    it('should fail on matching unsupported browsers', () : void => {
        const script : string = `
            class Test {
                // Browser Specific: Netscape 2
                sayHey() {
                    console.log('hey');
                }

                // browser specific: Chrome
                sayHello() {
                    console.log('hello');
                }

                /**
                 * @browserspecific IE 8
                 */
                sayHi() {
                    console.log('hi');
                }

                // Browser specific: aquaman
                sayBye() {
                    console.log('bye');
                }

                /**
                 * goes boom
                 *
                 * @browserspecific mobile safari 10
                 * @browserspecific            IE 8
                 * @browserspecific            IE
                 */
                goBoom() {
                    throw new Error('boom');
                }

                /**
                 * goes vroom
                 *
                 * @browserspecific mobile ie 9
                 */
                goVroom() {
                    console.log('vroom');
                }
            }
        `;

        TestHelper.assertViolationsWithOptions(ruleName, options, script, [
            {
                "failure": "Unsupported browser: Netscape",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 3
                }
            },
            {
                "failure": "Unsupported browser version: Chrome unspecified version",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 8
                }
            },
            {
                "failure": "Unsupported browser version: IE 8",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 13
                }
            },
            {
                "failure": "Unsupported browser: aquaman",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 20
                }
            },
            {
                "failure": "Unsupported browser version: mobile safari 10",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 25
                }
            },
            {
                "failure": "Unsupported browser version: IE 8",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 25
                }
            },
            {
                "failure": "Unsupported browser version: IE unspecified version",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 25
                }
            },
            {
                "failure": "Unsupported browser version: mobile ie 9",
                "name": "file.ts",
                "ruleName": "no-unsupported-browser-code",
                "startPosition": {
                    "character": 17,
                    "line": 36
                }
            }
        ]);
    });
});
/* tslint:enable:max-func-body-length */