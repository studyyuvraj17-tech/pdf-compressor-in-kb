(function () {
  "use strict";
  var KEY = "pdfcompressinkb-privacy-choice-v1";
  var GA_ID = "G-V5LJE3Q2B4";
  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  var lang = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  var words = {
    en: ["Privacy choices", "We use Google Analytics only if you allow it. Analytics helps us understand site usage. Your PDF is processed in your browser; analytics is separate.", "Accept analytics", "Reject analytics", "Manage preferences", "Save choices", "Analytics", "Allow anonymous usage measurement", "Privacy policy", "Privacy settings", "Close"],
    es: ["Opciones de privacidad", "Solo usamos Google Analytics si lo permites. Nos ayuda a entender el uso del sitio. Tu PDF se procesa en tu navegador; las analíticas son independientes.", "Aceptar analíticas", "Rechazar analíticas", "Gestionar preferencias", "Guardar opciones", "Analíticas", "Permitir medición de uso", "Política de privacidad", "Configuración de privacidad", "Cerrar"],
    fr: ["Choix de confidentialité", "Google Analytics ne sera utilisé qu'avec votre accord. Il nous aide à comprendre l'utilisation du site. Votre PDF est traité dans votre navigateur ; les statistiques sont séparées.", "Accepter les statistiques", "Refuser les statistiques", "Gérer les préférences", "Enregistrer", "Statistiques", "Autoriser la mesure d'utilisation", "Politique de confidentialité", "Paramètres de confidentialité", "Fermer"],
    de: ["Datenschutzeinstellungen", "Google Analytics wird nur mit Ihrer Zustimmung verwendet. Es hilft uns, die Nutzung der Website zu verstehen. Ihr PDF wird im Browser verarbeitet; Analysen sind davon getrennt.", "Analyse erlauben", "Analyse ablehnen", "Einstellungen verwalten", "Auswahl speichern", "Analyse", "Nutzungsmessung erlauben", "Datenschutzerklärung", "Datenschutzeinstellungen", "Schließen"],
    pt: ["Preferências de privacidade", "Usamos o Google Analytics somente se você permitir. Ele ajuda a entender o uso do site. Seu PDF é processado no navegador; a análise é separada.", "Aceitar análise", "Recusar análise", "Gerir preferências", "Guardar escolhas", "Análise", "Permitir medição de uso", "Política de privacidade", "Configurações de privacidade", "Fechar"],
    ja: ["プライバシー設定", "Google Analytics は許可された場合のみ使用します。PDF はブラウザー内で処理され、アクセス解析とは別です。", "解析を許可", "解析を拒否", "設定を管理", "設定を保存", "アクセス解析", "利用状況の測定を許可", "プライバシーポリシー", "プライバシー設定", "閉じる"],
    it: ["Scelte sulla privacy", "Usiamo Google Analytics solo se lo consenti. Il PDF viene elaborato nel browser; le statistiche sono separate.", "Accetta analisi", "Rifiuta analisi", "Gestisci preferenze", "Salva scelte", "Analisi", "Consenti misurazione d'uso", "Informativa sulla privacy", "Impostazioni privacy", "Chiudi"],
    ko: ["개인정보 설정", "허용한 경우에만 Google Analytics를 사용합니다. PDF는 브라우저에서 처리되며 분석은 별도로 이루어집니다.", "분석 허용", "분석 거부", "설정 관리", "선택 저장", "분석", "사용량 측정 허용", "개인정보 처리방침", "개인정보 설정", "닫기"],
    ar: ["خيارات الخصوصية", "نستخدم Google Analytics فقط إذا وافقت. تتم معالجة ملف PDF في متصفحك، والتحليلات منفصلة.", "قبول التحليلات", "رفض التحليلات", "إدارة التفضيلات", "حفظ الاختيارات", "التحليلات", "السماح بقياس الاستخدام", "سياسة الخصوصية", "إعدادات الخصوصية", "إغلاق"],
    fa: ["تنظیمات حریم خصوصی", "فقط با اجازه شما از Google Analytics استفاده می‌کنیم. فایل PDF در مرورگر شما پردازش می‌شود و تحلیل آمار جداست.", "پذیرش آمار", "رد آمار", "مدیریت تنظیمات", "ذخیره انتخاب", "آمار", "اجازه اندازه‌گیری استفاده", "سیاست حریم خصوصی", "تنظیمات حریم خصوصی", "بستن"],
    hi: ["गोपनीयता विकल्प", "Google Analytics केवल आपकी अनुमति से उपयोग होगा। आपकी PDF ब्राउज़र में प्रोसेस होती है; विश्लेषण इससे अलग है।", "एनालिटिक्स स्वीकारें", "एनालिटिक्स अस्वीकारें", "विकल्प प्रबंधित करें", "विकल्प सहेजें", "एनालिटिक्स", "उपयोग मापन की अनुमति दें", "गोपनीयता नीति", "गोपनीयता सेटिंग", "बंद करें"],
    zh: ["隐私选项", "只有在您允许时我们才会使用 Google Analytics。PDF 在浏览器中处理，分析统计与此分开。", "允许分析", "拒绝分析", "管理偏好", "保存选择", "分析统计", "允许使用情况统计", "隐私政策", "隐私设置", "关闭"]
  };
  var t = words[lang] || words.en;
  function el(tag, text) { var n = document.createElement(tag); if (text) n.textContent = text; return n; }
  function updateAnalyticsConsent(granted) {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: granted ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
  }
  function clearAnalyticsCookies() {
    var names = document.cookie ? document.cookie.split(";").map(function (part) { return part.split("=")[0].trim(); }) : [];
    names.filter(function (name) { return /^(_ga|_gid|_gat|_gac_|_gcl_)/.test(name); }).forEach(function (name) {
      document.cookie = name + "=; Max-Age=0; path=/; SameSite=Lax";
      document.cookie = name + "=; Max-Age=0; path=/; domain=" + location.hostname + "; SameSite=Lax";
      if (location.hostname.indexOf(".") !== -1) document.cookie = name + "=; Max-Age=0; path=/; domain=." + location.hostname.split(".").slice(-2).join(".") + "; SameSite=Lax";
    });
  }
  function loadAnalytics() {
    if (window.__pdfkbAnalyticsLoaded) { updateAnalyticsConsent(true); return; }
    window.__pdfkbAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted"
    });
    updateAnalyticsConsent(true);
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    s.onerror = function () { window.__pdfkbAnalyticsLoaded = false; };
    document.head.appendChild(s);
  }
  function save(value) {
    choice = value;
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === "accepted") loadAnalytics();
    else {
      updateAnalyticsConsent(false);
      clearAnalyticsCookies();
    }
    renderSettingsButton();
    removeBanner();
  }
  var banner, settingsButton;
  function removeBanner() { if (banner) { banner.remove(); banner = null; } }
  function renderSettingsButton() {
    if (!settingsButton) {
      settingsButton = el("button", t[9]);
      settingsButton.type = "button";
      settingsButton.className = "pdfkb-privacy-settings";
      settingsButton.addEventListener("click", showBanner);
      document.body.appendChild(settingsButton);
    }
    settingsButton.hidden = !choice;
  }
  function showBanner() {
    removeBanner();
    banner = el("section");
    banner.className = "pdfkb-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-labelledby", "pdfkb-consent-title");
    var heading = el("h2", t[0]); heading.id = "pdfkb-consent-title";
    var copy = el("p", t[1]);
    var policy = el("a", t[8]); policy.href = "/privacy-policy/"; policy.className = "pdfkb-policy";
    var actions = el("div"); actions.className = "pdfkb-consent-actions";
    var reject = el("button", t[3]); reject.type = "button"; reject.className = "pdfkb-secondary"; reject.addEventListener("click", function () { save("rejected"); });
    var manage = el("button", t[4]); manage.type = "button"; manage.className = "pdfkb-manage-link";
    var accept = el("button", t[2]); accept.type = "button"; accept.className = "pdfkb-primary"; accept.addEventListener("click", function () { save("accepted"); });
    var prefs = el("div"); prefs.className = "pdfkb-prefs"; prefs.hidden = true;
    var label = el("label"); var checkbox = el("input"); checkbox.type = "checkbox"; checkbox.checked = choice === "accepted";
    var labelText = el("span", t[7]); label.append(checkbox, labelText);
    var saveButton = el("button", t[5]); saveButton.type = "button"; saveButton.className = "pdfkb-primary"; saveButton.addEventListener("click", function () { save(checkbox.checked ? "accepted" : "rejected"); });
    prefs.append(label, saveButton);
    manage.addEventListener("click", function () { prefs.hidden = !prefs.hidden; manage.setAttribute("aria-expanded", String(!prefs.hidden)); if (!prefs.hidden) checkbox.focus(); });
    actions.append(reject, accept);
    banner.append(heading, copy, policy, actions, manage, prefs);
    document.body.appendChild(banner);
  }
  function installStyles() {
    var style = el("style");
    style.textContent = ".pdfkb-consent{box-sizing:border-box;position:fixed;z-index:2147483000;left:0;right:0;bottom:0;width:100%;max-width:none;margin:0;padding:10px max(16px,env(safe-area-inset-left)) calc(10px + env(safe-area-inset-bottom));background:#fff;color:#172033;border:0;border-top:1px solid #d7deea;border-radius:0;box-shadow:0 -4px 18px rgba(0,0,0,.10);font:13px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;text-align:left}.pdfkb-consent h2{margin:0 0 2px;font-size:14px;line-height:1.3;color:#172033}.pdfkb-consent p{display:inline;margin:0 8px 0 0;color:#48556b}.pdfkb-consent a{display:inline-block;color:#204eaf;text-decoration:underline;margin:0 10px 0 0;white-space:nowrap}.pdfkb-consent-actions,.pdfkb-prefs{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.pdfkb-consent-actions{margin-top:7px}.pdfkb-consent button,.pdfkb-prefs button{min-height:32px;padding:6px 10px;border-radius:7px;border:1px solid #ccd5e3;font:600 12px/1.2 system-ui;cursor:pointer}.pdfkb-consent .pdfkb-primary{background:#2457c5;border-color:#2457c5;color:white}.pdfkb-consent .pdfkb-secondary{background:white;color:#24324a}.pdfkb-consent .pdfkb-manage-link{min-height:0;padding:4px 0;border:0;background:transparent;color:#2457c5;text-decoration:underline;font:500 12px/1.3 system-ui;box-shadow:none}.pdfkb-consent .pdfkb-manage-link:hover{background:transparent}.pdfkb-prefs[hidden]{display:none!important}.pdfkb-prefs{margin-top:8px;padding-top:8px;border-top:1px solid #e1e6ef;justify-content:space-between;gap:8px}.pdfkb-prefs label{display:flex;align-items:center;gap:7px;font-size:12px}.pdfkb-prefs input{margin:0}.pdfkb-privacy-settings{position:fixed;z-index:2147482000;left:12px;bottom:12px;min-height:30px;padding:5px 8px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:#24324a;font:11px system-ui;box-shadow:0 2px 10px #0002;cursor:pointer}.pdfkb-privacy-settings[hidden]{display:none!important}.pdfkb-consent button:focus-visible,.pdfkb-privacy-settings:focus-visible{outline:3px solid #2457c5;outline-offset:2px}@media(min-width:700px){.pdfkb-consent{display:flex;align-items:center;gap:14px;padding-left:24px;padding-right:24px}.pdfkb-consent>h2{flex:0 0 auto;margin:0}.pdfkb-consent>p{flex:1 1 auto}.pdfkb-consent>.pdfkb-policy{flex:0 0 auto;margin:0}.pdfkb-consent-actions{flex:0 0 auto;margin:0}}@media(max-width:699px){.pdfkb-consent{padding:10px 12px calc(10px + env(safe-area-inset-bottom))}.pdfkb-consent p{display:block;margin:0 0 4px}.pdfkb-consent h2{font-size:14px}.pdfkb-consent-actions{gap:5px}.pdfkb-consent-actions>*{flex:1 1 auto}.pdfkb-consent button,.pdfkb-prefs button{min-height:32px;padding:6px 8px;font-size:11px}}";
    document.head.appendChild(style);
  }
  function start() {
    var siteDesign = document.createElement("link");
    siteDesign.rel = "stylesheet";
    siteDesign.href = "/assets/site-system.css?v=1";
    document.head.appendChild(siteDesign);
    installStyles();
    if (choice === "accepted") loadAnalytics();
    renderSettingsButton();
    if (!choice) showBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();