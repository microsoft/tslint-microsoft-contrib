'use strict';
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
var BaseFormatter_1 = require("./utils/BaseFormatter");
var Formatter = (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        return _super.call(this, 'no-require-imports', function (failure) {
            var fileName = failure.getFileName();
            var fileContents = this.readFile(fileName);
            var start = failure.getStartPosition().getPosition();
            var end = failure.getEndPosition().getPosition();
            var importStartIndex = fileContents.lastIndexOf('\n', start) + 1;
            if (importStartIndex === -1) {
                importStartIndex = 0;
            }
            var importEndIndex = fileContents.indexOf('\n', end);
            var leftSide = fileContents.substring(0, importStartIndex);
            var middle = fileContents.substring(importStartIndex, importEndIndex).trim();
            var rightSide = fileContents.substring(importEndIndex);
            var newImport = middle.replace(/import\s+(.*)\s+=\s*require\(((.|\s)*)\);/m, 'import {$1} from $2;');
            newImport = newImport.replace(/from \n/, 'from\n');
            var newContent = leftSide + newImport + rightSide;
            this.writeFile(fileName, newContent);
            console.log('Automatically converting require-style import to an ES6 import. Please re-compile and re-lint: ' + fileName);
        }) || this;
    }
    return Formatter;
}(BaseFormatter_1.BaseFormatter));
exports.Formatter = Formatter;
//# sourceMappingURL=fixNoRequireImportsFormatter.js.map