"use strict";
var _ = require('lodash');

var plugins = {

};

function define(api) {

    var config, klass, parent,
        ignoredKeys = { constructor: true, prototype: true, config: true, callParent: true };

    //get config
    config = api.config || {};

    //get api
    api = _.isFunction(api) ? api() : api;

    //get parent
    parent = config.extends || function () {};

    //create class;
    klass = _.has(api, 'constructor') ? api.constructor : function () {
    };

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

        (!ignoredKeys[name]) && (klass.prototype[name] = func);
    });

    //add call parent method
    klass.prototype.callParent = (function (parent) {
        return function (methodName) {
            return parent.prototype[methodName].apply(parent.prototype, Array.prototype.slice.call(arguments, 1));
        }
    })(parent);

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

    _.forEach(plugins, function (func) {
        func(config,klass,parent);
    });

    return klass;
}

module.exports.define = define;

module.exports.plugins = plugins;