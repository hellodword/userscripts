// ==UserScript==
// @name         Linux.do always latest
// @namespace   https://github.com/hellodword/userscripts
// @author      hellodword
// @match        https://linux.do/*
// @version      0.1.0
// @run-at       document-start
// @grant        none
// @downloadURL https://github.com/hellodword/userscripts/raw/refs/heads/master/linuxdo-always-latest.js
// ==/UserScript==

(function () {
  "use strict";

  const LINK_SELECTOR = 'a[href="/"], a[href^="/c/"], a[href^="/tag/"]';

  const TARGET_PARAMS = {
    ascending: "false",
    order: "created",
  };

  function isTargetPath(pathname) {
    return (
      pathname === "/" ||
      pathname.startsWith("/c/") ||
      pathname.startsWith("/tag/")
    );
  }

  function addParams(url) {
    const u = new URL(url, location.origin);

    u.searchParams.set("ascending", TARGET_PARAMS.ascending);
    u.searchParams.set("order", TARGET_PARAMS.order);

    return u;
  }

  // 1. 如果直接访问 /、/c/...、/tag/...，自动跳转到带参数版本
  function redirectIfNeeded() {
    const current = new URL(location.href);

    if (!isTargetPath(current.pathname)) return;

    const needRedirect =
      current.searchParams.get("ascending") !== TARGET_PARAMS.ascending ||
      current.searchParams.get("order") !== TARGET_PARAMS.order;

    if (!needRedirect) return;

    const target = addParams(current.href);
    location.replace(target.href);
  }

  redirectIfNeeded();

  // 2. 修改页面上的 a 标签 href
  function rewriteLink(a) {
    const rawHref = a.getAttribute("href");
    if (!rawHref) return;

    if (
      rawHref !== "/" &&
      !rawHref.startsWith("/c/") &&
      !rawHref.startsWith("/tag/")
    ) {
      return;
    }

    const u = addParams(rawHref);
    const newHref = `${u.pathname}${u.search}${u.hash}`;

    if (rawHref !== newHref) {
      a.setAttribute("href", newHref);
    }
  }

  function rewriteLinks(root = document) {
    if (
      root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_NODE
    ) {
      return;
    }

    if (root.matches?.(LINK_SELECTOR)) {
      rewriteLink(root);
    }

    root.querySelectorAll?.(LINK_SELECTOR).forEach(rewriteLink);
  }

  function startObserver() {
    rewriteLinks(document);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(rewriteLinks);
        }

        if (
          mutation.type === "attributes" &&
          mutation.target instanceof HTMLAnchorElement
        ) {
          rewriteLink(mutation.target);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });
  }

  if (document.documentElement) {
    startObserver();
  } else {
    document.addEventListener("DOMContentLoaded", startObserver, {
      once: true,
    });
  }
})();
