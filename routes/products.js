const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Alcatraz = require("../models/alcatraz");
const moment = require("moment");
const stripe = require("stripe")(process.env.SECRET_KEY);
// var middleware = require("../middleware");

router.post("/:id/charge", (req, res) => {
    Product.findById(req.params.id, (err, foundProduct) => {
        if (err) {
            console.log(err);
        } else {
            foundProduct.stock--;
            foundProduct.save();
        }
    });
    let prices = {
        "1-day-big-bus": {
            adults: 140,
            children: 120
        },
        "2-day-big-bus": {
            adults: 180,
            children: 160
        }
    };

    // calculate purchase total
    let adults = prices[req.body["bundled-product"]]["adults"] * Number(req.body.adults);
    let children = prices[req.body["bundled-product"]]["children"] * Number(req.body.children);
    let sum = (adults + children) * 100;

    let amount = sum;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
        .then(customer =>
            stripe.charges.create({
                amount,
                description: "Sample Charge",
                currency: "usd",
                customer: customer.id
            }))
        .then((data) => {
            let amount = (data.amount / 100).toFixed(2);
            res.render("charge", {amount: amount});
        });
});

//INDEX - show all products
router.get("/", function (req, res) {
    // Get all products from DB
    Product.find({}, function (err, allProducts) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/index", {products: allProducts});
        }
    });
});

//CREATE - add new product to DB
router.post("/", function (req, res) {
    Product.create(req.body.product, function (err, newlyCreated) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            // send success response
            console.log(newlyCreated);
            res.status(200).json('Success!');
        }
    });
});

//NEW - show form to create new product
router.get("/new", function (req, res) {
    res.render("products/new");
});

// SHOW - shows more info about one product
router.get("/:id", function (req, res) {
    //find the product with provided ID
    Product.findById(req.params.id, function (err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            if(foundProduct.name.toLowerCase().indexOf('alcatraz') !== -1) {
                Alcatraz.find({}, function(err, allAlcatraz) {
                    if (err) {
                        console.log(err);
                    }
                    res.render("products/alcatraz-show", {product: foundProduct, allAlcatraz: allAlcatraz});
                });
            } else {
                res.render("products/show", {product: foundProduct});
            }
        }
    });
});

router.get("/:id/edit", function (req, res) {
    //find the product with provided ID
    Product.findById(req.params.id, function (err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that product
            res.render("products/edit", {product: foundProduct});
        }
    });
});

router.put("/:id", function (req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.product, {new: true}, function (err, updatedProduct) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            // send success response
            console.log(updatedProduct);
            res.status(200).json('Success!');
        }
    });
});

router.delete("/:id", function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/products');
        }
    });
});

//middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "You must be signed in to do that!");
//     res.redirect("/login");
// }

module.exports = router;

