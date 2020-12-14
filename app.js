const express	= require("express"),
      app 	= express(), 
      request 	= require("request"),
	  bodyParser  = require("body-parser"),
	  flash = require("connect-flash"),
	  methodOverride = require("method-override"), 
      Merchant  = require ( "./models/merchant" ), 
	  seedDB = require("./seeds"), 
      mongoose    = require("mongoose"), 
	  passport = require("passport"),
	  LocalStrategy = require("passport-local"),
	  User = require("./models/user"),
	  merchantRoutes = require("./routes/merchants"),
	  indexRoutes = require("./routes/index") ; 

mongoose.connect('mongodb+srv://yelpcamp:yelpcamp@cluster0-hnqvk.mongodb.net/test?retryWrites=true&w=majority', { useNewParser: true , useCreateIndex: true } )
	.then( () => {
	
	console.log("Connected to DB!");
} ).catch( err => {
	console.log("ERROR: ", err.message); 
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({ 
    secret: "Mastercard API Test",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
// -------------------------------------------------


app.use(indexRoutes);
app.use("/merchants", merchantRoutes);

app.listen(process.env.PORT || 3000, function() {
	console.log("Merchants server started") ; 
}) ;