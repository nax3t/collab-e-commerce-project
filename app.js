// dot env
require('dotenv').config();
const keyPublishable = process.env.PUBLISHABLE_KEY;

const express = require("express");
const app = express();
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const productRoutes = require("./routes/products");
const indexRoutes = require("./routes/index");



mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL);
require("./config/passport");
// mongoose.connect("mongodb://localhost/node-ecommerce-test");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// use ejs-locals for all ejs templates: 
app.engine('ejs', engine);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride('_method'));
app.use(cookieParser());

// session and passport setup
app.use(session({secret: "SuperSecretStuff", resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  app.locals.keyPublishable = keyPublishable;
  next();
});

app.use(indexRoutes);
app.use("/products", productRoutes);

app.listen(3000, () => {
	console.log('Server running, listening on port 3000');
});