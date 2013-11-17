var $simplePrefs = require("sdk/simple-prefs");

exports["test $simplePrefs preferences"] = function(assert) {
  var expected = {
    website: ".accord-soft.com",
    path: {
      mailCounts: "html body table tbody tr td span small font",
      lastRefresh: "html body table tbody tr td table tbody tr td small span:last-child"
    }
  };

  var actual = {
    website: $simplePrefs.prefs["preferences.website"],
    path: {
      mailCounts: $simplePrefs.prefs["preferences.path.mailCounts"],
      lastRefresh: $simplePrefs.prefs["preferences.path.lastRefresh"]
    }
  };

  assert.ok(expected.website === actual.website);
  assert.ok(expected.path.mailCounts === actual.path.mailCounts);
  assert.ok(expected.path.lastRefresh === actual.path.lastRefresh);
};

require("sdk/test").run(exports);
