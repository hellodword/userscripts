// ==UserScript==
// @name        Expand GitHub Diffs
// @description Expand GitHub Diffs
// @namespace   https://github.com/hellodword/userscripts
// @author      hellodword
// @match       https://github.com/*
// @match       https://gist.github.com/*
// @version     0.2.1
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// @run-at      document-start
// @downloadURL https://github.com/hellodword/userscripts/raw/refs/heads/master/expand-github-diffs.user.js
// ==/UserScript==

(async function main() {
  GM.registerMenuCommand(
    "Load diffs",
    async () => {
      document.querySelectorAll("copilot-diff-entry").forEach((entry) => {
        deleted =
          entry
            .querySelector(".file-header")
            .getAttribute("data-file-deleted") === "true";

        if (deleted) return;

        onlyDeletions =
          entry.querySelectorAll(".diffstat-block-added").length === 0;

        if (onlyDeletions) return;

        entry
          .querySelectorAll(".js-button-text")
          .forEach((e) => e.innerText === "Load diff" && e.click());
      });
    },
    "t"
  );
})();
