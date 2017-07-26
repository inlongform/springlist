// Constructor

/*
 * GET home page.
 */

var Constants = require('../../config/constants');

module.exports = function(passport) {

    var authorization = {};


    authorization.logout = function(req, res) {
        req.logout();
        req.session.destroy()
        res.redirect('/');
    }

    authorization.login = function(req, res) {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    }

    authorization.postLogin = passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    })


    authorization.getSignup = function(req, res) {
        res.render('signup', {
            message: req.flash('loginMessage')
        });
    }



    authorization.postSignup = passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    })

    authorization.getConnectLocal = function(req, res) {
        res.render('connect-local', {
            message: req.flash('loginMessage')
        });
    }

    authorization.postConnectLocal = passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    })

    authorization.unlinkLocal = function(req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    }


    //facebook
    authorization.authFB = passport.authenticate('facebook', {
        scope: Constants.FACEBOOK_SCOPES
    })


    authorization.authFBCallBack = passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })


    authorization.connectFB = passport.authorize('facebook', {
        scope: Constants.FACEBOOK_SCOPES
    })


    authorization.connectFBCallBack = passport.authorize('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })

    authorization.unlinkFB = function(req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    }

    //twitter
    authorization.authTwitter = passport.authenticate('twitter', {
        scope: 'email'
    })

    authorization.authTwitterCallBack = passport.authenticate('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })

    authorization.connectTwitter = passport.authorize('twitter', {
        scope: 'email'
    })

    authorization.connectTwitterCallBack = passport.authorize('twitter', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })

    authorization.unlinkTwitter = function(req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    }

    //google

    authorization.authGoogle = passport.authenticate('google', {
        scope: Constants.GOOGLE_SCOPES
    });

    authorization.authGoogleCallBack = passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    });

    authorization.connectGoogle = passport.authorize('google', {
        scope: Constants.GOOGLE_SCOPES
    });

    authorization.connectGoogleCallBack = passport.authorize('google', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })

    authorization.unlinkGoogle = function(req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    }

    //tumblr

    authorization.authTumblr = passport.authenticate('tumblr', {});

    authorization.authTumblrCallBack = passport.authenticate('tumblr', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })

    authorization.connectTumblr = passport.authorize('tumblr', {});

    authorization.connectTumblrCallBack = passport.authorize('tumblr', {
        successRedirect: '/profile',
        failureRedirect: '/'
    })

    authorization.unlinkTumblr = function(req, res) {
        var user = req.user;
        user.tumblr.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    }


    return authorization;
}