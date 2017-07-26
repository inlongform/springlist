var RSS = require('rss');
var authConfig = require('../config/auth');


function Rss() {}

Rss.getFeed = function(data) {
	console.log("got here")
	var auth = authConfig.auth();
	var feed = new RSS({
		title: "FEED: " + data.user.username,
		description: "public feed",
		feed_url: auth.domain + "rss/" + data.user._id,
		site_url: auth.domain,
		image_url: data.user.imageURL,
		author: data.user.username,
		language: "en"
	});

	var articles = data.data;

	for(var i = 0; i < articles.length; i++){
		feed.item({
			title:  articles[i].name,
			description: articles[i].description,
			url: articles[i].link,
			categories: articles[i].hash,
			date: articles[i].created_time
		});
	}

	var xml = feed.xml();
	
	return xml;

}

module.exports = Rss;