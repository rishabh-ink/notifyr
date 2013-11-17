var $simplePrefs = require("sdk/simple-prefs");

/**
 * Tests `preferences.website` from `package.json`.
 */
exports["test Notifyr.jetpack.simplePrefs preferences.website"] = function(assert) {
  var expected = "mail.accord-soft.com";
  var actual = $simplePrefs.prefs["preferences.website"];

  assert.ok(expected === actual);
};

require("sdk/test").run(exports);
