// Google Analytics for every page on yanxia.art (homepage, /travels/, /yanxia/).
// Load with <script src="/analytics.js" defer></script>.
//
// - Ads storage is always denied; analytics only.
// - Visitors in Europe (by time zone) are asked first; everyone else is counted by default.
// - Hash routes (e.g. /travels/#japan-2024/12.08) are reported as their own pages.
(function () {
  var ID = "G-P2JV81PJ3R";  // Google Analytics measurement ID
  if (/X{4}/.test(ID) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return;

  var KEY = "analytics-consent";  // "granted" | "denied", shared across the site
  var tz = "";
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var askFirst = /^(Europe|Atlantic\/(Reykjavik|Canary|Madeira|Azores))\//.test(tz);
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  var granted = choice ? choice === "granted" : !askFirst;
  gtag("consent", "default", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
  gtag("js", new Date());
  gtag("config", ID, { send_page_view: false });

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + ID;
  document.head.appendChild(s);

  function pageView() {
    var hash = location.hash.replace(/^#\/?/, "");
    var path = location.pathname + (hash ? (location.pathname.slice(-1) === "/" ? "" : "/") + hash : "");
    gtag("event", "page_view", {
      page_location: location.origin + path + location.search,
      page_path: path,
      page_title: document.title,
    });
  }
  // let the page set its title first
  setTimeout(pageView, 0);
  addEventListener("hashchange", function () { setTimeout(pageView, 0); });

  if (askFirst && !choice) banner();

  function banner() {
    var zh = /^zh\b/i.test(document.documentElement.lang || navigator.language || "");
    var b = document.createElement("div");
    b.setAttribute("role", "region");
    b.setAttribute("aria-label", zh ? "统计许可" : "Analytics consent");
    b.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:50;max-width:560px;margin:0 auto;" +
      "background:#1E2B38;color:#EEF0EB;border-radius:10px;padding:14px 16px;font:14px/1.5 system-ui,sans-serif;" +
      "box-shadow:0 8px 24px rgba(0,0,0,.25);display:flex;gap:12px;align-items:center;flex-wrap:wrap";
    var t = document.createElement("span");
    t.style.flex = "1 1 240px";
    t.textContent = zh ? "可以用 Google Analytics 匿名统计访问量吗？不用于广告。"
                       : "May this site count visits with Google Analytics? No advertising.";
    b.appendChild(t);
    [["granted", zh ? "同意" : "Allow"], ["denied", zh ? "不用了" : "No thanks"]].forEach(function (o, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = o[1];
      btn.style.cssText = "font:inherit;border-radius:999px;padding:5px 14px;cursor:pointer;border:1px solid #EEF0EB;" +
        (i ? "background:transparent;color:#EEF0EB" : "background:#EEF0EB;color:#1E2B38");
      btn.onclick = function () {
        try { localStorage.setItem(KEY, o[0]); } catch (e) {}
        gtag("consent", "update", { analytics_storage: o[0] });
        b.remove();
      };
      b.appendChild(btn);
    });
    (document.body || document.documentElement).appendChild(b);
  }
})();
