// Constructor
var https = require('https');
var Constants = require('../config/constants');
var FB = require('fb');



function Facebook(queries, emitter) {


    this.queries = queries;
    this.emitter = emitter;



    console.log("facebook util");

}

// class methods
Facebook.prototype.setReqQueue = function(obj) {

    this.allData = new Array();

    this.startQueue(obj, 0);


}



Facebook.prototype.startQueue = function(obj, index) {
    var that = this;
    var user = obj.user;
    var queueItems = obj.items;
    var req = queueItems[index]
    var total = queueItems.length;


    var reqData = {
        "links": '/me/links?access_token=' + user.facebook.token,
        "permissions": '/me/permissions?access_token=' + user.facebook.token,
        "picture": '/me?fields=picture.width(70).height(70)&access_token=' + user.facebook.token,
        "userInfo": '/me?&access_token=' + user.facebook.token,
        "friends": '/me/friends?access_token=' + user.facebook.token
    };

    var options = {
        host: 'graph.facebook.com',
        path: reqData[req]
    };

    https.get(options, function(res) {
        var data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            var json = JSON.parse(data);
            // if(req == "links"){
            //     console.log(json)
            // }
            that.allData.push(json);

            that.queries.addDBdata(user, json, req);
            index++;
            if (index < total) {
                that.startQueue(obj, index);
            } else {
                // console.log(that.allData)
                // that.emitter.emit(Constants.LOAD_FEED_COMPLETE, that.allData)
                console.log("queue complete")
            }
        });
    });
}







// export the class
module.exports = Facebook;