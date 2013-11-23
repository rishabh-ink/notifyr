console.info("notifyr", "main", "Starting notifyr...");

var $simplePrefs  = require("sdk/simple-prefs"),
    $pageMod      = require("sdk/page-mod"),
    $self         = require("sdk/self"),
    $l10n         = require("sdk/l10n").get,
    $notification = require("sdk/notifications"),
    $storage      = require("sdk/simple-storage");

$pageMod.PageMod({
  include: ("*" + $simplePrefs.prefs["preferences.website"]),

  contentScriptFile: [
    $self.data.url("../data/vendor/date.js"),
    $self.data.url("../data/element-grabber.js"),
    $self.data.url("../data/parser.js")
  ],

  attachTo: "top",

  onAttach: function(worker) {
    console.log("notifyr", "main", "Attached pageMod");

    var paths = {
      mailCounts: $simplePrefs.prefs["preferences.path.mailCounts"],
      lastRefresh: $simplePrefs.prefs["preferences.path.lastRefresh"]
    };

    var regexps = {
      mailCounts: $simplePrefs.prefs["preferences.regexp.mailCounts"]
    };

    console.log("notifyr", "main", "Emitting getElements", JSON.stringify(paths));
    worker.port.emit("notifyr.dom.getElements", paths);

    worker.port.on("notifyr.dom.gotElements", function (elements) {
      console.log("notifyr", "main", "Obtained elements", JSON.stringify(elements));

      worker.port.emit("notifyr.parser.parse", {
        mailCounts: {
          rawData: elements.mailCounts,
          regexp: regexps.mailCounts
        }, {
        lastRefresh: {
          rawData: elements.lastRefresh
        }
      });
    });

    worker.port.on("notifyr.parser.parsed", function (parsed) {
      console.log("notifyr", "main", "parsed", JSON.stringify(parsed));

      var old = {
        mailCounts: $storage.storage.mailCounts,
        lastRefresh: $storage.storage.lastRefresh
      };

      // TODO Compare old and parsed.

      $storage.storage.mailCounts = parsed.mailCounts;
      $storage.storage.lastRefresh = parsed.lastRefresh;
    });

    worker.port.on("notifyr.error", function (e) {
      $notification.notify({
        title: $l10n("error.title"),
        text: "Message: " + e.message
      });
    });
  }
});
