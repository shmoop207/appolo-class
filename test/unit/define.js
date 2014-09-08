var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);
describe('define function',function(){

    describe('create from parent define', function () {
        it('should create class from parent define', function () {
            var Events = Class.define({

                constructor: function (name) {

                    this.name = name || "events";

                },

                bind: function (event, fn) {
                    return true;
                },
                unbind: function (event, fn) {
                    return true;
                }
            });

            var Rectangle = Events.define({

                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;

                    this.callParent();
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            var rectangle = new Rectangle(5, 5);
            rectangle.bind().should.true;
            rectangle.unbind().should.true;
            rectangle.name.should.equal("events");
        });
    });


})