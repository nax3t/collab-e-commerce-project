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

// Configure mailgun
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_KEY,
    domain: 'www.iantskon.com'
});

router.get("/clearcart", function(req, res) {
    delete req.session.cart;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    res.redirect("back");
})

// get home page
router.get("/", function(req, res) {
    res.render("landing");
});

// add to cart
router.post("/add-to-cart/:id/alcatraz", function(req, res) {
    // if a cart exists pass it, if not pass an empty object
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var cartItems = {};
    ComboProduct.find({title: req.body.cartItems.combinationProduct}, function(err, comboProducts) {
        if(err) {
            console.log(err);
            return res.redirect("/");
        }
        Alcatraz.findById(req.params.id, function(err, alcatraz) {
            if(err) {
                console.log(err);
                return res.redirect("/");
            }
            cartItems.persons = {
                adult: Number(req.body.cartItems.adult),
                senior: Number(req.body.cartItems.senior),
                child: Number(req.body.cartItems.child)
            }
            cartItems.alcatraz = alcatraz;
            cartItems.comboProduct = comboProducts[0];
            cartItems.price = (cartItems.persons.adult * cartItems.comboProduct.adult) + (cartItems.persons.senior * cartItems.comboProduct.senior) + (cartItems.persons.child * cartItems.comboProduct.child);
            cartItems.qty = Number(cartItems.persons.adult) + Number(cartItems.persons.senior) + Number(cartItems.persons.child);
            cartItems.title = req.body.cartItems.title;
            // adding the cartItems to cart
            cart.add(cartItems);
            // store cart object in session
            req.session.cart = cart;
            console.log(req.session.cart);
            res.redirect("/shopping-cart");
            // FLASH MSGS...
        });
    });
});

// remove all units from cart
router.get("/remove/:index", function(req, res) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(req.params.index);
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
    res.render("products/shopping-cart", {products: cart.items, totalPrice: cart.totalPrice});
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
            req.session.cart = null;

            // Send order receipt
            var data = {
              from: 'learntocodeinfo@gmail.com',
              to: req.user.email,
              subject: 'SF Tours - Order Receipt',
              html: `<p>This is a <strong>test email</strong> for order #${order.id}.</p>
              <p>Your order cost $${cart.totalPrice} dollars.</p>
              `
            };
             
            mailgun.messages().send(data, function (error, body) {
              console.log(body);
              if(!error){
                  req.flash("success", "You successfully paid $" + cart.totalPrice + "! Check your email inbox for instructions and receipt.");
                  res.redirect("/user/profile");
              } else {
                  req.flash("error", "Error! Unable to send email, please contact learntocodeinfo@gmail.com");
              }
            });    
        });
    });
});

module.exports = router;