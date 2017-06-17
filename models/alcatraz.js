var mongoose = require("mongoose");

var alcatrazSchema = new mongoose.Schema({
    datetime: { type: Date, required: true },
    stockQty: { type: Number, required: true },
    comboProducts: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "ComboProduct"
        }
    ]
});

module.exports = mongoose.model("Alcatraz", alcatrazSchema);