/// <reference path="../typings/mocha.d.ts" />
/// <reference path="../typings/chai.d.ts" />

import chai = require('chai')
import FirstRule = require('../src/NoUnusedImportsRule');

describe('FirstRuleTests', () : void => {

    it('should run a test', () : void => {
        chai.expect(1).to.equal(1);
    });

});