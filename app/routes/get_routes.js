
var Constants = require('../../config/constants');

var Utils = require('../utils/utils');
var Url = require("url");
var Rss = require("../rss");
var configAuth = require('../../config/auth');






module.exports = function(emitter, queries, social) {


    var _eventEmitter = emitter;
    var _queries = queries;
    var _social = social;


    var get_routes = {};
    var auth = configAuth.auth();

    var _startTime = Utils.getStartTime();
    var _loadFB = true;
    var _firstLoad = true;


    // util.inherits(_queries, events.EventEmitter);
    //add to queries constructor
    //events.EventEmitter.call(this);


    get_routes.index = function(req, res) {
        res.render('index');
        // console.log(req.user)
    }

    get_routes.profile = function(req, res) {

        res.render('profile', {
            uid: req.user._id,
            user: req.user,
            rss: auth.domain + "rss/" + req.user._id
        });
    }

    get_routes.getFeed = function(req, res) {
        var evt = Constants.LOAD_FEED_COMPLETE;
        // Social.feed.facebook(req.user);
        // Social.feed.getProfile(req.user);

        req.session.page = 0;
        req.session.uid = req.param('uid');


        if(_firstLoad){
            _firstLoad = false;
        }else{
            //only get check fb every 15 min
            if(new Date() > _startTime){
                _loadFB = true;
                _startTime = Utils.getStartTime();
            }else{
                _loadFB = false;
            }
        }

        // console.log("_loadFB", _loadFB)




        //get oauth props
        var twitterOauth = {};
        var tumblrOauth = {};
        // var googleOauth = {};
        if(req.user.twitter && req.user.twitter.token){
            twitterOauth = Utils.createTwitterOauth();
        }

        if(req.user.tumblr && req.user.tumblr.token){
            tumblrOauth = Utils.createTumblrOauth();
        }
        // if(req.user.google && req.user.google.token){
        //     googleOauth = Utils.createGoogleOauth(req.user, req.session.gapiCode);

        // }


        //set oAuth props
        _social.setOauth(twitterOauth, tumblrOauth);

        // _social.getGoogleProfile()



        var complete = function(data) {
            // console.log(data)

            var posts = new Array();
            var postData = data.data;
            for (var i = 0; i < postData.length; i++) {
                postData[i].created_time = new Date(postData[i].created_time).toDateString();
                postData[i].picture = postData[i].picture;
                posts.push(postData[i])
            }
            //check emails



            var emails = Utils.getEmailAddress(req.user);

            res.render('feed', {
                title: "FEED",
                data: posts,
                me: Utils.stripUserProps(req.user),
                user: Utils.stripUserProps(data.user),
                isUser: (String(req.param('uid')) == String(req.user._id) ? true : false)
            });
            // _eventEmitter.removeListener(evt, complete);

        }

        _eventEmitter.once(evt, complete);

        //me
        if (String(req.param('uid')) == String(req.user._id)) {
            //if logged into facebook

            if (req.user.facebook.token) {
                // console.log("_loadFB", _loadFB)
                if(_loadFB){

                    _social.getFacebookProfile(req.user);
                }else{
                    _queries.getUserArticles(req.user._id, 0)
                }
            } else {

                _queries.getUserArticles(req.user._id, 0)
            }
        } else {
            // not me
            //get articles
            // console.log(req.param('uid'))
            console.log("param id", req.param('uid'))
            _queries.getUserArticles(req.param('uid'), 0)

        }
    }

    get_routes.searchHash = function(req, res) {
        var evt = Constants.SEARCH_HASH_COMPLETE;


        // var url_parts = Url.parse(req.url, true);
        // var uid = url_parts.query.uid;
        var searchTerm = req.param("hash");
        req.session.searchTerm = searchTerm;
        req.session.page = 0;


        // console.log(req.body.searchTerm, req.body.uid)
        var complete = function(data) {
            console.log(data)
            // console.log("data", data.data)
            var posts = new Array();
            var postData = data;
            // var userData = data.userData;
            for (var i = 0; i < postData.length; i++) {

                postData[i].created_time = new Date(postData[i].created_time).toDateString();
                postData[i].picture = postData[i].picture;
                posts.push(postData[i])
            }

            res.render('search-results', {
                title: "search-results for " + searchTerm,
                data: posts,
                me: Utils.stripUserProps(req.user),
                user: {
                    id: req.user._id
                },
                // user: userData,
                searchTerm: searchTerm,
                // count: String(posts.length),
                // isUser: (uid == String(req.user._id) ? true : false),
                none: ((posts.length <= 0)? true: false)


            })

            // _eventEmitter.removeListener(evt, complete);
        }

        _eventEmitter.once(evt, complete);
        _queries.searchHash(searchTerm, 0);
    }

    get_routes.getRss = function(req, res){

        var evt = Constants.LOAD_FEED_COMPLETE;                

        var complete = function(data){
            //send xml
            res.header('Content-Type', 'text/xml');
            res.send(Rss.getFeed(data))
        }

        _eventEmitter.once(evt, complete);
        _queries.getUserArticles(req.param('uid'))
    }


    return get_routes;
}