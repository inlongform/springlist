// server.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var session = require('express-session');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('static-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(express);


require('./config/passport')(passport); // pass passport for configuration

var app = express();

var configDB = require('./config/database.js');



// configuration ===============================================================





// set up our express application
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded());
app.use(cookieParser());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//template
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//session info
// required for passport

//cookies
app.use(cookieParser()).use(function(req, res, next) {
    //console.log(JSON.stringify(req.cookies));
    next();
});

mongoose.connect(configDB.dbURL(), function(e) {

    var now = new Date().getTime();

    app.use(express.session({
        secret: 'ilovecookies',
        key: 'app.sess',
        cookie: {
            maxAge: new Date(now + 7 * 24 * 60 * 60 * 1000), //1 week
        },
        store: new MongoStore({
            url: configDB.dbURL(),
            auto_reconnect:true
        })
    })); // session secret

    // console.log("date" + new Date(Date.now() + 3600000))

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session



    // routes ======================================================================
    require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport



    // launch ======================================================================
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        console.log("THERE IS AN ERROR")
        next(err);
    });

    /// error handlers

    // development error handler
    // will print stacktrace
    //process.env.NODE_ENV
    // process.env['env'] = 'production';


    if (app.get('env') === 'development') {
        // console.log("dev mode")
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


}); // connect to our database


mongoose.connection.on("error", console.error.bind(console, "connection error"));



/// catch 404 and forwarding to error handler

module.exports = app;