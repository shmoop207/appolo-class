var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);


describe('toString', function () {

    it('should return valid  constructor toString', function () {

        var Position = Class.define({

            $config: {
                name:'test',
                members: ['symbol']
            },

            constructor: function (symbol) {
                this._symbol = symbol;
            }

        })

        var position = new Position("aapl");

        position.constructor.toString(true).should.be.eq("function (symbol) {\n                this._symbol = symbol;\n            }");

    })



    it('should return valid method toString', function () {

        var Position = Class.define({

            $config: {
                members: ['symbol']
            },

            constructor: function (symbol) {
                this._symbol = symbol;
            },

            setSymbol: function (symbol) {

                this._symbol = symbol;
            }
        })

        var position = new Position("aapl");

        position.setSymbol.toString().should.be.eq("function (symbol) {\n\n                this._symbol = symbol;\n            }");


    })
});


