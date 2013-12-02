function parseMailCounts(rawMailCounts, regexpMailCounts) {
  console.log("notifyr", "main", "parseMailCounts", rawMailCounts);

  console.log("notifyr", "main", "parseMailCounts", "Building regexp object using", regexpMailCounts);
  var re = new RegExp(regexpMailCounts, "g");

  console.log("notifyr", "main", "parseMailCounts", "Parsing using", re.source);
  var counts = rawMailCounts.match(re);

  console.log("notifyr", "main", "parseMailCounts", "Assigning counts", JSON.stringify(counts));
  var mailCounts = {
    unread: parseInt(counts[0], 10) || -1, // If parsing fails,
    total: parseInt(counts[1], 10) || -1   // set to -1
  };

  console.info("notifyr", "main", "parseMailCounts", "Assigned counts", JSON.stringify(mailCounts));
  return mailCounts;
}

function parseLastRefresh(rawLastRefresh) {
  console.log("notifyr", "main", "parseLastRefresh", rawLastRefresh);

  console.log("notifyr", "main", "parseLastRefresh", "Stripping nbsp-s from", rawLastRefresh);
  rawLastRefresh = rawLastRefresh.replace(/&nbsp;/g, "");

  console.log("notifyr", "main", "parseLastRefresh", "Creating date from", rawLastRefresh);
  var lastRefresh = Date.parse(rawLastRefresh);

  console.info("notifyr", "main", "parseLastRefresh", "Created date", lastRefresh);
  return lastRefresh;
}

self.port.on("notifyr.parser.parse", function(toParse) {
  try {
    var mailCounts = parseMailCounts(toParse.mailCounts.rawData, toParse.mailCounts.regexp);
    var lastRefresh = parseLastRefresh(toParse.lastRefresh.rawData);

    self.port.emit("notifyr.parser.parsed", {
      mailCounts: mailCounts,
      lastRefresh: lastRefresh
    });
  } catch(e) {
      console.error("notifyr", "main", "parseLastRefresh", "Error parsing last refresh", e.message);
    self.port.emit("notifyr.error", e);
  }
});
