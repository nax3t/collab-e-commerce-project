const express = require("express");
const router = express.Router();
const Alcatraz = require("../models/alcatraz");
const moment = require("moment");

router.get('/', function(req, res) {
	Alcatraz.find({}, function(err, allAlcatraz) {
		if(err) {
			console.log(err);
		}
		res.render('alcatraz/index', {allAlcatraz: allAlcatraz});
	})
});

router.post('/', function(req, res) {
	  Alcatraz.create(req.body.alcatraz, function(err, newAlcatraz) {
	  	if(err) {
	  		console.log(err);
	  	}
	    res.redirect('/alcatraz');
	  });
});

router.get('/new', function(req, res) {
	res.render('alcatraz/new');
});

module.exports = router;