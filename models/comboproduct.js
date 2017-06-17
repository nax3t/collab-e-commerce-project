var mongoose = require("mongoose");

var comboProductSchema = new mongoose.Schema({
  title: { type: String },
	category: String,
	sale: { type: Boolean, default: false},
	adult: Number,
	child: Number,
	senior: Number
});

module.exports = mongoose.model("ComboProduct", comboProductSchema);