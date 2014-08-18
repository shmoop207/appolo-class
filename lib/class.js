"use strict";
var _ = require('lodash'),
    util = require('./class_util');

function define(namespace, api) {

    var config, klass, parent,
        ignoredKeys = { constructor: true, prototype: true, $config: true, callParent: true };

    if (!api) {
        api = namespace;
        namespace = null;
    }

    //get config
    config = api.$config || {};

    //get api
    api = _.isFunction(api) ? api() : api;

    namespace = namespace || config.namespace || null;

    //set name
    config.name = config.name || (namespace && namespace.replace(/\./g, '_')) || "";

    //get parent
    parent = config.extends || function () {
    };

    //create constructor if not given
    if (_.has(api, 'constructor')) {

        //add call parent to constructor
        klass = (function (supProto) {

            var factory = function() {
                var wrappedFunc = function UnNamedClass() {
                    this.callParent = supProto["constructor"];
                    try {
                        return api.constructor.apply(this, arguments);
                    } finally {
                        delete this.callParent;
                    }
                };

                wrappedFunc.toString = function () {
                    return api.constructor.toString();
                };

                return wrappedFunc;
            };

            if (config.name) {
                var serialized = factory.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1].replace('UnNamedClass', config.name);

                return new Function('supProto','api',serialized)(supProto, api)
            } else {
                return factory();
            }


        })(parent.prototype);
    }
    else if (config.extends) {
        //set constructor to be parent constructor
        klass = (function (parent) {

            if (config.name) {
                return new Function(
                    'parent',
                        'return function ' + config.name + ' () {parent.apply(this, arguments); }'
                )(parent)
            }
            else {

                return function () {
                    parent.apply(this, arguments);
                };
            }

        })(parent);

    }
    else { //constructor to empty function

        klass = config.name ? new Function('return function ' + config.name + ' () {}')() : function () {
        }
    }

    //create class prototype
    klass.prototype = Object.create(parent.prototype, {
        constructor: {
            value: klass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    //copy prototype
    _.forEach(api, function (func, name) {

        if (!ignoredKeys[name]) {

            if (!_.isFunction(func)) {
                klass.prototype[name] = func;
            }
            else {
                klass.prototype[name] = (function (name, func, supProto) {
                    var wrappedFunc = function () {
                        this.callParent = supProto[name];

                        try {
                            return func.apply(this, arguments);
                        } finally {
                            delete this.callParent;
                        }
                    };

                    wrappedFunc.toString = function () {
                        return func.toString();
                    };

                    return  wrappedFunc

                })(name, func, parent.prototype);
            }
        }
    });

    //add statics
    _.forEach(config.statics, function (func, name) {
        klass[name] = func;
        klass.prototype[name] = func;
    });

    //add mixin
    if (config.mixins) {
        _.forEach(_.isArray(config.mixins) ? config.mixins : [config.mixins], function (mixin) {

            _.forEach(mixin.prototype, function (mixinFunc, mixinName) {
                klass.prototype[mixinName] = mixinFunc;
            });
        });
    }

    //run on plugins
    _.forEach(plugins, function (func) {
        func(config, klass, parent);
    });

    //add define method for easy inheritance
    klass.define = (function (klass, define) {
        return function (namespace, api) {

            if (!api) {
                api = namespace;
                namespace = null;
            }

            api.$config = api.$config || {};

            api.$config.extends = klass;

            return define(namespace, api)
        }
    })(klass, define);

    if (namespace) {
        util.namespace(namespace, GLOBAL, klass);
    }

    if (Array.isArray(config.members)) {
        _.forEach(config.members, function (property) {

            var getter = util.memberGetterSetter('get' + util.capitaliseFirstLetter(property), klass.prototype);
            var setter = util.memberGetterSetter('set' + util.capitaliseFirstLetter(property), klass.prototype);

            Object.defineProperty(klass.prototype, property, { get: getter, set: setter });
        });
    }
    else if (typeof config.members == 'object') {
        for (var key in  config.members) {
            if (!config.members.hasOwnProperty(key)) {
                return;
            }

            var property = key;
            var options = config.members[key]; // preparation for air conditioner
            var getter = null;
            var setter = null;
            if (typeof options == 'string' && options.toLowerCase() == 'auto') {
                getter = util.memberGetterSetter('get' + util.capitaliseFirstLetter(property), klass.prototype);
                setter = util.memberGetterSetter('set' + util.capitaliseFirstLetter(property), klass.prototype);
            }
            else if (typeof options == 'object') {
                getter = util.memberGetterSetter(options.get, klass.prototype);
                setter = util.memberGetterSetter(options.set, klass.prototype);
            }
            else {
                throw new Error("unsupported property options. can be 'auto' or object with defined get & set");
            }

            Object.defineProperty(klass.prototype, property, { get: getter, set: setter });
        }
    }

    return klass;
}

var plugins = [];

module.exports.define = define;

module.exports.addPlugin = function (func) {
    plugins.push(func)
};
