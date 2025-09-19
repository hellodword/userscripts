// ==UserScript==
// @name         Redirect V2ex to www
// @namespace    https://github.com/hellodword/userscripts
// @version      0.1.0
// @description  Redirect V2ex to www
// @author       hellodword
// @match        https://*.v2ex.com/*
// @grant        none
// @run-at       document-start
// @downloadURL  https://github.com/hellodword/userscripts/raw/refs/heads/master/redirect-v2ex.user.js
// ==/UserScript==

(function () {
  "use strict";

  const u = new URL(location.href);
  console.log(u);
  if (u.hostname != "www.v2ex.com") {
    u.hostname = "www.v2ex.com";
    location.href = u.toString();
  }
})();
