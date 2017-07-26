
var Constants = require('../config/constants');
var Events = require('events').EventEmitter;
var Queries = require('./queries');
var Social = require('./social');
var Utils = require('./utils/utils');

module.exports = function(app, passport) {


    var _eventEmitter = new Events;
    var _queries = new Queries(_eventEmitter);
    var _social = new Social(_eventEmitter, _queries);

    


    //routes
    var _authorization = require("./routes/authorization")(passport);
    
    var _get_routes = require("./routes/get_routes")(_eventEmitter, _queries, _social);
    var _api_routes = require("./routes/api_routes")(_eventEmitter, _queries, _social);

 


    //handlers
    _eventEmitter.on(Constants.DB_ADD_COMPLETE, function(res) {
        console.log("DB_ADD_COMPLETE", res)
    });

    // _eventEmitter.setMaxListeners(0);


    

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // LOCAL --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', _authorization.login);
    // process the login form
    app.post('/login', _authorization.postLogin);

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', _authorization.getSignup);
    // process the signup form
    app.post('/signup', _authorization.postSignup);

    // FACEBOOK -------------------------------

    // send to facebook to do the authentication
    // app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email, public_profile, user_friends, publish_actions, read_stream, publish_stream' }));
    app.get('/auth/facebook', _authorization.authFB);
    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',_authorization.authFBCallBack);


    // TWITTER --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', _authorization.authTwitter);
    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', _authorization.authTwitterCallBack);


    // GOOGLE ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', _authorization.authGoogle);
    // the callback after google has authenticated the user
    app.get('/auth/google/callback', _authorization.authGoogleCallBack);

    // TUMBLR ---------------------------------

    // send to google to do the authentication
    app.get('/auth/tumblr', _authorization.authTumblr);
    // the callback after google has authenticated the user
    app.get('/auth/tumblr/callback', _authorization.authTumblrCallBack);


    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================
    // TUMBLR ---------------------------------
    app.get('/connect/tumblr', _authorization.connectTumblr);
    app.get('/connect/tumblr/callback', _authorization.connectTumblrCallBack);

    // LOCAL --------------------------------
    app.get('/connect/local', _authorization.getConnectLocal);
    app.post('/connect/local', _authorization.postConnectLocal);

    // FACEBOOK -------------------------------
    // send to facebook to do the authentication
    app.get('/connect/facebook', _authorization.connectFB);
    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',_authorization.connectFBCallBack);

    // TWITTER --------------------------------
    // send to twitter to do the authentication
    app.get('/connect/twitter', _authorization.connectTwitter);
    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback', _authorization.connectTwitterCallBack);


    // GOOGLE ---------------------------------
    // send to google to do the authentication
    app.get('/connect/google', _authorization.connectGoogle);
    // the callback after google has authorized the user
    app.get('/connect/google/callback', _authorization.connectGoogleCallBack);


    // GET ROUTES =========================


    app.get('/', _get_routes.index);

     app.get('/profile', Utils.isLoggedIn, _get_routes.profile);

    app.get('/feed/:uid', Utils.isLoggedIn, _get_routes.getFeed);

    app.get('/search/:hash', Utils.isLoggedIn, _get_routes.searchHash);

    app.get('/rss/:uid', _get_routes.getRss);


    // AJAX ROUTES =============================================================

    app.get('/api/hash_page', Utils.isLoggedIn, _api_routes.getHashPage);
    app.get('/api/feed_page', Utils.isLoggedIn, _api_routes.getFeedPage);
    app.post('/api/scrape', Utils.isLoggedIn, _api_routes.scrape)

    app.post('/api/add_article_by_id', Utils.isLoggedIn, _api_routes.addArticleById)

    app.post('/api/remove_article', Utils.isLoggedIn, _api_routes.removeArticle);

    app.post('/api/search_friends', Utils.isLoggedIn, _api_routes.searchFriends);

    app.get('/api/get_friends', Utils.isLoggedIn, _api_routes.getFriends);

    app.post('/api/add_friend', Utils.isLoggedIn, _api_routes.addFriend);

    app.post('/api/remove_friend', Utils.isLoggedIn, _api_routes.removeFriend);

    app.post('/api/share_post', Utils.isLoggedIn, _api_routes.sharePost, _api_routes.shareComplete);

    app.post('/api/invite_friends', Utils.isLoggedIn, _api_routes.inviteFriends);

    app.get('/api/getEmailAddress', Utils.isLoggedIn, _api_routes.getEmailAddress);

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    app.get('/unlink/local', _authorization.unlinkLocal);
    app.get('/unlink/facebook', _authorization.unlinkFB);
    app.get('/unlink/twitter', _authorization.unlinkTwitter);
    app.get('/unlink/google', _authorization.unlinkGoogle);
    app.get('/unlink/tumblr', _authorization.unlinkTumblr);
    // LOGOUT ==============================
    app.get('/logout', _authorization.logout);

    //404 redirect
    app.all("*", function(req, res){
        res.redirect("/");
    })


};
