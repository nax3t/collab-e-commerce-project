var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: String,
    prices: {
    	adult: Number,
    	child: Number,
    	senior: Number
    }
});

module.exports = mongoose.model("Product", productSchema);