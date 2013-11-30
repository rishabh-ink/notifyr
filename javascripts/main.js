;(function () {
    "use strict";

    var events = {
        download: function(e) {
            woopra.track("download", {});
        },

        viewSource: function (e) {
            woopra.track("viewSource", {});
        }
    };

    $(".download").on("click", events.download);
    $(".view-source").on("click", events.viewSource);
})();
