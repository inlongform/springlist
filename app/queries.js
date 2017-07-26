var Constants = require('../config/constants');
var NewsItem = require('./models/news-item');
var User = require('./models/user');
var Utils = require('./utils/utils');
var underscore = require('underscore');


function Queries(emitter) {

    this.emitter = emitter;
    

}




Queries.prototype.addMultipleItems = function(user, data, url) {

    var newsObjs = new Array();
    var links = new Array();
    var savedArticleLinks = new Array();
    var that = this;


    this.addImageURL(user, url);


    for (var i = 0; i < data.length; i++) {
        var newsObj = Utils.createNewsItemObj(data[i]);
        var items = new NewsItem(newsObj);
        newsObjs.push(items);
        links.push(data[i].link)

    }



    var promise = NewsItem.find({
        link: {
            $in: links
        }
    }).exec(function(err, docs) {
        if (!err) {
            for (var i = 0; i < docs.length; i++) {
                // savedArticleIds.push(docs[i]._id);
                savedArticleLinks.push(docs[i].link);
            }

            var unsavedObjs = new Array();
            if (savedArticleLinks.length > 0) {
                for (var i = 0; i < newsObjs.length; i++) {
                    var index = savedArticleLinks.indexOf(newsObjs[i].link);
                    // var index = newsObjs[i].link.indexOf(savedArticleLinks);
                    // console.log(newsObjs[i].link, savedArticleLinks.indexOf(newsObjs[i].link))
                    if (index == -1) {
                        unsavedObjs.push(newsObjs[i]);
                        // console.log("not found add object " + index);
                    }
                }
                NewsItem.create(unsavedObjs, function(err) {
                    if (err) {
                        return console.error(err)
                    } else {
                        that.addArticlesToUser(user, unsavedObjs);
                    }
                });
            } else {
                NewsItem.create(newsObjs, function(err) {
                    if (err) {
                        return console.error(err)
                    } else {
                        that.addArticlesToUser(user, newsObjs);
                    }
                });
            }
        }
    }).then(function(result) {
        console.log("result length", result.length)

        // var ids = results.map(function(m) {
        //     return m._id;
        // })
    })

}


// class methods
Queries.prototype.addArticlesToUser = function(user, data) {
    var that = this;
    // console.log(data)
    var ids = underscore.pluck(data, "_id");


    // console.log("data", data)


    if (ids.length > 0) {


       var itemArray = new Array();
       for(var i = 0; i < data.length; i++){

            var itemInfo = {
                created_time: data[i].created_time,
                article_id: data[i].id
            }

            itemArray.push(itemInfo)
       }
       // console.log(itemArray)

        // user.articles = user.articles.concat(ids);
        user.articles = user.articles.concat(itemArray);

        user.save(function(err) {
            if (err) {
                console.log("add friend error", err)
                return console.error(err)
            } else {
                that.getUserArticles(user._id)
                    //return added friend info
                console.log("articles saved")
            }
        })
    } else {
        
        console.log("ids", ids)
        that.getUserArticles(user._id, 0)
    }

}




Queries.prototype.getUserArticles = function(uid, page) {
    var that = this;

    console.log(uid, page)

    User.findById(String(uid), function(err, userData) {
        if (err) {
            return console.error(err)
        } else {
            //get all the user ids
            var article_ids = underscore.pluck(userData.articles, "article_id");

            NewsItem.find({
                _id: {
                    $in: article_ids
                }
            })
            .limit(Constants.PAGE_LIMIT)
            .skip(page * Constants.PAGE_LIMIT)
            .sort({created_time: -1})
            .exec(function(err, docs) {
                if (err) {
                    return console.error(Constants.DB_ADD_ERROR, err)
                } else {
                    //return news items from the user ids array

        
                    var newDocs = new Array();
                    for(var i = 0; i < docs.length; i++){
                        //match the saved user article to the returned article
                        var idIndex = article_ids.indexOf(String(docs[i]._id));
                        // console.log(idIndex, docs[i]._id)
                        if(idIndex != -1){
                            
                            //update the date in the returned docs to reflect the date in the user copy 
                            docs[i].created_time = userData.articles[idIndex].created_time

                            
                        }
                    }

                    //sort the returned objects by date
                    docs.sort(Utils.sortObjectDate);

                    var obj = {
                        user: userData,
                        data: docs
                    }
                    var json = JSON.parse(JSON.stringify(obj));


                    that.emitter.emit(Constants.LOAD_FEED_COMPLETE, json)

                }
            })
        }
    })

}

Queries.prototype.addArticleById = function(user, id) {
    var that = this;

    var ids = underscore.pluck(user.articles, "article_id");

    var isSaved = ids.indexOf(id);


    if (isSaved == -1) {
        var info = {
            created_time: new Date(),
            article_id: id
        }
        user.articles.push(info);
        // user.articles.push(id);
        user.save(function(err) {
            if (err) {
                that.emitter.emit(Constants.ADDED_ARTICLE_BY_ID_COMPLETE, {
                    "status": "error"
                })
                return console.error(err)
            } else {
                that.emitter.emit(Constants.ADDED_ARTICLE_BY_ID_COMPLETE, {
                    "status": "saved"
                })
            }
        })
    } else {
        that.emitter.emit(Constants.ADDED_ARTICLE_BY_ID_COMPLETE, {
            "status": "exists"
        })
    }

}

