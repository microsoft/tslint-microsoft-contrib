
import chai = require('chai')
import NoUnusedImportsRule = require('../src/noUnusedImportsRule');

class NoUnusedImportsTestInput {

    constructor() {
        console.log(chai); // chai is used, the other is not
    }

}

export = NoUnusedImportsTestInput;
