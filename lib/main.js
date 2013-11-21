console.info("notifyr", "main", "Starting notifyr...");

var $simplePrefs  = require("sdk/simple-prefs"),
    $pageMod      = require("sdk/page-mod"),
    $self         = require("sdk/self"),
    $l10n         = require("sdk/l10n").get,
    $notification = require("sdk/notifications");

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

    console.log("notifyr", "main", "Emitting getElements", JSON.stringify(paths));
    worker.port.emit("notifyr.dom.getElements", paths);

    worker.port.on("notifyr.dom.gotElements", function (elements) {
      console.log("notifyr", "main", "Obtained elements", JSON.stringify(elements));

      worker.port.emit("notifyr.parser.parseMailCounts", elements.mailCounts.innerHTML);
      worker.port.emit("notifyr.parser.parseLastRefresh", elements.lastRefresh.innerHTML);
    });

    worker.port.on("notifyr.parser.parsedMailCounts", function (mailCounts) {
      console.log("notifyr", "main", "parsedMailCounts", "Obtained mailCounts", JSON.stringify(mailCounts));
    });

    worker.port.on("notifyr.parser.parsedLastRefresh", function (lastRefresh) {
      console.log("notifyr", "main", "parsedLastRefresh", "Obtained lastRefresh", JSON.stringify(lastRefresh));
    });

    worker.port.on("notifyr.error", function (e) {
      $notification.notify({
        title: $l10n("error.title"),
        text: "Message: " + e.message
      });
    });
  }
});
