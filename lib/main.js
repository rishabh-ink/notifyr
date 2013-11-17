var $simplePrefs = require("sdk/simple-prefs"),
    $pageMod     = require("sdk/page-mod"),
    $data        = require("sdk/self").data;

var globals = {
  counter: 0
};

console.info("notifyr", "main", "Starting notifyr...");

$pageMod.PageMod({
  include: ("*" + $simplePrefs.prefs["preferences.website"]),
  contentScriptFile: $data.url("data/dom/dom.js"),
  contentScriptOptions: {
    mailCounts: $simplePrefs.prefs["preferences.path.mailCounts"],
    lastRefresh: $simplePrefs.prefs["preferences.path.lastRefresh"]
  },
  attachTo: "top",
  onAttach: function(worker) {
    console.log("notifyr", "main", "Attached pageMod", globals.counter++);

    worker.port.emit("getElements");

    worker.port.on("gotElements", function (elements) {
      console.log("notifyr", "main", "Obtained elements", elements);
    });

    worker.port.on("error", function () {
      // TODO Show error notification.
    });
  }
});
