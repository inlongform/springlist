var constants = require('../config/constants');
var util = require('util');

function Errors(emitter) {

    emitter.on(constants.SCRAPE_ERROR, function(err) {
        console.log("SCRAPE_ERROR", err)
    });

    emitter.on(constants.DB_ADD_ERROR, function(err) {
        console.log("SCRAPE_ERROR", err)
    });

    emitter.on(constants.SERACH_FRIENDS_ERROR, function(err) {
        console.log("SERACH_FRIENDS_ERROR", err)
    });

    emitter.on(constants.DB_ERROR, function(err) {
        console.log("DB_ERROR", err)
    });

    emitter.on(constants.ADD_FOLLOW_ERROR, function(err) {
        console.log("ADD_FOLLOW_ERROR", err)
    });

    process.on('uncaughtException', function(err) {
      console.log('Caught exception: ' + err);
    });



}

Errors.prototype.inspect = function(obj) {
    console.log(util.inspect(obj, { showHidden: true, depth: null }));
}


// export the class
module.exports = Errors;