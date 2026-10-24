// 四路报告交互：同刻四格切换 + 四路视频同步。
// 与 u22-refiner 报告的 report.js 同范式，但这里是 2x2 四格（不是左右两格）。
(function () {
  // ── 同刻四格切换 ──
  document.querySelectorAll(".quadwrap").forEach(function (w) {
    var img = w.querySelector("img");
    var base = img.getAttribute("data-base") || "";
    var btns = w.querySelectorAll(".qbar button[data-t]");
    var cur = w.querySelector(".cur");
    function mark(b) {
      btns.forEach(function (o) { o.classList.remove("on"); });
      b.classList.add("on");
    }
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        img.src = base + btn.getAttribute("data-t") + ".jpg";
        if (cur) cur.textContent = "t=" + btn.getAttribute("data-t") + "s";
        mark(btn);
      });
    });
    if (btns.length) mark(btns[0]);
  });

  // ── 四路视频同步 ──
  var box = document.querySelector(".vgrid[data-quad]");
  if (box) {
    var vs = Array.prototype.slice.call(box.querySelectorAll("video"));
    var syncing = false;
    function link(s, d) {
      s.addEventListener("play", function () {
        if (syncing) return; syncing = true;
        if (Math.abs(d.currentTime - s.currentTime) > 0.08) d.currentTime = s.currentTime;
        d.play(); syncing = false;
      });
      s.addEventListener("pause", function () { if (!syncing) d.pause(); });
      s.addEventListener("seeked", function () {
        if (syncing) return; syncing = true; d.currentTime = s.currentTime; syncing = false;
      });
    }
    vs.forEach(function (a) {
      vs.forEach(function (b) { if (a !== b) link(a, b); });
    });
    var p = document.querySelector("[data-quadplay]");
    var q = document.querySelector("[data-quadpause]");
    if (p) p.addEventListener("click", function () {
      vs.forEach(function (v) { v.currentTime = 0; v.play(); });
    });
    if (q) q.addEventListener("click", function () {
      vs.forEach(function (v) { v.pause(); });
    });
  }
})();
