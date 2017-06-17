const express = require("express");
const router = express.Router();
const Alcatraz = require("../../models/alcatraz");

router.get('/', (req, res) => {
	Alcatraz.find({}, (err, allAlcatraz) => {
		if(err) {
			console.log(err);
		}
		res.render('customer/alcatraz/index', {allAlcatraz: allAlcatraz});
	})
});

router.get('/:id', (req, res) => {
	Alcatraz.findById(req.params.id).populate('comboProducts').exec((err, alcatraz) => {
		if(err) {
			console.log(err);
		}
		res.render('customer/alcatraz/show', {alcatraz: alcatraz});
	});
});

module.exports = router;