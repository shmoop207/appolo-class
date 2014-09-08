var Class = require('../../lib/class');

module.exports = Class.define({
    $config: {
        name: "position",
    },
    constructor: function (symbol, amount, side) {

        this.symbol = symbol;
        this.amount = amount;
        this.side = side;

    }
});