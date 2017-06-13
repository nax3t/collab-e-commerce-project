var mongoose = require("mongoose");

var alcatrazSchema = new mongoose.Schema({
    datetime: { type: Date, required: true },
    stockQty: { type: Number, required: true },
    prices: {
    	bayCruise: {
            title: String,
    		adult: Number,
    		child: Number,
    		senior: Number
    	},
    	oneDayBus: {
            title: String,
    		adult: Number,
    		child: Number,
    		senior: Number
    	},
    	twoDayBus: {
            title: String,
    		adult: Number,
    		child: Number,
    		senior: Number
    	}
    }
});

module.exports = mongoose.model("Alcatraz", alcatrazSchema);