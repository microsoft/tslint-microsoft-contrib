'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseFormatter_1 = require('./utils/BaseFormatter');
var Formatter = (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        var _this = this;
        _super.call(this, 'no-var-keyword', function (failure) {
            var fileName = failure.getFileName();
            var start = failure.getStartPosition();
            var fileContents = _this.readFile(fileName);
            var leftSide = fileContents.substring(0, start.getPosition());
            var rightSide = fileContents.substring(start.getPosition() + 3);
            var newContent = leftSide + 'let' + rightSide;
            _this.writeFile(fileName, newContent);
            console.log('Automatically converting var to let. Please re-compile and re-lint: ' + fileName);
        });
    }
    return Formatter;
}(BaseFormatter_1.BaseFormatter));
exports.Formatter = Formatter;
//# sourceMappingURL=fixNoVarKeywordFormatter.js.map