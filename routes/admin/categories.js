const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const middleware = require("../../middleware");

router.use(middleware.isAdmin);

router.get('/', function(req, res) {
	res.render('admin/categories/index');
});

router.get('/new', function(req, res) {
	res.render('admin/categories/new');
});

router.post('/', function(req, res) {
	Category.create(req.body.category, function(err, newCategory) {
		res.redirect('/categories')
	});
});

module.exports = router;