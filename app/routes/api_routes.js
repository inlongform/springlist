// Constructor



var Scraper = require('../scraper');
var Utils = require('../utils/utils');
var Constants = require('../../config/constants');



module.exports = function(emitter, queries, social) {

    var _eventEmitter = emitter;
    var _queries = queries;
    var DEFAULT_IMG = Constants.PLACEHOLDER_IMAGE;
    var _scraper = new Scraper(_queries, _eventEmitter);
    var _social = social;


    var api_routes = {};




    api_routes.scrape = function(req, res) {
        var evt = Constants.SCRAPE_COMPLETE;


        var complete = function(data) {
            res.setHeader('Content-Type', 'application/json');
            //format time

            var emails = Utils.getEmailAddress(req.user);


            var info = {
                data: [data],
                date: data.created_time.toDateString(),
                user: Utils.stripUserProps(req.user)  
            }

            res.end(JSON.stringify(info));
            // _eventEmitter.removeListener(evt, complete);

        }
            // console.log("route", req.body.url, req.body.hash)

        _eventEmitter.once(evt, complete);
        var hashs = req.body.hash.split(",");
        hashs.pop();

        _scraper.scrape(req.user, req.body.url, hashs);
    }

    api_routes.addArticleById = function(req, res) {
        var evt = Constants.ADDED_ARTICLE_BY_ID_COMPLETE;
        var complete = function(data) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            // _eventEmitter.removeListener(evt, complete);
        }
        _eventEmitter.once(evt, complete);
        _queries.addArticleById(req.user, req.body.id);
    }

    api_routes.removeArticle = function(req, res) {

    }

    api_routes.searchFriends = function(req, res) {
        var evt = Constants.SEARCH_FRIENDS_COMPLETE;

        var complete = function(data) {

            var results = new Array();
            var context = {
                data: results
            }
            for (var i = 0; i < data.length; i++) {
                //dont get myself

                if (String(data[i]._id) != String(req.user._id)) {

                    var obj = {
                        name: data[i].username,
                        uid: data[i]._id,
                        picture: (data[i].imageURL) ? data[i].imageURL : DEFAULT_IMG,
                        isFollowing: String(((req.user.following.indexOf(data[i]._id) != -1) ? "" : "false"))
                    }
                    console.log("isFollowing", obj.isFollowing)

   
                    results.push(obj);
                }
            }

            Utils.sortObjectAlpha(context.data);

            if (results.length < 1) {
                context.none = "none";
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(context));
            // _eventEmitter.removeListener(evt, complete);

        }
        _eventEmitter.once(evt, complete);


        _queries.searchFriends(req.body);
    }

    api_routes.getFriends = function(req, res) {
        var evt = Constants.GET_FRIENDS_COMPLETE;

        var complete = function(data) {

            var results = new Array();
            var context = {
                people: results
            }
            for (var i = 0; i < data.length; i++) {
                //dont add myself
                if (String(data[i]._id) != String(req.user._id)) {

                    var obj = {
                        name: data[i].username,
                        uid: data[i]._id,
                        picture: (data[i].imageURL) ? data[i].imageURL : DEFAULT_IMG

                    }

                    results.push(obj);
                }
            }

            // Utils.sortObjectAlpha(context.people);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(context));
            // _eventEmitter.removeListener(evt, complete);
        }

        _eventEmitter.once(evt, complete);
        _queries.getFriends(req.user);
    }

    api_routes.addFriend = function(req, res) {
        var evt = Constants.ADD_FRIEND_COMPLETE;

        var complete = function(data) {

            // console.log(data)

            var obj;

            if (data.isFriend) {
                obj = data;

            } else {


                var results = new Array(obj = {
                    name: data.username,
                    uid: data._id,
                    picture: (data.imageURL) ? data.imageURL : DEFAULT_IMG
                });

                obj = {
                    people: results
                }

            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));

            // _eventEmitter.removeListener(evt, complete);
        }

        _eventEmitter.once(evt, complete);
        _queries.addFriend(req.user, req.body.id)
    }

    api_routes.removeFriend = function(req, res) {
        var evt = Constants.REMOVE_FRIEND_COMPLETE;

        var complete = function() {

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                status: "success"
            }));

            // _eventEmitter.removeListener(evt, complete);
        }
        _eventEmitter.once(evt, complete);
        _queries.removeFriend(req.user, req.body.id);
    }

    api_routes.sharePost = function(req, res, next){

        var message = req.body.item;
        var services = req.body.services;
        var totalShare = services.length;
        var count = 0;
        var shareResults = new Array();


        var complete = function(data){
            console.log(data)
            shareResults.push(data);
            count++;

            if(count >= totalShare){
                req.session.shareData = JSON.stringify(shareResults);
                next();
            }
            // next();
        }

        for (var i = 0; i < services.length; i++) {
            if (services[i] == "fb") {
                //post to facebook
                console.log("post to facebook")
                _eventEmitter.once(Constants.FB_POST_COMPLETE, complete);

                _social.postFacebook(req.user, message)
                // Social.post.facebook(req.user, message)
            } else if (services[i] == "tw") {
                //post to twitter
                console.log("post twitter")
                _eventEmitter.once(Constants.TWITTER_POST_COMPLETE, complete);
                _social.postTwitter(req.user, message)
                // Social.post.twitter(req.user, message)
            } 
            //dont have a google apps account
            // else if (services[i] == "go") {
            //     //post to google
            //     console.log("post to google")
            //     _eventEmitter.once(Constants.GOOGLE_POST_COMPLETE, complete);
            //     _social.postGoogle(req.user, message)
            //     // Social.post.google(req.user, message)
            // } 
            else if (services[i] == "tu") {
                //post to tumblr
                console.log("post  to tumblr")
                _eventEmitter.once(Constants.TUMBLR_POST_COMPLETE, complete);
                _social.postTumblr(req.user, message)
               // Social.post.tumblr(req.user, message)
            } else if (services[i] == "email") {
                //email message
                console.log("send mail")
                _eventEmitter.once(Constants.MAIL_POST_COMPLETE, complete);
                _social.mailArticle(req.user, message)
 
            }
        }
    }

    api_routes.shareComplete = function(req, res) {

        console.log(req.session.shareData)

        res.setHeader('Content-Type', 'application/json');
        res.end(req.session.shareData);

    }

    api_routes.getEmailAddress = function(req, res){
        var emails = Utils.getEmailAddress(req.user);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(emails));
    }

    api_routes.getHashPage = function(req, res){
        // console.log("getHashPage")


        var evt = Constants.SEARCH_HASH_COMPLETE;


        // console.log(req.body.searchTerm, req.body.uid)
        var complete = function(data) {

            // console.log("data", data.data)
            var posts = new Array();
            var postData = data;
            // var userData = data.userData;
            for (var i = 0; i < postData.length; i++) {
                postData[i].created_time = new Date(postData[i].created_time).toDateString();
                postData[i].picture = postData[i].picture;
                posts.push(postData[i])
            }

            var info = {
                data: posts,
                me: Utils.stripUserProps(req.user),
                // user: Utils.stripUserProps(data.user),
                isUser: (String(req.session.uid) == String(req.user._id) ? true : false)
            }


            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(info));


        }
        req.session.page++;
        _eventEmitter.once(evt, complete);
        _queries.searchHash(req.session.searchTerm, req.session.page);
    }
    api_routes.getFeedPage = function(req, res){

        var evt = Constants.LOAD_FEED_COMPLETE;

        var complete = function(data){
            var posts = new Array();
            var postData = data.data;
            for (var i = 0; i < postData.length; i++) {
                postData[i].created_time = new Date(postData[i].created_time).toDateString();
                postData[i].picture = postData[i].picture;
                posts.push(postData[i])
            }
            //check emails
            var emails = Utils.getEmailAddress(req.user);
            var info = {
                data: posts,
                me: Utils.stripUserProps(req.user),
                user: Utils.stripUserProps(data.user),
                isUser: (String(req.session.uid) == String(req.user._id) ? true : false)
            }


            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(info));
        }

        req.session.page++;
        console.log(req.session.page)
        _eventEmitter.once(evt, complete);
        _queries.getUserArticles(req.session.uid, req.session.page)
        // console.log("getHashPage")
        console.log(req.session.searchTerm, req.session.page, req.session.uid)
    }




    api_routes.inviteFriends = function(req, res) {

    }



    return api_routes;
}

