console.log("notifyr", "dom", "dom.js");

self.port.on("getElements", function(paths) {
  try {
    console.warn("notifyr", "Finding elements");
    var elements = {
      mailCounts: window.frames[0].document.querySelector(paths.mailCounts),
      lastRefresh: window.frames[0].document.querySelector(paths.lastRefresh)
    };

    console.warn("notifyr", "Testing elements");
    if(null === elements.mailCounts || null === elements.lastRefresh) {
      console.warn("notifyr", "One or more elements not found", elements);
    } else {
      console.info("notifyr", "Obtained elements", elements);
      self.port.emit("gotElements", elements);
    }
  } catch(e) {
    console.warn("notifyr", "Error obtaining elements", paths);
    self.port.emit("error");
  }
});
