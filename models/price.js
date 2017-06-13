var mongoose = require("mongoose");

var priceSchema = new mongoose.Schema({
    title: {type: String, unique: true},
	adult: Number,
	child: Number,
	senior: Number
});

module.exports = mongoose.model("Price", priceSchema);