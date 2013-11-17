var $simplePrefs = require("sdk/simple-prefs"),
    $pageMod     = require("sdk/page-mod"),
    $self        = require("sdk/self");

$pageMod({
  include: $simplePrefs.prefs["preferences.website"],
  contentScriptFile: $self.data.url("data/dom/dom.js")
});
