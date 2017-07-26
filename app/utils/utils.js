var underscore = require('underscore');

var OAuth = require('oauth').OAuth;
var google = require('googleapis');

var OAuth2 = google.auth.OAuth2;
var configAuth = require('../../config/auth');
var Constants = require('../../config/constants');


function Utils() {}
// class methods


Utils.createNewsItemObj = function(data) {
    var obj = {
        created_time: data.created_time,

        description: data.description,
        fb_id: data.id,
        link: data.link,
        name: data.name,
        message: data.message,
        picture: data.picture,
        hash: data.hash
    }
    return obj;
};

Utils.stripUserProps = function(user) {

    var emails = Utils.getEmailAddress(user)
    var newUser = {
        name: user.username,
        id: user._id,
        picture: user.imageURL,
        hasEmail: ((emails.length > 0) ? true : false),
        facebook: ((user.facebook && user.facebook.token) ? true : false),
        twitter: ((user.twitter && user.twitter.token) ? true : false),
        google: ((user.google && user.google.token) ? true : false),
        tumblr: ((user.tumblr && user.tumblr.token) ? true : false),

    }
    return newUser;
}

Utils.getEmailAddress = function(user) {
    var emails = new Array();
    if (user.local && user.local.email) {
        emails.push(user.local.email)
    }

    if (user.facebook && user.facebook.email) {
        emails.push(user.facebook.email)
    }

    if (user.google && user.google.email) {
        emails.push(user.google.email)
    }

    underscore.uniq(emails);

    return emails;
}


Utils.sortObjectAlpha = function(obj) {
    obj.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
            nameB = b.name.toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
    })
};

Utils.sortObjectDate = function(date1, date2) {
    // This is a comparison function that will result in dates being sorted in
    // DESCENDING order.
    if (date1.created_time > date2.created_time) return -1;
    if (date1.created_time < date2.created_time) return 1;
    return 0;
};

Utils.isLoggedIn = function(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

Utils.getStartTime = function(){
    var startDate = new Date();
    var startTime = startDate.setMinutes(startDate.getMinutes() + Constants.TIME_DIFF);
    return startTime;
}

Utils.createTwitterOauth = function() {

    var auth = configAuth.auth();
    var oa = new OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        auth.twitterAuth.consumerKey,
        auth.twitterAuth.consumerSecret,
        "1.0A",
        null,
        "HMAC-SHA1"
    );



    return oa;
}
Utils.createTumblrOauth = function() {
    var auth = configAuth.auth();

    var oa = new OAuth(
        "http://www.tumblr.com/oauth/request_token",
        "http://www.tumblr.com/oauth/access_token",
        auth.tumblrAuth.consumerKey,
        auth.tumblrAuth.consumerSecret,
        "1.0A",
        null,
        "HMAC-SHA1"
    );

    return oa;
}

Utils.createGoogleOauth = function(user, code) {

    var auth = configAuth.auth();
    var oauth2Client = new OAuth2(auth.googleAuth.clientID, auth.googleAuth.clientSecret, "/profile");
   
    // var scopes = Constants.GOOGLE_SCOPES;

    // console.log("createGoogleOauth")

     // var googleURL = oauth2Client.generateAuthUrl({
     //     access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
     //     scope: Constants.GOOGLE_SCOPES // If you only need one scope you can pass it as string
     // });

     // console.log(googleURL)

    oauth2Client.setCredentials({
        access_token: user.google.token,
        refresh_token: user.google.refreshToken
    });
    // oauth2Client.refreshAccessToken(function(err, tokens) {
    //     console.log(err)
    //     console.log(tokens)
    //     if(!err){

    //         oauth2Client.setCredentials(tokens);
    //     }
    // });




    // var plus = google.plus({ version: 'v1', auth: oauth2Client });
    // var domains = google.plusDomains({ version: 'v1', auth: oauth2Client });

    // console.log(url)

    // console.log(user.google.token, user.google.refreshToken)

    // console.log(oauth2Client)


    // domains.activities.insert({
    //     userId: "me",
    //     verb:"post",
            // preview: "true",
    //     kind: "plus#activity",
    //     actor: {
    //         id: "103234829438434323420",
    //         displayName: 'robbie williams',
    //         name: { familyName: 'williams', givenName: 'robbie' },
    //         url: 'https://plus.google.com/103234829438434323420',
    //         image: {
    //             url: 'https://lh5.googleusercontent.com/-NysbBW23vLU/AAAAAAAAAAI/AAAAAAAADh4/T8irXOsFuN4/photo.jpg'
    //         }
    //     },
    //     attachments: [
    //         {
    //             objectType: "article",
    //             displayName: "title",
    //             content: "this is the description",
    //             url: "http://theonion.com",
    //             image: {
    //                 url: "http://o.onionstatic.com/images/26/26960/original/700.jpg?0753"
    //             }
    //         }
    //     ]

    // }, function(err, response){
    //     console.log(err)
    //     console.log(response)
    // })



    return oauth2Client;
}




// export the class
module.exports = Utils;