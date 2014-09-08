var _ = require('lodash');

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
    capitalise: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    trim: function (string) {
        return string.replace(/^\s+|\s+$/g, "");
    },

    toCamel: function (string) {
        return string.replace(/(\_\w)/g, function(m){return m[1].toUpperCase();}).replace(/(\-\w)/g, function(m){return m[1].toUpperCase();})

    },
    endsWith: function (string,suffix) {
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    },

    memberGetterSetter: function (methodName, proto) {
        return function (value) {
            var func = proto[methodName];

            if (func) {
                return func.apply(this, [value]);
            }

            throw new Error("not implemented " + methodName);
        }
    },

    getCallStack: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    },
    autoGenerateNamespace: function () {
        var stack = this.getCallStack();

        var filePath = _.find(stack, function (stackItem) {
            var fileName = stackItem.getFileName();

            return !this.endsWith(fileName, "appolo-class/lib/class_util.js") && !this.endsWith(fileName, "appolo-class/lib/class.js")
        },this);

        if (!filePath) {
            return "";
        }

        var fileParts = filePath.getFileName().replace(process.cwd() + "/", "").replace(".js", "").split("/");

        fileParts = _.map(fileParts, function (file) {
            return this.capitalise(this.toCamel(this.trim(file)))
        }, this);

        return fileParts.join('.');
    }
}
