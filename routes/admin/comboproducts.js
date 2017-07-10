const express = require("express");
const router = express.Router();
const ComboProduct = require("../../models/comboproduct");
const Category = require("../../models/category");
const middleware = require("../../middleware");

router.use(middleware.isAdmin);

router.get('/', function(req, res) {
	ComboProduct.find({}, function(err, allComboProducts) {
		if(err) {
			console.log(err);
		}
		res.render('admin/comboproducts/index', {comboProducts: allComboProducts});
	})
});

router.post('/', function(req, res) {
	// build title
	var title = req.body.comboProduct.category;
	title += ' $' + req.body.comboProduct.child + " - $" + req.body.comboProduct.adult;
	req.body.comboProduct.sale ? title += ' On Sale!' : '';
	req.body.comboProduct.title = title;

  ComboProduct.create(req.body.comboProduct, function(err, newComboProduct) {
  	if(err) {
  		console.log(err);
  	}
    res.redirect('/admin/combo-products');
  });
});

router.get('/new', function(req, res) {
	Category.find({}, function(err, allCategories) {
		res.render('admin/comboproducts/new', {categories: allCategories});
	});
});

module.exports = router;