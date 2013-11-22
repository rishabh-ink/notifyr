self.port.on("notifyr.dom.getElements", function(paths) {
  try {
    console.warn("notifyr", "Finding elements", JSON.stringify(paths));

    var elements = {
      mailCounts: window.frames[0].document.querySelector(paths.mailCounts).innerHTML,
      lastRefresh: window.frames[0].document.querySelector(paths.lastRefresh).innerHTML
    };

    console.warn("notifyr", "Testing elements");
    if(null === elements.mailCounts || null === elements.lastRefresh) {
      console.warn("notifyr", "One or more elements not found", JSON.stringify(elements));
    } else {
      console.info("notifyr", "Emitting elements", JSON.stringify(elements));
      self.port.emit("notifyr.dom.gotElements", elements);
    }
  } catch(e) {
    console.warn("notifyr", "Error obtaining elements", JSON.stringify(paths));
    self.port.emit("notifyr.error", e);
  }
});
