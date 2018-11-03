import {Utils} from '../utils/Utils';
import {TestHelper} from './TestHelper';
/**
 * Unit tests.
 */
describe('useSimpleAttributeRule', () : void => {
    const ruleName : string = 'use-simple-attribute';
    const binaryExpressionErrorMessage: string = 'Attribute containes a complex binary expression';
    const trenaryExpressionErrorMessage: string = 'Attribute contains a trenary expression';
    it('if this rule is out then first check doesnt work', () : void => {
        TestHelper.assertNoViolation(ruleName, 'someScript');
    });
    it('should fail if only attribute initializer is a complex binary expression', () : void => {
        const script : string = `
        import React = require('react');
        const element = <foo bar={"value1" + "value2" + "value3"}/>\`;
        `;

        TestHelper.assertViolations(ruleName, script, [
        {
            failure: binaryExpressionErrorMessage,
            name: Utils.absolutePath('file.tsx'),
            ruleName: ruleName,
            startPosition: { character: 25, line: 3 }
        }]);
    });
    it('should fail if any attribute initializer is a complex binary expression', () : void => {
        const script : string = `
        import React = require('react');
        const element = <foo str="hello" bar={"value1" + "value2" + "value3"}/>\`;
        `;

        TestHelper.assertViolations(ruleName, script, [
        {
            failure: binaryExpressionErrorMessage,
            name: Utils.absolutePath('file.tsx'),
            ruleName: ruleName,
            startPosition: { character: 25, line: 3 }
        }]);
    });
    it('should pass if any attribute initializer is a simple binary expression', () : void => {
        const script : string = `
        import React = require('react');
        const element = <foo str="hello" bar={"value1" + "value2"}/>\`;
        `;

        TestHelper.assertNoViolation(ruleName, script);
    });
    it('should fail if only attribute initializer is a trenary expression', () : void => {
        const script : string = `
        import React = require('react');
        const someVar = 3;
        const element = <foo bar={someVar == 3 ? true : false}/>\`;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: trenaryExpressionErrorMessage,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 25, line: 4 }
            }]);
    });
    it('should fail if any attribute initializer is a trenary expression', () : void => {
        const script : string = `
        import React = require('react');
        const someVar = 3;
        const element = <foo str="123" bar={someVar == 3 ? true : false}/>\`;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: trenaryExpressionErrorMessage,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 25, line: 4 }
            }]);
    });
    it('should fail if any attribute initializer is a trenary expression or a complex binary expression', () : void => {
        const script : string = `
        import React = require('react');
        const someVar = 3;
        const element = <foo str="123" bar={someVar == 3 ? true : false} bin={"value1" + someVar + "value2"/>\`;
        `;

        TestHelper.assertViolations(ruleName, script, [
            {
                failure: trenaryExpressionErrorMessage,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 25, line: 4 }
            },
            {
                failure: binaryExpressionErrorMessage,
                name: Utils.absolutePath('file.tsx'),
                ruleName: ruleName,
                startPosition: { character: 25, line: 4 }
            }]);
    });
});
