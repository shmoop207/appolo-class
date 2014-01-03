var should = require('chai').should(),
    Class = require('../lib/class')


describe('Class', function () {
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

                config: {
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

                config: {
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

                config: {
                    extends: Rectangle
                },

                constructor: function (side) {
                    this.callParent('constructor', side, side);
                }
            });


            var Cube = Class.define({

                config: {
                    extends: Square
                },

                constructor: function (side) {
                    this.callParent('constructor', side);

                    this.side = side;
                },

                area: function () {
                    return 6 * this.callParent('area')
                },

                volume: function () {
                    return this.side * this.callParent('area')
                }
            });

            var cube = new Cube(5);

            cube.area().should.equal(150);
            cube.volume().should.equal(125);
        });
    });

    describe('create class with statics', function () {

        it('should crate class with statics', function () {

            var Rectangle = Class.define({
                config: {
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

    describe('create class with mixin', function () {

        it('should crate class with mixin', function () {

            var Events = Class.define({
                bind: function(event, fn) {
                    return true;
                },
                unbind: function(event, fn) {
                    return true;
                }
            });

            var Rectangle = Class.define({
                config: {
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
            rectangle.bind().should.true;
        });
    });
})