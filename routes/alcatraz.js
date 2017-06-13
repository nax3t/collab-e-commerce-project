const express = require("express");
const router = express.Router();
const Alcatraz = require("../models/alcatraz");
const Price = require("../models/price");
// const moment = require("moment");

router.get('/', function(req, res) {
	Alcatraz.find({}, function(err, allAlcatraz) {
		if(err) {
			console.log(err);
		}
		res.render('alcatraz/index', {allAlcatraz: allAlcatraz});
	})
});

router.post('/', function(req, res) {
		// turn this into middleware
		var bayCruisePrices = req.body.alcatraz.prices.bayCruise.split('*');
		req.body.alcatraz.prices.bayCruise = {
			adult: bayCruisePrices[0],
			senior: bayCruisePrices[1],
			child: bayCruisePrices[2],
			title: bayCruisePrices[3]
		}

		var oneDayBusPrices = req.body.alcatraz.prices.oneDayBus.split('*');
		req.body.alcatraz.prices.oneDayBus = {
			adult: oneDayBusPrices[0],
			senior: oneDayBusPrices[1],
			child: oneDayBusPrices[2],
			title: oneDayBusPrices[3]
		}

		var twoDayBusPrices = req.body.alcatraz.prices.twoDayBus.split('*');
		req.body.alcatraz.prices.twoDayBus = {
			adult: twoDayBusPrices[0],
			senior: twoDayBusPrices[1],
			child: twoDayBusPrices[2],
			title: twoDayBusPrices[3]
		}
		// end middleware

	  Alcatraz.create(req.body.alcatraz, function(err, newAlcatraz) {
	  	if(err) {
	  		console.log(err);
	  	}
	    res.redirect('/alcatraz');
	  });
});

router.get('/new', function(req, res) {
	Price.find({}, function(err, allPrices) {
		if(err) {
			console.log(err);
		}
		res.render('alcatraz/new', {prices: allPrices});
	});
});

router.get('/:id/edit', function(req, res) {
	Price.find({}, function(err, allPrices) {
		if(err) {
			console.log(err);
		}
		Alcatraz.findById(req.params.id, function(err, foundAlcatraz) {
			if(err) {
				console.log(err);
			}
			res.render('alcatraz/edit', {alcatraz: foundAlcatraz, prices: allPrices});
		});
	});
});

module.exports = router;