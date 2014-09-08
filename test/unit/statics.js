var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);

describe('statics', function () {

    describe('create class with statics', function () {

        it('should crate class with statics', function () {

            var Rectangle = Class.define({
                $config: {
                    statics: {
                        MIN_SIDE: 1,
                        MAX_SIDE: 150
                    }
                },

                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            Rectangle.MIN_SIDE.should.equal(1);

            var rectangle = new Rectangle(5, 5);
            rectangle.MIN_SIDE.should.equal(1);
        });
    });


});