"use strict";
var _ = require('lodash');


function define(api) {

    var config, klass, parent,
        ignoredKeys = { constructor: true, prototype: true, $config: true, callParent: true };

    //get config
    config = api.$config || {};

    //get api
    api = _.isFunction(api) ? api() : api;

    //get parent
    parent = config.extends || function () {
    };

    //create constructor if not given
    if (_.has(api, 'constructor')) {

        klass = (function (supProto) {
            return function () {
                this.callParent = supProto["constructor"];

                return api.constructor.apply(this, arguments);
            }
        })(parent.prototype);
    }
    else if (config.extends) {

        klass = (function (parent) {
            return function () {
                parent.apply(this, arguments);
            }
        })(parent);

    } else {
        klass = function () {
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

            if(!_.isFunction(func)){
                klass.prototype[name] = func;
            } else {
                klass.prototype[name] = (function (name, func, supProto) {
                        return function () {

                            this.callParent = supProto[name];

                            try {
                                return func.apply(this, arguments);
                            } finally {
                                this.callParent = null;
                            }
                        }

                    })(name, func, parent.prototype);
            }


        }


        //(!ignoredKeys[name]) && ();
    });

//        //add call parent method
//        klass.prototype.callParent = function (parent, methodName) {
//            return parent.prototype[methodName].apply(this, Array.prototype.slice.call(arguments, 2));
//        }.bind(klass.prototype, parent)


//        (function (parent,prototype) {
//        return function (methodName) {
//            return parent.prototype[methodName].apply(this, Array.prototype.slice.call(arguments, 1));
//        }.bind(prototype)
//    })(parent,klass.prototype);

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
        return function (api) {

            api.$config = api.$config || {};

            api.$config.extends = klass;

            return define(api)
        }
    })(klass, define);


    return klass;
}

var plugins = {};

module.exports.define = define;

module.exports.plugins = plugins;