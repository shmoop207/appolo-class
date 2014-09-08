var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);

describe('members', function () {

    it('should create properties via array notation', function () {

        var Position = Class.define({

            $config: {
                members: ['symbol']
            },

            constructor: function (symbol, amount, side) {
                this._symbol = symbol;
                this.amount = amount;
                this.side = side;

                this.numberOfSetCalles = 0;
                this.numberOfGetCalles = 0;
            },

            getSymbol: function () {
                this.numberOfGetCalles++;
                return this._symbol;
            },
            setSymbol: function (value) {
                this._symbol = value;
                this.numberOfSetCalles++
            }
        });

        var position = new Position("aapl");

        position.symbol.should.be.eql("aapl");

        position.symbol = "GOOG";

        position.symbol.should.be.eql("GOOG");

        position.numberOfGetCalles.should.be.eql(2);
        position.numberOfSetCalles.should.be.eql(1);

    });

    it('should create properties via object notation (auto)', function () {

        var Position = Class.define({

            $config: {
                members: {
                    symbol: 'auto'
                }
            },

            constructor: function (symbol, amount, side) {
                this._symbol = symbol;
                this.amount = amount;
                this.side = side;

                this.numberOfSetCalles = 0;
                this.numberOfGetCalles = 0;
            },

            getSymbol: function () {
                this.numberOfGetCalles++;
                return this._symbol;
            },

            setSymbol: function (value) {
                this._symbol = value;
                this.numberOfSetCalles++
            }
        });

        var position = new Position("aapl");

        position.symbol.should.be.eql("aapl");

        position.symbol = "GOOG";

        position.symbol.should.be.eql("GOOG");

        position.numberOfGetCalles.should.be.eql(2)
        position.numberOfSetCalles.should.be.eql(1)

    });

    it('should create properties via object notation (get & set)', function () {

        var Position = Class.define({

            $config: {
                members: {
                    price: { get: 'getRandomOrFixedPrice', set: 'setFixedPrice' }
                }
            },

            constructor: function (symbol, amount, side) {
                this.symbol = symbol;
                this.amount = amount;
                this.side = side;

                this._price = null;

                this.numberOfSetCalles = 0;
                this.numberOfGetCalles = 0;
            },

            getRandomOrFixedPrice: function () {
                this.numberOfGetCalles++;
                return this._price || Math.floor((Math.random() * 10) + 1);
            },

            setFixedPrice: function (value) {
                this._price = value;
                this.numberOfSetCalles++
            }
        });

        var position = new Position("aapl");

        position.price.should.be.within(1, 10);

        position.price = 25;

        position.price.should.be.eql(25);

        position.numberOfGetCalles.should.be.eql(2);
        position.numberOfSetCalles.should.be.eql(1);
    });

    it('should trow error when property not implemented via object notation', function () {

        var Position = Class.define({

            $config: {
                members: {
                    symbol: 'auto',
                    price: { get: 'getMyPrice' }
                }
            },

            constructor: function (symbol, amount, side) {
                this._symbol = symbol;
                this.amount = amount;
                this.side = side;
            }
        });

        var position = new Position("aapl");

        (function () {
            var symbol = position.symbol;
        }).should.throw("not implemented getSymbol");

        (function () {
            position.symbol = "GOOG"
        }).should.throw("not implemented setSymbol");

        (function () {
            var price = position.price;
        }).should.throw("not implemented getMyPrice");

        (function () {
            position.price = 25
        }).should.throw("not implemented undefined");

    });

    it('should throw error when property not implemented via array notation', function () {

        var Position = Class.define({

            $config: {
                members: ['symbol']
            },

            constructor: function (symbol, amount, side) {
                this._symbol = symbol;
                this.amount = amount;
                this.side = side;
            }
        });

        var position = new Position("aapl");

        (function () {
            var symbol = position.symbol;
        }).should.throw("not implemented getSymbol");

        (function () {
            position.symbol = "GOOG"
        }).should.throw("not implemented setSymbol");

    });

});





