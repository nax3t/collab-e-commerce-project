const express = require("express");
const router = express.Router();
const Alcatraz = require("../../models/alcatraz");
const ComboProduct = require("../../models/comboproduct");

router.get('/', function(req, res) {
	Alcatraz.find({}).populate('comboProducts').exec(function(err, allAlcatraz) {
		if(err) {
			console.log(err);
		}
		res.render('admin/alcatraz/index', {allAlcatraz: allAlcatraz});
	})
});

router.post('/', function(req, res) {
	  Alcatraz.create(req.body.alcatraz, function(err, newAlcatraz) {
	  	if(err) {
	  		console.log(err);
	  	}
	    res.redirect('/admin/alcatraz');
	  });
});

router.get('/new', function(req, res) {
	ComboProduct.find({}, function(err, allComboProducts) {
		if(err) {
			console.log(err);
		}
		res.render('admin/alcatraz/new', {comboProducts: allComboProducts});
	});
});

router.get('/:id/edit', function(req, res) {
	ComboProduct.find({}, function(err, allComboProducts) {
		if(err) {
			console.log(err);
		}
		Alcatraz.findById(req.params.id, function(err, foundAlcatraz) {
			if(err) {
				console.log(err);
			}
			res.render('admin/alcatraz/edit', {alcatraz: foundAlcatraz, comboProducts: allComboProducts});
		});
	});
});

router.put('/:id', function(req, res) {
	  Alcatraz.findByIdAndUpdate(req.params.id, req.body.alcatraz, {new: true}, function(err, updatedAlcatraz) {
	  	if(err) {
	  		console.log(err);
	  	}
	    res.redirect('/admin/alcatraz');
	  });
});

module.exports = router;