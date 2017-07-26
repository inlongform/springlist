module.exports = {


	auth: function(){
		var devCallBack  = "http://localhost:3000/";
		var prodCallBack = "http://myapp.herokuapp.com/"; //your prod url here
		var URL_prefix   = devCallBack;

		if(process.env.NODE_ENV === "production"){
			URL_prefix = prodCallBack;
		}

		var info = {
			"domain": URL_prefix,
			'facebookAuth' : {
				'clientID' 		: '123', // your App ID
				'clientSecret' 	: '123', // your App Secret
				'callbackURL' 	: URL_prefix + 'auth/facebook/callback' //
			},

			'twitterAuth' : {
				'consumerKey' 		: '123', //your twitter consumer key
				'consumerSecret' 	: '123',
				'tokenSecret'		: '123',
				'callbackURL' 		: URL_prefix + 'auth/twitter/callback'
			},

			'googleAuth' : {
				'apiKey'		: '123',
				'clientID' 		: '123',
				'clientSecret' 	: '123',
				'callbackURL' 	: URL_prefix + 'auth/google/callback'
			},
	
			'tumblrAuth' : {
				'consumerKey' 		: '123',
				'consumerSecret' 	: '123',
				'callbackURL' 	: URL_prefix + 'auth/tumblr/callback'
			},

			'mailer': {
				"user": 'test@test.com',
            	"pass": 'password'
			}
		}

		return info;
	}


};
