self.port.on("notifyr.dom.getElements", function(toGet) {
  try {
    var currentFrame = window.location.href;
    console.warn("notifyr", "Checking if we are in the right frame", currentFrame);
    if(-1 === currentFrame.indexOf(toGet.frameName)) {
      console.warn("notifyr", "Wrong frame, returning...");
      return;
    }

    console.log("notifyr", "Finding elements", JSON.stringify(toGet.paths));

    var elements = {
      mailCounts: document.querySelector(toGet.paths.mailCounts).innerHTML,
      lastRefresh: document.querySelector(toGet.paths.lastRefresh).innerHTML
    };

    console.warn("notifyr", "Testing elements");
    if(null === elements.mailCounts || null === elements.lastRefresh) {
      console.warn("notifyr", "One or more elements not found", JSON.stringify(elements));
    } else {
      console.info("notifyr", "Emitting elements", JSON.stringify(elements));
      self.port.emit("notifyr.dom.gotElements", elements);
    }
  } catch(e) {
    console.error("notifyr", "Error obtaining elements", JSON.stringify(toGet.paths));
    self.port.emit("notifyr.error", e);
  }
});
