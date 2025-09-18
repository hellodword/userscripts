// ==UserScript==
// @name         fucking google search
// @namespace    https://github.com/hellodword/userscripts
// @version      0.1.0
// @description  fucking google search
// @author       hellodword
// @match        https://www.google.com/search*
// @grant        none
// @run-at       document-start
// @downloadURL https://github.com/hellodword/userscripts/refs/heads/master/google-search-copylink.user.js
// ==/UserScript==

// https://support.mozilla.org/en-US/questions/1177232
(function () {
  "use strict";

  setInterval(
    () =>
      [...document.querySelectorAll("a[data-sb]")].map((e) => {
        delete e.dataset["sb"];
      }),
    100
  );
})();
