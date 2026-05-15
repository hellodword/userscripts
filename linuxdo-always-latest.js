// ==UserScript==
// @name         Linux.do always latest
// @namespace   https://github.com/hellodword/userscripts
// @author      hellodword
// @match        https://linux.do/*
// @version      0.1.2
// @run-at       document-start
// @grant        none
// @downloadURL https://github.com/hellodword/userscripts/raw/refs/heads/master/linuxdo-always-latest.js
// ==/UserScript==

(function () {
  "use strict";

  const LINK_SELECTOR =
    'a[href="/"], a[href^="/c/"], a[href^="/tag/"], a[href^="/u/"]';
  const USER_ACTIVITY_PATH_RE = /^\/u\/[^/]+\/activity(?:\/|$)/;

  const TARGET_PARAMS = {
    ascending: "false",
    order: "created",
  };

  function isTargetPath(pathname) {
    return (
      pathname === "/" ||
      pathname.startsWith("/c/") ||
      pathname.startsWith("/tag/") ||
      USER_ACTIVITY_PATH_RE.test(pathname)
    );
  }

  function addParams(url) {
    const u = new URL(url, location.origin);

    u.searchParams.set("ascending", TARGET_PARAMS.ascending);
    u.searchParams.set("order", TARGET_PARAMS.order);

    return u;
  }

  function normalizeTargetUrl(url) {
    if (url == null) return url;

    try {
      const target = addParams(url);
      return isTargetPath(target.pathname)
        ? `${target.pathname}${target.search}${target.hash}`
        : url;
    } catch {
      return url;
    }
  }

  function isTargetHref(href) {
    if (!href) return false;

    try {
      return isTargetPath(new URL(href, location.origin).pathname);
    } catch {
      return false;
    }
  }

  function isUserActivityHref(href) {
    if (!href) return false;

    try {
      return USER_ACTIVITY_PATH_RE.test(new URL(href, location.origin).pathname);
    } catch {
      return false;
    }
  }

  function isPlainLeftClick(event) {
    return (
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    );
  }

  function shouldInterceptAnchor(a) {
    if (!(a instanceof HTMLAnchorElement)) return false;

    const rawHref = a.getAttribute("href");
    if (!isTargetHref(rawHref)) return false;
    if (!isUserActivityHref(rawHref)) return false;

    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;

    return true;
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

  const originalPushState = history.pushState.bind(history);
  history.pushState = function (state, unused, url) {
    return originalPushState(state, unused, normalizeTargetUrl(url));
  };

  const originalReplaceState = history.replaceState.bind(history);
  history.replaceState = function (state, unused, url) {
    return originalReplaceState(state, unused, normalizeTargetUrl(url));
  };

  // 2. 修改页面上的 a 标签 href
  function rewriteLink(a) {
    const rawHref = a.getAttribute("href");
    if (!rawHref) return;

    if (!isTargetHref(rawHref)) return;

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

    document.addEventListener(
      "click",
      (event) => {
        if (!isPlainLeftClick(event)) return;

        const a =
          event.target instanceof Element
            ? event.target.closest("a[href]")
            : null;
        if (!shouldInterceptAnchor(a)) return;

        const target = addParams(a.getAttribute("href"));

        event.preventDefault();
        event.stopImmediatePropagation();

        if (target.href !== location.href) {
          location.assign(target.href);
        }
      },
      true
    );

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
