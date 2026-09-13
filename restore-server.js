// Migrate only the obsolete endpoint from the uploaded build.
(function () {
  "use strict";
  try {
    var old = localStorage.getItem("senpaio:server");
    if (/^(?:wss?:\/\/)?eu\.mi\.com:2001\/?$/.test(old || "")) {
      localStorage.setItem("senpaio:server", "eu.senpa.io:2001");
    }
  } catch (_) {}
})();
