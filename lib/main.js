var $simplePrefs = require("sdk/simple-prefs"),
    $pageMod     = require("sdk/page-mod"),
    $self        = require("sdk/self");

console.info("notifyr", "main", "Starting notifyr...");

$pageMod.PageMod({
  include: ("*" + $simplePrefs.prefs["preferences.website"]),

  contentScriptFile: $self.data.url("../data/dom/dom.js"),

  attachTo: "top",

  onAttach: function(worker) {
    console.log("notifyr", "main", "Attached pageMod");

    var paths = {
      mailCounts: $simplePrefs.prefs["preferences.path.mailCounts"],
      lastRefresh: $simplePrefs.prefs["preferences.path.lastRefresh"]
    };

    console.log("notifyr", "main", "Emitting getElements", paths);
    worker.port.emit("getElements", paths);

    worker.port.on("gotElements", function (elements) {
      console.log("notifyr", "main", "Obtained elements", elements);
    });

    worker.port.on("error", function () {
      // TODO Show error notification.
    });
  }
});
