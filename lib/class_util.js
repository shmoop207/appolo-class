module.exports = {

    namespace: function (namespace, parentNamespace, value) {
        var properties = namespace.split('.');
        var go = function (parent) {
            while (properties.length) {
                var property = properties.shift();
                if (typeof parent[property] === 'undefined') {
                    parent[property] = {};
                }

                if (properties.length == 0 && value) {
                    parent[property] = value;
                }
                else {
                    parent = parent[property];
                }

            }

        };
        go(parentNamespace || (function () {
            return this;
        })());
    },
    capitaliseFirstLetter: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    memberGetterSetter: function (methodName, proto) {
        return function (value) {
            var func = proto[methodName];

            if (func) {
                return func.apply(this, [value]);
            }

            throw new Error("not implemented " + methodName);
        }
    }
}
