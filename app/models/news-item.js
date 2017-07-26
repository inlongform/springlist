// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var newsSchema = mongoose.Schema({
            created_time        : Date,
            description         : String,
            fb_id           	: String,
            link                : String,
            name                : String,
            message             : String,
            picture             : String,
            hash 				: Array


});

newsSchema.id = mongoose.Types.ObjectId();

// create the model for users and expose it to our app
module.exports = mongoose.model('NewsItem', newsSchema);