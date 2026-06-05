/* WatchList — basit TR/EN dil gecisi.
   Iki mekanizmayi da destekler:
   1) Sozluk: window.I18N varsa, [data-i18n] / [data-i18n-ph] elemanlari doldurulur.
   2) Blok: [data-lang="tr"|"en"] elemanlari gosterilir/gizlenir (uzun yasal metin).
   Secim localStorage'da (wl_lang) saklanir; ilk girişte tarayici dili 'en' ise
   İngilizce, aksi halde Türkçe varsayilir. */
(function () {
  var SUPPORTED = ["tr", "en"];

  function detect() {
    try {
      var saved = localStorage.getItem("wl_lang");
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || "tr").slice(0, 2).toLowerCase();
    return nav === "en" ? "en" : "tr"; // varsayilan: Türkçe
  }

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = "tr";
    try { localStorage.setItem("wl_lang", lang); } catch (e) {}
    document.documentElement.lang = lang;

    // 1) Sozluk tabanli metinler
    if (window.I18N) {
      var dict = window.I18N[lang] || {};
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var k = el.getAttribute("data-i18n");
        if (dict[k] == null) return;
        if (el.hasAttribute("data-i18n-html")) el.innerHTML = dict[k];
        else el.textContent = dict[k];
      });
      document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
        var k = el.getAttribute("data-i18n-ph");
        if (dict[k] != null) el.setAttribute("placeholder", dict[k]);
      });
    }

    // 2) Blok gosterimi (yasal sayfalar)
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.style.display = el.getAttribute("data-lang") === lang ? "" : "none";
    });

    // Dil butonlari aktif durumu (+ erisilebilirlik)
    document.querySelectorAll("[data-setlang]").forEach(function (b) {
      var on = b.getAttribute("data-setlang") === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  window.setLang = apply;

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-setlang]").forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-setlang"));
      });
    });
    apply(detect());
  });
})();
