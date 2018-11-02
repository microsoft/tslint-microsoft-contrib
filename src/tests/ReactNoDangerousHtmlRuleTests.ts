import { Utils } from '../utils/Utils';
import { TestHelper } from './TestHelper';

describe('reactNoDangerousHtmlRule', (): void => {
    const ruleName: string = 'react-no-dangerous-html';

    it('should find violations in .tsx files', (): void => {
        TestHelper.assertViolations(
            ruleName,
            `import React = require('react');
let text = '<div>some value</div>div>';

// example of element with start and end tag
<div foo='bar' src={'asdf'} dangerouslySetInnerHTML={{__html: text}} >
</div>;

function someFunction() {
    // example of self-closing element
    return <div dangerouslySetInnerHTML={{__html: text}} />;
}
`,
            [
                {
                    failure:
                        'Invalid call to dangerouslySetInnerHTML in method "<unknown>"\n    of source file ' +
                        Utils.absolutePath('file.tsx') +
                        '"\n    Do *NOT* add a suppression for this warning. ' +
                        'If you absolutely must use this API then you need\n    to review the usage with a security expert/QE ' +
                        'representative. If they decide that this is an\n    acceptable usage then add the exception ' +
                        'to xss_exceptions.json',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-no-dangerous-html',
                    startPosition: { character: 1, line: 5 }
                },
                {
                    failure:
                        'Invalid call to dangerouslySetInnerHTML in method "<unknown>"\n    of source file ' +
                        Utils.absolutePath('file.tsx') +
                        '"\n    Do *NOT* add a suppression for this warning. ' +
                        'If you absolutely must use this API then you need\n    to review the usage with a security expert/QE ' +
                        'representative. If they decide that this is an\n    acceptable usage then add the exception ' +
                        'to xss_exceptions.json',
                    name: Utils.absolutePath('file.tsx'),
                    ruleName: 'react-no-dangerous-html',
                    startPosition: { character: 12, line: 10 }
                }
            ]
        );
    });
});
