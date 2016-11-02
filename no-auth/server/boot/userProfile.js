module.exports = function(app) {
  var TwisterUser = app.models.TwisterUser;
  var Follow = app.models.Follow;
  var findOne = TwisterUser.findOne;

  // Override findOne to attach numFollowers and numFollowings
  TwisterUser.findOne = function(query, options, cb) {
    var profile = {};

    return findOne.call(TwisterUser, query, options)
    .then(user => {
      profile.username = user.username;
      profile.name = user.name;
      profile.email = user.email;

      return Follow.count({"followedUsername": profile.username});
    })
    .then(numFollowers => {
      profile.numFollowers = numFollowers;

      return Follow.count({"username": profile.username});
    })
    .then(numFollowings => {
      profile.numFollowings = numFollowings;

      cb(null, profile);
    })
    .catch(err => {
      cb(err);
    });
  }
}
