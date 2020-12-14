var mongoose = require("mongoose") ; 

// SCHEMA SETUP. 
var merchantSchema = mongoose.Schema( {
	latitude: String, 
	longitude: String, 
	merchantId: Number,
	merchantName: String, 
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId, 
			ref: "User"
		}, 
		username: String
	}
}); 

// Compile into a model. 

var Merchant = mongoose.model("merchant" , merchantSchema ) ;  
 
module.exports = Merchant ; 