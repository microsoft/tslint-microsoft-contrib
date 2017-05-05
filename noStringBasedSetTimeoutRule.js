"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var NoStringParameterToFunctionCallWalker_1 = require("./utils/NoStringParameterToFunctionCallWalker");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithProgram(sourceFile, undefined);
    };
    Rule.prototype.applyWithProgram = function (sourceFile, program) {
        var walker = new NoStringParameterToFunctionCallWalker_1.NoStringParameterToFunctionCallWalker(sourceFile, 'setTimeout', this.getOptions(), program);
        return this.applyWithWalker(walker);
    };
    return Rule;
}(Lint.Rules.OptionallyTypedRule));
Rule.metadata = {
    ruleName: 'no-string-based-set-timeout',
    type: 'maintainability',
    description: 'Do not use the version of setTimeout that accepts code as a string argument.',
    options: null,
    optionsDescription: '',
    typescriptOnly: true,
    issueClass: 'SDL',
    issueType: 'Error',
    severity: 'Critical',
    level: 'Mandatory',
    group: 'Security',
    commonWeaknessEnumeration: '95, 676, 242, 116'
};
exports.Rule = Rule;
//# sourceMappingURL=noStringBasedSetTimeoutRule.js.map