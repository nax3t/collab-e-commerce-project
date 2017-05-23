var mongoose = require("mongoose");
var sanitizerPlugin = require('mongoose-sanitizer');

var productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: String,
    description: String,
    prices: {
    	adult: Number,
    	child: Number,
    	senior: Number
    }
});

productSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model("Product", productSchema);