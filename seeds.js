var mongoose = require ("mongoose") ; 
var Merchant = require("./models/merchant") ; 
var User = require("./models/user");
// Create seed data. 
// var data = [ { 
// 	latitude: "53.365550,", 
// 	longitude: "-6.191848",
// 	merchantName: "Starbucks", 
// 	merchantId: 1
// }, 
// { 
// 	latitude: "53.344100", 
// 	longitude: "-6.267490",
// 	merchantName: "Starbucks", 
// 	merchantId: 2
// } , 			
// { 
// 	latitude: "53.383220", 
// 	longitude: "-6.211760",
// 	merchantName: "Subway", 
// 	merchantId: 3
// } 
// ] ; 

function seedDB() {
	Merchant.remove( {} , function (err) { 
			if ( err ) {
				console.log(err) ;
			} 	
	}); 
	User.remove({}, function(err){
		if(err){
			console.log(err); 
		}			
	});
}

module.exports = seedDB ;