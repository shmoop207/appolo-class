var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);


describe('interfaces', function () {

    describe('create class with interface', function () {

        it('should crate class with interface', function () {

            var EventsInterface = Class.interface({

                on: function (event, fn) {

                },
                un: function (event, fn) {

                }
            });

            (function() {
                Class.define({
                    $config: {
                        interfaces: [EventsInterface]

                    },

                    constructor: function (width, height) {
                        this.height = height;
                        this.width = width;
                    },

                    area: function () {
                        return this.width * this.height;
                    }
                })
            }).should.throw(/class dose not implement method on/)
        });



        it('should not throw error with valid interface', function () {

            var EventsInterface = Class.interface({

                on: function (event, fn) {

                },
                un: function (event, fn) {

                }
            });

            (function() {
                Class.define({
                    $config: {
                        interfaces: [EventsInterface]

                    },

                    constructor: function (width, height) {
                        this.height = height;
                        this.width = width;
                    },

                    area: function () {
                        return this.width * this.height;
                    },
                    on:function(event, fn){},
                    un:function(event, fn){}
                })
            }).should.not.throw()
        });


        it('should not throw error with valid interface by string', function () {

            var EventsInterface = Class.interface('EventsInterface',{

                on: function (event, fn) {

                },
                un: function (event, fn) {

                }
            });

            (function() {
                Class.define({
                    $config: {
                        interfaces: ['EventsInterface']

                    },

                    constructor: function (width, height) {
                        this.height = height;
                        this.width = width;
                    },

                    area: function () {
                        return this.width * this.height;
                    },
                    on:function(event, fn){},
                    un:function(event, fn){}
                })
            }).should.not.throw()
        });


        it('should not throw error with invalid  args', function () {

            var EventsInterface = Class.interface('EventsInterface',{

                on: function (event, fn) {

                },
                un: function (event, fn) {

                }
            });

            (function() {
                Class.define({
                    $config: {
                        interfaces: ['EventsInterface']

                    },

                    constructor: function (width, height) {
                        this.height = height;
                        this.width = width;
                    },

                    area: function () {
                        return this.width * this.height;
                    },
                    on:function(event, fn){},
                    un:function(event){}
                })
            }).should.throw(/class have invalid method args on method: un.  expected: un\(event,fn\) actual: un\(event\)/)
        });

    });

});