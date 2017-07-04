var express = require("express");
var router = express.Router();
var keyPublishable = process.env.PUBLISHABLE_KEY;
var stripe = require("stripe")(process.env.SECRET_KEY);

var Cart = require("../models/cart");
var Product = require("../models/product");
var Alcatraz = require("../models/alcatraz");
var ComboProduct = require("../models/comboproduct");
var Order = require("../models/order");
var middleware = require("../middleware");

// get home page
router.get("/", function (req, res) {
    res.render("landing");
});

// add to cart
router.post("/add-to-cart/:id/alcatraz", function (req, res) {
    // if a cart exists pass it, if not pass an empty object
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var order = {};
    ComboProduct.find(req.body.order.combinationProduct, function(err, comboProducts) {
        if(err) {
            console.log(err);
            return res.redirect("/");
        }
        Alcatraz.findById(req.params.id, function(err, alcatraz) {
            if(err) {
                console.log(err);
                return res.redirect("/");
            }
            order.persons = {
                adult: Number(req.body.order.adult),
                senior: Number(req.body.order.senior),
                child: Number(req.body.order.child)
            }
            order.alcatraz = alcatraz;
            order.comboProduct = comboProducts[0];
            order.price = (order.persons.adult * order.comboProduct.adult) + (order.persons.senior * order.comboProduct.senior) + (order.persons.child * order.comboProduct.child);
            order.qty = Number(order.persons.adult) + Number(order.persons.senior) + Number(order.persons.child);
            order.title = req.body.order.title;
            // adding the order to cart
            cart.add(order, order.alcatraz._id);
            // store cart object in session
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect("back");
            // FLASH MSGS...
        });
    });
});

// remove all units from cart
router.get("/remove/:id", function(req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(req.params.id);
    req.session.cart = cart;
    res.redirect("/shopping-cart");
});

router.put("/update/:id", function(req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.update(req.params.id, req.body.persons);
    req.session.cart = cart;
    res.redirect("/shopping-cart");
});

// get the shopping cart view
router.get("/shopping-cart", function(req, res) {
    // if the cart in the session is empty, pass products to view as null
    if (!req.session.cart) {
        return res.render("products/shopping-cart", {products: null, totalPrice: null});
    }
    // else pass the existing cart
    var cart = new Cart(req.session.cart);
    res.render("products/shopping-cart", {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

// get the cart checkout route
router.get("/checkout", middleware.isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        req.flash("error", "Your cart is empty!");
        return res.redirect("/shopping-cart");
    }
    var cart = new Cart(req.session.cart);
    res.render("products/checkout", {keyPublishable: keyPublishable, total: cart.totalPrice});
});

// post route checkout - CHARGE
router.post("/checkout", middleware.isLoggedIn, function (req, res) {
    if (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    var cart = new Cart(req.session.cart);
    stripe.charges.create({
        amount: cart.totalPrice * 100,           // set amount to cart's total price
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Tour Charge"
    }, function (err, charge) {
        // if something went wrong with the purchase
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/checkout");
        }
        // if the purchase is successful

        // creating new order and saving it to the database
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            email: req.user.email,
            paymentId: charge.id
        });
        order.save(function (err, result) {
            if (err) {
                console.log(err);
                req.flash("error", "Something went wrong with saving your order.");
                return res.redirect("/products");
            }
            req.flash("success", "You successfully paid $" + cart.totalPrice + "!");
            req.session.cart = null;
            res.redirect("/products");
        });
    });
});

module.exports = router;