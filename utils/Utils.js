var Utils;
(function (Utils) {
    function exists(list, predicate) {
        if (list != null) {
            for (var i = 0; i < list.length; i++) {
                var obj = list[i];
                if (predicate(obj)) {
                    return true;
                }
            }
        }
        return false;
    }
    Utils.exists = exists;
    function reduce(list, predicate, initialValue) {
        var result = initialValue;
        if (list != null) {
            list.forEach(function (element) {
                result = predicate(result, element);
            });
        }
        return result;
    }
    Utils.reduce = reduce;
})(Utils || (Utils = {}));
module.exports = Utils;
//# sourceMappingURL=Utils.js.map