var Position = require('./position');
module.exports =  Position.define({
    $config: {
        name: "short",
    },
    constructor: function (symbol, amount) {

        this.callParent(symbol, amount, 2);
    }
});