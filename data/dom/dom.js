self.port.on("getElements", function() {
  try {
    console.warn("notifyr", "Finding elements");
    var elements = {
      mailCounts: window.frames[0].document.querySelector(self.options.mailCounts),
      lastRefresh: window.frames[0].document.querySelector(self.options.lastRefresh)
    };

    console.warn("notifyr", "Testing elements");
    if(null === elements.mailCounts || null === elements.lastRefresh) {
      console.warn("notifyr", "One or more elements not found", elements);
    } else {
      console.info("notifyr", "Obtained elements", elements);
      self.port.emit("gotElements", elements);
    }
  } catch(e) {
    console.warn("notifyr", "Error obtaining elements", elements);
    self.port.emit("error");
  }
};
