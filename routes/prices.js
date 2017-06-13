const express = require("express");
const router = express.Router();
const Price = require("../models/price");
const moment = require("moment");

router.get('/', function(req, res) {
	Price.find({}, function(err, allPrices) {
		if(err) {
			console.log(err);
		}
		res.render('prices/index', {prices: allPrices});
	})
});

router.post('/', function(req, res) {
	  Price.create(req.body.price, function(err, newPrice) {
	  	if(err) {
	  		console.log(err);
	  	}
	    res.redirect('/prices');
	  });
});

router.get('/new', function(req, res) {
	res.render('prices/new');
});

module.exports = router;