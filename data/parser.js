function parseMailCounts(rawMailCounts, regexpMailCounts) {
  console.log("notifyr", "main", "parseMailCounts", rawMailCounts);

  try {
    console.log("notifyr", "main", "parseMailCounts", "Building regexp object using", regexpMailCounts);
    var re = new RegExp(regexpMailCounts, "g");

    console.log("notifyr", "main", "parseMailCounts", "Parsing using", re.source);
    var counts = rawMailCounts.match(re);

    console.log("notifyr", "main", "parseMailCounts", "Assigning counts", JSON.stringify(counts));
    var mailCounts = {
      unreadMail: parseInt(counts[0], 10),
      total: parseInt(counts[1], 10)
    };

    console.log("notifyr", "main", "parseMailCounts", "Assigned counts", JSON.stringify(mailCounts));
    self.port.emit("notifyr.parser.parsedMailCounts", mailCounts);
  } catch(e) {
    console.log("notifyr", "main", "parseMailCounts", "Error parsing mail counts", e.message);
    self.port.emit("notifyr.error", e);
  }
}

function parseLastRefresh(rawLastRefresh) {
  console.log("notifyr", "main", "parseLastRefresh", rawLastRefresh);

  try {
    console.log("notifyr", "main", "parseLastRefresh", "Stripping nbsp-s from", rawLastRefresh);
    rawLastRefresh = rawLastRefresh.replace(/&nbsp;/g, "");

    console.log("notifyr", "main", "parseLastRefresh", "Creating date from", rawLastRefresh);
    var lastRefresh = Date.parse(rawLastRefresh);

    self.port.emit("notifyr.parser.parsedLastRefresh", lastRefresh);
  } catch(e) {
    console.log("notifyr", "main", "parseLastRefresh", "Error parsing last refresh", e.message);
    self.port.emit("notifyr.error", e);
  }
}

self.port.on("notifyr.parser.parseMailCounts", parseMailCounts);
self.port.on("notifyr.parser.parseLastRefresh", parseLastRefresh);
