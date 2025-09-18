// ==UserScript==
// @name         Redirect NixOS manual
// @namespace    https://github.com/hellodword/userscripts
// @version      25.11
// @description  Redirect NixOS manual
// @author       hellodword
// @match        https://github.com/NixOS/nixpkgs/blob/release-25.11/*
// @grant        none
// @run-at       document-start
// @downloadURL https://github.com/hellodword/userscripts/refs/heads/master/redirect-nixos-manual.user.js
// ==/UserScript==

location.href = location.href
  .replace("/release-25.11/", "/nixos-unstable/")
  .replace("/nixos/modules/nixos/modules/", "/nixos/modules/");
