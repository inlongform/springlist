function Twitter() {

  console.log("twitter util");
}
// class methods
Twitter.postArticle = function(user, message) {

  // if (!user.twitter.token) {
  //   console.error("You didn't have the user log in first");
  // }
  // oa.post(
  //   "https://api.twitter.com/1.1/statuses/update.json"
  // , user.token
  // , user.tokenSecret
  // // We just have a hard-coded tweet for now
  // , { "status": "How to Tweet & Direct Message using NodeJS http://blog.coolaj86.com/articles/how-to-tweet-from-nodejs.html via @coolaj86" }
  // , cb
  // );

};
// export the class
module.exports = Twitter;