console.info("notifyr", "main", "Starting notifyr...");

var $simplePrefs  = require("sdk/simple-prefs"),
    $pageMod      = require("sdk/page-mod"),
    $self         = require("sdk/self"),
    $l10n         = require("sdk/l10n").get,
    $notification = require("sdk/notifications"),
    $storage      = require("sdk/simple-storage"),

    // Constants
    constants = {
      paths: {
        mailCounts: {
          unseen: "html body table tbody tr td span small",
          unseenTotal: "html body table tbody tr td span small font"
        },
        lastRefresh: "html body table tbody tr td table tbody tr td small span:last-child"
      }
    };

(function init() {
  // Initialize $storage to default values
  $storage.storage.mailCounts = {
    unread: -1,
    total: -1
  };

  $storage.storage.lastRefresh = new Date();
})();

$pageMod.PageMod({
  include: ("*" + $simplePrefs.prefs["preferences.website"]),

  contentScriptFile: [
    $self.data.url("../data/vendor/date.js"),
    $self.data.url("../data/element-grabber.js"),
    $self.data.url("../data/parser.js")
  ],

  attachTo: "frame",

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
    worker.port.emit("notifyr.dom.getElements", {
      paths: paths,
      frameName: $simplePrefs.prefs["preferences.regexp.frameName"]
    });

    worker.port.on("notifyr.dom.gotElements", function (elements) {
      console.log("notifyr", "main", "Obtained elements", JSON.stringify(elements));

      worker.port.emit("notifyr.parser.parse", {
        mailCounts: {
          rawData: elements.mailCounts,
          regexp: regexps.mailCounts
        },
        lastRefresh: {
          rawData: elements.lastRefresh
        }
      });
    });

    worker.port.on("notifyr.parser.parsed", function (current) {
      console.log("notifyr", "main", "notifyr.parser.parsed", JSON.stringify(current));

      var old = {
        mailCounts: $storage.storage.mailCounts,
        lastRefresh: $storage.storage.lastRefresh
      };
      console.log("notifyr", "main", "notifyr.parser.parsed", "Old stored values", JSON.stringify(old));

      var bShowNotif = false;

      if(current.mailCounts.unread > 0) {
        if(current.mailCounts.total === old.mailCounts.total) {
          if(current.mailCounts.unread !== old.mailCounts.unread) {
            bShowNotif = true;
          } else {
            // Do nothing
          }
        } else {
          bShowNotif = true;
        }
      }

      console.log("notifyr", "main", "notifyr.parser.parsed", "Notifying...", bShowNotif);
      if(true === bShowNotif) {
        $notification.notify({
          title: $l10n("notification.title", current.mailCounts.unread),
          text: $l10n("notification.text.unread", current.mailCounts.unread) + "\n" + $l10n("notification.text.total", current.mailCounts.total),
          iconURL: $self.data.url("images/email.png")
        });
      } else {
        // You don't have mail! :(
      }

      $storage.storage.mailCounts = current.mailCounts;
      $storage.storage.lastRefresh = current.lastRefresh;
    });

    worker.port.on("notifyr.error", function (e) {
      console.error("Oops!", e);
    });
  }
});
