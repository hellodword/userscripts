// ==UserScript==
// @name        Explain xkcd: It's 'cause you're dumb.
// @description Redirect 'cause you're dumb
// @namespace   https://github.com/hellodword/userscripts
// @author      hellodword
// @match       https://xkcd.com/*
// @grant       none
// @version     0.1.0
// @run-at      document-start
// @downloadURL https://github.com/hellodword/userscripts/refs/heads/master/redirect-xkcd.user.js
// ==/UserScript==

(function () {
  const u = location.href
    .replace(/\/*$/, "")
    .replace(/xkcd\.com\/+/, "xkcd.com/");
  if (new RegExp(/^https?:\/\/xkcd\.com(\/+\d+)?$/).test(u)) {
    location.href = u.replace("xkcd.com", "www.explainxkcd.com/wiki/index.php");
  }
})();
