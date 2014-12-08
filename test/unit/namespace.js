var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);


describe('namespace', function () {
    it('should create namespace and constractor name', function () {

        var Position = Class.define('Test.Position.Base', {

            constructor: function (symbol, amount, side) {

                this.symbol = symbol;
                this.amount = amount;
                this.side = side;

            }
        });

        var Long = Position.define('Test.Position.Long', {

            constructor: function (symbol, amount) {
                this.callParent(symbol, amount, 2);
            }
        });

        var Short = Position.define("Test.Position.Short", {

            constructor: function (symbol, amount) {

                this.callParent(symbol, amount, 2);
            }
        });

        should.exist(Test.Position.Short);
        should.exist(Test.Position.Long);

        var short = new Test.Position.Short();
        var long = new Test.Position.Long();

        short.constructor.name.should.equal("Test_Position_Short");
        long.constructor.name.should.equal("Test_Position_Long");

        GLOBAL.Test.Position.Short = null;
        GLOBAL.Test.Position.Long = null;
    });

    it('should have contractor name', function () {

        var Position = Class.define({

            constructor: function (symbol, amount, side) {

                this.symbol = symbol;
                this.amount = amount;
                this.side = side;

            }
        });

        var Long = Position.define({
            $config: {
                name: "long"
            },

            constructor: function (symbol, amount) {
                this.callParent(symbol, amount, 2);
            }
        });

        var Short = Position.define({
            $config: {
                name: "short"
            },
            constructor: function (symbol, amount) {

                this.callParent(symbol, amount, 2);
            }
        });

        var short = new Short();
        var long = new Long();

        short.constructor.name.should.equal("short");
        long.constructor.name.should.equal("long");
    });

    it('should have create namespace from config and contractor name', function () {

        var Position = Class.define({

            constructor: function (symbol, amount, side) {

                this.symbol = symbol;
                this.amount = amount;
                this.side = side;

            }
        });

        var Long = Position.define({
            $config: {
                name: "long",
                namespace: 'Test.Position.Long'
            },

            constructor: function (symbol, amount) {
                this.callParent(symbol, amount, 2);
            }
        });

        var Short = Position.define({
            $config: {
                name: "short",
                namespace: 'Test.Position.Short'
            },
            constructor: function (symbol, amount) {

                this.callParent(symbol, amount, 2);
            }
        });

        var short = new Test.Position.Short();
        var long = new Long();

        short.constructor.name.should.equal("short");
        long.constructor.name.should.equal("long");

        GLOBAL.Test.Position.Short = null;
        GLOBAL.Test.Position.Long = null;
    });


    it('should have create namespace from auto', function () {

        Class.autoGenerateNamespace = true;

       require('./../mock/position')
       require('./../mock/long_position')
       require('./../mock/short-position')

        var short = new Test.Mock.ShortPosition();
        var long = new Test.Mock.LongPosition();
        var position = new Test.Mock.Position();

        short.constructor.name.should.equal("short");
        long.constructor.name.should.equal("long");
        position.constructor.name.should.equal("position");

        GLOBAL.Test.Mock.ShortPosition = null;
        GLOBAL.Test.Mock.LongPosition = null;
        GLOBAL.Test.Mock.Position = null;

        Class.autoGenerateNamespace = false;
    });


});


