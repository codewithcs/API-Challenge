// ==================
// MERCHANT ROUTES
// ==================

var express = require("express") ;
var router = express.Router(); 
var Merchant = require("../models/merchant");
var middleware = require("../middleware");	

router.get("/" , function(req, res) {  
	Merchant.find({} , function (err, allMerchants) {
		if ( err ) {
			console.log(err); 
		} else {       		
			res.render( "merchants/index", { merchants: allMerchants} ) ;	
		}
	}); 
} ) ;

router.get("/nearest", function(req, res){
	var latitude1 = parseFloat(req.query.latitude);
	var longitude1 = parseFloat(req.query.longitude);

	Merchant.find({} , function (err, allMerchants) {
		if ( err ) {
			console.log(err);  
		} else {       		
			if(allMerchants.length > 0){			
				for(let i=0; i< allMerchants.length; i++){
					var latitude2 = parseFloat(allMerchants[i].latitude);
					var longitude2 = parseFloat(allMerchants[i].longitude);
					var distance = getDistance(latitude1, longitude1, latitude2, longitude2);
					allMerchants[i]["distance"] = distance;
				}

				allMerchants.sort(function(a,b){
				  return a.distance > b.distance ? 1 : -1;
				});
				
				res.render( "merchants/nearest", { merchants: allMerchants} ) ;	
			}
			else {
			res.render( "merchants/index", { merchants: allMerchants} ) ;
			}
		}
	}); 
	
});

function getDistance(latitude1, longitude1, latitude2, longitude2){
	var R = 6371; // km
	var x1 = latitude2-latitude1; 
	var dLatitude = x1*Math.PI/180; 
	var x2 = longitude2-longitude1;
	var dLongitude = x2*Math.PI/180;
	var a = Math.sin(dLatitude/2) * Math.sin(dLatitude/2) + 
					Math.cos(latitude1 * Math.PI/180) * Math.cos(latitude2* Math.PI/180) * 
					Math.sin(dLongitude/2) * Math.sin(dLongitude/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	return R * c; 
}

// CREATE ROUTE 
router.post( "/", function(req, res) { 
	var merchantLatitude = req.body.latitude ; 
	var merchantLongitude = req.body.longitude ;
	var merchantIdValue = req.body.merchantId ; 
	var merchantNameValue = req.body.merchantName;
	
	var merchantAuthor = {
		id: req.user._id, 
		username: req.user.username
	}
	
	var newMerchant = { latitude: merchantLatitude, longitude: merchantLongitude, merchantId: merchantIdValue, merchantName: merchantNameValue, author: merchantAuthor};
	
	Merchant.create( newMerchant, function(err, merchant){
		if (err) {
			console.log(err) ;
		} else {
			res.redirect("/merchants") ;
		}   
	}) ; 
});   

// NEW ROUTE: Displays form to submit data for a new campground. 
router.get( "/new", middleware.isLoggedIn, function(req, res) {
	res.render("merchants/new") ; 
}) ; 

router.get("/:id" , function(req, res) { 
	Merchant.findById(req.params.id).exec ( function ( err, foundMerchant ) { 
		if ( err || !foundMerchant){
			req.flash("error", "Merchant Not Found");
			res.redirect("back");
		} else {
			res.render("merchants/show", { merchant: foundMerchant } ) ; 
		}
	});
});

// Edit Merchant 
router.get("/:id/edit", middleware.checkMerchantOwnership, function(req, res){
	Merchant.findById(req.params.id, function(err, foundMerchant){
		res.render("merchants/edit", { merchant: foundMerchant });
	})
})

// Update Merchant 
router.put("/:id", middleware.checkMerchantOwnership, function(req, res) {
	Merchant.findByIdAndUpdate(req.params.id, req.body.merchant, function(err, updatedMerchant){	
		if (err) {
			res.redirect("/merchants");
		} else {
			res.redirect("/merchants/" + req.params.id );
		}	
	}); 	
}); 

// Delete Merchant
router.delete("/:id", middleware.checkMerchantOwnership, function(req, res) {
	Merchant.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/merchants");
		} else {
			res.redirect("/merchants") ; 	
		}
		
	}) ; 
});  

module.exports = router; 