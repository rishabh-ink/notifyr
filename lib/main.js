console.info("notifyr", "main", "Starting notifyr...");

var $simplePrefs  = require("sdk/simple-prefs"),
    $pageMod      = require("sdk/page-mod"),
    $self         = require("sdk/self"),
    $l10n         = require("sdk/l10n"),
    $notification = require("sdk/notifications");

$pageMod.PageMod({
  include: ("*" + $simplePrefs.prefs["preferences.website"]),

  contentScriptFile: $self.data.url("../data/element-grabber.js"),

  attachTo: "top",

  onAttach: function(worker) {
    console.log("notifyr", "main", "Attached pageMod");

    var paths = {
      mailCounts: $simplePrefs.prefs["preferences.path.mailCounts"],
      lastRefresh: $simplePrefs.prefs["preferences.path.lastRefresh"]
    };

    console.log("notifyr", "main", "Emitting getElements", paths);
    worker.port.emit("notifyr.dom.getElements", paths);

    worker.port.on("notifyr.dom.gotElements", function (elements) {
      console.log("notifyr", "main", "Obtained elements", elements);


    });

    worker.port.on("notifyr.error", function () {
      // TODO Show error notification.
    });
  }
});

/**
 * Parses a mail count like "3/80" into unread = 3 and total = 80.
 */
function parseMailCounts(el) {
  try {
    console.log("notifyr", "main", "parseMailCounts", "Splitting el", el);
    var counts = el.innerHTML.split("/");

    console.log("notifyr", "main", "parseMailCounts", "Assigning counts", counts);
    var mailCounts = {
      unreadMail: parseInt(counts[0], 10),
      total: parseInt(counts[1], 10)
    };

    console.log("notifyr", "main", "parseMailCounts", "Assigned counts", mailCounts);
  } catch(e) {
    $notification.notify({
      title: $l10n("errors.parse.title"),
      text: $l10n("errors.parse.text"),
      data: e.message
    });
  }
};

/**
 * Parses a last refresh date like "Mon, 12:50 am" into a `Date` object.
 */
function parseLastRefresh(el) {
  try {
    console.log("notifyr", "main", "parseLastRefresh", "Reading element", el);
    var dateString = el.innerHTML;

    console.log("notifyr", "main", "parseLastRefresh", "Creating a date object from text", dateString);

  } catch(e) {
    $notification.notify({
      title: $l10n("errors.parse.title"),
      text: $l10n("errors.parse.text"),
      data: e.message
    });
  }
};
