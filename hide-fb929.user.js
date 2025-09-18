// ==UserScript==
// @name         Hide Github Avatar of fb929
// @namespace    https://github.com/hellodword/userscripts
// @version      0.2.0
// @description  Hide Github Avatar of fb929 because it's horrible
// @author       hellodword
// @match        https://github.com/*
// @match        https://gist.github.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://github.com/hellodword/userscripts/refs/heads/master/hide-fb929.user.js
// ==/UserScript==

(function () {
  "use strict";

  const u = new URL(location.href);
  if (new RegExp(/^\/+fb929\/*$/).test(u.pathname)) {
    location.href = "https://www.youtube.com/watch?v=ivY8-UyegUw";
  }

  let hooked = false;
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        hideAvatars();
      }
    });
  });

  const hideAvatars = function () {
    ['img[alt="@fb929"]', 'img[alt="fb929"]', 'img[src*="u/1324020"]'].forEach(
      (q) => {
        document.querySelectorAll(q).forEach((e) => {
          e.src =
            "https://github.githubassets.com/images/gravatars/gravatar-user-420.png?size=32";
        });
      }
    );
  };

  const observeBody = function () {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      console.log("Observer attached");
    } else {
      // If body is not available, check again in 50ms
      setTimeout(observeBody, 50);
    }
  };

  observeBody();

  document.addEventListener("DOMContentLoaded", hideAvatars);
})();
