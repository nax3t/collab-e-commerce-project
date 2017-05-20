var mongoose = require("mongoose");

var alcatrazSchema = new mongoose.Schema({
    datetime: { type: Date, required: true },
    stock_qty: { type: Number, required: true }
});

module.exports = mongoose.model("Alcatraz", alcatrazSchema);