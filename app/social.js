var FB = require('fb');
var Constants = require('../config/constants');
var configAuth = require('../config/auth');
// var google = require('googleapis');
// var plus = google.plus('v1');
var nodemailer = require('nodemailer');
 


function Social(emitter, queries) {

    this.queries      = queries;
    this.emitter      = emitter;
    this.twitterOauth = {};
    this.tumblrOauth  = {};
    var auth = configAuth.auth();
    // this.googleOauth  = {};
    this.transporter = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: auth.mailer.user,
            pass: auth.mailer.pass
        }
    });




}

Social.prototype.setOauth = function(twAuth, tuAuth) {
    this.twitterOauth = twAuth;
    this.tumblrOauth = tuAuth;
    // this.googleOauth = goAuth;

}

Social.prototype.getFacebookProfile = function(user) {
    var that = this;
    FB.setAccessToken(user.facebook.token);
    FB.api('me/links', function(res) {
        if (!res || res.error) {
            return console.error(Constants.FB_LINK_ERROR, res.error);
        }
        var picParams = {
            "redirect": false,
            "height": "70",
            "type": "normal",
            "width": "70"
        }
        FB.api('me/picture', picParams, function(pic) {
            if (!pic || pic.error) {
                return console.error(Constants.FB_PIC_ERROR, pic.error);
            }

            that.queries.addMultipleItems(user, res.data, pic.data.url)

        });
    });
}

// Social.prototype.getGoogleProfile = function() {
//     plus.people.get({
//         userId: 'me',
//         auth: this.googleOauth
//     }, function(err, response) {

//         if (err) {
//             return console.error("google error", err)
//         }

//         console.log("google response", response)


//     });
// }

Social.prototype.postFacebook = function(user, message) {
    var that = this;
    FB.setAccessToken(user.facebook.token);

    var params = {
        description: message.description,
        picture: message.image,
        link: message.link,
        name: message.title
    }
    FB.api('me/feed', 'post', params, function(res) {
        if (!res || res.error) {
            that.emitter.emit(Constants.FB_POST_COMPLETE, {
                status: "error",
                service: "facebook"
            });
            return console.error(!res ? 'error occurred' : res.error);
        }
        that.emitter.emit(Constants.FB_POST_COMPLETE, {
            status: "success",
            service: "facebook"
        });
        console.log('facebook post complete Post Id: ' + res.id);
    });
}

Social.prototype.postTwitter = function(user, message) {
    var that = this;

    this.twitterOauth.post(
        "https://api.twitter.com/1.1/statuses/update.json",
        user.twitter.token,
        user.twitter.tokenSecret, {
            "status": message.title + " " + message.link
        }, function(error, data) {
            if (error) {
                that.emitter.emit(Constants.TWITTER_POST_COMPLETE, {
                    status: "error",
                    service: "twitter"
                });
                return console.error("twitter post error")
            }

            that.emitter.emit(Constants.TWITTER_POST_COMPLETE, {
                status: "success",
                service: "twitter"
            });

            console.log("twitter works yay")
        }
    );
}

Social.prototype.postTumblr = function(user, message) {
    var that = this;

    var path = "http://api.tumblr.com/v2/blog/" + user.tumblr.name + ".tumblr.com/post";
    console.log("path", path)
    var html = "<h4>" + message.title + "</h4><br/><p>" + message.description + "</p><br/><a href='" + message.link + "'>" + message.link + " </a>";
    this.tumblrOauth.post(
        path,
        user.tumblr.token,
        user.tumblr.tokenSecret, {
            "type": "photo",
            "source": message.image,
            "caption": html
        }, function(err, data) {
            if (err) {
                that.emitter.emit(Constants.TUMBLR_POST_COMPLETE, {
                    "status": "error",
                    "service": "tumblr"
                });
                return console.error("tumblr post errr")
            }

            that.emitter.emit(Constants.TUMBLR_POST_COMPLETE, {
                status: "success",
                service: "tumblr"
            });
            console.log("tumblr works yay")
        }
    );
}

// Social.prototype.postGoogle = function(user, message) {
//     var that = this;
//     console.log("this is google")



//     plus.moments.insert({
//         collection: 'vault',
//         userId: 'me',
//         debug: true,
//         resource: {
//             type: "http://schemas.google.com/AddAction",
//             target: {
//                 type: "http://schemas.google.com/AddAction",
//                 url: "...omitted...",
//                 image: "...omitted...",
//                 description: "test",
//                 name: "test"
//             }
//         },
//         auth: that.googleOauth
//     }, function(err, response) {
//         if (err) {
//             console.error(err)
//             // res.send(err.code, err)
//         } else {
//             console.log(response)
//             // res.send(200)
//         }
//     })


// }


Social.prototype.mailArticle = function(user, message) {
    var that = this;


    // setup e-mail data with unicode symbols
    var body = "<h4>" + message.title + "</h4><br/><br/>";
    body += "<img src='" + message.image + "'/><br/><br/>";
    body += "<p>" + message.description + "</p><br/><br/>";
    body += "<a href='" + message.link + "'>" + message.link + "</a>";



    var mailOptions = {
        from: message.from, // sender address
        to: message.to, // list of receivers
        subject: "hey " + user.username + " wants you to check out this article", // Subject line
        text: message.title + "\r\n\r\n" + message.description + "\r\n\r\n" + message.link, // plaintext body
        html: body // html body
    };



    // send mail with defined transport object
    this.transporter.sendMail(mailOptions, function(error, info) {

        if (error) {

            that.emitter.emit(Constants.MAIL_POST_COMPLETE, {
                "status": "error",
                "service": "email"
            });
        } else {

            that.emitter.emit(Constants.MAIL_POST_COMPLETE, {
                "status": "success",
                "service": "email"
            });
        }
    })

}



module.exports = Social;