Queries.prototype.addNewsItem = function(user, data) {
    console.log("//////////////////")
    console.log("adding to db")

    var that = this;

    NewsItem.find({
        link: data.link
    }).exec(function(err, result) {
        if (!err) {

            var newsItem = new NewsItem(data);
            var itemInfo = {
                created_time: new Date(),
                article_id: newsItem._id
            }
            console.log(newsItem)
            if (result.length <= 0) {
                console.log("add a new entry")
                newsItem.save(function(err) {
                    if (err) {

                        return console.error(Constants.DB_ADD_ERROR, err)

                    } else {
                        console.log("add article id to user")
                       

                        // user.articles.push(newsItem._id);
                        user.articles.push(itemInfo);


                        user.save(function(err) {
                            if (err) {
                                return console.error(Constants.DB_ADD_ERROR, err)
                            } else {

                                that.emitter.emit(Constants.SCRAPE_COMPLETE, newsItem)
                            }
                        })
                    }
                });

            } else {
                console.log("entry already exists");
                console.log("add article id to user")
                    // console.log(newsItem)
                // user.articles.push(newsItem._id);
                user.articles.push(itemInfo);
                user.save(function(err) {
                    if (err) {
                        return console.error(Constants.DB_ADD_ERROR, err)
                    } else {
                        that.emitter.emit(Constants.SCRAPE_COMPLETE, newsItem)
                    }
                })
            }

        } else {
            console.log(Constants.SCRAPE_ERROR, err);

        };
    });

}

Queries.prototype.searchFriends = function(info) {

    console.log("info", info)

    var that = this;

    if (info.name) {
        console.log("search for a specific person", info.name)
        User.find({
            'username': {
                $regex: ".*" + info.name + ".*",
                $options: 'i'
            }
        }).exec(function(err, result) {
            if (err) {

                return console.error(Constants.SEARCH_FRIENDS_ERROR, err)
            } else {
                that.emitter.emit(Constants.SEARCH_FRIENDS_COMPLETE, result);
            };
        });
    } else {
        console.log("get a users friends", info.uid)
        User.findById(info.uid, function(err, result) {
            if (err) {
                return console.error(Constants.SEARCH_FRIENDS_ERROR, err)
            } else {

                if (result.following.length <= 0) {
                    that.emitter.emit(Constants.SEARCH_FRIENDS_COMPLETE, []);
                } else {

                    User.find({
                        _id: {
                            $in: result.following
                        }
                    }).exec(function(err, docs) {
                        if (err) {
                            return console.error(Constants.SEARCH_FRIENDS_ERROR, err)
                        } else {

                            that.emitter.emit(Constants.SEARCH_FRIENDS_COMPLETE, docs);
                        };
                    });

                }
            }
        })
    }
}


Queries.prototype.addImageURL = function(user, url) {

    var that = this;


    //only do this if they dont match
    if (url != user.imageURL) {

        user.imageURL = url;
        user.save(function(err) {
            if (err) {
                return console.error(Constants.DB_ADD_ERROR, err)

            } else {
                console.log("url added to DB")
                that.emitter.emit(Constants.DB_ADD_COMPLETE);
            }

        });
    }
}

Queries.prototype.addFriend = function(user, uid) {

    user.following.indexOf(uid)
    var that = this;

    if (user.following.indexOf(uid) == -1) {
        console.log("add friend")
        user.following.push(uid);
        user.save(function(err) {
            if (err) {
                return console.error(Constants.SEARCH_FRIENDS_ERROR, err)
            } else {
                //return added friend info
                User.findById(uid, function(err, result) {
                        if (err) {
                            return console.error(Constants.SEARCH_FRIENDS_ERROR, err)
                        } else {

                            that.emitter.emit(Constants.ADD_FRIEND_COMPLETE, result);
                        }
                    })
                    // that.findFriendById(uid);
            }
        })
    } else {
        that.emitter.emit(Constants.ADD_FRIEND_COMPLETE, {
            isFriend: true
        });
    }
}


Queries.prototype.removeFriend = function(user, id) {
    var that = this;
    var index = user.following.indexOf(id);
    user.following.splice(index, 1);
    user.save(function(err) {
        if (err) {
            return console.error("remove friend error", err)
        } else {
            //return added friend info
            that.emitter.emit(Constants.REMOVE_FRIEND_COMPLETE);
        }
    })
    console.log(user.following);

}

Queries.prototype.getFriends = function(user) {
    console.log("get follow", user.following);


    var that = this;

    // console.log(typeof(user.following))
    if (user.following.length <= 0) {
        this.emitter.emit(Constants.GET_FRIENDS_COMPLETE, []);
    } else {
        User.find({
            _id: {
                $in: user.following
            }
        }).sort({
            "username": 1
        }).exec(function(err, docs) {
            if (err) {
                return console.error("get friend error", err)
            } else {

                that.emitter.emit(Constants.GET_FRIENDS_COMPLETE, docs);
            };
        });
    }
}

Queries.prototype.searchHash = function(searchTerm, page) {
    // console.log(searchTerm, uid)
        //get user
        //match hash for user articles
        //return matching
    var that = this;
    
    var results = new Array();
    //{_id: { $in: articleIds}, hash: {$all: [searchTerm]}}
    NewsItem.find({
        "hash": searchTerm
    })
      .limit(Constants.PAGE_LIMIT)
      .skip(page * Constants.PAGE_LIMIT)
      .sort({created_time: -1})
      .exec(function(err, docs) {
        if(err){
            return console.error(Constants.SEARCH_HASH_ERROR, err)
        }else{
            that.emitter.emit(Constants.SEARCH_HASH_COMPLETE, docs);
        }
    })
  }





// export the class
module.exports = Queries;