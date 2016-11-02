module.exports = function(app) {
  var TwisterUser = app.models.TwisterUser;
  var Follow = app.models.Follow;
  var Tweet = app.models.Tweet;

  TwisterUser.afterRemote('findById', function(ctx, user, next) {
    if (ctx.result) {
      var profile = {
        username: ctx.result.username,
        name: ctx.result.name,
        email: ctx.result.email,
      };

      Follow.count({"followedUsername": profile.username})
      .then(numFollowers => {
        profile.numFollowers = numFollowers;

        return Follow.count({"username": profile.username});
      })
      .then(numFollowings => {
        profile.numFollowings = numFollowings;

        return Tweet.count({"username": profile.username})
      })
      .then(numTweets => {
        profile.numTweets = numTweets;

        ctx.result = profile;
        next();
      });
    } else {
      next();
    }
  });
}
