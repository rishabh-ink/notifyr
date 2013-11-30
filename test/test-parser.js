var $simplePrefs = require("sdk/simple-prefs");

exports["test parser parseMailCounts"] = function(assert) {
  var testData = {
    sample1: { given: "3/20",    expected: { unread: 3, total: 20 } },
    sample2: { given: "0/4",     expected: { unread: 0, total: 4  } },
    sample3: { given: "/6",      expected: { unread: 0, total: 6  } },
    sample4: { given: "2/",      expected: { unread: 2, total: 0  } },
    sample5: { given: "/",       expected: { unread: 0, total: 0  } },
    sample6: { given: "",        expected: { unread: 0, total: 0  } },
    sample7: { given: null,      expected: { unread: 0, total: 0  } },
    sample8: { given: undefined, expected: { unread: 0, total: 0  } },
    sample9: { given: 23         expected: { unread: 0, total: 0  } },
  };


};
