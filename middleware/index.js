var Merchant = require("../models/merchant"); 

var middlewareObj = {} ; 

middlewareObj.checkMerchantOwnership = function (req, res, next) {
	if (req.isAuthenticated()) {
		Merchant.findById(req.params.id, function(err, foundMerchant) {
			if (err || !foundMerchant ) { 
				req.flash("error", "Merchant not found") ; 
				res.redirect("back");
			} else {		
				if ( foundMerchant.author.id.equals(req.user._id) ){	
					next();
				} 
				else {
					req.flash("You don't have permission to do that!");
					res.redirect("back"); 
				}		
			}
	} ) ;
		
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");  
	}
}

middlewareObj.isLoggedIn = function (req, res, next) { 
	if ( req.isAuthenticated() ) {
		return next() ; 
	}
	req.flash("error", "You need to be logged in to do that!"); 
	res.redirect("/login"); 	
}

module.exports = middlewareObj ; 