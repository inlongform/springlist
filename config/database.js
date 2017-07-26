// config/database.js
module.exports = {

	dbURL: function(){
		var devURL = 'mongodb:***';

		var prodURL = 'mongodb:***';
		if(process.env.NODE_ENV === "production"){
			return prodURL
		}else{
			return devURL;
		}
	}

};