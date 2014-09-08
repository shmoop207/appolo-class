var should = require('chai').should(),
    Class = require('../../lib/class'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai");

chai.use(sinonChai);

describe('inheritance',function(){

    describe('create first class', function () {

        it('should crate class with empty constructor', function () {

            var Rectangle = Class.define({
                area: function () {
                    return 25;
                }
            });

            var rectangle = new Rectangle();
            rectangle.area().should.equal(25);

        });

        it('should crate class and not have config in prototype', function () {

            var Rectangle = Class.define({

                $config: {
                    test: 'aa'
                },

                area: function () {
                    return 25;
                }
            });

            var rectangle = new Rectangle();

            rectangle.should.not.have.property('config');

        });

        it('should crate class with constructor params and call instance function', function () {

            var Rectangle = Class.define({
                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            var rectangle = new Rectangle(5, 5);

            rectangle.area().should.equal(25);
        });
    });

    describe('create second class', function () {

        it('should crate class with inherits from first class', function () {

            var Rectangle = Class.define({

                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            var Square = Class.define({

                $config: {
                    extends: Rectangle
                },

                constructor: function (side) {
                    Rectangle.call(this, side, side);
                }
            });

            var square = new Square(6);

            square.area().should.equal(36);

        });
    });

    describe('create third class', function () {

        it('should crate class inherits from second class and call parent', function () {

            var Rectangle = Class.define({

                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            var Square = Class.define({

                $config: {
                    extends: Rectangle
                },

                constructor: function (side) {
                    this.callParent(side, side);
                }
            });

            var Cube = Class.define({

                $config: {
                    extends: Square
                },

                constructor: function (side) {
                    this.callParent(side);

                    this.side = side;
                },

                area: function () {
                    return 6 * this.callParent()
                },

                volume: function () {
                    return this.side * 5 * 5;
                }
            });

            var cube = new Cube(5);

            cube.area().should.equal(150);
            cube.volume().should.equal(125);
        });
    });

    describe('create third class call parent methods test', function () {

        it('should parents methods', function () {

            var Rectangle = Class.define({

                constructor: function (width, height) {
                    this.height = height;
                    this.width = width;
                },

                area: function () {
                    return this.width * this.height;
                }
            });

            var Square = Class.define({

                $config: {
                    extends: Rectangle
                },

                constructor: function (side) {

                    this.multi = 2;

                    this.callParent(side, side);

                },

                area: function () {

                    return  this.multi * this.callParent()
                }
            });

            var Cube = Class.define({

                $config: {
                    extends: Square
                },

                constructor: function (side) {
                    this.callParent(side);

                    this.side = side;
                },

                area: function () {
                    return 6 * this.callParent()
                },

                volume: function () {
                    return this.side * 5 * 5 * this.multi;
                }
            });

            var cube = new Cube(5);

            cube.area().should.equal(300);
            cube.volume().should.equal(250);
        });
    });


    describe('create  class with empty  constructor and call parent constructor', function () {
        it('should call parent constructor ', function () {

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

            var Rectangle1 = Class.define({
                $config: {
                    extends: Events
                },

                area: function () {

                    return 1;
                }
            });

            var rectangle1 = new Rectangle1();

            rectangle1.name.should.equal("events");

        });
    });

    describe('create 2 class with overrides', function () {

        it('should crate 2 class without overrides', function () {

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

            var Rectangle1 = Class.define({
                $config: {
                    extends: Events
                },

                area: function () {

                    return 1;
                }
            });

            var Rectangle2 = Class.define({
                $config: {
                    extends: Events
                },

                constructor: function () {

                    this.callParent('rectangle2');

                },

                area: function () {
                    return 2;
                }

            });

            var rectangle1 = new Rectangle1();
            var rectangle2 = new Rectangle2();

            rectangle1.name.should.equal("events");

            rectangle2.name.should.equal("rectangle2");

            rectangle1.area().should.equal(1);
            rectangle2.area().should.equal(2);

        });
    });


    describe('create 2 classes from inherit', function () {
        it('should 2 different classes', function () {

            var Position = Class.define({

                constructor: function (symbol, amount, side) {

                    this.symbol = symbol;
                    this.amount = amount;
                    this.side = side;

                }
            });

            var Long = Position.define({

                constructor: function (symbol, amount) {
                    this.callParent(symbol, amount, 2);
                }
            });

            var Short = Position.define({

                constructor: function (symbol, amount) {

                    this.callParent(symbol, amount, 2);
                }
            });

            var long = new Long("AAPL", 5);
            var short = new Short("GOOG", 2);

            long.symbol.should.equal("AAPL");
            short.symbol.should.equal("GOOG");

            long.amount.should.equal(5);
            short.amount.should.equal(2);
        });
    });


    describe('type references', function () {

        it('should be same type references', function () {

            var Position = Class.define({
                $config: {
                    name: "Position"
                },

                constructor: function (symbol, amount, side) {
                    this.symbol = symbol;
                    this.amount = amount;
                    this.side = side;
                }
            });

            var Long = Class.define({
                $config: {
                    name: "Long",
                    extends: Position
                },

                constructor: function (symbol, amount) {
                    this.callParent(symbol, amount, 2);
                }
            });

            var Short = Class.define({
                $config: {
                    name: "Short",
                    extends: Position
                },
                constructor: function (symbol, amount) {
                    this.callParent(symbol, amount, 2);
                }
            });

            var dict = {};

            dict[Position] = 'a';
            dict[Long] = 'b';
            dict[Short] = 'c';

            dict[new Position().constructor].should.be.eq('a');
            dict[new Long().constructor].should.be.eq('b');
            dict[new Short().constructor].should.be.eq('c');

        });

    });
})