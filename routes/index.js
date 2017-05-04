var express = require("express");
var router = express.Router();

var Cart = require("../models/cart");
var Product = require("../models/product");

// get home page
router.get("/", function (req, res) {
    res.redirect("/products");
});

// add to cart
router.get("/add-to-cart/:id", function (req, res) {
    var productId = req.params.id;

    // if a cart exists pass it, if not pass an empty object
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    // find the product in the db
    Product.findById(productId, function (err, product) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }
        // adding the product to cart
        cart.add(product, product.id);
        // store cart object in session
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect("/");
        // FLASH MSGS...
    });
});

module.exports = router;