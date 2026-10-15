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
  function loadAnalytics() {
    if (window.__pdfkbAnalyticsLoaded) return;
    window.__pdfkbAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "granted",
      security_storage: "granted"
    });
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
    var manage = el("button", t[4]); manage.type = "button"; manage.className = "pdfkb-secondary";
    var accept = el("button", t[2]); accept.type = "button"; accept.className = "pdfkb-primary"; accept.addEventListener("click", function () { save("accepted"); });
    var prefs = el("div"); prefs.className = "pdfkb-prefs"; prefs.hidden = true;
    var label = el("label"); var checkbox = el("input"); checkbox.type = "checkbox"; checkbox.checked = choice === "accepted";
    var labelText = el("span", t[7]); label.append(checkbox, labelText);
    var saveButton = el("button", t[5]); saveButton.type = "button"; saveButton.className = "pdfkb-primary"; saveButton.addEventListener("click", function () { save(checkbox.checked ? "accepted" : "rejected"); });
    prefs.append(label, saveButton);
    manage.addEventListener("click", function () { prefs.hidden = !prefs.hidden; manage.setAttribute("aria-expanded", String(!prefs.hidden)); if (!prefs.hidden) checkbox.focus(); });
    actions.append(reject, manage, accept);
    banner.append(heading, copy, policy, actions, prefs);
    document.body.appendChild(banner);
    reject.focus({ preventScroll: true });
  }
  function installStyles() {
    var style = el("style");
    style.textContent = ".pdfkb-consent{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:680px;margin:auto;padding:20px;background:#fff;color:#172033;border:1px solid #d7deea;border-radius:16px;box-shadow:0 12px 48px rgba(0,0,0,.24);font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;text-align:left}.pdfkb-consent h2{margin:0 0 8px;font-size:19px;color:#172033}.pdfkb-consent p{margin:0 0 8px;color:#48556b}.pdfkb-consent a{display:inline-block;color:#204eaf;text-decoration:underline;margin-bottom:12px}.pdfkb-consent-actions,.pdfkb-prefs{display:flex;gap:8px;flex-wrap:wrap}.pdfkb-consent button,.pdfkb-prefs button{min-height:42px;padding:9px 13px;border-radius:9px;border:1px solid #ccd5e3;font:600 13px system-ui;cursor:pointer}.pdfkb-consent .pdfkb-primary{background:#2457c5;border-color:#2457c5;color:white}.pdfkb-consent .pdfkb-secondary{background:white;color:#24324a}.pdfkb-prefs{margin-top:14px;padding-top:14px;border-top:1px solid #e1e6ef;align-items:center;justify-content:space-between}.pdfkb-prefs label{display:flex;align-items:center;gap:8px}.pdfkb-privacy-settings{position:fixed;z-index:2147482000;left:12px;bottom:12px;min-height:36px;padding:7px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#24324a;font:12px system-ui;box-shadow:0 2px 10px #0002;cursor:pointer}.pdfkb-privacy-settings[hidden]{display:none!important}.pdfkb-consent button:focus-visible,.pdfkb-privacy-settings:focus-visible{outline:3px solid #2457c5;outline-offset:2px}@media(max-width:520px){.pdfkb-consent{left:8px;right:8px;bottom:8px;padding:16px}.pdfkb-consent-actions>*{flex:1 1 42%}.pdfkb-consent-actions .pdfkb-primary{flex-basis:100%}}";
    document.head.appendChild(style);
  }
  function start() {
    installStyles();
    if (choice === "accepted") loadAnalytics();
    renderSettingsButton();
    if (!choice) showBanner();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();