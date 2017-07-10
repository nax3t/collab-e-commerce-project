const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const middleware = require("../../middleware");

router.use(middleware.isAdmin);

router.get('/', function(req, res) {
	Order.find({}, function(err, orders) {
		if(err) {
			console.log(err);
			res.redirect("back");
		}
		res.render('admin/orders/index', {orders: orders});
	});
});

module.exports = router;