var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);


describe('mixin', function () {

    describe('create class with mixin', function () {

        it('should crate class with mixin', function () {

            var Events = Class.define({
                bind: function (event, fn) {
                    return true;
                },
                unbind: function (event, fn) {
                    return true;
                }
            });

            var Rectangle = Class.define({
                $config: {
                    mixins: [Events]
                },

                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            var rectangle = new Rectangle(5, 5);
            rectangle.bind().should.true;
            rectangle.unbind().should.true;
        });
    });

});