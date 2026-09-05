/* BUY BUTTON // SIGNAL RUN — generated runtime. Edit src/runtime fragments, never this file. */

/* ===== 00-bootstrap.js ===== */

    (() => {
      "use strict";

      const nowMs = () => {
        const perf = window.performance;
        return perf && typeof perf.now === "function" ? perf.now() : Date.now();
      };
      const raf = typeof window.requestAnimationFrame === "function"
        ? window.requestAnimationFrame.bind(window)
        : (callback) => window.setTimeout(() => callback(nowMs()), 16);
      const deferMicrotask = typeof window.queueMicrotask === "function"
        ? window.queueMicrotask.bind(window)
        : (callback) => typeof Promise === "function" ? Promise.resolve().then(callback) : window.setTimeout(callback, 0);
      const safeMatchMedia = (query) => typeof window.matchMedia === "function" && window.matchMedia(query).matches;
      const browserNavigator = window.navigator || {};
      const hardwareConcurrency = Number(browserNavigator.hardwareConcurrency) || 0;
      const compactLandscapeViewport = (
        (window.innerWidth || 0) > (window.innerHeight || 0)
        && (window.innerWidth || 0) <= 1100
        && (window.innerHeight || 0) <= 700
      );
      // Touch devices need a little more breathing room than a desktop
      // viewport: the compact HUD leaves more of the arena visible, while
      // the opening waves ease in instead of throwing a full-speed swarm at
      // the player immediately.
      const compactDevice = safeMatchMedia("(pointer: coarse)") || (
        safeMatchMedia("(max-width: 820px)") && safeMatchMedia("(hover: none)")
      ) || (("ontouchstart" in window) && (window.innerWidth || 0) <= 900) || (
        (window.innerWidth || 0) <= 900 && (window.innerHeight || 0) <= 600
      ) || compactLandscapeViewport;
      const getKeyCode = (event) => {
        if (event && event.code) return event.code;
        const key = event && event.key;
        if (!key) return "";
        if (/^[1-7]$/.test(key)) return `Digit${key}`;
        if (/^[a-z]$/i.test(key)) return `Key${key.toUpperCase()}`;
        const aliases = {
          " ": "Space", Spacebar: "Space", Esc: "Escape",
          "+": "Equal", "=": "Equal", Add: "NumpadAdd",
          "-": "Minus", Subtract: "NumpadSubtract"
        };
        return aliases[key] || key;
      };
      const fromEntries = (entries) => {
        if (typeof Object.fromEntries === "function") return Object.fromEntries(entries);
        const result = {};
        for (const entry of entries) if (entry && entry.length >= 2) result[entry[0]] = entry[1];
        return result;
      };
      const readStorageEntries = (key) => {
        const entries = [];
        ["localStorage", "sessionStorage"].forEach((source) => {
          try {
            const storage = window[source];
            if (!storage || typeof storage.getItem !== "function") return;
            const raw = storage.getItem(key);
            if (raw !== null && raw !== "") entries.push({ source, raw });
          } catch (_) {}
        });
        return entries;
      };
      const pad2 = (value) => {
        const text = String(value);
        return text.length < 2 ? `0${text}` : text;
      };
      const canvas = document.getElementById("game");
      let ctx = null;
      if (canvas && typeof canvas.getContext === "function") {
        try { ctx = canvas.getContext("2d", { alpha: false }) || canvas.getContext("2d"); } catch (_) {
          try { ctx = canvas.getContext("2d"); } catch (_) { ctx = null; }
        }
      }
      if (!canvas || !ctx || typeof ctx.fillRect !== "function" || typeof ctx.createRadialGradient !== "function") {
        document.documentElement.classList.add("unsupported");
        const supportNotice = document.getElementById("supportNotice");
        if (supportNotice) supportNotice.classList.remove("hidden");
        return;
      }
      // Canvas throws for a negative arc radius. Visual data can briefly
      // outlive a page reload, so one stale effect must never blank the
      // entire arena. Keep the native context fast and guard only `arc`.
      const bbCanvasArcGuard = {
        skipped: 0,
        lastInvalidArc: null
      };
      try {
        const nativeCanvasArc = ctx.arc.bind(ctx);
        ctx.arc = (x, y, radius, startAngle, endAngle, counterclockwise = false) => {
          const safeX = Number(x);
          const safeY = Number(y);
          const safeRadius = Number(radius);
          const safeStart = Number(startAngle);
          const safeEnd = Number(endAngle);
          if (
            !Number.isFinite(safeX)
            || !Number.isFinite(safeY)
            || !Number.isFinite(safeRadius)
            || safeRadius < 0
            || !Number.isFinite(safeStart)
            || !Number.isFinite(safeEnd)
          ) {
            bbCanvasArcGuard.skipped++;
            bbCanvasArcGuard.lastInvalidArc = {
              x: safeX,
              y: safeY,
              radius: safeRadius,
              startAngle: safeStart,
              endAngle: safeEnd
            };
            return;
          }
          return nativeCanvasArc(
            safeX,
            safeY,
            Math.min(safeRadius, 1000000),
            safeStart,
            safeEnd,
            !!counterclockwise
          );
        };
      } catch (_) {}
      try { window.__BUY_BUTTON_CANVAS_GUARD__ = bbCanvasArcGuard; } catch (_) {}
      const supportsCanvasTransform = typeof ctx.setTransform === "function";
      const setDash = (segments) => {
        try { if (typeof ctx.setLineDash === "function") ctx.setLineDash(segments); } catch (_) {}
      };
      const $ = (id) => document.getElementById(id);
      // Offline persistence remains independent from networking. This tiny
      // event bridge lets the optional Telegram account layer mirror durable
      // sections without coupling the combat loop to fetch calls.
      const bbEmitCloudChange = (kind, value, updatedAt = Date.now(), extra = {}) => {
        try {
          const detail = {
            version: 1,
            kind: String(kind || ""),
            value,
            updatedAt: Number(updatedAt) || Date.now(),
            ...extra
          };
          let event = null;
          if (typeof window.CustomEvent === "function") {
            event = new window.CustomEvent("bb:cloud-change", { detail });
          } else if (document.createEvent) {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent("bb:cloud-change", false, false, detail);
          }
          if (event) window.dispatchEvent(event);
        } catch (_) {}
      };
      const menu = $("menu"), briefing = $("briefing"), shop = $("shop"), pause = $("pause"), gameover = $("gameover"), levelup = $("levelup"), ui = $("ui"), leaderboard = $("leaderboard");
      const orientationPrompt = $("orientationPrompt"), orientationBtn = $("orientationBtn");
      const easterEggLayer = $("easterEggs");
      const ACID = "#ccff00", HOT = "#ff426d", CYAN = "#5ff4ff", VIOLET = "#ad84ff";
      const LOCALE_CODES = ["en", "fa", "es", "ar", "fr", "de", "pt", "tr", "ja", "zh", "hi"];
      const LOCALE_NAMES = {
        en: "English", fa: "فارسی", es: "Español", ar: "العربية", fr: "Français",
        de: "Deutsch", pt: "Português", tr: "Türkçe", ja: "日本語", zh: "简体中文", hi: "हिन्दी"
      };
      const LOCALE_DIR = { fa: "rtl", ar: "rtl" };
      const localeNumber = (value) => {
        try { return Number(value).toLocaleString(currentLocale); } catch (_) { return String(value); }
      };
      const detectedLocale = String(browserNavigator.language || "").toLowerCase().split("-")[0];
      const initialLocale = LOCALE_CODES.includes(detectedLocale) ? detectedLocale : "en";

/* ===== 10-localization.js ===== */
const LOCALES = {
        en: {
          menuEyebrow: "UNOFFICIAL COMMUNITY ARCADE // v4.0 ECHO PROTOCOL",
          menuDescription: "The command disappeared in 2021. The signal survived. Enter the endless Robinhood Chain frontier, survive a different market regime every run, and break every lockout that tries to close your position.",
          chipRun: "ONE RUN · INFINITE WAVES", chipLore: "CHAIN 4663 LORE", chipNoWallet: "NO WALLET · NO TX",
          bestScore: "BEST SCORE", bestWave: "BEST WAVE", runsArchived: "RUNS ARCHIVED",
          noRecord: "NO RECORD YET // MAKE THE FIRST PRESS", archiveOnline: "ARCHIVE ONLINE // WAVE {wave} // SCORE {score}",
          howToPlay: "HOW TO PLAY", language: "LANGUAGE", start: "BOOT THE BUTTON", easterArchive: "OPEN EASTER EGG ARCHIVE", easterFound: "{found} / 7 FOUND",
          fineprint: "A fictional, unofficial game inspired by the community meme “Buy Button”. No affiliation or financial advice.",
          briefingEyebrow: "ARCHIVE // 01.28.2021", briefingTitle: "THE BUTTON WENT DARK.",
          briefingBody: "One frozen command became a legend. Years later, a green pulse wakes inside Chain 4663. It is not a promise of profit; it is a signal asking to be carried.",
          deploy: "ENTER THE FRONTIER", back: "BACK",
          mobileHint: "Desktop: WASD / Space / Tab lock / X echo / Z route. Mobile: rotate sideways; drag the left side to move, hold the right side to fire, and tap DASH or another ability with a second finger.",
          shopEyebrow: "CLEARANCE TERMINAL // BETWEEN WAVES", shopTitle: "REWIRE YOUR SIGNAL.",
          shopBody: "Spend recovered coins on tactical patches between waves. The frontier adapts; so do you.",
          weaponLab: "WEAPON LAB // SPECIALIZED CALIBRATION", shopFoot: "Every patch stacks. Buy as many as your recovered value allows, then press BUY to launch the next wave.",
          continueWave: "PRESS BUY // NEXT WAVE", levelEyebrow: "SIGNAL BREAKTHROUGH // LEVEL UP",
          levelTitle: "CHOOSE YOUR EDGE.", levelBody: "The crowd noticed the streak. Pick one instant mutation; the choice is yours.",
          easterEyebrow: "HIDDEN LEDGER // COMMUNITY SIGNALS", easterTitle: "THE EASTER EGG ARCHIVE.",
          easterBody: "Seven traces are hidden inside the run. Find them in the frontier, bring them back alive, and the archive will remember every press on this device.",
          easterFoot: "Unofficial fan fiction inspired by public community lore. No wallet, transaction, or financial action is involved.",
          backMenu: "BACK TO MENU", pauseEyebrow: "SIGNAL HOLD", pauseTitle: "PAUSED.",
          pauseBody: "The Button is waiting. Nothing moves while the signal is on hold. Tune the run before you jump back in.",
          controlCenter: "CONTROL CENTER", settingsStatus: "LIVE PROFILE", lowPowerProfile: "LOW-POWER PROFILE",
          cameraZoom: "CAMERA ZOOM", cameraZoomHint: "Mobile starts wider at 68%; pull back to 5% for a full frontier view.",
          masterVolume: "MASTER VOLUME", masterVolumeHint: "All weapon, hit and menu signals.",
          musicAmbience: "MUSIC / AMBIENCE", musicHint: "A subtle reactive bed; combat cues stay on top.",
          performanceMode: "PERFORMANCE MODE", performanceHint: "Reduce particles, stars and expensive glow for phones.",
          screenFx: "SCREEN FX", screenFxHint: "Shake, flash and scanline drama.",
          hapticFeedback: "HAPTIC FEEDBACK", hapticHint: "Short mobile pulses for hits and ability casts.",
          languageHint: "Choose the interface language. Your choice is saved on this device.",
          settingsNote: "Settings save automatically on this device. Hold SPACE or the mouse button to fire; press +/− to adjust zoom. X casts the selected Easter power; Z routes it.",
          resetSettings: "RESET SETTINGS", exitMenu: "EXIT TO MENU", resume: "RESUME RUN", buyAgain: "BUY AGAIN",
          gameoverEyebrow: "SIGNAL LOST // RUN ARCHIVE", gameoverTitle: "LIQUIDATED.",
          gameoverBody: "You carried the signal farther than the last run. The Button can be pressed again.",
          wave: "WAVE", score: "SCORE", coins: "COINS", level: "LEVEL", signalIntegrity: "SIGNAL INTEGRITY",
          energy: "ENERGY", frontierDepth: "FRONTIER DEPTH", recoveredValue: "RECOVERED VALUE", runScore: "RUN SCORE",
          boss: "BOSS", lockOn: "LOCK-ON // SMART TARGET", keepSignal: "KEEP THE SIGNAL ALIVE", dash: "DASH",
          pauseGame: "Pause game", orientationEyebrow: "MOBILE INPUT // LANDSCAPE REQUIRED", orientationTitle: "ROTATE TO PLAY.",
          orientationBody: "Turn your phone sideways for a wider arena and room for both hands.",
          orientationButton: "ROTATE + FULLSCREEN", tutorialEyebrow: "FIELD MANUAL // SIGNAL SCHOOL",
          tutorialClose: "Close tutorial", tutorialSkip: "SKIP", tutorialBack: "BACK", tutorialNext: "NEXT",
          tutorialDone: "READY", step: "STEP {current} / {total}", touchGuide: "LEFT DRAG: MOVE · RIGHT SIDE: AIM · PRESS // FIRE: SHOOT · DASH: ESCAPE",
          tutorialSteps: [
            { glyph: "BUY", title: "WELCOME, OPERATOR.", body: "Learn the controls in under a minute, then carry the signal as far as you can.", controls: [["GOAL", "Survive every wave"], ["LOOP", "Move · aim · upgrade"]], tip: "Your best run is saved automatically." },
            { glyph: "↖", title: "MOVE WITH YOUR LEFT THUMB.", body: "On mobile, drag anywhere on the left half to steer. The stick follows your thumb, so you never need to hunt for a tiny button.", controls: [["MOBILE", "Left-side drag"], ["DESKTOP", "WASD / arrow keys"]], tip: "Keep one finger moving while another controls your aim." },
            { glyph: "✦", title: "AIM AND FIRE.", body: "Aim on the right side. On mobile, hold PRESS // FIRE to shoot. On PC, hold SPACE or the mouse button to fire.", controls: [["MOBILE", "PRESS // hold"], ["DESKTOP", "SPACE // hold"]], tip: "Tap LOCK-ON to cycle the smartest target." },
            { glyph: "⇥", title: "DASH THROUGH DANGER.", body: "Tap DASH while moving to burst forward with brief invulnerability. Pointer Events support movement, firing and an ability on separate fingers.", controls: [["MOBILE", "Two fingers at once"], ["DESKTOP", "E / Space + direction"]], tip: "Dash costs energy; upgrades add more chained bursts." },
            { glyph: "⌕", title: "SEE THE WHOLE FRONTIER.", body: "Open Pause → Camera Zoom and pull the slider down to 5% for a wide tactical view. Entities and projectiles scale together so distance stays fair.", controls: [["ZOOM", "5%–132% range"], ["PHONE", "Landscape recommended"]], tip: "Performance Mode trims glow and particles on older phones." },
            { glyph: "◆", title: "PRESS, PATCH, REPEAT.", body: "Clear a wave, spend recovered value in the shop, then choose a level mutation. Every run rolls a new market regime and fresh routes.", controls: [["UPGRADES", "Damage · speed · shield"], ["ARCHIVE", "Score · waves · secrets"]], tip: "You can reopen this manual from the main menu anytime." }
          ]
        },
        fa: {
          menuEyebrow: "آرکید اجتماعی غیررسمی // پروتکل اکو نسخه ۴",
          menuDescription: "فرمان در سال ۲۰۲۱ ناپدید شد، اما سیگنال زنده ماند. وارد مرز بی‌پایان Chain 4663 شو، هر موج را پشت سر بگذار و قفل‌هایی را که جلویت را می‌گیرند بشکن.",
          chipRun: "یک ران · موج‌های بی‌نهایت", chipLore: "افسانهٔ Chain 4663", chipNoWallet: "بدون کیف پول · بدون تراکنش",
          bestScore: "بهترین امتیاز", bestWave: "بهترین موج", runsArchived: "ران‌های ذخیره‌شده",
          noRecord: "هنوز رکوردی نیست // اولین فشار را ثبت کن", archiveOnline: "آرشیو آنلاین // موج {wave} // امتیاز {score}",
          howToPlay: "آموزش بازی", language: "زبان", start: "فعال‌سازی دکمه", easterArchive: "باز کردن آرشیو ایستراِگ", easterFound: "{found} از ۷ پیدا شد",
          fineprint: "یک بازی تخیلی و غیررسمی با الهام از میم «Buy Button». بدون وابستگی و توصیهٔ مالی.",
          briefingEyebrow: "آرشیو // ۲۸.۰۱.۲۰۲۱", briefingTitle: "دکمه خاموش شد.",
          briefingBody: "یک فرمان منجمد به افسانه تبدیل شد. حالا یک پالس سبز در Chain 4663 بیدار شده؛ وعدهٔ سود نیست، سیگنالی است که باید حملش کنی.",
          deploy: "ورود به مرز", back: "بازگشت",
          mobileHint: "دسکتاپ: WASD / Space / قفل Tab / اکو X / مسیر Z. موبایل: گوشی را افقی کن؛ نیمهٔ چپ را بکش تا حرکت کنی، نیمهٔ راست را نگه دار تا هدف بگیری و شلیک کنی، و با انگشت دوم DASH یا توانایی‌ها را بزن.",
          shopEyebrow: "ترمینال ارتقا // بین موج‌ها", shopTitle: "سیگنالت را بازسیم‌کشی کن.",
          shopBody: "بین موج‌ها سکه‌های بازیابی‌شده را برای ارتقاهای تاکتیکی خرج کن. مرز سازگار می‌شود؛ تو هم همین‌طور.",
          weaponLab: "آزمایشگاه سلاح // کالیبراسیون تخصصی", shopFoot: "هر ارتقا روی قبلی جمع می‌شود؛ هرقدر ارزش بازیابی‌شده داری بخر و بعد موج بعدی را شروع کن.",
          continueWave: "فشار BUY // موج بعدی", levelEyebrow: "شکست سیگنال // ارتقا",
          levelTitle: "مزیتت را انتخاب کن.", levelBody: "استریکت دیده شد؛ یک جهش فوری انتخاب کن.",
          easterEyebrow: "دفتر مخفی // سیگنال‌های جامعه", easterTitle: "آرشیو ایستراِگ.",
          easterBody: "هفت ردپا در ران پنهان است. آن‌ها را در مرز پیدا کن تا این دستگاه هر فشارت را به یاد بسپارد.",
          easterFoot: "داستان هواداری و تخیلی؛ بدون کیف پول، تراکنش یا اقدام مالی.", backMenu: "بازگشت به منو",
          pauseEyebrow: "مکث سیگنال", pauseTitle: "متوقف شد.", pauseBody: "دکمه منتظر است. در حالت مکث چیزی حرکت نمی‌کند؛ تنظیمات را تغییر بده و برگرد.",
          controlCenter: "مرکز کنترل", settingsStatus: "پروفایل فعال", lowPowerProfile: "پروفایل کم‌مصرف",
          cameraZoom: "زوم دوربین", cameraZoomHint: "موبایل از ۶۸٪ شروع می‌کند؛ برای دید کامل تا ۵٪ عقب برو.",
          masterVolume: "صدای اصلی", masterVolumeHint: "صدای سلاح، ضربه و منو.",
          musicAmbience: "موسیقی / محیط", musicHint: "لایهٔ محیطی ظریف و واکنشی؛ صدای مبارزه همیشه روی آن می‌ماند.",
          performanceMode: "حالت عملکرد", performanceHint: "ذرات و درخشش سنگین را برای گوشی کاهش می‌دهد.",
          screenFx: "جلوه‌های صفحه", screenFxHint: "لرزش، فلش و خطوط اسکن.",
          hapticFeedback: "بازخورد لرزشی", hapticHint: "لرزش‌های کوتاه موبایلی برای ضربه و توانایی.",
          languageHint: "زبان رابط را انتخاب کن؛ انتخابت روی همین دستگاه ذخیره می‌شود.",
          settingsNote: "تنظیمات خودکار ذخیره می‌شوند. برای شلیک Space یا دکمهٔ ماوس را نگه دار؛ +/− زوم، X توان اکو و Z مسیر آن را تغییر می‌دهد.",
          resetSettings: "بازنشانی تنظیمات", exitMenu: "خروج به منو", resume: "ادامهٔ ران", buyAgain: "دوباره BUY کن",
          gameoverEyebrow: "سیگنال از دست رفت // آرشیو ران", gameoverTitle: "لیکویید شدی.",
          gameoverBody: "سیگنال را از ران قبلی دورتر بردی. دکمه دوباره قابل فشار است.",
          wave: "موج", score: "امتیاز", coins: "سکه", level: "سطح", signalIntegrity: "سلامت سیگنال",
          energy: "انرژی", frontierDepth: "عمق مرز", recoveredValue: "ارزش بازیابی‌شده", runScore: "امتیاز ران",
          boss: "باس", lockOn: "قفل هدف // هدف هوشمند", keepSignal: "سیگنال را زنده نگه دار", dash: "DASH",
          pauseGame: "مکث بازی", orientationEyebrow: "ورودی موبایل // حالت افقی لازم است", orientationTitle: "برای بازی بچرخان.",
          orientationBody: "گوشی را افقی کن تا میدان بازتر و جای هر دو دست فراهم شود.", orientationButton: "چرخش + تمام‌صفحه",
          tutorialEyebrow: "دفترچهٔ میدانی // مدرسهٔ سیگنال", tutorialClose: "بستن آموزش", tutorialSkip: "رد کردن", tutorialBack: "قبلی", tutorialNext: "بعدی", tutorialDone: "آماده‌ام",
          step: "مرحلهٔ {current} از {total}", touchGuide: "کشیدن چپ: حرکت · سمت راست: هدف · PRESS // FIRE: شلیک · DASH: فرار",
          tutorialSteps: [
            { glyph: "BUY", title: "خوش آمدی، اپراتور.", body: "در کمتر از یک دقیقه کنترل‌ها را یاد بگیر و سیگنال را تا هرجا می‌توانی حمل کن.", controls: [["هدف", "زنده ماندن در موج‌ها"], ["چرخه", "حرکت · هدف · ارتقا"]], tip: "بهترین ران تو خودکار ذخیره می‌شود." },
            { glyph: "↖", title: "با انگشت شست چپ حرکت کن.", body: "در موبایل هرجای نیمهٔ چپ را بکش؛ جوی‌استیک دنبال انگشتت می‌آید و لازم نیست دنبال دکمه بگردی.", controls: [["موبایل", "کشیدن نیمهٔ چپ"], ["دسکتاپ", "WASD / کلیدهای جهت"]], tip: "یک انگشت برای حرکت و یکی برای هدف‌گیری داشته باش." },
            { glyph: "✦", title: "هدف بگیر و شلیک کن.", body: "در سمت راست هدف بگیر. در موبایل PRESS // FIRE را نگه دار؛ در PC، Space یا دکمهٔ ماوس را نگه دار تا شلیک کنی.", controls: [["موبایل", "PRESS را نگه دار"], ["دسکتاپ", "SPACE را نگه دار"]], tip: "روی قفل هدف بزن تا هدف هوشمند عوض شود." },
            { glyph: "⇥", title: "از خطر DASH کن.", body: "هنگام حرکت DASH را بزن تا با مصونیت کوتاه جلو بروی. هر انگشت مستقل است و حرکت، شلیک و توانایی همزمان کار می‌کنند.", controls: [["موبایل", "دو انگشت همزمان"], ["دسکتاپ", "E / Space + جهت"]], tip: "DASH انرژی می‌خواهد؛ ارتقاها تعداد زنجیره‌ای را بیشتر می‌کنند." },
            { glyph: "⌕", title: "کل مرز را ببین.", body: "Pause → زوم دوربین را باز کن و تا ۵٪ پایین بیا تا دید تاکتیکی وسیع داشته باشی. مقیاس بازیکن، دشمن و تیر با هم هماهنگ می‌ماند.", controls: [["زوم", "محدودهٔ ۵٪ تا ۱۳۲٪"], ["گوشی", "حالت افقی پیشنهاد می‌شود"]], tip: "حالت عملکرد روی گوشی‌های قدیمی ذرات را کم می‌کند." },
            { glyph: "◆", title: "فشار بده، ارتقا بده، تکرار کن.", body: "موج را پاک کن، در فروشگاه ارزش بازیابی‌شده را خرج کن و یک جهش سطح انتخاب کن. هر ران رژیم و مسیر تازه‌ای دارد.", controls: [["ارتقا", "قدرت · سرعت · سپر"], ["آرشیو", "امتیاز · موج · رازها"]], tip: "آموزش را هر زمان از منوی اصلی باز کن." }
          ]
        }
      };
      const compactLocales = {
        es: { language: "IDIOMA", howToPlay: "CÓMO JUGAR", start: "ACTIVAR BOTÓN", easterArchive: "ABRIR ARCHIVO EASTER EGG", easterFound: "{found} / 7 ENCONTRADOS", back: "VOLVER", deploy: "ENTRAR EN LA FRONTERA", continueWave: "BUY // SIGUIENTE OLA", resume: "CONTINUAR", exitMenu: "SALIR AL MENÚ", resetSettings: "RESTABLECER", tutorialNext: "SIGUIENTE", tutorialBack: "ATRÁS", tutorialSkip: "SALTAR", tutorialDone: "LISTO", cameraZoom: "ZOOM DE CÁMARA", performanceMode: "MODO RENDIMIENTO", signalIntegrity: "INTEGRIDAD DE SEÑAL", energy: "ENERGÍA", frontierDepth: "PROFUNDIDAD", recoveredValue: "VALOR RECUPERADO", runScore: "PUNTUACIÓN", keepSignal: "MANTÉN LA SEÑAL", dash: "DASH", pauseTitle: "PAUSA", wave: "OLA", score: "PUNTOS", coins: "MONEDAS", level: "NIVEL", lockOn: "BLOQUEO // OBJETIVO INTELIGENTE", languageHint: "Elige el idioma; se guarda en este dispositivo.", tutorialEyebrow: "MANUAL DE CAMPO // ESCUELA DE SEÑAL" },
        ar: { language: "اللغة", howToPlay: "طريقة اللعب", start: "تشغيل الزر", easterArchive: "فتح أرشيف الأسرار", easterFound: "{found} / 7 مكتشفة", back: "رجوع", deploy: "دخول الحدود", continueWave: "BUY // الموجة التالية", resume: "متابعة", exitMenu: "الخروج للقائمة", resetSettings: "إعادة الإعدادات", tutorialNext: "التالي", tutorialBack: "السابق", tutorialSkip: "تخطي", tutorialDone: "جاهز", cameraZoom: "تكبير الكاميرا", performanceMode: "وضع الأداء", signalIntegrity: "سلامة الإشارة", energy: "الطاقة", frontierDepth: "عمق الحدود", recoveredValue: "القيمة المستردة", runScore: "نتيجة الجولة", keepSignal: "حافظ على الإشارة", dash: "اندفاع", pauseTitle: "متوقف", wave: "موجة", score: "نتيجة", coins: "عملات", level: "مستوى", lockOn: "قفل الهدف // ذكي", languageHint: "اختر اللغة؛ تحفظ على هذا الجهاز.", tutorialEyebrow: "دليل الميدان // مدرسة الإشارة" },
        fr: { language: "LANGUE", howToPlay: "JOUER", start: "ACTIVER LE BOUTON", easterArchive: "OUVRIR L’ARCHIVE EASTER EGG", easterFound: "{found} / 7 TROUVÉS", back: "RETOUR", deploy: "ENTRER DANS LA FRONTIÈRE", continueWave: "BUY // VAGUE SUIVANTE", resume: "REPRENDRE", exitMenu: "QUITTER LE MENU", resetSettings: "RÉINITIALISER", tutorialNext: "SUIVANT", tutorialBack: "RETOUR", tutorialSkip: "PASSER", tutorialDone: "PRÊT", cameraZoom: "ZOOM CAMÉRA", performanceMode: "MODE PERFORMANCE", signalIntegrity: "INTÉGRITÉ DU SIGNAL", energy: "ÉNERGIE", frontierDepth: "PROFONDEUR", recoveredValue: "VALEUR RÉCUPÉRÉE", runScore: "SCORE", keepSignal: "GARDEZ LE SIGNAL", dash: "DASH", pauseTitle: "PAUSE", wave: "VAGUE", score: "SCORE", coins: "PIÈCES", level: "NIVEAU", lockOn: "VERROU // CIBLE INTELLIGENTE", languageHint: "Choisissez la langue; elle est mémorisée.", tutorialEyebrow: "MANUEL // ÉCOLE DU SIGNAL" },
        de: { language: "SPRACHE", howToPlay: "SO SPIELT MAN", start: "BUTTON STARTEN", easterArchive: "EASTER-EGG-ARCHIV ÖFFNEN", easterFound: "{found} / 7 GEFUNDEN", back: "ZURÜCK", deploy: "GRENZE BETRETEN", continueWave: "BUY // NÄCHSTE WELLE", resume: "FORTSETZEN", exitMenu: "ZUM MENÜ", resetSettings: "ZURÜCKSETZEN", tutorialNext: "WEITER", tutorialBack: "ZURÜCK", tutorialSkip: "ÜBERSPRINGEN", tutorialDone: "BEREIT", cameraZoom: "KAMERA-ZOOM", performanceMode: "LEISTUNGSMODUS", signalIntegrity: "SIGNALINTEGRITÄT", energy: "ENERGIE", frontierDepth: "GRENZTIEFE", recoveredValue: "BERGUNGSWERT", runScore: "RUN-SCORE", keepSignal: "SIGNAL HALTEN", dash: "DASH", pauseTitle: "PAUSE", wave: "WELLE", score: "PUNKTE", coins: "MÜNZEN", level: "LEVEL", lockOn: "LOCK-ON // SMARTES ZIEL", languageHint: "Sprache wählen; wird auf diesem Gerät gespeichert.", tutorialEyebrow: "FELDHANDBUCH // SIGNALSCHULE" },
        pt: { language: "IDIOMA", howToPlay: "COMO JOGAR", start: "ATIVAR BOTÃO", easterArchive: "ABRIR ARQUIVO EASTER EGG", easterFound: "{found} / 7 ENCONTRADOS", back: "VOLTAR", deploy: "ENTRAR NA FRONTEIRA", continueWave: "BUY // PRÓXIMA ONDA", resume: "RETOMAR", exitMenu: "SAIR AO MENU", resetSettings: "REDEFINIR", tutorialNext: "PRÓXIMO", tutorialBack: "VOLTAR", tutorialSkip: "PULAR", tutorialDone: "PRONTO", cameraZoom: "ZOOM DA CÂMERA", performanceMode: "MODO DESEMPENHO", signalIntegrity: "INTEGRIDADE DO SINAL", energy: "ENERGIA", frontierDepth: "PROFUNDIDADE", recoveredValue: "VALOR RECUPERADO", runScore: "PONTUAÇÃO", keepSignal: "MANTER SINAL", dash: "DASH", pauseTitle: "PAUSADO", wave: "ONDA", score: "PONTOS", coins: "MOEDAS", level: "NÍVEL", lockOn: "TRAVA // ALVO INTELIGENTE", languageHint: "Escolha o idioma; salvo neste dispositivo.", tutorialEyebrow: "MANUAL DE CAMPO // ESCOLA DO SINAL" },
        tr: { language: "DİL", howToPlay: "NASIL OYNANIR", start: "DÜĞMEYİ BAŞLAT", easterArchive: "GİZLİ ARŞİVİ AÇ", easterFound: "{found} / 7 BULUNDU", back: "GERİ", deploy: "SINIRA GİR", continueWave: "BUY // SONRAKİ DALGA", resume: "DEVAM ET", exitMenu: "MENÜYE ÇIK", resetSettings: "AYARLARI SIFIRLA", tutorialNext: "İLERİ", tutorialBack: "GERİ", tutorialSkip: "ATLA", tutorialDone: "HAZIR", cameraZoom: "KAMERA YAKINLAŞTIRMA", performanceMode: "PERFORMANS MODU", signalIntegrity: "SİNYAL BÜTÜNLÜĞÜ", energy: "ENERJİ", frontierDepth: "SINIR DERİNLİĞİ", recoveredValue: "KURTARILAN DEĞER", runScore: "SKOR", keepSignal: "SİNYALİ KORU", dash: "DASH", pauseTitle: "DURAKLATILDI", wave: "DALGA", score: "SKOR", coins: "JETON", level: "SEVİYE", lockOn: "KİLİT // AKILLI HEDEF", languageHint: "Dili seç; bu cihazda saklanır.", tutorialEyebrow: "SAHA KILAVUZU // SİNYAL OKULU" },
        ja: { language: "言語", howToPlay: "遊び方", start: "ボタンを起動", easterArchive: "イースターエッグ記録を開く", easterFound: "{found} / 7 発見", back: "戻る", deploy: "フロンティアへ", continueWave: "BUY // 次のウェーブ", resume: "再開", exitMenu: "メニューへ", resetSettings: "設定をリセット", tutorialNext: "次へ", tutorialBack: "戻る", tutorialSkip: "スキップ", tutorialDone: "準備完了", cameraZoom: "カメラズーム", performanceMode: "パフォーマンス", signalIntegrity: "シグナル耐久", energy: "エネルギー", frontierDepth: "フロンティア深度", recoveredValue: "回収価値", runScore: "スコア", keepSignal: "シグナルを守れ", dash: "ダッシュ", pauseTitle: "一時停止", wave: "ウェーブ", score: "スコア", coins: "コイン", level: "レベル", lockOn: "ロックオン // スマートターゲット", languageHint: "言語を選択。端末に保存されます。", tutorialEyebrow: "フィールドマニュアル // シグナル学校" },
        zh: { language: "语言", howToPlay: "玩法说明", start: "启动按钮", easterArchive: "打开彩蛋档案", easterFound: "已发现 {found} / 7", back: "返回", deploy: "进入边境", continueWave: "BUY // 下一波", resume: "继续", exitMenu: "返回菜单", resetSettings: "重置设置", tutorialNext: "下一步", tutorialBack: "上一步", tutorialSkip: "跳过", tutorialDone: "准备好了", cameraZoom: "镜头缩放", performanceMode: "性能模式", signalIntegrity: "信号完整度", energy: "能量", frontierDepth: "边境深度", recoveredValue: "回收价值", runScore: "本局分数", keepSignal: "守住信号", dash: "冲刺", pauseTitle: "已暂停", wave: "波次", score: "分数", coins: "金币", level: "等级", lockOn: "锁定 // 智能目标", languageHint: "选择语言；会保存在本设备。", tutorialEyebrow: "战地手册 // 信号训练" },
        hi: { language: "भाषा", howToPlay: "कैसे खेलें", start: "बटन शुरू करें", easterArchive: "ईस्टर एग संग्रह खोलें", easterFound: "{found} / 7 मिले", back: "वापस", deploy: "फ्रंटियर में जाएँ", continueWave: "BUY // अगली लहर", resume: "जारी रखें", exitMenu: "मेन्यू से बाहर", resetSettings: "सेटिंग रीसेट", tutorialNext: "आगे", tutorialBack: "पीछे", tutorialSkip: "छोड़ें", tutorialDone: "तैयार", cameraZoom: "कैमरा ज़ूम", performanceMode: "परफ़ॉर्मेंस मोड", signalIntegrity: "सिग्नल अखंडता", energy: "ऊर्जा", frontierDepth: "फ्रंटियर गहराई", recoveredValue: "प्राप्त मूल्य", runScore: "स्कोर", keepSignal: "सिग्नल बचाएँ", dash: "डैश", pauseTitle: "रुका हुआ", wave: "लहर", score: "स्कोर", coins: "सिक्के", level: "स्तर", lockOn: "लॉक-ऑन // स्मार्ट लक्ष्य", languageHint: "भाषा चुनें; इस डिवाइस पर सेव होगी।", tutorialEyebrow: "फील्ड मैनुअल // सिग्नल स्कूल" }
      };
      // The short locale tables above cover the compact HUD.  Fill the
      // high-visibility screen copy too, so changing language never leaves
      // a mobile player staring at an otherwise untranslated title or
      // settings note.
      const localeCoreFill = {
        es: {
          chipRun: "UNA PARTIDA · OLAS INFINITAS", chipLore: "HISTORIA CHAIN 4663", chipNoWallet: "SIN BILLETERA · SIN TX",
          bestScore: "MEJOR PUNTUACIÓN", bestWave: "MEJOR OLA", runsArchived: "PARTIDAS ARCHIVADAS", noRecord: "SIN RÉCORD // HAZ LA PRIMERA PULSACIÓN",
          fineprint: "Juego ficticio y no oficial inspirado en el meme «Buy Button». Sin afiliación ni consejo financiero.",
          briefingTitle: "EL BOTÓN SE APAGÓ.", briefingBody: "Un comando congelado se volvió leyenda. Ahora un pulso verde despierta dentro de Chain 4663.",
          mobileHint: "Móvil: gira el teléfono; arrastra la izquierda para moverte, mantén la derecha para apuntar/disparar y usa DASH con otro dedo.",
          shopTitle: "RECABLEA TU SEÑAL.", levelTitle: "ELIGE TU VENTAJA.", easterTitle: "ARCHIVO DE SECRETOS.",
          pauseTitle: "EN PAUSA.", gameoverTitle: "LIQUIDADO.", pauseGame: "Pausar juego", buyAgain: "COMPRAR DE NUEVO",
          orientationTitle: "GIRA PARA JUGAR.", orientationBody: "Gira el teléfono para tener una arena más amplia y espacio para ambas manos.",
          settingsNote: "Los ajustes se guardan en este dispositivo. F cambia el auto-disparo; +/− ajusta el zoom; X usa el poder y Z cambia la ruta."
        },
        ar: {
          chipRun: "جولة واحدة · موجات لا نهائية", chipLore: "حكاية CHAIN 4663", chipNoWallet: "بلا محفظة · بلا معاملات",
          bestScore: "أفضل نتيجة", bestWave: "أفضل موجة", runsArchived: "الجولات المؤرشفة", noRecord: "لا سجل بعد // اضغط أولاً",
          fineprint: "لعبة خيالية غير رسمية مستوحاة من ميم «Buy Button». بلا تبعية أو نصيحة مالية.",
          briefingTitle: "انطفأ الزر.", briefingBody: "تحوّل أمر متجمّد إلى أسطورة. والآن يستيقظ نبض أخضر داخل Chain 4663.",
          mobileHint: "الهاتف: أدره أفقياً؛ اسحب اليسار للحركة، واضغط مطولاً على اليمين للتصويب والإطلاق، واستخدم الاندفاع بإصبع ثانٍ.",
          shopTitle: "أعد توصيل إشارتك.", levelTitle: "اختر ميزتك.", easterTitle: "أرشيف الأسرار.",
          pauseTitle: "متوقف مؤقتاً.", gameoverTitle: "تمت التصفية.", pauseGame: "إيقاف اللعبة", buyAgain: "اشترِ مجدداً",
          orientationTitle: "أدر الهاتف للعب.", orientationBody: "أدر هاتفك لتحصل على ساحة أوسع ومساحة لكلتا اليدين.",
          settingsNote: "تُحفظ الإعدادات على هذا الجهاز. يبدّل F الإطلاق التلقائي؛ +/− للزوم؛ X للقوة وZ للمسار."
        },
        fr: {
          chipRun: "UN RUN · VAGUES INFINIES", chipLore: "LORE CHAIN 4663", chipNoWallet: "SANS PORTEFEUILLE · SANS TX",
          bestScore: "MEILLEUR SCORE", bestWave: "MEILLEURE VAGUE", runsArchived: "RUNS ARCHIVÉS", noRecord: "AUCUN RECORD // PRESSEZ D’ABORD",
          fineprint: "Jeu fictif et non officiel inspiré du mème « Buy Button ». Sans affiliation ni conseil financier.",
          briefingTitle: "LE BOUTON S’EST ÉTEINT.", briefingBody: "Une commande figée est devenue une légende. Un pouls vert se réveille dans Chain 4663.",
          mobileHint: "Mobile : tournez le téléphone; glissez à gauche pour bouger, maintenez à droite pour viser/tirer et utilisez DASH avec l’autre doigt.",
          shopTitle: "RECÂBLEZ VOTRE SIGNAL.", levelTitle: "CHOISISSEZ VOTRE ATOUT.", easterTitle: "ARCHIVE DES SECRETS.",
          pauseTitle: "EN PAUSE.", gameoverTitle: "LIQUIDÉ.", pauseGame: "Mettre en pause", buyAgain: "ACHETER À NOUVEAU",
          orientationTitle: "TOURNEZ POUR JOUER.", orientationBody: "Tournez le téléphone pour élargir l’arène et libérer vos deux mains.",
          settingsNote: "Les réglages sont enregistrés sur cet appareil. F active le tir auto; +/− règle le zoom; X lance le pouvoir et Z change la route."
        },
        de: {
          chipRun: "EIN RUN · UNENDLICHE WELLEN", chipLore: "CHAIN-4663-LORE", chipNoWallet: "KEINE WALLET · KEINE TX",
          bestScore: "BESTER SCORE", bestWave: "BESTE WELLE", runsArchived: "ARCHIVIERTE RUNS", noRecord: "NOCH KEIN REKORD // DRÜCKE ZUERST",
          fineprint: "Fiktives, inoffizielles Spiel inspiriert vom Meme „Buy Button“. Keine Verbindung und keine Finanzberatung.",
          briefingTitle: "DER BUTTON WURDE DUNKEL.", briefingBody: "Ein eingefrorener Befehl wurde zur Legende. Jetzt erwacht ein grüner Puls in Chain 4663.",
          mobileHint: "Mobil: quer drehen; links ziehen zum Bewegen, rechts halten zum Zielen/Feuern und DASH mit dem zweiten Finger nutzen.",
          shopTitle: "DEIN SIGNAL NEU VERKABELN.", levelTitle: "WÄHLE DEINEN VORTEIL.", easterTitle: "ARCHIV DER GEHEIMNISSE.",
          pauseTitle: "PAUSIERT.", gameoverTitle: "LIQUIDIERT.", pauseGame: "Spiel pausieren", buyAgain: "NOCHMAL KAUFEN",
          orientationTitle: "DREHE ZUM SPIELEN.", orientationBody: "Drehe dein Telefon für eine größere Arena und Platz für beide Hände.",
          settingsNote: "Einstellungen werden auf diesem Gerät gespeichert. F schaltet Auto-Feuer; +/− Zoom; X nutzt die Kraft und Z ändert die Route."
        },
        pt: {
          chipRun: "UMA PARTIDA · ONDAS INFINITAS", chipLore: "LORE CHAIN 4663", chipNoWallet: "SEM CARTEIRA · SEM TX",
          bestScore: "MELHOR PONTUAÇÃO", bestWave: "MELHOR ONDA", runsArchived: "PARTIDAS ARQUIVADAS", noRecord: "SEM RECORDE // FAÇA O PRIMEIRO TOQUE",
          fineprint: "Jogo fictício e não oficial inspirado no meme «Buy Button». Sem afiliação ou conselho financeiro.",
          briefingTitle: "O BOTÃO ESCURECEU.", briefingBody: "Um comando congelado virou lenda. Agora um pulso verde desperta dentro da Chain 4663.",
          mobileHint: "Celular: vire na horizontal; arraste à esquerda para mover, segure à direita para mirar/atirar e use DASH com o outro dedo.",
          shopTitle: "RECONECTE SEU SINAL.", levelTitle: "ESCOLHA SUA VANTAGEM.", easterTitle: "ARQUIVO DE SEGREDOS.",
          pauseTitle: "PAUSADO.", gameoverTitle: "LIQUIDADO.", pauseGame: "Pausar jogo", buyAgain: "COMPRAR NOVAMENTE",
          orientationTitle: "VIRE PARA JOGAR.", orientationBody: "Vire o celular para ampliar a arena e liberar as duas mãos.",
          settingsNote: "As configurações são salvas neste dispositivo. F alterna o tiro automático; +/− ajusta o zoom; X usa o poder e Z muda a rota."
        },
        tr: {
          chipRun: "TEK KOŞU · SINIRSIZ DALGA", chipLore: "CHAIN 4663 HİKÂYESİ", chipNoWallet: "CÜZDAN YOK · TX YOK",
          bestScore: "EN İYİ SKOR", bestWave: "EN İYİ DALGA", runsArchived: "ARŞİVLENEN KOŞU", noRecord: "KAYIT YOK // İLK BASIŞI YAP",
          fineprint: "«Buy Button» memesinden ilham alan kurgusal, gayriresmî oyun. Bağlantı veya finansal tavsiye yoktur.",
          briefingTitle: "DÜĞME KARARDI.", briefingBody: "Donmuş bir komut efsaneye dönüştü. Şimdi Chain 4663 içinde yeşil bir darbe uyanıyor.",
          mobileHint: "Mobil: telefonu yatay çevir; hareket için solu sürükle, nişan/ateş için sağı basılı tut ve DASH’i ikinci parmakla kullan.",
          shopTitle: "SİNYALİNİ YENİDEN KUR.", levelTitle: "AVANTAJINI SEÇ.", easterTitle: "GİZEM ARŞİVİ.",
          pauseTitle: "DURAKLATILDI.", gameoverTitle: "LİKİDE.", pauseGame: "Oyunu duraklat", buyAgain: "TEKRAR AL",
          orientationTitle: "OYNAMAK İÇİN ÇEVİR.", orientationBody: "Daha geniş arena ve iki el için telefonu yatay çevir.",
          settingsNote: "Ayarlar bu cihaza kaydedilir. F otomatik ateşi değiştirir; +/− zoomu ayarlar; X gücü, Z rotayı değiştirir."
        },
        ja: {
          chipRun: "1ラン · 無限ウェーブ", chipLore: "CHAIN 4663の物語", chipNoWallet: "ウォレット不要 · TXなし",
          bestScore: "ハイスコア", bestWave: "最高ウェーブ", runsArchived: "保存されたラン", noRecord: "記録なし // 最初にプレス",
          fineprint: "ミーム「Buy Button」に着想を得た非公式フィクションゲーム。金融助言ではありません。",
          briefingTitle: "ボタンが暗転した。", briefingBody: "凍ったコマンドは伝説になった。今、Chain 4663で緑のパルスが目を覚ます。",
          mobileHint: "モバイル：横向きにして、左側ドラッグで移動、右側長押しで照準/射撃、もう一方の指でDASH。",
          shopTitle: "シグナルを再配線。", levelTitle: "強みを選ぶ。", easterTitle: "秘密のアーカイブ。",
          pauseTitle: "一時停止。", gameoverTitle: "清算された。", pauseGame: "ゲームを一時停止", buyAgain: "もう一度BUY",
          orientationTitle: "横向きでプレイ。", orientationBody: "横向きにすると広いアリーナと両手のスペースが得られます。",
          settingsNote: "設定はこの端末に保存されます。Fでオート射撃、+/−でズーム、Xでパワー、Zでルートを切替。"
        },
        zh: {
          chipRun: "单局 · 无限波次", chipLore: "CHAIN 4663 故事", chipNoWallet: "无需钱包 · 无交易",
          bestScore: "最高分", bestWave: "最高波次", runsArchived: "已保存对局", noRecord: "暂无记录 // 按下开始",
          fineprint: "受“Buy Button”梗启发的非官方虚构游戏，不提供金融建议。",
          briefingTitle: "按钮熄灭了。", briefingBody: "冻结的指令成为传说。现在绿色脉冲在 Chain 4663 中苏醒。",
          mobileHint: "手机：横屏；拖动左侧移动，按住右侧瞄准/射击，用另一根手指冲刺。",
          shopTitle: "重接你的信号。", levelTitle: "选择你的优势。", easterTitle: "秘密档案。",
          pauseTitle: "已暂停。", gameoverTitle: "已清算。", pauseGame: "暂停游戏", buyAgain: "再次购买",
          orientationTitle: "横屏开始游戏。", orientationBody: "横屏可获得更宽的战场和双手操作空间。",
          settingsNote: "设置会保存在本设备。F切换自动射击；+/−调整缩放；X使用能力，Z切换路线。"
        },
        hi: {
          chipRun: "एक रन · अनंत लहरें", chipLore: "CHAIN 4663 कथा", chipNoWallet: "वॉलेट नहीं · TX नहीं",
          bestScore: "सर्वश्रेष्ठ स्कोर", bestWave: "सर्वश्रेष्ठ लहर", runsArchived: "सहेजे गए रन", noRecord: "अभी रिकॉर्ड नहीं // पहली प्रेस करें",
          fineprint: "“Buy Button” मीम से प्रेरित काल्पनिक, अनौपचारिक गेम। कोई वित्तीय सलाह नहीं।",
          briefingTitle: "बटन अंधेरा हो गया।", briefingBody: "जमा हुआ आदेश किंवदंती बना। अब Chain 4663 में हरी तरंग जागती है।",
          mobileHint: "मोबाइल: फोन क्षैतिज करें; बाईं ओर ड्रैग से चलें, दाईं ओर होल्ड से निशाना/फायर करें और दूसरी उंगली से DASH करें।",
          shopTitle: "अपने सिग्नल को फिर जोड़ें।", levelTitle: "अपना लाभ चुनें।", easterTitle: "गुप्त संग्रह।",
          pauseTitle: "रुका हुआ।", gameoverTitle: "लिक्विडेटेड।", pauseGame: "गेम रोकें", buyAgain: "फिर खरीदें",
          orientationTitle: "खेलने के लिए घुमाएँ।", orientationBody: "फोन को क्षैतिज करने से बड़ा मैदान और दोनों हाथों की जगह मिलती है।",
          settingsNote: "सेटिंग इस डिवाइस पर सेव होती हैं। F ऑटो-फायर बदलता है; +/− ज़ूम; X शक्ति और Z मार्ग बदलते हैं।"
        }
      };
      for (const [code, values] of Object.entries(localeCoreFill)) {
        compactLocales[code] = { ...compactLocales[code], ...values };
      }
      const localeFillKeys = ["menuEyebrow", "menuDescription", "chipRun", "chipLore", "chipNoWallet", "bestScore", "bestWave", "runsArchived", "noRecord", "fineprint", "briefingEyebrow", "briefingTitle", "briefingBody", "deploy", "back", "mobileHint", "shopEyebrow", "shopTitle", "shopBody", "weaponLab", "shopFoot", "continueWave", "levelEyebrow", "levelTitle", "levelBody", "easterEyebrow", "easterTitle", "easterBody", "easterFoot", "backMenu", "pauseEyebrow", "pauseTitle", "pauseBody", "controlCenter", "settingsStatus", "lowPowerProfile", "cameraZoom", "cameraZoomHint", "masterVolume", "masterVolumeHint", "musicAmbience", "musicHint", "performanceMode", "performanceHint", "screenFx", "screenFxHint", "hapticFeedback", "hapticHint", "languageHint", "settingsNote", "resetSettings", "exitMenu", "resume", "buyAgain", "gameoverEyebrow", "gameoverTitle", "gameoverBody", "wave", "score", "coins", "level", "signalIntegrity", "energy", "frontierDepth", "recoveredValue", "runScore", "boss", "lockOn", "keepSignal", "dash", "pauseGame", "orientationEyebrow", "orientationTitle", "orientationBody", "orientationButton", "tutorialEyebrow", "tutorialClose", "tutorialSkip", "tutorialBack", "tutorialNext", "tutorialDone", "step", "touchGuide", "easterArchive", "easterFound"];
      // English is the deliberate fallback for a secondary string that has
      // not yet received a human translation; the primary mobile surfaces
      // above are all filled per locale.
      const tutorialStepLocales = {
        es: [
          { glyph: "BUY", title: "BIENVENIDO, OPERADOR.", body: "Aprende los controles en menos de un minuto y lleva la señal tan lejos como puedas.", controls: [["OBJETIVO", "Sobrevive cada ola"], ["CICLO", "Mueve · apunta · mejora"]], tip: "Tu mejor partida se guarda automáticamente." },
          { glyph: "↖", title: "MUEVE CON EL PULGAR IZQUIERDO.", body: "En móvil, arrastra cualquier punto de la mitad izquierda para conducir. El stick sigue tu dedo.", controls: [["MÓVIL", "Arrastre izquierdo"], ["PC", "WASD / flechas"]], tip: "Deja un dedo para mover y otro para apuntar." },
          { glyph: "✦", title: "APUNTA Y DISPARA.", body: "Mantén pulsada la mitad derecha para apuntar y disparar. El auto-disparo empieza activado.", controls: [["MÓVIL", "Mantener derecha"], ["PC", "Ratón / Espacio"]], tip: "Pulsa BLOQUEO para cambiar de objetivo." },
          { glyph: "⇥", title: "DASH A TRAVÉS DEL PELIGRO.", body: "Pulsa DASH mientras te mueves para avanzar con invulnerabilidad breve. Los dedos funcionan en paralelo.", controls: [["MÓVIL", "Dos dedos"], ["PC", "E / dirección"]], tip: "DASH consume energía; las mejoras añaden cargas." },
          { glyph: "⌕", title: "VE TODA LA FRONTERA.", body: "Abre Pausa → Zoom y baja a 5% para una vista táctica amplia. Todo escala de forma justa.", controls: [["ZOOM", "5%–132%"], ["TELÉFONO", "Paisaje recomendado"]], tip: "Modo rendimiento reduce brillo y partículas." },
          { glyph: "◆", title: "PULSA, MEJORA, REPITE.", body: "Limpia una ola, gasta el valor recuperado y elige una mutación. Cada partida cambia.", controls: [["MEJORAS", "Daño · velocidad · escudo"], ["ARCHIVO", "Puntos · olas · secretos"]], tip: "Puedes abrir este manual desde el menú." }
        ],
        ar: [
          { glyph: "BUY", title: "مرحباً أيها المشغّل.", body: "تعلّم التحكم خلال دقيقة واحمل الإشارة إلى أبعد مكان.", controls: [["الهدف", "النجاة من كل موجة"], ["الدورة", "تحرك · صوب · طوّر"]], tip: "أفضل جولة تُحفظ تلقائياً." },
          { glyph: "↖", title: "تحرك بإبهامك الأيسر.", body: "اسحب أي مكان في النصف الأيسر للتحكم؛ العصا تتبع إصبعك.", controls: [["الهاتف", "سحب اليسار"], ["الحاسوب", "WASD / الأسهم"]], tip: "اترك إصبعاً للحركة وآخر للتصويب." },
          { glyph: "✦", title: "صوّب وأطلق.", body: "اضغط مطولاً على النصف الأيمن للتصويب والإطلاق. الإطلاق التلقائي يبدأ مفعلاً.", controls: [["الهاتف", "ضغط يمين"], ["الحاسوب", "الفأرة / Space"]], tip: "اضغط قفل الهدف لتبديل الهدف الذكي." },
          { glyph: "⇥", title: "اندفع عبر الخطر.", body: "اضغط اندفاع أثناء الحركة لتحصل على حصانة قصيرة. يمكن استخدام إصبعين معاً.", controls: [["الهاتف", "إصبعان"], ["الحاسوب", "E / اتجاه"]], tip: "الاندفاع يستهلك الطاقة؛ الترقيات تضيف شحنات." },
          { glyph: "⌕", title: "شاهد الحدود كلها.", body: "افتح الإيقاف المؤقت ثم الزوم وانزل إلى ٥٪ لرؤية تكتيكية واسعة؛ المقاييس تبقى عادلة.", controls: [["الزوم", "٥٪–١٣٢٪"], ["الهاتف", "الوضع الأفقي أفضل"]], tip: "وضع الأداء يقلل الوهج والجزيئات." },
          { glyph: "◆", title: "اضغط، طوّر، كرر.", body: "نظّف الموجة، أنفق القيمة واختر طفرة مستوى. كل جولة تحمل مساراً جديداً.", controls: [["الترقيات", "ضرر · سرعة · درع"], ["الأرشيف", "نقاط · موجات · أسرار"]], tip: "يمكنك فتح الدليل من القائمة الرئيسية." }
        ],
        fr: [
          { glyph: "BUY", title: "BIENVENUE, OPÉRATEUR.", body: "Apprenez les commandes en moins d’une minute et portez le signal le plus loin possible.", controls: [["BUT", "Survivre à chaque vague"], ["BOUCLE", "Bouger · viser · améliorer"]], tip: "Votre meilleur run est sauvegardé." },
          { glyph: "↖", title: "BOUGEZ AVEC LE POUCE GAUCHE.", body: "Sur mobile, glissez sur la moitié gauche; le stick suit votre doigt.", controls: [["MOBILE", "Glisser à gauche"], ["PC", "WASD / flèches"]], tip: "Gardez un doigt pour bouger et un autre pour viser." },
          { glyph: "✦", title: "VISEZ ET TIREZ.", body: "Maintenez la moitié droite pour viser et tirer. Le tir automatique commence activé.", controls: [["MOBILE", "Maintenir à droite"], ["PC", "Souris / Espace"]], tip: "Touchez le verrou pour changer de cible." },
          { glyph: "⇥", title: "DASH À TRAVERS LE DANGER.", body: "Touchez DASH en mouvement pour bondir avec une brève invulnérabilité. Deux doigts fonctionnent ensemble.", controls: [["MOBILE", "Deux doigts"], ["PC", "E / direction"]], tip: "Le dash consomme de l’énergie; les améliorations ajoutent des charges." },
          { glyph: "⌕", title: "VOYEZ TOUTE LA FRONTIÈRE.", body: "Pause → Zoom, puis descendez à 5% pour une vue tactique large et équitable.", controls: [["ZOOM", "5%–132%"], ["TÉLÉPHONE", "Paysage conseillé"]], tip: "Le mode performance réduit les effets." },
          { glyph: "◆", title: "PRESSEZ, AMÉLIOREZ, RECOMMENCEZ.", body: "Nettoyez une vague, dépensez la valeur récupérée et choisissez une mutation.", controls: [["AMÉLIORATIONS", "Dégâts · vitesse · bouclier"], ["ARCHIVE", "Score · vagues · secrets"]], tip: "Le manuel reste accessible depuis le menu." }
        ],
        de: [
          { glyph: "BUY", title: "WILLKOMMEN, OPERATOR.", body: "Lerne die Steuerung in weniger als einer Minute und trage das Signal so weit wie möglich.", controls: [["ZIEL", "Jede Welle überleben"], ["LOOP", "Bewegen · zielen · verbessern"]], tip: "Dein bester Lauf wird automatisch gespeichert." },
          { glyph: "↖", title: "BEWEGE DICH MIT DEM LINKEN DAUMEN.", body: "Ziehe mobil auf der linken Hälfte; der Stick folgt deinem Finger.", controls: [["MOBIL", "Links ziehen"], ["PC", "WASD / Pfeile"]], tip: "Ein Finger bewegt, der andere zielt." },
          { glyph: "✦", title: "ZIELEN UND FEUERN.", body: "Halte die rechte Hälfte gedrückt. Auto-Feuer startet aktiviert.", controls: [["MOBIL", "Rechts halten"], ["PC", "Maus / Leertaste"]], tip: "Tippe auf LOCK-ON für ein neues Ziel." },
          { glyph: "⇥", title: "DASH DURCH DIE GEFAHR.", body: "Drücke DASH während der Bewegung für einen kurzen unverwundbaren Schub.", controls: [["MOBIL", "Zwei Finger"], ["PC", "E / Richtung"]], tip: "Dash verbraucht Energie; Upgrades geben mehr Ladungen." },
          { glyph: "⌕", title: "SIEH DIE GESAMTE GRENZE.", body: "Pause → Zoom und bis 5% zurückziehen. Alle Größen bleiben fair.", controls: [["ZOOM", "5%–132%"], ["TELEFON", "Querformat empfohlen"]], tip: "Leistungsmodus reduziert Glanz und Partikel." },
          { glyph: "◆", title: "DRÜCKEN, PATCHEN, WIEDERHOLEN.", body: "Welle räumen, Wert ausgeben und Mutation wählen. Jeder Lauf ist neu.", controls: [["UPGRADES", "Schaden · Tempo · Schild"], ["ARCHIV", "Punkte · Wellen · Geheimnisse"]], tip: "Das Handbuch bleibt im Hauptmenü verfügbar." }
        ],
        pt: [
          { glyph: "BUY", title: "BEM-VINDO, OPERADOR.", body: "Aprenda os controles em menos de um minuto e leve o sinal o mais longe possível.", controls: [["META", "Sobreviva a cada onda"], ["CICLO", "Mover · mirar · melhorar"]], tip: "Sua melhor corrida é salva automaticamente." },
          { glyph: "↖", title: "MOVA COM O POLEGAR ESQUERDO.", body: "No celular, arraste na metade esquerda; o controle segue seu dedo.", controls: [["CELULAR", "Arraste à esquerda"], ["PC", "WASD / setas"]], tip: "Use um dedo para mover e outro para mirar." },
          { glyph: "✦", title: "MIRE E ATIRE.", body: "Segure a metade direita para mirar e atirar. O disparo automático começa ligado.", controls: [["CELULAR", "Segure à direita"], ["PC", "Mouse / Espaço"]], tip: "Toque no bloqueio para trocar de alvo." },
          { glyph: "⇥", title: "USE DASH NO PERIGO.", body: "Toque DASH enquanto se move para avançar com breve invulnerabilidade.", controls: [["CELULAR", "Dois dedos"], ["PC", "E / direção"]], tip: "Dash consome energia; melhorias dão mais cargas." },
          { glyph: "⌕", title: "VEJA TODA A FRONTEIRA.", body: "Pause → Zoom e reduza para 5% para uma visão ampla e justa.", controls: [["ZOOM", "5%–132%"], ["CELULAR", "Paisagem recomendada"]], tip: "Modo desempenho reduz brilho e partículas." },
          { glyph: "◆", title: "PRESSIONE, MELHORE, REPITA.", body: "Limpe a onda, gaste o valor e escolha uma mutação. Cada corrida é diferente.", controls: [["MELHORIAS", "Dano · velocidade · escudo"], ["ARQUIVO", "Pontos · ondas · segredos"]], tip: "Abra este manual novamente no menu." }
        ],
        tr: [
          { glyph: "BUY", title: "HOŞ GELDİN OPERATÖR.", body: "Kontrolleri bir dakikadan kısa sürede öğren ve sinyali mümkün olduğunca uzağa taşı.", controls: [["AMAÇ", "Her dalgayı atlat"], ["DÖNGÜ", "Hareket · nişan · yükselt"]], tip: "En iyi koşun otomatik kaydedilir." },
          { glyph: "↖", title: "SOL BAŞPARMAKLA HAREKET ET.", body: "Mobilde sol yarıda sürükle; çubuk parmağını takip eder.", controls: [["MOBİL", "Sola sürükle"], ["PC", "WASD / oklar"]], tip: "Bir parmak hareket, diğeri nişan için." },
          { glyph: "✦", title: "NİŞAN AL VE ATEŞ ET.", body: "Sağ yarıya basılı tut. Otomatik ateş başlangıçta açıktır.", controls: [["MOBİL", "Sağda basılı tut"], ["PC", "Fare / Boşluk"]], tip: "Akıllı hedefi değiştirmek için kilide dokun." },
          { glyph: "⇥", title: "TEHLİKEDEN DASH AT.", body: "Hareket ederken DASH'e dokun; kısa süre dokunulmaz olursun.", controls: [["MOBİL", "İki parmak"], ["PC", "E / yön"]], tip: "Dash enerji harcar; yükseltmeler yük ekler." },
          { glyph: "⌕", title: "SINIRIN TAMAMINI GÖR.", body: "Duraklat → Zoom ve 5%'e çek. Tüm ölçekler adil kalır.", controls: [["ZOOM", "5%–132%"], ["TELEFON", "Yatay önerilir"]], tip: "Performans modu efektleri azaltır." },
          { glyph: "◆", title: "BAS, GELİŞTİR, TEKRARLA.", body: "Dalgayı temizle, değeri harca ve mutasyon seç. Her koşu yenidir.", controls: [["YÜKSELTMELER", "Hasar · hız · kalkan"], ["ARŞİV", "Skor · dalga · sırlar"]], tip: "Bu kılavuz ana menüden tekrar açılır." }
        ],
        ja: [
          { glyph: "BUY", title: "ようこそ、オペレーター。", body: "1分以内に操作を覚え、シグナルをできるだけ遠くへ運びましょう。", controls: [["目的", "各ウェーブを生き残る"], ["流れ", "移動 · 狙う · 強化"]], tip: "最高記録は自動保存されます。" },
          { glyph: "↖", title: "左手の親指で移動。", body: "モバイルでは左半分をドラッグ。スティックが指についてきます。", controls: [["モバイル", "左側をドラッグ"], ["PC", "WASD / 矢印"]], tip: "片手で移動、もう片手で照準。" },
          { glyph: "✦", title: "狙って撃つ。", body: "右半分を長押しして照準と射撃。オート射撃は最初からオンです。", controls: [["モバイル", "右側を長押し"], ["PC", "マウス / Space"]], tip: "LOCK-ONで対象を切り替え。" },
          { glyph: "⇥", title: "危険をダッシュで抜ける。", body: "移動中にDASHを押すと短い無敵で突進。2本指操作に対応しています。", controls: [["モバイル", "2本指同時"], ["PC", "E / 方向"]], tip: "エネルギーを消費し、強化で回数が増えます。" },
          { glyph: "⌕", title: "フロンティア全体を見る。", body: "Pause → Zoomを5%まで下げると広い戦術視界。全ての大きさは公平に連動します。", controls: [["ズーム", "5%–132%"], ["スマホ", "横向き推奨"]], tip: "性能モードは光と粒子を抑えます。" },
          { glyph: "◆", title: "押す、強化、繰り返す。", body: "ウェーブを制圧し、価値を使い、変異を選択。毎回新しいルートです。", controls: [["強化", "ダメージ · 速度 · シールド"], ["記録", "スコア · ウェーブ · 秘密"]], tip: "このマニュアルはメニューから再表示できます。" }
        ],
        zh: [
          { glyph: "BUY", title: "欢迎，操作员。", body: "不到一分钟掌握操作，把信号带得尽可能远。", controls: [["目标", "存活每一波"], ["循环", "移动 · 瞄准 · 升级"]], tip: "最高纪录会自动保存。" },
          { glyph: "↖", title: "用左手拇指移动。", body: "手机上拖动左半屏，摇杆会跟随手指。", controls: [["手机", "左侧拖动"], ["电脑", "WASD / 方向键"]], tip: "一根手指移动，另一根手指瞄准。" },
          { glyph: "✦", title: "瞄准并射击。", body: "按住右半屏进行瞄准和射击。自动射击默认开启。", controls: [["手机", "右侧长按"], ["电脑", "鼠标 / 空格"]], tip: "点击锁定切换智能目标。" },
          { glyph: "⇥", title: "用冲刺穿过危险。", body: "移动时点击冲刺，可短暂无敌突进；支持双指同时操作。", controls: [["手机", "双指同时"], ["电脑", "E / 方向"]], tip: "冲刺消耗能量，升级可增加次数。" },
          { glyph: "⌕", title: "看清整个边境。", body: "打开暂停 → 镜头缩放，拉到5%获得广阔战术视野，比例始终公平。", controls: [["缩放", "5%–132%"], ["手机", "建议横屏"]], tip: "性能模式会减少光效和粒子。" },
          { glyph: "◆", title: "按下、升级、重复。", body: "清理波次，花费回收价值并选择变异。每局都有新路线。", controls: [["升级", "伤害 · 速度 · 护盾"], ["档案", "分数 · 波次 · 秘密"]], tip: "主菜单随时可以重新打开手册。" }
        ],
        hi: [
          { glyph: "BUY", title: "स्वागत है, ऑपरेटर।", body: "एक मिनट से कम में नियंत्रण सीखें और सिग्नल को जितना दूर हो सके ले जाएँ।", controls: [["लक्ष्य", "हर लहर बचाएँ"], ["चक्र", "चलें · निशाना · अपग्रेड"]], tip: "आपका सर्वश्रेष्ठ रन अपने आप सेव होता है।" },
          { glyph: "↖", title: "बाएँ अंगूठे से चलें।", body: "मोबाइल पर बाईं आधी स्क्रीन खींचें; स्टिक उंगली का पीछा करती है।", controls: [["मोबाइल", "बाईं ओर ड्रैग"], ["पीसी", "WASD / तीर"]], tip: "एक उंगली चलने के लिए, दूसरी निशाने के लिए।" },
          { glyph: "✦", title: "निशाना लगाएँ और फायर करें।", body: "दाईं आधी स्क्रीन दबाकर निशाना और फायर करें। ऑटो-फायर शुरू से चालू है।", controls: [["मोबाइल", "दाईं ओर होल्ड"], ["पीसी", "माउस / Space"]], tip: "स्मार्ट लक्ष्य बदलने के लिए लॉक-ऑन दबाएँ।" },
          { glyph: "⇥", title: "खतरे से DASH करें।", body: "चलते समय DASH दबाएँ और थोड़ी देर अजेय होकर आगे बढ़ें; दो उंगलियाँ साथ चलती हैं।", controls: [["मोबाइल", "दो उंगलियाँ"], ["पीसी", "E / दिशा"]], tip: "DASH ऊर्जा खर्च करता है; अपग्रेड चार्ज बढ़ाते हैं।" },
          { glyph: "⌕", title: "पूरा फ्रंटियर देखें।", body: "Pause → Camera Zoom खोलकर 5% तक खींचें। सभी स्केल साथ बदलते हैं, इसलिए खेल निष्पक्ष रहता है।", controls: [["ज़ूम", "5%–132%"], ["फोन", "लैंडस्केप सुझाया"]], tip: "परफ़ॉर्मेंस मोड चमक और पार्टिकल घटाता है।" },
          { glyph: "◆", title: "दबाएँ, अपग्रेड करें, दोहराएँ।", body: "लहर साफ़ करें, रिकवर मूल्य खर्च करें और म्यूटेशन चुनें। हर रन नया है।", controls: [["अपग्रेड", "डैमेज · गति · शील्ड"], ["आर्काइव", "स्कोर · लहर · रहस्य"]], tip: "यह मैनुअल मुख्य मेन्यू से फिर खोला जा सकता है।" }
        ]
      };
      for (const [code, steps] of Object.entries(tutorialStepLocales)) {
        if (LOCALES[code]) LOCALES[code].tutorialSteps = steps;
      }
      for (const code of LOCALE_CODES) {
        if (!LOCALES[code]) LOCALES[code] = { ...LOCALES.en, ...(compactLocales[code] || {}) };
        else if (code !== "en" && code !== "fa") {
          LOCALES[code] = { ...LOCALES.en, ...LOCALES[code], tutorialSteps: LOCALES[code].tutorialSteps || LOCALES.en.tutorialSteps };
        }
      }
      for (const code of LOCALE_CODES) {
        for (const key of localeFillKeys) {
          if (LOCALES[code][key] === undefined && compactLocales[code]?.[key] !== undefined) {
            LOCALES[code][key] = compactLocales[code][key];
          }
        }
      }
      // Labels that are updated continuously while a run is active live
      // outside the static HTML, so keep them in the same locale pipeline.
      // This prevents a language switch from leaving ON/OFF/READY controls
      // in English while the rest of the HUD is translated.
      const dynamicLocaleLabels = {
        en: { on: "ON", off: "OFF", ready: "READY", levelXp: "LEVEL", buyAgain: "BUY AGAIN" },
        fa: { on: "روشن", off: "خاموش", ready: "آماده", levelXp: "سطح", buyAgain: "دوباره BUY کن" },
        es: { on: "ACT.", off: "APAG.", ready: "LISTO", levelXp: "NIVEL", buyAgain: "COMPRAR DE NUEVO" },
        ar: { on: "تشغيل", off: "إيقاف", ready: "جاهز", levelXp: "مستوى", buyAgain: "اشترِ مجدداً" },
        fr: { on: "ON", off: "OFF", ready: "PRÊT", levelXp: "NIVEAU", buyAgain: "ACHETER À NOUVEAU" },
        de: { on: "AN", off: "AUS", ready: "BEREIT", levelXp: "LEVEL", buyAgain: "NOCHMAL KAUFEN" },
        pt: { on: "LIG.", off: "DESL.", ready: "PRONTO", levelXp: "NÍVEL", buyAgain: "COMPRAR NOVAMENTE" },
        tr: { on: "AÇIK", off: "KAPALI", ready: "HAZIR", levelXp: "SEVİYE", buyAgain: "TEKRAR AL" },
        ja: { on: "オン", off: "オフ", ready: "準備完了", levelXp: "レベル", buyAgain: "もう一度BUY" },
        zh: { on: "开", off: "关", ready: "就绪", levelXp: "等级", buyAgain: "再次购买" },
        hi: { on: "चालू", off: "बंद", ready: "तैयार", levelXp: "स्तर", buyAgain: "फिर खरीदें" }
      };
      for (const code of LOCALE_CODES) {
        LOCALES[code] = { ...LOCALES[code], ...(dynamicLocaleLabels[code] || {}) };
      }
      const manualFireLocaleLabels = {
        en: {
          touchFire: "PRESS // FIRE",
          touchFireHint: "HOLD TO FIRE",
          touchFireAria: "Press and hold to fire",
          desktopFireHint: "HOLD SPACE // FIRE",
          touchGuide: "LEFT DRAG: MOVE · RIGHT SIDE: AIM · PRESS // FIRE: SHOOT · DASH: ESCAPE"
        },
        fa: {
          touchFire: "\u0641\u0634\u0627\u0631 // \u0634\u0644\u06cc\u06a9",
          touchFireHint: "\u0646\u06af\u0647 \u062f\u0627\u0631 \u0628\u0631\u0627\u06cc \u0634\u0644\u06cc\u06a9",
          touchFireAria: "\u0628\u0631\u0627\u06cc \u0634\u0644\u06cc\u06a9 \u0646\u06af\u0647 \u062f\u0627\u0631\u06cc\u062f",
          desktopFireHint: "\u0646\u06af\u0647 \u062f\u0627\u0634\u062a\u0646 SPACE // \u0634\u0644\u06cc\u06a9",
          touchGuide: "\u06a9\u0634\u06cc\u062f\u0646 \u0686\u067e: \u062d\u0631\u06a9\u062a \u00b7 \u0633\u0645\u062a \u0631\u0627\u0633\u062a: \u0647\u062f\u0641 \u00b7 PRESS // FIRE: \u0634\u0644\u06cc\u06a9 \u00b7 DASH: \u0641\u0631\u0627\u0631"
        }
      };
      for (const code of LOCALE_CODES) {
        LOCALES[code] = { ...LOCALES[code], ...(manualFireLocaleLabels[code] || manualFireLocaleLabels.en) };
      }
      // Every visible surface, including generated HUD cards and
      // accessibility text, goes through the same locale pipeline.  These
      // labels are kept separate from the story copy above so a language
      // switch can refresh the live game without rebuilding the document.
      const runtimeUiLabels = {
        en: {
          canvasLabel: "BUY BUTTON signal run game canvas",
          canvasSupportTitle: "CANVAS SUPPORT REQUIRED",
          canvasSupportBody: "This arcade build needs a current browser with HTML5 Canvas enabled. Update Chrome, Edge, Firefox, or Safari, then reopen this file.",
          javascriptTitle: "JAVASCRIPT REQUIRED",
          javascriptBody: "Enable JavaScript in this browser, then reopen the game.",
          mainMenuLabel: "Main menu", savedRecordsLabel: "Saved records", chooseLanguage: "Choose language",
          artStamp: "SIGNAL RESTORED / 4663", briefingLabel: "Mission briefing",
          briefingQuote: "“Every gate is a rule someone forgot to question. Every wave is a chance to press back.”",
          briefingOperator: "— SIGNAL LOG / UNKNOWN OPERATOR", shopLabel: "Upgrade terminal",
          levelupLabel: "Level up choices", levelProgress: "LEVEL 1 // NEXT BREAKTHROUGH 100 XP",
          easterLabel: "Easter egg archive", pauseLabel: "Paused", settingsLabel: "Game settings",
          gameoverLabel: "Run complete", gameInterfaceLabel: "Game interface", bossPhase: "PHASE 1",
          touchDashAria: "Dash while moving", eggPowerTitle: "X activates the selected power. Shift-click or Z changes the route.",
          eggPowerLocked: "ECHO // LOCKED", levelHud: "LEVEL 1 // 0/100 XP",
          autoFireLabel: "MANUAL FIRE // SPACE", touchGuideClose: "Close touch guide",
          ready: "READY", levelShort: "LV", patch: "PATCH", max: "MAX", equipped: "EQUIPPED",
          online: "ONLINE", active: "ACTIVE", contract: "CONTRACT", bossLabel: "BOSS", eliteLabel: "ELITE",
          threatLabel: "THREAT", phase: "PHASE", tier: "TIER", secured: "CACHE SECURED",
          openBook: "OPEN BOOK", combo: "COMBO", xp: "XP", seconds: "s", times: "X",
          castEggPower: "Cast {power} Easter power", eggPowerLocked: "Easter power echo locked"
        },
        fa: {
          canvasLabel: "بوم بازی ران سیگنال BUY BUTTON",
          canvasSupportTitle: "پشتیبانی از Canvas لازم است",
          canvasSupportBody: "این نسخهٔ آرکید به مرورگر به‌روز با Canvas HTML5 نیاز دارد. Chrome، Edge، Firefox یا Safari را به‌روز کن و فایل را دوباره باز کن.",
          javascriptTitle: "جاوااسکریپت لازم است", javascriptBody: "جاوااسکریپت را در این مرورگر فعال کن و بازی را دوباره باز کن.",
          mainMenuLabel: "منوی اصلی", savedRecordsLabel: "رکوردهای ذخیره‌شده", chooseLanguage: "انتخاب زبان",
          artStamp: "سیگنال بازیابی شد / ۴۶۶۳", briefingLabel: "توضیح مأموریت",
          briefingQuote: "«هر دروازه قانونی است که کسی فراموش کرده به چالش بکشد؛ هر موج فرصتی برای فشار برگشت است.»",
          briefingOperator: "— گزارش سیگنال / اپراتور ناشناس", shopLabel: "ترمینال ارتقا",
          levelupLabel: "انتخاب‌های ارتقا", levelProgress: "سطح ۱ // جهش بعدی ۱۰۰ XP",
          easterLabel: "آرشیو ایستراِگ", pauseLabel: "مکث", settingsLabel: "تنظیمات بازی",
          gameoverLabel: "پایان ران", gameInterfaceLabel: "رابط بازی", bossPhase: "فاز ۱",
          touchDashAria: "DASH هنگام حرکت", eggPowerTitle: "X توان انتخاب‌شده را فعال می‌کند؛ با Shift+کلیک یا Z مسیر را عوض کن.",
          eggPowerLocked: "اکو // قفل", levelHud: "سطح ۱ // ۰/۱۰۰ XP",
          autoFireLabel: "شلیک دستی // SPACE", touchGuideClose: "بستن راهنمای لمس",
          ready: "آماده", levelShort: "سطح", patch: "ارتقا", max: "حداکثر", equipped: "مجهز",
          online: "فعال", active: "فعال", contract: "قرارداد", bossLabel: "باس", eliteLabel: "الیت",
          threatLabel: "تهدید", phase: "فاز", tier: "رده", secured: "کش امن شد",
          openBook: "دفتر باز", combo: "کمبو", xp: "XP", seconds: "ثانیه", times: "بار",
          castEggPower: "اجرای توان ایسترگ {power}", eggPowerLocked: "اکوی توان ایسترگ قفل است"
        },
        es: {
          canvasLabel: "Lienzo de la partida BUY BUTTON", canvasSupportTitle: "SE REQUIERE SOPORTE CANVAS",
          canvasSupportBody: "Esta versión arcade necesita un navegador actual con Canvas HTML5. Actualiza Chrome, Edge, Firefox o Safari y vuelve a abrir el archivo.",
          javascriptTitle: "SE REQUIERE JAVASCRIPT", javascriptBody: "Activa JavaScript en este navegador y vuelve a abrir el juego.",
          mainMenuLabel: "Menú principal", savedRecordsLabel: "Récords guardados", chooseLanguage: "Elegir idioma",
          artStamp: "SEÑAL RESTAURADA / 4663", briefingLabel: "Briefing de misión",
          briefingQuote: "«Cada puerta es una regla que alguien olvidó cuestionar; cada ola es una oportunidad de responder.»",
          briefingOperator: "— REGISTRO DE SEÑAL / OPERADOR DESCONOCIDO", shopLabel: "Terminal de mejoras",
          levelupLabel: "Elecciones de nivel", levelProgress: "NIVEL 1 // PRÓXIMO AVANCE 100 XP",
          easterLabel: "Archivo de easter eggs", pauseLabel: "En pausa", settingsLabel: "Ajustes del juego",
          gameoverLabel: "Partida terminada", gameInterfaceLabel: "Interfaz del juego", bossPhase: "FASE 1",
          touchDashAria: "DASH mientras te mueves", eggPowerTitle: "X activa el poder elegido. Shift-clic o Z cambia la ruta.",
          eggPowerLocked: "ECO // BLOQUEADO", levelHud: "NIVEL 1 // 0/100 XP",
          autoFireLabel: "DISPARO MANUAL // ESPACIO", touchGuideClose: "Cerrar guía táctil",
          ready: "LISTO", levelShort: "NIV", patch: "MEJORA", max: "MÁX", equipped: "EQUIPADO",
          online: "ACTIVO", active: "ACTIVO", contract: "CONTRATO", bossLabel: "JEFE", eliteLabel: "ÉLITE",
          threatLabel: "AMENAZA", phase: "FASE", tier: "NIVEL", secured: "CAJA ASEGURADA",
          openBook: "LIBRO ABIERTO", combo: "COMBO", xp: "XP", seconds: "s", times: "VECES",
          castEggPower: "Activar poder secreto {power}", eggPowerLocked: "Eco de poder secreto bloqueado"
        },
        ar: {
          canvasLabel: "لوحة لعبة BUY BUTTON", canvasSupportTitle: "يلزم دعم Canvas",
          canvasSupportBody: "تحتاج هذه النسخة إلى متصفح حديث يدعم Canvas HTML5. حدّث Chrome أو Edge أو Firefox أو Safari ثم افتح الملف مجدداً.",
          javascriptTitle: "يلزم JavaScript", javascriptBody: "فعّل JavaScript في هذا المتصفح ثم افتح اللعبة مجدداً.",
          mainMenuLabel: "القائمة الرئيسية", savedRecordsLabel: "السجلات المحفوظة", chooseLanguage: "اختر اللغة",
          artStamp: "عادت الإشارة / 4663", briefingLabel: "موجز المهمة",
          briefingQuote: "«كل بوابة قاعدة نسي أحدهم مساءلتها؛ وكل موجة فرصة للضغط من جديد.»",
          briefingOperator: "— سجل الإشارة / مشغّل مجهول", shopLabel: "محطة التطوير",
          levelupLabel: "اختيارات المستوى", levelProgress: "المستوى 1 // الاختراق التالي 100 XP",
          easterLabel: "أرشيف الأسرار", pauseLabel: "متوقف", settingsLabel: "إعدادات اللعبة",
          gameoverLabel: "انتهت الجولة", gameInterfaceLabel: "واجهة اللعبة", bossPhase: "المرحلة 1",
          touchDashAria: "اندفع أثناء الحركة", eggPowerTitle: "X يفعّل القوة المختارة؛ Shift+نقرة أو Z يغيّر المسار.",
          eggPowerLocked: "صدى // مقفل", levelHud: "المستوى 1 // 0/100 XP",
          autoFireLabel: "إطلاق يدوي // SPACE", touchGuideClose: "إغلاق دليل اللمس",
          ready: "جاهز", levelShort: "مستوى", patch: "تطوير", max: "أقصى", equipped: "مجهز",
          online: "نشط", active: "نشط", contract: "عقد", bossLabel: "زعيم", eliteLabel: "نخبة",
          threatLabel: "تهديد", phase: "مرحلة", tier: "رتبة", secured: "تم تأمين المخزون",
          openBook: "سجل مفتوح", combo: "كومبو", xp: "XP", seconds: "ث", times: "مرات",
          castEggPower: "فعّل القوة السرية {power}", eggPowerLocked: "صدى القوة السرية مقفل"
        },
        fr: {
          canvasLabel: "Canevas de la partie BUY BUTTON", canvasSupportTitle: "SUPPORT CANVAS REQUIS",
          canvasSupportBody: "Cette version arcade nécessite un navigateur récent avec Canvas HTML5. Mettez Chrome, Edge, Firefox ou Safari à jour puis rouvrez le fichier.",
          javascriptTitle: "JAVASCRIPT REQUIS", javascriptBody: "Activez JavaScript dans ce navigateur puis rouvrez le jeu.",
          mainMenuLabel: "Menu principal", savedRecordsLabel: "Records sauvegardés", chooseLanguage: "Choisir la langue",
          artStamp: "SIGNAL RESTAURÉ / 4663", briefingLabel: "Briefing de mission",
          briefingQuote: "«Chaque porte est une règle oubliée; chaque vague est une chance de riposter.»",
          briefingOperator: "— JOURNAL DU SIGNAL / OPÉRATEUR INCONNU", shopLabel: "Terminal d’amélioration",
          levelupLabel: "Choix de niveau", levelProgress: "NIVEAU 1 // PROCHAIN ESSOR 100 XP",
          easterLabel: "Archive des easter eggs", pauseLabel: "En pause", settingsLabel: "Paramètres du jeu",
          gameoverLabel: "Run terminé", gameInterfaceLabel: "Interface du jeu", bossPhase: "PHASE 1",
          touchDashAria: "DASH en mouvement", eggPowerTitle: "X active le pouvoir choisi. Shift-clic ou Z change la route.",
          eggPowerLocked: "ÉCHO // VERROUILLÉ", levelHud: "NIVEAU 1 // 0/100 XP",
          autoFireLabel: "TIR MANUEL // ESPACE", touchGuideClose: "Fermer le guide tactile",
          ready: "PRÊT", levelShort: "NIV", patch: "PATCH", max: "MAX", equipped: "ÉQUIPÉ",
          online: "ACTIF", active: "ACTIF", contract: "CONTRAT", bossLabel: "BOSS", eliteLabel: "ÉLITE",
          threatLabel: "MENACE", phase: "PHASE", tier: "RANG", secured: "CACHE SÉCURISÉ",
          openBook: "LIVRE OUVERT", combo: "COMBO", xp: "XP", seconds: "s", times: "FOIS",
          castEggPower: "Lancer le pouvoir secret {power}", eggPowerLocked: "Écho du pouvoir secret verrouillé"
        },
        de: {
          canvasLabel: "BUY BUTTON Signal-Run-Canvas", canvasSupportTitle: "CANVAS-UNTERSTÜTZUNG ERFORDERLICH",
          canvasSupportBody: "Diese Arcade-Version benötigt einen aktuellen Browser mit aktiviertem HTML5-Canvas. Aktualisiere Chrome, Edge, Firefox oder Safari und öffne die Datei erneut.",
          javascriptTitle: "JAVASCRIPT ERFORDERLICH", javascriptBody: "Aktiviere JavaScript in diesem Browser und öffne das Spiel erneut.",
          mainMenuLabel: "Hauptmenü", savedRecordsLabel: "Gespeicherte Rekorde", chooseLanguage: "Sprache wählen",
          artStamp: "SIGNAL WIEDERHERGESTELLT / 4663", briefingLabel: "Missionsbriefing",
          briefingQuote: "„Jedes Tor ist eine Regel, die niemand mehr hinterfragt; jede Welle ist eine Chance zum Gegenschlag.“",
          briefingOperator: "— SIGNALPROTOKOLL / UNBEKANNTER OPERATOR", shopLabel: "Upgrade-Terminal",
          levelupLabel: "Levelwahl", levelProgress: "LEVEL 1 // NÄCHSTER DURCHBRUCH 100 XP",
          easterLabel: "Easter-Egg-Archiv", pauseLabel: "Pausiert", settingsLabel: "Spieleinstellungen",
          gameoverLabel: "Lauf beendet", gameInterfaceLabel: "Spieloberfläche", bossPhase: "PHASE 1",
          touchDashAria: "Dash während der Bewegung", eggPowerTitle: "X aktiviert die gewählte Kraft. Shift-Klick oder Z wechselt die Route.",
          eggPowerLocked: "ECHO // GESPERRT", levelHud: "LEVEL 1 // 0/100 XP",
          autoFireLabel: "MANUELLES FEUER // LEERTASTE", touchGuideClose: "Touch-Hilfe schließen",
          ready: "BEREIT", levelShort: "LV", patch: "PATCH", max: "MAX", equipped: "AUSGERÜSTET",
          online: "AKTIV", active: "AKTIV", contract: "VERTRAG", bossLabel: "BOSS", eliteLabel: "ELITE",
          threatLabel: "BEDROHUNG", phase: "PHASE", tier: "RANG", secured: "CACHE GESICHERT",
          openBook: "OFFENES BUCH", combo: "KOMBO", xp: "XP", seconds: "s", times: "MAL",
          castEggPower: "Easter-Kraft {power} wirken", eggPowerLocked: "Easter-Kraft-Echo gesperrt"
        },
        pt: {
          canvasLabel: "Canvas da partida BUY BUTTON", canvasSupportTitle: "SUPORTE A CANVAS NECESSÁRIO",
          canvasSupportBody: "Esta versão arcade precisa de um navegador atual com Canvas HTML5 ativado. Atualize Chrome, Edge, Firefox ou Safari e reabra o arquivo.",
          javascriptTitle: "JAVASCRIPT NECESSÁRIO", javascriptBody: "Ative o JavaScript neste navegador e reabra o jogo.",
          mainMenuLabel: "Menu principal", savedRecordsLabel: "Recordes salvos", chooseLanguage: "Escolher idioma",
          artStamp: "SINAL RESTAURADO / 4663", briefingLabel: "Briefing da missão",
          briefingQuote: "“Cada portão é uma regra que alguém esqueceu de questionar; cada onda é uma chance de reagir.”",
          briefingOperator: "— REGISTRO DO SINAL / OPERADOR DESCONHECIDO", shopLabel: "Terminal de melhorias",
          levelupLabel: "Escolhas de nível", levelProgress: "NÍVEL 1 // PRÓXIMO AVANÇO 100 XP",
          easterLabel: "Arquivo de easter eggs", pauseLabel: "Pausado", settingsLabel: "Configurações do jogo",
          gameoverLabel: "Partida encerrada", gameInterfaceLabel: "Interface do jogo", bossPhase: "FASE 1",
          touchDashAria: "Dash enquanto se move", eggPowerTitle: "X ativa o poder escolhido. Shift-clique ou Z muda a rota.",
          eggPowerLocked: "ECO // BLOQUEADO", levelHud: "NÍVEL 1 // 0/100 XP",
          autoFireLabel: "TIRO MANUAL // ESPAÇO", touchGuideClose: "Fechar guia de toque",
          ready: "PRONTO", levelShort: "NV", patch: "PATCH", max: "MÁX", equipped: "EQUIPADO",
          online: "ATIVO", active: "ATIVO", contract: "CONTRATO", bossLabel: "CHEFE", eliteLabel: "ELITE",
          threatLabel: "AMEAÇA", phase: "FASE", tier: "NÍVEL", secured: "CACHE PROTEÍDO",
          openBook: "LIVRO ABERTO", combo: "COMBO", xp: "XP", seconds: "s", times: "VEZES",
          castEggPower: "Ativar poder secreto {power}", eggPowerLocked: "Eco do poder secreto bloqueado"
        },
        tr: {
          canvasLabel: "BUY BUTTON sinyal koşusu tuvali", canvasSupportTitle: "CANVAS DESTEĞİ GEREKLİ",
          canvasSupportBody: "Bu arcade sürümü Canvas HTML5 etkin güncel bir tarayıcı ister. Chrome, Edge, Firefox veya Safari'yi güncelle ve dosyayı yeniden aç.",
          javascriptTitle: "JAVASCRIPT GEREKLİ", javascriptBody: "Bu tarayıcıda JavaScript'i etkinleştir ve oyunu yeniden aç.",
          mainMenuLabel: "Ana menü", savedRecordsLabel: "Kayıtlı rekorlar", chooseLanguage: "Dil seç",
          artStamp: "SİNYAL GERİ YÜKLENDİ / 4663", briefingLabel: "Görev özeti",
          briefingQuote: "“Her kapı sorgulanmayı unutmuş bir kuraldır; her dalga karşılık verme şansıdır.”",
          briefingOperator: "— SİNYAL GÜNLÜĞÜ / BİLİNMEYEN OPERATÖR", shopLabel: "Yükseltme terminali",
          levelupLabel: "Seviye seçimleri", levelProgress: "SEVİYE 1 // SONRAKİ ATILIM 100 XP",
          easterLabel: "Easter egg arşivi", pauseLabel: "Duraklatıldı", settingsLabel: "Oyun ayarları",
          gameoverLabel: "Koşu bitti", gameInterfaceLabel: "Oyun arayüzü", bossPhase: "AŞAMA 1",
          touchDashAria: "Hareket ederken dash", eggPowerTitle: "X seçili gücü etkinleştirir. Shift-tık veya Z rotayı değiştirir.",
          eggPowerLocked: "EKO // KİLİTLİ", levelHud: "SEVİYE 1 // 0/100 XP",
          autoFireLabel: "MANUEL ATIŞ // SPACE", touchGuideClose: "Dokunma yardımını kapat",
          ready: "HAZIR", levelShort: "SV", patch: "YÜKSELT", max: "MAKS", equipped: "TAKILI",
          online: "ETKİN", active: "AKTİF", contract: "SÖZLEŞME", bossLabel: "BOSS", eliteLabel: "ELİT",
          threatLabel: "TEHDİT", phase: "AŞAMA", tier: "KADEME", secured: "KASA KİLİTLENDİ",
          openBook: "AÇIK DEFTER", combo: "KOMBO", xp: "XP", seconds: "sn", times: "KEZ",
          castEggPower: "{power} gizli gücünü kullan", eggPowerLocked: "Gizli güç yankısı kilitli"
        },
        ja: {
          canvasLabel: "BUY BUTTON シグナルランのキャンバス", canvasSupportTitle: "CANVAS 対応が必要です",
          canvasSupportBody: "このアーケード版には HTML5 Canvas 対応の最新ブラウザが必要です。Chrome、Edge、Firefox、Safari を更新して再度開いてください。",
          javascriptTitle: "JAVASCRIPT が必要です", javascriptBody: "このブラウザで JavaScript を有効にしてゲームを再度開いてください。",
          mainMenuLabel: "メインメニュー", savedRecordsLabel: "保存記録", chooseLanguage: "言語を選択",
          artStamp: "シグナル復旧 / 4663", briefingLabel: "ミッション概要",
          briefingQuote: "「すべてのゲートは誰かが疑うのを忘れたルール。すべてのウェーブは押し返す機会だ。」",
          briefingOperator: "— シグナルログ / 不明なオペレーター", shopLabel: "アップグレード端末",
          levelupLabel: "レベル選択", levelProgress: "レベル1 // 次の突破 100 XP",
          easterLabel: "イースターエッグ記録", pauseLabel: "一時停止", settingsLabel: "ゲーム設定",
          gameoverLabel: "ラン終了", gameInterfaceLabel: "ゲーム画面", bossPhase: "フェーズ1",
          touchDashAria: "移動中にダッシュ", eggPowerTitle: "Xで選択中の力を発動。ShiftクリックまたはZでルート変更。",
          eggPowerLocked: "エコー // ロック中", levelHud: "レベル1 // 0/100 XP",
          autoFireLabel: "手動射撃 // SPACE", touchGuideClose: "タッチガイドを閉じる",
          ready: "準備完了", levelShort: "LV", patch: "強化", max: "最大", equipped: "装備中",
          online: "起動", active: "有効", contract: "契約", bossLabel: "ボス", eliteLabel: "エリート",
          threatLabel: "脅威", phase: "フェーズ", tier: "階級", secured: "キャッシュ確保",
          openBook: "オープンブック", combo: "コンボ", xp: "XP", seconds: "秒", times: "回",
          castEggPower: "秘密の力 {power} を発動", eggPowerLocked: "秘密の力のエコーはロック中"
        },
        zh: {
          canvasLabel: "BUY BUTTON 信号奔跑画布", canvasSupportTitle: "需要 Canvas 支持",
          canvasSupportBody: "此街机版本需要支持 HTML5 Canvas 的现代浏览器。请更新 Chrome、Edge、Firefox 或 Safari 后重新打开文件。",
          javascriptTitle: "需要 JAVASCRIPT", javascriptBody: "请在此浏览器启用 JavaScript，然后重新打开游戏。",
          mainMenuLabel: "主菜单", savedRecordsLabel: "已保存记录", chooseLanguage: "选择语言",
          artStamp: "信号已恢复 / 4663", briefingLabel: "任务简报",
          briefingQuote: "“每道门都是被遗忘的规则；每一波都是反击的机会。”",
          briefingOperator: "— 信号日志 / 未知操作员", shopLabel: "升级终端",
          levelupLabel: "等级选择", levelProgress: "等级 1 // 下一次突破 100 XP",
          easterLabel: "彩蛋档案", pauseLabel: "已暂停", settingsLabel: "游戏设置",
          gameoverLabel: "本局结束", gameInterfaceLabel: "游戏界面", bossPhase: "阶段 1",
          touchDashAria: "移动时冲刺", eggPowerTitle: "X 激活当前能力；Shift 点击或 Z 切换路线。",
          eggPowerLocked: "回声 // 已锁定", levelHud: "等级 1 // 0/100 XP",
          autoFireLabel: "手动射击 // SPACE", touchGuideClose: "关闭触控提示",
          ready: "就绪", levelShort: "等级", patch: "升级", max: "最大", equipped: "已装备",
          online: "已启动", active: "生效", contract: "合约", bossLabel: "首领", eliteLabel: "精英",
          threatLabel: "威胁", phase: "阶段", tier: "阶位", secured: "缓存已锁定",
          openBook: "开放账本", combo: "连击", xp: "XP", seconds: "秒", times: "次",
          castEggPower: "释放彩蛋能力 {power}", eggPowerLocked: "彩蛋能力回声已锁定"
        },
        hi: {
          canvasLabel: "BUY BUTTON सिग्नल रन कैनवास", canvasSupportTitle: "CANVAS समर्थन आवश्यक",
          canvasSupportBody: "इस आर्केड संस्करण के लिए HTML5 Canvas वाला आधुनिक ब्राउज़र चाहिए। Chrome, Edge, Firefox या Safari अपडेट करके फ़ाइल फिर खोलें।",
          javascriptTitle: "JAVASCRIPT आवश्यक", javascriptBody: "इस ब्राउज़र में JavaScript चालू करें और गेम फिर खोलें।",
          mainMenuLabel: "मुख्य मेन्यू", savedRecordsLabel: "सहेजे रिकॉर्ड", chooseLanguage: "भाषा चुनें",
          artStamp: "सिग्नल बहाल / 4663", briefingLabel: "मिशन विवरण",
          briefingQuote: "“हर द्वार एक भूला हुआ नियम है; हर लहर पलटवार का अवसर है।”",
          briefingOperator: "— सिग्नल लॉग / अज्ञात ऑपरेटर", shopLabel: "अपग्रेड टर्मिनल",
          levelupLabel: "स्तर विकल्प", levelProgress: "स्तर 1 // अगली छलांग 100 XP",
          easterLabel: "ईस्टर एग संग्रह", pauseLabel: "रुका हुआ", settingsLabel: "गेम सेटिंग",
          gameoverLabel: "रन समाप्त", gameInterfaceLabel: "गेम इंटरफ़ेस", bossPhase: "चरण 1",
          touchDashAria: "चलते समय DASH", eggPowerTitle: "X चुनी शक्ति चलाता है; Shift-क्लिक या Z मार्ग बदलता है।",
          eggPowerLocked: "इको // लॉक", levelHud: "स्तर 1 // 0/100 XP",
          autoFireLabel: "मैनुअल फायर // SPACE", touchGuideClose: "टच गाइड बंद करें",
          ready: "तैयार", levelShort: "स्तर", patch: "अपग्रेड", max: "अधिकतम", equipped: "सुसज्जित",
          online: "सक्रिय", active: "चालू", contract: "अनुबंध", bossLabel: "बॉस", eliteLabel: "एलिट",
          threatLabel: "खतरा", phase: "चरण", tier: "श्रेणी", secured: "कैश सुरक्षित",
          openBook: "खुली किताब", combo: "कॉम्बो", xp: "XP", seconds: "सेकंड", times: "बार",
          castEggPower: "ईस्टर शक्ति {power} चलाएँ", eggPowerLocked: "ईस्टर शक्ति इको लॉक है"
        }
      };
      for (const code of LOCALE_CODES) {
        LOCALES[code] = { ...LOCALES[code], ...(runtimeUiLabels[code] || runtimeUiLabels.en) };
      }
      // A live run is separate from the score archive: it is a recoverable
      // checkpoint that lets a player safely return after closing the page.
      // English remains the fallback until each locale receives its own copy.
      const runSaveUiLabels = {
        en: {
          checkpointFound: "CHECKPOINT FOUND // RUN RECOVERABLE",
          checkpointSummary: "WAVE {wave} // SCORE {score} // VALUE {coins} // SAVED {time}",
          resumeSavedRun: "RESUME SAVED RUN",
          discardSavedRun: "DISCARD SAVE",
          checkpointRestored: "RUN RESTORED // CHECKPOINT LOADED",
          checkpointDiscarded: "SAVED RUN DISCARDED",
          checkpointInvalid: "CHECKPOINT INVALID // START A NEW RUN"
        },
        fa: {
          checkpointFound: "\u0630\u062e\u06cc\u0631\u0647\u0654 \u0627\u0645\u0646 \u067e\u06cc\u062f\u0627 \u0634\u062f // \u0631\u0627\u0646 \u0642\u0627\u0628\u0644 \u0627\u062f\u0627\u0645\u0647 \u0627\u0633\u062a",
          checkpointSummary: "\u0645\u0648\u062c {wave} // \u0627\u0645\u062a\u06cc\u0627\u0632 {score} // \u0627\u0631\u0632\u0634 {coins} // \u0630\u062e\u06cc\u0631\u0647 {time}",
          resumeSavedRun: "\u0627\u062f\u0627\u0645\u0647 \u0627\u0632 \u0630\u062e\u06cc\u0631\u0647",
          discardSavedRun: "\u062d\u0630\u0641 \u0630\u062e\u06cc\u0631\u0647",
          checkpointRestored: "\u0631\u0627\u0646 \u0628\u0627\u0632\u06cc\u0627\u0628\u06cc \u0634\u062f // \u0627\u0632 \u0622\u062e\u0631\u06cc\u0646 \u0646\u0642\u0637\u0647 \u0627\u062f\u0627\u0645\u0647 \u0628\u062f\u0647",
          checkpointDiscarded: "\u0630\u062e\u06cc\u0631\u0647 \u062d\u0630\u0641 \u0634\u062f",
          checkpointInvalid: "\u0630\u062e\u06cc\u0631\u0647 \u0645\u0639\u062a\u0628\u0631 \u0646\u0628\u0648\u062f // \u0631\u0627\u0646 \u062a\u0627\u0632\u0647 \u0631\u0627 \u0634\u0631\u0648\u0639 \u06a9\u0646"
        }
      };
      for (const code of LOCALE_CODES) {
        LOCALES[code] = { ...LOCALES[code], ...(runSaveUiLabels[code] || runSaveUiLabels.en) };
      }
      const runtimeCommonRows = {
        recovered: ["RECOVERED", "بازیابی شد", "RECUPERADO", "مسترد", "RÉCUPÉRÉ", "GEBORGEN", "RECUPERADO", "KURTARILDI", "回収済み", "已回收", "मिला"],
        signalLocked: ["SIGNAL LOCKED", "سیگنال قفل است", "SEÑAL BLOQUEADA", "الإشارة مقفلة", "SIGNAL VERROUILLÉ", "SIGNAL GESPERRT", "SINAL BLOQUEADO", "SİNYAL KİLİTLİ", "シグナルロック中", "信号已锁定", "सिग्नल लॉक"],
        unknownTrace: ["UNKNOWN TRACE", "ردپای ناشناخته", "TRAZA DESCONOCIDA", "أثر مجهول", "TRACE INCONNUE", "UNBEKANNTE SPUR", "RASTRO DESCONHECIDO", "BİLİNMEYEN İZ", "未知の痕跡", "未知线索", "अज्ञात ट्रेस"],
        unknownTraceBody: ["The ledger has not decoded this signal yet.", "دفتر هنوز این سیگنال را رمزگشایی نکرده است.", "El registro aún no ha decodificado esta señal.", "لم يفك السجل هذه الإشارة بعد.", "Le registre n’a pas encore décodé ce signal.", "Das Ledger hat dieses Signal noch nicht entschlüsselt.", "O livro ainda não decodificou este sinal.", "Defter bu sinyali henüz çözmedi.", "台帳はまだこのシグナルを解読していません。", "账本尚未解码此信号。", "लेजर ने अभी यह सिग्नल डिकोड नहीं किया।"],
        archiveMemorySaved: ["ARCHIVE // MEMORY SAVED ON THIS DEVICE", "آرشیو // روی این دستگاه ذخیره شد", "ARCHIVO // MEMORIA GUARDADA EN ESTE DISPOSITIVO", "الأرشيف // حُفظت الذاكرة على هذا الجهاز", "ARCHIVE // MÉMOIRE ENREGISTRÉE SUR CET APPAREIL", "ARCHIV // SPEICHER AUF DIESEM GERÄT GESPEICHERT", "ARQUIVO // MEMÓRIA SALVA NESTE DISPOSITIVO", "ARŞİV // BELLEK BU CİHAZA KAYDEDİLDİ", "アーカイブ // この端末に保存", "档案 // 记忆已保存在本设备", "आर्काइव // इस डिवाइस पर याद सेव"],
        lockedEggAria: ["Locked easter egg", "ایسترگ قفل‌شده", "Easter egg bloqueado", "سر مقفل", "Easter egg verrouillé", "Gesperrtes Easter Egg", "Easter egg bloqueado", "Kilitli easter egg", "ロック中のイースターエッグ", "已锁定彩蛋", "लॉक किया ईस्टर एग"],
        easterEgg: ["EASTER EGG", "ایسترگ", "EASTER EGG", "سر", "EASTER EGG", "EASTER EGG", "EASTER EGG", "EASTER EGG", "イースターエッグ", "彩蛋", "ईस्टर एग"],
        hiddenLedger: ["HIDDEN LEDGER", "دفتر مخفی", "REGISTRO OCULTO", "السجل المخفي", "REGISTRE CACHÉ", "GEHEIMES LEDGER", "LIVRO OCULTO", "GİZLİ DEFTER", "隠し台帳", "隐藏账本", "गुप्त लेजर"],
        legendaryTrace: ["LEGENDARY TRACE", "ردپای افسانه‌ای", "TRAZA LEGENDARIA", "أثر أسطوري", "TRACE LÉGENDAIRE", "LEGENDÄRE SPUR", "RASTRO LENDÁRIO", "EFSANE İZİ", "伝説の痕跡", "传奇线索", "लेजेंडरी ट्रेस"],
        target: ["TARGET", "هدف", "OBJETIVO", "هدف", "CIBLE", "ZIEL", "ALVO", "HEDEF", "ターゲット", "目标", "लक्ष्य"],
        bootSector: ["BOOT SECTOR", "بخش راه‌اندازی", "SECTOR DE ARRANQUE", "قطاع الإقلاع", "SECTEUR DE DÉMARRAGE", "STARTSEKTOR", "SETOR DE INICIALIZAÇÃO", "BAŞLANGIÇ SEKTÖRÜ", "ブートセクター", "启动扇区", "बूट सेक्टर"],
        mempoolRush: ["MEMPOOL RUSH", "هجوم مم‌پول", "EMPUJE DEL MEMPOOL", "اندفاع الذاكرة", "RUÉE DU MEMPOOL", "MEMPOOL-RUSH", "CORRIDA DO MEMPOOL", "MEMPOOL AKINI", "メンプールラッシュ", "内存池冲刺", "मेमपूल रश"],
        slippageFields: ["SLIPPAGE FIELDS", "میدان لغزش", "CAMPOS DE DESLIZAMIENTO", "حقول الانزلاق", "CHAMPS DE GLISSEMENT", "SLIPPAGE-FELDER", "CAMPOS DE DESLIZE", "KAYMA ALANLARI", "スリッページフィールド", "滑点区域", "स्लिपेज फ़ील्ड"],
        sequencerRing: ["SEQUENCER RING", "حلقهٔ ترتیب‌دهنده", "ANILLO SECUENCIADOR", "حلقة التسلسل", "ANNEAU SÉQUENCEUR", "SEQUENZERRING", "ANEL SEQUENCIADOR", "SIRALAYICI HALKASI", "シーケンサーリング", "排序环", "सीक्वेंसर रिंग"]
      };
      for (const [key, row] of Object.entries(runtimeCommonRows)) {
        for (const code of LOCALE_CODES) {
          const slot = LOCALE_CODES.indexOf(code);
          LOCALES[code][key] = row[slot] || row[0];
        }
      }
      // Competitive archive labels are kept as compact rows too, so the
      // leaderboard remains fully translated even when it is opened from a
      // running session or a narrow landscape phone.
      const leaderboardLocaleRows = {
        leaderboardOpen: ["OPEN LEGENDS BOARD", "باز کردن جدول افسانه‌ها", "ABRIR TABLA DE LEYENDAS", "فتح لوحة الأساطير", "OUVRIR LE CLASSEMENT DES LÉGENDES", "LEGENDENLISTE ÖFFNEN", "ABRIR QUADRO DAS LENDAS", "EFSANELER TABLOSUNU AÇ", "レジェンドボードを開く", "打开传奇榜", "लेजेंड्स बोर्ड खोलें"],
        leaderboardLabel: ["Legends leaderboard", "جدول رتبه‌بندی افسانه‌ها", "Tabla de leyendas", "لوحة الأساطير", "Classement des légendes", "Legenden-Rangliste", "Quadro das lendas", "Efsaneler liderlik tablosu", "レジェンドランキング", "传奇排行榜", "लेजेंड्स लीडरबोर्ड"],
        leaderboardEyebrow: ["GLOBAL ARCHIVE // LEGENDS ONLY", "آرشیو جهانی // فقط افسانه‌ها", "ARCHIVO GLOBAL // SOLO LEYENDAS", "الأرشيف العالمي // للأساطير فقط", "ARCHIVE GLOBAL // LÉGENDES UNIQUEMENT", "GLOBALES ARCHIV // NUR LEGENDEN", "ARQUIVO GLOBAL // SÓ LENDAS", "GLOBAL ARŞİV // SADECE EFSANELER", "グローバルアーカイブ // レジェンド限定", "全球档案 // 仅限传奇", "ग्लोबल आर्काइव // केवल लेजेंड्स"],
        leaderboardTitle: ["THE LEGENDS BOARD.", "تابلوی افسانه‌ها.", "EL TABLERO DE LAS LEYENDAS.", "لوحة الأساطير.", "LE TABLEAU DES LÉGENDES.", "DAS LEGENDENBOARD.", "O QUADRO DAS LENDAS.", "EFSANELER TABLOSU.", "レジェンドボード。", "传奇榜。", "लेजेंड्स बोर्ड।"],
        leaderboardBody: ["Push your run higher, earn a level, and leave a masked signal behind. Public boards show aliases only; your Gmail stays private.", "رکوردت را بالاتر ببر، سطح بگیر و یک سیگنال ماسک‌شده جا بگذار. در جدول عمومی فقط نام مستعار دیده می‌شود؛ جیمیل خصوصی می‌ماند.", "Sube tu partida, gana nivel y deja una señal oculta. La tabla pública muestra solo alias; tu Gmail permanece privado.", "ارفع جولتك، اكسب مستوى واترك إشارة مقنّعة. تعرض اللوحة الاسم المستعار فقط؛ يبقى Gmail خاصاً.", "Faites monter votre run, gagnez des niveaux et laissez un signal masqué. Le classement public n’affiche que les alias; votre Gmail reste privé.", "Bringe deinen Run nach oben, verdiene Level und hinterlasse ein maskiertes Signal. Öffentlich erscheinen nur Aliase; dein Gmail bleibt privat.", "Leve sua corrida, ganhe níveis e deixe um sinal mascarado. O quadro público mostra apenas aliases; seu Gmail fica privado.", "Koşunu yükselt, seviye kazan ve maskeli bir sinyal bırak. Herkese açık tabloda yalnızca takma ad görünür; Gmail’in gizli kalır.", "ランを伸ばしてレベルを獲得し、マスクされたシグナルを残そう。公開ボードにはエイリアスだけ表示され、Gmailは非公開です。", "冲高你的对局，提升等级并留下掩码信号。公开榜只显示昵称；Gmail 保持私密。", "अपना रन ऊपर ले जाएँ, लेवल पाएँ और मास्क किया सिग्नल छोड़ें। सार्वजनिक बोर्ड पर केवल उपनाम दिखेगा; Gmail निजी रहेगा।"],
        leaderboardRefresh: ["REFRESH BOARD", "تازه‌سازی جدول", "ACTUALIZAR TABLA", "تحديث اللوحة", "ACTUALISER", "BOARD AKTUALISIEREN", "ATUALIZAR QUADRO", "TABLOYU YENİLE", "ボードを更新", "刷新排行榜", "बोर्ड रीफ़्रेश करें"],
        leaderboardNotify: ["ENABLE RECORD ALERTS", "فعال‌سازی اعلان رکورد", "ACTIVAR AVISOS DE RÉCORD", "تفعيل تنبيهات الأرقام القياسية", "ACTIVER LES ALERTES DE RECORD", "REKORD-ALARM AKTIVIEREN", "ATIVAR ALERTAS DE RECORDE", "REKOR UYARILARINI AÇ", "記録通知を有効化", "开启新纪录提醒", "रिकॉर्ड अलर्ट चालू करें"],
        leaderboardProfileTitle: ["PLAYER ID // TELEGRAM VERIFIED", "شناسه بازیکن // تلگرام تأییدشده", "ID DEL JUGADOR // TELEGRAM VERIFICADO", "معرّف اللاعب // TELEGRAM موثّق", "ID JOUEUR // TELEGRAM VÉRIFIÉ", "SPIELER-ID // TELEGRAM BESTÄTIGT", "ID DO JOGADOR // TELEGRAM VERIFICADO", "OYUNCU KİMLİĞİ // TELEGRAM DOĞRULANDI", "プレイヤーID // Telegram認証済み", "玩家 ID // Telegram 已验证", "प्लेयर आईडी // TELEGRAM सत्यापित"],
        leaderboardAliasLabel: ["PUBLIC ALIAS", "نام مستعار عمومی", "ALIAS PÚBLICO", "الاسم المستعار العام", "ALIAS PUBLIC", "ÖFFENTLICHER ALIAS", "ALIAS PÚBLICO", "GENEL TAKMA AD", "公開エイリアス", "公开昵称", "सार्वजनिक उपनाम"],
        leaderboardEmailLabel: ["TELEGRAM ACCOUNT", "حساب تلگرام", "CUENTA DE TELEGRAM", "حساب TELEGRAM", "COMPTE TELEGRAM", "TELEGRAM-KONTO", "CONTA DO TELEGRAM", "TELEGRAM HESABI", "Telegramアカウント", "TELEGRAM 账户", "TELEGRAM खाता"],
        leaderboardAliasPlaceholder: ["Legendary Operator", "اپراتور افسانه‌ای", "Operador legendario", "المشغّل الأسطوري", "Opérateur légendaire", "Legendärer Operator", "Operador lendário", "Efsane Operatör", "伝説のオペレーター", "传奇操作员", "लेजेंडरी ऑपरेटर"],
        leaderboardEmailPlaceholder: ["VERIFIED IN TELEGRAM", "تأییدشده در تلگرام", "VERIFICADA EN TELEGRAM", "موثّق عبر TELEGRAM", "VÉRIFIÉ DANS TELEGRAM", "IN TELEGRAM BESTÄTIGT", "VERIFICADA NO TELEGRAM", "TELEGRAM'DA DOĞRULANDI", "Telegramで認証済み", "已在 TELEGRAM 中验证", "TELEGRAM में सत्यापित"],
        leaderboardSaveProfile: ["SAVE PLAYER ID", "ذخیره شناسه بازیکن", "GUARDAR ID", "حفظ معرّف اللاعب", "ENREGISTRER L’ID", "SPIELER-ID SPEICHERN", "SALVAR ID", "OYUNCU KİMLİĞİNİ KAYDET", "プレイヤーIDを保存", "保存玩家 ID", "प्लेयर आईडी सेव करें"],
        leaderboardClearProfile: ["CLEAR LOCAL ID", "پاک‌کردن شناسه محلی", "BORRAR ID LOCAL", "مسح المعرّف المحلي", "EFFACER L’ID LOCAL", "LOKALE ID LÖSCHEN", "LIMPAR ID LOCAL", "YEREL KİMLİĞİ TEMİZLE", "ローカルIDを消去", "清除本地 ID", "लोकल आईडी साफ़ करें"],
        leaderboardPrivacy: ["Your email is stored locally for claim verification and is never rendered in the board. A production server should verify Gmail ownership before accepting global submissions.", "ایمیل فقط برای تأیید مالکیت محلی ذخیره می‌شود و هرگز در جدول نمایش داده نمی‌شود. سرور واقعی باید مالکیت جیمیل را پیش از ثبت جهانی تأیید کند.", "Tu email se guarda localmente para verificar la reclamación y nunca aparece en la tabla. Un servidor de producción debe verificar la propiedad de Gmail.", "يُحفظ بريدك محلياً للتحقق ولا يُعرض في اللوحة. يجب على الخادم الإنتاجي التحقق من ملكية Gmail قبل قبول الإرسال.", "Votre email est conservé localement pour vérification et n’est jamais affiché. Un serveur de production doit vérifier la propriété du Gmail.", "Deine E-Mail wird lokal zur Prüfung gespeichert und nie im Board angezeigt. Ein Produktionsserver muss die Gmail-Inhaberschaft prüfen.", "Seu email fica local para validação e nunca aparece no quadro. Um servidor de produção deve verificar a posse do Gmail.", "E-postan doğrulama için yerel tutulur ve tabloda gösterilmez. Üretim sunucusu küresel gönderimden önce Gmail sahipliğini doğrulamalı.", "メールは申請確認のため端末内に保存され、ボードには表示されません。本番サーバーはGmail所有権を確認してください。", "邮箱仅本地保存用于认领验证，榜单不会显示。生产服务器应先验证 Gmail 所有权。", "दावा सत्यापन के लिए ईमेल स्थानीय रूप से रखा जाता है और बोर्ड पर नहीं दिखता। प्रोडक्शन सर्वर को Gmail स्वामित्व सत्यापित करना चाहिए।"],
        leaderboardOnline: ["GLOBAL BOARD ONLINE", "جدول جهانی آنلاین است", "TABLA GLOBAL ACTIVA", "اللوحة العالمية متصلة", "CLASSEMENT GLOBAL EN LIGNE", "GLOBALES BOARD ONLINE", "QUADRO GLOBAL ONLINE", "GLOBAL TABLO ÇEVRİMİÇİ", "グローバルボード接続中", "全球榜在线", "ग्लोबल बोर्ड ऑनलाइन"],
        leaderboardLocal: ["LOCAL / OPEN TABS", "محلی / تب‌های باز", "LOCAL / PESTAÑAS ABIERTAS", "محلي / علامات مفتوحة", "LOCAL / ONGLETS OUVERTS", "LOKAL / OFFENE TABS", "LOCAL / ABAS ABERTAS", "YEREL / AÇIK SEKME", "ローカル / 開いているタブ", "本地 / 已打开标签页", "लोकल / खुले टैब"],
        leaderboardEmpty: ["No claimed runs yet. Finish a run, save your Gmail, and become the first legend.", "هنوز رکوردی ثبت نشده. یک ران را تمام کن، جیمیل را ذخیره کن و اولین افسانه باش.", "Aún no hay partidas reclamadas. Termina una, guarda tu Gmail y sé la primera leyenda.", "لا توجد جولات مُطالَب بها. أنهِ جولة واحفظ Gmail وكن أول أسطورة.", "Aucun run revendiqué. Terminez-en un, enregistrez votre Gmail et devenez la première légende.", "Noch keine beanspruchten Runs. Beende einen, speichere dein Gmail und werde die erste Legende.", "Nenhuma corrida validada. Termine uma, salve seu Gmail e seja a primeira lenda.", "Henüz sahiplenilmiş koşu yok. Bir koşuyu bitir, Gmail’ini kaydet ve ilk efsane ol.", "申請済みのランはまだありません。ランを完了してGmailを保存し、最初のレジェンドになろう。", "还没有认领的对局。完成一局、保存 Gmail，成为第一位传奇。", "अभी कोई दावा किया रन नहीं। रन पूरा करें, Gmail सेव करें और पहली लेजेंड बनें।"],
        leaderboardRank: ["RANK", "رتبه", "RANGO", "الترتيب", "RANG", "RANG", "RANKING", "SIRA", "順位", "排名", "रैंक"],
        leaderboardPlayer: ["PLAYER", "بازیکن", "JUGADOR", "اللاعب", "JOUEUR", "SPIELER", "JOGADOR", "OYUNCU", "プレイヤー", "玩家", "प्लेयर"],
        leaderboardScore: ["SCORE", "امتیاز", "PUNTOS", "النتيجة", "SCORE", "SCORE", "PONTOS", "SKOR", "スコア", "分数", "स्कोर"],
        leaderboardWave: ["WAVE", "موج", "OLA", "موجة", "VAGUE", "WELLE", "ONDA", "DALGA", "ウェーブ", "波次", "लहर"],
        leaderboardLevel: ["LEVEL", "سطح", "NIVEL", "المستوى", "NIVEAU", "LEVEL", "NÍVEL", "SEVİYE", "レベル", "等级", "स्तर"],
        leaderboardValue: ["VALUE", "ارزش", "VALOR", "القيمة", "VALEUR", "WERT", "VALOR", "DEĞER", "価値", "价值", "मूल्य"],
        leaderboardYou: ["YOU", "تو", "TÚ", "أنت", "VOUS", "DU", "VOCÊ", "SEN", "あなた", "你", "आप"],
        leaderboardProfileSaved: ["PLAYER ID SAVED // RECORDS CAN NOW BE CLAIMED", "شناسه بازیکن ذخیره شد // رکوردها قابل ثبت‌اند", "ID GUARDADO // YA PUEDES RECLAMAR RÉCORDS", "تم حفظ المعرّف // يمكن المطالبة بالأرقام", "ID ENREGISTRÉ // LES RECORDS PEUVENT ÊTRE REVENDIQUÉS", "SPIELER-ID GESPEICHERT // REKORDE KÖNNEN BEANSPRUCHT WERDEN", "ID SALVO // OS RECORDES PODEM SER VALIDADOS", "OYUNCU KİMLİĞİ KAYDEDİLDİ // REKORLAR SAHİPLENİLEBİLİR", "プレイヤーID保存済み // 記録を申請できます", "玩家 ID 已保存 // 现在可认领纪录", "प्लेयर आईडी सेव // रिकॉर्ड क्लेम किए जा सकते हैं"],
        leaderboardProfileCleared: ["LOCAL PLAYER ID CLEARED", "شناسه محلی پاک شد", "ID LOCAL BORRADO", "تم مسح المعرّف المحلي", "ID LOCAL EFFACÉ", "LOKALE SPIELER-ID GELÖSCHT", "ID LOCAL LIMPO", "YEREL OYUNCU KİMLİĞİ TEMİZLENDİ", "ローカルプレイヤーIDを消去しました", "本地玩家 ID 已清除", "लोकल प्लेयर आईडी साफ़"],
        leaderboardNeedProfile: ["SAVE A GMAIL PLAYER ID BEFORE CLAIMING A RECORD.", "پیش از ثبت رکورد، شناسه و جیمیل را ذخیره کن.", "GUARDA UN ID CON GMAIL ANTES DE RECLAMAR.", "احفظ معرّف Gmail قبل المطالبة بالرقم.", "ENREGISTREZ UN ID GMAIL AVANT DE REVENDIQUER.", "SPEICHERE ZUERST EINE GMAIL-SPIELER-ID.", "SALVE UM ID COM GMAIL ANTES DE VALIDAR.", "REKOR İÇİN ÖNCE GMAIL KİMLİĞİNİ KAYDET.", "記録申請の前にGmail付きIDを保存してください。", "认领纪录前请先保存 Gmail 玩家 ID。", "रिकॉर्ड क्लेम से पहले Gmail प्लेयर आईडी सेव करें।"],
        leaderboardInvalidEmail: ["USE A VALID GMAIL ADDRESS.", "یک نشانی معتبر جیمیل وارد کن.", "USA UNA DIRECCIÓN GMAIL VÁLIDA.", "استخدم عنوان Gmail صالحاً.", "UTILISEZ UNE ADRESSE GMAIL VALIDE.", "VERWENDE EINE GÜLTIGE GMAIL-ADRESSE.", "USE UM ENDEREÇO GMAIL VÁLIDO.", "GEÇERLİ BİR GMAIL ADRESİ KULLAN.", "有効なGmailアドレスを入力してください。", "请输入有效的 Gmail 地址。", "मान्य Gmail पता इस्तेमाल करें।"],
        leaderboardSaved: ["RECORD CLAIMED // RANK #{rank} // LEVEL {level}", "رکورد ثبت شد // رتبهٔ {rank} // سطح {level}", "RÉCORD RECLAMADO // RANGO #{rank} // NIVEL {level}", "تمت المطالبة بالرقم // الترتيب #{rank} // المستوى {level}", "RECORD REVENDIQUÉ // RANG #{rank} // NIVEAU {level}", "REKORD BEANSPRUCHT // RANG #{rank} // LEVEL {level}", "RECORDE VALIDADO // RANK #{rank} // NÍVEL {level}", "REKOR SAHİPLENİLDİ // SIRA #{rank} // SEVİYE {level}", "記録申請完了 // #{rank}位 // レベル{level}", "纪录已认领 // 排名 #{rank} // 等级 {level}", "रिकॉर्ड क्लेम // रैंक #{rank} // लेवल {level}"],
        leaderboardNewRecord: ["NEW LEGEND RECORD // {alias} REACHED LEVEL {level}", "رکورد تازهٔ افسانه‌ای // {alias} به سطح {level} رسید", "NUEVO RÉCORD DE LEYENDA // {alias} LLEGÓ AL NIVEL {level}", "رقم قياسي أسطوري جديد // وصل {alias} إلى المستوى {level}", "NOUVEAU RECORD DE LÉGENDE // {alias} ATTEINT LE NIVEAU {level}", "NEUER LEGENDENREKORD // {alias} ERREICHT LEVEL {level}", "NOVO RECORDE LENDÁRIO // {alias} CHEGOU AO NÍVEL {level}", "YENİ EFSANE REKORU // {alias} SEVİYE {level}’E ULAŞTI", "新レジェンド記録 // {alias} がレベル{level}到達", "传奇新纪录 // {alias} 达到 {level} 级", "नया लेजेंड रिकॉर्ड // {alias} लेवल {level} पर"],
        leaderboardNewLeader: ["NEW #1 LEGEND // {alias} OWNS THE FRONTIER", "افسانهٔ شمارهٔ ۱ جدید // {alias} مرز را در اختیار دارد", "NUEVA LEYENDA #1 // {alias} DOMINA LA FRONTERA", "أسطورة جديدة #1 // {alias} يملك الحدود", "NOUVELLE LÉGENDE #1 // {alias} DOMINE LA FRONTIÈRE", "NEUE #1-LEGENDE // {alias} BEHERRSCHT DIE GRENZE", "NOVA LENDA #1 // {alias} DOMINA A FRONTEIRA", "YENİ #1 EFSANE // SINIRIN SAHİBİ {alias}", "新#1レジェンド // {alias} がフロンティアを制覇", "新的 #1 传奇 // {alias} 掌控边境", "नई #1 लेजेंड // {alias} फ्रंटियर का मालिक"],
        leaderboardNotificationBlocked: ["BROWSER ALERTS ARE BLOCKED. ENABLE THEM IN SITE SETTINGS.", "اعلان مرورگر مسدود است؛ آن را از تنظیمات سایت فعال کن.", "LAS ALERTAS DEL NAVEGADOR ESTÁN BLOQUEADAS. ACTÍVALAS EN LOS AJUSTES.", "تنبيهات المتصفح محظورة؛ فعّلها من إعدادات الموقع.", "LES ALERTES DU NAVIGATEUR SONT BLOQUÉES. ACTIVEZ-LES DANS LES RÉGLAGES.", "BROWSER-ALARM IST BLOCKIERT. AKTIVIERE SIE IN DEN SEITENEINSTELLUNGEN.", "ALERTAS DO NAVEGADOR BLOQUEADAS. ATIVE-AS NAS CONFIGURAÇÕES.", "TARAYICI UYARILARI ENGELLİ. SİTE AYARLARINDAN AÇ.", "ブラウザ通知がブロックされています。サイト設定で許可してください。", "浏览器提醒被阻止，请在网站设置中开启。", "ब्राउज़र अलर्ट ब्लॉक हैं; साइट सेटिंग में चालू करें।"],
        leaderboardNotificationEnabled: ["RECORD ALERTS ENABLED", "اعلان‌های رکورد فعال شد", "ALERTAS DE RÉCORD ACTIVADAS", "تم تفعيل تنبيهات الأرقام القياسية", "ALERTES DE RECORD ACTIVÉES", "REKORD-ALARM AKTIVIERT", "ALERTAS DE RECORDE ATIVADAS", "REKOR UYARILARI AÇILDI", "記録通知を有効にしました", "新纪录提醒已开启", "रिकॉर्ड अलर्ट चालू हैं"],
        leaderboardSyncing: ["SYNCING GLOBAL BOARD…", "همگام‌سازی جدول جهانی…", "SINCRONIZANDO TABLA GLOBAL…", "جارٍ مزامنة اللوحة العالمية…", "SYNCHRONISATION DU CLASSEMENT…", "GLOBALES BOARD WIRD SYNCHRONISIERT…", "SINCRONIZANDO QUADRO GLOBAL…", "GLOBAL TABLO EŞİTLENİYOR…", "グローバルボードを同期中…", "正在同步全球榜…", "ग्लोबल बोर्ड सिंक हो रहा है…"],
        leaderboardOffline: ["LOCAL BOARD // OPEN TABS SYNCED", "جدول محلی // تب‌های باز همگام‌اند", "TABLA LOCAL // PESTAÑAS SINCRONIZADAS", "لوحة محلية // تمت مزامنة العلامات المفتوحة", "CLASSEMENT LOCAL // ONGLETS SYNCHRONISÉS", "LOKALES BOARD // OFFENE TABS SYNCHRONISIERT", "QUADRO LOCAL // ABAS SINCRONIZADAS", "YEREL TABLO // AÇIK SEKME SENKRON", "ローカルボード // 開いているタブを同期", "本地榜 // 已同步打开的标签页", "लोकल बोर्ड // खुले टैब सिंक हैं"],
        leaderboardSubmitFailed: ["GLOBAL SUBMISSION FAILED // LOCAL RECORD KEPT", "ثبت جهانی ناموفق بود // رکورد محلی نگه داشته شد", "FALLÓ EL ENVÍO GLOBAL // RÉCORD LOCAL GUARDADO", "فشل الإرسال العالمي // حُفظ الرقم محلياً", "ÉCHEC DE L’ENVOI GLOBAL // RECORD LOCAL CONSERVÉ", "GLOBALE ÜBERMITTLUNG FEHLGESCHLAGEN // LOKAL GESPEICHERT", "FALHA NO ENVIO GLOBAL // RECORDE LOCAL MANTIDO", "GLOBAL GÖNDERİM BAŞARISIZ // YEREL REKOR KORUNDU", "グローバル送信失敗 // ローカル記録は保存済み", "全球提交失败 // 已保留本地纪录", "ग्लोबल सबमिशन विफल // लोकल रिकॉर्ड सुरक्षित"],
        leaderboardRecordBroadcast: ["RECORD SIGNAL // {alias} JUST BEAT THE BOARD", "سیگنال رکورد // {alias} جدول را شکست", "SEÑAL DE RÉCORD // {alias} ACABA DE SUPERAR LA TABLA", "إشارة رقم قياسي // {alias} تجاوز اللوحة الآن", "SIGNAL DE RECORD // {alias} VIENT DE DÉPASSER LE CLASSEMENT", "REKORDSIGNAL // {alias} HAT DAS BOARD GESCHLAGEN", "SINAL DE RECORDE // {alias} SUPEROU O QUADRO", "REKOR SİNYALİ // {alias} TABLOYU GEÇTİ", "記録シグナル // {alias} がボードを更新", "纪录信号 // {alias} 刚刚刷新排行榜", "रिकॉर्ड सिग्नल // {alias} ने बोर्ड को हराया"]
      };
      for (const [key, row] of Object.entries(leaderboardLocaleRows)) {
        for (const code of LOCALE_CODES) {
          const slot = LOCALE_CODES.indexOf(code);
          LOCALES[code][key] = row[slot] || row[0];
        }
      }
      // Telegram is the only online identity provider. Keep the legacy
      // translation keys for saved builds, but replace their Gmail wording
      // before the live UI is rendered.
      const telegramLeaderboardCopy = {
        en: {
          leaderboardBody: "Push your run higher, earn a level, and leave a masked signal behind. Public boards show aliases only; your Telegram account stays private.",
          leaderboardProfileTitle: "PLAYER ID // TELEGRAM VERIFIED",
          leaderboardEmailLabel: "TELEGRAM ACCOUNT",
          leaderboardEmailPlaceholder: "Verified in Telegram",
          leaderboardPrivacy: "Telegram verifies your account inside the Mini App. Only your public alias appears on the board; guest mode stays local to this device.",
          leaderboardEmpty: "No claimed runs yet. Finish a run and become the first Telegram legend.",
          leaderboardNeedProfile: "SAVE A PLAYER ALIAS BEFORE CLAIMING A RECORD.",
          leaderboardInvalidEmail: "USE THE TELEGRAM MINI APP OR A VALID PLAYER ALIAS."
        },
        fa: {
          leaderboardBody: "رکوردت را بالاتر ببر و یک سیگنال ماسک‌شده جا بگذار. در جدول عمومی فقط نام مستعار دیده می‌شود؛ حساب تلگرام خصوصی می‌ماند.",
          leaderboardProfileTitle: "شناسه بازیکن // تلگرام تأییدشده",
          leaderboardEmailLabel: "حساب تلگرام",
          leaderboardEmailPlaceholder: "تأییدشده در تلگرام",
          leaderboardPrivacy: "تلگرام هویتت را داخل Mini App تأیید می‌کند. در جدول فقط نام مستعار عمومی دیده می‌شود؛ حالت مهمان روی همین دستگاه می‌ماند.",
          leaderboardEmpty: "هنوز رکوردی ثبت نشده. یک ران را تمام کن و اولین افسانهٔ تلگرامی باش.",
          leaderboardNeedProfile: "پیش از ثبت رکورد، یک نام مستعار بازیکن ذخیره کن.",
          leaderboardInvalidEmail: "از Mini App تلگرام یا یک نام مستعار معتبر استفاده کن."
        }
      };
      for (const code of LOCALE_CODES) {
        Object.assign(LOCALES[code], telegramLeaderboardCopy[code] || {
          leaderboardBody: telegramLeaderboardCopy.en.leaderboardBody,
          leaderboardProfileTitle: telegramLeaderboardCopy.en.leaderboardProfileTitle,
          leaderboardEmailLabel: telegramLeaderboardCopy.en.leaderboardEmailLabel,
          leaderboardEmailPlaceholder: telegramLeaderboardCopy.en.leaderboardEmailPlaceholder,
          leaderboardPrivacy: telegramLeaderboardCopy.en.leaderboardPrivacy,
          leaderboardEmpty: telegramLeaderboardCopy.en.leaderboardEmpty,
          leaderboardNeedProfile: telegramLeaderboardCopy.en.leaderboardNeedProfile,
          leaderboardInvalidEmail: telegramLeaderboardCopy.en.leaderboardInvalidEmail
        });
        const keys = ["leaderboardBody", "leaderboardProfileTitle", "leaderboardEmailLabel", "leaderboardEmailPlaceholder", "leaderboardPrivacy", "leaderboardEmpty", "leaderboardNeedProfile", "leaderboardInvalidEmail"];
        for (const key of keys) {
          if (typeof LOCALES[code][key] === "string") {
            LOCALES[code][key] = LOCALES[code][key]
              .replace(/Gmail/gi, "Telegram")
              .replace(/\bemail\b/gi, "Telegram account")
              .replace(/\be-mail\b/gi, "Telegram account")
              .replace(/you@telegram\.com/gi, "Telegram account");
          }
        }
      }
      let currentLocale = initialLocale;
      // The competitive archive is initialized inside the deferred combat
      // layer below, while locale rendering lives in the outer IIFE. Keep
      // stable outer hooks so a language switch can refresh the live board
      // without leaking implementation details onto `window`.
      let renderLeaderboard = null;
      let syncLeaderboardProfileFields = null;
      let openLeaderboardPanel = null;
      let closeLeaderboardPanel = null;
      let refreshLeaderboardPanel = null;
      let enableLeaderboardNotificationsPanel = null;
      let saveLeaderboardProfilePanel = null;
      let clearLeaderboardProfilePanel = null;
      // The checkpoint layer is initialized in the deferred combat patch,
      // while these hooks let the base lifecycle save safely before that
      // patch replaces any hot path.
      let saveRunSnapshotHook = null;
      let clearRunSaveHook = null;
      let renderRunSaveUiHook = null;
      let resumeSavedRunHook = null;
      const localeValue = (key, fallback = "") => {
        const active = LOCALES[currentLocale] || LOCALES.en;
        const value = active[key] ?? LOCALES.en[key] ?? fallback;
        return Array.isArray(value) ? value : String(value);
      };
      const translate = (key, vars = {}) => {
        const value = localeValue(key, key);
        if (typeof value !== "string") return value;
        return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] === undefined ? `{${name}}` : String(vars[name]));
      };
      const LOCALE_SLOT = Object.fromEntries(LOCALE_CODES.map((code, index) => [code, index]));
      // Runtime content uses compact rows (one value per supported locale).
      // Keeping these rows beside the normal locale table makes it much
      // harder for a newly-added HUD message to accidentally fall back to
      // English in only one screen.
      const runtimeTextMatrix = {
        "enemy.drone.name": ["DRONE", "پهپاد", "DRON", "طائرة مسيّرة", "DRONE", "DROHNE", "DRONE", "DRON", "ドローン", "无人机", "ड्रोन"],
        "enemy.sprint.name": ["SPRINT", "شتاب‌گر", "SPRINT", "عدّاء", "SPRINT", "SPRINTER", "SPRINT", "SPRINT", "スプリント", "冲刺者", "स्प्रिंट"],
        "enemy.vault.name": ["VAULT", "خزانه", "BÓVEDA", "الخزنة", "COFFRE", "TRESOR", "COFRE", "KASA", "ボルト", "金库", "वॉल्ट"],
        "enemy.broker.name": ["BROKER", "کارگزار", "CORREDOR", "سمسار", "BROKER", "BROKER", "CORRETOR", "KOMİSYONCU", "ブローカー", "经纪人", "ब्रोकर"],
        "enemy.hunter.name": ["HUNTER", "شکارچی", "CAZADOR", "صيّاد", "CHASSEUR", "JÄGER", "CAÇADOR", "AVCI", "ハンター", "猎手", "शिकारी"],
        "enemy.lock.name": ["LOCK", "قفل", "BLOQUEO", "قفل", "VERROU", "SPERRE", "TRAVA", "KİLİT", "ロック", "锁定", "लॉक"],
        "enemy.mirror.name": ["MIRROR", "آینه", "ESPEJO", "مرآة", "MIROIR", "SPIEGEL", "ESPELHO", "AYNA", "ミラー", "镜像", "दर्पण"],
        "enemy.splitter.name": ["SPLITTER", "شکافنده", "DIVISOR", "مُجزّئ", "DIVISEUR", "TEILER", "DIVISOR", "BÖLÜCÜ", "スプリッター", "分裂者", "स्प्लिटर"],
        "enemy.swarm.name": ["SWARM", "ازدحام", "ENJAMBRE", "سرب", "ESSAIM", "SCHWARM", "ENXAME", "SÜRÜ", "スウォーム", "蜂群", "झुंड"],
        "enemy.pulse.name": ["PULSE", "پالس", "PULSO", "نبضة", "IMPULSION", "PULS", "PULSO", "NABIZ", "パルス", "脉冲", "पल्स"],
        "enemy.leech.name": ["LEECH", "زالو", "SANGUIJUELA", "علقة", "SANGSUE", "EGEL", "SANGUESSUGA", "SÜLÜK", "リーチ", "吸血虫", "लीच"],
        "enemy.warden.name": ["WARDEN", "نگهبان", "GUARDIÁN", "حارس", "GARDIEN", "WÄCHTER", "GUARDIÃO", "MUHAFIZ", "ウォーデン", "守卫", "वार्डन"],
        "enemy.drone.lore": ["A clean signal with a dirty route.", "سیگنالی تمیز با مسیری آلوده.", "Una señal limpia con una ruta sucia.", "إشارة نظيفة بمسار ملوث.", "Un signal net sur une route sale.", "Ein sauberes Signal mit schmutziger Route.", "Um sinal limpo numa rota suja.", "Kirli bir rotadaki temiz sinyal.", "汚れたルートを走るクリーンな信号。", "在脏线路上的干净信号。", "गंदी राह पर साफ़ सिग्नल।"],
        "enemy.sprint.lore": ["It closes the distance before you blink.", "پیش از یک پلک‌زدن فاصله را می‌بندد.", "Cierra la distancia antes de que parpadees.", "يقطع المسافة قبل أن ترمش.", "Il réduit la distance en un clin d’œil.", "Es schließt die Lücke im Wimpernschlag.", "Fecha a distância num piscar.", "Göz kırpmadan mesafeyi kapatır.", "瞬きする前に距離を詰める。", "眨眼前就会拉近距离。", "पलक झपकते ही दूरी मिटा देता है।"],
        "enemy.vault.lore": ["A heavy position with a locked heart.", "موقعی سنگین با قلبی قفل‌شده.", "Una posición pesada con corazón bloqueado.", "مركز ثقيل بقلب مقفل.", "Une position lourde au cœur verrouillé.", "Eine schwere Position mit gesperrtem Kern.", "Uma posição pesada com coração trancado.", "Kilitli kalpli ağır bir pozisyon.", "ロックされた心臓を持つ重い要塞。", "核心锁死的重型阵位。", "बंद दिल वाली भारी स्थिति।"],
        "enemy.broker.lore": ["It sells a bad angle as a good deal.", "زاویه‌ای بد را به‌عنوان معامله‌ای خوب می‌فروشد.", "Vende un mal ángulo como una buena oferta.", "يبيع زاوية سيئة كأنها صفقة جيدة.", "Il vend un mauvais angle comme une bonne affaire.", "Es verkauft einen schlechten Winkel als gutes Geschäft.", "Vende um ângulo ruim como bom negócio.", "Kötü açıyı iyi anlaşma diye satar.", "悪い角度をお得な取引として売る。", "把糟糕角度包装成好交易。", "बुरा कोण अच्छा सौदा बताकर बेचता है।"],
        "enemy.hunter.lore": ["It waits for the dodge, then collects.", "برای جاخالی صبر می‌کند و بعد وصول می‌کند.", "Espera el esquive y luego cobra.", "ينتظر المراوغة ثم يجمع الثمن.", "Il attend l’esquive puis encaisse.", "Es wartet auf den Ausweichschritt und kassiert.", "Espera a esquiva e cobra.", "Kaçışı bekler, sonra tahsil eder.", "回避を待ってから取り立てる。", "等你闪避后再收割。", "चकमा देने का इंतज़ार कर वसूलता है।"],
        "enemy.lock.lore": ["A permission check with teeth.", "یک بررسی مجوز با دندان.", "Una comprobación de permiso con dientes.", "فحص صلاحية له أنياب.", "Un contrôle d’accès avec des dents.", "Eine Berechtigungsprüfung mit Zähnen.", "Uma verificação de permissão com dentes.", "Dişleri olan bir izin kontrolü.", "牙を持つ権限チェック。", "长着牙的权限检查。", "दाँतों वाली अनुमति जाँच।"],
        "enemy.mirror.lore": ["It copies the last direction you trusted.", "آخرین جهتی را که به آن اعتماد کردی کپی می‌کند.", "Copia la última dirección en la que confiaste.", "ينسخ آخر اتجاه وثقت به.", "Il copie la dernière direction choisie.", "Es kopiert die letzte Richtung, der du vertraut hast.", "Copia a última direção em que confiou.", "Güvendiğin son yönü kopyalar.", "信じた最後の方向をコピーする。", "复制你最后信任的方向。", "जिस दिशा पर भरोसा किया उसे कॉपी करता है।"],
        "enemy.splitter.lore": ["Break it and two markets appear.", "بشکنش تا دو بازار ظاهر شود.", "Rómpelo y aparecen dos mercados.", "اكسره فتظهر سوقان.", "Brisez-le et deux marchés apparaissent.", "Zerschlage es, und zwei Märkte erscheinen.", "Quebre e dois mercados surgem.", "Kır ve iki piyasa belirsin.", "壊すと二つの市場が現れる。", "击碎它，会出现两个市场。", "तोड़ो और दो बाज़ार उभरेंगे।"],
        "enemy.swarm.lore": ["A thousand tiny yeses.", "هزار بلهٔ کوچک.", "Mil pequeños síes.", "ألف نعم صغيرة.", "Mille petits oui.", "Tausend kleine Jas.", "Mil pequenos sins.", "Bin küçük evet.", "千の小さなイエス。", "一千个微小的肯定。", "हज़ार छोटी हाँ।"],
        "enemy.pulse.lore": ["It weaponizes the heartbeat of the chain.", "ضربان قلب زنجیره را به سلاح تبدیل می‌کند.", "Arma el latido de la cadena.", "يسلّح نبض السلسلة.", "Il arme le battement de la chaîne.", "Es bewaffnet den Herzschlag der Kette.", "Transforma o pulso da cadeia em arma.", "Zincirin kalp atışını silaha çevirir.", "チェーンの鼓動を武器にする。", "把链的心跳变成武器。", "चेन की धड़कन को हथियार बनाता है।"],
        "enemy.leech.lore": ["It steals your momentum one frame at a time.", "هر فریم کمی از شتابت را می‌دزدد.", "Roba tu impulso fotograma a fotograma.", "يسرق زخمك إطاراً بعد إطار.", "Il vole votre élan image par image.", "Es stiehlt deinen Schwung Frame für Frame.", "Rouba seu impulso quadro a quadro.", "İvmeni kare kare çalar.", "一フレームずつ勢いを奪う。", "一帧一帧偷走你的动能。", "हर फ़्रेम आपकी गति चुराता है।"],
        "enemy.warden.lore": ["A living permission check.", "یک بررسی مجوز زنده.", "Una comprobación de permiso viviente.", "فحص صلاحية حي.", "Un contrôle d’accès vivant.", "Eine lebende Berechtigungsprüfung.", "Uma verificação de permissão viva.", "Yaşayan bir izin kontrolü.", "生きた権限チェック。", "活着的权限检查。", "जीवित अनुमति जाँच।"],
        "boss.lock.name": ["THE LOCKOUT", "قفل نهایی", "EL BLOQUEO", "الإغلاق", "LE BLOCAGE", "DIE SPERRE", "O BLOQUEIO", "KİLİT DIŞI", "ロックアウト", "封锁者", "द लॉकआउट"],
        "boss.lock.title": ["THE BUTTON REMEMBERS", "دکمه به یاد دارد", "EL BOTÓN RECUERDA", "الزر يتذكر", "LE BOUTON SE SOUVIENT", "DER BUTTON ERINNERT SICH", "O BOTÃO LEMBRA", "DÜĞME HATIRLIYOR", "ボタンは覚えている", "按钮记得", "बटन याद रखता है"],
        "boss.lock.lore": ["It does not hate you. It only remembers the halt.", "از تو متنفر نیست؛ فقط توقف را به یاد دارد.", "No te odia. Solo recuerda el alto.", "لا يكرهك؛ إنه يتذكر التوقف فقط.", "Il ne vous hait pas. Il se souvient de l’arrêt.", "Es hasst dich nicht. Es erinnert sich nur an den Halt.", "Não odeia você. Só lembra da parada.", "Senden nefret etmiyor; duruşu hatırlıyor.", "憎んではいない。ただ停止を覚えている。", "它不恨你，只记得那次停机。", "वह आपसे नफ़रत नहीं करता, बस रुकना याद रखता है।"],
        "boss.clearing.name": ["CLEARING HOUSE", "اتاق تسویه", "CÁMARA DE COMPENSACIÓN", "دار المقاصة", "CHAMBRE DE COMPENSATION", "CLEARINGSTELLE", "CÂMARA DE COMPENSAÇÃO", "TAHSİLAT MERKEZİ", "クリアリングハウス", "清算所", "क्लियरिंग हाउस"],
        "boss.clearing.title": ["COLLATERAL CALL", "فراخوان وثیقه", "LLAMADA DE GARANTÍA", "نداء الضمان", "APPEL DE GARANTIE", "SICHERHEITSANFORDERUNG", "CHAMADA DE GARANTIA", "TEMİNAT ÇAĞRISI", "担保コール", "追加抵押通知", "कोलेटरल कॉल"],
        "boss.clearing.lore": ["Every shot is a margin requirement.", "هر شلیک یک الزام مارجین است.", "Cada disparo exige margen.", "كل طلقة متطلب هامش.", "Chaque tir est une exigence de marge.", "Jeder Schuss ist eine Margin-Anforderung.", "Cada tiro exige margem.", "Her atış bir teminat gereksinimi.", "すべての弾が証拠金要件。", "每一发都是保证金要求。", "हर गोली मार्जिन की माँग है।"],
        "boss.oracle.name": ["THE ORACLE", "پیشگو", "EL ORÁCULO", "العراف", "L’ORACLE", "DAS ORAKEL", "O ORÁCULO", "KAHİN", "オラクル", "先知", "द ओरेकल"],
        "boss.oracle.title": ["THE LAST QUOTE", "آخرین قیمت", "LA ÚLTIMA COTIZACIÓN", "آخر عرض", "LA DERNIÈRE COTE", "DAS LETZTE QUOTE", "A ÚLTIMA COTAÇÃO", "SON FİYAT", "最後のクォート", "最后报价", "आख़िरी कोट"],
        "boss.oracle.lore": ["It predicts your dodge, then taxes it.", "جا‌خالی‌ات را پیش‌بینی می‌کند و بعد مالیات می‌گیرد.", "Predice tu esquive y luego lo cobra.", "يتنبأ بمراوغتك ثم يفرض ثمنها.", "Il prévoit votre esquive puis la taxe.", "Es sagt deinen Ausweichschritt voraus und besteuert ihn.", "Prevê sua esquiva e cobra por ela.", "Kaçışını tahmin eder, sonra vergilendirir.", "回避を予測し、その代償を取る。", "预测你的闪避，再收取代价。", "आपके चकमे का अनुमान लगाकर कर लेता है।"],
        "boss.robin.name": ["ROBIN PRIME", "رابین پرایم", "ROBIN PRIME", "روبين برايم", "ROBIN PRIME", "ROBIN PRIME", "ROBIN PRIME", "ROBIN PRIME", "ロビン・プライム", "罗宾至尊", "रॉबिन प्राइम"],
        "boss.robin.title": ["HOOD OF THE VOID", "هود خلأ", "CAPUCHA DEL VACÍO", "غطاء الفراغ", "CAPUCHE DU VIDE", "KAPUZE DER LEERE", "CAPUZ DO VAZIO", "BOŞLUĞUN KAPÜŞONU", "虚無のフード", "虚空兜帽", "शून्य का हुड"],
        "boss.robin.lore": ["The mascot became the message.", "نماد به پیام تبدیل شد.", "La mascota se convirtió en el mensaje.", "تحولت الشخصية إلى الرسالة.", "La mascotte est devenue le message.", "Das Maskottchen wurde zur Botschaft.", "O mascote virou a mensagem.", "Maskot mesaja dönüştü.", "マスコットがメッセージになった。", "吉祥物成了讯息。", "मस्कॉट ही संदेश बन गया।"],
        "boss.scammer.name": ["SCAMMER", "اسکمر", "ESTAFADOR", "المحتال", "ARNAQUEUR", "BETRÜGER", "GOLPISTA", "DOLANDIRICI", "スキャマー", "骗子", "स्कैमर"],
        "boss.scammer.title": ["COUNTERFEIT SIGNAL", "سیگنال جعلی", "SEÑAL FALSIFICADA", "إشارة مزيفة", "SIGNAL CONTREFAIT", "FÄLSCHUNGSSIGNAL", "SINAL FALSIFICADO", "SAHTE SİNYAL", "偽造シグナル", "伪造信号", "नकली सिग्नल"],
        "boss.scammer.lore": ["Every quote is bait. Every receipt can lie.", "هر قیمت طعمه است؛ هر رسیدی می‌تواند دروغ بگوید.", "Cada cotización es un cebo. Cada recibo puede mentir.", "كل عرض طُعم وكل إيصال قد يكذب.", "Chaque cote est un piège. Chaque reçu peut mentir.", "Jedes Quote ist Köder. Jeder Beleg kann lügen.", "Toda cotação é isca. Todo recibo pode mentir.", "Her fiyat yemdir. Her makbuz yalan söyleyebilir.", "すべての価格は罠。すべてのレシートは嘘をつく。", "每个报价都是诱饵，每张收据都可能说谎。", "हर कोट चारा है; हर रसीद झूठ बोल सकती है।"],
        "msg.zeroGDash": ["ZERO-G DASH // gravity has left the room.", "ZERO-G DASH // جاذبه از اتاق خارج شد.", "DASH CERO-G // la gravedad salió de la sala.", "اندفاع بلا جاذبية // غادرت الجاذبية الغرفة.", "DASH ZÉRO-G // la gravité a quitté la salle.", "ZERO-G-DASH // die Schwerkraft ist weg.", "DASH ZERO-G // a gravidade saiu da sala.", "SIFIR-G DASH // yerçekimi odadan çıktı.", "ゼロGダッシュ // 重力が部屋から消えた。", "零重力冲刺 // 重力离开了房间。", "ZERO-G DASH // गुरुत्व कमरे से चला गया।"],
        "msg.darkMatter": ["DARK MATTER // seven presses just bent time.", "مادهٔ تاریک // هفت فشار زمان را خم کرد.", "MATERIA OSCURA // siete pulsaciones doblaron el tiempo.", "المادة المظلمة // سبع ضغطات لوَت الزمن.", "MATIÈRE NOIRE // sept pressions ont plié le temps.", "DUNKLE MATERIE // sieben Drücke bogen die Zeit.", "MATÉRIA ESCURA // sete toques dobraram o tempo.", "KARANLIK MADDE // yedi basış zamanı büktü.", "ダークマター // 7回のプレスで時間が曲がった。", "暗物质 // 七次按压扭曲了时间。", "डार्क मैटर // सात प्रेस ने समय मोड़ दिया।"],
        "msg.timeFracture": ["TIME FRACTURE", "شکاف زمان", "FRACTURA TEMPORAL", "تشقق الزمن", "FRACTURE TEMPORELLE", "ZEITRISS", "FRATURA TEMPORAL", "ZAMAN ÇATLAĞI", "時間断裂", "时间裂隙", "समय दरार"],
        "msg.crowdSurge": ["CROWD SURGE // the book is moving with you.", "موج جمعیت // دفتر با تو حرکت می‌کند.", "OLEADA // el libro se mueve contigo.", "اندفاع الجمهور // يتحرك السجل معك.", "VAGUE DE FOULE // le carnet bouge avec vous.", "MASSENWELLE // das Buch bewegt sich mit dir.", "ONDA DA MULTIDÃO // o livro se move com você.", "KALABALIK DALGASI // defter seninle hareket ediyor.", "群衆サージ // ブックがあなたと動く。", "人群涌动 // 账本与你同动。", "भीड़ उछाल // किताब आपके साथ चल रही है।"],
        "msg.mobRally": ["MOB RALLY", "هم‌گرایی جمعیت", "ALIENTO DE LA MASA", "تعبئة الجمهور", "MOBILISATION", "MOB-MOBILISIERUNG", "MOBILIZAÇÃO", "KALABALIK TOPLANMASI", "群衆ラリー", "人群集结", "भीड़ रैली"],
        "msg.buyDip": ["BUY THE DIP // the last stand is live.", "BUY THE DIP // آخرین ایستادگی فعال شد.", "BUY THE DIP // la última resistencia está activa.", "BUY THE DIP // بدأ الصمود الأخير.", "BUY THE DIP // le dernier combat commence.", "BUY THE DIP // der letzte Widerstand läuft.", "BUY THE DIP // a última resistência começou.", "BUY THE DIP // son direniş başladı.", "BUY THE DIP // ラストスタンド開始。", "BUY THE DIP // 最后的坚守已启动。", "BUY THE DIP // आख़िरी मोर्चा सक्रिय।"],
        "msg.lastStand": ["LAST STAND", "آخرین ایستادگی", "ÚLTIMA RESISTENCIA", "الصمود الأخير", "DERNIER COMBAT", "LETZTER WIDERSTAND", "ÚLTIMA RESISTÊNCIA", "SON DİRENİŞ", "ラストスタンド", "最后坚守", "आख़िरी मोर्चा"],
        "msg.greenComplete": ["THE GREEN SIGNAL // THE ARCHIVE IS COMPLETE.", "سیگنال سبز // آرشیو کامل شد.", "LA SEÑAL VERDE // EL ARCHIVO ESTÁ COMPLETO.", "الإشارة الخضراء // اكتمل الأرشيف.", "LE SIGNAL VERT // L’ARCHIVE EST COMPLÈTE.", "DAS GRÜNE SIGNAL // DAS ARCHIV IST VOLLSTÄNDIG.", "O SINAL VERDE // O ARQUIVO ESTÁ COMPLETO.", "YEŞİL SİNYAL // ARŞİV TAMAMLANDI.", "グリーンシグナル // アーカイブ完了。", "绿色信号 // 档案已完整。", "हरा सिग्नल // संग्रह पूरा।"],
        "msg.allRecovered": ["ALL EASTER EGGS RECOVERED // MASTER TRACE ONLINE", "همهٔ ایسترگ‌ها بازیابی شدند // ردپای اصلی فعال است", "TODOS LOS SECRETOS RECUPERADOS // TRAZA MAESTRA ACTIVA", "تم استرداد كل الأسرار // المسار الرئيسي نشط", "TOUS LES SECRETS RÉCUPÉRÉS // TRACE MAÎTRE ACTIVE", "ALLE EASTER EGGS GEBORGEN // MASTERTRACE AKTIV", "TODOS OS SEGREDOS RECUPERADOS // RASTRO MESTRE ATIVO", "TÜM GİZLİLER TOPLANDI // ANA İZ AKTİF", "全イースターエッグ回収 // マスタートレース稼働", "全部彩蛋已回收 // 主线索上线", "सभी ईस्टर एग मिले // मास्टर ट्रेस ऑनलाइन"],
        "msg.legendaryEgg": ["LEGENDARY EASTER EGG", "ایسترگ افسانه‌ای", "SECRETO LEGENDARIO", "سر أسطوري", "SECRET LÉGENDAIRE", "LEGENDÄRES EASTER EGG", "SEGREDO LENDÁRIO", "EFSANE GİZLİSİ", "伝説のイースターエッグ", "传奇彩蛋", "लेजेंडरी ईस्टर एग"],
        "msg.noTarget": ["NO LIVE TARGET // SCANNING", "هدف فعالی نیست // در حال اسکن", "SIN OBJETIVO ACTIVO // ESCANEANDO", "لا هدف حي // جارٍ المسح", "AUCUNE CIBLE // SCAN", "KEIN AKTIVES ZIEL // SUCHE", "SEM ALVO ATIVO // ESCANEANDO", "AKTİF HEDEF YOK // TARAMA", "有効なターゲットなし // スキャン中", "没有活动目标 // 扫描中", "कोई सक्रिय लक्ष्य नहीं // स्कैन"],
        "msg.signalLog": ["SIGNAL LOG 01 // The command is alive. Hold the line.", "گزارش سیگنال ۰۱ // فرمان زنده است؛ خط را نگه دار.", "REGISTRO 01 // El comando está vivo. Mantén la línea.", "سجل الإشارة 01 // الأمر حي. حافظ على الخط.", "JOURNAL 01 // La commande est vivante. Tenez la ligne.", "SIGNALLOG 01 // Der Befehl lebt. Halte die Linie.", "LOG 01 // O comando está vivo. Segure a linha.", "SİNYAL GÜNLÜĞÜ 01 // Komut canlı. Hattı koru.", "シグナルログ01 // コマンドは生きている。線を守れ。", "信号日志 01 // 指令仍在，守住阵线。", "सिग्नल लॉग 01 // कमांड जीवित है। लाइन थामें।"],
        "msg.firstWave": ["2021 // BUY WENT DARK. 4663 // THE SIGNAL RETURNS.", "۲۰۲۱ // BUY خاموش شد. ۴۶۶۳ // سیگنال برمی‌گردد.", "2021 // BUY SE APAGÓ. 4663 // LA SEÑAL REGRESA.", "2021 // انطفأ BUY. 4663 // تعود الإشارة.", "2021 // BUY S’EST ÉTEINT. 4663 // LE SIGNAL REVIENT.", "2021 // BUY WURDE DUNKEL. 4663 // DAS SIGNAL KEHRT ZURÜCK.", "2021 // BUY ESCURECEU. 4663 // O SINAL RETORNA.", "2021 // BUY KARARDI. 4663 // SİNYAL GERİ DÖNÜYOR.", "2021 // BUYが暗転。4663 // シグナルが戻る。", "2021 // BUY 熄灭。4663 // 信号回归。", "2021 // BUY अंधेरा हुआ। 4663 // सिग्नल लौटता है।"],
        "msg.lockoutEntered": ["A LOCKOUT HAS ENTERED THE FRONTIER.", "یک قفل وارد مرز شد.", "UN BLOQUEO ENTRÓ EN LA FRONTERA.", "دخل إغلاق إلى الحدود.", "UN BLOCAGE ENTRE DANS LA FRONTIÈRE.", "EINE SPERRE IST IN DIE GRENZE EINGEDRUNGEN.", "UM BLOQUEIO ENTROU NA FRONTEIRA.", "BİR KİLİT SINIRA GİRDİ.", "ロックアウトがフロンティアに侵入。", "封锁者进入边境。", "एक लॉकआउट फ्रंटियर में आया।"],
        "msg.breakLockout": ["BREAK THE LOCKOUT", "قفل نهایی را بشکن", "ROMPE EL BLOQUEO", "اكسر الإغلاق", "BRISEZ LE BLOCAGE", "SPERRE BRECHEN", "QUEBRE O BLOQUEIO", "KİLİDİ KIR", "ロックアウトを破壊", "击破封锁", "लॉकआउट तोड़ें"],
        "msg.keepSignal": ["KEEP THE SIGNAL ALIVE", "سیگنال را زنده نگه دار", "MANTÉN LA SEÑAL VIVA", "حافظ على الإشارة حية", "GARDEZ LE SIGNAL EN VIE", "SIGNAL AM LEBEN HALTEN", "MANTENHA O SINAL VIVO", "SİNYALİ CANLI TUT", "シグナルを生かせ", "保持信号存活", "सिग्नल जीवित रखें"],
        "msg.waveReconfig": ["WAVE {wave} // THE FRONTIER RECONFIGURES.", "موج {wave} // مرز دوباره پیکربندی می‌شود.", "OLA {wave} // LA FRONTERA SE RECONFIGURA.", "الموجة {wave} // يعاد تشكيل الحدود.", "VAGUE {wave} // LA FRONTIÈRE SE RECONFIGURE.", "WELLE {wave} // DIE GRENZE KONFIGURIERT SICH NEU.", "ONDA {wave} // A FRONTEIRA SE RECONFIGURA.", "DALGA {wave} // SINIR YENİDEN KURULUYOR.", "ウェーブ {wave} // フロンティア再構成。", "波次 {wave} // 边境重新配置。", "लहर {wave} // फ्रंटियर फिर बन रहा है।"],
        "msg.wavePress": ["WAVE {wave} // PRESS HARD", "موج {wave} // محکم فشار بده", "OLA {wave} // PULSA FUERTE", "الموجة {wave} // اضغط بقوة", "VAGUE {wave} // PRESSEZ FORT", "WELLE {wave} // FEST DRÜCKEN", "ONDA {wave} // PRESSIONE FORTE", "DALGA {wave} // SIKI BAS", "ウェーブ {wave} // 強く押せ", "波次 {wave} // 用力按下", "लहर {wave} // ज़ोर से दबाएँ"],
        "msg.bossWave": ["BOSS WAVE {wave} // BREAK THE LOCKOUT", "موج باس {wave} // قفل نهایی را بشکن", "OLA JEFE {wave} // ROMPE EL BLOQUEO", "موجة الزعيم {wave} // اكسر الإغلاق", "VAGUE BOSS {wave} // BRISEZ LE BLOCAGE", "BOSSWELLE {wave} // SPERRE BRECHEN", "ONDA DO CHEFE {wave} // QUEBRE O BLOQUEIO", "BOSS DALGASI {wave} // KİLİDİ KIR", "ボスウェーブ {wave} // ロックアウトを破壊", "首领波次 {wave} // 击破封锁", "बॉस लहर {wave} // लॉकआउट तोड़ें"],
        "msg.patchInstalled": ["PATCH INSTALLED // signal upgraded.", "ارتقا نصب شد // سیگنال بهتر شد.", "MEJORA INSTALADA // señal actualizada.", "تم تثبيت التطوير // تحسنت الإشارة.", "PATCH INSTALLÉ // signal amélioré.", "PATCH INSTALLIERT // Signal verbessert.", "PATCH INSTALADO // sinal aprimorado.", "YÜKSELTME KURULDU // sinyal güçlendi.", "パッチ適用 // シグナル強化。", "升级已安装 // 信号增强。", "अपग्रेड लगाया // सिग्नल बेहतर।"],
        "msg.patchMaxed": ["PATCH MAXED // SIGNAL PEAK", "ارتقا به حداکثر رسید // اوج سیگنال", "MEJORA AL MÁXIMO // PICO DE SEÑAL", "التطوير مكتمل // ذروة الإشارة", "PATCH AU MAXIMUM // SIGNAL AU PIC", "PATCH MAXIMAL // SIGNALSPITZE", "PATCH NO MÁXIMO // PICO DO SINAL", "YÜKSELTME MAKS // SİNYAL ZİRVESİ", "パッチ最大 // シグナルピーク", "升级已满 // 信号峰值", "अपग्रेड अधिकतम // सिग्नल शिखर"],
        "msg.notEnough": ["NOT ENOUGH RECOVERED VALUE", "ارزش بازیابی‌شده کافی نیست", "VALOR RECUPERADO INSUFICIENTE", "القيمة المستردة غير كافية", "VALEUR RÉCUPÉRÉE INSUFFISANTE", "NICHT GENUG BERGUNGSWERT", "VALOR RECUPERADO INSUFICIENTE", "KURTARILAN DEĞER YETERSİZ", "回収価値が不足", "回收价值不足", "रिकवर मूल्य पर्याप्त नहीं"],
        "msg.dashEmpty": ["DASH ENERGY EMPTY // recharge in motion", "انرژی DASH خالی است // هنگام حرکت شارژ می‌شود", "ENERGÍA DASH AGOTADA // recarga en movimiento", "طاقة الاندفاع فارغة // اشحن أثناء الحركة", "ÉNERGIE DASH VIDE // rechargez en mouvement", "DASH-ENERGIE LEER // beim Bewegen laden", "ENERGIA DO DASH VAZIA // recarregue em movimento", "DASH ENERJİSİ BOŞ // hareketle doldur", "ダッシュエネルギー不足 // 移動で回復", "冲刺能量耗尽 // 移动中充能", "DASH ऊर्जा खाली // चलते हुए रिचार्ज"],
        "msg.marginCall": ["MARGIN CALL // the whole room just broke.", "کال مارجین // کل اتاق فرو ریخت.", "LLAMADA DE MARGEN // toda la sala se rompió.", "نداء الهامش // انهارت الغرفة كلها.", "APPEL DE MARGE // toute la salle vient de casser.", "MARGIN CALL // der ganze Raum brach zusammen.", "MARGIN CALL // a sala inteira quebrou.", "TEMİNAT ÇAĞRISI // tüm oda çöktü.", "マージンコール // 部屋全体が崩れた。", "追加保证金 // 整个房间崩裂。", "मार्जिन कॉल // पूरा कमरा टूट गया।"],
        "msg.splitter": ["SPLITTER // one position became two.", "شکافنده // یک موقعیت دو تا شد.", "DIVISOR // una posición se volvió dos.", "المُجزّئ // أصبح المركز اثنين.", "DIVISEUR // une position devient deux.", "TEILER // eine Position wurde zu zwei.", "DIVISOR // uma posição virou duas.", "BÖLÜCÜ // bir pozisyon iki oldu.", "スプリッター // 1つのポジションが2つに。", "分裂者 // 一个阵位变成两个。", "स्प्लिटर // एक स्थिति दो हो गई।"],
        "msg.signalClosed": ["SIGNAL CLOSED", "سیگنال بسته شد", "SEÑAL CERRADA", "أغلقت الإشارة", "SIGNAL FERMÉ", "SIGNAL GESCHLOSSEN", "SINAL FECHADO", "SİNYAL KAPANDI", "シグナル終了", "信号关闭", "सिग्नल बंद"],
        "msg.gravityWell": ["GRAVITY WELL ONLINE", "چاه گرانش فعال شد", "POZO GRAVITATORIO ACTIVO", "بئر الجاذبية نشط", "PUITS GRAVITATIONNEL ACTIF", "GRAVITATIONSWELLE AKTIV", "POÇO GRAVITACIONAL ATIVO", "YERÇEKİMİ KUYUSU AKTİF", "グラビティウェル起動", "引力井上线", "गुरुत्व कुआँ सक्रिय"],
        "msg.overdrive": ["OVERDRIVE CORE // latency collapsing", "هستهٔ اوردرایو // تأخیر در حال فروپاشی", "NÚCLEO OVERDRIVE // latencia colapsando", "نواة التسارع // ينهار التأخير", "NOYAU OVERDRIVE // latence réduite", "OVERDRIVE-KERN // Latenz bricht ein", "NÚCLEO OVERDRIVE // latência caindo", "OVERDRIVE ÇEKİRDEĞİ // gecikme çöküyor", "オーバードライブコア // 遅延崩壊", "超频核心 // 延迟崩溃", "ओवरड्राइव कोर // विलंब घट रहा है"],
        "msg.stackedExit": ["STACKED EXIT // another way out just opened.", "خروج زنجیره‌ای // راه دیگری باز شد.", "SALIDA APILADA // se abrió otra vía.", "خروج متراكم // فُتح مخرج آخر.", "SORTIE EMPILÉE // une autre issue s’ouvre.", "GESTAPELTER AUSGANG // ein Weg öffnet sich.", "SAÍDA EMPILHADA // outra saída abriu.", "YIĞINLI ÇIKIŞ // başka yol açıldı.", "スタックドエグジット // 別の出口が開いた。", "叠加出口 // 又一条路打开。", "स्टैक्ड एग्ज़िट // एक और रास्ता खुला।"],
        "msg.scammerVerify": ["SCAMMER // VERIFY THE TARGET", "اسکمر // هدف را بررسی کن", "ESTAFADOR // VERIFICA EL OBJETIVO", "المحتال // تحقق من الهدف", "ARNAQUEUR // VÉRIFIEZ LA CIBLE", "BETRÜGER // ZIEL PRÜFEN", "GOLPISTA // VERIFIQUE O ALVO", "DOLANDIRICI // HEDEFİ DOĞRULA", "スキャマー // ターゲットを確認", "骗子 // 核验目标", "स्कैमर // लक्ष्य जाँचें"],
        "msg.scammerFlash": ["SCAMMER // FLASH SALE", "اسکمر // فروش برق‌آسا", "ESTAFADOR // OFERTA RELÁMPAGO", "المحتال // تخفيض خاطف", "ARNAQUEUR // VENTE FLASH", "BETRÜGER // BLITZANGEBOT", "GOLPISTA // OFERTA RELÂMPAGO", "DOLANDIRICI // FLAŞ SATIŞ", "スキャマー // フラッシュセール", "骗子 // 限时促销", "स्कैमर // फ्लैश सेल"],
        "msg.scammerFee": ["SCAMMER // HIDDEN FEE", "اسکمر // کارمزد پنهان", "ESTAFADOR // TARIFA OCULTA", "المحتال // رسم خفي", "ARNAQUEUR // FRAIS CACHÉS", "BETRÜGER // VERSTECKTE GEBÜHR", "GOLPISTA // TAXA OCULTA", "DOLANDIRICI // GİZLİ ÜCRET", "スキャマー // 隠れ手数料", "骗子 // 隐藏费用", "स्कैमर // छिपी फीस"],
        "msg.scammerReceipt": ["SCAMMER // RECEIPT DUPLICATED", "اسکمر // رسید دوبرابر شد", "ESTAFADOR // RECIBO DUPLICADO", "المحتال // تكررت الفاتورة", "ARNAQUEUR // REÇU DUPLIQUÉ", "BETRÜGER // BELEG DUPLIZIERT", "GOLPISTA // RECIBO DUPLICADO", "DOLANDIRICI // MAKBUZ KOPYALANDI", "スキャマー // レシート複製", "骗子 // 收据重复", "स्कैमर // रसीद डुप्लीकेट"],
        "msg.scammerChargeback": ["SCAMMER // CHARGEBACK", "اسکمر // برگشت وجه", "ESTAFADOR // CONTRACARGO", "المحتال // استرجاع", "ARNAQUEUR // RÉTROFACTURATION", "BETRÜGER // RÜCKBUCHUNG", "GOLPISTA // ESTORNO", "DOLANDIRICI // GERİ ÖDEME", "スキャマー // チャージバック", "骗子 // 拒付", "स्कैमर // चार्जबैक"],
        "msg.glitchInvalid": ["GLITCH // QUOTE INVALID", "گلیچ // قیمت نامعتبر است", "GLITCH // COTIZACIÓN INVÁLIDA", "خلل // العرض غير صالح", "GLITCH // COTE INVALIDE", "GLITCH // QUOTE UNGÜLTIG", "GLITCH // COTA INVÁLIDA", "GLITCH // FİYAT GEÇERSİZ", "グリッチ // クォート無効", "故障 // 报价无效", "ग्लिच // कोट अमान्य"],
        "msg.scammerPayout": ["SCAMMER PAYOUT // +{amount} VALUE", "پرداخت اسکمر // +{amount} ارزش", "PAGO DEL ESTAFADOR // +{amount} VALOR", "مكافأة المحتال // +{amount} قيمة", "GAIN DE L’ARNAQUEUR // +{amount} VALEUR", "BETRÜGER-AUSZAHLUNG // +{amount} WERT", "PAGAMENTO DO GOLPISTA // +{amount} VALOR", "DOLANDIRICI ÖDEMESİ // +{amount} DEĞER", "スキャマー報酬 // +{amount} 価値", "骗子奖励 // +{amount} 价值", "स्कैमर भुगतान // +{amount} मूल्य"],
        "msg.scammerCache": ["COUNTERFEIT CACHE // +{amount} COINS RECOVERED.", "کش جعلی // +{amount} سکه بازیابی شد.", "CAJA FALSA // +{amount} MONEDAS RECUPERADAS.", "مخزون مزيف // استرداد +{amount} عملة.", "CACHE CONTREFAIT // +{amount} PIÈCES RÉCUPÉRÉES.", "FÄLSCHUNGS-CACHE // +{amount} MÜNZEN GEBORGEN.", "CACHE FALSIFICADO // +{amount} MOEDAS RECUPERADAS.", "SAHTE KASA // +{amount} JETON KURTARILDI.", "偽造キャッシュ // +{amount} コイン回収。", "伪造缓存 // 回收 +{amount} 金币。", "नकली कैश // +{amount} सिक्के मिले।"]
      };
      const runtimeMessageKeys = {
        "ZERO-G DASH // gravity has left the room.": "msg.zeroGDash",
        "DARK MATTER // seven presses just bent time.": "msg.darkMatter",
        "TIME FRACTURE": "msg.timeFracture",
        "CROWD SURGE // the book is moving with you.": "msg.crowdSurge",
        "MOB RALLY": "msg.mobRally",
        "BUY THE DIP // the last stand is live.": "msg.buyDip",
        "LAST STAND": "msg.lastStand",
        "THE GREEN SIGNAL // THE ARCHIVE IS COMPLETE.": "msg.greenComplete",
        "ALL EASTER EGGS RECOVERED // MASTER TRACE ONLINE": "msg.allRecovered",
        "LEGENDARY EASTER EGG": "msg.legendaryEgg",
        "NO LIVE TARGET // SCANNING": "msg.noTarget",
        "SIGNAL LOG 01 // The command is alive. Hold the line.": "msg.signalLog",
        "2021 // BUY WENT DARK. 4663 // THE SIGNAL RETURNS.": "msg.firstWave",
        "A LOCKOUT HAS ENTERED THE FRONTIER.": "msg.lockoutEntered",
        "BREAK THE LOCKOUT": "msg.breakLockout",
        "KEEP THE SIGNAL ALIVE": "msg.keepSignal",
        "PATCH INSTALLED // signal upgraded.": "msg.patchInstalled",
        "PATCH MAXED // SIGNAL PEAK": "msg.patchMaxed",
        "NOT ENOUGH RECOVERED VALUE": "msg.notEnough",
        "DASH ENERGY EMPTY // recharge in motion": "msg.dashEmpty",
        "MARGIN CALL // the whole room just broke.": "msg.marginCall",
        "SPLITTER // one position became two.": "msg.splitter",
        "SIGNAL CLOSED": "msg.signalClosed",
        "GRAVITY WELL ONLINE": "msg.gravityWell",
        "OVERDRIVE CORE // latency collapsing": "msg.overdrive",
        "STACKED EXIT // another way out just opened.": "msg.stackedExit",
        "SCAMMER // VERIFY THE TARGET": "msg.scammerVerify",
        "SCAMMER // FLASH SALE": "msg.scammerFlash",
        "SCAMMER // HIDDEN FEE": "msg.scammerFee",
        "SCAMMER // RECEIPT DUPLICATED": "msg.scammerReceipt",
        "SCAMMER // CHARGEBACK": "msg.scammerChargeback",
        "GLITCH // QUOTE INVALID": "msg.glitchInvalid"
      };
      runtimeTextMatrix["msg.targetLocked"] = [
        "TARGET LOCKED // {label}", "هدف قفل شد // {label}", "OBJETIVO FIJADO // {label}", "تم قفل الهدف // {label}",
        "CIBLE VERROUILLÉE // {label}", "ZIEL GESPERRT // {label}", "ALVO TRAVADO // {label}", "HEDEF KİLİTLENDİ // {label}",
        "ターゲット固定 // {label}", "目标已锁定 // {label}", "लक्ष्य लॉक // {label}"
      ];
      runtimeTextMatrix["msg.lockOn"] = [
        "LOCK-ON // {label}", "قفل هدف // {label}", "BLOQUEO // {label}", "قفل الهدف // {label}",
        "VERROU // {label}", "LOCK-ON // {label}", "TRAVA // {label}", "KİLİT // {label}",
        "ロックオン // {label}", "锁定 // {label}", "लॉक-ऑन // {label}"
      ];
      runtimeTextMatrix["msg.zoom"] = [
        "ZOOM {value}%", "زوم {value}٪", "ZOOM {value}%", "تكبير {value}%", "ZOOM {value}%",
        "ZOOM {value}%", "ZOOM {value}%", "ZOOM {value}%", "ズーム {value}%", "缩放 {value}%", "ज़ूम {value}%"
      ];
      runtimeTextMatrix["msg.online"] = [
        "{label} ONLINE", "{label} فعال", "{label} ACTIVO", "{label} نشط", "{label} ACTIF",
        "{label} AKTIV", "{label} ATIVO", "{label} ETKİN", "{label} 起動", "{label} 已启动", "{label} सक्रिय"
      ];
      runtimeTextMatrix["msg.eggPower"] = [
        "EGG POWER // {value}", "توان ایسترگ // {value}", "PODER SECRETO // {value}", "قوة سرية // {value}",
        "POUVOIR SECRET // {value}", "EASTER-KRAFT // {value}", "PODER SECRETO // {value}", "GİZLİ GÜÇ // {value}",
        "イースターパワー // {value}", "彩蛋能力 // {value}", "ईस्टर शक्ति // {value}"
      ];
      runtimeTextMatrix["msg.echoRoute"] = [
        "ECHO ROUTE // {value}", "مسیر اکو // {value}", "RUTA ECO // {value}", "مسار الصدى // {value}",
        "ROUTE ÉCHO // {value}", "ECHO-ROUTE // {value}", "ROTA ECO // {value}", "EKO ROTASI // {value}",
        "エコールート // {value}", "回声路线 // {value}", "इको मार्ग // {value}"
      ];
      const addRuntimeRows = (rows) => {
        for (const [key, value] of Object.entries(rows)) runtimeTextMatrix[key] = value;
      };
      addRuntimeRows({
        "egg.darkButton.title": ["THE DARK BUTTON", "دکمهٔ تاریک", "EL BOTÓN OSCURO", "الزر المظلم", "LE BOUTON NOIR", "DER DUNKLE BUTTON", "O BOTÃO SOMBRIO", "KARANLIK DÜĞME", "ダークボタン", "暗按钮", "डार्क बटन"],
        "egg.chain4663.title": ["CHAIN 4663", "زنجیرهٔ ۴۶۶۳", "CADENA 4663", "السلسلة 4663", "CHAÎNE 4663", "KETTE 4663", "CADEIA 4663", "ZİNCİR 4663", "チェーン4663", "链 4663", "चेन 4663"],
        "egg.pco.title": ["PCO // PUBLIC COMMON", "PCO // عمومی", "PCO // COMÚN PÚBLICO", "PCO // عام", "PCO // COMMUN PUBLIC", "PCO // ÖFFENTLICH", "PCO // PÚBLICO", "PCO // GENEL", "PCO // パブリック", "PCO // 公共", "PCO // सार्वजनिक"],
        "egg.gas.title": ["GASLESS GHOST", "شبح بی‌کارمزد", "FANTASMA SIN GAS", "شبح بلا رسوم", "FANTÔME SANS FRAIS", "GASLOSER GEIST", "FANTASMA SEM GAS", "GAZSIZ HAYALET", "ガスレスゴースト", "无 Gas 幽灵", "गैसलेस भूत"],
        "egg.wallet.title": ["COLD WALLET", "کیف پول سرد", "CARTERA FRÍA", "محفظة باردة", "PORTEFEUILLE FROID", "COLD WALLET", "CARTEIRA FRIA", "SOĞUK CÜZDAN", "コールドウォレット", "冷钱包", "कोल्ड वॉलेट"],
        "egg.hood.title": ["HOOD OF THE VOID", "هود خلأ", "CAPUCHA DEL VACÍO", "غطاء الفراغ", "CAPUCHE DU VIDE", "KAPUZE DER LEERE", "CAPUZ DO VAZIO", "BOŞLUĞUN KAPÜŞONU", "虚無のフード", "虚空兜帽", "शून्य का हुड"],
        "egg.greenSignal.title": ["THE GREEN SIGNAL", "سیگنال سبز", "LA SEÑAL VERDE", "الإشارة الخضراء", "LE SIGNAL VERT", "DAS GRÜNE SIGNAL", "O SINAL VERDE", "YEŞİL SİNYAL", "グリーンシグナル", "绿色信号", "हरा सिग्नल"],
        "egg.darkButton.name": ["DARK MATTER", "مادهٔ تاریک", "MATERIA OSCURA", "المادة المظلمة", "MATIÈRE NOIRE", "DUNKLE MATERIE", "MATÉRIA ESCURA", "KARANLIK MADDE", "ダークマター", "暗物质", "डार्क मैटर"],
        "egg.chain4663.name": ["CHAIN REACTION", "واکنش زنجیره‌ای", "REACCIÓN EN CADENA", "تفاعل متسلسل", "RÉACTION EN CHAÎNE", "KETTENREAKTION", "REAÇÃO EM CADEIA", "ZİNCİRLEME TEPKİ", "チェーンリアクション", "链式反应", "चेन रिएक्शन"],
        "egg.pco.name": ["CROWD SURGE", "موج جمعیت", "OLEADA", "اندفاع الجمهور", "VAGUE DE FOULE", "MASSENWELLE", "ONDA DA MULTIDÃO", "KALABALIK DALGASI", "群衆サージ", "人群涌动", "भीड़ उछाल"],
        "egg.gas.name": ["ZERO-G DASH", "DASH بی‌گرانش", "DASH CERO-G", "اندفاع بلا جاذبية", "DASH ZÉRO-G", "ZERO-G-DASH", "DASH ZERO-G", "SIFIR-G DASH", "ゼロGダッシュ", "零重力冲刺", "ZERO-G DASH"],
        "egg.wallet.name": ["COLD STORAGE", "ذخیره‌سازی سرد", "ALMACÉN FRÍO", "تخزين بارد", "STOCKAGE FROID", "KALTSPEICHER", "ARMAZENAMENTO FRIO", "SOĞUK DEPO", "コールドストレージ", "冷存储", "कोल्ड स्टोरेज"],
        "egg.hood.name": ["HOOD SHIFT", "تغییر هود", "CAMBIO DE CAPUCHA", "تحول الغطاء", "GLISSEMENT DE CAPUCHE", "HOOD-SHIFT", "MUDANÇA DE CAPUZ", "KAPÜŞON KAYMASI", "フードシフト", "兜帽偏移", "हुड शिफ्ट"],
        "egg.greenSignal.name": ["BUY THE DIP", "خرید در کف", "COMPRAR LA CAÍDA", "اشترِ عند الهبوط", "ACHETER LA BAISSE", "BUY THE DIP", "COMPRAR NA BAIXA", "DÜŞÜŞÜ AL", "押し目買い", "逢低买入", "गिरावट खरीदें"],
        "egg.darkButton.tag": ["TIME FRACTURE", "شکاف زمان", "FRACTURA TEMPORAL", "تشقق الزمن", "FRACTURE TEMPORELLE", "ZEITRISS", "FRATURA TEMPORAL", "ZAMAN ÇATLAĞI", "時間断裂", "时间裂隙", "समय दरार"],
        "egg.chain4663.tag": ["ARC JUMP", "پرش قوسی", "SALTO DE ARCO", "قفزة قوسية", "SAUT D’ARC", "BOGENSPRUNG", "SALTO DE ARCO", "ARK SIÇRAMASI", "アークジャンプ", "电弧跳跃", "आर्क जंप"],
        "egg.pco.tag": ["MOB RULE", "قانون جمعیت", "REGLA DE LA MASA", "حكم الجمهور", "RÈGLE DE LA FOULE", "MOB-REGEL", "REGRA DA MULTIDÃO", "KALABALIK KURALI", "群衆ルール", "人群法则", "भीड़ नियम"],
        "egg.gas.tag": ["GASLESS", "بی‌کارمزد", "SIN GAS", "بلا رسوم", "SANS FRAIS", "GASLOS", "SEM GAS", "GAZSIZ", "ガスレス", "无 Gas", "गैसलेस"],
        "egg.wallet.tag": ["BANK SHIELD", "سپر بانکی", "ESCUDO BANCARIO", "درع مصرفي", "BOUCLIER BANCAIRE", "BANK-SCHILD", "ESCUDO BANCÁRIO", "BANKA KALKANI", "バンクシールド", "银行护盾", "बैंक शील्ड"],
        "egg.hood.tag": ["PHANTOM", "شبح", "FANTASMA", "شبح", "FANTÔME", "PHANTOM", "FANTASMA", "HAYALET", "ファントム", "幻影", "फैंटम"],
        "egg.greenSignal.tag": ["LAST STAND", "آخرین ایستادگی", "ÚLTIMA RESISTENCIA", "الصمود الأخير", "DERNIER COMBAT", "LETZTER WIDERSTAND", "ÚLTIMA RESISTÊNCIA", "SON DİRENİŞ", "ラストスタンド", "最后坚守", "आख़िरी मोर्चा"],
        "weapon.handshake.name": ["HANDSHAKE", "دست‌دادن", "APRETÓN", "مصافحة", "POIGNÉE DE MAIN", "HANDSHAKE", "APERTO DE MÃO", "TOKALAŞMA", "ハンドシェイク", "握手", "हैंडशेक"],
        "weapon.spreadsheet.name": ["SPREADSHEET", "صفحه‌گسترده", "HOJA DE CÁLCULO", "جدول بيانات", "TABLEUR", "TABELLE", "PLANILHA", "TABLO", "スプレッドシート", "表格", "स्प्रेडशीट"],
        "weapon.lance.name": ["RAGE LANCE", "نیزهٔ خشم", "LANZA DE IRA", "رمح الغضب", "LANCE DE RAGE", "WUTLANZE", "LANÇA DA FÚRIA", "ÖFKE MIZRAĞI", "レイジランス", "狂怒长枪", "रेज लांस"],
        "weapon.short.name": ["SHORT SELL", "فروش استقراضی", "VENTA EN CORTO", "بيع على المكشوف", "VENTE À DÉCOUVERT", "LEERVERKAUF", "VENDA A DESCOBERTO", "AÇIĞA SATIŞ", "空売り", "做空", "शॉर्ट सेल"],
        "weapon.nova.name": ["NOVA ARRAY", "آرایهٔ نوا", "MATRIZ NOVA", "مصفوفة نوفا", "MATRICE NOVA", "NOVA-ARRAY", "MATRIZ NOVA", "NOVA DİZİSİ", "ノヴァアレイ", "新星阵列", "नोवा ऐरे"],
        "weapon.chain.name": ["CHAIN LINK", "پیوند زنجیره", "ENLACE DE CADENA", "رابط السلسلة", "LIEN DE CHAÎNE", "KETTENLINK", "ELO DE CADEIA", "ZİNCİR HALKASI", "チェーンリンク", "链环", "चेन लिंक"],
        "weapon.scythe.name": ["PHASE SCYTHE", "داس فازی", "GUADAÑA DE FASE", "منجل الطور", "FAUCILLE DE PHASE", "PHASENSENSE", "FOICE DE FASE", "FAZ TIRPANı", "フェイズサイズ", "相位镰刀", "फेज़ सायथ"],
        "weapon.handshake.short": ["RAPID", "سریع", "RÁPIDO", "سريع", "RAPIDE", "SCHNELL", "RÁPIDO", "HIZLI", "高速", "快速", "तेज़"],
        "weapon.spreadsheet.short": ["SPREAD", "پخش", "DISPERSIÓN", "انتشار", "DISPERSION", "STREUUNG", "DISPERSÃO", "YAYILIM", "拡散", "散射", "स्प्रेड"],
        "weapon.lance.short": ["PIERCE", "نفوذ", "PERFORA", "اختراق", "PERFORATION", "DURCHSTICH", "PERFURAÇÃO", "DELİŞ", "貫通", "穿透", "पियर्स"],
        "weapon.short.short": ["BOMB", "بمب", "BOMBA", "قنبلة", "BOMBE", "BOMBE", "BOMBA", "BOMBA", "爆弾", "炸弹", "बम"],
        "weapon.nova.short": ["NOVA", "نوا", "NOVA", "نوفا", "NOVA", "NOVA", "NOVA", "NOVA", "ノヴァ", "新星", "नोवा"],
        "weapon.chain.short": ["CHAIN", "زنجیره", "CADENA", "سلسلة", "CHAÎNE", "KETTE", "CADEIA", "ZİNCİR", "チェーン", "链", "चेन"],
        "weapon.scythe.short": ["RETURN", "بازگشت", "RETORNO", "عودة", "RETOUR", "RÜCKLAUF", "RETORNO", "GERİ DÖNÜŞ", "リターン", "回旋", "रिटर्न"]
      });
      addRuntimeRows({
        "upgrade.range.title": ["LONGER REACH", "برد بیشتر", "MAYOR ALCANCE", "مدى أطول", "PORTÉE ACCRUE", "MEHR REICHWEITE", "MAIOR ALCANCE", "DAHA UZUN MENZİL", "射程延長", "延长射程", "लंबी पहुँच"],
        "upgrade.range.desc": ["Projectiles travel farther and keep the frontier readable.", "گلوله‌ها دورتر می‌روند و مرز را خوانا نگه می‌دارند.", "Los proyectiles llegan más lejos y mantienen la frontera visible.", "تسافر المقذوفات أبعد وتحافظ على وضوح الحدود.", "Les projectiles vont plus loin et gardent la frontière lisible.", "Projektile fliegen weiter und halten die Grenze lesbar.", "Projéteis viajam mais longe e mantêm a fronteira visível.", "Mermiler daha uzağa gider, sınır okunur kalır.", "弾が遠くまで届き、視界を保つ。", "子弹飞得更远，让边境保持清晰。", "प्रक्षेप्य दूर तक जाते हैं और फ्रंटियर साफ़ रखते हैं।"],
        "upgrade.damage.title": ["HARDER PRESS", "فشار سخت‌تر", "PULSACIÓN MÁS FUERTE", "ضغط أقوى", "PRESSION PLUS FORTE", "HÄRTERER DRUCK", "PRESSÃO MAIS FORTE", "DAHA SERT BASIŞ", "強打", "更强按压", "कठोर प्रहार"],
        "upgrade.damage.desc": ["Increase weapon damage; make every press count.", "آسیب سلاح را بیشتر کن؛ هر فشار مهم است.", "Aumenta el daño del arma; cada pulsación cuenta.", "زد ضرر السلاح؛ كل ضغطة مهمة.", "Augmentez les dégâts; chaque pression compte.", "Erhöhe den Waffenschaden; jeder Druck zählt.", "Aumente o dano; cada toque conta.", "Silah hasarını artır; her basış önemli.", "武器ダメージ上昇。すべてのプレスが重要。", "提高武器伤害，每次按压都重要。", "हथियार नुकसान बढ़ाएँ; हर प्रेस मायने रखता है।"],
        "upgrade.fireRate.title": ["LOW LATENCY", "تأخیر کم", "BAJA LATENCIA", "زمن استجابة منخفض", "FAIBLE LATENCE", "GERINGE LATENZ", "BAIXA LATÊNCIA", "DÜŞÜK GECİKME", "低遅延", "低延迟", "कम विलंब"],
        "upgrade.fireRate.desc": ["Fire more often so the signal arrives first.", "دفعاتر شلیک کن تا سیگنال زودتر برسد.", "Dispara más a menudo para que la señal llegue primero.", "أطلق بوتيرة أعلى لتصل الإشارة أولاً.", "Tirez plus souvent pour faire arriver le signal en premier.", "Feuere öfter, damit das Signal zuerst ankommt.", "Atire mais para o sinal chegar primeiro.", "Sinyal önce ulaşsın diye daha sık ateş et.", "連射を高め、シグナルを先に届ける。", "提高射速，让信号先到。", "ज़्यादा फायर करें ताकि सिग्नल पहले पहुँचे।"],
        "upgrade.maxHp.title": ["THICKER PLATE", "صفحهٔ ضخیم‌تر", "PLACA MÁS GRUESA", "درع أكثر سماكة", "PLAQUE ÉPAISSE", "DICKERE PLATTE", "PLACA MAIS GROSSA", "DAHA KALIN PLAKA", "厚い装甲", "更厚护板", "मोटी प्लेट"],
        "upgrade.maxHp.desc": ["Raise maximum integrity and repair a little now.", "سلامت نهایی را بالا ببر و کمی تعمیر کن.", "Sube la integridad máxima y repara un poco.", "ارفع السلامة القصوى وأصلح قليلاً الآن.", "Augmentez l’intégrité maximale et réparez un peu.", "Erhöhe die maximale Integrität und repariere etwas.", "Aumente a integridade máxima e repare um pouco.", "Maksimum bütünlüğü artır ve biraz onar.", "最大耐久を上げ、少し修復。", "提高最大完整度并立即修复。", "अधिकतम अखंडता बढ़ाएँ और थोड़ा रिपेयर करें।"],
        "upgrade.speed.title": ["FAST ROUTING", "مسیریابی سریع", "RUTA RÁPIDA", "توجيه سريع", "ROUTAGE RAPIDE", "SCHNELLES ROUTING", "ROTA RÁPIDA", "HIZLI YÖNLENDİRME", "高速ルーティング", "快速路由", "तेज़ रूटिंग"],
        "upgrade.speed.desc": ["Move faster and escape every lockout.", "سریع‌تر حرکت کن و از هر قفل فرار کن.", "Muévete más rápido y escapa de cada bloqueo.", "تحرك أسرعاً واهرب من كل إغلاق.", "Déplacez-vous plus vite et échappez à chaque blocage.", "Bewege dich schneller und entkomme jeder Sperre.", "Mova-se mais rápido e escape de cada bloqueio.", "Daha hızlı hareket et, her kilitten kaç.", "移動速度を上げ、封鎖を抜ける。", "移动更快，逃离每次封锁。", "तेज़ चलें और हर लॉकआउट से बचें।"],
        "upgrade.bombRadius.title": ["WIDER BLAST", "انفجار گسترده‌تر", "EXPLOSIÓN AMPLIA", "انفجار أوسع", "EXPLOSION ÉLARGIE", "BREITERE EXPLOSION", "EXPLOSÃO MAIOR", "DAHA GENİŞ PATLAMA", "広域ブラスト", "更大爆炸", "विस्तृत विस्फोट"],
        "upgrade.bombRadius.desc": ["Expand Margin Call and add a little bomb damage.", "شعاع کال مارجین و آسیب بمب را بیشتر کن.", "Amplía Margin Call y añade daño de bomba.", "وسّع نداء الهامش وزد ضرر القنبلة.", "Élargissez l’appel de marge et les dégâts.", "Vergrößere Margin Call und Bombenschaden.", "Amplie Margin Call e o dano da bomba.", "Margin Call alanını ve bomba hasarını artır.", "マージンコール範囲と爆発ダメージ上昇。", "扩大追加保证金范围并提高爆炸伤害。", "मार्जिन कॉल और बम नुकसान बढ़ाएँ。"],
        "upgrade.maxEnergy.title": ["DEEPER BATTERY", "باتری عمیق‌تر", "BATERÍA PROFUNDA", "بطارية أعمق", "BATTERIE PROFONDE", "TIEFERE BATTERIE", "BATERIA MAIS FUNDA", "DAHA DERİN BATARYA", "深層バッテリー", "深层电池", "गहरी बैटरी"],
        "upgrade.maxEnergy.desc": ["Add maximum energy and fully recharge abilities.", "انرژی نهایی و شارژ کامل توانایی‌ها را بیشتر کن.", "Añade energía máxima y recarga las habilidades.", "زد الطاقة القصوى وأعد شحن القدرات.", "Ajoutez de l’énergie et rechargez les capacités.", "Mehr Energie und vollständige Aufladung.", "Mais energia e recarga total das habilidades.", "Maksimum enerji ve tam yetenek şarjı.", "最大エネルギー増加、能力を全回復。", "增加最大能量并完全充能技能。", "अधिकतम ऊर्जा और पूरी क्षमता रिचार्ज।"],
        "upgrade.shield.title": ["BLUE CHIP SHIELD", "سپر بلوچیپ", "ESCUDO BLUE CHIP", "درع الشريحة الزرقاء", "BOUCLIER BLUE CHIP", "BLUE-CHIP-SCHILD", "ESCUDO BLUE CHIP", "BLUE CHIP KALKANI", "ブルーチップシールド", "蓝筹护盾", "ब्लू चिप शील्ड"],
        "upgrade.shield.desc": ["Add shield capacity and refill it immediately.", "ظرفیت سپر را بیشتر و آن را فوری پر کن.", "Añade escudo y recárgalo al instante.", "زد سعة الدرع واشحنه فوراً.", "Ajoutez de la capacité et rechargez immédiatement.", "Mehr Schildkapazität und sofort auffüllen.", "Aumente o escudo e recarregue já.", "Kalkan kapasitesi ekle ve hemen doldur.", "シールド容量を増やし即時補充。", "增加护盾容量并立即充满。", "शील्ड क्षमता बढ़ाएँ और तुरंत भरें।"],
        "upgrade.crit.title": ["VOLATILE EDGE", "لبهٔ نوسانی", "BORDE VOLÁTIL", "حافة متقلبة", "LAME VOLATILE", "VOLATILE KANTE", "BORDA VOLÁTIL", "OYNÁK KENAR", "ボラティルエッジ", "波动锋刃", "वोलाटाइल एज"],
        "upgrade.crit.desc": ["Critical presses can hit for much more.", "فشارهای بحرانی می‌توانند خیلی بیشتر آسیب بزنند.", "Las pulsaciones críticas infligen mucho más.", "الضربات الحرجة تسبب ضرراً أكبر.", "Les pressions critiques frappent beaucoup plus fort.", "Kritische Treffer verursachen deutlich mehr.", "Acertos críticos causam muito mais.", "Kritik vuruşlar çok daha fazla vurabilir.", "クリティカルで大ダメージ。", "暴击按压可造成更高伤害。", "क्रिटिकल प्रेस बहुत अधिक नुकसान कर सकते हैं।"],
        "upgrade.combo.title": ["MOMENTUM LOOP", "چرخهٔ شتاب", "BUCLE DE IMPULSO", "حلقة الزخم", "BOUCLE D’ÉLAN", "MOMENTUMSCHLEIFE", "LOOP DE IMPULSO", "MOMENTUM DÖNGÜSÜ", "モメンタムループ", "动能循环", "मोमेंटम लूप"],
        "upgrade.combo.desc": ["Combos fade slower and pay more; protect the streak.", "کمبو دیرتر کم می‌شود و بیشتر پاداش می‌دهد.", "Los combos caen más lento y pagan más.", "تتلاشى الكومبوهات أبطأ وتدفع أكثر.", "Les combos diminuent plus lentement et rapportent plus.", "Kombos fallen langsamer und zahlen mehr.", "Combos caem mais devagar e pagam mais.", "Kombo daha yavaş düşer ve daha çok öder.", "コンボ減衰を遅くし報酬アップ。", "连击衰减更慢、奖励更高。", "कॉम्बो धीरे घटे और अधिक दे।"],
        "upgrade.pickup.title": ["OPEN INTEREST", "علاقهٔ باز", "INTERÉS ABIERTO", "فائدة مفتوحة", "INTÉRÊT OUVERT", "OFFENES INTERESSE", "INTERESSE ABERTO", "AÇIK POZİSYON", "オープンインタレスト", "未平仓兴趣", "ओपन इंटरेस्ट"],
        "upgrade.pickup.desc": ["Pull coins and repairs from much farther away.", "سکه و تعمیرات را از فاصلهٔ دور بکش.", "Atrae monedas y reparaciones desde lejos.", "اجذب العملات والإصلاحات من مسافة أكبر.", "Attirez pièces et réparations de plus loin.", "Ziehe Münzen und Reparaturen aus größerer Entfernung.", "Puxe moedas e reparos de mais longe.", "Coin ve tamirleri uzaktan çek.", "コインと修理を遠くから吸引。", "从更远处吸取金币和修复。", "दूर से सिक्के और रिपेयर खींचें।"],
        "upgrade.dashStack.title": ["STACKED EXIT", "خروج زنجیره‌ای", "SALIDA APILADA", "خروج متراكم", "SORTIE EMPILÉE", "GESTAPELTER AUSGANG", "SAÍDA EMPILHADA", "YIĞINLI ÇIKIŞ", "スタックドエグジット", "叠加出口", "स्टैक्ड एग्ज़िट"],
        "upgrade.dashStack.desc": ["Add dash battery and lower its energy cost.", "باتری DASH را بیشتر و هزینهٔ انرژی را کمتر کن.", "Añade batería de dash y reduce su coste.", "زد بطارية الاندفاع وخفّض كلفته.", "Ajoutez une batterie de dash et réduisez son coût.", "Mehr Dash-Batterie und geringere Kosten.", "Mais bateria de dash e menor custo.", "Dash pili ekle, enerji maliyetini düşür.", "ダッシュ電池追加、消費低下。", "增加冲刺电池并降低能耗。", "डैश बैटरी बढ़ाएँ और ऊर्जा लागत घटाएँ।"],
        "upgrade.magnet.title": ["GRAVITY WELL", "چاه گرانش", "POZO GRAVITATORIO", "بئر الجاذبية", "PUITS GRAVITATIONNEL", "GRAVITATIONSWELLE", "POÇO GRAVITACIONAL", "YERÇEKİMİ KUYUSU", "グラビティウェル", "引力井", "गुरुत्व कुआँ"],
        "upgrade.magnet.desc": ["Coins and repairs fly to you from farther away.", "سکه و تعمیرات از دور به سمتت می‌آیند.", "Monedas y reparaciones vuelan hacia ti desde lejos.", "تطير العملات والإصلاحات إليك من مسافة أبعد.", "Pièces et réparations viennent de plus loin.", "Münzen und Reparaturen fliegen aus der Ferne zu dir.", "Moedas e reparos vêm de mais longe.", "Coin ve tamirler uzaktan sana gelir.", "コインと修理が遠くから飛んでくる。", "金币和修复从更远处飞来。", "सिक्के और रिपेयर दूर से आपकी ओर आएँ।"],
        "upgrade.overdrive.title": ["OVERDRIVE CORE", "هستهٔ اوردرایو", "NÚCLEO OVERDRIVE", "نواة التسارع", "NOYAU OVERDRIVE", "OVERDRIVE-KERN", "NÚCLEO OVERDRIVE", "OVERDRIVE ÇEKİRDEĞİ", "オーバードライブコア", "超频核心", "ओवरड्राइव कोर"],
        "upgrade.overdrive.desc": ["Accelerate movement, fire and dash recovery together.", "حرکت، شلیک و بازیابی DASH را هم‌زمان سریع کن.", "Acelera movimiento, disparo y recuperación del dash.", "سرّع الحركة والإطلاق واستعادة الاندفاع.", "Accélérez mouvement, tir et récupération du dash.", "Beschleunige Bewegung, Feuer und Dash-Erholung.", "Acelere movimento, tiro e recarga do dash.", "Hareket, ateş ve dash yenilenmesini hızlandır.", "移動・射撃・ダッシュ回復を加速。", "同时加快移动、射击和冲刺恢复。", "गति, फायर और डैश रिकवरी तेज़ करें।"]
      });
      addRuntimeRows({
        "egg.darkButton.desc": ["The command that vanished before the market opened became the first ghost in the machine.", "فرمانی که پیش از باز شدن بازار ناپدید شد، اولین شبح ماشین شد.", "El comando que desapareció antes del mercado se volvió el primer fantasma.", "الأمر الذي اختفى قبل افتتاح السوق صار أول شبح.", "La commande disparue avant l’ouverture est devenue le premier fantôme.", "Der Befehl vor der Markteröffnung wurde zum ersten Geist.", "O comando que sumiu antes do mercado virou o primeiro fantasma.", "Piyasa açılmadan kaybolan komut makinenin ilk hayaleti oldu.", "市場が開く前に消えたコマンドが最初の亡霊になった。", "市场开盘前消失的指令成了机器的第一个幽灵。", "बाज़ार खुलने से पहले गायब कमांड मशीन का पहला भूत बना।"],
        "egg.chain4663.desc": ["A fictional route number for the green signal, hidden in the noise between two waves.", "شمارهٔ خیالی مسیر سیگنال سبز، پنهان میان نویز دو موج.", "Un número de ruta ficticio para la señal verde, oculto entre dos olas.", "رقم مسار خيالي للإشارة الخضراء مخبأ بين موجتين.", "Un numéro de route fictif pour le signal vert, caché entre deux vagues.", "Eine fiktive Routennummer für das grüne Signal zwischen zwei Wellen.", "Um número de rota fictício do sinal verde, escondido entre duas ondas.", "İki dalga arasındaki gürültüde gizli yeşil sinyal rotası.", "2つのウェーブのノイズに隠れたグリーンシグナルの架空路線番号。", "隐藏在两波噪声中的绿色信号虚构路线号。", "दो लहरों के शोर में छिपी हरे सिग्नल की काल्पनिक राह।"],
        "egg.pco.desc": ["A community phrase reframed as a protocol: the crowd is part of the ledger.", "عبارت جامعه که به پروتکل تبدیل شده؛ جمعیت بخشی از دفتر است.", "Una frase de la comunidad convertida en protocolo: la masa es parte del registro.", "عبارة مجتمعية أعيدت كبروتوكول: الجمهور جزء من السجل.", "Une phrase de communauté transformée en protocole : la foule fait partie du registre.", "Ein Community-Spruch als Protokoll: Die Menge ist Teil des Ledgers.", "Uma frase da comunidade virada protocolo: a multidão faz parte do livro.", "Topluluk sözü protokole dönüştü: kalabalık defterin parçası.", "コミュニティの言葉をプロトコル化。群衆も台帳の一部。", "社区用语被重写成协议：人群也是账本的一部分。", "समुदाय की पंक्ति प्रोटोकॉल बनी: भीड़ लेजर का हिस्सा है।"],
        "egg.gas.desc": ["No fee, no wallet, no transaction—only a clean burst through the frontier.", "نه کارمزد، نه کیف پول، نه تراکنش؛ فقط جهشی تمیز در مرز.", "Sin comisión, sin cartera, sin transacción: solo un impulso limpio.", "لا رسوم ولا محفظة ولا معاملة—اندفاع نظيف عبر الحدود.", "Sans frais, sans portefeuille, sans transaction : un bond propre.", "Keine Gebühr, keine Wallet, keine Transaktion—nur ein sauberer Schub.", "Sem taxa, carteira ou transação—só um avanço limpo.", "Ücret, cüzdan, işlem yok—sadece temiz bir sıçrama.", "手数料もウォレットも取引もない。フロンティアを貫く一閃。", "无费用、无钱包、无交易——只有穿越边境的干净突进。", "न फीस, न वॉलेट, न लेनदेन—बस फ्रंटियर में साफ़ छलांग।"],
        "egg.wallet.desc": ["There is no seed phrase here. The only key is the memory you carry out of the run.", "اینجا عبارت بازیابی وجود ندارد؛ تنها کلید خاطره‌ای است که از ران بیرون می‌بری.", "Aquí no hay frase semilla. La única llave es la memoria que llevas.", "لا توجد عبارة استرداد؛ المفتاح الوحيد هو الذاكرة التي تحملها.", "Aucune phrase secrète. La seule clé est le souvenir du run.", "Keine Seed-Phrase. Der einzige Schlüssel ist die Erinnerung aus dem Lauf.", "Não há frase-semente. A única chave é a memória que você leva.", "Burada seed phrase yok. Tek anahtar koşudan taşıdığın anı.", "シードフレーズはない。持ち帰る記憶だけが鍵。", "这里没有助记词，唯一的钥匙是你带出本局的记忆。", "यहाँ seed phrase नहीं; रन से लाई याद ही कुंजी है।"],
        "egg.hood.desc": ["The mascot signal survives as a boss-level echo, wearing the lockout like a crown.", "سیگنال نماد در قالب پژواکی در سطح باس زنده مانده و قفل را تاج کرده است.", "La señal mascota sobrevive como eco de jefe, llevando el bloqueo como corona.", "تعيش إشارة الشعار كصدى زعيم يضع الإغلاق تاجاً.", "Le signal mascotte survit comme écho de boss, le blocage en couronne.", "Das Maskottchen-Signal lebt als Boss-Echo und trägt die Sperre als Krone.", "O sinal mascote sobrevive como eco de chefe, usando o bloqueio como coroa.", "Maskot sinyali boss yankısı olarak yaşar, kilidi taç gibi takar.", "マスコット信号はボス級の残響となり、ロックアウトを冠にする。", "吉祥物信号化作首领回声，把封锁当王冠。", "मस्कॉट सिग्नल बॉस-स्तरीय प्रतिध्वनि बनकर लॉकआउट को ताज पहनता है।"],
        "egg.greenSignal.desc": ["The button is not a promise. It is a pulse. The archive opens when every other trace is home.", "دکمه وعده نیست؛ یک پالس است. وقتی همهٔ ردپاها برگردند آرشیو باز می‌شود.", "El botón no es una promesa. Es un pulso. El archivo abre cuando vuelven todas las trazas.", "الزر ليس وعداً بل نبضة. يفتح الأرشيف حين تعود كل الآثار.", "Le bouton n’est pas une promesse, c’est une pulsation. L’archive s’ouvre quand toutes les traces rentrent.", "Der Button ist kein Versprechen, sondern ein Puls. Das Archiv öffnet sich, wenn alle Spuren heimkehren.", "O botão não é promessa; é pulso. O arquivo abre quando todos os rastros voltam.", "Düğme vaat değil, darbe. Tüm izler dönünce arşiv açılır.", "ボタンは約束ではなくパルス。全ての痕跡が戻ると記録が開く。", "按钮不是承诺，而是脉冲。所有线索归位后档案开启。", "बटन वादा नहीं, पल्स है। सभी निशान लौटें तो संग्रह खुलेगा।"],
        "egg.darkButton.clue": ["TRACE // WAVE 2+ // defeat a LEGENDARY", "ردپا // موج ۲+ // یک افسانه‌ای را شکست بده", "PISTA // OLA 2+ // derrota un LEGENDARIO", "أثر // موجة 2+ // اهزم أسطورياً", "TRACE // VAGUE 2+ // battez un LÉGENDAIRE", "SPUR // WELLE 2+ // LEGENDÄREN besiegen", "RASTRO // ONDA 2+ // derrote um LENDÁRIO", "İZ // DALGA 2+ // bir EFSANEYİ yen", "痕跡 // ウェーブ2+ // レジェンダリー撃破", "线索 // 波次2+ // 击败传奇", "ट्रेस // लहर 2+ // लेजेंडरी हराएँ"],
        "egg.chain4663.clue": ["TRACE // two LEGENDARIES // hold the streak", "ردپا // دو افسانه‌ای // استریک را حفظ کن", "PISTA // dos LEGENDARIOS // mantén la racha", "أثر // أسطوريان // حافظ على السلسلة", "TRACE // deux LÉGENDAIRES // gardez la série", "SPUR // zwei LEGENDÄRE // Serie halten", "RASTRO // dois LENDÁRIOS // mantenha a sequência", "İZ // iki EFSANE // seriyi koru", "痕跡 // レジェンダリー2体 // 連勝維持", "线索 // 两个传奇 // 保持连击", "ट्रेस // दो लेजेंडरी // स्ट्रीक बचाएँ"],
        "egg.pco.clue": ["TRACE // COMBO x10 // finish a LEGENDARY", "ردپا // کمبو x۱۰ // یک افسانه‌ای را تمام کن", "PISTA // COMBO x10 // remata un LEGENDARIO", "أثر // كومبو x10 // أنهِ أسطورياً", "TRACE // COMBO x10 // achevez un LÉGENDAIRE", "SPUR // KOMBO x10 // LEGENDÄREN erledigen", "RASTRO // COMBO x10 // finalize um LENDÁRIO", "İZ // KOMBO x10 // EFSANEYİ bitir", "痕跡 // コンボx10 // レジェンダリー撃破", "线索 // 连击 x10 // 终结传奇", "ट्रेस // कॉम्बो x10 // लेजेंडरी खत्म"],
        "egg.gas.clue": ["TRACE // cast DASH during volatility", "ردپا // هنگام نوسان DASH کن", "PISTA // usa DASH durante la volatilidad", "أثر // نفّذ الاندفاع أثناء التقلب", "TRACE // lancez DASH pendant la volatilité", "SPUR // DASH während Volatilität", "RASTRO // use DASH durante volatilidade", "İZ // oynaklıkta DASH kullan", "痕跡 // ボラティリティ中にDASH", "线索 // 波动事件中冲刺", "ट्रेस // अस्थिरता में DASH करें"],
        "egg.wallet.clue": ["TRACE // low integrity // defeat a LEGENDARY", "ردپا // سلامت کم // یک افسانه‌ای را شکست بده", "PISTA // integridad baja // derrota un LEGENDARIO", "أثر // سلامة منخفضة // اهزم أسطورياً", "TRACE // intégrité faible // battez un LÉGENDAIRE", "SPUR // geringe Integrität // LEGENDÄREN besiegen", "RASTRO // integridade baixa // derrote um LENDÁRIO", "İZ // düşük bütünlük // EFSANEYİ yen", "痕跡 // 耐久低下 // レジェンダリー撃破", "线索 // 低完整度 // 击败传奇", "ट्रेस // कम अखंडता // लेजेंडरी हराएँ"],
        "egg.hood.clue": ["TRACE // break a LEGENDARY BOSS", "ردپا // یک باس افسانه‌ای را بشکن", "PISTA // rompe un JEFE LEGENDARIO", "أثر // اكسر زعيمًا أسطوريًا", "TRACE // battez un BOSS LÉGENDAIRE", "SPUR // LEGENDÄREN BOSS brechen", "RASTRO // quebre um CHEFE LENDÁRIO", "İZ // EFSANE BOSS'u kır", "痕跡 // レジェンダリーボス撃破", "线索 // 击破传奇首领", "ट्रेस // लेजेंडरी बॉस हराएँ"],
        "egg.greenSignal.clue": ["FINAL TRACE // WAVE 10+ // recover the other six", "ردپای نهایی // موج ۱۰+ // شش ردپای دیگر را بازیابی کن", "PISTA FINAL // OLA 10+ // recupera las otras seis", "الأثر الأخير // موجة 10+ // استرد الآثار الستة", "TRACE FINAL // VAGUE 10+ // récupérez les six autres", "LETZTE SPUR // WELLE 10+ // die sechs anderen bergen", "RASTRO FINAL // ONDA 10+ // recupere os outros seis", "SON İZ // DALGA 10+ // diğer altısını topla", "最終痕跡 // ウェーブ10+ // 残り6つを回収", "最终线索 // 波次10+ // 回收其余六个", "अंतिम ट्रेस // लहर 10+ // बाकी छह पाएँ"],
        "egg.darkButton.powerDesc": ["Every seventh takedown fractures time around the core.", "هر هفتمین حذف، زمان اطراف هسته را می‌شکند.", "Cada séptima baja fractura el tiempo alrededor del núcleo.", "كل إسقاط سابع يشقق الزمن حول النواة.", "Chaque septième élimination fracture le temps autour du noyau.", "Jede siebte Ausschaltung bricht die Zeit um den Kern.", "A cada sétima baixa, o tempo se parte ao redor do núcleo.", "Her yedinci düşürme çekirdeğin çevresinde zamanı çatlatır.", "7回目の撃破でコア周辺の時間が裂ける。", "每第七次击杀都会撕裂核心周围的时间。", "हर सातवीं गिरावट पर कोर के आसपास समय टूटता है।"],
        "egg.chain4663.powerDesc": ["Kills leap through two nearby targets with fading damage.", "حذف‌ها با آسیب کاهشی به دو هدف نزدیک می‌پرند.", "Las bajas saltan a dos objetivos cercanos con daño decreciente.", "تقفز الإطاحات إلى هدفين قريبين بضرر متناقص.", "Les éliminations bondissent vers deux cibles proches avec dégâts décroissants.", "Ausschaltungen springen mit abnehmendem Schaden auf zwei Ziele.", "As eliminações saltam para dois alvos próximos com dano menor.", "Öldürmeler azalan hasarla iki yakın hedefe sıçrar.", "撃破が減衰ダメージで近くの2体へ跳ぶ。", "击杀会以递减伤害跳向两个附近目标。", "किल घटते नुकसान के साथ दो पास के लक्ष्यों तक छलाँगते हैं।"],
        "egg.pco.powerDesc": ["A hot combo rallies the crowd and overclocks the weapon.", "کمبوی داغ جمعیت را متحد و سلاح را اورکلاک می‌کند.", "Un combo alto reúne a la masa y acelera el arma.", "كومبو ساخن يحشد الجمهور ويُسرّع السلاح.", "Un combo brûlant rallie la foule et accélère l’arme.", "Eine heiße Kombo mobilisiert die Menge und übertaktet die Waffe.", "Um combo quente reúne a multidão e acelera a arma.", "Sıcak bir kombo kalabalığı toplar ve silahı hızlandırır.", "熱いコンボが群衆を集め、武器をオーバークロック。", "高连击会召集人群并让武器超频。", "गरम कॉम्बो भीड़ जुटाकर हथियार ओवरक्लॉक करता है।"],
        "egg.gas.powerDesc": ["A dash tears a gravity scar that pulls hostiles inward.", "یک DASH زخمی گرانشی می‌سازد و دشمنان را به داخل می‌کشد.", "Un DASH abre una cicatriz gravitatoria que atrae hostiles.", "يصنع الاندفاع ندبة جاذبية تسحب الأعداء للداخل.", "Un DASH ouvre une cicatrice gravitationnelle qui attire les ennemis.", "Ein DASH reißt eine Gravitationsnarbe, die Feinde anzieht.", "Um DASH rasga uma cicatriz gravitacional que puxa hostis.", "DASH, düşmanları içeri çeken bir yerçekimi yarığı açar.", "ダッシュが重力の傷を作り、敵を引き寄せる。", "冲刺撕开引力伤痕，把敌人拉向内侧。", "DASH गुरुत्व निशान बनाकर दुश्मनों को खींचता है।"],
        "egg.wallet.powerDesc": ["Recovered value hardens into a reserve shield.", "ارزش بازیابی‌شده به سپر ذخیره تبدیل می‌شود.", "El valor recuperado se endurece como escudo de reserva.", "تتحول القيمة المستردة إلى درع احتياطي.", "La valeur récupérée durcit en bouclier de réserve.", "Geborgener Wert wird zu einem Reserveschild.", "O valor recuperado vira escudo reserva.", "Kurtarılan değer yedek kalkana dönüşür.", "回収価値が予備シールドになる。", "回收价值凝成备用护盾。", "रिकवर मूल्य रिज़र्व शील्ड बनता है।"],
        "egg.hood.powerDesc": ["A phantom frame can make an incoming hit miss.", "یک فریم شبح می‌تواند ضربهٔ ورودی را خطا کند.", "Un marco fantasma puede hacer que el golpe falle.", "إطار شبح قد يجعل الضربة الواردة تخطئ.", "Une image fantôme peut faire rater un coup.", "Ein Phantom-Frame lässt einen Treffer verfehlen.", "Um quadro fantasma pode fazer o golpe errar.", "Hayalet bir kare gelen darbeyi ıskalatabilir.", "幻影フレームで被弾を外せる。", "幻影帧可让来袭攻击落空。", "फैंटम फ़्रेम आने वाली चोट चूकवा सकता है।"],
        "egg.greenSignal.powerDesc": ["Critical integrity triggers a full comeback burst.", "سلامت بحرانی یک جهش بازگشت کامل را فعال می‌کند.", "La integridad crítica activa un estallido de remontada.", "السلامة الحرجة تطلق دفعة عودة كاملة.", "Une intégrité critique déclenche un retour complet.", "Kritische Integrität löst einen Comeback-Schub aus.", "Integridade crítica ativa uma virada completa.", "Kritik bütünlük tam geri dönüş patlaması başlatır.", "耐久が危険域になると逆転バースト。", "完整度危急时触发全面翻盘爆发。", "गंभीर अखंडता पूरी वापसी बर्स्ट चलाती है।"]
      });
      addRuntimeRows({
        "ui.echo": ["ECHO", "اکو", "ECO", "الصدى", "ÉCHO", "ECHO", "ECO", "EKO", "エコー", "回声", "इको"],
        "ui.cooldown": ["COOLDOWN", "خنک‌شدن", "ENFRIAMIENTO", "تبريد", "RECHARGE", "ABKLINGZEIT", "RECARGA", "BEKLEME", "クールダウン", "冷却", "कूलडाउन"],
        "ui.chooseOne": ["CHOOSE ONE", "یکی را انتخاب کن", "ELIGE UNO", "اختر واحداً", "CHOISISSEZ", "EINS WÄHLEN", "ESCOLHA UM", "BİRİNİ SEÇ", "1つ選択", "选择一个", "एक चुनें"],
        "ui.level": ["LEVEL", "سطح", "NIVEL", "مستوى", "NIVEAU", "LEVEL", "NÍVEL", "SEVİYE", "レベル", "等级", "स्तर"],
        "ui.patch": ["PATCH", "ارتقا", "MEJORA", "تطوير", "PATCH", "PATCH", "PATCH", "YÜKSELT", "パッチ", "升级", "अपग्रेड"],
        "ui.max": ["MAX", "حداکثر", "MÁX", "أقصى", "MAX", "MAX", "MÁX", "MAKS", "最大", "最大", "अधिकतम"],
        "ui.equipped": ["EQUIPPED", "مجهز", "EQUIPADO", "مجهز", "ÉQUIPÉ", "AUSGERÜSTET", "EQUIPADO", "KUŞANILDI", "装備中", "已装备", "सुसज्जित"],
        "ui.online": ["ONLINE", "فعال", "ACTIVO", "نشط", "ACTIF", "AKTIV", "ATIVO", "ETKİN", "起動", "已启动", "सक्रिय"],
        "ui.boss": ["BOSS", "باس", "JEFE", "زعيم", "BOSS", "BOSS", "CHEFE", "BOSS", "ボス", "首领", "बॉस"],
        "ui.elite": ["ELITE", "نخبه", "ÉLITE", "نخبة", "ÉLITE", "ELITE", "ELITE", "ELİT", "エリート", "精英", "एलीट"],
        "ui.threat": ["THREAT", "تهدید", "AMENAZA", "تهديد", "MENACE", "BEDROHUNG", "AMEAÇA", "TEHDİT", "脅威", "威胁", "खतरा"],
        "ui.s": ["s", "ث", "s", "ث", "s", "s", "s", "sn", "秒", "秒", "से"],
        "ui.x": ["X", "×", "X", "×", "X", "X", "X", "X", "×", "×", "×"],
        "ability.surge": ["BUY SURGE", "موج BUY", "OLEADA BUY", "اندفاع BUY", "SURGE BUY", "BUY-SCHUB", "SURTO BUY", "BUY ATAĞI", "BUY サージ", "BUY 涌流", "BUY सर्ज"],
        "ability.dash": ["EXIT LIQUIDITY", "نقدینگی خروج", "LIQUIDEZ DE SALIDA", "سيولة الخروج", "LIQUIDITÉ DE SORTIE", "EXIT-LIQUIDITÄT", "LIQUIDEZ DE SAÍDA", "ÇIKIŞ LİKİDİTESİ", "出口流動性", "退出流动性", "एग्ज़िट लिक्विडिटी"],
        "ability.bomb": ["MARGIN CALL", "کال مارجین", "LLAMADA DE MARGEN", "نداء الهامش", "APPEL DE MARGE", "MARGIN CALL", "MARGIN CALL", "TEMİNAT ÇAĞRISI", "マージンコール", "追加保证金", "मार्जिन कॉल"],
        "msg.buySurge": ["BUY SURGE // latency removed.", "موج BUY // تأخیر حذف شد.", "OLEADA BUY // latencia eliminada.", "اندفاع BUY // أزيل التأخير.", "SURGE BUY // latence supprimée.", "BUY-SCHUB // Latenz entfernt.", "SURTO BUY // latência removida.", "BUY ATAĞI // gecikme kaldırıldı.", "BUY サージ // 遅延解除。", "BUY 涌流 // 延迟消除。", "BUY सर्ज // विलंब हटाया।"],
        "msg.echoTime": ["ECHO // TIME FRACTURE", "اکو // شکاف زمان", "ECO // FRACTURA TEMPORAL", "الصدى // تشقق الزمن", "ÉCHO // FRACTURE TEMPORELLE", "ECHO // ZEITRISS", "ECO // FRATURA TEMPORAL", "EKO // ZAMAN ÇATLAĞI", "エコー // 時間断裂", "回声 // 时间裂隙", "इको // समय दरार"],
        "msg.echoChain": ["ECHO // CHAIN REACTION", "اکو // واکنش زنجیره‌ای", "ECO // REACCIÓN EN CADENA", "الصدى // تفاعل متسلسل", "ÉCHO // RÉACTION EN CHAÎNE", "ECHO // KETTENREAKTION", "ECO // REAÇÃO EM CADEIA", "EKO // ZİNCİRLEME TEPKİ", "エコー // チェーンリアクション", "回声 // 链式反应", "इको // चेन रिएक्शन"],
        "msg.echoCrowd": ["ECHO // CROWD SURGE", "اکو // موج جمعیت", "ECO // OLEADA", "الصدى // اندفاع الجمهور", "ÉCHO // VAGUE DE FOULE", "ECHO // MASSENWELLE", "ECO // ONDA DA MULTIDÃO", "EKO // KALABALIK DALGASI", "エコー // 群衆サージ", "回声 // 人群涌动", "इको // भीड़ उछाल"],
        "msg.echoZeroG": ["ECHO // ZERO-G", "اکو // بی‌گرانش", "ECO // CERO-G", "الصدى // بلا جاذبية", "ÉCHO // ZÉRO-G", "ECHO // ZERO-G", "ECO // ZERO-G", "EKO // SIFIR-G", "エコー // ゼロG", "回声 // 零重力", "इको // ZERO-G"],
        "msg.echoCold": ["ECHO // COLD STORAGE", "اکو // ذخیره‌سازی سرد", "ECO // ALMACÉN FRÍO", "الصدى // تخزين بارد", "ÉCHO // STOCKAGE FROID", "ECHO // KALTSPEICHER", "ECO // ARMAZENAMENTO FRIO", "EKO // SOĞUK DEPO", "エコー // コールドストレージ", "回声 // 冷存储", "इको // कोल्ड स्टोरेज"],
        "msg.echoHood": ["ECHO // HOOD SHIFT", "اکو // تغییر هود", "ECO // CAMBIO DE CAPUCHA", "الصدى // تحول الغطاء", "ÉCHO // GLISSEMENT DE CAPUCHE", "ECHO // HOOD-SHIFT", "ECO // MUDANÇA DE CAPUZ", "EKO // KAPÜŞON KAYMASI", "エコー // フードシフト", "回声 // 兜帽偏移", "इको // हुड शिफ्ट"],
        "msg.echoDip": ["ECHO // BUY THE DIP", "اکو // خرید در کف", "ECO // COMPRAR LA CAÍDA", "الصدى // اشتر عند الهبوط", "ÉCHO // ACHETER LA BAISSE", "ECHO // BUY THE DIP", "ECO // COMPRAR NA BAIXA", "EKO // DÜŞÜŞÜ AL", "エコー // 押し目買い", "回声 // 逢低买入", "इको // गिरावट खरीदें"],
        "msg.echoCast": ["ECHO CAST // {value}", "اجرای اکو // {value}", "LANZAMIENTO ECO // {value}", "إطلاق الصدى // {value}", "LANCEMENT ÉCHO // {value}", "ECHO-WURF // {value}", "LANÇAMENTO ECO // {value}", "EKO ATIŞI // {value}", "エコー発動 // {value}", "回声施放 // {value}", "इको कास्ट // {value}"],
        "msg.echoReady": ["X // ECHO // READY", "X // اکو // آماده", "X // ECO // LISTO", "X // الصدى // جاهز", "X // ÉCHO // PRÊT", "X // ECHO // BEREIT", "X // ECO // PRONTO", "X // EKO // HAZIR", "X // エコー // 準備完了", "X // 回声 // 就绪", "X // इको // तैयार"],
        "msg.echoCooldown": ["X // ECHO // {value}s", "X // اکو // {value}ث", "X // ECO // {value}s", "X // الصدى // {value}ث", "X // ÉCHO // {value}s", "X // ECHO // {value}s", "X // ECO // {value}s", "X // EKO // {value}sn", "X // エコー // {value}秒", "X // 回声 // {value}秒", "X // इको // {value}से"]
      });
      addRuntimeRows({
        "frontier.flashCrash.title": ["FLASH CRASH", "سقوط برق‌آسا", "CRASH RELÁMPAGO", "انهيار خاطف", "KRAK ÉCLAIR", "FLASH-CRASH", "QUEDA RELÂMPAGO", "ANI ÇÖKÜŞ", "フラッシュクラッシュ", "闪崩", "फ्लैश क्रैश"],
        "frontier.flashCrash.message": ["FLASH CRASH // hostile routing accelerates.", "سقوط برق‌آسا // مسیر دشمنان سریع‌تر شد.", "CRASH RELÁMPAGO // las rutas enemigas aceleran.", "انهيار خاطف // تتسارع مسارات الأعداء.", "KRAK ÉCLAIR // les routes ennemies accélèrent.", "FLASH-CRASH // Feindrouten beschleunigen.", "QUEDA RELÂMPAGO // rotas hostis aceleram.", "ANI ÇÖKÜŞ // düşman rotaları hızlanıyor.", "フラッシュクラッシュ // 敵ルート加速。", "闪崩 // 敌方路线加速。", "फ्लैश क्रैश // दुश्मन रूट तेज़。"],
        "frontier.overclock.title": ["OVERCLOCK", "اورکلاک", "SOBREFRECUENCIA", "تسريع", "SURCADENCE", "ÜBERTAKTUNG", "SOBRECARGA", "AŞIRI HIZ", "オーバークロック", "超频", "ओवरक्लॉक"],
        "frontier.overclock.message": ["OVERCLOCK // press cadence temporarily amplified.", "اورکلاک // ریتم فشار موقتاً تقویت شد.", "SOBREFRECUENCIA // cadencia amplificada temporalmente.", "تسريع // تعزز إيقاع الضغط مؤقتاً.", "SURCADENCE // cadence amplifiée temporairement.", "ÜBERTAKTUNG // Drucktempo kurz verstärkt.", "SOBRECARGA // cadência ampliada temporariamente.", "AŞIRI HIZ // basış ritmi geçici güçlendi.", "オーバークロック // 押下テンポ一時強化。", "超频 // 按压节奏暂时增强。", "ओवरक्लॉक // प्रेस रिदम अस्थायी बढ़ा।"],
        "frontier.mirrorTrade.title": ["MIRROR TRADE", "معاملهٔ آینه‌ای", "COMERCIO ESPEJO", "تجارة مرآة", "TRADE MIROIR", "SPIEGELHANDEL", "COMÉRCIO ESPELHO", "AYNA TİCARETİ", "ミラートレード", "镜像交易", "मिरर ट्रेड"],
        "frontier.mirrorTrade.message": ["MIRROR TRADE // duplicate signals enter the book.", "معاملهٔ آینه‌ای // سیگنال‌های تکراری وارد دفتر شدند.", "COMERCIO ESPEJO // entran señales duplicadas.", "تجارة مرآة // إشارات مكررة تدخل السجل.", "TRADE MIROIR // des signaux doublés entrent.", "SPIEGELHANDEL // doppelte Signale dringen ein.", "COMÉRCIO ESPELHO // sinais duplicados entram.", "AYNA TİCARETİ // kopya sinyaller deftere giriyor.", "ミラートレード // 複製シグナル侵入。", "镜像交易 // 重复信号进入账本。", "मिरर ट्रेड // डुप्लिकेट सिग्नल आ रहे हैं。"],
        "frontier.reverseFlow.title": ["REVERSE FLOW", "جریان معکوس", "FLUJO INVERSO", "تدفق عكسي", "FLUX INVERSÉ", "UMGEKEHRTER FLUSS", "FLUXO REVERSO", "TERS AKIŞ", "リバースフロー", "逆流", "रिवर्स फ्लो"],
        "frontier.reverseFlow.message": ["REVERSE FLOW // movement vectors briefly invert.", "جریان معکوس // بردارهای حرکت کوتاه‌مدت برعکس شدند.", "FLUJO INVERSO // los vectores se invierten brevemente.", "تدفق عكسي // تنعكس متجهات الحركة مؤقتاً.", "FLUX INVERSÉ // les vecteurs s’inversent brièvement.", "UMGEKEHRTER FLUSS // Bewegungsvektoren drehen kurz um.", "FLUXO REVERSO // vetores se invertem brevemente.", "TERS AKIŞ // hareket vektörleri kısa süre ters.", "リバースフロー // 移動ベクトルが一時反転。", "逆流 // 移动向量短暂反转。", "रिवर्स फ्लो // गति वेक्टर थोड़ी देर उलटे。"]
      });
      addRuntimeRows({
        "msg.buyDipStand": ["BUY THE DIP // the last stand is live.", "BUY THE DIP // آخرین ایستادگی فعال شد.", "BUY THE DIP // la última resistencia está activa.", "BUY THE DIP // بدأ الصمود الأخير.", "BUY THE DIP // le dernier combat commence.", "BUY THE DIP // der letzte Widerstand läuft.", "BUY THE DIP // a última resistência começou.", "BUY THE DIP // son direniş başladı.", "BUY THE DIP // ラストスタンド開始。", "BUY THE DIP // 最后的坚守已启动。", "BUY THE DIP // आख़िरी मोर्चा सक्रिय।"],
        "msg.lastStandFlash": ["LAST STAND", "آخرین ایستادگی", "ÚLTIMA RESISTENCIA", "الصمود الأخير", "DERNIER COMBAT", "LETZTER WIDERSTAND", "ÚLTIMA RESISTÊNCIA", "SON DİRENİŞ", "ラストスタンド", "最后坚守", "आख़िरी मोर्चा"],
        "msg.marginCallRoom": ["MARGIN CALL // the whole room just broke.", "کال مارجین // کل اتاق فرو ریخت.", "LLAMADA DE MARGEN // toda la sala se rompió.", "نداء الهامش // انهارت الغرفة كلها.", "APPEL DE MARGE // toute la salle vient de casser.", "MARGIN CALL // der ganze Raum brach zusammen.", "MARGIN CALL // a sala inteira quebrou.", "TEMİNAT ÇAĞRISI // tüm oda çöktü.", "マージンコール // 部屋全体が崩れた。", "追加保证金 // 整个房间崩裂。", "मार्जिन कॉल // पूरा कमरा टूट गया।"],
        "msg.splitterBreak": ["SPLITTER // one position became two.", "شکافنده // یک موقعیت دو تا شد.", "DIVISOR // una posición se volvió dos.", "المُجزّئ // أصبح المركز اثنين.", "DIVISEUR // une position devient deux.", "TEILER // eine Position wurde zu zwei.", "DIVISOR // uma posição virou duas.", "BÖLÜCÜ // bir pozisyon iki oldu.", "スプリッター // 1つのポジションが2つに。", "分裂者 // 一个阵位变成两个。", "स्प्लिटर // एक स्थिति दो हो गई।"],
        "msg.hoodPhase": ["HOOD SHIFT // HIT PHASED", "تغییر هود // ضربه فازی شد", "CAMBIO DE CAPUCHA // GOLPE FASEADO", "تحول الغطاء // الضربة عبرت الطور", "GLISSEMENT DE CAPUCHE // COUP PHASÉ", "HOOD-SHIFT // TREFFER PHASIERT", "MUDANÇA DE CAPUZ // GOLPE EM FASE", "KAPÜŞON KAYMASI // VURUŞ FAZLANDI", "フードシフト // 攻撃を位相化", "兜帽偏移 // 攻击相位化", "हुड शिफ्ट // वार फेज़ हुआ"]
      });
      addRuntimeRows({
        "msg.echoTime": ["ECHO // TIME FRACTURE", "اکو // شکاف زمان", "ECO // FRACTURA TEMPORAL", "الصدى // تشقق الزمن", "ÉCHO // FRACTURE TEMPORELLE", "ECHO // ZEITRISS", "ECO // FRATURA TEMPORAL", "EKO // ZAMAN ÇATLAĞI", "エコー // 時間断裂", "回声 // 时间裂隙", "इको // समय दरार"],
        "msg.echoChain": ["ECHO // CHAIN REACTION", "اکو // واکنش زنجیره‌ای", "ECO // REACCIÓN EN CADENA", "الصدى // تفاعل متسلسل", "ÉCHO // RÉACTION EN CHAÎNE", "ECHO // KETTENREAKTION", "ECO // REAÇÃO EM CADEIA", "EKO // ZİNCİRLEME TEPKİ", "エコー // チェーンリアクション", "回声 // 链式反应", "इको // चेन रिएक्शन"],
        "msg.echoCrowd": ["ECHO // CROWD SURGE", "اکو // موج جمعیت", "ECO // OLEADA", "الصدى // اندفاع الجمهور", "ÉCHO // VAGUE DE FOULE", "ECHO // MASSENWELLE", "ECO // ONDA DA MULTIDÃO", "EKO // KALABALIK DALGASI", "エコー // 群衆サージ", "回声 // 人群涌动", "इको // भीड़ उछाल"],
        "msg.echoZeroG": ["ECHO // ZERO-G", "اکو // بی‌گرانش", "ECO // CERO-G", "الصدى // بلا جاذبية", "ÉCHO // ZÉRO-G", "ECHO // ZERO-G", "ECO // ZERO-G", "EKO // SIFIR-G", "エコー // ゼロG", "回声 // 零重力", "इको // ZERO-G"],
        "msg.echoCold": ["ECHO // COLD STORAGE", "اکو // ذخیره‌سازی سرد", "ECO // ALMACÉN FRÍO", "الصدى // تخزين بارد", "ÉCHO // STOCKAGE FROID", "ECHO // KALTSPEICHER", "ECO // ARMAZENAMENTO FRIO", "EKO // SOĞUK DEPO", "エコー // コールドストレージ", "回声 // 冷存储", "इको // कोल्ड स्टोरेज"],
        "msg.echoHood": ["ECHO // HOOD SHIFT", "اکو // تغییر هود", "ECO // CAMBIO DE CAPUCHA", "الصدى // تحول الغطاء", "ÉCHO // GLISSEMENT DE CAPUCHE", "ECHO // HOOD-SHIFT", "ECO // MUDANÇA DE CAPUZ", "EKO // KAPÜŞON KAYMASI", "エコー // フードシフト", "回声 // 兜帽偏移", "इको // हुड शिफ्ट"],
        "msg.echoDip": ["ECHO // BUY THE DIP", "اکو // خرید در کف", "ECO // COMPRAR LA CAÍDA", "الصدى // اشتر عند الهبوط", "ÉCHO // ACHETER LA BAISSE", "ECHO // BUY THE DIP", "ECO // COMPRAR NA BAIXA", "EKO // DÜŞÜŞÜ AL", "エコー // 押し目買い", "回声 // 逢低买入", "इको // गिरावट खरीदें"],
        "msg.buySurge": ["BUY SURGE // latency removed.", "موج BUY // تأخیر حذف شد.", "OLEADA BUY // latencia eliminada.", "اندفاع BUY // أزيل التأخير.", "SURGE BUY // latence supprimée.", "BUY-SCHUB // Latenz entfernt.", "SURTO BUY // latência removida.", "BUY ATAĞI // gecikme kaldırıldı.", "BUY サージ // 遅延解除。", "BUY 涌流 // 延迟消除。", "BUY सर्ज // विलंब हटाया।"],
        "msg.marginCallRoom": ["MARGIN CALL // the room is yours.", "کال مارجین // این اتاق مال توست.", "LLAMADA DE MARGEN // la sala es tuya.", "نداء الهامش // الغرفة لك.", "APPEL DE MARGE // la salle est à vous.", "MARGIN CALL // der Raum gehört dir.", "MARGIN CALL // a sala é sua.", "TEMİNAT ÇAĞRISI // oda senin.", "マージンコール // 部屋はあなたのもの。", "追加保证金 // 房间归你。", "मार्जिन कॉल // कमरा आपका है।"],
        "msg.leechDrain": ["LEECH // momentum siphoned", "زالو // شتاب مکیده شد", "SANGUIJUELA // impulso drenado", "علقة // استُنزف الزخم", "SANGSUE // élan siphonné", "EGEL // Schwung abgesaugt", "SANGUESSUGA // impulso drenado", "SÜLÜK // ivme emiliyor", "リーチ // 勢い吸収", "吸血虫 // 动能被吸走", "लीच // गति सोखी गई"],
        "msg.criticalPress": ["VOLATILE EDGE // CRITICAL PRESS", "لبهٔ نوسانی // فشار بحرانی", "BORDE VOLÁTIL // PULSACIÓN CRÍTICA", "حافة متقلبة // ضربة حرجة", "LAME VOLATILE // PRESSION CRITIQUE", "VOLATILE KANTE // KRITISCHER DRUCK", "BORDA VOLÁTIL // TOQUE CRÍTICO", "OYNÁK KENAR // KRİTİK BASIŞ", "ボラティルエッジ // クリティカル", "波动锋刃 // 暴击按压", "वोलाटाइल एज // क्रिटिकल प्रेस"],
        "msg.scammerShield": ["SCAMMER // shielded quote. wait for the reveal.", "اسکمر // قیمت سپر شده؛ منتظر افشا باش.", "ESTAFADOR // cotización protegida. espera la revelación.", "المحتال // عرض محمي. انتظر الكشف.", "ARNAQUEUR // cote protégée. attendez la révélation.", "BETRÜGER // geschütztes Quote. Warte auf die Aufdeckung.", "GOLPISTA // cotação protegida. aguarde a revelação.", "DOLANDIRICI // fiyat korumalı. açığa çıkmasını bekle.", "スキャマー // 保護された価格。公開を待て。", "骗子 // 报价受保护，等待揭示。", "स्कैमर // कोट सुरक्षित; खुलासे की प्रतीक्षा।"],
        "msg.overclockPattern": ["OVERCLOCKED // three lanes, one decision.", "اورکلاک‌شده // سه مسیر، یک تصمیم.", "SOBREFRECUENCIA // tres carriles, una decisión.", "تسريع // ثلاثة مسارات وقرار واحد.", "SURCADENCÉ // trois voies, une décision.", "ÜBERTAKTET // drei Bahnen, eine Entscheidung.", "SOBRECARGA // três faixas, uma decisão.", "AŞIRI HIZ // üç hat, tek karar.", "オーバークロック // 3レーン、1つの決断。", "超频 // 三条路线，一个决定。", "ओवरक्लॉक // तीन लेन, एक फैसला।"],
        "msg.fortifiedPattern": ["FORTIFIED // armor window is live.", "تقویت‌شده // پنجرهٔ زره فعال است.", "FORTIFICADO // ventana de armadura activa.", "محصّن // نافذة الدرع فعالة.", "FORTIFIÉ // fenêtre d’armure active.", "VERSTÄRKT // Rüstungsfenster aktiv.", "FORTIFICADO // janela de armadura ativa.", "TAKVİYELİ // zırh penceresi açık.", "フォーティファイド // 装甲ウィンドウ作動。", "强化 // 护甲窗口开启。", "फोर्टिफाइड // कवच विंडो सक्रिय।"],
        "msg.phasePattern": ["PHASE SHIFT // the target changed coordinates.", "تغییر فاز // هدف مختصاتش را عوض کرد.", "CAMBIO DE FASE // el objetivo cambió coordenadas.", "تحول الطور // غيّر الهدف إحداثياته.", "CHANGEMENT DE PHASE // la cible a changé de coordonnées.", "PHASENWECHSEL // Ziel änderte Koordinaten.", "MUDANÇA DE FASE // o alvo mudou de coordenadas.", "FAZ KAYMASI // hedef koordinat değiştirdi.", "フェイズシフト // 標的の座標が変化。", "相位转移 // 目标改变坐标。", "फेज़ शिफ्ट // लक्ष्य ने निर्देशांक बदले।"],
        "msg.redlinePattern": ["REDLINE // no safe side of the book.", "خط قرمز // هیچ سمت امنی نیست.", "LÍNEA ROJA // no hay lado seguro.", "الخط الأحمر // لا جانب آمن.", "LIGNE ROUGE // aucun côté sûr.", "ROTLINIE // keine sichere Seite.", "LINHA VERMELHA // nenhum lado seguro.", "KIRMIZI ÇİZGİ // güvenli taraf yok.", "レッドライン // 安全な側なし。", "红线 // 没有安全一侧。", "रेडलाइन // कोई सुरक्षित ओर नहीं।"],
        "msg.lockoutPattern": ["THE LOCKOUT // expanding ring.", "قفل نهایی // حلقه در حال گسترش.", "EL BLOQUEO // anillo expansivo.", "الإغلاق // حلقة تتمدد.", "LE BLOCAGE // anneau expansif.", "DIE SPERRE // expandierender Ring.", "O BLOQUEIO // anel expansivo.", "KİLİT DIŞI // genişleyen halka.", "ロックアウト // 拡大リング。", "封锁者 // 环形扩张。", "द लॉकआउट // फैलता घेरा।"],
        "msg.clearingPattern": ["CLEARING HOUSE // collateral incoming.", "اتاق تسویه // وثیقه در راه است.", "CÁMARA DE COMPENSACIÓN // llega la garantía.", "دار المقاصة // الضمان قادم.", "CHAMBRE DE COMPENSATION // garantie entrante.", "CLEARINGSTELLE // Sicherheiten kommen.", "CÂMARA DE COMPENSAÇÃO // garantia a caminho.", "TAHSİLAT MERKEZİ // teminat geliyor.", "クリアリングハウス // 担保接近。", "清算所 // 抵押物来袭。", "क्लियरिंग हाउस // कोलेटरल आ रहा है।"],
        "msg.oraclePattern": ["THE ORACLE // prediction tax.", "پیشگو // مالیات پیش‌بینی.", "EL ORÁCULO // impuesto de predicción.", "العراف // ضريبة التنبؤ.", "L’ORACLE // taxe de prédiction.", "DAS ORAKEL // Vorhersagesteuer.", "O ORÁCULO // imposto de previsão.", "KAHİN // tahmin vergisi.", "オラクル // 予測税。", "先知 // 预测税。", "द ओरेकल // अनुमान कर।"],
        "msg.robinPattern": ["ROBIN PRIME // the mascot calls reinforcements.", "رابین پرایم // نماد نیروی کمکی می‌خواند.", "ROBIN PRIME // la mascota llama refuerzos.", "روبين برايم // الشخصية تستدعي التعزيزات.", "ROBIN PRIME // la mascotte appelle des renforts.", "ROBIN PRIME // das Maskottchen ruft Verstärkung.", "ROBIN PRIME // o mascote chama reforços.", "ROBIN PRIME // maskot takviye çağırıyor.", "ロビン・プライム // マスコットが援軍を呼ぶ。", "罗宾至尊 // 吉祥物召来援军。", "रॉबिन प्राइम // मस्कॉट मदद बुलाता है।"],
        "msg.coreOpening": ["CORE LOCK // FIND THE OPENING", "قفل هسته // شکاف را پیدا کن", "NÚCLEO BLOQUEADO // ENCUENTRA LA APERTURA", "قفل النواة // اعثر على الفتحة", "NOYAU VERROUILLÉ // TROUVEZ L’OUVERTURE", "KERN GESPERRT // ÖFFNUNG FINDEN", "NÚCLEO TRAVADO // ENCONTRE A ABERTURA", "ÇEKİRDEK KİLİTLİ // AÇIĞI BUL", "コアロック // 開口を探せ", "核心锁定 // 找到缺口", "कोर लॉक // खुलाव खोजें"],
        "msg.glitchReveal": ["SCAMMER // shielded quote. wait for the reveal.", "اسکمر // قیمت سپر شده؛ منتظر افشا باش.", "ESTAFADOR // cotización protegida. espera la revelación.", "المحتال // عرض محمي. انتظر الكشف.", "ARNAQUEUR // cote protégée. attendez la révélation.", "BETRÜGER // geschütztes Quote. Warte auf die Aufdeckung.", "GOLPISTA // cotação protegida. aguarde a revelação.", "DOLANDIRICI // fiyat korumalı. açığa çıkmasını bekle.", "スキャマー // 保護された価格。公開を待て。", "骗子 // 报价受保护，等待揭示。", "स्कैमर // कोट सुरक्षित; खुलासे की प्रतीक्षा।"]
      });
      addRuntimeRows({
        "affix.overclocked.name": ["OVERCLOCKED", "اورکلاک‌شده", "SOBREFRECUENCIA", "مُسرَّع", "SURCADENCÉ", "ÜBERTAKTET", "SOBRECARGA", "AŞIRI HIZLI", "オーバークロック", "超频", "ओवरक्लॉक"],
        "affix.overclocked.tag": ["RAPID FIRE", "شلیک سریع", "FUEGO RÁPIDO", "إطلاق سريع", "TIR RAPIDE", "SCHNELLFEUER", "TIRO RÁPIDO", "HIZLI ATEŞ", "高速射撃", "快速射击", "तेज़ फायर"],
        "affix.fortified.name": ["FORTIFIED", "تقویت‌شده", "FORTIFICADO", "مُحصَّن", "FORTIFIÉ", "VERSTÄRKT", "FORTIFICADO", "TAKVİYELİ", "フォーティファイド", "强化", "फोर्टिफाइड"],
        "affix.fortified.tag": ["ARMORED CORE", "هستهٔ زرهی", "NÚCLEO BLINDADO", "نواة مدرعة", "NOYAU BLINDÉ", "PANZERKERN", "NÚCLEO BLINDADO", "ZIRHLI ÇEKİRDEK", "装甲コア", "装甲核心", "बख़्तरबंद कोर"],
        "affix.phaseShift.name": ["PHASE SHIFT", "تغییر فاز", "CAMBIO DE FASE", "تحول الطور", "CHANGEMENT DE PHASE", "PHASENWECHSEL", "MUDANÇA DE FASE", "FAZ KAYMASI", "フェイズシフト", "相位转移", "फेज़ शिफ्ट"],
        "affix.phaseShift.tag": ["TELEPORT ROUTE", "مسیر انتقال", "RUTA DE TELETRANSPORTE", "مسار انتقال", "ROUTE TÉLÉPORT", "TELEPORT-ROUTE", "ROTA DE TELEPORTE", "IŞINLANMA ROTASI", "テレポートルート", "传送路线", "टेलीपोर्ट रूट"],
        "affix.redline.name": ["REDLINE", "خط قرمز", "LÍNEA ROJA", "الخط الأحمر", "LIGNE ROUGE", "ROTLINIE", "LINHA VERMELHA", "KIRMIZI ÇİZGİ", "レッドライン", "红线", "रेडलाइन"],
        "affix.redline.tag": ["NO MERCY", "بدون رحم", "SIN PIEDAD", "لا رحمة", "SANS PITIÉ", "KEINE GNADE", "SEM PIEDADE", "MERHAMET YOK", "容赦なし", "毫不留情", "कोई दया नहीं"],
        "mutator.rushHour.name": ["RUSH HOUR", "ساعت شلوغ", "HORA PUNTA", "ساعة الذروة", "HEURE DE POINTE", "STOSSZEIT", "HORA DE PICO", "YOĞUN SAAT", "ラッシュアワー", "高峰时段", "रश आवर"],
        "mutator.rushHour.tag": ["SPEED CONTRACT", "قرارداد سرعت", "CONTRATO DE VELOCIDAD", "عقد السرعة", "CONTRAT DE VITESSE", "TEMPOVERTRAG", "CONTRATO DE VELOCIDADE", "HIZ SÖZLEŞMESİ", "スピード契約", "速度合约", "स्पीड कॉन्ट्रैक्ट"],
        "mutator.rushHour.desc": ["Hostiles route 18% faster; premium score, leaner payout.", "دشمنان ۱۸٪ سریع‌تر می‌آیند؛ امتیاز بیشتر، پاداش نقدی کمتر.", "Los hostiles van 18% más rápido; más puntos, menos valor.", "الأعداء أسرع 18٪؛ نقاط أكثر وقيمة أقل.", "Les hostiles vont 18 % plus vite; score premium, gain réduit.", "Feinde sind 18 % schneller; mehr Punkte, weniger Auszahlung.", "Hostis 18% mais rápidos; mais pontos, menos valor.", "Düşmanlar %18 hızlı; skor yüksek, ödeme düşük.", "敵が18%高速化。スコア増、報酬減。", "敌人快18%；分数更高，收益更低。", "दुश्मन 18% तेज़; स्कोर अधिक, भुगतान कम।"],
        "mutator.thinIce.name": ["THIN ICE", "یخ نازک", "HIELO FINO", "جليد رقيق", "GLACE FINE", "DÜNNES EIS", "GELO FINO", "İNCE BUZ", "薄氷", "薄冰", "पतली बर्फ"],
        "mutator.thinIce.tag": ["FRAGILE SIGNAL", "سیگنال شکننده", "SEÑAL FRÁGIL", "إشارة هشة", "SIGNAL FRAGILE", "ZERBRECHLICHES SIGNAL", "SINAL FRÁGIL", "KIRILGAN SİNYAL", "脆いシグナル", "脆弱信号", "नाज़ुक सिग्नल"],
        "mutator.thinIce.desc": ["Incoming damage rises, but every cache is worth more.", "آسیب دریافتی بیشتر است، اما هر کش ارزش بیشتری دارد.", "Recibes más daño, pero cada caja vale más.", "الضرر الوارد أعلى، لكن كل مخزون أثمن.", "Les dégâts reçus montent, mais chaque cache vaut plus.", "Mehr eingehender Schaden, aber jeder Cache ist wertvoller.", "Você sofre mais dano, mas cada cache vale mais.", "Gelen hasar artar, her kasa daha değerli.", "被ダメージ増加。ただしキャッシュ価値上昇。", "受到伤害增加，但每个缓存更值钱。", "नुकसान बढ़ता है, पर हर कैश अधिक मूल्यवान।"],
        "mutator.doubleExposure.name": ["DOUBLE EXPOSURE", "مواجههٔ دوگانه", "DOBLE EXPOSICIÓN", "تعرض مزدوج", "DOUBLE EXPOSITION", "DOPPELTE EXPOSITION", "DUPLA EXPOSIÇÃO", "ÇİFT MARUZİYET", "ダブルエクスポージャー", "双重暴露", "डबल एक्सपोज़र"],
        "mutator.doubleExposure.tag": ["HEAVY BOOK", "دفتر سنگین", "LIBRO PESADO", "سجل ثقيل", "CARNET LOURD", "SCHWERES BUCH", "LIVRO PESADO", "AĞIR DEFTER", "ヘビーブック", "重账本", "भारी बुक"],
        "mutator.doubleExposure.desc": ["More bodies and thicker elites flood the frontier for a huge score edge.", "دشمنان بیشتر و الیت‌های جان‌سخت‌تر می‌آیند؛ امتیاز جهش می‌کند.", "Más cuerpos y élites duras inundan la frontera por una gran ventaja de puntos.", "أجساد أكثر ونخبة أسمك مقابل أفضلية نقاط ضخمة.", "Plus de corps et d’élites solides pour un gros bonus de score.", "Mehr Gegner und zähere Eliten für einen gewaltigen Score-Vorteil.", "Mais inimigos e elites mais fortes por uma grande vantagem de pontuação.", "Daha çok düşman ve kalın elitler, büyük skor avantajı.", "敵と強化エリートが増加。スコア大幅上昇。", "更多敌人和更厚精英，换取巨大分数优势。", "ज़्यादा दुश्मन और मज़बूत एलिट, बड़ा स्कोर लाभ।"],
        "mutator.quietSignal.name": ["QUIET SIGNAL", "سیگنال آرام", "SEÑAL SILENCIOSA", "إشارة هادئة", "SIGNAL CALME", "RUHIGES SIGNAL", "SINAL SILENCIOSO", "SESSİZ SİNYAL", "静かなシグナル", "静默信号", "शांत सिग्नल"],
        "mutator.quietSignal.tag": ["PRECISION RUN", "ران دقیق", "PARTIDA DE PRECISIÓN", "جولة دقيقة", "RUN DE PRÉCISION", "PRÄZISIONSLAUF", "CORRIDA DE PRECISÃO", "HASSAS KOŞU", "精密ラン", "精准挑战", "सटीक रन"],
        "mutator.quietSignal.desc": ["Fewer hostiles, tighter routes, and a high-value precision payout.", "دشمن کمتر و مسیر فشرده‌تر؛ پاداش دقیق و ارزشمند.", "Menos hostiles, rutas cerradas y pago de precisión.", "أعداء أقل ومسارات أضيق ومكافأة دقيقة عالية.", "Moins d’hostiles, routes serrées, récompense de précision.", "Weniger Feinde, engere Routen und hohe Präzisionsauszahlung.", "Menos hostis, rotas apertadas e pagamento de precisão.", "Daha az düşman, dar rotalar, yüksek hassasiyet ödülü.", "敵は少なめ、ルートは厳密、高価値報酬。", "敌人更少、路线更紧，精准奖励更高。", "दुश्मन कम, रास्ते सख्त, सटीक भुगतान ऊँचा।"],
        "mutator.redLedger.name": ["RED LEDGER", "دفتر قرمز", "LIBRO ROJO", "السجل الأحمر", "CARNET ROUGE", "ROTES LEDGER", "LIVRO VERMELHO", "KIRMIZI DEFTER", "レッドレジャー", "红色账本", "रेड लेजर"],
        "mutator.redLedger.tag": ["VOLATILE BOOK", "دفتر نوسانی", "LIBRO VOLÁTIL", "سجل متقلب", "CARNET VOLATIL", "VOLATILES BUCH", "LIVRO VOLÁTIL", "OYNak DEFTER", "不安定な帳簿", "波动账本", "अस्थिर बुक"],
        "mutator.redLedger.desc": ["The frontier reconfigures faster; missed shots leave no room to breathe.", "مرز سریع‌تر عوض می‌شود؛ شلیک‌های خطا فرصت نفس نمی‌دهند.", "La frontera cambia más rápido; los fallos no dejan respirar.", "يعاد تشكيل الحدود أسرع؛ الطلقات الضائعة لا تترك مجالاً.", "La frontière se reconfigure plus vite; chaque tir raté étouffe.", "Die Grenze konfiguriert sich schneller; Fehlschüsse lassen keinen Raum.", "A fronteira muda mais rápido; tiros errados apertam o cerco.", "Sınır daha hızlı değişir; ıskalar nefes bırakmaz.", "フロンティア再構成が加速。ミスに余裕なし。", "边境重构更快；空枪不给喘息。", "फ्रंटियर तेज़ी से बदले; चूक में साँस की जगह नहीं।"],
        "contract.stampede.name": ["STAMPEDE", "هجوم گله‌ای", "ESTAMPIDA", "تدافع", "RUÉE", "STAMPede", "ESTAMPIDA", "PANİK AKINI", "スタンピード", "狂奔", "भगदड़"],
        "contract.stampede.tag": ["SWARM ROUTE", "مسیر ازدحام", "RUTA DE ENJAMBRE", "مسار السرب", "ROUTE D’ESSAIM", "SCHWARM-ROUTE", "ROTA DE ENXAME", "SÜRÜ ROTASI", "スウォームルート", "蜂群路线", "झुंड रूट"],
        "contract.stampede.desc": ["Fast bodies fill the lanes.", "دشمنان سریع مسیرها را پر می‌کنند.", "Cuerpos veloces llenan los carriles.", "أجساد سريعة تملأ المسارات.", "Des corps rapides remplissent les voies.", "Schnelle Gegner füllen die Bahnen.", "Corpos rápidos ocupam as faixas.", "Hızlı düşmanlar hatları doldurur.", "高速の敵がレーンを埋める。", "快速敌人填满路线。", "तेज़ दुश्मन लेन भरते हैं।"],
        "contract.fortress.name": ["FORTRESS BOOK", "دفتر قلعه", "LIBRO FORTALEZA", "سجل القلعة", "CARNET FORTERESSE", "FESTUNGSBUCH", "LIVRO FORTALEZA", "KALE DEFTERİ", "要塞ブック", "堡垒账本", "किला बुक"],
        "contract.fortress.tag": ["ARMORED ROUTE", "مسیر زرهی", "RUTA BLINDADA", "مسار مدرع", "ROUTE BLINDÉE", "PANZER-ROUTE", "ROTA BLINDADA", "ZIRHLI ROTA", "装甲ルート", "装甲路线", "बख़्तरबंद रूट"],
        "contract.fortress.desc": ["Fewer targets, but every target is a wall.", "هدف کمتر است، اما هر هدف یک دیوار است.", "Menos objetivos, pero cada uno es un muro.", "أهداف أقل، لكن كل هدف جدار.", "Moins de cibles, chacune est un mur.", "Weniger Ziele, aber jedes ist eine Mauer.", "Menos alvos, mas cada um é uma parede.", "Daha az hedef, her biri duvar gibi.", "敵は少ないが、一体ごとが壁。", "目标更少，但每个都是高墙。", "लक्ष्य कम, पर हर एक दीवार है।"],
        "contract.mirrorPool.name": ["MIRROR POOL", "استخر آینه", "RESERVA ESPEJO", "بركة المرآة", "BASSIN MIROIR", "SPIEGELBECKEN", "POÇO DE ESPELHOS", "AYNA HAVUZU", "ミラープール", "镜像池", "मिरर पूल"],
        "contract.mirrorPool.tag": ["DUPLICATE ROUTE", "مسیر تکراری", "RUTA DUPLICADA", "مسار مكرر", "ROUTE DUPLIQUÉE", "DOPPELROUTE", "ROTA DUPLICADA", "KOPYA ROTASI", "複製ルート", "复制路线", "डुप्लिकेट रूट"],
        "contract.mirrorPool.desc": ["Copies and orbiters get priority.", "کپی‌ها و مداری‌ها اولویت دارند.", "Las copias y orbitadores tienen prioridad.", "الأولية للنسخ والمدارات.", "Les copies et orbiteurs sont prioritaires.", "Kopien und Orbitierer haben Vorrang.", "Cópias e orbitadores têm prioridade.", "Kopyalar ve yörüngeler öncelikli.", "コピーとオービターが優先。", "复制体和轨道体优先。", "कॉपी और ऑर्बिटर प्राथमिक।"],
        "contract.liquidation.name": ["LIQUIDATION", "تسویه", "LIQUIDACIÓN", "تصفية", "LIQUIDATION", "LIQUIDATION", "LIQUIDAÇÃO", "TASFİYE", "清算", "清算", "लिक्विडेशन"],
        "contract.liquidation.tag": ["NO COVER", "بدون پوشش", "SIN COBERTURA", "بلا غطاء", "SANS COUVERTURE", "KEINE DECKUNG", "SEM COBERTURA", "KORUMA YOK", "遮蔽なし", "无掩护", "कोई कवर नहीं"],
        "contract.liquidation.desc": ["The book is dense and every collision hurts more.", "دفتر متراکم است و هر برخورد دردناک‌تر می‌شود.", "El libro está denso y cada choque duele más.", "السجل كثيف وكل اصطدام أشد.", "Le carnet est dense et chaque collision fait plus mal.", "Das Buch ist dicht und jeder Zusammenstoß tut mehr weh.", "O livro está denso e cada colisão dói mais.", "Defter yoğun, her çarpışma daha acı.", "敵が密集し、接触ダメージ増。", "账本拥挤，每次碰撞更痛。", "बुक घना है, हर टक्कर ज़्यादा चोट दे।"],
        "contract.blueChip.name": ["BLUE CHIP", "بلوچیپ", "BLUE CHIP", "الشريحة الزرقاء", "BLUE CHIP", "BLUE CHIP", "BLUE CHIP", "BLUE CHIP", "ブルーチップ", "蓝筹", "ब्लू चिप"],
        "contract.blueChip.tag": ["CONTROLLED FLOW", "جریان کنترل‌شده", "FLUJO CONTROLADO", "تدفق مضبوط", "FLUX CONTRÔLÉ", "KONTROLLIERTER FLUSS", "FLUXO CONTROLADO", "KONTROLLÜ AKIŞ", "制御フロー", "受控流动", "नियंत्रित प्रवाह"],
        "contract.blueChip.desc": ["A calmer route that rewards clean streaks.", "مسیر آرام‌تری که استریک تمیز را پاداش می‌دهد.", "Una ruta tranquila que premia las rachas limpias.", "مسار أهدأ يكافئ السلاسل النظيفة.", "Une route plus calme qui récompense les séries nettes.", "Eine ruhigere Route belohnt saubere Serien.", "Uma rota calma que recompensa sequências limpas.", "Temiz serileri ödüllendiren sakin rota.", "穏やかなルート。クリーンな連勝を報酬。", "更平稳的路线，奖励干净连击。", "शांत रूट, साफ़ स्ट्रीक का इनाम।"],
        "weaponUpgrade.handshake.title": ["HANDSHAKE TUNING", "تنظیم دست‌دادن", "AJUSTE HANDSHAKE", "ضبط المصافحة", "RÉGLAGE HANDSHAKE", "HANDSHAKE-TUNING", "AJUSTE HANDSHAKE", "TOKALAŞMA AYARI", "ハンドシェイク調整", "握手调校", "हैंडशेक ट्यूनिंग"],
        "weaponUpgrade.handshake.tag": ["RAPID", "سریع", "RÁPIDO", "سريع", "RAPIDE", "SCHNELL", "RÁPIDO", "HIZLI", "高速", "快速", "तेज़"],
        "weaponUpgrade.handshake.desc": ["Tighter cycling and hotter contact damage.", "چرخهٔ فشرده‌تر و آسیب تماس بیشتر.", "Ciclo más corto y daño de contacto mayor.", "دورة أسرع وضرر تماس أعلى.", "Cycle plus serré et dégâts de contact accrus.", "Engerer Zyklus und höherer Kontaktschaden.", "Ciclo mais curto e dano de contato maior.", "Daha sık döngü ve daha sıcak temas hasarı.", "回転短縮、接触ダメージ上昇。", "循环更紧，接触伤害更高。", "तेज़ चक्र और अधिक संपर्क नुकसान।"],
        "weaponUpgrade.spreadsheet.title": ["SPREADSHEET PATTERN", "الگوی صفحه‌گسترده", "PATRÓN DE HOJA", "نمط الجدول", "MOTIF TABLEUR", "TABELLENMUSTER", "PADRÃO PLANILHA", "TABLO DESENİ", "スプレッドシートパターン", "表格弹型", "स्प्रेडशीट पैटर्न"],
        "weaponUpgrade.spreadsheet.tag": ["SPREAD", "پخش", "DISPERSIÓN", "انتشار", "DISPERSION", "STREUUNG", "DISPERSÃO", "YAYILIM", "拡散", "散射", "स्प्रेड"],
        "weaponUpgrade.spreadsheet.desc": ["Add pellets and compress the cone.", "تیرهای بیشتر و مخروط فشرده‌تر.", "Añade perdigones y comprime el cono.", "أضف مقذوفات واضغط المخروط.", "Ajoutez des projectiles et resserrez le cône.", "Mehr Projektile und engerer Kegel.", "Adicione projéteis e feche o cone.", "Mermi ekle, koniyi sıkıştır.", "弾数追加、拡散角を圧縮。", "增加弹丸并收窄散射锥。", "पेलेट बढ़ाएँ और कोन संकरा करें।"],
        "weaponUpgrade.lance.title": ["LANCE CALIBRATION", "کالیبراسیون نیزه", "CALIBRACIÓN DE LANZA", "معايرة الرمح", "CALIBRAGE DE LANCE", "LANZENKALIBRIERUNG", "CALIBRAÇÃO DA LANÇA", "MIZRAK KALİBRASYONU", "ランス校正", "长枪校准", "लांस कैलिब्रेशन"],
        "weaponUpgrade.lance.tag": ["PIERCE", "نفوذ", "PERFORA", "اختراق", "PERFORATION", "DURCHSTICH", "PERFURAÇÃO", "DELİŞ", "貫通", "穿透", "पियर्स"],
        "weaponUpgrade.lance.desc": ["Sharper penetration and heavier impact.", "نفوذ تیزتر و ضربهٔ سنگین‌تر.", "Penetración más afilada e impacto mayor.", "اختراق أعمق وصدمة أثقل.", "Pénétration plus nette et impact plus lourd.", "Schärfere Durchdringung und härterer Einschlag.", "Penetração afiada e impacto pesado.", "Daha keskin deliş ve ağır darbe.", "貫通力と衝撃を強化。", "穿透更强，冲击更重。", "तेज़ पैठ और भारी प्रभाव।"],
        "weaponUpgrade.short.title": ["SHORT SELL PAYLOAD", "محمولهٔ فروش استقراضی", "CARGA DE VENTA CORTA", "حمولة البيع على المكشوف", "CHARGE SHORT", "SHORT-SELL-LADUNG", "CARGA SHORT", "AÇIĞA SATIŞ YÜKÜ", "ショートセル弾頭", "做空弹头", "शॉर्ट सेल पेलोड"],
        "weaponUpgrade.short.tag": ["BLAST", "انفجار", "EXPLOSIÓN", "انفجار", "EXPLOSION", "SPRENGUNG", "EXPLOSÃO", "PATLAMA", "ブラスト", "爆炸", "ब्लास्ट"],
        "weaponUpgrade.short.desc": ["Wider, denser detonations with less downtime.", "انفجارهای وسیع‌تر و متراکم‌تر با وقفهٔ کمتر.", "Detonaciones más amplias y densas con menos espera.", "تفجيرات أوسع وأكثف مع وقت توقف أقل.", "Détonations plus larges et denses, moins d’attente.", "Breitere, dichtere Detonationen mit weniger Pause.", "Detonações maiores e densas com menos espera.", "Daha geniş, yoğun patlamalar ve daha az bekleme.", "爆発範囲と密度上昇、待ち時間短縮。", "爆炸更宽更密，间隔更短。", "विस्फोट चौड़े और घने, डाउनटाइम कम।"],
        "weaponUpgrade.nova.title": ["NOVA ARRAY CELLS", "سلول‌های آرایهٔ نوا", "CÉLULAS DE MATRIZ NOVA", "خلايا مصفوفة نوفا", "CELLULES NOVA", "NOVA-ARRAY-ZELLEN", "CÉLULAS DA MATRIZ NOVA", "NOVA DİZİ HÜCRELERİ", "ノヴァアレイセル", "新星阵列单元", "नोवा ऐरे सेल"],
        "weaponUpgrade.nova.tag": ["NOVA", "نوا", "NOVA", "نوفا", "NOVA", "NOVA", "NOVA", "NOVA", "ノヴァ", "新星", "नोवा"],
        "weaponUpgrade.nova.desc": ["More stars and a larger burst radius.", "ستاره‌های بیشتر و شعاع انفجار بزرگ‌تر.", "Más estrellas y mayor radio de estallido.", "نجوم أكثر ونطاق انفجار أوسع.", "Plus d’étoiles et rayon d’explosion accru.", "Mehr Sterne und größerer Explosionsradius.", "Mais estrelas e raio maior.", "Daha çok yıldız ve geniş patlama yarıçapı.", "星弾追加、バースト範囲拡大。", "更多星弹，更大爆发半径。", "ज़्यादा सितारे और बड़ा बर्स्ट।"],
        "weaponUpgrade.chain.title": ["CHAIN LINK ROUTING", "مسیریابی پیوند زنجیره", "RUTA ENLACE DE CADENA", "توجيه رابط السلسلة", "ROUTAGE LIEN DE CHAÎNE", "KETTENLINK-ROUTING", "ROTA ELO DE CADEIA", "ZİNCİR HALKASI ROTASI", "チェーンリンク経路", "链环路由", "चेन लिंक रूटिंग"],
        "weaponUpgrade.chain.tag": ["CHAIN", "زنجیره", "CADENA", "سلسلة", "CHAÎNE", "KETTE", "CADEIA", "ZİNCİR", "チェーン", "链", "चेन"],
        "weaponUpgrade.chain.desc": ["Extra jumps and longer signal reach.", "پرش‌های بیشتر و برد سیگنال طولانی‌تر.", "Saltos extra y mayor alcance de señal.", "قفزات إضافية ومدى إشارة أطول.", "Sauts supplémentaires et portée accrue.", "Mehr Sprünge und größere Signalreichweite.", "Saltos extras e maior alcance.", "Ek sıçramalar ve daha uzun sinyal erişimi.", "連鎖回数と到達距離を強化。", "增加跳跃次数和信号范围。", "अतिरिक्त जंप और लंबी सिग्नल पहुँच।"],
        "weaponUpgrade.scythe.title": ["SCYTHE PHASING", "فازبندی داس", "FASE DE GUADAÑA", "تغيير طور المنجل", "PHASAGE DE FAUCILLE", "SENSEN-PHASING", "FASE DA FOICE", "TIRPAN FAZLAMA", "サイズ位相", "镰刀相位", "सायथ फेज़िंग"],
        "weaponUpgrade.scythe.tag": ["RETURN", "بازگشت", "RETORNO", "عودة", "RETOUR", "RÜCKLAUF", "RETORNO", "GERİ DÖNÜŞ", "リターン", "回旋", "रिटर्न"],
        "weaponUpgrade.scythe.desc": ["The returning edge cuts deeper and travels farther.", "لبهٔ برگشتی عمیق‌تر می‌بُرد و دورتر می‌رود.", "El filo de vuelta corta más y viaja más lejos.", "الحافة العائدة تقطع أعمق وتسافر أبعد.", "Le tranchant retour coupe plus profond et va plus loin.", "Die Rückkehrkante schneidet tiefer und fliegt weiter.", "A lâmina de retorno corta mais e viaja mais.", "Dönen kenar daha derin keser ve uzağa gider.", "帰還刃の威力と距離を強化。", "回旋刀刃更深更远。", "लौटती धार गहरा काटे और दूर जाए।"],
        "choice.hardPress.title": ["HARD PRESS", "فشار سخت", "PULSACIÓN FUERTE", "ضغط قوي", "PRESSION FORTE", "HARTER DRUCK", "PRESSÃO FORTE", "SERT BASIŞ", "ハードプレス", "强力按压", "हार्ड प्रेस"],
        "choice.hardPress.tag": ["DAMAGE", "آسیب", "DAÑO", "ضرر", "DÉGÂTS", "SCHADEN", "DANO", "HASAR", "ダメージ", "伤害", "डैमेज"],
        "choice.hardPress.desc": ["Controlled weapon growth. Make every press count.", "رشد کنترل‌شدهٔ سلاح؛ هر فشار مهم است.", "Crecimiento controlado del arma. Cada toque cuenta.", "نمو مضبوط للسلاح؛ كل ضغطة مهمة.", "Croissance contrôlée de l’arme. Chaque pression compte.", "Kontrolliertes Waffenwachstum. Jeder Druck zählt.", "Crescimento controlado da arma. Cada toque conta.", "Kontrollü silah gelişimi. Her basış önemli.", "武器を制御強化。すべてのプレスが重要。", "受控提升武器，每次按压都重要。", "नियंत्रित हथियार वृद्धि; हर प्रेस मायने रखता है।"],
        "choice.rapidRoute.title": ["RAPID ROUTE", "مسیر سریع", "RUTA RÁPIDA", "مسار سريع", "ROUTE RAPIDE", "SCHNELLROUTE", "ROTA RÁPIDA", "HIZLI ROTA", "高速ルート", "快速路线", "रैपिड रूट"],
        "choice.rapidRoute.tag": ["FIRE RATE", "نرخ شلیک", "CADENCIA", "معدل الإطلاق", "CADENCE", "FEUERRATE", "CADÊNCIA", "ATEŞ HIZI", "連射速度", "射速", "फायर रेट"],
        "choice.rapidRoute.desc": ["Controlled fire-rate growth plus a small energy refill.", "نرخ شلیک کنترل‌شده و کمی شارژ انرژی.", "Más cadencia controlada y una pequeña recarga.", "زيادة معدل الإطلاق مع شحن طاقة بسيط.", "Cadence contrôlée et petite recharge d’énergie.", "Kontrollierte Feuerrate plus kleine Energieladung.", "Cadência controlada e pequena recarga.", "Kontrollü atış hızı ve küçük enerji dolumu.", "連射を制御強化、エネルギー少量回復。", "受控提升射速，并少量充能。", "नियंत्रित फायर-रेट और थोड़ी ऊर्जा रिफिल।"],
        "choice.ghostLiquidity.title": ["GHOST LIQUIDITY", "نقدینگی شبح", "LIQUIDEZ FANTASMA", "سيولة شبحية", "LIQUIDITÉ FANTÔME", "GEISTERLIQUIDITÄT", "LIQUIDEZ FANTASMA", "HAYALET LİKİDİTESİ", "ゴースト流動性", "幽灵流动性", "घोस्ट लिक्विडिटी"],
        "choice.ghostLiquidity.tag": ["MOBILITY", "تحرک", "MOVILIDAD", "حركة", "MOBILITÉ", "MOBILITÄT", "MOBILIDADE", "HAREKET", "機動力", "机动性", "मोबिलिटी"],
        "choice.ghostLiquidity.desc": ["Move faster and refill a burst of dash energy.", "سریع‌تر حرکت کن و یک جهش انرژی DASH بگیر.", "Muévete más rápido y recarga energía de dash.", "تحرك أسرع واشحن دفعة اندفاع.", "Bougez plus vite et rechargez le dash.", "Schneller bewegen und Dash-Energie auffüllen.", "Mova-se mais rápido e recarregue o dash.", "Daha hızlı hareket et, dash enerjisi doldur.", "移動速度上昇、ダッシュエネルギー回復。", "移动更快，补充冲刺能量。", "तेज़ चलें और डैश ऊर्जा भरें।"],
        "choice.shieldDividend.title": ["SHIELD DIVIDEND", "سود سپر", "DIVIDENDO DE ESCUDO", "عائد الدرع", "DIVIDENDE DE BOUCLIER", "SCHILDDIVIDENDE", "DIVIDENDO DE ESCUDO", "KALKAN TEMETTÜSÜ", "シールド配当", "护盾红利", "शील्ड डिविडेंड"],
        "choice.shieldDividend.tag": ["DEFENSE", "دفاع", "DEFENSA", "دفاع", "DÉFENSE", "VERTEIDIGUNG", "DEFESA", "SAVUNMA", "防御", "防御", "डिफेंस"],
        "choice.shieldDividend.desc": ["Add shield capacity and refill it immediately.", "ظرفیت سپر را زیاد کن و فوراً پرش کن.", "Añade escudo y recárgalo al instante.", "زد سعة الدرع واشحنه فوراً.", "Ajoutez du bouclier et rechargez immédiatement.", "Mehr Schild und sofort auffüllen.", "Aumente o escudo e recarregue já.", "Kalkan ekle ve hemen doldur.", "シールド容量増加、即時補充。", "增加护盾容量并立即充满。", "शील्ड क्षमता बढ़ाएँ और तुरंत भरें।"],
        "choice.deepBattery.title": ["DEEP BATTERY", "باتری عمیق", "BATERÍA PROFUNDA", "بطارية عميقة", "BATTERIE PROFONDE", "TIEFE BATTERIE", "BATERIA PROFUNDA", "DERİN BATARYA", "ディープバッテリー", "深层电池", "डीप बैटरी"],
        "choice.deepBattery.tag": ["ENERGY", "انرژی", "ENERGÍA", "طاقة", "ÉNERGIE", "ENERGIE", "ENERGIA", "ENERJİ", "エネルギー", "能量", "ऊर्जा"],
        "choice.deepBattery.desc": ["Add max energy and recharge abilities by 15%.", "حداکثر انرژی بیشتر و شارژ ۱۵٪ توانایی‌ها.", "Más energía máxima y 15% de recarga de habilidades.", "طاقة قصوى أكثر وشحن قدرات 15٪.", "Plus d’énergie max et 15 % de recharge.", "Mehr Max-Energie und 15 % Fähigkeitserholung.", "Mais energia máxima e 15% de recarga.", "Maks enerji ve %15 yetenek yenileme.", "最大エネルギー増加、能力15%回復。", "提高最大能量，技能恢复15%。", "अधिकतम ऊर्जा और क्षमता 15% रिचार्ज।"],
        "choice.openInterest.title": ["OPEN INTEREST", "علاقهٔ باز", "INTERÉS ABIERTO", "فائدة مفتوحة", "INTÉRÊT OUVERT", "OFFENES INTERESSE", "INTERESSE ABERTO", "AÇIK POZİSYON", "オープンインタレスト", "未平仓兴趣", "ओपन इंटरेस्ट"],
        "choice.openInterest.tag": ["COLLECTION", "جمع‌آوری", "COLECCIÓN", "جمع", "COLLECTE", "SAMMLUNG", "COLETA", "TOPLAMA", "回収", "收集", "कलेक्शन"],
        "choice.openInterest.desc": ["Coins and repairs fly in from farther away.", "سکه و تعمیرات از فاصلهٔ بیشتری جذب می‌شوند.", "Monedas y reparaciones llegan desde más lejos.", "تأتي العملات والإصلاحات من مسافة أبعد.", "Pièces et réparations viennent de plus loin.", "Münzen und Reparaturen kommen aus größerer Entfernung.", "Moedas e reparos vêm de mais longe.", "Coin ve tamirler daha uzaktan gelir.", "コインと修理を遠くから吸引。", "金币和修复从更远处飞来。", "सिक्के और रिपेयर दूर से आएँ।"],
        "status.cacheSecured": ["CACHE SECURED", "کش امن شد", "CAJA ASEGURADA", "تم تأمين المخزون", "CACHE SÉCURISÉ", "CACHE GESICHERT", "CACHE PROTEGIDO", "KASA GÜVENDE", "キャッシュ確保", "缓存已安全", "कैश सुरक्षित"],
        "status.contractActive": ["CONTRACT ACTIVE", "قرارداد فعال", "CONTRATO ACTIVO", "العقد نشط", "CONTRAT ACTIF", "VERTRAG AKTIV", "CONTRATO ATIVO", "SÖZLEŞME AKTİF", "契約発動", "合约生效", "कॉन्ट्रैक्ट सक्रिय"],
        "status.coreLock": ["CORE LOCK // DAMAGE DAMPENED", "قفل هسته // آسیب کاهش یافت", "NÚCLEO BLOQUEADO // DAÑO REDUCIDO", "قفل النواة // خُفّض الضرر", "NOYAU VERROUILLÉ // DÉGÂTS RÉDUITS", "KERN GESPERRT // SCHADEN GEDÄMPFT", "NÚCLEO TRAVADO // DANO REDUZIDO", "ÇEKİRDEK KİLİTLİ // HASAR AZALDI", "コアロック // ダメージ軽減", "核心锁定 // 伤害降低", "कोर लॉक // नुकसान कम"],
        "status.armorUp": ["ARMOR UP", "زره فعال", "ARMADURA ACTIVA", "الدرع مفعّل", "ARMURE ACTIVE", "PANZER AKTIV", "ARMADURA ATIVA", "ZIRH AÇIK", "装甲展開", "护甲开启", "कवच सक्रिय"],
        "status.phasing": ["PHASING", "در حال تغییر فاز", "FASEANDO", "تغيير طور", "PHASAGE", "PHASENWECHSEL", "FASEANDO", "FAZLANIYOR", "位相化中", "相位中", "फेज़िंग"],
        "status.breakpoint": ["PHASE 2 // BREAKPOINT", "فاز ۲ // نقطهٔ شکست", "FASE 2 // PUNTO DE QUIEBRE", "المرحلة 2 // نقطة الانكسار", "PHASE 2 // POINT DE RUPTURE", "PHASE 2 // BRECHPUNKT", "FASE 2 // PONTO DE RUPTURA", "AŞAMA 2 // KIRILMA", "フェーズ2 // ブレイクポイント", "阶段2 // 临界点", "फेज़ 2 // ब्रेकपॉइंट"],
        "status.discovery": ["PHASE 1 // DISCOVERY", "فاز ۱ // کشف", "FASE 1 // DESCUBRIMIENTO", "المرحلة 1 // اكتشاف", "PHASE 1 // DÉCOUVERTE", "PHASE 1 // ENTDECKUNG", "FASE 1 // DESCOBERTA", "AŞAMA 1 // KEŞİF", "フェーズ1 // 発見", "阶段1 // 发现", "फेज़ 1 // खोज"],
        "status.glitchShield": ["GLITCH SHIELD // VERIFY", "سپر گلیچ // بررسی کن", "ESCUDO GLITCH // VERIFICA", "درع خلل // تحقّق", "BOUCLIER GLITCH // VÉRIFIEZ", "GLITCH-SCHILD // PRÜFEN", "ESCUDO GLITCH // VERIFIQUE", "GLITCH KALKANI // DOĞRULA", "グリッチシールド // 確認", "故障护盾 // 核验", "ग्लिच शील्ड // जाँचें"],
        "status.chargeback": ["PHASE 2 // CHARGEBACK", "فاز ۲ // برگشت وجه", "FASE 2 // CONTRACARGO", "المرحلة 2 // استرجاع", "PHASE 2 // RÉTROFACTURATION", "PHASE 2 // RÜCKBUCHUNG", "FASE 2 // ESTORNO", "AŞAMA 2 // GERİ ÖDEME", "フェーズ2 // チャージバック", "阶段2 // 拒付", "फेज़ 2 // चार्जबैक"],
        "status.counterfeit": ["PHASE 1 // COUNTERFEIT", "فاز ۱ // جعلی", "FASE 1 // FALSIFICADO", "المرحلة 1 // مزيف", "PHASE 1 // CONTREFAIT", "PHASE 1 // FÄLSCHUNG", "FASE 1 // FALSIFICADO", "AŞAMA 1 // SAHTE", "フェーズ1 // 偽造", "阶段1 // 伪造", "फेज़ 1 // नकली"],
        "status.verifyEverything": ["VERIFY EVERYTHING", "همه‌چیز را بررسی کن", "VERIFICA TODO", "تحقق من كل شيء", "VÉRIFIEZ TOUT", "ALLES PRÜFEN", "VERIFIQUE TUDO", "HER ŞEYİ DOĞRULA", "すべて確認", "核验一切", "सब जाँचें"],
        "status.scammerWave": ["SCAMMER WAVE {wave}", "موج اسکمر {wave}", "OLA ESTAFADOR {wave}", "موج المحتال {wave}", "VAGUE ARNAQUEUR {wave}", "BETRÜGERWELLE {wave}", "ONDA DO GOLPISTA {wave}", "DOLANDIRICI DALGASI {wave}", "スキャマーウェーブ {wave}", "骗子波次 {wave}", "स्कैमर लहर {wave}"],
        "status.bossClear": ["TIER {tier} BOSS CLEAR // +{score}", "باس ردهٔ {tier} شکست خورد // +{score}", "JEFE NIVEL {tier} DERROTADO // +{score}", "هُزم الزعيم {tier} // +{score}", "BOSS RANG {tier} VAINCU // +{score}", "BOSS RANG {tier} BESIEGT // +{score}", "CHEFE NÍVEL {tier} DERROTADO // +{score}", "RÜTBE {tier} BOSS YENİLDİ // +{score}", "ティア{tier}ボス撃破 // +{score}", "击败{tier}级首领 // +{score}", "{tier} टियर बॉस साफ़ // +{score}"],
        "status.bossCache": ["{cache} // TIER {tier} CLEARED.", "{cache} // ردهٔ {tier} پاک شد.", "{cache} // NIVEL {tier} SUPERADO.", "{cache} // تم اجتياز الرتبة {tier}.", "{cache} // RANG {tier} VALIDÉ.", "{cache} // RANG {tier} GESCHAFFT.", "{cache} // NÍVEL {tier} LIMPO.", "{cache} // RÜTBE {tier} TEMİZLENDİ.", "{cache} // ティア{tier}クリア。", "{cache} // {tier}级已清除。", "{cache} // {tier} टियर साफ़।"],
        "status.scammerPayoutLine": ["SCAMMER PAYOUT // +{amount} COINS // COUNTERFEIT RECOVERED", "پرداخت اسکمر // +{amount} سکه // جعلی بازیابی شد", "PAGO DEL ESTAFADOR // +{amount} MONEDAS // FALSIFICADO RECUPERADO", "مكافأة المحتال // +{amount} عملة // استرداد المزيف", "GAIN DE L’ARNAQUEUR // +{amount} PIÈCES // CONTREFAIT RÉCUPÉRÉ", "BETRÜGER-AUSZAHLUNG // +{amount} MÜNZEN // FÄLSCHUNG GEBORGEN", "PAGAMENTO DO GOLPISTA // +{amount} MOEDAS // FALSIFICADO RECUPERADO", "DOLANDIRICI ÖDEMESİ // +{amount} JETON // SAHTE GERİ ALINDI", "スキャマー報酬 // +{amount}コイン // 偽造回収", "骗子奖励 // +{amount} 金币 // 伪造已回收", "स्कैमर भुगतान // +{amount} सिक्के // नकली बरामद"],
        "status.scammerWallet": ["TIER X // JACKPOT +{amount} // WALLET SECURED", "ردهٔ X // جک‌پات +{amount} // کیف پول امن شد", "NIVEL X // BOTE +{amount} // CARTERA ASEGURADA", "الرتبة X // الجائزة +{amount} // المحفظة مؤمّنة", "RANG X // JACKPOT +{amount} // PORTEFEUILLE SÉCURISÉ", "RANG X // JACKPOT +{amount} // WALLET GESICHERT", "NÍVEL X // JACKPOT +{amount} // CARTEIRA PROTEGIDA", "RÜTBE X // JACKPOT +{amount} // CÜZDAN GÜVENDE", "ティアX // ジャックポット +{amount} // ウォレット確保", "X级 // 奖池 +{amount} // 钱包安全", "टियर X // जैकपॉट +{amount} // वॉलेट सुरक्षित"],
        "status.scammerCache": ["COUNTERFEIT CACHE // +{amount} COINS RECOVERED.", "کش جعلی // +{amount} سکه بازیابی شد.", "CAJA FALSA // +{amount} MONEDAS RECUPERADAS.", "مخزون مزيف // استرداد +{amount} عملة.", "CACHE CONTREFAIT // +{amount} PIÈCES RÉCUPÉRÉES.", "FÄLSCHUNGS-CACHE // +{amount} MÜNZEN GEBORGEN.", "CACHE FALSIFICADO // +{amount} MOEDAS RECUPERADAS.", "SAHTE KASA // +{amount} JETON KURTARILDI.", "偽造キャッシュ // +{amount} コイン回収。", "伪造缓存 // 回收 +{amount} 金币。", "नकली कैश // +{amount} सिक्के मिले।"],
        "status.newRecord": ["NEW RECORD // SIGNAL ARCHIVED", "رکورد جدید // سیگنال آرشیو شد", "NUEVO RÉCORD // SEÑAL ARCHIVADA", "رقم قياسي جديد // أُرشفت الإشارة", "NOUVEAU RECORD // SIGNAL ARCHIVÉ", "NEUER REKORD // SIGNAL ARCHIVIERT", "NOVO RECORDE // SINAL ARQUIVADO", "YENİ REKOR // SİNYAL ARŞİVLENDİ", "新記録 // シグナル保存", "新纪录 // 信号已归档", "नया रिकॉर्ड // सिग्नल संग्रहित"],
        "status.runSaved": ["RUN SAVED // BEAT YOUR BEST", "ران ذخیره شد // از بهترینت جلو زدی", "PARTIDA GUARDADA // SUPERA TU MEJOR", "حُفظت الجولة // تغلبت على أفضل نتيجة", "RUN SAUVEGARDÉ // BATTEZ VOTRE RECORD", "LAUF GESPEICHERT // BESTE ÜBERTROFFEN", "CORRIDA SALVA // SUPEROU O MELHOR", "KOŞU KAYDEDİLDİ // EN İYİYİ GEÇ", "ラン保存 // 自己ベスト更新", "本局已保存 // 超越最佳", "रन सेव // अपना सर्वश्रेष्ठ पार"],
        "status.previousBest": ["PREVIOUS BEST // WAVE {wave} · SCORE {score} · VALUE {value}", "بهترین قبلی // موج {wave} · امتیاز {score} · ارزش {value}", "MEJOR ANTERIOR // OLA {wave} · PUNTOS {score} · VALOR {value}", "الأفضل السابق // موجة {wave} · نتيجة {score} · قيمة {value}", "MEILLEUR PRÉCÉDENT // VAGUE {wave} · SCORE {score} · VALEUR {value}", "VORHERIGES BESTES // WELLE {wave} · SCORE {score} · WERT {value}", "MELHOR ANTERIOR // ONDA {wave} · PONTOS {score} · VALOR {value}", "ÖNCEKİ EN İYİ // DALGA {wave} · SKOR {score} · DEĞER {value}", "前回ベスト // ウェーブ{wave} · スコア{score} · 価値{value}", "此前最佳 // 波次{wave} · 分数{score} · 价值{value}", "पिछला सर्वश्रेष्ठ // लहर {wave} · स्कोर {score} · मूल्य {value}"],
        "status.levelProgress": ["LEVEL {level} // {xp}/{next} XP // CHOOSE ONE", "سطح {level} // {xp}/{next} XP // یکی را انتخاب کن", "NIVEL {level} // {xp}/{next} XP // ELIGE UNO", "المستوى {level} // {xp}/{next} XP // اختر واحداً", "NIVEAU {level} // {xp}/{next} XP // CHOISISSEZ", "LEVEL {level} // {xp}/{next} XP // EINS WÄHLEN", "NÍVEL {level} // {xp}/{next} XP // ESCOLHA UM", "SEVİYE {level} // {xp}/{next} XP // BİRİNİ SEÇ", "レベル{level} // {xp}/{next} XP // 1つ選択", "等级 {level} // {xp}/{next} XP // 选择一个", "स्तर {level} // {xp}/{next} XP // एक चुनें"],
        "status.choiceInstalled": ["{choice} INSTALLED", "{choice} نصب شد", "{choice} INSTALADO", "تم تثبيت {choice}", "{choice} INSTALLÉ", "{choice} INSTALLIERT", "{choice} INSTALADO", "{choice} KURULDU", "{choice} 適用", "{choice} 已安装", "{choice} लगाया गया"],
        "status.weaponPatchMaxed": ["WEAPON PATCH MAXED // SIGNAL PEAK", "ارتقای سلاح کامل شد // اوج سیگنال", "MEJORA DE ARMA AL MÁXIMO // PICO DE SEÑAL", "تطوير السلاح مكتمل // ذروة الإشارة", "PATCH D’ARME AU MAXIMUM // SIGNAL AU PIC", "WAFFEN-PATCH MAXIMAL // SIGNALSPITZE", "PATCH DE ARMA NO MÁXIMO // PICO DO SINAL", "SİLAH YÜKSELTMESİ MAKS // SİNYAL ZİRVESİ", "武器パッチ最大 // シグナルピーク", "武器升级已满 // 信号峰值", "हथियार अपग्रेड अधिकतम // सिग्नल शिखर"],
        "canvas.lock": ["LOCK", "قفل", "BLOQUEO", "قفل", "VERROU", "SPERRE", "TRAVA", "KİLİT", "ロック", "锁", "लॉक"],
        "canvas.prime": ["PRIME", "پرایم", "PRIME", "برايم", "PRIME", "PRIME", "PRIME", "PRIME", "プライム", "至尊", "प्राइम"],
        "canvas.scam": ["SCAM", "تقلب", "FRAUDE", "احتيال", "ARNAQUE", "BETRUG", "GOLPE", "DOLANDIRICILIK", "詐欺", "诈骗", "घोटाला"],
        "canvas.verify": ["VERIFY", "بررسی", "VERIFICAR", "تحقق", "VÉRIFIER", "PRÜFEN", "VERIFICAR", "DOĞRULA", "確認", "核验", "जाँचें"]
      });
      addRuntimeRows({
        "ui.cache": ["CACHE", "کش", "CAJA", "مخزون", "CACHE", "CACHE", "CACHE", "KASA", "キャッシュ", "缓存", "कैश"],
        "ui.volatilityEvent": ["VOLATILITY EVENT", "رویداد نوسان", "EVENTO DE VOLATILIDAD", "حدث التقلب", "ÉVÉNEMENT DE VOLATILITÉ", "VOLATILITÄTSEREIGNIS", "EVENTO DE VOLATILIDADE", "OYNakLIK OLAYI", "ボラティリティイベント", "波动事件", "वोलैटिलिटी इवेंट"],
        "ui.contractActive": ["CONTRACT ACTIVE", "قرارداد فعال", "CONTRATO ACTIVO", "العقد نشط", "CONTRAT ACTIF", "VERTRAG AKTIV", "CONTRATO ATIVO", "SÖZLEŞME AKTİF", "契約発動", "合约生效", "कॉन्ट्रैक्ट सक्रिय"],
        "ui.run": ["RUN", "ران", "PARTIDA", "جولة", "RUN", "LAUF", "CORRIDA", "KOŞU", "ラン", "本局", "रन"],
        "ui.wave": ["WAVE", "موج", "OLA", "موجة", "VAGUE", "WELLE", "ONDA", "DALGA", "ウェーブ", "波次", "लहर"],
        "ui.damage": ["DAMAGE", "آسیب", "DAÑO", "ضرر", "DÉGÂTS", "SCHADEN", "DANO", "HASAR", "ダメージ", "伤害", "डैमेज"],
        "ui.fireRate": ["FIRE RATE", "نرخ شلیک", "CADENCIA", "معدل الإطلاق", "CADENCE", "FEUERRATE", "CADÊNCIA", "ATEŞ HIZI", "連射速度", "射速", "फायर रेट"],
        "ui.mobility": ["MOBILITY", "تحرک", "MOVILIDAD", "حركة", "MOBILITÉ", "MOBILITÄT", "MOBILIDADE", "HAREKET", "機動力", "机动性", "मोबिलिटी"],
        "ui.defense": ["DEFENSE", "دفاع", "DEFENSA", "دفاع", "DÉFENSE", "VERTEIDIGUNG", "DEFESA", "SAVUNMA", "防御", "防御", "डिफेंस"],
        "ui.energy": ["ENERGY", "انرژی", "ENERGÍA", "طاقة", "ÉNERGIE", "ENERGIE", "ENERGIA", "ENERJİ", "エネルギー", "能量", "ऊर्जा"],
        "ui.collection": ["COLLECTION", "جمع‌آوری", "COLECCIÓN", "جمع", "COLLECTE", "SAMMLUNG", "COLETA", "TOPLAMA", "回収", "收集", "कलेक्शन"],
        "ui.breakpoint": ["BREAKPOINT", "نقطهٔ شکست", "PUNTO DE QUIEBRE", "نقطة الانكسار", "POINT DE RUPTURE", "BRECHPUNKT", "PONTO DE RUPTURA", "KIRILMA", "ブレイクポイント", "临界点", "ब्रेकपॉइंट"],
        "ui.opening": ["OPENING NEEDED", "شکاف لازم است", "APERTURA NECESARIA", "يلزم فتح ثغرة", "OUVERTURE REQUISE", "ÖFFNUNG NÖTIG", "ABERTURA NECESSÁRIA", "AÇIKLIK GEREKLİ", "開口が必要", "需要找到缺口", "खुलाव चाहिए"],
        "ui.armor": ["ARMOR UP", "زره فعال", "ARMADURA ACTIVA", "الدرع مفعّل", "ARMURE ACTIVE", "PANZER AKTIV", "ARMADURA ATIVA", "ZIRH AÇIK", "装甲展開", "护甲开启", "कवच सक्रिय"],
        "ui.phasing": ["PHASING", "تغییر فاز", "FASEANDO", "تغيير طور", "PHASAGE", "PHASENWECHSEL", "FASEANDO", "FAZLANIYOR", "位相化中", "相位中", "फेज़िंग"],
        "ui.counterfeit": ["COUNTERFEIT", "جعلی", "FALSIFICADO", "مزيف", "CONTREFAIT", "FÄLSCHUNG", "FALSIFICADO", "SAHTE", "偽造", "伪造", "नकली"],
        "ui.wallet": ["WALLET", "کیف پول", "CARTERA", "محفظة", "PORTEFEUILLE", "WALLET", "CARTEIRA", "CÜZDAN", "ウォレット", "钱包", "वॉलेट"],
        "ui.installed": ["INSTALLED", "نصب شد", "INSTALADO", "تم التثبيت", "INSTALLÉ", "INSTALLIERT", "INSTALADO", "KURULDU", "適用済み", "已安装", "लगाया गया"],
        "ui.secured": ["SECURED", "امن شد", "ASEGURADO", "مؤمّن", "SÉCURISÉ", "GESICHERT", "PROTEGIDO", "GÜVENDE", "確保", "已确保", "सुरक्षित"],
        "ui.tier": ["TIER", "رده", "NIVEL", "رتبة", "RANG", "RANG", "NÍVEL", "RÜTBE", "ティア", "等级", "टियर"],
        "reward.lock.cache": ["LOCKOUT CACHE", "کش قفل نهایی", "CAJA DEL BLOQUEO", "مخزون الإغلاق", "CACHE DU BLOCAGE", "SPERR-CACHE", "CACHE DO BLOQUEIO", "KİLİT KASASI", "ロックアウトキャッシュ", "封锁缓存", "लॉकआउट कैश"],
        "reward.clearing.cache": ["MARGIN CACHE", "کش مارجین", "CAJA DE MARGEN", "مخزون الهامش", "CACHE DE MARGE", "MARGIN-CACHE", "CACHE DE MARGEM", "TEMİNAT KASASI", "マージンキャッシュ", "保证金缓存", "मार्जिन कैश"],
        "reward.oracle.cache": ["ORACLE CACHE", "کش پیشگو", "CAJA DEL ORÁCULO", "مخزون العراف", "CACHE DE L’ORACLE", "ORAKEL-CACHE", "CACHE DO ORÁCULO", "KAHİN KASASI", "オラクルキャッシュ", "先知缓存", "ओरेकल कैश"],
        "reward.robin.cache": ["PRIME CACHE", "کش پرایم", "CAJA PRIME", "مخزون برايم", "CACHE PRIME", "PRIME-CACHE", "CACHE PRIME", "PRIME KASASI", "プライムキャッシュ", "至尊缓存", "प्राइम कैश"],
        "reward.scammer.cache": ["COUNTERFEIT CACHE", "کش جعلی", "CAJA FALSIFICADA", "مخزون مزيف", "CACHE CONTREFAIT", "FÄLSCHUNGS-CACHE", "CACHE FALSIFICADO", "SAHTE KASA", "偽造キャッシュ", "伪造缓存", "नकली कैश"],
        "msg.contractActive": ["{name} // CONTRACT ACTIVE", "{name} // قرارداد فعال", "{name} // CONTRATO ACTIVO", "{name} // العقد نشط", "{name} // CONTRAT ACTIF", "{name} // VERTRAG AKTIV", "{name} // CONTRATO ATIVO", "{name} // SÖZLEŞME AKTİF", "{name} // 契約発動", "{name} // 合约生效", "{name} // कॉन्ट्रैक्ट सक्रिय"],
        "msg.volatilityEvent": ["{name} // VOLATILITY EVENT", "{name} // رویداد نوسان", "{name} // EVENTO DE VOLATILIDAD", "{name} // حدث التقلب", "{name} // ÉVÉNEMENT DE VOLATILITÉ", "{name} // VOLATILITÄTSEREIGNIS", "{name} // EVENTO DE VOLATILIDADE", "{name} // OYNAKLIK OLAYI", "{name} // ボラティリティイベント", "{name} // 波动事件", "{name} // वोलैटिलिटी इवेंट"],
        "msg.bossRewardReadout": ["{cache} // +{score} SCORE // +{value} VALUE", "{cache} // +{score} امتیاز // +{value} ارزش", "{cache} // +{score} PUNTOS // +{value} VALOR", "{cache} // +{score} نقاط // +{value} قيمة", "{cache} // +{score} SCORE // +{value} VALEUR", "{cache} // +{score} SCORE // +{value} WERT", "{cache} // +{score} PONTOS // +{value} VALOR", "{cache} // +{score} SKOR // +{value} DEĞER", "{cache} // +{score} スコア // +{value} 価値", "{cache} // +{score} 分数 // +{value} 价值", "{cache} // +{score} स्कोर // +{value} मूल्य"],
        "msg.signalClosedFor": ["{name} // SIGNAL CLOSED", "{name} // سیگنال بسته شد", "{name} // SEÑAL CERRADA", "{name} // أغلقت الإشارة", "{name} // SIGNAL FERMÉ", "{name} // SIGNAL GESCHLOSSEN", "{name} // SINAL FECHADO", "{name} // SİNYAL KAPANDI", "{name} // シグナル終了", "{name} // 信号关闭", "{name} // सिग्नल बंद"],
        "msg.bossIntro": ["{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}", "{name} // {title}"],
        "msg.contractIntro": ["{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}", "{name} // {desc}"],
        "msg.bossPhase": ["{tier} // {affix} // PHASE 1", "{tier} // {affix} // فاز ۱", "{tier} // {affix} // FASE 1", "{tier} // {affix} // المرحلة 1", "{tier} // {affix} // PHASE 1", "{tier} // {affix} // PHASE 1", "{tier} // {affix} // FASE 1", "{tier} // {affix} // AŞAMA 1", "{tier} // {affix} // フェーズ1", "{tier} // {affix} // 阶段1", "{tier} // {affix} // फेज़ 1"],
        "msg.scammerWaveIntro": ["SCAMMER WAVE {wave} // VERIFY EVERYTHING", "موج اسکمر {wave} // همه‌چیز را بررسی کن", "OLA ESTAFADOR {wave} // VERIFICA TODO", "موج المحتال {wave} // تحقق من كل شيء", "VAGUE ARNAQUEUR {wave} // VÉRIFIEZ TOUT", "BETRÜGERWELLE {wave} // ALLES PRÜFEN", "ONDA DO GOLPISTA {wave} // VERIFIQUE TUDO", "DOLANDIRICI DALGASI {wave} // HER ŞEYİ DOĞRULA", "スキャマーウェーブ {wave} // すべて確認", "骗子波次 {wave} // 核验一切", "स्कैमर लहर {wave} // सब जाँचें"],
        "msg.scammerPayoutLine": ["SCAMMER PAYOUT // +{amount} COINS // COUNTERFEIT RECOVERED", "پرداخت اسکمر // +{amount} سکه // جعلی بازیابی شد", "PAGO DEL ESTAFADOR // +{amount} MONEDAS // FALSIFICADO RECUPERADO", "مكافأة المحتال // +{amount} عملة // استرداد المزيف", "GAIN DE L’ARNAQUEUR // +{amount} PIÈCES // CONTREFAIT RÉCUPÉRÉ", "BETRÜGER-AUSZAHLUNG // +{amount} MÜNZEN // FÄLSCHUNG GEBORGEN", "PAGAMENTO DO GOLPISTA // +{amount} MOEDAS // FALSIFICADO RECUPERADO", "DOLANDIRICI ÖDEMESİ // +{amount} JETON // SAHTE GERİ ALINDI", "スキャマー報酬 // +{amount}コイン // 偽造回収", "骗子奖励 // +{amount} 金币 // 伪造已回收", "स्कैमर भुगतान // +{amount} सिक्के // नकली बरामद"],
        "msg.scammerWalletLine": ["TIER X // JACKPOT +{amount} // WALLET SECURED", "ردهٔ X // جک‌پات +{amount} // کیف پول امن شد", "NIVEL X // BOTE +{amount} // CARTERA ASEGURADA", "الرتبة X // الجائزة +{amount} // المحفظة مؤمّنة", "RANG X // JACKPOT +{amount} // PORTEFEUILLE SÉCURISÉ", "RANG X // JACKPOT +{amount} // WALLET GESICHERT", "NÍVEL X // JACKPOT +{amount} // CARTEIRA PROTEGIDA", "RÜTBE X // JACKPOT +{amount} // CÜZDAN GÜVENDE", "ティアX // ジャックポット +{amount} // ウォレット確保", "X级 // 奖池 +{amount} // 钱包安全", "टियर X // जैकपॉट +{amount} // वॉलेट सुरक्षित"],
        "msg.scammerCacheLine": ["COUNTERFEIT CACHE // +{amount} COINS RECOVERED.", "کش جعلی // +{amount} سکه بازیابی شد.", "CAJA FALSA // +{amount} MONEDAS RECUPERADAS.", "مخزون مزيف // استرداد +{amount} عملة.", "CACHE CONTREFAIT // +{amount} PIÈCES RÉCUPÉRÉES.", "FÄLSCHUNGS-CACHE // +{amount} MÜNZEN GEBORGEN.", "CACHE FALSIFICADO // +{amount} MOEDAS RECUPERADAS.", "SAHTE KASA // +{amount} JETON KURTARILDI.", "偽造キャッシュ // +{amount} コイン回収。", "伪造缓存 // 回收 +{amount} 金币。", "नकली कैश // +{amount} सिक्के मिले।"],
        "msg.levelProgress": ["LEVEL {level} // {xp}/{next} XP // CHOOSE ONE", "سطح {level} // {xp}/{next} XP // یکی را انتخاب کن", "NIVEL {level} // {xp}/{next} XP // ELIGE UNO", "المستوى {level} // {xp}/{next} XP // اختر واحداً", "NIVEAU {level} // {xp}/{next} XP // CHOISISSEZ", "LEVEL {level} // {xp}/{next} XP // EINS WÄHLEN", "NÍVEL {level} // {xp}/{next} XP // ESCOLHA UM", "SEVİYE {level} // {xp}/{next} XP // BİRİNİ SEÇ", "レベル{level} // {xp}/{next} XP // 1つ選択", "等级 {level} // {xp}/{next} XP // 选择一个", "स्तर {level} // {xp}/{next} XP // एक चुनें"],
        "msg.choiceInstalled": ["{choice} INSTALLED", "{choice} نصب شد", "{choice} INSTALADO", "تم تثبيت {choice}", "{choice} INSTALLÉ", "{choice} INSTALLIERT", "{choice} INSTALADO", "{choice} KURULDU", "{choice} 適用", "{choice} 已安装", "{choice} लगाया गया"],
        "msg.dashTitle": ["Dash costs {cost} energy // {charges} chained bursts available", "DASH {cost} انرژی می‌خواهد // {charges} جهش زنجیره‌ای آماده", "DASH cuesta {cost} energía // {charges} impulsos encadenados", "الاندفاع يستهلك {cost} طاقة // {charges} دفعات متاحة", "DASH coûte {cost} énergie // {charges} bonds disponibles", "Dash kostet {cost} Energie // {charges} Schübe verfügbar", "Dash custa {cost} energia // {charges} avanços disponíveis", "Dash {cost} enerji // {charges} zincirli atış hazır", "ダッシュ消費{cost}エネルギー // {charges}連続使用可", "冲刺消耗{cost}能量 // 可连冲{charges}次", "डैश में {cost} ऊर्जा // {charges} चेन बर्स्ट उपलब्ध"]
      });
      // Keep the opening read short and conversational.  The full
      // translations remain available for the other languages, while the
      // two languages used most often in this build get a tighter pass.
      const compactUiCopy = {
        en: {
          menuEyebrow: "UNOFFICIAL ARCADE // ROBINHOOD CHAIN 4663",
          menuDescription: "Dodge. Shoot. Reach Wave 20.",
          chipRun: "ONE RUN · MANY WAVES",
          chipLore: "CHAIN 4663",
          chipNoWallet: "NO WALLET · NO TRADES",
          noRecord: "NO RECORD YET",
          fineprint: "Fan-made fiction. No wallet or trades.",
          briefingBody: "The old button is back. Survive the run.",
          briefingQuote: "“Move fast. Hit hard.”",
          briefingOperator: "— FIELD NOTE",
          mobileHint: "Desktop: WASD + SPACE. Mobile: left drag + PRESS // FIRE.",
          shopBody: "Spend coins. Pick a patch. Go again.",
          weaponLab: "WEAPON LAB",
          shopFoot: "Patches stack.",
          continueWave: "BUY // NEXT WAVE",
          levelBody: "Pick one upgrade.",
          easterBody: "Seven secrets are hidden in the run.",
          easterFoot: "Fan-made fiction. No wallet connection.",
          pauseBody: "Paused. Change a setting or jump back in.",
          cameraZoomHint: "Pull back for a wider view.",
          languageHint: "Saved on this device.",
          musicHint: "Reactive combat audio.",
          settingsNote: "Saved here. SPACE fires; +/- zooms.",
          gameoverBody: "Good run. Ready when you are.",
          tutorialSteps: [
            { glyph: "BUY", title: "WELCOME.", body: "Move, aim and survive.", controls: [["GOAL", "Clear each wave"], ["LOOP", "Move · shoot · patch"]], tip: "Your best run saves here." },
            { glyph: "←", title: "MOVE.", body: "Drag the left side on mobile. Use WASD on desktop.", controls: [["MOBILE", "Left drag"], ["DESKTOP", "WASD / arrows"]], tip: "Keep one finger free for aim." },
            { glyph: "✦", title: "AIM + FIRE.", body: "Aim right. Hold PRESS // FIRE or SPACE.", controls: [["MOBILE", "PRESS // hold"], ["DESKTOP", "SPACE // hold"]], tip: "Lock-on changes target." },
            { glyph: "⇥", title: "DASH.", body: "Tap DASH to slip through danger.", controls: [["MOBILE", "Second finger"], ["DESKTOP", "E"]], tip: "Energy comes back while you move." },
            { glyph: "⌕", title: "ZOOM.", body: "Pull back when it gets busy.", controls: [["ZOOM", "5%–132%"], ["PHONE", "Landscape"]], tip: "Performance mode trims effects." },
            { glyph: "◆", title: "PATCH.", body: "Clear a wave. Buy a patch. Repeat.", controls: [["UPGRADES", "Damage · speed · shield"], ["ARCHIVE", "Scores · secrets"]], tip: "Open this guide from the menu." }
          ]
        },
        fa: {
          menuEyebrow: "بازی غیررسمی // رابین‌هود چین ۴۶۶۳",
          menuDescription: "جا خالی بده، شلیک کن، تا موج ۲۰ برو.",
          chipRun: "یک ران · موج‌های زیاد",
          chipLore: "چین ۴۶۶۳",
          chipNoWallet: "بدون کیف پول · بدون معامله",
          noRecord: "هنوز رکوردی نیست",
          fineprint: "داستان هواداری؛ بدون کیف پول یا معامله.",
          briefingBody: "دکمه قدیمی برگشته. این ران را زنده بمان.",
          briefingQuote: "«سریع برو. محکم بزن.»",
          briefingOperator: "— یادداشت میدان",
          mobileHint: "دسکتاپ: WASD + SPACE. موبایل: کشیدن چپ + PRESS // FIRE.",
          shopBody: "سکه خرج کن، ارتقا بگیر، ادامه بده.",
          weaponLab: "آزمایشگاه سلاح",
          shopFoot: "ارتقاها جمع می‌شوند.",
          continueWave: "BUY // موج بعد",
          levelBody: "یک ارتقا انتخاب کن.",
          easterBody: "هفت راز در بازی پنهان است.",
          easterFoot: "داستان هواداری؛ بدون اتصال به کیف پول.",
          pauseBody: "مکث شد. تنظیمات را عوض کن یا برگرد.",
          cameraZoomHint: "برای دید بازتر، زوم را کم کن.",
          languageHint: "روی همین دستگاه ذخیره می‌شود.",
          musicHint: "صدای مبارزه.",
          settingsNote: "همین‌جا ذخیره می‌شود. SPACE شلیک؛ +/− زوم.",
          gameoverBody: "خوب بود. دوباره آماده‌ایم.",
          tutorialSteps: [
            { glyph: "BUY", title: "خوش آمدی.", body: "حرکت کن، هدف بگیر و زنده بمان.", controls: [["هدف", "هر موج را رد کن"], ["چرخه", "حرکت · شلیک · ارتقا"]], tip: "بهترین رکوردت ذخیره می‌شود." },
            { glyph: "←", title: "حرکت.", body: "در موبایل نیمه چپ را بکش؛ در دسکتاپ WASD.", controls: [["موبایل", "کشیدن چپ"], ["دسکتاپ", "WASD / جهت‌ها"]], tip: "یک انگشت را برای هدف آزاد بگذار." },
            { glyph: "✦", title: "هدف + شلیک.", body: "سمت راست هدف بگیر. PRESS یا Space را نگه دار.", controls: [["موبایل", "PRESS را نگه دار"], ["دسکتاپ", "SPACE را نگه دار"]], tip: "قفل هدف، هدف بعدی را می‌گیرد." },
            { glyph: "⇥", title: "DASH.", body: "برای رد شدن از خطر، DASH را بزن.", controls: [["موبایل", "انگشت دوم"], ["دسکتاپ", "E"]], tip: "با حرکت، انرژی برمی‌گردد." },
            { glyph: "⌕", title: "زوم.", body: "وقتی شلوغ شد، زوم را کم کن.", controls: [["زوم", "۵٪ تا ۱۳۲٪"], ["گوشی", "حالت افقی"]], tip: "حالت عملکرد جلوه‌ها را کم می‌کند." },
            { glyph: "◆", title: "ارتقا.", body: "موج را رد کن، ارتقا بخر، تکرار کن.", controls: [["ارتقا", "آسیب · سرعت · سپر"], ["آرشیو", "رکورد · رازها"]], tip: "راهنما از منوی اصلی باز می‌شود." }
          ]
        }
      };
      Object.entries(compactUiCopy).forEach(([code, values]) => {
        if (LOCALES[code]) Object.assign(LOCALES[code], values);
      });
      const compactRuntimeCopy = {
        "msg.zeroGDash": ["ZERO-G // pull incoming", "بی‌گرانش // دشمن‌ها کشیده شدند"],
        "msg.darkMatter": ["DARK MATTER // time slowed", "ماده تاریک // زمان کند شد"],
        "msg.crowdSurge": ["CROWD SURGE // combo live", "موج جمعیت // کمبو فعال"],
        "msg.buyDip": ["BUY THE DIP // comeback", "خرید کف // برگشت"],
        "msg.greenComplete": ["GREEN SIGNAL // all clear", "سیگنال سبز // کامل شد"],
        "msg.allRecovered": ["ALL SECRETS FOUND", "همه رازها پیدا شد"],
        "msg.noTarget": ["NO TARGET // SCANNING", "هدفی نیست // جست‌وجو"],
        "msg.signalLog": ["SIGNAL LIVE // HOLD ON", "سیگنال زنده است // دوام بیاور"],
        "msg.firstWave": ["4663 // SIGNAL RETURNS", "۴۶۶۳ // سیگنال برگشت"],
        "msg.lockoutEntered": ["LOCKOUT INCOMING", "قفل وارد شد"],
        "msg.breakLockout": ["BREAK THE LOCK", "قفل را بشکن"],
        "msg.keepSignal": ["KEEP MOVING", "حرکت را حفظ کن"],
        "msg.patchInstalled": ["PATCH INSTALLED", "ارتقا نصب شد"],
        "msg.patchMaxed": ["PATCH MAXED", "ارتقا کامل است"],
        "msg.notEnough": ["NOT ENOUGH COINS", "سکه کافی نیست"],
        "msg.dashEmpty": ["DASH EMPTY // KEEP MOVING", "انرژی DASH کم است // حرکت کن"],
        "msg.marginCall": ["MARGIN CALL // CLEAR", "کال مارجین // پاک‌سازی"],
        "msg.splitter": ["SPLITTER // TWO TARGETS", "شکافنده // دو هدف"],
        "msg.gravityWell": ["GRAVITY WELL READY", "چاه گرانش آماده است"],
        "msg.overdrive": ["OVERDRIVE READY", "اوردرایو آماده است"],
        "msg.stackedExit": ["DASH STACK +1", "DASH +۱"],
        "msg.scammerVerify": ["SCAM // CHECK TARGET", "تقلب // هدف را چک کن"],
        "msg.scammerFlash": ["SCAM // FLASH", "تقلب // حمله سریع"],
        "msg.scammerFee": ["SCAM // HIDDEN FEE", "تقلب // کارمزد پنهان"],
        "msg.scammerReceipt": ["SCAM // DUPLICATE", "تقلب // رسید تکراری"],
        "msg.scammerChargeback": ["SCAM // CHARGEBACK", "تقلب // برگشت وجه"]
      };
      Object.entries(compactRuntimeCopy).forEach(([key, values]) => {
        const row = Array.isArray(runtimeTextMatrix[key]) ? runtimeTextMatrix[key].slice() : [];
        row[0] = values[0];
        row[1] = values[1];
        runtimeTextMatrix[key] = row;
      });
      runtimeMessageKeys["DASH ENERGY EMPTY // recharge in motion"] = "msg.dashEmpty";
      runtimeMessageKeys["GRAVITY WELL ONLINE"] = "msg.gravityWell";
      runtimeMessageKeys["OVERDRIVE CORE // latency collapsing"] = "msg.overdrive";
      runtimeMessageKeys["STACKED EXIT // another way out just opened."] = "msg.stackedExit";
      const runtimeText = (key, fallback = "", vars = {}) => {
        const row = runtimeTextMatrix[key];
        const slot = LOCALE_SLOT[currentLocale] ?? 0;
        let value = Array.isArray(row) ? (row[slot] || row[0]) : (row === undefined ? fallback : row);
        if (value === undefined || value === null || value === "") value = fallback;
        return String(value).replace(/\{(\w+)\}/g, (_, name) => vars[name] === undefined ? `{${name}}` : String(vars[name]));
      };
      const localizeRuntimeMessage = (message) => {
        if (typeof message !== "string" || currentLocale === "en") return message;
        const exactKey = runtimeMessageKeys[message];
        if (exactKey) return runtimeText(exactKey, message);
        let match = message.match(/^WAVE\s+(\d+)\s+\/\/\s+THE FRONTIER RECONFIGURES\.$/);
        if (match) return runtimeText("msg.waveReconfig", message, { wave: match[1] });
        match = message.match(/^WAVE\s+(\d+)\s+\/\/\s+PRESS HARD$/);
        if (match) return runtimeText("msg.wavePress", message, { wave: match[1] });
        match = message.match(/^BOSS WAVE\s+(\d+)\s+\/\/\s+BREAK THE LOCKOUT$/);
        if (match) return runtimeText("msg.bossWave", message, { wave: match[1] });
        match = message.match(/^TARGET LOCKED\s+\/\/\s+(.+)$/);
        if (match) return runtimeText("msg.targetLocked", message, { label: localizeRuntimeMessage(match[1]) });
        match = message.match(/^LOCK-ON\s+\/\/\s+(.+)$/);
        if (match) return runtimeText("msg.lockOn", message, { label: localizeRuntimeMessage(match[1]) });
        match = message.match(/^ZOOM\s+(\d+)%$/);
        if (match) return runtimeText("msg.zoom", message, { value: match[1] });
        match = message.match(/^([A-Z0-9 -]+)\s+ONLINE$/);
        if (match) return `${localizeRuntimeMessage(match[1])} ${runtimeText("online", "ONLINE")}`;
        return message;
      };
      const localizedContentField = (kind, id, field, fallback = "") => runtimeText(`${kind}.${id}.${field}`, fallback);
      const localizedEnemyName = (enemyOrType, fallback = "THREAT") => {
        const type = typeof enemyOrType === "string" ? enemyOrType : enemyOrType?.type;
        const source = typeof enemyOrType === "object" ? enemyOrType : null;
        return localizedContentField("enemy", type, "name", source?.name || fallback);
      };
      const localizedEnemyLore = (type, fallback = "") => localizedContentField("enemy", type, "lore", fallback);
      const localizedBossField = (key, field, fallback = "") => localizedContentField("boss", key, field, fallback);
      const localizedItemField = (kind, item, field, fallback = "") => {
        const id = item?.key || item?.id || "";
        return localizedContentField(kind, id, field, fallback);
      };
      const localizedDefinitionField = (kind, definition, field, fallback = "") => {
        const id = definition?.key || definition?.id || "";
        return localizedContentField(kind, id, field, fallback || definition?.[field] || "");
      };
      const localizedDefinitionKeyField = (kind, key, field, fallback = "") =>
        localizedContentField(kind, key, field, fallback);
      const localizedAffixField = (affix, field, fallback = "") =>
        localizedDefinitionField("affix", affix, field, fallback);
      const localizedMutatorField = (mutator, field, fallback = "") =>
        localizedDefinitionField("mutator", mutator, field, fallback);
      const localizedContractField = (contract, field, fallback = "") =>
        localizedDefinitionField("contract", contract, field, fallback);
      const localizedWeaponUpgradeField = (key, definition, field, fallback = "") =>
        localizedDefinitionKeyField("weaponUpgrade", key, field, fallback || definition?.[field] || "");
      const localizedChoiceField = (choice, field, fallback = "") =>
        localizedDefinitionField("choice", choice, field, fallback);
      // Boss rewards are consumed by both the original HUD layer and the
      // deferred frontier layer. Keep one stable profile in the shared
      // scope so a delayed HUD refresh can never resolve an out-of-scope
      // lexical binding and stop the animation loop.
      const bossRewardProfiles = Object.freeze({
        lock: { tier: "I", difficulty: 1, score: 1350, coins: 7, xp: 110, cache: "LOCKOUT CACHE", color: "#ffffff" },
        clearing: { tier: "II", difficulty: 1.28, score: 2050, coins: 10, xp: 155, cache: "MARGIN CACHE", color: "#ff9d4d" },
        oracle: { tier: "III", difficulty: 1.62, score: 3025, coins: 14, xp: 220, cache: "ORACLE CACHE", color: CYAN },
        robin: { tier: "IV", difficulty: 2.02, score: 4350, coins: 19, xp: 305, cache: "PRIME CACHE", color: VIOLET },
        scammer: { tier: "X", difficulty: 2.45, score: 6400, coins: 34, xp: 460, cache: "COUNTERFEIT CACHE", color: "#ff426d" }
      });
      const getBossRewardProfile = (key) =>
        bossRewardProfiles[String(key || "lock")] || bossRewardProfiles.lock;
      const localizedBossPhaseText = (enemy) => {
        if (!enemy) return "";
        const key = enemy.bossKind || "lock";
        const reward = getBossRewardProfile(key);
        const affixTag = localizedAffixField(enemy.bossAffix, "tag", enemy.bossAffix?.tag || translate("boss"));
        let stateText;
        if (enemy.scammerBoss) {
          stateText = enemy.scammerShieldTimer > 0
            ? runtimeText("status.glitchShield", "GLITCH SHIELD // VERIFY")
            : enemy.hp / Math.max(1, enemy.maxHp) < .5
              ? runtimeText("status.chargeback", "PHASE 2 // CHARGEBACK")
              : runtimeText("status.counterfeit", "PHASE 1 // COUNTERFEIT");
        } else {
          stateText = enemy.guardWindow > 0
            ? runtimeText("status.coreLock", "CORE LOCK // DAMAGE DAMPENED")
            : enemy.armorTimer > 0
              ? runtimeText("status.armorUp", "ARMOR UP")
              : enemy.shiftFlash > 0
                ? runtimeText("status.phasing", "PHASING")
                : enemy.hp / Math.max(1, enemy.maxHp) < .5
                  ? runtimeText("status.breakpoint", "PHASE 2 // BREAKPOINT")
                  : runtimeText("status.discovery", "PHASE 1 // DISCOVERY");
        }
        return `${translate("tier")} ${reward.tier} // ${affixTag} // ${stateText}`;
      };
      // Combat feel tuning: a dash is a quick, repeatable escape paid for by
      // energy instead of a tiny fixed bank.  This keeps the move exciting
      // while still giving the player a clear resource limit.

/* ===== 20-state-input.js ===== */
const DASH_ENERGY_COST = 10;
      const DASH_COOLDOWN = .18;
      const DASH_DURATION = .34;
      const DASH_INVULN = .62;
      const DASH_DISTANCE = 115;
      const DASH_SPEED_MULTIPLIER = 4.15;
      const PLAYER_DAMAGE_CAP = 3.65;
      const PLAYER_FIRE_RATE_CAP = 2.35;
      const BOSS_ADAPTIVE_HP_CAP = 2.15;
      const BOSS_GUARD_DAMAGE_MULTIPLIER = .58;
      let W = 0, H = 0, dpr = 1, state = "menu", last = 0, accumulator = 0, elapsed = 0, shake = 0;
      let orientationHold = false, orientationPromptVisible = false;
      let wave = 0, waveRemaining = 0, spawnTimer = 0, score = 0, coins = 0, combo = 0, comboTimer = 0;
      const mobileOpeningScale = () => {
        if (!compactDevice) return 1;
        if (wave <= 1) return .92;
        if (wave <= 2) return .98;
        return 1;
      };
      const mobileProjectileScale = () => {
        if (!compactDevice) return 1;
        if (wave <= 1) return .92;
        if (wave <= 2) return .98;
        return 1;
      };
      const mobileBaseSpawnCap = () => compactDevice ? Math.min(12 + wave, 26) : Math.min(15 + wave, 36);
      const mobileBurstSpawnCap = () => compactDevice ? Math.min(19 + wave, 40) : Math.min(24 + wave * 2, 58);
      const mobileBurstInterval = () => compactDevice
        ? Math.max(.26, .44 - wave * .009)
        : Math.max(.18, .38 - wave * .006);
      const MOBILE_ZOOM_MIN = .05;
      const MOBILE_ZOOM_DEFAULT = .68;
      const ZOOM_MIN = .32;
      const ZOOM_MAX = 1.32;
      const MOBILE_ZOOM_PROFILE = 2;
      const MOBILE_ZOOM_REFERENCE = .60;
      const landscapeCompactViewport = () => {
        const width = Number(window.innerWidth) || 0;
        const height = Number(window.innerHeight) || 0;
        return width > height && width <= 1100 && height <= 700;
      };
      const zoomFloor = () => compactDevice ? MOBILE_ZOOM_MIN : ZOOM_MIN;
      const viewportZoom = () => {
        const base = clamp(Number(gameSettings.zoom) || 1, zoomFloor(), ZOOM_MAX);
        // The compact landscape layout still gets its breathing-room factor,
        // but never lets the effective camera fall below the advertised 5%
        // floor. This keeps the slider value and the real camera contract in
        // sync on phones.
        return landscapeCompactViewport() ? Math.max(MOBILE_ZOOM_MIN, base * .88) : base;
      };
      const zoomTempoScale = () => {
        // Keep the apparent screen-space rhythm stable as the camera opens:
        // world units must move faster when fewer pixels represent each unit.
        // The cap is high enough for the 5% mobile view, but still bounded so
        // a missed frame cannot turn into an uncontrolled teleport.
        const visibleZoom = Math.max(.05, viewportZoom());
        const referenceZoom = compactDevice ? MOBILE_ZOOM_REFERENCE : .72;
        return clamp(referenceZoom / visibleZoom, .92, compactDevice ? 14.5 : 1.08);
      };
      const worldRenderScale = () => clamp(viewportZoom(), .05, 1.18);
      // Camera zoom may go down to 5%, but a literal 5% sprite would be
      // sub-pixel on a phone. Keep hit silhouettes legible with a very small
      // visual floor; positions and camera visibility still use the true zoom.
      const entityRenderScale = () => compactDevice
        ? clamp(.22 + viewportZoom() * .78, .22, 1.08)
        : worldRenderScale();
      const enemyRenderScale = () => compactDevice
        ? clamp(.30 + viewportZoom() * .70, .30, 1.08)
        : worldRenderScale();
      const projectileRenderScale = () => compactDevice
        ? clamp(.28 + viewportZoom() * .72, .28, 1.08)
        : worldRenderScale();
      // World-space positions are always converted through viewportZoom().
      // Keep screen-space silhouettes readable when zoomed out, but let them
      // shrink slightly so visual size never implies a larger collision box.
      const coreVisualScale = () => {
        // Keep the player avatar readable as the camera opens up.  World
        // objects still shrink exactly with the camera, while this deliberate
        // readability floor keeps the touch-controlled anchor easy to track.
        const base = entityRenderScale();
        return clamp(base * (landscapeCompactViewport() ? .96 : 1), .18, 1.02);
      };
      const isPortraitMobile = () => {
        const width = Number(window.innerWidth) || 0;
        const height = Number(window.innerHeight) || 0;
        if (height <= width || Math.min(width, height) > 900) return false;
        const touchLike = compactDevice
          || safeMatchMedia("(pointer: coarse)")
          || safeMatchMedia("(hover: none)")
          || ("ontouchstart" in window)
          || Math.min(width, height) <= 600;
        return touchLike && (safeMatchMedia("(orientation: portrait)") || height > width);
      };
      function requestLandscapeMode(withFullscreen = false) {
        const orientation = window.screen && window.screen.orientation;
        const lockLandscape = () => {
          try {
            const lock = orientation && orientation.lock;
            if (typeof lock !== "function") return;
            const result = lock.call(orientation, "landscape");
            if (result && typeof result.catch === "function") result.catch(() => {});
          } catch (_) {}
        };
        if (!withFullscreen) {
          lockLandscape();
          return;
        }
        const root = document.documentElement;
        const request = root && (root.requestFullscreen || root.webkitRequestFullscreen);
        if (typeof request !== "function") {
          lockLandscape();
          return;
        }
        try {
          const result = request.call(root);
          if (result && typeof result.then === "function") result.then(lockLandscape, lockLandscape);
          else lockLandscape();
        } catch (_) {
          lockLandscape();
        }
      }
      function updateOrientationGuard() {
        const shouldHold = state === "playing" && isPortraitMobile();
        orientationHold = shouldHold;
        if (shouldHold === orientationPromptVisible) return;
        orientationPromptVisible = shouldHold;
        if (shouldHold) clearInput();
        if (orientationPrompt) {
          orientationPrompt.classList.toggle("show", shouldHold);
          orientationPrompt.setAttribute("aria-hidden", String(!shouldHold));
        }
      }
      let storyTimer = 0, flash = 0, arenaPulse = 0, bossAlive = false, audioCtx = null, explosionSoundCooldown = 0;
      const SETTINGS_COOKIE = "buy_button_signal_settings_v1";
      const LEGACY_SETTINGS_KEYS = ["buy-button-settings-v4"];
      let settingsHadLocalRecord = false;
      const defaultSettings = {
        zoom: compactDevice ? MOBILE_ZOOM_DEFAULT : 1,
        masterVolume: .7,
        musicVolume: .35,
        performance: compactDevice,
        effects: true,
        haptics: true,
        language: initialLocale,
        tutorialSeen: false,
        mobileZoomProfile: 0,
        updatedAt: 0
      };
      let gameSettings = { ...defaultSettings };
      let masterGainNode = null, effectFilterNode = null, musicGainNode = null, musicFilterNode = null, ambientOsc = null, ambientOsc2 = null;
      let masterGainConnected = false, effectFilterConnected = false, musicGainConnected = false, musicFilterConnected = false;
      // Browsers reject Web Audio before a real gesture. Start muted at the
      // transport layer so the menu never creates rejected AudioContexts or
      // resurrects the old low hum before the player presses a control.
      let audioBlockedUntilGesture = true;
      let targetCycleIndex = 0;
      let combatFlashTimer = 0;
      let hardLockTarget = null;
      const keys = Object.create(null);
      const pointer = { x: 0, y: 0, down: false, id: null };
      const joystick = { active: false, id: null, ox: 0, oy: 0, x: 0, y: 0 };
      // Controller support is intentionally native (no dependency and no
      // account connection): left stick moves, right stick aims, RT fires,
      // A dashes, X surges, Y drops a Margin Call, and Start pauses.
      const gamepadInput = {
        active: false,
        index: -1,
        moveX: 0,
        moveY: 0,
        aimX: 0,
        aimY: 0,
        aimActive: false,
        fire: false,
        buttons: []
      };
      let gamepadPollTimer = 0;
      let gamepadLastButtonState = [];
      let gamepadAimAngle = -Math.PI / 2;
      function pollGamepad() {
        if (typeof navigator.getGamepads !== "function") return;
        const pads = navigator.getGamepads();
        const pad = Array.from(pads || []).find((candidate) => candidate && candidate.connected);
        if (!pad) {
          gamepadInput.active = false;
          gamepadInput.index = -1;
          gamepadInput.moveX = gamepadInput.moveY = gamepadInput.aimX = gamepadInput.aimY = 0;
          gamepadInput.aimActive = gamepadInput.fire = false;
          gamepadLastButtonState = [];
          return;
        }
        gamepadInput.active = true;
        gamepadInput.index = pad.index;
        const axis = (index, deadzone = .14) => {
          const raw = Number(pad.axes?.[index]) || 0;
          if (Math.abs(raw) <= deadzone) return 0;
          const sign = raw < 0 ? -1 : 1;
          return sign * clamp((Math.abs(raw) - deadzone) / (1 - deadzone), 0, 1);
        };
        gamepadInput.moveX = axis(0);
        gamepadInput.moveY = axis(1);
        const aimX = axis(2), aimY = axis(3);
        gamepadInput.aimX = aimX;
        gamepadInput.aimY = aimY;
        gamepadInput.aimActive = Math.hypot(aimX, aimY) > .22;
        if (gamepadInput.aimActive) gamepadAimAngle = Math.atan2(aimY, aimX);
        const buttons = Array.from(pad.buttons || [], (button) => !!button?.pressed);
        const pressed = (index) => !!buttons[index];
        const tapped = (index) => pressed(index) && !gamepadLastButtonState[index];
        // Standard XInput uses RT/RB for firing. Keep A reserved for dash so
        // an accidental dodge does not also dump a burst of ammunition.
        gamepadInput.fire = pressed(7) || pressed(5);
        if (state === "playing") {
          if (tapped(0)) activate("dash");
          if (tapped(2)) activate("surge");
          if (tapped(3)) activate("bomb");
          if (tapped(9)) pauseRun();
          if (tapped(4)) cycleTarget();
        } else if (state === "pause" && tapped(9)) {
          resumeRun();
        }
        gamepadLastButtonState = buttons;
        gamepadPollTimer = window.setTimeout(pollGamepad, 80);
      }
      window.addEventListener("gamepadconnected", () => {
        clearTimeout(gamepadPollTimer);
        pollGamepad();
        toast("CONTROLLER LINKED // DUAL-STICK READY", 1600);
      });
      window.addEventListener("gamepaddisconnected", () => {
        clearTimeout(gamepadPollTimer);
        gamepadInput.active = false;
        gamepadInput.fire = false;
      });
      pollGamepad();
      // Pointer Events keep each finger independent: one pointer can own the
      // movement stick, another can aim, and the dedicated fire control owns
      // the trigger. Aiming must never implicitly become auto-fire.
      const aimPointerIds = new Set();
      const pointerPositions = new Map();
      const legacyTouchRoles = new Map();
      // Firing is an explicit action now. Aim pointers stay independent from
      // the fire latch so a second finger can steer without accidentally
      // holding the trigger forever.
      let mobileFireHeld = false;
      let mobileFirePointerId = null;
      let desktopFireHeld = false;
      let desktopFirePointerId = null;
      const syncPointerFire = () => {
        pointer.down = desktopFireHeld || mobileFireHeld || !!keys.Space || !!gamepadInput.fire;
      };
      const heroImage = new Image();
      let heroImageReady = false;
      heroImage.onload = () => { heroImageReady = true; };
      heroImage.onerror = () => { heroImageReady = false; };
      heroImage.src = "./buy-button-hero.png";
      let aimAssist = false;
      let lockTarget = null;

      const EASTER_COOKIE = "buy_button_signal_easter_eggs_v1";
      const eggCatalog = [
        { id: "darkButton", glyph: "21", title: "THE DARK BUTTON", color: HOT, desc: "The command that vanished before the market opened became the first ghost in the machine.", clue: "TRACE // WAVE 2+ // defeat a LEGENDARY" },
        { id: "chain4663", glyph: "46", title: "CHAIN 4663", color: CYAN, desc: "A fictional route number for the green signal, hidden in the noise between two waves.", clue: "TRACE // two LEGENDARIES // hold the streak" },
        { id: "pco", glyph: "PC", title: "PCO // PUBLIC COMMON", color: ACID, desc: "A community phrase reframed as a protocol: the crowd is part of the ledger.", clue: "TRACE // COMBO x10 // finish a LEGENDARY" },
        { id: "gas", glyph: "G", title: "GASLESS GHOST", color: VIOLET, desc: "No fee, no wallet, no transaction—only a clean burst through the frontier.", clue: "TRACE // cast DASH during volatility" },
        { id: "wallet", glyph: "K", title: "COLD WALLET", color: "#8cf7d4", desc: "There is no seed phrase here. The only key is the memory you carry out of the run.", clue: "TRACE // low integrity // defeat a LEGENDARY" },
        { id: "hood", glyph: "H", title: "HOOD OF THE VOID", color: "#ff9d4d", desc: "The mascot signal survives as a boss-level echo, wearing the lockout like a crown.", clue: "TRACE // break a LEGENDARY BOSS" },
        { id: "greenSignal", glyph: "BUY", title: "THE GREEN SIGNAL", color: "#fff7c2", desc: "The button is not a promise. It is a pulse. The archive opens when every other trace is home.", clue: "FINAL TRACE // WAVE 10+ // recover the other six" }
      ];
      let easterEggFound = new Set();
      const easterEggRunSpawned = new Set();
      let legendaryKillsThisRun = 0;
      let lastLegendaryAnchor = null;
      const eggPowerDefs = {
        darkButton: { name: "DARK MATTER", tag: "TIME FRACTURE", color: HOT, desc: "Every seventh takedown fractures time around the core." },
        chain4663: { name: "CHAIN REACTION", tag: "ARC JUMP", color: CYAN, desc: "Kills leap through two nearby targets with fading damage." },
        pco: { name: "CROWD SURGE", tag: "MOB RULE", color: ACID, desc: "A hot combo rallies the crowd and overclocks the weapon." },
        gas: { name: "ZERO-G DASH", tag: "GASLESS", color: VIOLET, desc: "A dash tears a gravity scar that pulls hostiles inward." },
        wallet: { name: "COLD STORAGE", tag: "BANK SHIELD", color: "#8cf7d4", desc: "Recovered value hardens into a reserve shield." },
        hood: { name: "HOOD SHIFT", tag: "PHANTOM", color: "#ff9d4d", desc: "A phantom frame can make an incoming hit miss." },
        greenSignal: { name: "BUY THE DIP", tag: "LAST STAND", color: "#fff7c2", desc: "Critical integrity triggers a full comeback burst." }
      };
      const MAX_ACTIVE_EGG_POWERS = 3;
      const eggRuntime = {
        active: new Set(),
        order: [],
        primary: "",
        killCount: 0,
        darkPulse: 0,
        chainCooldown: 0,
        chainProcessing: false,
        crowdSurge: 0,
        dashEchoCooldown: 0,
        walletCoinMark: 0,
        walletShieldBank: 0,
        hoodCloak: 0,
        dipUsed: false,
        echoCooldown: 0,
        justUnlocked: ""
      };
      let eggHudSignature = "";

      function eggPowerActive(id) {
        return eggRuntime.active.has(id);
      }

      function resetEggPowerRuntime() {
        eggRuntime.active.clear();
        eggRuntime.order.length = 0;
        eggRuntime.primary = "";
        eggRuntime.killCount = 0;
        eggRuntime.darkPulse = 0;
        eggRuntime.chainCooldown = 0;
        eggRuntime.chainProcessing = false;
        eggRuntime.crowdSurge = 0;
        eggRuntime.dashEchoCooldown = 0;
        eggRuntime.walletCoinMark = coins || 0;
        eggRuntime.walletShieldBank = 0;
        eggRuntime.hoodCloak = 0;
        eggRuntime.dipUsed = false;
        eggRuntime.echoCooldown = 0;
        eggRuntime.justUnlocked = "";
      }

      function addEggPowerToLoadout(id, announce = false) {
        if (!eggPowerDefs[id] || eggRuntime.active.has(id)) return;
        if (eggRuntime.order.length >= MAX_ACTIVE_EGG_POWERS) {
          const displaced = eggRuntime.order.shift();
          eggRuntime.active.delete(displaced);
        }
        eggRuntime.order.push(id);
        eggRuntime.active.add(id);
        eggRuntime.primary = id;
        if (announce) {
          const power = eggPowerDefs[id];
          eggRuntime.justUnlocked = id;
          toast(`${localizedItemField("egg", { id }, "name", power.name)} // ${localizedItemField("egg", { id }, "tag", power.tag)}`, 2300);
          story(`${runtimeText("msg.eggPower", "EASTER POWER // {value}", { value: localizedItemField("egg", { id }, "powerDesc", power.desc) })}`, 3.4);
          combatFlash(`${localizedItemField("egg", { id }, "name", power.name)} ONLINE`, 1100);
          buttonTone(980, .18, "triangle", .038);
          haptic([16, 34, 16, 34, 16]);
        }
      }

      function selectEggPowerLoadout() {
        resetEggPowerRuntime();
        const unlocked = eggCatalog.filter((egg) => easterEggFound.has(egg.id)).map((egg) => egg.id);
        unlocked.sort(() => Math.random() - .5);
        unlocked.slice(0, MAX_ACTIVE_EGG_POWERS).forEach((id) => addEggPowerToLoadout(id));
      }

      function refreshEggPowerHud(force = false) {
        const node = $("eggPowerText");
        const button = $("eggPowerBtn");
        const labels = eggRuntime.order.map((id) => localizedItemField("egg", { id }, "name", eggPowerDefs[id]?.name || id));
        const primary = eggPowerDefs[eggRuntime.primary];
        const signature = `${labels.join("|")}::${eggRuntime.primary}::${eggRuntime.echoCooldown.toFixed(1)}::${eggRuntime.justUnlocked}`;
        if (!force && signature === eggHudSignature) return;
        eggHudSignature = signature;
        if (node) {
          node.textContent = labels.length ? runtimeText("msg.eggPower", "EGG POWER // {value}", { value: labels.join("  ·  ") }) : "";
          node.style.color = eggRuntime.justUnlocked ? (eggPowerDefs[eggRuntime.justUnlocked]?.color || "#fff7c2") : "";
        }
        if (button) {
          button.classList.toggle("show", labels.length > 0);
          button.textContent = eggRuntime.echoCooldown > 0
            ? runtimeText("msg.echoCooldown", "X // ECHO // {value}s", { value: eggRuntime.echoCooldown.toFixed(1) })
            : primary
              ? `X // ${runtimeText("ui.echo", "ECHO")} // ${localizedItemField("egg", { id: eggRuntime.primary }, "name", primary.name)}`
              : runtimeText("msg.echoReady", "X // ECHO // READY");
          button.style.borderColor = primary?.color || "";
          button.style.color = primary?.color || "";
          button.setAttribute("aria-label", primary
            ? translate("castEggPower", { power: localizedItemField("egg", { id: eggRuntime.primary }, "name", primary.name) })
            : translate("eggPowerLocked"));
        }
      }

      function cycleEggPower() {
        if (eggRuntime.order.length < 2) return;
        const current = eggRuntime.order.indexOf(eggRuntime.primary);
        eggRuntime.primary = eggRuntime.order[(current + 1 + eggRuntime.order.length) % eggRuntime.order.length];
        eggRuntime.justUnlocked = "";
        refreshEggPowerHud(true);
        const power = eggPowerDefs[eggRuntime.primary];
        toast(runtimeText("msg.echoRoute", "ECHO ROUTE // {value}", { value: power ? localizedItemField("egg", { id: eggRuntime.primary }, "name", power.name) : translate("ready") }), 900);
        buttonTone(600, .07, "triangle", .022);
      }

      function eggDamageMultiplier() {
        let multiplier = 1;
        if (eggRuntime.darkPulse > 0 && eggPowerActive("darkButton")) multiplier *= 1.22;
        if (eggRuntime.crowdSurge > 0 && eggPowerActive("pco")) multiplier *= 1.34;
        if (eggRuntime.dipUsed && eggPowerActive("greenSignal")) multiplier *= 1.55;
        return Math.min(2.1, multiplier);
      }

      function eggFireRateMultiplier() {
        let multiplier = 1;
        if (eggRuntime.crowdSurge > 0 && eggPowerActive("pco")) multiplier *= 1.48;
        if (eggRuntime.dipUsed && eggPowerActive("greenSignal")) multiplier *= 1.28;
        return Math.min(1.75, multiplier);
      }

      function eggEnemySpeedMultiplier() {
        return eggRuntime.darkPulse > 0 && eggPowerActive("darkButton") ? .28 : 1;
      }

      function triggerEggDashPower(force = false) {
        if (!eggPowerActive("gas") || (!force && eggRuntime.dashEchoCooldown > 0)) return false;
        eggRuntime.dashEchoCooldown = .65;
        const radius = 240;
        for (const enemy of enemies) {
          if (!enemy.alive) continue;
          const dx = player.x - enemy.x, dy = player.y - enemy.y, distance = Math.hypot(dx, dy) || 1;
          if (distance > radius) continue;
          const pull = 1 - distance / radius;
          enemy.x += dx * pull * .42;
          enemy.y += dy * pull * .42;
          enemy.stun = Math.max(enemy.stun || 0, .55 + pull * .7);
          hitEnemy(enemy, 34 * player.damage * (.8 + pull * .6), { color: VIOLET });
        }
        particle(player.x, player.y, VIOLET, 34, 410);
          story(runtimeText("msg.zeroGDash", "ZERO-G DASH // gravity has left the room."), 1.8);
        return true;
      }

      function triggerEggKillPower(enemy) {
        if (!enemy) return;
        // Chain jumps are bonus damage, not extra “kills” for the
        // threshold-based powers.  This keeps Time Fracture and Crowd Surge
        // exciting without allowing one shot to farm every trigger.
        if (eggRuntime.chainProcessing) return;
        eggRuntime.killCount++;
        if (eggPowerActive("darkButton") && eggRuntime.killCount % 7 === 0) {
          eggRuntime.darkPulse = 1.35;
          for (const hostile of enemies) if (hostile.alive) hostile.stun = Math.max(hostile.stun || 0, 1.15);
          for (const round of enemyBullets) {
            round.vx *= .22;
            round.vy *= .22;
            round.life = Math.min(round.life, 1.2);
          }
          particle(player.x, player.y, HOT, 40, 360);
          story(runtimeText("msg.darkMatter", "DARK MATTER // seven presses just bent time."), 2.1);
          combatFlash(runtimeText("msg.timeFracture", "TIME FRACTURE"), 950);
        }
        if (eggPowerActive("chain4663") && eggRuntime.chainCooldown <= 0 && !eggRuntime.chainProcessing) {
          const nearby = enemies.filter((candidate) => candidate.alive && candidate !== enemy)
            .sort((a, b) => dist(a, enemy) - dist(b, enemy)).slice(0, 2);
          if (nearby.length) {
            eggRuntime.chainProcessing = true;
            eggRuntime.chainCooldown = .16;
            let previous = enemy;
            for (let index = 0; index < nearby.length; index++) {
              const target = nearby[index];
              hitEnemy(target, (28 * player.damage) * Math.pow(.62, index), { color: CYAN });
              addChainArc(previous, target, CYAN);
              previous = target;
            }
            eggRuntime.chainProcessing = false;
          }
        }
        if (eggPowerActive("pco") && combo >= 6 && eggRuntime.crowdSurge <= 0) {
          eggRuntime.crowdSurge = 4.2;
          story(runtimeText("msg.crowdSurge", "CROWD SURGE // the book is moving with you."), 2.1);
          combatFlash(runtimeText("msg.mobRally", "MOB RALLY"), 900);
        }
      }

      function castEggChainBurst() {
        if (!eggPowerActive("chain4663")) return false;
        const origin = nearestEnemy();
        if (!origin) return false;
        const targets = enemies.filter((candidate) => candidate.alive && candidate !== origin)
          .sort((a, b) => dist(a, origin) - dist(b, origin))
          .slice(0, 3);
        if (!targets.length) return false;
        eggRuntime.chainProcessing = true;
        eggRuntime.chainCooldown = .42;
        let previous = origin;
        targets.forEach((target, index) => {
          hitEnemy(target, 52 * player.damage * Math.pow(.68, index), { color: CYAN });
          addChainArc(previous, target, CYAN);
          previous = target;
        });
        eggRuntime.chainProcessing = false;
        particle(origin.x, origin.y, CYAN, 26, 300);
        return true;
      }

      function activateEggEcho() {
        if (state !== "playing" || orientationHold || !eggRuntime.order.length || eggRuntime.echoCooldown > 0) return;
        const id = eggRuntime.primary || eggRuntime.order[0];
        eggRuntime.echoCooldown = 7.5;
        if (id === "darkButton") {
          eggRuntime.darkPulse = 2.25;
          for (const hostile of enemies) if (hostile.alive) hostile.stun = Math.max(hostile.stun || 0, 1.4);
          for (const round of enemyBullets) { round.vx *= .16; round.vy *= .16; round.life = Math.min(round.life, 1.5); }
          combatFlash(runtimeText("msg.echoTime", "ECHO // TIME FRACTURE"), 1100);
        } else if (id === "chain4663") {
          castEggChainBurst();
          combatFlash(runtimeText("msg.echoChain", "ECHO // CHAIN REACTION"), 1100);
        } else if (id === "pco") {
          eggRuntime.crowdSurge = 5.5;
          combo = Math.max(combo, 8);
          comboTimer = Math.max(comboTimer, 4.5);
          combatFlash(runtimeText("msg.echoCrowd", "ECHO // CROWD SURGE"), 1100);
        } else if (id === "gas") {
          triggerEggDashPower(true);
          combatFlash(runtimeText("msg.echoZeroG", "ECHO // ZERO-G"), 1100);
        } else if (id === "wallet") {
          player.maxShield = Math.max(player.maxShield || 0, 42);
          player.shield = player.maxShield;
          eggRuntime.walletShieldBank = 0;
          player.energy = player.maxEnergy;
          combatFlash(runtimeText("msg.echoCold", "ECHO // COLD STORAGE"), 1100);
        } else if (id === "hood") {
          eggRuntime.hoodCloak = 3.8;
          player.invuln = Math.max(player.invuln, 3.8);
          combatFlash(runtimeText("msg.echoHood", "ECHO // HOOD SHIFT"), 1100);
        } else if (id === "greenSignal") {
          player.hp = player.maxHp;
          player.energy = player.maxEnergy;
          Object.keys(player.ability || {}).forEach((key) => player.ability[key] = 0);
          eggRuntime.dipUsed = true;
          combatFlash(runtimeText("msg.echoDip", "ECHO // BUY THE DIP"), 1100);
        }
        particle(player.x, player.y, eggPowerDefs[id]?.color || "#fff7c2", 45, 420);
        const castName = localizedItemField("egg", { id }, "name", eggPowerDefs[id]?.name || id);
        story(runtimeText("msg.echoCast", `ECHO CAST // ${castName}`, { value: castName }), 2.2);
        buttonTone(1060, .16, "sawtooth", .038);
        haptic([14, 28, 14]);
        refreshEggPowerHud();
      }

      function updateEggPowers(dt) {
        eggRuntime.darkPulse = Math.max(0, eggRuntime.darkPulse - dt);
        eggRuntime.chainCooldown = Math.max(0, eggRuntime.chainCooldown - dt);
        eggRuntime.crowdSurge = Math.max(0, eggRuntime.crowdSurge - dt);
        eggRuntime.dashEchoCooldown = Math.max(0, eggRuntime.dashEchoCooldown - dt);
        eggRuntime.hoodCloak = Math.max(0, eggRuntime.hoodCloak - dt);
        eggRuntime.echoCooldown = Math.max(0, eggRuntime.echoCooldown - dt);
        if (eggPowerActive("wallet")) {
          const gained = Math.max(0, (coins || 0) - (eggRuntime.walletCoinMark || 0));
          if (gained > 0) {
            eggRuntime.walletCoinMark = coins;
            eggRuntime.walletShieldBank = Math.min(56, (eggRuntime.walletShieldBank || 0) + gained * 1.25);
          }
          if (player.maxShield > 0 && eggRuntime.walletShieldBank > 0 && player.shield < player.maxShield && player.energy > 50) {
            const recharge = Math.min(eggRuntime.walletShieldBank, dt * 3.2);
            player.shield = Math.min(player.maxShield, player.shield + recharge);
            eggRuntime.walletShieldBank -= recharge;
          }
        } else {
          eggRuntime.walletCoinMark = coins || 0;
        }
        if (eggPowerActive("greenSignal") && !eggRuntime.dipUsed && player.hp > 0 && player.hp <= player.maxHp * .18) {
          eggRuntime.dipUsed = true;
          player.invuln = Math.max(player.invuln, 3.2);
          player.energy = player.maxEnergy;
          Object.keys(player.ability || {}).forEach((key) => player.ability[key] = 0);
          particle(player.x, player.y, "#fff7c2", 52, 500);
          story(runtimeText("msg.buyDipStand", "BUY THE DIP // the last stand is live."), 2.8);
          combatFlash(runtimeText("msg.lastStandFlash", "LAST STAND"), 1200);
          buttonTone(1080, .24, "sawtooth", .045);
        }
        refreshEggPowerHud();
      }

      function loadEasterEggs() {
        const candidates = [];
        try {
          const row = document.cookie.split("; ").find((part) => part.startsWith(`${EASTER_COOKIE}=`));
          if (row) {
            const value = JSON.parse(decodeURIComponent(row.slice(EASTER_COOKIE.length + 1)));
            if (value && typeof value === "object") candidates.push({ source: "cookie", value });
          }
        } catch (_) {}
        for (const entry of readStorageEntries(EASTER_COOKIE)) {
          try {
            const value = JSON.parse(entry.raw);
            if (value && typeof value === "object") candidates.push({ source: entry.source, value });
          } catch (_) {}
        }
        candidates.sort((a, b) => {
          const revision = (Number(b.value.updatedAt) || 0) - (Number(a.value.updatedAt) || 0);
          return revision || (a.source === "localStorage" ? -1 : 1);
        });
        const parsed = candidates[0]?.value || null;
        const valid = Array.isArray(parsed?.found) ? parsed.found.filter((id) => eggCatalog.some((egg) => egg.id === id)) : [];
        easterEggFound = new Set(valid);
        updateEasterEggButton();
      }

      function saveEasterEggs() {
        const serialized = JSON.stringify({ found: [...easterEggFound], updatedAt: Date.now() });
        try { document.cookie = `${EASTER_COOKIE}=${encodeURIComponent(serialized)}; max-age=31536000; path=/; SameSite=Lax`; } catch (_) {}
        try {
          if (window.localStorage && typeof window.localStorage.setItem === "function") {
            window.localStorage.setItem(EASTER_COOKIE, serialized);
          }
        } catch (_) {}
      }

      function updateEasterEggButton() {
        const button = $("easterEggBtn");
        const found = easterEggFound.size;
        if (button) {
          button.classList.add("show");
          button.textContent = `${translate("easterArchive")} // ${found}/${eggCatalog.length}`;
        }
        if ($("easterCount")) $("easterCount").textContent = translate("easterFound", { found });
      }

      function renderEasterEggArchive() {
        const grid = $("easterGrid");
        if (!grid) return;
        const foundCount = easterEggFound.size;
        if ($("easterCount")) $("easterCount").textContent = translate("easterFound", { found: foundCount });
        grid.innerHTML = eggCatalog.map((egg) => {
          const found = easterEggFound.has(egg.id);
          const title = localizedItemField("egg", egg, "title", egg.title);
          const description = localizedItemField("egg", egg, "desc", egg.desc);
          const clue = localizedItemField("egg", egg, "clue", egg.clue);
          return `<article class="egg-entry ${found ? "found" : "locked"}" style="--egg-color:${egg.color}" aria-label="${found ? title : translate("lockedEggAria")}">
            <div class="egg-topline">
              <div class="egg-glyph"><span>${found ? egg.glyph : "?"}</span></div>
              <span class="egg-status">${found ? translate("recovered") : translate("signalLocked")}</span>
            </div>
            <h3>${found ? title : translate("unknownTrace")}</h3>
            <p>${found ? description : translate("unknownTraceBody")}</p>
            <small class="egg-clue">${found ? translate("archiveMemorySaved") : clue}</small>
          </article>`;
        }).join("");
        updateEasterEggButton();
      }

      function eggColor(eggId) {
        return eggCatalog.find((egg) => egg.id === eggId)?.color || CYAN;
      }

      function isLegendaryEnemy(enemy) {
        return !!enemy && !!(enemy.legendary || enemy.elite || enemy.boss);
      }

      function rememberLegendaryAnchor(enemy) {
        if (!isLegendaryEnemy(enemy)) return null;
        const x = Number(enemy.x);
        const y = Number(enemy.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        return {
          x, y,
          elite: true,
          boss: !!enemy.boss,
          legendary: true,
          bossName: enemy.bossName || ""
        };
      }

      function tryUnlockLegendaryEggs(source) {
        if (state !== "playing" || !isLegendaryEnemy(source)) return;
        // Secrets appear one at a time. Missing an active trace never causes
        // a later legendary kill to dump several rewards on the same spot.
        if (pickups.some((pickupItem) => pickupItem.kind === "egg")) return;
        const anchor = rememberLegendaryAnchor(source) || lastLegendaryAnchor;
        if (!anchor) return;
        const unlock = (id) => spawnEasterEgg(id, anchor.x, anchor.y, anchor);

        if (!easterEggFound.has("darkButton") && wave >= 2 && legendaryKillsThisRun >= 1 && player.kills >= 7) {
          unlock("darkButton");
          return;
        }
        if (!easterEggFound.has("chain4663") && wave >= 3 && legendaryKillsThisRun >= 2 && combo >= 5) {
          unlock("chain4663");
          return;
        }
        if (!easterEggFound.has("pco") && wave >= 4 && legendaryKillsThisRun >= 3 && combo >= 10) {
          unlock("pco");
          return;
        }
        if (!easterEggFound.has("wallet") && wave >= 5 && legendaryKillsThisRun >= 4 && player.hp <= player.maxHp * .82) {
          unlock("wallet");
          return;
        }
        if (!easterEggFound.has("hood") && source.boss && wave >= 5) {
          unlock("hood");
          return;
        }
        if (!easterEggFound.has("greenSignal") && source.boss && wave >= 10 && legendaryKillsThisRun >= 6 && easterEggFound.size >= 6) {
          unlock("greenSignal");
        }
      }

      function openEasterEggArchive() {
        if (state !== "menu") return;
        renderEasterEggArchive();
        setLayer(menu, false);
        setLayer(easterEggLayer, true);
      }

      function closeEasterEggArchive() {
        setLayer(easterEggLayer, false);
        if (state === "menu") setLayer(menu, true);
      }

      function collectEasterEgg(id) {
        const egg = eggCatalog.find((candidate) => candidate.id === id);
        if (!egg || easterEggFound.has(id)) return false;
        easterEggFound.add(id);
        saveEasterEggs();
        renderEasterEggArchive();
        addEggPowerToLoadout(id, true);
        const bonus = 120 + easterEggFound.size * 55;
        score += bonus;
        const eggTitle = localizedItemField("egg", egg, "title", egg.title);
        toast(`${translate("easterEgg")} // ${eggTitle}`, 2200);
        story(`${translate("hiddenLedger")} // ${eggTitle} ${translate("recovered")}`, 3.2);
        combatFlash(`${translate("easterEgg")} +${bonus}`, 1050);
        buttonTone(920 + easterEggFound.size * 35, .16, "triangle", .034);
        haptic([12, 30, 12]);
        if (easterEggFound.size === eggCatalog.length) {
          story(runtimeText("msg.greenComplete"), 4.5);
          toast(runtimeText("msg.allRecovered"), 3200);
        }
        return true;
      }

      function spawnEasterEgg(id, x, y, source = null) {
        if (state !== "playing" || !isLegendaryEnemy(source) || easterEggFound.has(id) || easterEggRunSpawned.has(id)) return false;
        if (pickups.some((pickupItem) => pickupItem.kind === "egg")) return false;
        const egg = eggCatalog.find((candidate) => candidate.id === id);
        if (!egg) return false;
        const sourceX = Number.isFinite(x) ? x : source.x;
        const sourceY = Number.isFinite(y) ? y : source.y;
        if (!Number.isFinite(sourceX) || !Number.isFinite(sourceY)) return false;
        // Preserve the legendary enemy's location, but nudge the trace toward
        // the player so a long-range takedown is demanding rather than lost.
        const toPlayerX = player.x - sourceX;
        const toPlayerY = player.y - sourceY;
        const sourceDistance = Math.hypot(toPlayerX, toPlayerY) || 1;
        const nudge = Math.min(76, sourceDistance * .24);
        const spawnX = sourceX + toPlayerX / sourceDistance * nudge;
        const spawnY = sourceY + toPlayerY / sourceDistance * nudge;
        easterEggRunSpawned.add(id);
        pickup(spawnX, spawnY, "egg", 1, { eggId: id });
        toast(`${translate("legendaryTrace")} // ${localizedItemField("egg", egg, "title", egg.title)}`, 1700);
        combatFlash(runtimeText("msg.legendaryEgg"), 900);
        return true;
      }

      function evaluateEasterEggTriggers() {
        // Kept as a stable update hook. Secrets are intentionally evaluated
        // only on an Elite/Boss takedown in tryUnlockLegendaryEggs().
      }

      loadEasterEggs();

      const player = {
        x: 0, y: 0, r: 15, hp: 100, maxHp: 100, energy: 100, maxEnergy: 100, speed: 235,
        range: 510, damage: 1, fireRate: 1, bombRadius: 115, shield: 0, dash: 0, invuln: 0,
        weapon: 0, cooldown: 0, ability: { surge: 0, dash: 0, bomb: 0 }, surge: 0, kills: 0
      };
      const playerFx = {
        weaponFlashUntil: 0,
        dashFlashUntil: 0,
        bombFlashUntil: 0,
        upgradeFlashUntil: 0,
        upgradeColor: ACID,
        upgradePulse: 0,
        weaponIndex: 0,
        dashAngle: -Math.PI / 2
      };
      function triggerUpgradeFx(color = ACID) {
        playerFx.upgradeFlashUntil = nowMs() + 1150;
        playerFx.upgradeColor = color;
        playerFx.upgradePulse = 1;
        particle(player.x, player.y, color, 24, 260);
        buttonTone(620, .11, "triangle", .028);
      }
      const upgrades = [
        { key: "range", title: "LONGER REACH", icon: "↗", desc: "+22% projectile life. Turn short-range shots into a frontier map.", base: 40, max: 8 },
        { key: "damage", title: "HARDER PRESS", icon: "✦", desc: "+16% weapon damage. Make every click count.", base: 55, max: 8 },
        { key: "fireRate", title: "LOW LATENCY", icon: "≈", desc: "+12% fire cadence. The signal arrives first.", base: 50, max: 8 },
        { key: "maxHp", title: "THICKER PLATE", icon: "◇", desc: "+18 max integrity and a small repair.", base: 45, max: 8 },
        { key: "speed", title: "FAST ROUTING", icon: "»", desc: "+10% movement speed. Never get caught in a lockout.", base: 42, max: 8 },
        { key: "bombRadius", title: "WIDER BLAST", icon: "◎", desc: "+20% Margin Call radius and +8% bomb damage.", base: 60, max: 6 }
      ];
      const upgradeLevels = fromEntries(upgrades.map((u) => [u.key, 0]));
      const weapons = [
        { key: "handshake", name: "HANDSHAKE", short: "RAPID", cooldown: .12, damage: 8, speed: 860, spread: .035, pellets: 1, color: ACID, range: 1, pierce: 0, explosive: 0 },
        { key: "spreadsheet", name: "SPREADSHEET", short: "SPREAD", cooldown: .62, damage: 8, speed: 700, spread: .34, pellets: 1, color: CYAN, range: .82, pierce: 0, explosive: 0 },
        { key: "lance", name: "RAGE LANCE", short: "PIERCE", cooldown: 1.0, damage: 46, speed: 1180, spread: .012, pellets: 1, color: VIOLET, range: 1.34, pierce: 4, explosive: 0 },
        { key: "short", name: "SHORT SELL", short: "BOMB", cooldown: .9, damage: 28, speed: 480, spread: .02, pellets: 1, color: HOT, range: .78, pierce: 0, explosive: 74 },
        { key: "nova", name: "NOVA ARRAY", short: "NOVA", cooldown: 1.05, damage: 17, speed: 620, spread: .48, pellets: 1, color: "#ffb35f", range: .92, pierce: 0, explosive: 34, size: 8 },
        { key: "chain", name: "CHAIN LINK", short: "CHAIN", cooldown: .48, damage: 21, speed: 780, spread: .018, pellets: 1, color: "#78e8ff", range: 1.08, pierce: 0, explosive: 0, chain: 2, chainRange: 178, chainFalloff: .62, size: 7 },
        { key: "scythe", name: "PHASE SCYTHE", short: "RETURN", cooldown: 1.15, damage: 58, speed: 760, spread: .012, pellets: 1, color: "#ff72d2", range: 1.5, pierce: 2, explosive: 0, returning: true, returnDistance: 300, size: 11 }
      ];
      const weaponUpgradeLevels = fromEntries(weapons.map((weapon) => [weapon.key, 0]));
      const weaponUpgradeDefs = {
        handshake: { title: "HANDSHAKE TUNING", tag: "RAPID", color: ACID, base: 82, max: 8, desc: "Eight levels of cycling, impact control and support fire." },
        spreadsheet: { title: "SPREADSHEET PATTERN", tag: "SPREAD", color: CYAN, base: 98, max: 8, desc: "Add pellets, compress the cone and unlock a piercing route." },
        lance: { title: "LANCE CALIBRATION", tag: "PIERCE", color: VIOLET, base: 120, max: 8, desc: "Sharper penetration, heavier impact and a reinforced final stage." },
        short: { title: "SHORT SELL PAYLOAD", tag: "BLAST", color: HOT, base: 112, max: 8, desc: "Wider, denser detonations and a charged payload chassis." },
        nova: { title: "NOVA ARRAY CELLS", tag: "NOVA", color: "#ffb35f", base: 126, max: 8, desc: "More stars, larger bursts and a high-tier echo core." },
        chain: { title: "CHAIN LINK ROUTING", tag: "CHAIN", color: "#78e8ff", base: 136, max: 8, desc: "Extra jumps, longer signal reach and a reinforced relay." },
        scythe: { title: "SCYTHE PHASING", tag: "RETURN", color: "#ff72d2", base: 148, max: 8, desc: "A deeper returning edge with more reach, impact and echo passes." }
      };
      function weaponProfile(index = player.weapon) {
        const base = weapons[index] || weapons[0];
        const level = Math.max(0, Math.min(8, Math.floor(Number(weaponUpgradeLevels[base.key]) || 0)));
        const profile = { ...base, level };
        if (base.key === "handshake") {
          profile.cooldown *= Math.pow(.93, level);
          profile.damage *= 1 + level * .075;
        } else if (base.key === "spreadsheet") {
          profile.damage *= 1 + level * .06;
          // Level 1 is a true baseline for every weapon.  Extra projectiles
          // are earned only after upgrading, so spread/bomb loadouts do not
          // start with hidden multi-shot power.
          profile.pellets += Math.floor(level / 2);
          profile.spread *= Math.max(.64, 1 - level * .055);
        } else if (base.key === "lance") {
          profile.damage *= 1 + level * .085;
          profile.pierce += Math.floor(level / 2);
          profile.speed *= 1 + level * .025;
        } else if (base.key === "short") {
          profile.cooldown *= Math.pow(.93, level);
          profile.damage *= 1 + level * .06;
          profile.explosive += level * 10;
        } else if (base.key === "nova") {
          profile.pellets += Math.floor(level / 2);
          profile.damage *= 1 + level * .055;
          profile.explosive += level * 7;
          profile.spread *= Math.max(.7, 1 - level * .04);
        } else if (base.key === "chain") {
          profile.damage *= 1 + level * .07;
          profile.chain += Math.floor((level + 1) / 2);
          profile.chainRange += level * 22;
          profile.chainFalloff = Math.min(.8, profile.chainFalloff + level * .018);
        } else if (base.key === "scythe") {
          profile.damage *= 1 + level * .09;
          profile.pierce += Math.floor(level / 2);
          profile.returnDistance += level * 52;
          profile.speed *= 1 + level * .035;
        }
        // Every weapon begins as a single-projectile loadout. Additional
        // pellets are an earned upgrade and never appear at level 1.
        if (level <= 1) profile.pellets = 1;
        // Every weapon now shares a clear eight-step chassis progression.
        // Weapon-specific tuning above keeps the loadouts distinct; these
        // milestones make each level visibly and mechanically meaningful.
        profile.damage *= 1 + level * .043;
        profile.speed *= 1 + level * .014;
        const fallbackSize = base.key === "lance" ? 9 : base.key === "short" ? 12 : 5;
        profile.projectileSize = Math.max(3, Math.min(24, (Number(base.size) || fallbackSize) + level * .42));
        profile.impact = Math.max(12, Math.min(178, 28 + level * 13 + (base.key === "lance" || base.key === "scythe" ? 22 : 0)));
        profile.critBonus = Math.min(.12, level * .012);
        if (level >= 3) profile.pierce += 1;
        if (level >= 5) {
          profile.chain = Math.max(Number(profile.chain) || 0, 1);
          profile.chainRange = Math.max(Number(profile.chainRange) || 0, 128 + level * 12);
          profile.chainFalloff = Math.max(Number(profile.chainFalloff) || 0, .52);
        }
        if (level >= 7) profile.explosive = Math.max(0, Number(profile.explosive) || 0) + 14 + (level - 7) * 8;
        profile.echo = level >= 8;
        return profile;
      }
      function weaponUpgradeMilestone(level = 0) {
        const safeLevel = Math.max(0, Math.min(8, Math.floor(Number(level) || 0)));
        if (safeLevel < 3) return { at: 3, title: "PIERCE RELAY", detail: "+1 pass-through" };
        if (safeLevel < 5) return { at: 5, title: "CHAIN ROUTE", detail: "first chain jump" };
        if (safeLevel < 7) return { at: 7, title: "MICRO BLAST", detail: "impact detonation" };
        if (safeLevel < 8) return { at: 8, title: "ECHO CORE", detail: "secondary echo shot" };
        return { at: 8, title: "SIGNAL PEAK", detail: "all weapon systems online" };
      }
      function weaponProfileStatLine(index = player.weapon) {
        const profile = weaponProfile(index);
        const parts = [
          `${Math.round(profile.damage)} DMG`,
          `${Math.max(1, Number(profile.pellets) || 1)} SHOT`,
          `${Math.round(Number(profile.impact) || 0)} IMP`
        ];
        if (profile.pierce > 0) parts.push(`${profile.pierce} PIERCE`);
        if (profile.chain > 0) parts.push(`${profile.chain} CHAIN`);
        if (profile.echo) parts.push("ECHO");
        return parts.join(" // ");
      }
      const enemyTypes = {
        drone: { name: "DRONE", color: HOT, hp: 23, speed: 58, r: 13, touch: 18, value: 5 },
        sprint: { name: "SPRINT", color: "#ff9d4d", hp: 18, speed: 112, r: 10, touch: 14, value: 7 },
        vault: { name: "VAULT", color: "#e26aff", hp: 75, speed: 42, r: 21, touch: 27, value: 13 },
        broker: { name: "BROKER", color: CYAN, hp: 42, speed: 48, r: 16, touch: 20, value: 16, ranged: true },
        hunter: { name: "HUNTER", color: "#ffd86a", hp: 62, speed: 72, r: 15, touch: 22, value: 19, ranged: true },
        lock: { name: "LOCK", color: "#ffffff", hp: 155, speed: 33, r: 27, touch: 35, value: 35, elite: true }
      };
      const enemies = [], bullets = [], enemyBullets = [], particles = [], pickups = [], chainArcs = [];
      // Hard runtime budgets keep a long run responsive on laptops and
      // phones.  Projectiles also have a real world-distance ceiling, so a
      // shot can never travel forever across the arena.
      const MAX_PLAYER_RANGE = 1120;
      const MAX_PROJECTILE_RANGE = 1480;
      const mobileWorldRangeScale = () => compactDevice
        ? clamp(MOBILE_ZOOM_REFERENCE / Math.max(MOBILE_ZOOM_MIN, viewportZoom()), 1, 24)
        : 1;
      const playerRangeLimit = () => compactDevice
        ? Math.round(clamp(1650 * mobileWorldRangeScale(), 1650, 30000))
        : MAX_PLAYER_RANGE;
      const projectileRangeLimit = () => compactDevice
        ? Math.round(clamp(2100 * mobileWorldRangeScale(), 2100, 30000))
        : MAX_PROJECTILE_RANGE;
      const enemyProjectileRangeLimit = () => compactDevice
        ? Math.round(clamp(2100 * mobileWorldRangeScale(), 2100, 30000))
        : 1450;
      const MAX_PLAYER_BULLETS = 84;
      const MAX_ENEMY_BULLETS = 72;
      const MAX_PARTICLES = 620;
      const MAX_PICKUPS = 96;
      const MAX_CHAIN_ARCS = 34;
      const MAX_ENEMIES = 82;
      // Explosions still create a readable shove, but it is deliberately
      // restrained. The tactical leash below the combat layer is the final
      // fallback; normal hits should not feel like they launch an enemy
      // across the arena in the first place.
      const ENEMY_KNOCKBACK_SPEED = 165;
      const ENEMY_KNOCKBACK_CAP = 190;
      const ENEMY_KNOCKBACK_STEP_CAP = 4;
      let combatMaintenanceTimer = 0;
      const frontierEvent = { key: "", title: "", color: ACID, timer: 0, cooldown: 0 };
      let polishedCombatRender = false;
      const stars = Array.from({ length: 180 }, () => ({ x: Math.random(), y: Math.random(), z: .2 + Math.random() * .8, tw: Math.random() * 6.28 }));
      const arenaMarks = Array.from({ length: 32 }, () => ({ x: (Math.random() - .5) * 2400, y: (Math.random() - .5) * 1800, s: 14 + Math.random() * 58, a: Math.random() * .7 }));

/* ===== 30-systems-ui.js ===== */
function resize() {
        W = Math.max(1, window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 1);
        H = Math.max(1, window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 1);
        const cpuCap = hardwareConcurrency && hardwareConcurrency <= 4 ? 1.25 : 1.5;
        const areaCap = Math.max(1, Math.sqrt(3600000 / Math.max(1, W * H)));
        const dprCap = gameSettings.performance ? 1 : Math.min(cpuCap, areaCap);
        dpr = Math.min(window.devicePixelRatio || 1, dprCap);
        if (!supportsCanvasTransform) dpr = 1;
        canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
        canvas.style.width = W + "px"; canvas.style.height = H + "px";
        if (supportsCanvasTransform) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!player.x) { player.x = 0; player.y = 0; pointer.x = W * .5; pointer.y = H * .5; }
        updateOrientationGuard();
      }
      function rand(min, max) { return min + Math.random() * (max - min); }
      function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
      function applySoftGrowth(current, factor, cap) {
        const value = Math.max(1, Number(current) || 1);
        const limit = Math.max(value, Number(cap) || value);
        const nominalGain = Math.max(0, value * ((Number(factor) || 1) - 1));
        const progress = clamp((value - 1) / Math.max(.001, limit - 1), 0, 1);
        const damping = .32 + (1 - progress) * .68;
        return Math.min(limit, value + nominalGain * damping);
      }
      // Every relocation uses the actual rectangular camera bounds, rather
      // than a rough circular "near player" radius.  That keeps a rescue or
      // new spawn outside the visible frame at every zoom level, including
      // the deep mobile camera.
      function enemyViewportPadding(enemy = null, extraPixels = 0) {
        const spriteRadius = Math.max(0, Number(enemy?.r) || 0);
        const requested = Math.max(0, Number(extraPixels) || 0);
        return clamp(58 + spriteRadius * .72 + requested, 58, 190);
      }
      function enemyIsVisibleInViewport(enemy, paddingPixels = 0) {
        if (!enemy || !Number.isFinite(Number(enemy.x)) || !Number.isFinite(Number(enemy.y))) return false;
        const point = worldToScreen(Number(enemy.x), Number(enemy.y));
        if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return false;
        const padding = enemyViewportPadding(enemy, paddingPixels);
        return point.x >= -padding && point.x <= W + padding && point.y >= -padding && point.y <= H + padding;
      }
      function enemyViewportShellRadius(angle = 0, enemy = null, extra = 0) {
        const zoom = Math.max(MOBILE_ZOOM_MIN, Number(viewportZoom()) || 1);
        const safeAngle = Number.isFinite(Number(angle)) ? Number(angle) : Math.random() * Math.PI * 2;
        const cos = Math.max(.0001, Math.abs(Math.cos(safeAngle)));
        const sin = Math.max(.0001, Math.abs(Math.sin(safeAngle)));
        const padding = enemyViewportPadding(enemy, compactDevice ? 20 : 34);
        const horizontalEdge = (Math.max(1, W) / 2 + padding) / zoom / cos;
        const verticalEdge = (Math.max(1, H) / 2 + padding) / zoom / sin;
        const separation = Math.max(0, Number(extra) || 0) + rand(10, compactDevice ? 26 : 44) / zoom;
        return Math.max(1, Math.min(horizontalEdge, verticalEdge) + separation);
      }
      function enemyNearRadius(extra = 0) {
        // Kept as a compatibility helper for older extensions. It is not used
        // for relocation anymore because a radial value can be inside a wide
        // rectangular viewport.
        const zoom = Math.max(MOBILE_ZOOM_MIN, Number(viewportZoom()) || 1);
        const shortReach = Math.min(W, H) / (2 * zoom);
        const floor = compactDevice ? 280 : 360;
        const cap = compactDevice ? 900 : 1350;
        const fraction = compactDevice ? .60 : .72;
        const padding = Math.max(0, Number(extra) || 0);
        return clamp(shortReach * fraction + padding, floor, cap);
      }
      function enemyBoundaryRadius(enemy = null) {
        const zoom = Math.max(MOBILE_ZOOM_MIN, Number(viewportZoom()) || 1);
        const padding = enemyViewportPadding(enemy, 26);
        const visibleCorner = Math.hypot((Math.max(1, W) / 2 + padding) / zoom, (Math.max(1, H) / 2 + padding) / zoom);
        const leash = enemy?.boss ? 920 : enemy?.elite ? 680 : 450;
        // At an intentionally wide mobile zoom, use a proportionally longer
        // physical leash so an enemy has time to leave the frame naturally.
        const zoomLeash = compactDevice ? clamp(MOBILE_ZOOM_REFERENCE / zoom, 1, 5.5) : 1;
        return visibleCorner + leash * zoomLeash;
      }
      function enemyRespawnRadius(enemy = null) {
        return enemyViewportShellRadius(0, enemy, compactDevice ? 28 : 42);
      }
      function respawnEnemyNearPlayer(enemy, reason = "boundary") {
        if (!enemy || !player
          || !Number.isFinite(Number(player.x))
          || !Number.isFinite(Number(player.y))) return false;
        const x = Number(enemy.x);
        const y = Number(enemy.y);
        const hasPosition = Number.isFinite(x) && Number.isFinite(y);
        // Never move a rendered enemy. A pending rescue is held until the
        // enemy is outside the camera, so the player cannot observe a
        // teleport from a bomb, knockback or recovery pass.
        if (hasPosition && enemyIsVisibleInViewport(enemy, 8) && reason !== "invalid") {
          enemy.bbRespawnPending = true;
          enemy.bbRespawnReason = reason;
          return false;
        }
        const dx = hasPosition ? x - player.x : 0;
        const dy = hasPosition ? y - player.y : 0;
        let angle = Math.atan2(dy, dx);
        if (!Number.isFinite(angle)) angle = Math.random() * Math.PI * 2;
        const radius = enemyViewportShellRadius(angle, enemy, compactDevice ? 28 : 42);
        enemy.x = player.x + Math.cos(angle) * radius;
        enemy.y = player.y + Math.sin(angle) * radius;
        // A rescued target starts cleanly; otherwise the old impulse could
        // immediately fling it back outside the leash on the next frame.
        enemy.knockX = 0;
        enemy.knockY = 0;
        enemy.stun = Math.min(Math.max(0, Number(enemy.stun) || 0), .16);
        enemy.catchup = 0;
        enemy.bbEntryRush = true;
        enemy.bbEntryGrace = Math.max(Number(enemy.bbEntryGrace) || 0, enemy.boss ? .62 : .4);
        enemy.bbRespawnPending = false;
        enemy.bbRespawnReason = reason;
        try {
          if (typeof bbRuntimeSafety !== "undefined" && bbRuntimeSafety) {
            bbRuntimeSafety.enemyRescues = Math.min(1000000, (bbRuntimeSafety.enemyRescues || 0) + 1);
          }
        } catch (_) {}
        return true;
      }
      function rescueFarEnemies() {
        if (!Array.isArray(enemies) || !player) return 0;
        let rescued = 0;
        for (const enemy of enemies) {
          if (!enemy || !enemy.alive) continue;
          const dx = Number(enemy.x) - Number(player.x);
          const dy = Number(enemy.y) - Number(player.y);
          const distance = Math.hypot(dx, dy);
          const invalid = !Number.isFinite(distance);
          const pending = !!enemy.bbRespawnPending;
          if (invalid || pending || distance > enemyBoundaryRadius(enemy)) {
            const reason = invalid ? "invalid" : pending ? (enemy.bbRespawnReason || "pending") : "far";
            if (respawnEnemyNearPlayer(enemy, reason)) rescued++;
          }
        }
        return rescued;
      }
      function enemyEntryRadius(extra = 0, angle = 0) {
        return enemyViewportShellRadius(angle, null, extra);
      }
      function enemyCatchupMultiplier(enemy, distance) {
        // Long routes resolve quickly, but only as a physical approach from
        // outside the camera. The entry boost is cleared as soon as the
        // enemy crosses into view; no one is teleported into combat.
        const zoom = Math.max(MOBILE_ZOOM_MIN, Number(viewportZoom()) || 1);
        const visibleReach = Math.max(W, H) / (2 * zoom);
        const start = Math.max(240, visibleReach * .58);
        const span = Math.max(220, visibleReach * .64);
        const progress = clamp((distance - start) / span, 0, 1);
        const roleBoost = enemy?.boss ? .5 : enemy?.ranged ? .78 : enemy?.elite ? .98 : 1.18;
        let entryBoost = 1;
        if (enemy?.bbEntryRush) {
          if (enemyIsVisibleInViewport(enemy, 0)) {
            enemy.bbEntryRush = false;
          } else {
            const point = worldToScreen(enemy.x, enemy.y);
            const overflow = Math.max(
              0,
              -point.x,
              point.x - W,
              -point.y,
              point.y - H
            );
            entryBoost = 2.05 + clamp(overflow / Math.max(1, Math.max(W, H)), 0, 1) * 1.2;
          }
        }
        if (enemy) enemy.catchup = progress;
        return (1 + progress * progress * roleBoost) * entryBoost;
      }
      function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
      function segmentDistance(px, py, x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const lengthSq = dx * dx + dy * dy;
        if (lengthSq <= .000001) return Math.hypot(px - x1, py - y1);
        const t = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSq, 0, 1);
        return Math.hypot(px - (x1 + dx * t), py - (y1 + dy * t));
      }
      function aliveCount(list) { let n = 0; for (const e of list) if (e.alive) n++; return n; }
      function pushEnemyBullet(spec) {
        if (enemyBullets.length >= MAX_ENEMY_BULLETS) {
          enemyBullets.splice(0, enemyBullets.length - MAX_ENEMY_BULLETS + 1);
        }
        spec.traveled = 0;
        spec.maxTravel = spec.maxTravel || enemyProjectileRangeLimit();
        enemyBullets.push(spec);
      }
      function compactAlive(list) {
        let write = 0;
        for (let read = 0; read < list.length; read++) {
          if (list[read].alive) list[write++] = list[read];
        }
        list.length = write;
      }
      function compactCombatArrays() {
        if (enemies.length > 28) compactAlive(enemies);
        if (enemies.length > MAX_ENEMIES) {
          const overflow = enemies.length - MAX_ENEMIES;
          const candidates = enemies
            .filter((enemy) => enemy.alive && !enemy.boss)
            .sort((a, b) => dist(b, player) - dist(a, player));
          for (let i = 0; i < Math.min(overflow, candidates.length); i++) candidates[i].alive = false;
          compactAlive(enemies);
        }
        if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
        while (pickups.length > MAX_PICKUPS) {
          const disposable = pickups.findIndex((pickupItem) => pickupItem.kind !== "egg");
          pickups.splice(disposable >= 0 ? disposable : 0, 1);
        }
        if (bullets.length > MAX_PLAYER_BULLETS) bullets.splice(0, bullets.length - MAX_PLAYER_BULLETS);
        if (enemyBullets.length > MAX_ENEMY_BULLETS) enemyBullets.splice(0, enemyBullets.length - MAX_ENEMY_BULLETS);
        if (chainArcs.length > MAX_CHAIN_ARCS) chainArcs.splice(0, chainArcs.length - MAX_CHAIN_ARCS);
      }
      function resetFrontierEvent() {
        frontierEvent.key = "";
        frontierEvent.title = "";
        frontierEvent.color = ACID;
        frontierEvent.timer = 0;
        frontierEvent.cooldown = 0;
      }
      const frontierEventDefs = [
        { key: "flashCrash", title: "FLASH CRASH", color: HOT, duration: 6.2, message: "FLASH CRASH // hostile routing accelerates." },
        { key: "overclock", title: "OVERCLOCK", color: ACID, duration: 5.4, message: "OVERCLOCK // press cadence temporarily amplified." },
        { key: "mirrorTrade", title: "MIRROR TRADE", color: CYAN, duration: 7.5, message: "MIRROR TRADE // duplicate signals entering the book." },
        { key: "reverseFlow", title: "REVERSE FLOW", color: VIOLET, duration: 2.3, message: "REVERSE FLOW // movement vectors briefly invert." }
      ];
      function armFrontierEvent(waveNumber) {
        resetFrontierEvent();
        const chance = clamp(.46 + waveNumber * .022, .46, .78);
        frontierEvent.cooldown = Math.random() < chance ? rand(2.8, 6.4) : Infinity;
      }
      function triggerFrontierEvent() {
        const def = frontierEventDefs[Math.floor(Math.random() * frontierEventDefs.length)];
        frontierEvent.key = def.key;
        frontierEvent.title = localizedDefinitionField("frontier", def, "title", def.title);
        frontierEvent.color = def.color;
        frontierEvent.timer = def.duration;
        frontierEvent.cooldown = 0;
        toast(runtimeText("msg.volatilityEvent", `${frontierEvent.title} // VOLATILITY EVENT`, { name: frontierEvent.title }), 1500);
        story(localizedDefinitionField("frontier", def, "message", def.message), Math.min(2.8, def.duration));
        combatFlash(frontierEvent.title, 900);
      }
      function updateFrontierEvent(dt) {
        if (frontierEvent.timer > 0) {
          frontierEvent.timer -= dt;
          if (frontierEvent.timer <= 0) {
            frontierEvent.key = "";
            frontierEvent.title = "";
            frontierEvent.color = ACID;
            frontierEvent.cooldown = rand(4.5, 8.5);
          }
        } else if (Number.isFinite(frontierEvent.cooldown)) {
          frontierEvent.cooldown -= dt;
          if (frontierEvent.cooldown <= 0 && state === "playing") triggerFrontierEvent();
        }
      }
      function resetEntities() {
        enemies.length = 0; bullets.length = 0; enemyBullets.length = 0;
        particles.length = 0; pickups.length = 0; chainArcs.length = 0;
        combatMaintenanceTimer = 0;
        resetFrontierEvent();
        easterEggRunSpawned.clear();
      }

      // Settings are deliberately normalized at every boundary.  This keeps
      // values coming from old cookies, localStorage, sliders, and keyboard
      // shortcuts consistent and prevents a stale/invalid value from
      // resetting the camera when a run is resumed.
      function normalizeSettings(value = gameSettings) {
        const source = value && typeof value === "object" ? value : {};
        const boolValue = (candidate, fallback) => {
          if (candidate === undefined || candidate === null) return fallback;
          if (typeof candidate === "string") return candidate !== "false" && candidate !== "0";
          return !!candidate;
        };
        gameSettings = {
          ...defaultSettings,
          ...source,
          zoom: clamp(Number(source.zoom) || defaultSettings.zoom, zoomFloor(), ZOOM_MAX),
          masterVolume: clamp(Number.isFinite(Number(source.masterVolume)) ? Number(source.masterVolume) : defaultSettings.masterVolume, 0, 1),
          musicVolume: Number.isFinite(Number(source.musicVolume)) ? clamp(Number(source.musicVolume), 0, 1) : defaultSettings.musicVolume,
          performance: boolValue(source.performance, defaultSettings.performance),
          effects: boolValue(source.effects, defaultSettings.effects),
          haptics: boolValue(source.haptics, defaultSettings.haptics),
          language: LOCALE_CODES.includes(String(source.language)) ? String(source.language) : defaultSettings.language,
          tutorialSeen: boolValue(source.tutorialSeen, defaultSettings.tutorialSeen),
          mobileZoomProfile: Number.isFinite(Number(source.mobileZoomProfile)) ? Number(source.mobileZoomProfile) : 0,
          updatedAt: Number.isFinite(Number(source.updatedAt)) ? Number(source.updatedAt) : 0
        };
        return gameSettings;
      }

      let tutorialIndex = 0;
      let tutorialWasOpen = false;
      let touchGuideTimer = 0;
      function applyLocale() {
        currentLocale = LOCALE_CODES.includes(String(gameSettings.language)) ? String(gameSettings.language) : initialLocale;
        document.documentElement.lang = currentLocale;
        document.documentElement.dir = LOCALE_DIR[currentLocale] || "ltr";
        document.body.classList.toggle("locale-rtl", document.documentElement.dir === "rtl");
        document.querySelectorAll("[data-i18n]").forEach((node) => {
          const key = node.getAttribute("data-i18n");
          if (!key) return;
          const value = translate(key);
          if (typeof value === "string") node.textContent = value;
        });
        document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
          const key = node.getAttribute("data-i18n-aria-label");
          if (key) node.setAttribute("aria-label", translate(key));
        });
        document.querySelectorAll("[data-i18n-title]").forEach((node) => {
          const key = node.getAttribute("data-i18n-title");
          if (key) node.setAttribute("title", translate(key));
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
          const key = node.getAttribute("data-i18n-placeholder");
          if (key) node.setAttribute("placeholder", translate(key));
        });
        const settingsNote = $("settingsNote");
        if (settingsNote) settingsNote.textContent = translate("settingsNote");
        ["languageSelect", "pauseLanguageSelect"].forEach((id) => {
          const field = $(id);
          if (field) field.value = currentLocale;
        });
        if ($("settingsStatus")) $("settingsStatus").textContent = gameSettings.performance ? translate("lowPowerProfile") : translate("settingsStatus");
        updateSettingsLabels();
        renderTutorialStep();
        if (typeof syncHud === "function") syncHud();
        if (typeof refreshArchiveUi === "function") refreshArchiveUi();
        renderRunSaveUiHook?.();
        if (typeof updateEasterEggButton === "function") updateEasterEggButton();
        if (typeof renderEasterEggArchive === "function" && !easterEggLayer?.classList.contains("hidden")) renderEasterEggArchive();
        if (typeof renderUpgrades === "function" && state === "shop") renderUpgrades();
        if (typeof renderLevelChoices === "function" && state === "levelup") renderLevelChoices();
        if (typeof renderLeaderboard === "function" && !leaderboard?.classList.contains("hidden")) renderLeaderboard();
        if (typeof syncLeaderboardProfileFields === "function") syncLeaderboardProfileFields();
      }
      function setLocale(nextLocale) {
        const next = LOCALE_CODES.includes(String(nextLocale)) ? String(nextLocale) : "en";
        gameSettings.language = next;
        applySettings();
        saveSettings();
        applyLocale();
        toast(`${LOCALE_NAMES[next]} // ${translate("language")}`, 900);
      }
      function renderTutorialStep() {
        const layer = $("tutorial");
        if (!layer) return;
        const steps = localeValue("tutorialSteps", LOCALES.en.tutorialSteps);
        const safeSteps = Array.isArray(steps) && steps.length ? steps : LOCALES.en.tutorialSteps;
        tutorialIndex = clamp(tutorialIndex, 0, safeSteps.length - 1);
        const step = safeSteps[tutorialIndex];
        if ($("tutorialEyebrow")) $("tutorialEyebrow").textContent = translate("tutorialEyebrow");
        if ($("tutorialStep")) $("tutorialStep").textContent = translate("step", { current: tutorialIndex + 1, total: safeSteps.length });
        if ($("tutorialProgressBar")) $("tutorialProgressBar").style.width = `${((tutorialIndex + 1) / safeSteps.length) * 100}%`;
        if ($("tutorialGlyph")) {
          const glyph = $("tutorialGlyph");
          const span = glyph.querySelector("span");
          if (span) span.textContent = step.glyph || "BUY";
        }
        if ($("tutorialTitle")) $("tutorialTitle").textContent = step.title;
        if ($("tutorialBody")) $("tutorialBody").textContent = step.body;
        if ($("tutorialTip")) $("tutorialTip").textContent = step.tip || "";
        const controls = $("tutorialControls");
        if (controls) {
          controls.innerHTML = (step.controls || []).map((item) => `<div class="tutorial-control"><b>${item[0]}</b><span>${item[1]}</span></div>`).join("");
        }
        if ($("tutorialBack")) $("tutorialBack").disabled = tutorialIndex === 0;
        if ($("tutorialNext")) $("tutorialNext").textContent = tutorialIndex >= safeSteps.length - 1 ? translate("tutorialDone") : translate("tutorialNext");
        if ($("tutorialSkip")) $("tutorialSkip").textContent = translate("tutorialSkip");
        if ($("tutorialClose")) $("tutorialClose").setAttribute("aria-label", translate("tutorialClose"));
      }
      function openTutorial(force = false) {
        const layer = $("tutorial");
        if (!layer) return;
        tutorialWasOpen = true;
        tutorialIndex = 0;
        renderTutorialStep();
        layer.classList.remove("hidden");
        layer.setAttribute("aria-hidden", "false");
        layer.dataset.force = force ? "true" : "false";
        clearInput();
      }
      function closeTutorial(markSeen = true) {
        const layer = $("tutorial");
        if (!layer) return;
        layer.classList.add("hidden");
        layer.setAttribute("aria-hidden", "true");
        if (markSeen && !gameSettings.tutorialSeen) {
          gameSettings.tutorialSeen = true;
          saveSettings();
        }
        tutorialWasOpen = false;
      }
      function showTouchGuide() {
        const guide = $("touchGuide");
        if (!guide || !compactDevice || gameSettings.tutorialSeen === false) return;
        const text = $("touchGuideText");
        if (text) {
          text.textContent = translate("touchGuide");
          text.dir = document.documentElement.dir || "ltr";
        }
        guide.classList.add("show");
        clearTimeout(touchGuideTimer);
        touchGuideTimer = window.setTimeout(() => guide.classList.remove("show"), 7200);
      }

      function parseSettingsPayload(raw, encoded = false) {
        try {
          const decoded = encoded ? decodeURIComponent(raw) : raw;
          const parsed = JSON.parse(decoded);
          return parsed && typeof parsed === "object" ? parsed : null;
        } catch (_) {
          return null;
        }
      }

      function loadSettings() {
        // Preferences are device-local and intentionally single-source. A
        // previous build mirrored writes into several backends, which meant a
        // stale tab could win a timestamp race and silently restore an older
        // language or zoom value on reload. Read the durable local record
        // first, then fall back to legacy session/cookie records only when it
        // is genuinely absent.
        let storedSettings = null;
        try {
          storedSettings = parseSettingsPayload(window.localStorage?.getItem(SETTINGS_COOKIE));
        } catch (_) {}
        // Also recognize the short-lived v4 key used by an earlier patch.
        // Prefer the canonical record when it exists; the legacy key is only
        // a migration source and is never written again.
        if (!storedSettings) {
          for (const legacyKey of LEGACY_SETTINGS_KEYS) {
            try {
              storedSettings = parseSettingsPayload(window.localStorage?.getItem(legacyKey));
              if (storedSettings) break;
            } catch (_) {}
          }
        }
        if (!storedSettings) {
          try {
            storedSettings = parseSettingsPayload(window.sessionStorage?.getItem(SETTINGS_COOKIE));
          } catch (_) {}
        }
        if (!storedSettings) {
          try {
            const prefix = `${SETTINGS_COOKIE}=`;
            const row = document.cookie.split("; ").find((part) => part.startsWith(prefix));
            storedSettings = row ? parseSettingsPayload(row.slice(prefix.length), true) : null;
          } catch (_) {}
        }
        settingsHadLocalRecord = !!storedSettings;
        normalizeSettings(storedSettings || defaultSettings);
        // Migrate an untouched desktop-sized profile the first time it is
        // opened on a phone.  Once the player changes the zoom slider, the
        // marker preserves that explicit preference on later visits.
        if (compactDevice && (!Number.isFinite(Number(storedSettings?.mobileZoomProfile)) || Number(storedSettings?.mobileZoomProfile) < MOBILE_ZOOM_PROFILE)) {
          const storedZoom = Number(storedSettings?.zoom);
          // Migrate the old automatic mobile defaults (.82/1.0), while
          // preserving a value the player deliberately chose.
          if (!Number.isFinite(storedZoom) || storedZoom === 1 || storedZoom === .82) {
            gameSettings.zoom = defaultSettings.zoom;
          }
          gameSettings.mobileOptimized = true;
          gameSettings.mobileZoomProfile = MOBILE_ZOOM_PROFILE;
        }
      }

      function saveSettings() {
        normalizeSettings();
        const previousRevision = Number(gameSettings.updatedAt) || 0;
        gameSettings.updatedAt = Math.max(Date.now(), previousRevision + 1);
        const serialized = JSON.stringify(gameSettings);
        try { document.cookie = `${SETTINGS_COOKIE}=${encodeURIComponent(serialized)}; max-age=31536000; path=/; SameSite=Lax`; } catch (_) {}
        // localStorage is the durable preference store.  sessionStorage is
        // intentionally read for legacy migration, but mirroring writes into
        // it made a stale tab able to overwrite a newer language/zoom choice
        // during reload.
        try {
          if (window.localStorage && typeof window.localStorage.setItem === "function") {
            window.localStorage.setItem(SETTINGS_COOKIE, serialized);
          }
        } catch (_) {}
        bbEmitCloudChange("settings", { ...gameSettings }, gameSettings.updatedAt);
      }

      function readSettingsControls() {
        const controls = [
          ["zoomRange", "zoom", Number],
          ["masterVolumeRange", "masterVolume", Number],
          ["musicVolumeRange", "musicVolume", Number],
          ["performanceToggle", "performance", Boolean],
          ["effectsToggle", "effects", Boolean],
          ["hapticsToggle", "haptics", Boolean]
        ];
        for (const [id, key, parser] of controls) {
          const field = $(id);
          if (!field) continue;
          gameSettings[key] = parser === Boolean ? field.checked : parser(field.value);
        }
        const languageField = $("pauseLanguageSelect") || $("languageSelect");
        if (languageField && LOCALE_CODES.includes(String(languageField.value))) gameSettings.language = String(languageField.value);
        return normalizeSettings();
      }

      function applySettings() {
        normalizeSettings();
        document.body.classList.toggle("low-power", !!gameSettings.performance);
        document.body.classList.toggle("no-effects", !gameSettings.effects);
        if (masterGainNode) masterGainNode.gain.value = gameSettings.masterVolume;
        if (musicGainNode) {
          const musicLevel = state === "playing" ? gameSettings.musicVolume * .035 : 0;
          if (audioCtx) musicGainNode.gain.setTargetAtTime(musicLevel, audioCtx.currentTime, .06);
          else musicGainNode.gain.value = musicLevel;
        }
        if (W && H) resize();
        const zoomField = $("zoomRange");
        if (zoomField) zoomField.min = zoomFloor().toFixed(2);
        const fields = [
          ["zoomRange", gameSettings.zoom], ["masterVolumeRange", gameSettings.masterVolume], ["musicVolumeRange", gameSettings.musicVolume],
          ["performanceToggle", gameSettings.performance], ["effectsToggle", gameSettings.effects], ["hapticsToggle", gameSettings.haptics]
        ];
        for (const [id, value] of fields) { const field = $(id); if (!field) continue; if (field.type === "checkbox") field.checked = !!value; else field.value = value; }
        ["languageSelect", "pauseLanguageSelect"].forEach((id) => {
          const field = $(id);
          if (field) field.value = gameSettings.language;
        });
        updateSettingsLabels();
      }
      function updateSettingsLabels() {
        if ($("zoomValue")) $("zoomValue").textContent = `${Math.round(gameSettings.zoom * 100)}%`;
        if ($("masterVolumeValue")) $("masterVolumeValue").textContent = `${Math.round(gameSettings.masterVolume * 100)}%`;
        if ($("musicVolumeValue")) $("musicVolumeValue").textContent = gameSettings.musicVolume > 0 ? `${Math.round(gameSettings.musicVolume * 100)}%` : translate("off");
        if ($("performanceValue")) $("performanceValue").textContent = gameSettings.performance ? translate("on") : translate("off");
        if ($("effectsValue")) $("effectsValue").textContent = gameSettings.effects ? translate("on") : translate("off");
        if ($("hapticsValue")) $("hapticsValue").textContent = gameSettings.haptics ? translate("on") : translate("off");
        if ($("settingsStatus")) $("settingsStatus").textContent = gameSettings.performance ? translate("lowPowerProfile") : translate("settingsStatus");
      }
      loadSettings();
      applySettings();
      // Normalize/migrate the selected record once at startup so the durable
      // profile contains the current schema and mobile zoom marker.
      saveSettings();
      // The audio layer is gesture-gated, but once unlocked it also provides
      // a very quiet reactive bed.  It is intentionally generated locally so
      // the standalone file keeps working offline and never fetches audio.
      function tone() {}
      function unlockAudio() {
        // A synthetic click (or an autoplaying tab) is not enough to unlock
        // WebAudio. Waiting for a real activation prevents Chrome's rejected
        // AudioContext warning and keeps the old low hum from resurfacing.
        const activation = browserNavigator.userActivation;
        if (activation && !activation.isActive && !activation.hasBeenActive) return false;
        audioBlockedUntilGesture = false;
        try {
          audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === "suspended") audioCtx.resume().catch(() => { audioBlockedUntilGesture = true; });
        } catch (_) {
          audioBlockedUntilGesture = true;
        }
        return !audioBlockedUntilGesture;
      }
      function playAudioTone(freq, duration, type = "sine", volume = .035) {
        if (audioBlockedUntilGesture || gameSettings.masterVolume <= 0 || volume <= 0) return;
        const activation = browserNavigator.userActivation;
        if (activation && !activation.hasBeenActive) return;
        try {
          audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === "suspended") {
            audioCtx.resume().catch(() => { audioBlockedUntilGesture = true; });
            if (audioCtx.state === "suspended") return;
          }
          masterGainNode ||= audioCtx.createGain();
          masterGainNode.gain.value = Number.isFinite(gameSettings.masterVolume) ? gameSettings.masterVolume : .7;
          if (!masterGainConnected) { masterGainNode.connect(audioCtx.destination); masterGainConnected = true; }
          effectFilterNode ||= audioCtx.createBiquadFilter();
          effectFilterNode.type = "highpass";
          effectFilterNode.frequency.value = 92;
          effectFilterNode.Q.value = .55;
          if (!effectFilterConnected) { effectFilterNode.connect(masterGainNode); effectFilterConnected = true; }
          const o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = type; o.frequency.value = freq; g.gain.value = volume;
          o.connect(g); g.connect(effectFilterNode); o.start();
          g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + duration);
          o.stop(audioCtx.currentTime + duration);
        } catch (_) {}
      }
      function shotTone(freq = 220, duration = .045, type = "triangle", volume = .018) {
        playAudioTone(Math.max(128, freq), duration, type, volume);
      }
      function explosionTone(freq = 150, duration = .18, type = "sawtooth", volume = .04) {
        playAudioTone(Math.max(128, freq * .9), duration, type, volume);
        playAudioTone(Math.max(180, freq * 1.8), Math.min(.12, duration * .7), "triangle", volume * .45);
      }
      function buttonTone(freq = 430, duration = .07, type = "triangle", volume = .024) {
        playAudioTone(Math.max(180, freq), duration, type, volume);
      }
      function haptic(pattern = 10) {
        if (!gameSettings.haptics) return;
        if (browserNavigator.userActivation && !browserNavigator.userActivation.hasBeenActive) return;
        try { if (typeof browserNavigator.vibrate === "function") browserNavigator.vibrate(pattern); } catch (_) {}
      }
      function startAmbient() {
        if (audioBlockedUntilGesture || gameSettings.musicVolume <= 0 || gameSettings.masterVolume <= 0) return;
        try {
          if (!unlockAudio() || !audioCtx) return;
          masterGainNode ||= audioCtx.createGain();
          masterGainNode.gain.value = Number.isFinite(gameSettings.masterVolume) ? gameSettings.masterVolume : .7;
          if (!masterGainConnected) {
            masterGainNode.connect(audioCtx.destination);
            masterGainConnected = true;
          }
          musicGainNode ||= audioCtx.createGain();
          musicFilterNode ||= audioCtx.createBiquadFilter();
          musicFilterNode.type = "lowpass";
          musicFilterNode.frequency.value = 620;
          musicFilterNode.Q.value = .5;
          if (!musicFilterConnected) {
            // Route the bed through its own filter and then through the
            // master bus. The connection is established exactly once.
            musicGainNode.connect(musicFilterNode);
            musicFilterNode.connect(masterGainNode || audioCtx.destination);
            musicFilterConnected = true;
          }
          musicGainNode.gain.setTargetAtTime(gameSettings.musicVolume * .035, audioCtx.currentTime, .08);
          const createAmbientVoice = (existing, frequency, type, offset) => {
            if (existing) return existing;
            const oscillator = audioCtx.createOscillator();
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            oscillator.detune.value = offset;
            oscillator.connect(musicGainNode);
            oscillator.start();
            return oscillator;
          };
          ambientOsc = createAmbientVoice(ambientOsc, 55, "sine", 0);
          ambientOsc2 = createAmbientVoice(ambientOsc2, 82.5, "triangle", -4);
        } catch (_) {
          stopAmbient();
        }
      }
      function stopAmbient() {
        try {
          if (musicGainNode && audioCtx) musicGainNode.gain.setTargetAtTime(0, audioCtx.currentTime, .04);
        } catch (_) {}
      }
      function toast(message, duration = 1900) {
        const node = $("toast");
        if (!node) return;
        node.textContent = localizeRuntimeMessage(message); node.classList.add("show");
        clearTimeout(toast.timer); toast.timer = setTimeout(() => $("toast").classList.remove("show"), duration);
      }
      function story(message, duration = 4.2) {
        $("storyText").textContent = localizeRuntimeMessage(message); $("storyBanner").classList.add("show");
        clearTimeout(story.timer); story.timer = setTimeout(() => $("storyBanner").classList.remove("show"), duration * 1000);
      }
      function setLayer(layer, visible) { layer.classList.toggle("hidden", !visible); }
      function clearInput() {
        for (const k in keys) keys[k] = false;
        aimPointerIds.clear();
        pointerPositions.clear();
        legacyTouchRoles.clear();
        mobileFireHeld = false;
        mobileFirePointerId = null;
        desktopFireHeld = false;
        desktopFirePointerId = null;
        const fireButton = $("touchFireBtn");
        if (fireButton) {
          fireButton.classList.remove("is-held");
          fireButton.setAttribute("aria-pressed", "false");
        }
        pointer.id = null;
        pointer.down = false;
        joystick.active = false;
        joystick.id = null;
        joystick.x = joystick.y = 0;
        $("stick").style.display = "none";
        $("stick-knob").style.display = "none";
      }
      function combatFlash(message, duration = 850) {
        const node = $("combatFlash");
        if (!node || !gameSettings.effects) return;
        node.textContent = localizeRuntimeMessage(message);
        node.classList.add("show");
        clearTimeout(combatFlashTimer);
        combatFlashTimer = setTimeout(() => node.classList.remove("show"), duration);
      }
      function syncSettingsPanel() {
        // Read the live controls first.  This also covers browsers that only
        // dispatch `change` when a range slider loses focus.
        readSettingsControls();
        applySettings();
        saveSettings();
      }
      function pauseRun() {
        if (state !== "playing") return;
        saveSettings();
        state = "pause";
        ui.classList.remove("show");
        setLayer(pause, true);
        clearInput();
        stopAmbient();
        syncSettingsPanel();
        saveRunSnapshotHook?.("pause", true);
      }
      function resumeRun() {
        if (state !== "pause") return;
        syncSettingsPanel();
        setLayer(pause, false);
        ui.classList.add("show");
        state = "playing";
        requestLandscapeMode(false);
        updateOrientationGuard();
        startAmbient();
        saveRunSnapshotHook?.("resume", true);
      }
      function exitToMenu() {
        if (state !== "pause") return;
        saveSettings();
        saveRunSnapshotHook?.("menu", true);
        clearInput();
        stopAmbient();
        resetEntities();
        state = "menu";
        ui.classList.remove("show");
        setLayer(pause, false);
        setLayer(shop, false);
        setLayer(briefing, false);
        setLayer(gameover, false);
        setLayer(easterEggLayer, false);
        setLayer(levelup, false);
        setLayer(menu, true);
        $("bossHud")?.classList.remove("show");
        $("combatReadout").textContent = "";
        renderRunSaveUiHook?.();
        buttonTone(260, .1, "triangle", .022);
      }

      function startSequence() {
        unlockAudio();
        setLayer(menu, false); setLayer(easterEggLayer, false); setLayer(gameover, false); setLayer(shop, false); setLayer(pause, false); setLayer(levelup, false); setLayer(briefing, true);
        state = "briefing"; buttonTone(220, .12, "square"); buttonTone(330, .2, "sine");
        if (compactDevice && !gameSettings.tutorialSeen) window.setTimeout(() => openTutorial(false), 180);
      }
      function deploy() {
        unlockAudio();
        requestLandscapeMode(false);
        clearRunSaveHook?.();
        setLayer(briefing, false); setLayer(levelup, false); ui.classList.add("show"); resetRun(); state = "playing"; startWave(1); startAmbient(); updateOrientationGuard(); saveRunSnapshotHook?.("deploy", true); story("SIGNAL LOG 01 // The command is alive. Hold the line.", 5); buttonTone(440, .14, "square");
        if (compactDevice) window.setTimeout(showTouchGuide, 360);
      }
      function resetRun() {
        resetEntities(); setLayer(levelup, false); wave = 0; waveRemaining = 0; spawnTimer = 0; score = 0; coins = 0; combo = 0; comboTimer = 0; storyTimer = 0; shake = 0; flash = 0; arenaPulse = 0; bossAlive = false;
        hardLockTarget = null; lockTarget = null; targetCycleIndex = -1;
        Object.keys(upgradeLevels).forEach((k) => upgradeLevels[k] = 0);
        Object.keys(weaponUpgradeLevels).forEach((k) => weaponUpgradeLevels[k] = 0);
        Object.assign(player, { x: 0, y: 0, hp: 100, maxHp: 100, energy: 100, maxEnergy: 100, speed: 235, range: 510, damage: 1, fireRate: 1, bombRadius: 115, shield: 0, dash: 0, invuln: 0, weapon: 0, cooldown: 0, surge: 0, kills: 0 });
        syncHud();
      }

/* ===== 40-combat-render.js ===== */
function startWave(next) {
        wave = next; waveRemaining = 8 + Math.floor(wave * 2.5) + (wave % 5 === 0 ? 1 : 0); spawnTimer = .2; bossAlive = wave % 5 === 0;
        const names = ["bootSector", "mempoolRush", "slippageFields", "sequencerRing", "boss"];
        $("waveName").textContent = bossAlive
          ? `${localizedBossField("lock", "name", "THE LOCKOUT")} // ${translate("bossLabel")}`
          : translate(names[(wave - 1) % names.length]);
        $("objectiveText").textContent = bossAlive ? runtimeText("msg.breakLockout", "BREAK THE LOCKOUT") : runtimeText("msg.keepSignal", "KEEP THE SIGNAL ALIVE");
        syncHud(); story(wave === 1 ? "2021 // BUY WENT DARK. 4663 // THE SIGNAL RETURNS." : bossAlive ? "A LOCKOUT HAS ENTERED THE FRONTIER." : `WAVE ${pad2(wave)} // THE FRONTIER RECONFIGURES.`, 4);
        combatFlash(bossAlive ? `BOSS WAVE ${wave} // BREAK THE LOCKOUT` : `WAVE ${pad2(wave)} // PRESS HARD`, bossAlive ? 1500 : 850);
        haptic(bossAlive ? [18, 35, 18, 35, 18] : 10);
      }
      function chooseType() {
        const pool = ["drone", "drone", "drone"];
        if (wave >= 2) pool.push("sprint", "sprint");
        if (wave >= 3) pool.push("vault");
        if (wave >= 4) pool.push("broker");
        if (wave >= 6) pool.push("hunter");
        if (wave >= 8) pool.push("lock");
        return pool[Math.floor(Math.random() * pool.length)];
      }
      function spawnEnemy() {
        if (waveRemaining <= 0) return;
        const typeKey = bossAlive && waveRemaining === 1 ? "lock" : chooseType();
        const t = enemyTypes[typeKey];
        const angle = Math.random() * Math.PI * 2, radius = enemyEntryRadius(0, angle);
        const e = { alive: true, type: typeKey, x: player.x + Math.cos(angle) * radius, y: player.y + Math.sin(angle) * radius, r: t.r, hp: t.hp * (1 + (wave - 1) * .16), maxHp: t.hp * (1 + (wave - 1) * .16), speed: t.speed * (1 + Math.min(.95, (wave - 1) * .035)), touch: t.touch, value: Math.max(2, Math.round(t.value * (.72 + wave * .022))), ranged: !!t.ranged, shotTimer: rand(1.2, 2.7), elite: !!t.elite, hit: 0, phase: Math.random() * 6.28 };
        if (bossAlive && waveRemaining === 1) { e.r = 46; e.hp *= 9; e.maxHp = e.hp; e.speed *= .72; e.value = Math.min(72, Math.round(e.value * 2.2)); e.elite = true; e.type = "lock"; }
        enemies.push(e); waveRemaining--;
      }
      function nearestEnemy() {
        let best = null, bestD = Infinity, fallback = null, fallbackD = Infinity;
        const assistRange = 980 / Math.max(.05, viewportZoom());
        if (hardLockTarget?.alive && dist(hardLockTarget, player) <= assistRange * 1.25) return (lockTarget = hardLockTarget);
        if (hardLockTarget && !hardLockTarget.alive) hardLockTarget = null;
        for (const e of enemies) if (e.alive) {
          const d = dist(e, player);
          if (d < fallbackD) { fallback = e; fallbackD = d; }
          const p = worldToScreen(e.x, e.y);
          const visible = p.x > -120 && p.x < W + 120 && p.y > -120 && p.y < H + 120;
          if (visible && d <= assistRange && d < bestD) { best = e; bestD = d; }
        }
        best ||= fallback;
        lockTarget = best;
        return best;
      }
      function cycleTarget() {
        const candidates = enemies.filter((enemy) => enemy.alive).sort((a, b) => dist(a, player) - dist(b, player));
        if (!candidates.length) {
          hardLockTarget = null;
          toast("NO LIVE TARGET // SCANNING", 900);
          return;
        }
        targetCycleIndex = (targetCycleIndex + 1) % candidates.length;
        hardLockTarget = candidates[targetCycleIndex];
        lockTarget = hardLockTarget;
        const label = hardLockTarget.boss
          ? localizedBossField(hardLockTarget.bossKind || "lock", "name", hardLockTarget.bossName || translate("boss"))
          : localizedEnemyName(hardLockTarget, translate("threatLabel"));
        $("lockStatus").textContent = runtimeText("msg.lockOn", "LOCK-ON // {label}", { label });
        $("lockStatus").style.borderColor = hardLockTarget.boss ? "rgba(255,66,109,.7)" : "rgba(204,255,0,.35)";
        toast(`TARGET LOCKED // ${label}`, 1000);
        buttonTone(720, .07, "square", .022);
        haptic(12);
      }
      function aimAngle() {
        // Automatic control owns the firing vector.  A moving/held mouse is
        // still allowed to provide input for manual mode, but no pointer or
        // controller aim input may override the selected AI target while
        // auto-fire is enabled.
        if (typeof aimAssist !== "undefined" && aimAssist) {
          const automaticTarget = typeof bbResolveAutomaticTarget === "function"
            ? bbResolveAutomaticTarget()
            : lockTarget && lockTarget.alive
              ? lockTarget
              : (Array.isArray(enemies)
                ? enemies.filter((enemy) => enemy?.alive)
                  .sort((left, right) => dist(left, player) - dist(right, player))[0]
                : null);
          if (automaticTarget?.alive) {
            return Math.atan2(automaticTarget.y - player.y, automaticTarget.x - player.x);
          }
          // No AI target means no meaningful automatic firing direction. Do
          // not fall through to the mouse position in this mode.
          return -Math.PI / 2;
        }
        if (gamepadInput.aimActive) return gamepadAimAngle;
        // A held mouse / right-side touch must aim where the player points.
        // Smart targeting remains the relaxed default whenever no manual
        // direction is being supplied.
        if (
          pointer.id !== null
          && (pointerPositions.has(pointer.id) || pointer.down)
          && Number.isFinite(pointer.x)
          && Number.isFinite(pointer.y)
        ) {
          const manualTarget = screenToWorld(pointer.x, pointer.y);
          const dx = manualTarget.x - player.x;
          const dy = manualTarget.y - player.y;
          if (Math.hypot(dx, dy) > 8) return Math.atan2(dy, dx);
        }
        const e = lockTarget && lockTarget.alive ? lockTarget : nearestEnemy();
        return e ? Math.atan2(e.y - player.y, e.x - player.x) : -Math.PI / 2;
      }
      function screenToWorld(sx, sy) {
        const zoom = viewportZoom();
        return { x: player.x + (sx - W / 2) / zoom, y: player.y + (sy - H / 2) / zoom };
      }
      function worldToScreen(wx, wy) {
        const zoom = viewportZoom();
        return { x: (wx - player.x) * zoom + W / 2, y: (wy - player.y) * zoom + H / 2 };
      }
      function particle(x, y, color = ACID, count = 5, force = 150) {
        const budget = !gameSettings.effects ? 0 : gameSettings.performance ? Math.ceil(count * .32) : count;
        const available = Math.max(0, MAX_PARTICLES - particles.length);
        for (let i = 0; i < Math.min(budget, available); i++) {
          particles.push({ x, y, vx: rand(-force, force), vy: rand(-force, force), life: rand(.25, .7), max: .7, size: rand(1.5, 4.5), color });
        }
      }
      function pickup(x, y, kind = "coin", amount = 1, metadata = null) {
        const safeAmount = kind === "coin" ? Math.max(1, Math.floor(amount)) : amount;
        pickups.push({
          x, y, kind, amount: safeAmount,
          life: kind === "coin" ? 10 : kind === "egg" ? 30 : 14,
          spin: Math.random() * 6.28,
          eggId: metadata?.eggId || ""
        });
        while (pickups.length > MAX_PICKUPS) {
          const disposable = pickups.findIndex((pickupItem) => pickupItem.kind !== "egg");
          pickups.splice(disposable >= 0 ? disposable : 0, 1);
        }
      }
      function addChainArc(from, to, color = "#78e8ff") {
        if (chainArcs.length >= MAX_CHAIN_ARCS) chainArcs.shift();
        chainArcs.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y, color, life: .26, max: .26 });
      }
      function chainDamage(bullet, origin) {
        if (!bullet.chain || bullet.chainHits >= bullet.chain) return;
        let from = origin;
        for (let jump = bullet.chainHits; jump < bullet.chain; jump++) {
          let next = null;
          let bestDistance = bullet.chainRange || 160;
          for (const candidate of enemies) {
            if (!candidate.alive || bullet.hit.includes(candidate)) continue;
            const distance = Math.hypot(candidate.x - from.x, candidate.y - from.y);
            if (distance < bestDistance) {
              bestDistance = distance;
              next = candidate;
            }
          }
          if (!next) break;
          bullet.hit.push(next);
          bullet.chainHits++;
          hitEnemy(next, bullet.damage * Math.pow(bullet.chainFalloff || .6, jump + 1), bullet);
          addChainArc(from, next, bullet.color);
          from = next;
        }
      }
      function fire() {
        if (state !== "playing" || player.cooldown > 0) return;
        const automaticControl = typeof aimAssist !== "undefined" && !!aimAssist;
        const target = automaticControl && typeof bbResolveAutomaticTarget === "function"
          ? bbResolveAutomaticTarget()
          : lockTarget && lockTarget.alive
            ? lockTarget
            : nearestEnemy();
        if (!target && automaticControl) return;
        if (!target && !pointer.down && !keys.Space && !mobileFireHeld && !gamepadInput.fire) return;
        const w = weaponProfile(player.weapon);
        const tempo = zoomTempoScale();
        const projectileSpeed = w.speed * tempo;
        const visibleZoom = Math.max(.05, viewportZoom());
        const returnDistance = (w.returnDistance || 0) / visibleZoom;
        const eventFireBoost = (frontierEvent.key === "overclock" && frontierEvent.timer > 0 ? 1.62 : 1) * (typeof eggFireRateMultiplier === "function" ? eggFireRateMultiplier() : 1);
        const cadence = w.cooldown / player.fireRate / (player.surge > 0 ? 2.25 : 1) / eventFireBoost;
        player.cooldown = cadence; const base = aimAngle();
        playerFx.dashAngle = base;
        playerFx.weaponFlashUntil = nowMs() + 115;
        playerFx.weaponIndex = player.weapon;
        const pelletCount = Math.min(w.pellets, MAX_PLAYER_BULLETS);
        while (bullets.length + pelletCount > MAX_PLAYER_BULLETS) bullets.shift();
        // A level-one weapon is a true single shot. Never feed it through
        // the spread sampler: even a tiny random offset is visible when the
        // player lines up a target by eye. Higher-level multi-shot weapons
        // use a stable, symmetric fan so every shot remains predictable.
        const spreadStep = pelletCount > 1
          ? (Math.max(0, Number(w.spread) || 0) * 2) / (pelletCount - 1)
          : 0;
        for (let i = 0; i < pelletCount; i++) {
          const spreadOffset = pelletCount > 1
            ? (i - (pelletCount - 1) / 2) * spreadStep
            : 0;
          const angle = base + spreadOffset;
          const range = clamp(player.range * w.range / visibleZoom, 420, projectileRangeLimit());
          const maxLife = Math.min(2.8, range / Math.max(1, projectileSpeed));
          const travelLife = w.returning
            ? Math.min(3.8, maxLife + returnDistance / Math.max(1, projectileSpeed) * 1.35)
            : maxLife;
          const projectileSize = w.projectileSize || (w.key === "lance" ? 9 : w.key === "short" ? 12 : 5);
          bullets.push({
            x: player.x + Math.cos(angle) * 22,
            y: player.y + Math.sin(angle) * 22,
            vx: Math.cos(angle) * projectileSpeed,
            vy: Math.sin(angle) * projectileSpeed,
            speed: projectileSpeed,
            angle,
            weapon: w.key,
            spin: Math.random() * 6.28,
            life: travelLife,
            maxTravel: range,
            traveled: 0,
            size: projectileSize,
            damage: w.damage * player.damage * (w.pellets > 1 ? .78 : 1),
            color: w.color,
            pierce: w.pierce,
            explosive: w.explosive,
            chain: w.chain || 0,
            chainRange: w.chainRange || 0,
            chainFalloff: w.chainFalloff || .6,
            chainHits: 0,
            returning: !!w.returning,
            returnDistance,
            returningNow: false,
            weaponLevel: w.level || 0,
            bbWeaponImpact: w.impact || 0,
            bbWeaponCrit: w.critBonus || 0,
            bbWeaponEcho: false,
            hit: []
          });
        }
        particle(player.x + Math.cos(base) * 20, player.y + Math.sin(base) * 20, w.color, w.key === "spreadsheet" ? 10 : 5, 210);
        shake = Math.max(shake, w.key === "lance" ? 8 : 3);
        shotTone(w.key === "lance" ? 180 : 240 + player.weapon * 70, .045, w.key === "short" ? "square" : "triangle", .018);
        haptic(w.key === "short" ? [8, 18, 8] : 7);
      }
      function detonate(x, y, radius, damage, color = HOT) {
        particle(x, y, color, 36, 360); flash = Math.max(flash, .18); shake = Math.max(shake, 17); explosionTone(150, .18, "sawtooth", .04);
        for (const e of enemies) if (e.alive) { const d = Math.hypot(e.x - x, e.y - y); if (d < radius + e.r) e.hp -= damage * (1 - Math.min(1, d / (radius + e.r)) * .45) * (typeof eggDamageMultiplier === "function" ? eggDamageMultiplier() : 1); }
      }
      function activate(name) {
        if (state !== "playing") return;
        const cd = player.ability[name]; if (cd > 0) return;
        if (name === "surge") {
          player.surge = 4.5; player.ability.surge = 12; player.energy = clamp(player.energy - 20, 0, player.maxEnergy);
          playerFx.weaponFlashUntil = nowMs() + 4600;
          story(runtimeText("msg.buySurge", "BUY SURGE // latency removed."), 2.4); buttonTone(780, .12, "square");
        }
        if (name === "dash") {
          if (player.energy < DASH_ENERGY_COST) return;
          player.dash = DASH_DURATION; player.invuln = DASH_INVULN; player.ability.dash = DASH_COOLDOWN; player.energy = clamp(player.energy - DASH_ENERGY_COST, 0, player.maxEnergy);
          playerFx.dashFlashUntil = nowMs() + 650;
          playerFx.dashAngle = aimAngle();
          particle(player.x, player.y, CYAN, 18, 300); buttonTone(520, .08, "triangle");
        }
        if (name === "bomb") {
          player.ability.bomb = 13; player.energy = clamp(player.energy - 35, 0, player.maxEnergy);
          playerFx.bombFlashUntil = nowMs() + 900;
          const a = aimAngle(); detonate(player.x + Math.cos(a) * 130, player.y + Math.sin(a) * 130, player.bombRadius, 120 * player.damage, HOT); story(runtimeText("msg.marginCallRoom", "MARGIN CALL // the room is yours."), 2.4);
        }
        syncHud();
      }
      function hitEnemy(e, damage, bullet) {
        if (!e.alive) return;
        e.hp -= damage * (typeof eggDamageMultiplier === "function" ? eggDamageMultiplier() : 1); e.hit = .12; particle(e.x, e.y, bullet.color, 4, 120); shake = Math.max(shake, 4);
        if (e.hp <= 0) killEnemy(e);
      }
      function killEnemy(e) {
        if (!e.alive) return;
        e.alive = false; player.kills++; combo = Math.min(99, combo + 1); comboTimer = 2.4;
        const comboBonus = 1 + Math.min(.35, combo * .018);
        const rawGain = Math.round(e.value * comboBonus * (e.elite ? 1.2 : 1) * .56);
        const gainCap = e.boss ? 12 : e.elite ? 24 : 12;
        const gain = Math.max(1, Math.min(gainCap, rawGain));
        score += gain * 10 + (e.elite ? 300 : 0);
        pickup(e.x, e.y, "coin", gain);
        if (Math.random() < .09 || e.elite) pickup(e.x, e.y, "repair", e.elite ? 25 : 10);
        particle(e.x, e.y, e.elite ? VIOLET : e.type === "broker" ? CYAN : HOT, e.elite ? 28 : 13, e.elite ? 300 : 180);
        // Enemy destruction is intentionally silent; only player shots,
        // buttons, and actual blast events are audible.
      }
      function update(dt) {
        elapsed += dt; flash = Math.max(0, flash - dt); shake = Math.max(0, shake - dt * 28); explosionSoundCooldown = Math.max(0, explosionSoundCooldown - dt);
        if (state !== "playing" || orientationHold) return;
        updateFrontierEvent(dt);
        evaluateEasterEggTriggers();
        if (player.cooldown > 0) player.cooldown -= dt;
        if (player.surge > 0) player.surge -= dt;
        for (const k in player.ability) if (player.ability[k] > 0) player.ability[k] -= dt;
        player.energy = clamp(player.energy + dt * 4.3, 0, player.maxEnergy);
        if (comboTimer > 0) comboTimer -= dt; else combo = Math.max(0, combo - dt * .65);
        let mx = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
        let my = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
        if (gamepadInput.active) {
          mx += gamepadInput.moveX;
          my += gamepadInput.moveY;
        }
        if (joystick.active) { mx += joystick.x; my += joystick.y; }
        const mag = Math.hypot(mx, my); if (mag > 1) { mx /= mag; my /= mag; }
        if (frontierEvent.key === "reverseFlow" && frontierEvent.timer > 0) { mx *= -1; my *= -1; }
        const speed = player.speed * zoomTempoScale() * (player.dash > 0 ? DASH_SPEED_MULTIPLIER : 1);
        player.x += mx * speed * dt; player.y += my * speed * dt;
        if (player.dash > 0) player.dash -= dt; if (player.invuln > 0) player.invuln -= dt;
        // Auto-fire is self-contained. Mouse/touch/keyboard trigger state
        // must not add a second firing path or make Auto behave like manual.
        if (!(typeof aimAssist !== "undefined" && aimAssist)
          && (pointer.down || keys.Space || gamepadInput.fire || mobileFireHeld)) fire();
        if (spawnTimer > 0) spawnTimer -= dt;
        if (waveRemaining > 0 && spawnTimer <= 0 && aliveCount(enemies) < mobileBaseSpawnCap()) {
          spawnEnemy();
          // Give touch players a short reaction window at the start of each
          // wave.  Desktop cadence remains unchanged.
          // Keep the opening pressure readable, but bring the next threat in
          // sooner so a wave does not feel empty on a wide mobile camera.
          spawnTimer = Math.max(compactDevice ? .22 : .22, (.48 - wave * .015) * (compactDevice ? 1.02 : 1));
        }
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          const previousX = b.x, previousY = b.y;
          b.spin += dt * (b.returning ? 8 : 4);
          if (b.returning && !b.returningNow && b.traveled >= b.returnDistance) b.returningNow = true;
          if (b.returningNow) {
            const returnDistance = Math.hypot(player.x - b.x, player.y - b.y) || 1;
            b.vx += ((player.x - b.x) / returnDistance * b.speed - b.vx) * Math.min(1, dt * 9);
            b.vy += ((player.y - b.y) / returnDistance * b.speed - b.vy) * Math.min(1, dt * 9);
          }
          b.x += b.vx * dt; b.y += b.vy * dt; b.traveled += Math.hypot(b.vx, b.vy) * dt; b.life -= dt;
          if (b.returningNow && Math.hypot(player.x - b.x, player.y - b.y) < player.r + 18) { bullets.splice(i, 1); continue; }
          if (b.life <= 0 || (!b.returningNow && b.traveled > (b.maxTravel || projectileRangeLimit()))) { bullets.splice(i, 1); continue; }
          let removed = false;
          for (const e of enemies) if (e.alive && !b.hit.includes(e)) {
            // Use the complete frame segment, not only the final point. This
            // prevents a fast mobile shot from visually crossing an enemy
            // between frames without applying damage.
            if (segmentDistance(e.x, e.y, previousX, previousY, b.x, b.y) < e.r + b.size) {
              b.hit.push(e);
              hitEnemy(e, b.damage, b);
              if (b.explosive) detonate(b.x, b.y, b.explosive + player.bombRadius * .25, b.damage * 1.8, b.color);
              if (b.chain) chainDamage(b, e);
              if (b.returning && !b.returningNow) b.returningNow = true;
              else if (b.pierce > 0) b.pierce--;
              else { removed = true; break; }
            }
          }
          if (removed) bullets.splice(i, 1);
        }
        for (let i = chainArcs.length - 1; i >= 0; i--) {
          chainArcs[i].life -= dt;
          if (chainArcs[i].life <= 0) chainArcs.splice(i, 1);
        }
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
          const b = enemyBullets[i];
          const previousX = b.x, previousY = b.y;
          const step = Math.hypot(b.vx, b.vy) * dt;
          b.x += b.vx * dt; b.y += b.vy * dt; b.traveled += step; b.life -= dt;
          if (b.life <= 0 || b.traveled > (b.maxTravel || enemyProjectileRangeLimit())) { enemyBullets.splice(i, 1); continue; }
          if (segmentDistance(player.x, player.y, previousX, previousY, b.x, b.y) < player.r + b.r) { if (player.invuln <= 0) hurt(b.damage); enemyBullets.splice(i, 1); }
        }
        for (const e of enemies) if (e.alive) {
          const previousX = e.x, previousY = e.y;
          const dx = player.x - e.x, dy = player.y - e.y, d = Math.hypot(dx, dy) || 1;
          const catchup = enemyCatchupMultiplier(e, d);
          const enemySpeed = e.speed * zoomTempoScale() * catchup * mobileOpeningScale() * (frontierEvent.key === "flashCrash" && frontierEvent.timer > 0 ? 1.48 : 1) * (typeof eggEnemySpeedMultiplier === "function" ? eggEnemySpeedMultiplier() : 1);
          let move = enemySpeed;
          if (e.type === "broker" || e.type === "hunter" || e.type === "pulse" || e.type === "mirror" || e.type === "warden") {
            const desired = (e.type === "broker" ? 300 : e.type === "hunter" ? 390 : e.type === "pulse" ? 360 : e.type === "mirror" ? 285 : 470) / Math.max(.05, viewportZoom());
            move = d > desired ? enemySpeed : -enemySpeed * (e.type === "warden" ? .35 : .55);
           } else if (e.type === "leech") {
              const leechDistance = 190 / Math.max(.05, viewportZoom());
              move = d > leechDistance ? enemySpeed * 1.18 : enemySpeed * .42;
           }
           if (e.stun > 0) move *= .12;
           e.x += dx / d * move * dt; e.y += dy / d * move * dt; e.phase += dt * 2.4; e.hit = Math.max(0, e.hit - dt);
          e.bbEntryGrace = Math.max(0, (Number(e.bbEntryGrace) || 0) - dt);
          if (e.ranged && e.bbEntryGrace <= 0) {
            e.shotTimer -= dt;
            if (e.shotTimer <= 0) {
              e.shotTimer = Math.max(.62, 1.9 - wave * .045) + Math.random() * .8;
              const a = Math.atan2(player.y - e.y, player.x - e.x);
              const bulletColor = enemyTypes[e.type]?.color || HOT;
              const projectileSpeed = 260 * mobileProjectileScale();
              const tunedProjectileSpeed = projectileSpeed * zoomTempoScale();
              pushEnemyBullet({ x: e.x, y: e.y, vx: Math.cos(a) * tunedProjectileSpeed, vy: Math.sin(a) * tunedProjectileSpeed, r: e.type === "warden" ? 8 : 6, life: 4, damage: (e.type === "hunter" ? 12 : e.type === "warden" ? 15 : 8) * Math.max(.1, Number(e.bbHardcoreDamageScale) || 1), color: bulletColor, kind: e.type, bbHardcoreDamageApplied: true });
            }
          }
          const contactDistance = segmentDistance(player.x, player.y, previousX, previousY, e.x, e.y);
          if (contactDistance < e.r + player.r + 2 && player.invuln <= 0) hurt(e.touch * dt);
        }
        for (let i = pickups.length - 1; i >= 0; i--) {
          const p = pickups[i]; p.life -= dt; p.spin += dt * (p.kind === "egg" ? 2.4 : 4);
          if (p.life <= 0) {
            if (p.kind === "egg" && p.eggId && !easterEggFound.has(p.eggId)) easterEggRunSpawned.delete(p.eggId);
            pickups.splice(i, 1);
            continue;
          }
          const d = Math.hypot(p.x - player.x, p.y - player.y);
          if (d < 70) { p.x += (player.x - p.x) * dt * 3.2; p.y += (player.y - p.y) * dt * 3.2; }
          if (d < player.r + 17) {
            if (p.kind === "egg") {
              collectEasterEgg(p.eggId);
            } else if (p.kind === "coin") {
              coins += Math.max(1, Math.floor(p.amount));
              score += Math.max(2, Math.floor(p.amount * .6));
            } else {
              player.hp = clamp(player.hp + p.amount, 0, player.maxHp);
            }
            pickups.splice(i, 1);
          }
        }
        for (let i = particles.length - 1; i >= 0; i--) { const p = particles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .97; p.vy *= .97; p.life -= dt; if (p.life <= 0) particles.splice(i, 1); }
        combatMaintenanceTimer -= dt;
        if (combatMaintenanceTimer <= 0) {
          combatMaintenanceTimer = .65;
          compactCombatArrays();
        }
        if (waveRemaining === 0 && aliveCount(enemies) === 0) openShop();
        syncHud();
      }
      function hurt(amount) {
        if (player.invuln > 0) return;
        if (player.shield > 0) { const absorbed = Math.min(player.shield, amount); player.shield -= absorbed; amount -= absorbed; }
        player.hp -= amount;
        flash = .1; shake = Math.max(shake, 12);
        particle(player.x, player.y, HOT, 12, 190);
        haptic([18, 28, 18]);
        if (player.hp <= 0) endRun();
      }
      function openShop() {
        state = "shop"; ui.classList.remove("show"); setLayer(shop, true); stopAmbient(); $("shopCoins").textContent = Math.floor(coins); renderUpgrades(); saveRunSnapshotHook?.("shop", true); buttonTone(330, .15, "triangle");
      }
      function renderUpgrades() {
        const grid = $("upgradeGrid"); grid.innerHTML = "";
        upgrades.slice().sort(() => Math.random() - .5).slice(0, 3).forEach((u) => {
          const level = upgradeLevels[u.key], cost = Math.round(u.base * Math.pow(1.42, level));
          const card = document.createElement("article"); card.className = "upgrade-card";
          card.innerHTML = `<div style="font-size:24px;color:${ACID}">${u.icon}</div><h3>${u.title}</h3><p>${u.desc}<br /><span style="color:var(--acid-soft)">LEVEL ${level}/${u.max}</span></p><button class="upgrade-btn" type="button" ${level >= u.max || coins < cost ? "disabled" : ""}>PATCH // ${cost} ◈</button>`;
          card.querySelector("button").addEventListener("click", () => buyUpgrade(u.key, cost));
          grid.appendChild(card);
        });
      }
      function buyUpgrade(key, cost) {
        if (coins < cost || upgradeLevels[key] >= upgrades.find((u) => u.key === key).max) return;
        coins -= cost; upgradeLevels[key]++;
        if (key === "range") player.range = Math.min(playerRangeLimit(), player.range * 1.22);
        if (key === "damage") player.damage = applySoftGrowth(player.damage, 1.16, PLAYER_DAMAGE_CAP);
        if (key === "fireRate") player.fireRate = applySoftGrowth(player.fireRate, 1.12, PLAYER_FIRE_RATE_CAP);
        if (key === "maxHp") { player.maxHp += 18; player.hp = Math.min(player.maxHp, player.hp + 28); }
        if (key === "speed") player.speed *= 1.1;
        if (key === "bombRadius") player.bombRadius *= 1.2;
        $("shopCoins").textContent = Math.floor(coins); renderUpgrades(); toast("PATCH INSTALLED // signal upgraded.", 1600); buttonTone(760, .1, "square");
      }
      function continueWave() { setLayer(shop, false); ui.classList.add("show"); state = "playing"; requestLandscapeMode(false); startWave(wave + 1); updateOrientationGuard(); saveRunSnapshotHook?.("next-wave", true); }
      function endRun() { state = "gameover"; ui.classList.remove("show"); $("finalWave").textContent = wave; $("finalScore").textContent = score; $("finalCoins").textContent = coins; setLayer(gameover, true); }
      function syncHud() {
        $("hpText").textContent = Math.ceil(Math.max(0, player.hp)); $("maxHpText").textContent = Math.ceil(player.maxHp);
        $("hpFill").style.width = clamp(player.hp / player.maxHp * 100, 0, 100) + "%"; $("energyFill").style.width = clamp(player.energy / player.maxEnergy * 100, 0, 100) + "%";
        $("waveText").textContent = wave || 1; $("coinText").textContent = Math.floor(coins); $("scoreText").textContent = Math.floor(score);
        $("comboText").textContent = combo > 1 ? `COMBO x${Math.floor(1 + combo * .12)}` : "";
        weapons.forEach((w, i) => {
          const b = document.querySelector(`[data-weapon="${i}"]`);
          if (!b) return;
          const active = player.weapon === i;
          const level = weaponUpgradeLevels[w.key] || 0;
          b.classList.toggle("active", active);
          b.style.borderColor = active ? w.color : "";
          b.style.color = active ? w.color : "";
          b.style.boxShadow = active ? `0 0 20px ${w.color}44` : "";
          const label = b.firstChild;
           if (label) label.textContent = `${i + 1} · ${localizedItemField("weapon", w, "short", w.short)}`;
          const small = b.querySelector("small");
           if (small) small.textContent = `${localizedWeaponName(i, w.name)} // ${translate("levelShort")} ${level}`;
        });
        ["surge", "dash", "bomb"].forEach((name) => {
          const b = document.querySelector(`[data-ability="${name}"]`);
          if (!b) return;
          const cd = player.ability[name];
          b.classList.toggle("cooling", cd > 0);
          b.classList.toggle("ready", cd <= 0);
          const text = b.firstChild;
          if (text) text.textContent = `${name === "surge" ? "Q" : name === "dash" ? "E" : "R"} · ${localizedAbilityName(name, name.toUpperCase())}`;
           b.querySelector("small").textContent = cd > 0 ? `${cd.toFixed(1)}${runtimeText("ui.s", "s")}` : translate("ready");
        });
      }
      const weaponLocaleNames = {
        en: ["MARKET PULSE", "SPREADSHEET", "SHORT SQUEEZE", "LANCE"],
        fa: ["پالس بازار", "اسپردشیت", "شورت اسکوییز", "نیزه"],
        es: ["PULSO", "HOJA", "SHORT", "LANZA"],
        ar: ["نبض السوق", "جدول", "ضغط قصير", "رمح"],
        fr: ["IMPULSION", "TABLEUR", "SHORT", "LANCE"],
        de: ["MARKTPULS", "TABELLE", "SHORT", "LANZE"],
        pt: ["PULSO", "PLANILHA", "SHORT", "LANÇA"],
        tr: ["PİYASA", "TABLO", "SHORT", "MIZRAK"],
        ja: ["パルス", "スプレッド", "ショート", "ランス"],
        zh: ["市场脉冲", "表格", "轧空", "长枪"],
        hi: ["मार्केट पल्स", "शीट", "शॉर्ट", "लांस"]
      };
      const abilityLocaleNames = {
        en: { surge: "BUY SURGE", dash: "EXIT LIQUIDITY", bomb: "MARGIN CALL" },
        fa: { surge: "موج BUY", dash: "نقدینگی خروج", bomb: "کال مارجین" },
        es: { surge: "OLEADA BUY", dash: "LIQUIDEZ DE SALIDA", bomb: "LLAMADA DE MARGEN" },
        ar: { surge: "اندفاع BUY", dash: "سيولة الخروج", bomb: "نداء الهامش" },
        fr: { surge: "SURGE BUY", dash: "LIQUIDITÉ", bomb: "APPEL DE MARGE" },
        de: { surge: "BUY-SCHUB", dash: "EXIT-LIQUIDITÄT", bomb: "MARGIN CALL" },
        pt: { surge: "SURTO BUY", dash: "LIQUIDEZ DE SAÍDA", bomb: "MARGIN CALL" },
        tr: { surge: "BUY ATAĞI", dash: "ÇIKIŞ LİKİDİTESİ", bomb: "TEMİNAT ÇAĞRISI" },
        ja: { surge: "BUY サージ", dash: "出口流動性", bomb: "マージンコール" },
        zh: { surge: "BUY 涌流", dash: "退出流动性", bomb: "追加保证金" },
        hi: { surge: "BUY सर्ज", dash: "एग्ज़िट लिक्विडिटी", bomb: "मार्जिन कॉल" }
      };
      function localizedWeaponName(index, fallback) {
        const weapon = weapons[index];
        return localizedItemField("weapon", weapon, "name", (weaponLocaleNames[currentLocale] || weaponLocaleNames.en)[index] || fallback);
      }
      function localizedAbilityName(key, fallback) {
        return runtimeText(`ability.${key}`, (abilityLocaleNames[currentLocale] || abilityLocaleNames.en)[key] || fallback);
      }
      function buildHud() {
        const weaponBar = $("weaponBar"), abilityBar = $("abilityBar");
        weapons.forEach((w, i) => {
          const b = document.createElement("button");
          b.type = "button"; b.className = "weapon-btn"; b.dataset.weapon = i;
          b.innerHTML = `${i + 1} · ${localizedItemField("weapon", w, "short", w.short)}<small>${localizedWeaponName(i, w.name)}</small>`;
          b.addEventListener("click", () => { player.weapon = i; toast(`${localizedWeaponName(i, w.name)} ONLINE`, 1000); syncHud(); });
          weaponBar.appendChild(b);
        });
        const abilities = [{ key: "surge", hotkey: "Q" }, { key: "dash", hotkey: "E" }, { key: "bomb", hotkey: "R" }];
        abilities.forEach((a) => {
          const b = document.createElement("button");
          b.type = "button"; b.className = "ability-btn"; b.dataset.ability = a.key;
          b.innerHTML = `${a.hotkey} · ${localizedAbilityName(a.key, a.key.toUpperCase())}<small>${translate("ready")}</small>`;
          b.addEventListener("click", () => activate(a.key)); abilityBar.appendChild(b);
        });
      }

      function drawBackground(t) {
        const g = ctx.createRadialGradient(W * .5, H * .47, 0, W * .5, H * .47, Math.max(W, H) * .78);
        g.addColorStop(0, "#101a0f"); g.addColorStop(.45, "#080d0d"); g.addColorStop(1, "#030405"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        if (!gameSettings.performance) {
          const starCount = hardwareConcurrency && hardwareConcurrency <= 4 ? 96 : stars.length;
          for (let i = 0; i < starCount; i++) { const s = stars[i]; const x = ((s.x * W + t * 6 * s.z) % W + W) % W, y = (s.y * H + Math.sin(t * .3 + s.tw) * 8 * s.z) % H; ctx.globalAlpha = .16 + .3 * s.z; ctx.fillStyle = s.z > .7 ? ACID : CYAN; ctx.fillRect(x, y, s.z * 1.6, s.z * 1.6); }
        } else {
          ctx.globalAlpha = .35;
          ctx.fillStyle = "#102010";
          ctx.fillRect(0, 0, W, H);
        }
        ctx.globalAlpha = 1;
        const grid = 86, ox = ((player.x * .14 + t * 12) % grid + grid) % grid, oy = ((player.y * .14 + t * 8) % grid + grid) % grid;
        ctx.strokeStyle = "rgba(204,255,0,.075)"; ctx.lineWidth = 1;
        for (let x = -grid + ox; x < W + grid; x += grid) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = -grid + oy; y < H + grid; y += grid) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        if (!gameSettings.performance) {
          ctx.save();
          ctx.translate(W * .5, H * .5);
          ctx.rotate(t * .035);
          ctx.globalAlpha = .22;
          ctx.strokeStyle = "rgba(95,244,255,.22)";
          ctx.lineWidth = 1;
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, Math.max(W, H) * (.18 + i * .14), -Math.PI * .18, Math.PI * .72);
            ctx.stroke();
          }
          ctx.globalAlpha = .12;
          ctx.strokeStyle = "rgba(204,255,0,.28)";
          for (let i = 0; i < 8; i++) {
            const a = i * Math.PI / 4;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * 90, Math.sin(a) * 90);
            ctx.lineTo(Math.cos(a) * Math.max(W, H), Math.sin(a) * Math.max(W, H));
            ctx.stroke();
          }
          ctx.restore();
          const spotlight = ctx.createRadialGradient(W * .5, H * .5, 40, W * .5, H * .5, Math.max(W, H) * .7);
          spotlight.addColorStop(0, "rgba(110,180,80,.075)");
          spotlight.addColorStop(.32, "rgba(25,55,36,.025)");
          spotlight.addColorStop(1, "rgba(0,0,0,.18)");
          ctx.fillStyle = spotlight;
          ctx.fillRect(0, 0, W, H);
        }
        if (!gameSettings.performance) {
          const markCount = hardwareConcurrency && hardwareConcurrency <= 4 ? 18 : arenaMarks.length;
          for (let i = 0; i < markCount; i++) { const m = arenaMarks[i], p = worldToScreen(m.x, m.y); if (p.x < -120 || p.x > W + 120 || p.y < -120 || p.y > H + 120) continue; ctx.save(); ctx.translate(p.x, p.y); ctx.scale(worldRenderScale(), worldRenderScale()); ctx.rotate((m.x + m.y) * .002); ctx.strokeStyle = `rgba(95,244,255,${m.a * .22})`; ctx.strokeRect(-m.s, -m.s * .34, m.s * 2, m.s * .68); ctx.restore(); }
        }
        ctx.globalAlpha = 1;
      }
      function drawBuyCore(t) {
        const pulse = 1 + Math.sin(t * 3) * .018, cx = W / 2, cy = H / 2;
        const visualScale = coreVisualScale();
        ctx.save(); ctx.translate(cx, cy); ctx.scale(pulse * visualScale, pulse * visualScale);
        const r = 32 + Math.sin(t * 2.2) * 2;
          const now = nowMs();
        const weapon = weapons[player.weapon] || weapons[0];
        const weaponLevel = weaponUpgradeLevels[weapon.key] || 0;
        const weaponColor = weapon.color || ACID;
        const surgeActive = player.surge > 0;
        const effectRemaining = (until, cap) => {
          const remaining = Number(until) - now;
          return Number.isFinite(remaining) ? clamp(remaining, 0, cap) : 0;
        };
        const dashActive = player.dash > 0 || effectRemaining(playerFx.dashFlashUntil, 1200) > 0;
        const bombActive = effectRemaining(playerFx.bombFlashUntil, 1400) > 0;
        const weaponFlash = effectRemaining(playerFx.weaponFlashUntil, 6000) > 0;
        // `playerFx` used to persist performance.now()-based timestamps.
        // On a fresh page those old values could make progress negative and
        // send CanvasRenderingContext2D.arc a negative radius.
        const upgradeRemaining = effectRemaining(playerFx.upgradeFlashUntil, 1150);
        const upgradeActive = upgradeRemaining > 0;
        const abilityPulse = 1 + Math.sin(t * 9) * .08;
        if (frontierEvent.timer > 0) {
          ctx.save();
          ctx.rotate(t * 1.7);
          ctx.globalAlpha = .28 + Math.sin(t * 8) * .06;
          ctx.strokeStyle = frontierEvent.color;
          ctx.shadowBlur = gameSettings.performance ? 0 : 18;
          ctx.shadowColor = frontierEvent.color;
          ctx.lineWidth = 2;
          setDash([8, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, 97 + Math.sin(t * 6) * 5, 0, Math.PI * 2);
          ctx.stroke();
          setDash([]);
          ctx.restore();
        }
        if (eggRuntime?.order?.length) {
          ctx.save();
          ctx.rotate(-t * .42);
          eggRuntime.order.forEach((id, index) => {
            const power = eggPowerDefs[id];
            if (!power) return;
            const radius = 70 + index * 13 + Math.sin(t * 3 + index) * 3;
            ctx.globalAlpha = gameSettings.performance ? .28 : .42;
            ctx.strokeStyle = power.color;
            ctx.shadowBlur = gameSettings.performance ? 0 : 15;
            ctx.shadowColor = power.color;
            ctx.lineWidth = index === eggRuntime.order.length - 1 ? 2.6 : 1.4;
            setDash(index === 1 ? [4, 7] : [10, 6]);
            ctx.beginPath();
            ctx.arc(0, 0, radius, t * (index + 1) * .7, t * (index + 1) * .7 + Math.PI * (1.05 + index * .18));
            ctx.stroke();
            setDash([]);
            const orbAngle = t * (index % 2 ? -.8 : .8) + index * Math.PI * 2 / Math.max(1, eggRuntime.order.length);
            ctx.globalAlpha = .9;
            ctx.fillStyle = power.color;
            ctx.beginPath();
            ctx.arc(Math.cos(orbAngle) * radius, Math.sin(orbAngle) * radius, 3.2 + index, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }
        if (eggRuntime?.darkPulse > 0) {
          ctx.save();
          ctx.globalAlpha = .24 + Math.sin(t * 18) * .08;
          ctx.strokeStyle = HOT;
          ctx.shadowBlur = gameSettings.performance ? 0 : 30;
          ctx.shadowColor = HOT;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, 104 + Math.sin(t * 11) * 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        if (eggRuntime?.hoodCloak > 0) {
          ctx.save();
          ctx.globalAlpha = .16 + Math.sin(t * 9) * .04;
          ctx.strokeStyle = eggPowerDefs.hood.color;
          ctx.shadowBlur = gameSettings.performance ? 0 : 24;
          ctx.shadowColor = eggPowerDefs.hood.color;
          ctx.lineWidth = 4;
          setDash([3, 8]);
          ctx.beginPath();
          ctx.arc(0, 0, 58 + Math.sin(t * 6) * 5, 0, Math.PI * 2);
          ctx.stroke();
          setDash([]);
          ctx.restore();
        }

        // Ability states are intentionally visible on the avatar itself:
        // surge becomes a rotating overdrive halo, dash leaves a directional
        // trail, and Margin Call wraps the core in a warning ring.
        if (surgeActive) {
          ctx.save();
          ctx.rotate(t * 1.8);
          ctx.globalAlpha = .22 + Math.sin(t * 7) * .06;
          ctx.strokeStyle = ACID;
          ctx.shadowBlur = 24;
          ctx.shadowColor = ACID;
          ctx.lineWidth = 3;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, 62 + i * 10 + Math.sin(t * 5 + i) * 3, i * 1.7, i * 1.7 + Math.PI * 1.05);
            ctx.stroke();
          }
          ctx.restore();
        }
        if (dashActive) {
          ctx.save();
          ctx.rotate(playerFx.dashAngle);
          ctx.globalAlpha = .22;
          ctx.fillStyle = CYAN;
          ctx.shadowBlur = 25;
          ctx.shadowColor = CYAN;
          ctx.beginPath();
          ctx.moveTo(-r * 1.1, 0);
          ctx.lineTo(-r * 5.5, -r * .95);
          ctx.lineTo(-r * 5.5, r * .95);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = .72;
          ctx.strokeStyle = CYAN;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-r * 1.2, 0); ctx.lineTo(-r * 4.5, 0);
          ctx.stroke();
          ctx.restore();
        }
        if (bombActive) {
          ctx.save();
          ctx.globalAlpha = .65 + Math.sin(t * 12) * .15;
          ctx.strokeStyle = HOT;
          ctx.shadowBlur = 30;
          ctx.shadowColor = HOT;
          ctx.lineWidth = 3;
          setDash([7, 5]);
          ctx.beginPath();
          ctx.arc(0, 0, 72 + Math.sin(t * 8) * 5, 0, Math.PI * 2);
          ctx.stroke();
          setDash([]);
          ctx.restore();
        }
        if (upgradeActive) {
          const progress = clamp(1 - upgradeRemaining / 1150, 0, 1);
          ctx.save();
          ctx.globalAlpha = .82 * (1 - progress);
          ctx.strokeStyle = playerFx.upgradeColor;
          ctx.shadowBlur = 28;
          ctx.shadowColor = playerFx.upgradeColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(0, 52 + progress * 58), -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
          ctx.stroke();
          ctx.globalAlpha = .22 * (1 - progress);
          ctx.fillStyle = playerFx.upgradeColor;
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(0, 48 + progress * 18), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.strokeStyle = "rgba(204,255,0,.18)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 86 + Math.sin(t) * 6, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = player.invuln > 0 ? "#ffffff" : surgeActive ? "#dfff62" : ACID;
        ctx.shadowBlur = surgeActive ? 34 : 24;
        ctx.shadowColor = surgeActive ? ACID : weaponColor;
        ctx.beginPath(); ctx.arc(0, 0, r * (bombActive ? 1.08 : abilityPulse), 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

        // The selected weapon is a small, readable module attached to the
        // core. It changes shape and color, so switching loadouts is visible
        // even before the next shot is fired.
        ctx.save();
        ctx.rotate(playerFx.dashAngle);
        ctx.translate(r * .78, 0);
        ctx.strokeStyle = weaponColor;
        ctx.fillStyle = weaponColor;
        ctx.shadowBlur = weaponFlash ? 22 : 10;
        ctx.shadowColor = weaponColor;
        ctx.lineWidth = 2;
        if (weapon.key === "spreadsheet") {
          ctx.beginPath(); ctx.moveTo(3, 0); ctx.lineTo(20, -8); ctx.lineTo(20, 8); ctx.closePath(); ctx.fill();
          ctx.strokeRect(10, -11, 13, 22);
        } else if (weapon.key === "lance") {
          ctx.fillRect(0, -3, 27, 6);
          ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(17, -8); ctx.lineTo(17, 8); ctx.closePath(); ctx.fill();
        } else if (weapon.key === "short") {
          ctx.beginPath(); ctx.arc(11, 0, 10, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(11, 0, 16, 0, Math.PI * 2); ctx.stroke();
        } else if (weapon.key === "nova") {
          ctx.globalAlpha = .24;
          ctx.beginPath(); ctx.arc(12, 0, 16 + weaponLevel * 1.5, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = .9;
          ctx.beginPath(); ctx.arc(12, 0, 7 + weaponLevel * .45, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = "#fff7c2";
          ctx.globalAlpha = .82;
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 5 + Math.floor(weaponLevel / 2); i++) {
            const a = i * Math.PI * 2 / (5 + Math.floor(weaponLevel / 2)) + t * 1.4;
            ctx.beginPath();
            ctx.moveTo(12 + Math.cos(a) * 10, Math.sin(a) * 10);
            ctx.lineTo(12 + Math.cos(a) * 20, Math.sin(a) * 20);
            ctx.stroke();
          }
        } else if (weapon.key === "chain") {
          ctx.globalAlpha = .26;
          ctx.beginPath(); ctx.arc(11, -6, 8, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.arc(19, 6, 8, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.fillRect(4, -2, 22, 4);
          ctx.strokeStyle = "#eaffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(13, 0, 12 + weaponLevel, -Math.PI * .65, Math.PI * .65); ctx.stroke();
        } else if (weapon.key === "scythe") {
          ctx.globalAlpha = .96;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(2, 7);
          ctx.quadraticCurveTo(8, -16 - weaponLevel * 1.5, 28, -7);
          ctx.quadraticCurveTo(16, 0, 2, 7);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = .7;
          ctx.strokeStyle = "#fff0fc";
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(27, -7); ctx.stroke();
        } else {
          ctx.fillRect(0, -3, 21, 6);
          ctx.beginPath(); ctx.arc(22, 0, 4, 0, Math.PI * 2); ctx.fill();
        }
        // Upgrade hardware is intentionally visible on every weapon, not
        // only in its damage number. More bands, relay lines and the final
        // echo core appear as the player invests in the loadout.
        if (weaponLevel > 0) {
          const modules = Math.min(4, Math.ceil(weaponLevel / 2));
          ctx.save();
          ctx.globalAlpha = .32 + Math.min(.48, weaponLevel * .055);
          ctx.strokeStyle = "#fff7c2";
          ctx.shadowBlur = weaponFlash ? 18 : 8;
          ctx.shadowColor = weaponColor;
          ctx.lineWidth = 1.25;
          for (let moduleIndex = 0; moduleIndex < modules; moduleIndex++) {
            const moduleX = 5 + moduleIndex * 5.2;
            ctx.beginPath();
            ctx.moveTo(moduleX, -7 - (weaponLevel >= 5 ? 1.5 : 0));
            ctx.lineTo(moduleX, 7 + (weaponLevel >= 5 ? 1.5 : 0));
            ctx.stroke();
          }
          if (weaponLevel >= 5) {
            ctx.globalAlpha = .42;
            ctx.beginPath();
            ctx.arc(15, 0, 15 + weaponLevel * .55, -Math.PI * .68, Math.PI * .68);
            ctx.stroke();
          }
          if (weaponLevel >= 7) {
            ctx.globalAlpha = .72;
            ctx.fillStyle = HOT;
            ctx.beginPath();
            ctx.arc(27, 0, 3.5 + (weaponLevel - 7) * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
          if (weaponLevel >= 8) {
            ctx.globalAlpha = .88;
            ctx.fillStyle = "#fff7c2";
            ctx.beginPath();
            ctx.arc(9, 0, 3.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        ctx.restore();
          ctx.fillStyle = "#050607"; ctx.font = "800 17px ui-monospace, monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("BUY", 0, 1);
        if (player.shield > 0) {
          ctx.strokeStyle = "rgba(95,244,255,.8)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r + 9, -Math.PI / 2, -Math.PI / 2 + Math.min(1, player.shield / Math.max(1, player.maxShield)) * Math.PI * 2); ctx.stroke();
        }
        ctx.restore();
      }
      function drawThreatIndicators(t) {
        if (state !== "playing") return;
        const cx = W * .5, cy = H * .5;
        const lowPower = !!gameSettings.performance;
        // Threat arrows and labels are screen-space guidance, not world
        // sprites. Keep them readable while the actual enemies scale down.
        const indicatorScale = compactDevice
          ? clamp(.72 + viewportZoom() * .28, .72, 1)
          : worldRenderScale();
        const left = 28, right = W - 28;
        const top = Math.min(Math.max(112, H * .14), H * .5 - 28);
        const bottom = Math.max(top + 56, Math.min(H - 104, H * .86));
        const farWorldThreshold = Math.max(420, (Math.max(W, H) / (2 * Math.max(.05, viewportZoom()))) * .9);
        const sectors = new Map();
        for (const e of enemies) {
          if (!e.alive) continue;
          const s = worldToScreen(e.x, e.y);
          const offscreen = s.x < -e.r * indicatorScale || s.x > W + e.r * indicatorScale
            || s.y < -e.r * indicatorScale || s.y > H + e.r * indicatorScale;
          const worldDistance = Math.hypot(e.x - player.x, e.y - player.y) || 1;
          // At deep zoom, an enemy can technically be inside the viewport
          // while still being too far away to read. Keep a directional cue
          // for that case too, without duplicating nearby targets.
          if (!offscreen && worldDistance <= farWorldThreshold) continue;
          const dx = s.x - cx, dy = s.y - cy, distance = Math.hypot(dx, dy) || 1;
          const angle = Math.atan2(dy, dx);
          const sector = Math.round(angle / (Math.PI / 12));
          const current = sectors.get(sector);
          if (current) {
            current.count++;
            const currentPriority = (current.e.boss ? 1000000 : current.e.elite ? 100000 : 0) - current.worldDistance;
            const nextPriority = (e.boss ? 1000000 : e.elite ? 100000 : 0) - worldDistance;
            if (nextPriority > currentPriority) {
              current.e = e;
              current.distance = distance;
              current.worldDistance = worldDistance;
              current.angle = angle;
            }
          } else sectors.set(sector, { e, angle, distance, worldDistance, count: 1 });
        }
        const threats = [...sectors.values()]
          .sort((a, b) => (b.e.boss ? 2 : b.e.elite ? 1 : 0) - (a.e.boss ? 2 : a.e.elite ? 1 : 0) || a.distance - b.distance)
          .slice(0, compactDevice ? (lowPower ? 12 : 16) : 16);
        if (!threats.length) return;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < threats.length; i++) {
          const threat = threats[i], e = threat.e;
          const ux = Math.cos(threat.angle), uy = Math.sin(threat.angle);
          const tx = ux > 0 ? (right - cx) / ux : (left - cx) / ux;
          const ty = uy > 0 ? (bottom - cy) / uy : (top - cy) / uy;
          const edge = Math.min(Math.abs(tx), Math.abs(ty));
          const x = cx + ux * edge, y = cy + uy * edge;
          const type = enemyTypes[e.type] || {};
          const color = e.boss || e.elite ? VIOLET : type.color || HOT;
          const pulse = .82 + Math.sin(t * 5 + i) * .14;
          const label = e.boss
            ? translate("bossLabel")
            : e.elite
              ? translate("eliteLabel")
              : localizedEnemyName(e, translate("threatLabel"));
          const threatDistance = Number.isFinite(threat.worldDistance) ? threat.worldDistance : threat.distance;
          const distanceLabel = threatDistance >= 1000 ? `${(threatDistance / 1000).toFixed(1)}K` : `${Math.round(threatDistance)}`;
          ctx.save();
          ctx.translate(x, y);
          ctx.scale(indicatorScale, indicatorScale);
          ctx.rotate(threat.angle);
          ctx.globalAlpha = .1 * pulse;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(0, 0, 27, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = .94 * pulse;
          ctx.shadowBlur = lowPower ? 0 : e.boss ? 24 : 15;
          ctx.shadowColor = lowPower ? "transparent" : color;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(19, 0); ctx.lineTo(-8, -11); ctx.lineTo(-3, 0); ctx.lineTo(-8, 11); ctx.closePath(); ctx.fill();
          ctx.globalAlpha = .78;
          ctx.strokeStyle = color;
          ctx.lineWidth = e.boss ? 2.5 : 1.5;
          ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-31, 0); ctx.stroke();
          ctx.restore();
          ctx.save();
          // Keep side labels fully inside narrow phone screens. The widest
          // label is 180px, so a 96px safe inset prevents edge clipping.
          const safeLabelX = clamp(x, compactDevice ? 96 : 98, W - (compactDevice ? 96 : 98));
          const safeLabelY = clamp(y + (y < cy ? 27 : -27) * indicatorScale, 14, H - 14);
          ctx.translate(safeLabelX, safeLabelY);
          ctx.scale(indicatorScale, indicatorScale);
          ctx.globalAlpha = .86;
          ctx.fillStyle = "rgba(2,5,4,.84)";
          ctx.font = `800 ${compactDevice ? 10 : 9}px ui-monospace, monospace`;
          const text = `${label}  ${distanceLabel}${threat.count > 1 ? `  ×${threat.count}` : ""}`;
          const width = Math.min(compactDevice ? Math.max(116, W - 56) : 180, ctx.measureText(text).width + 14);
          ctx.fillRect(-width / 2, -8, width, 16);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.strokeRect(-width / 2, -8, width, 16);
          ctx.fillStyle = color;
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
        ctx.restore();
      }
      function drawWorld(t) {
        ctx.save(); if (gameSettings.effects && shake > .2) ctx.translate(rand(-shake, shake), rand(-shake, shake));
        const locked = nearestEnemy();
        if (locked) {
          const p = worldToScreen(locked.x, locked.y);
          ctx.save();
          ctx.translate(p.x, p.y);
          const entityScale = enemyRenderScale();
          ctx.scale(entityScale, entityScale);
          ctx.rotate(t * 2.2);
          ctx.strokeStyle = locked.elite ? VIOLET : ACID;
          ctx.globalAlpha = .82;
          const reticle = locked.r + 10 + Math.sin(t * 6) * 3;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, reticle, 0, Math.PI * 2);
          ctx.stroke();
          ctx.strokeRect(-locked.r - 8, -locked.r - 8, (locked.r + 8) * 2, (locked.r + 8) * 2);
          ctx.globalAlpha = .32;
          ctx.beginPath();
          ctx.moveTo(-reticle - 8, 0); ctx.lineTo(reticle + 8, 0);
          ctx.moveTo(0, -reticle - 8); ctx.lineTo(0, reticle + 8);
          ctx.stroke();
          ctx.restore();
        }
        for (const p of pickups) {
          const s = worldToScreen(p.x, p.y);
          if (s.x < -40 || s.x > W + 40 || s.y < -40 || s.y > H + 40) continue;
          ctx.save();
          ctx.translate(s.x, s.y);
          const pickupScale = entityRenderScale();
          ctx.scale(pickupScale, pickupScale);
          ctx.rotate(p.spin);
          ctx.globalAlpha = Math.min(1, p.life);
          const pickupColor = p.kind === "coin" ? ACID : p.kind === "egg" ? eggColor(p.eggId) : HOT;
          ctx.fillStyle = pickupColor;
          ctx.strokeStyle = pickupColor;
          ctx.shadowBlur = gameSettings.performance ? 0 : p.kind === "egg" ? 22 : 12;
          ctx.shadowColor = pickupColor;
          if (p.kind === "egg") {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -11); ctx.lineTo(9, 0); ctx.lineTo(0, 11); ctx.lineTo(-9, 0); ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = .95;
            ctx.strokeStyle = "#fff7c2";
            ctx.stroke();
            ctx.globalAlpha = .72;
            ctx.fillStyle = "#050607";
            ctx.font = "900 6px ui-monospace, monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(eggCatalog.find((egg) => egg.id === p.eggId)?.glyph || "?", 0, 1);
          } else if (p.kind === "coin") {
            ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(7, 0); ctx.lineTo(0, 7); ctx.lineTo(-7, 0); ctx.closePath(); ctx.fill();
          } else {
            ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
          }
          ctx.restore();
        }
        for (const b of enemyBullets) {
          const s = worldToScreen(b.x, b.y);
          if (s.x < -80 || s.x > W + 80 || s.y < -80 || s.y > H + 80) continue;
          const color = b.color || HOT;
          const kind = b.kind || "";
          const angle = Math.atan2(b.vy, b.vx);
          ctx.save();
          ctx.translate(s.x, s.y);
          const enemyBulletScale = projectileRenderScale();
          ctx.scale(enemyBulletScale, enemyBulletScale);
          ctx.rotate(angle);
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          ctx.shadowBlur = gameSettings.performance ? 0 : 15;
          ctx.shadowColor = color;
          if (kind === "pulse" || color === enemyTypes.pulse?.color) {
            ctx.globalAlpha = .22;
            ctx.beginPath(); ctx.arc(0, 0, b.r * 2.6, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = .85;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(-b.r * 2.1, 0); ctx.lineTo(b.r * 2.1, 0); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -b.r * 2.1); ctx.lineTo(0, b.r * 2.1); ctx.stroke();
          } else if (kind === "warden" || color === enemyTypes.warden?.color) {
            ctx.beginPath();
            ctx.moveTo(b.r * 1.45, 0); ctx.lineTo(0, b.r * .68); ctx.lineTo(-b.r * 1.45, 0); ctx.lineTo(0, -b.r * .68); ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = .65;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
          } else if (kind === "mirror" || color === enemyTypes.mirror?.color) {
            ctx.globalAlpha = .24;
            ctx.fillRect(-b.r * 2.3, -b.r * .32, b.r * 4.6, b.r * .64);
            ctx.globalAlpha = 1;
            ctx.fillRect(-b.r * .8, -b.r * .8, b.r * 1.6, b.r * 1.6);
            ctx.globalAlpha = .7;
            ctx.strokeRect(-b.r * 1.2, -b.r * 1.2, b.r * 2.4, b.r * 2.4);
          } else {
            ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = .45;
            ctx.fillRect(-b.r * 2.4, -b.r * .2, b.r * 1.6, b.r * .4);
          }
          ctx.restore();
        }
        for (const b of bullets) {
          const s = worldToScreen(b.x, b.y);
          if (s.x < -96 || s.x > W + 96 || s.y < -96 || s.y > H + 96) continue;
          const speed = Math.hypot(b.vx, b.vy) || 1;
          const weapon = weapons.find((item) => item.key === b.weapon) || weapons[player.weapon];
          ctx.save();
          ctx.translate(s.x, s.y);
          const playerBulletScale = projectileRenderScale();
          ctx.scale(playerBulletScale, playerBulletScale);
          ctx.rotate(Math.atan2(b.vy, b.vx));
          ctx.globalAlpha = .22;
          ctx.fillStyle = b.color;
          ctx.shadowBlur = gameSettings.performance ? 0 : 18;
          ctx.shadowColor = b.color;
          ctx.fillRect(-Math.min(34, speed * .03) - b.size, -b.size * .22, Math.min(34, speed * .03), b.size * .44);
          ctx.globalAlpha = 1;
          if (weapon.key === "nova") {
            ctx.globalAlpha = .2;
            ctx.beginPath(); ctx.arc(0, 0, b.size * 2.8, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
            for (let i = 0; i < 5; i++) {
              const a = i * Math.PI * 2 / 5 + b.spin;
              ctx.save(); ctx.rotate(a); ctx.fillRect(b.size * .4, -1.4, b.size * 2.5, 2.8); ctx.restore();
            }
            ctx.beginPath(); ctx.arc(0, 0, b.size * .72, 0, Math.PI * 2); ctx.fill();
          } else if (weapon.key === "chain") {
            ctx.globalAlpha = .26;
            ctx.fillRect(-b.size * 3.8, -b.size * .4, b.size * 7.6, b.size * .8);
            ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.arc(0, 0, b.size * 1.12, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = .75;
            ctx.strokeStyle = "#eaffff";
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(0, 0, b.size * 1.65, 0, Math.PI * 1.45); ctx.stroke();
          } else if (weapon.key === "scythe") {
            ctx.globalAlpha = .22;
            ctx.fillRect(-b.size * 3.8, -b.size * .25, b.size * 7.6, b.size * .5);
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.moveTo(b.size * 2.8, 0);
            ctx.quadraticCurveTo(-b.size * .1, -b.size * 2.2, -b.size * 2.5, -b.size * .7);
            ctx.quadraticCurveTo(-b.size * .3, b.size * .45, b.size * 2.8, 0);
            ctx.fill();
            ctx.globalAlpha = .7;
            ctx.strokeStyle = "#fff0fc";
            ctx.stroke();
          } else if (weapon.key === "spreadsheet") {
            ctx.beginPath();
            ctx.moveTo(b.size * 2.3, 0);
            ctx.lineTo(-b.size * 1.4, -b.size * .9);
            ctx.lineTo(-b.size * 1.4, b.size * .9);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = .5;
            ctx.fillRect(-b.size * 2.2, -b.size * .22, b.size * 1.1, b.size * .44);
          } else if (weapon.key === "lance") {
            ctx.fillRect(-b.size * 2.4, -b.size * .28, b.size * 5.6, b.size * .56);
            ctx.globalAlpha = .72;
            ctx.beginPath();
            ctx.moveTo(b.size * 3.6, 0);
            ctx.lineTo(-b.size * .2, -b.size * 1.1);
            ctx.lineTo(-b.size * .2, b.size * 1.1);
            ctx.closePath();
            ctx.fill();
          } else if (weapon.key === "short") {
            ctx.beginPath();
            ctx.arc(0, 0, b.size * 1.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = .45;
            ctx.beginPath();
            ctx.arc(-b.size * 1.15, 0, b.size * .7, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-b.size * 1.5, -b.size * .42, b.size * 3, b.size * .84);
          }
          ctx.restore();
        }
        if (chainArcs.length) {
          ctx.save();
          for (const arc of chainArcs) {
            const a = worldToScreen(arc.x1, arc.y1), b = worldToScreen(arc.x2, arc.y2);
            ctx.globalAlpha = clamp(arc.life / arc.max, 0, 1);
            ctx.strokeStyle = arc.color;
            ctx.shadowBlur = gameSettings.performance ? 0 : 18;
            ctx.shadowColor = arc.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            const mx = (a.x + b.x) * .5, my = (a.y + b.y) * .5;
            ctx.quadraticCurveTo(mx + rand(-12, 12), my + rand(-12, 12), b.x, b.y);
            ctx.stroke();
          }
          ctx.restore();
        }
        for (const e of enemies) if (e.alive) {
          const s = worldToScreen(e.x, e.y);
          const type = enemyTypes[e.type] || enemyTypes.drone;
          const radius = e.r;
          if (s.x < -radius - 140 || s.x > W + radius + 140 || s.y < -radius - 140 || s.y > H + radius + 140) continue;
          const pulse = .5 + .5 * Math.sin(t * 5 + e.phase);
          ctx.save();
          ctx.translate(s.x, s.y);
          const enemyScale = enemyRenderScale();
          ctx.scale(enemyScale, enemyScale);
          ctx.rotate(e.phase * .2);
          if (e.boss && e.guardWindow > 0 && gameSettings.effects && !gameSettings.performance) {
            ctx.save();
            ctx.globalAlpha = .28 + Math.sin(t * 16) * .08;
            ctx.strokeStyle = "#fff7c2";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#fff7c2";
            ctx.lineWidth = 2;
            setDash([6, 4]);
            ctx.beginPath();
            ctx.arc(0, 0, radius + 16 + Math.sin(t * 8) * 2, 0, Math.PI * 2);
            ctx.stroke();
            setDash([]);
            ctx.restore();
          }
          ctx.globalAlpha = e.hit > 0 ? 1 : .92;
          ctx.fillStyle = type.color;
          ctx.strokeStyle = e.elite ? VIOLET : type.color;
          ctx.shadowBlur = gameSettings.performance ? 0 : e.elite ? 28 : 16;
          ctx.shadowColor = type.color;
          ctx.lineWidth = 2;
          if (e.elite) {
            ctx.globalAlpha = .28 + pulse * .18;
            ctx.beginPath(); ctx.arc(0, 0, radius + 10 + pulse * 5, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1;
          }
          ctx.beginPath();
          if (e.scammerBoss) {
            const glitch = Math.sin(t * 31 + e.phase) * radius * .09;
            ctx.fillStyle = "#ff426d";
            ctx.globalAlpha = .28;
            ctx.beginPath();
            ctx.moveTo(radius * .98 + glitch, 0);
            ctx.lineTo(radius * .28, radius * .86);
            ctx.lineTo(-radius * .84, radius * .52);
            ctx.lineTo(-radius * .92, -radius * .52);
            ctx.lineTo(radius * .28, -radius * .86);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#17101a";
            ctx.strokeStyle = "#ffd1e0";
            ctx.beginPath();
            ctx.moveTo(radius, 0);
            ctx.lineTo(radius * .32, radius * .78);
            ctx.lineTo(-radius * .74, radius * .5);
            ctx.lineTo(-radius * .82, -radius * .5);
            ctx.lineTo(radius * .32, -radius * .78);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#ff426d";
            ctx.fillRect(-radius * .56, -radius * .12, radius * 1.12, radius * .24);
            ctx.fillStyle = "#fff7c2";
            ctx.font = `900 ${Math.max(7, radius * .27)}px ui-monospace, monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(runtimeText("canvas.scam", "SCAM"), 0, 1);
            ctx.globalAlpha = .42;
            ctx.fillStyle = CYAN;
            for (let i = -2; i <= 2; i++) {
              const y = i * radius * .24 + glitch * .12;
              ctx.fillRect(-radius * .68, y, radius * 1.36, Math.max(1, radius * .035));
            }
            ctx.globalAlpha = 1;
          } else if (e.scammerDecoy) {
            const glitch = Math.sin(t * 24 + e.phase) * radius * .12;
            ctx.fillStyle = "#8cf7d4";
            ctx.strokeStyle = "#f0ffff";
            ctx.moveTo(glitch, -radius);
            ctx.lineTo(radius * .88 + glitch, 0);
            ctx.lineTo(glitch, radius);
            ctx.lineTo(-radius * .88 + glitch, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.globalAlpha = .68;
            ctx.fillStyle = "#07110f";
            ctx.fillRect(-radius * .62 + glitch, -radius * .1, radius * 1.24, radius * .2);
            ctx.fillStyle = "#fff7c2";
            ctx.font = `900 ${Math.max(7, radius * .42)}px ui-monospace, monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", glitch, 1);
            ctx.globalAlpha = 1;
          } else if (e.type === "drone") {
            ctx.moveTo(radius, 0); ctx.lineTo(0, radius * .72); ctx.lineTo(-radius, 0); ctx.lineTo(0, -radius * .72); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = "#eaffb0"; ctx.stroke();
            ctx.fillStyle = "#050607"; ctx.fillRect(-radius * .22, -radius * .22, radius * .44, radius * .44);
          } else if (e.type === "sprint" || e.type === "swarm") {
            ctx.moveTo(radius * 1.2, 0); ctx.lineTo(-radius * .65, -radius * .78); ctx.lineTo(-radius * .38, 0); ctx.lineTo(-radius * .65, radius * .78); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#fff2bf"; ctx.fillRect(radius * .25, -1.5, radius * .42, 3);
          } else if (e.type === "vault" || e.type === "splitter") {
            ctx.rect(-radius * .78, -radius * .78, radius * 1.56, radius * 1.56); ctx.fill();
            ctx.strokeStyle = "#ffd1f4"; ctx.stroke();
            ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(0, 0, radius * .46 + pulse * 2, 0, Math.PI * 2); ctx.stroke();
          } else if (e.type === "broker") {
            ctx.beginPath(); ctx.arc(0, 0, radius * .78, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#d9fbff"; ctx.stroke();
            ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(0, 0, radius + 5 + pulse * 3, -Math.PI * .7, Math.PI * .7); ctx.stroke();
            ctx.globalAlpha = 1; ctx.fillStyle = "#061014";
            ctx.fillRect(-radius * .2, -radius * .55, radius * .4, radius * 1.1);
            ctx.fillRect(-radius * .55, -radius * .13, radius * 1.1, radius * .26);
          } else if (e.type === "pulse") {
            ctx.beginPath(); ctx.arc(0, 0, radius * .72, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#d9fbff"; ctx.stroke();
            ctx.globalAlpha = .48 + pulse * .3;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, radius + 6 + pulse * 7, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 0, radius + 14 + pulse * 8, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1; ctx.fillStyle = "#07101a";
            ctx.beginPath(); ctx.arc(0, 0, radius * .22, 0, Math.PI * 2); ctx.fill();
            for (let i = 0; i < 4; i++) {
              ctx.save(); ctx.rotate(i * Math.PI / 2 + t * .8);
              ctx.fillRect(radius * .72, -1.5, radius * .42, 3);
              ctx.restore();
            }
          } else if (e.type === "hunter") {
            ctx.moveTo(0, -radius); ctx.lineTo(radius * .88, radius * .72); ctx.lineTo(0, radius * .42); ctx.lineTo(-radius * .88, radius * .72); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = "#f5ffd8"; ctx.stroke();
            ctx.fillStyle = "#070a08"; ctx.beginPath(); ctx.arc(0, -radius * .18, radius * .22, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = .7; ctx.beginPath(); ctx.moveTo(-radius * .95, radius * .72); ctx.lineTo(radius * .95, radius * .72); ctx.stroke();
          } else if (e.type === "mirror") {
            ctx.moveTo(0, -radius); ctx.lineTo(radius * .9, 0); ctx.lineTo(0, radius); ctx.lineTo(-radius * .9, 0); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = "#eaffff"; ctx.stroke();
            ctx.globalAlpha = .24; ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(-radius * .9, 0, radius * .62, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(radius * .9, 0, radius * .62, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = 1; ctx.fillStyle = "#07110f";
            ctx.fillRect(-radius * .18, -radius * .18, radius * .36, radius * .36);
          } else if (e.type === "leech") {
            ctx.moveTo(0, -radius); ctx.lineTo(radius * .88, radius * .72); ctx.lineTo(0, radius * .42); ctx.lineTo(-radius * .88, radius * .72); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = "#f5ffd8"; ctx.stroke();
            ctx.fillStyle = "#070a08"; ctx.beginPath(); ctx.arc(0, -radius * .18, radius * .22, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = .65 + pulse * .2; ctx.strokeStyle = "#eaffb0"; ctx.lineWidth = 1.5;
            for (let i = -1; i <= 1; i++) {
              ctx.beginPath(); ctx.moveTo(i * radius * .25, radius * .35); ctx.lineTo(i * radius * .42, radius * 1.15); ctx.stroke();
            }
            if (dist(e, player) < 165 / Math.max(.05, viewportZoom())) {
              const target = worldToScreen(player.x, player.y);
              const here = worldToScreen(e.x, e.y);
              ctx.restore();
              ctx.save();
              ctx.globalAlpha = .18 + pulse * .12;
              ctx.strokeStyle = type.color;
              ctx.shadowBlur = 14;
              ctx.shadowColor = type.color;
              ctx.lineWidth = 2;
              setDash([4, 5]);
              ctx.beginPath(); ctx.moveTo(here.x, here.y); ctx.lineTo(target.x, target.y); ctx.stroke();
              setDash([]);
              ctx.restore();
              continue;
            }
          } else if (e.type === "warden" || e.type === "lock") {
            ctx.beginPath(); ctx.arc(0, 0, radius * .72, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#ffffff"; ctx.stroke();
            for (let i = 0; i < 4; i++) {
              const a = i * Math.PI / 2 + pulse * .08;
              ctx.save(); ctx.rotate(a); ctx.fillRect(radius * .56, -radius * .13, radius * .72, radius * .26); ctx.restore();
            }
            ctx.fillStyle = "#050607"; ctx.font = `900 ${Math.max(8, radius * .33)}px ui-monospace, monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(runtimeText(e.boss ? "canvas.prime" : "canvas.lock", e.boss ? "PRIME" : "LOCK"), 0, 1);
          } else {
            const points = 6;
            for (let i = 0; i < points; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / points; ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius); }
            ctx.closePath(); ctx.fill();
          }
          ctx.restore();
          if (e.hp < e.maxHp) {
            ctx.save();
            const barScale = compactDevice
              ? clamp(.58 + viewportZoom() * .42, .58, 1)
              : enemyRenderScale();
            ctx.translate(s.x, s.y - (radius + 10) * barScale);
            ctx.scale(barScale, barScale);
            ctx.fillStyle = "rgba(0,0,0,.62)";
            ctx.fillRect(-radius, -2, radius * 2, 4);
            ctx.fillStyle = type.color;
            ctx.shadowBlur = 8; ctx.shadowColor = type.color;
            ctx.fillRect(-radius, -2, radius * 2 * clamp(e.hp / e.maxHp, 0, 1), 4);
            ctx.restore();
          }
        }
        const particleScale = entityRenderScale();
        for (const p of particles) { const s = worldToScreen(p.x, p.y); const size = p.size * particleScale; if (s.x < -24 || s.x > W + 24 || s.y < -24 || s.y > H + 24) continue; ctx.globalAlpha = clamp(p.life / p.max, 0, 1); ctx.fillStyle = p.color; ctx.shadowBlur = gameSettings.performance ? 0 : 10 * particleScale; ctx.shadowColor = p.color; ctx.fillRect(s.x, s.y, size, size); }
        ctx.globalAlpha = 1;
        drawBuyCore(t);
        // Directional threat guidance is intentionally kept on in low-power
        // mode: it is a tiny screen-space pass and is essential on phones
        // where zoomed-out enemies can sit outside the visible arena.
        drawThreatIndicators(t);
        ctx.restore();
      }
      function draw(t) {
        drawBackground(t); if (state === "menu") { if (heroImageReady && heroImage.complete && heroImage.naturalWidth > 0) { ctx.save(); ctx.globalAlpha = .04; ctx.globalCompositeOperation = "screen"; ctx.drawImage(heroImage, W * .55, H * .25, Math.min(470, W * .42), Math.min(350, W * .31)); ctx.restore(); } } else if (state === "briefing") { drawBuyCore(t); } else if (state === "playing") drawWorld(t); else if (state === "shop" || state === "pause" || state === "gameover") { drawWorld(t); ctx.fillStyle = "rgba(0,0,0,.42)"; ctx.fillRect(0, 0, W, H); }
        if (gameSettings.effects && flash > 0) { ctx.fillStyle = `rgba(255,66,109,${flash * 1.6})`; ctx.fillRect(0, 0, W, H); }
      }
      function loop(now) {
        if (document.hidden) {
          last = now;
          accumulator = 0;
          raf(loop);
          return;
        }
        updateOrientationGuard();
        if (!last) last = now;
        const dt = Math.min(.05, (now - last) / 1000);
        last = now;
        accumulator += dt;
        while (accumulator >= 1 / 60) { update(1 / 60); accumulator -= 1 / 60; }
        draw(now / 1000);
        raf(loop);
      }

      function setWeapon(i) {
        if (i >= 0 && i < weapons.length) {
          player.weapon = i;
          playerFx.weaponIndex = i;
          playerFx.weaponFlashUntil = nowMs() + 520;
          particle(player.x, player.y, weapons[i].color, 10, 150);
          toast(`${localizedItemField("weapon", weapons[i], "name", weapons[i].name)} ONLINE`, 900);
          buttonTone(360 + i * 120, .07, "triangle", .024);
          syncHud();
        }
      }

/* ===== 50-input-bindings.js ===== */
const menuArt = document.querySelector(".menu-art");
      const menuArtImage = document.querySelector(".menu-art img");
      menuArtImage?.addEventListener("error", () => menuArt?.classList.add("image-fallback"));
      if (menuArtImage?.complete && !menuArtImage.naturalWidth) menuArt?.classList.add("image-fallback");
      menuArt?.addEventListener("pointermove", (e) => {
        const r = menuArt.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - .5;
        const ny = (e.clientY - r.top) / r.height - .5;
        menuArtImage?.style.setProperty("--mx", `${nx * 14}px`);
        menuArtImage?.style.setProperty("--my", `${ny * 14}px`);
        menuArtImage?.style.setProperty("--rx", `${-ny * 5}deg`);
        menuArtImage?.style.setProperty("--ry", `${nx * 5}deg`);
      });
      menuArt?.addEventListener("pointerleave", () => {
        menuArtImage?.style.setProperty("--mx", "0px");
        menuArtImage?.style.setProperty("--my", "0px");
        menuArtImage?.style.setProperty("--rx", "0deg");
        menuArtImage?.style.setProperty("--ry", "0deg");
      });
      window.addEventListener("keydown", (e) => {
        const code = getKeyCode(e);
        if (!code) return;
        unlockAudio();
        keys[code] = true;
        if (code === "Space") { e.preventDefault(); syncPointerFire(); }
        if (code === "Digit1") setWeapon(0); if (code === "Digit2") setWeapon(1); if (code === "Digit3") setWeapon(2); if (code === "Digit4") setWeapon(3); if (code === "Digit5") setWeapon(4); if (code === "Digit6") setWeapon(5); if (code === "Digit7") setWeapon(6);
        if (code === "KeyQ") activate("surge"); if (code === "KeyE") activate("dash"); if (code === "KeyR") activate("bomb");
        if (code === "Tab" && state === "playing") { e.preventDefault(); cycleTarget(); }
        if ((code === "Equal" || code === "NumpadAdd") && (state === "playing" || state === "pause")) {
          e.preventDefault(); gameSettings.zoom = clamp(gameSettings.zoom + .04, zoomFloor(), ZOOM_MAX); applySettings(); saveSettings(); toast(`ZOOM ${Math.round(gameSettings.zoom * 100)}%`, 800);
        }
        if ((code === "Minus" || code === "NumpadSubtract") && (state === "playing" || state === "pause")) {
          e.preventDefault(); gameSettings.zoom = clamp(gameSettings.zoom - .04, zoomFloor(), ZOOM_MAX); applySettings(); saveSettings(); toast(`ZOOM ${Math.round(gameSettings.zoom * 100)}%`, 800);
        }
        if (code === "Escape" && state === "playing") pauseRun();
        else if (code === "Escape" && state === "pause") resumeRun();
        else if (code === "Escape" && !easterEggLayer.classList.contains("hidden")) closeEasterEggArchive();
      });
      window.addEventListener("keyup", (e) => { const code = getKeyCode(e); keys[code] = false; if (code === "Space") syncPointerFire(); });
      const isTouchPointer = (event) => event && (event.pointerType === "touch" || event.pointerType === "pen");
      const setStickPosition = (x, y) => {
        $("stick").style.display = "block";
        $("stick-knob").style.display = "block";
        $("stick").style.left = `${x - 64}px`;
        $("stick").style.top = `${y - 64}px`;
        $("stick-knob").style.left = `${x - 26}px`;
        $("stick-knob").style.top = `${y - 26}px`;
      };
      const updateStickFromPoint = (x, y) => {
        let dx = x - joystick.ox, dy = y - joystick.oy, d = Math.hypot(dx, dy);
        if (d > 48) { dx = dx / d * 48; dy = dy / d * 48; }
        joystick.x = dx / 48;
        joystick.y = dy / 48;
        $("stick-knob").style.left = `${joystick.ox + dx - 26}px`;
        $("stick-knob").style.top = `${joystick.oy + dy - 26}px`;
      };
      const releaseJoystick = (id = null) => {
        if (!joystick.active || (id !== null && id !== joystick.id)) return;
        joystick.active = false;
        joystick.id = null;
        joystick.x = joystick.y = 0;
        $("stick").style.display = "none";
        $("stick-knob").style.display = "none";
      };
      canvas.addEventListener("pointermove", (e) => {
        pointerPositions.set(e.pointerId, { x: e.clientX, y: e.clientY });
        // Preserve the latest mouse location even when the trigger is not
        // held. Cursor-target mode can then follow the real pointer instead
        // of using the initial (0, 0) sentinel.
        if (e.pointerType === "mouse" && !desktopFireHeld) {
          pointer.id = e.pointerId;
          pointer.x = e.clientX;
          pointer.y = e.clientY;
        }
        if (aimPointerIds.has(e.pointerId)) {
          pointer.id = e.pointerId;
          pointer.x = e.clientX;
          pointer.y = e.clientY;
        }
        if (joystick.active && e.pointerId === joystick.id) {
          updateStickFromPoint(e.clientX, e.clientY);
        }
      });
      canvas.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== undefined && e.button !== 0) return;
        unlockAudio();
        if (state !== "playing" || orientationHold) return;
        if (e.cancelable) e.preventDefault();
        try { canvas.setPointerCapture?.(e.pointerId); } catch (_) {}
        pointerPositions.set(e.pointerId, { x: e.clientX, y: e.clientY });
        const touchLike = isTouchPointer(e);
        const wantsMove = touchLike && e.clientX < W * .45 && !joystick.active;
        if (wantsMove) {
          joystick.active = true;
          joystick.id = e.pointerId;
          joystick.ox = e.clientX;
          joystick.oy = e.clientY;
          joystick.x = joystick.y = 0;
          setStickPosition(e.clientX, e.clientY);
        } else {
          aimPointerIds.add(e.pointerId);
          pointer.id = e.pointerId;
          pointer.x = e.clientX;
          pointer.y = e.clientY;
           if (!(typeof aimAssist !== "undefined" && aimAssist)) hardLockTarget ||= nearestEnemy();
           if (!touchLike) {
             desktopFireHeld = true;
             desktopFirePointerId = e.pointerId;
             syncPointerFire();
             if (!(typeof aimAssist !== "undefined" && aimAssist)) fire();
          } else {
            // Touch on the arena is aim-only. The trigger is the explicit
            // PRESS // FIRE button so movement and aiming fingers stay safe.
            syncPointerFire();
          }
        }
      });
      const endPointer = (e) => {
        if (!e) {
          clearInput();
          return;
        }
        const id = e.pointerId;
        if (id === desktopFirePointerId || e.pointerType === "mouse") {
          desktopFireHeld = false;
          desktopFirePointerId = null;
        }
        releaseJoystick(id);
        aimPointerIds.delete(id);
        pointerPositions.delete(id);
        if (pointer.id === id) {
          const nextId = [...aimPointerIds].pop();
          const next = nextId === undefined ? null : pointerPositions.get(nextId);
          pointer.id = nextId === undefined ? null : nextId;
          if (next) { pointer.x = next.x; pointer.y = next.y; }
        }
        syncPointerFire();
      };
      window.addEventListener("pointerup", endPointer);
      window.addEventListener("pointercancel", endPointer);
      canvas.addEventListener("lostpointercapture", endPointer);
      window.addEventListener("blur", clearInput);
      document.addEventListener("visibilitychange", () => { if (document.hidden) clearInput(); });
      window.addEventListener("resize", resize);
      window.addEventListener("orientationchange", () => { window.setTimeout(updateOrientationGuard, 80); });
      // Older Safari/WebViews and embedded browsers may not expose Pointer
      // Events even though they still support mouse and touch input. Keep a
      // small compatibility path without double-binding modern browsers.
      if (typeof window.PointerEvent !== "function") {
        canvas.addEventListener("mousemove", (e) => {
          pointer.id = "mouse";
          pointerPositions.set("mouse", { x: e.clientX, y: e.clientY });
          pointer.x = e.clientX;
          pointer.y = e.clientY;
        });
        canvas.addEventListener("mousedown", (e) => {
          if (e.button !== undefined && e.button !== 0) return;
          unlockAudio();
          if (state !== "playing" || orientationHold) return;
          pointerPositions.set("mouse", { x: e.clientX, y: e.clientY });
          aimPointerIds.add("mouse");
          pointer.id = "mouse";
          pointer.x = e.clientX;
          pointer.y = e.clientY;
           desktopFireHeld = true;
           desktopFirePointerId = "mouse";
           syncPointerFire();
           if (!(typeof aimAssist !== "undefined" && aimAssist)) hardLockTarget ||= nearestEnemy();
           if (!(typeof aimAssist !== "undefined" && aimAssist)) fire();
        });
        window.addEventListener("mouseup", () => endPointer({ pointerId: "mouse" }));
        canvas.addEventListener("touchstart", (e) => {
          e.preventDefault();
          unlockAudio();
          if (state !== "playing" || orientationHold) return;
          for (const touch of Array.from(e.changedTouches || [])) {
            const id = `touch:${touch.identifier}`;
            pointerPositions.set(id, { x: touch.clientX, y: touch.clientY });
            const wantsMove = touch.clientX < W * .45 && !joystick.active;
            if (wantsMove) {
              legacyTouchRoles.set(id, "joystick");
              joystick.active = true; joystick.id = id; joystick.ox = touch.clientX; joystick.oy = touch.clientY; joystick.x = joystick.y = 0;
              setStickPosition(touch.clientX, touch.clientY);
            } else {
              legacyTouchRoles.set(id, "aim");
              aimPointerIds.add(id);
              pointer.id = id; pointer.x = touch.clientX; pointer.y = touch.clientY;
               if (!(typeof aimAssist !== "undefined" && aimAssist)) hardLockTarget ||= nearestEnemy();
              syncPointerFire();
            }
          }
        }, { passive: false });
        canvas.addEventListener("touchmove", (e) => {
          e.preventDefault();
          for (const touch of Array.from(e.changedTouches || [])) {
            const id = `touch:${touch.identifier}`;
            pointerPositions.set(id, { x: touch.clientX, y: touch.clientY });
            if (legacyTouchRoles.get(id) === "joystick" && joystick.active && id === joystick.id) {
              updateStickFromPoint(touch.clientX, touch.clientY);
            } else if (legacyTouchRoles.get(id) === "aim" && aimPointerIds.has(id)) {
              pointer.id = id;
              pointer.x = touch.clientX;
              pointer.y = touch.clientY;
            }
          }
        }, { passive: false });
        const endLegacyTouch = (e) => {
          e.preventDefault();
          for (const touch of Array.from(e.changedTouches || [])) {
            const id = `touch:${touch.identifier}`;
            legacyTouchRoles.delete(id);
            endPointer({ pointerId: id });
          }
        };
        canvas.addEventListener("touchend", endLegacyTouch, { passive: false });
        canvas.addEventListener("touchcancel", endLegacyTouch, { passive: false });
      }
      orientationBtn?.addEventListener("click", () => {
        requestLandscapeMode(true);
        updateOrientationGuard();
      });
      $("startBtn").addEventListener("click", startSequence); $("deployBtn").addEventListener("click", deploy); $("backBtn").addEventListener("click", () => { setLayer(briefing, false); setLayer(menu, true); state = "menu"; renderRunSaveUiHook?.(); }); $("resumeBtn").addEventListener("click", resumeRun); $("pauseBtn")?.addEventListener("click", pauseRun); $("lockStatus")?.addEventListener("click", cycleTarget); $("restartBtn").addEventListener("click", () => { clearRunSaveHook?.(); setLayer(gameover, false); setLayer(levelup, false); setLayer(briefing, true); state = "briefing"; }); $("menuBtn")?.addEventListener("click", exitToMenu); $("easterEggBtn")?.addEventListener("click", openEasterEggArchive); $("closeEasterBtn")?.addEventListener("click", closeEasterEggArchive); $("resumeSavedBtn")?.addEventListener("click", () => resumeSavedRunHook?.()); $("discardSavedBtn")?.addEventListener("click", () => { clearRunSaveHook?.(); toast(translate("checkpointDiscarded"), 1500); }); shop.addEventListener("click", (e) => { if (e.target === shop) continueWave(); });
      $("leaderboardBtn")?.addEventListener("click", () => openLeaderboardPanel?.());
      $("gameoverLeaderboardBtn")?.addEventListener("click", () => openLeaderboardPanel?.());
      $("closeLeaderboardBtn")?.addEventListener("click", () => closeLeaderboardPanel?.());
      $("refreshLeaderboardBtn")?.addEventListener("click", () => {
        buttonTone(480, .07, "triangle", .02);
        void refreshLeaderboardPanel?.();
      });
      $("notifyLeaderboardBtn")?.addEventListener("click", () => { void enableLeaderboardNotificationsPanel?.(); });
      $("saveLeaderboardProfileBtn")?.addEventListener("click", () => saveLeaderboardProfilePanel?.());
      $("clearLeaderboardProfileBtn")?.addEventListener("click", () => clearLeaderboardProfilePanel?.());
      leaderboard?.addEventListener("click", (event) => {
        if (event.target === leaderboard) closeLeaderboardPanel?.();
      });
      $("tutorialBtn")?.addEventListener("click", () => openTutorial(true));
      $("tutorialClose")?.addEventListener("click", () => closeTutorial(true));
      $("tutorialSkip")?.addEventListener("click", () => closeTutorial(true));
      $("tutorialBack")?.addEventListener("click", () => {
        if (tutorialIndex > 0) { tutorialIndex--; renderTutorialStep(); buttonTone(300, .06, "sine", .018); }
      });
      $("tutorialNext")?.addEventListener("click", () => {
        const steps = localeValue("tutorialSteps", LOCALES.en.tutorialSteps);
        if (tutorialIndex >= steps.length - 1) closeTutorial(true);
        else { tutorialIndex++; renderTutorialStep(); buttonTone(520, .07, "triangle", .02); }
      });
      $("tutorial")?.addEventListener("click", (event) => {
        if (event.target === $("tutorial")) closeTutorial(true);
      });
      ["languageSelect", "pauseLanguageSelect"].forEach((id) => {
        $(id)?.addEventListener("change", (event) => setLocale(event.target.value));
      });
      $("touchGuideClose")?.addEventListener("click", () => {
        $("touchGuide")?.classList.remove("show");
        clearTimeout(touchGuideTimer);
      });

/* ===== 60-combat-expansion.js ===== */
// SIGNAL RUN // COMBAT EXPANSION PATCH
      // Defer the hot-swap layer until the IIFE has finished initializing.
      // This keeps the original function bindings out of the temporal-dead-zone
      // while preserving the same runtime hooks for the game loop and controls.
      deferMicrotask(() => {
      let v3Boss = null;
      let v3BlastRings = [];
      let v3SpawnBurstTimer = 0;
      let v3DashCharges = 10;
      let v3DashMax = 10;
      let v3DashRecharge = 0;
      let v3Readout = "";
      let v3ReadoutTimer = 0;
      function dashEnergyCost() {
        // Mobility upgrades make the chain more efficient without removing
        // the resource decision entirely.
        return Math.max(7, DASH_ENERGY_COST - (Number(upgradeLevels.dashStack) || 0) * .6);
      }
      function dashCooldown() {
        return Math.max(.09, DASH_COOLDOWN - (Number(upgradeLevels.overdrive) || 0) * .015);
      }
      function dashDistance() {
        // Preserve a readable on-screen escape length after the camera pulls
        // back, without allowing a single tap to teleport across the arena.
        // Use the real camera scale all the way down to the mobile floor so a
        // dash does not become a tiny nudge at the widest view.
        return DASH_DISTANCE * clamp(MOBILE_ZOOM_REFERENCE / Math.max(MOBILE_ZOOM_MIN, viewportZoom()), .9, 14.5);
      }
      function movementVector() {
        let x = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
        let y = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
        if (joystick.active) { x += joystick.x; y += joystick.y; }
        if (gamepadInput.active) { x += gamepadInput.moveX; y += gamepadInput.moveY; }
        const magnitude = Math.hypot(x, y);
        if (magnitude < .14) return null;
        return { x: x / magnitude, y: y / magnitude };
      }
      function dashAngle() {
        const move = movementVector();
        if (move) {
          if (frontierEvent.key === "reverseFlow" && frontierEvent.timer > 0) {
            move.x *= -1;
            move.y *= -1;
          }
          return Math.atan2(move.y, move.x);
        }
        return aimAngle();
      }
      function dashBudget() {
        return Math.max(0, Math.floor(player.energy / dashEnergyCost()));
      }
      function syncDashBudget() {
        v3DashMax = Math.max(v3DashMax, Math.ceil(player.maxEnergy / dashEnergyCost()));
        v3DashCharges = dashBudget();
      }
      const v3SeenTypes = new Set();
      const v3BossProfiles = {
        lock: { name: "THE LOCKOUT", title: "THE BUTTON REMEMBERS", color: "#ffffff", hp: 1800, speed: 42, pattern: "ring", lore: "It does not hate you. It only remembers the halt." },
        clearing: { name: "CLEARING HOUSE", title: "COLLATERAL CALL", color: "#ff9d4d", hp: 2400, speed: 34, pattern: "barrage", lore: "Every shot is a margin requirement." },
        oracle: { name: "THE ORACLE", title: "THE LAST QUOTE", color: CYAN, hp: 3050, speed: 58, pattern: "orbit", lore: "It predicts your dodge, then taxes it." },
        robin: { name: "ROBIN PRIME", title: "HOOD OF THE VOID", color: VIOLET, hp: 3700, speed: 52, pattern: "summon", lore: "The mascot became the message." },
        scammer: { name: "SCAMMER", title: "COUNTERFEIT SIGNAL", color: "#ff426d", hp: 2850, speed: 58, pattern: "scammer", lore: "Every quote is bait. Every receipt can lie." }
      };
      const bossAffixDefs = [
        { key: "overclocked", name: "OVERCLOCKED", tag: "RAPID FIRE", color: ACID, hp: .92, speed: 1.22, cadence: .68, reward: 1.1 },
        { key: "fortified", name: "FORTIFIED", tag: "ARMORED CORE", color: VIOLET, hp: 1.28, speed: .84, cadence: 1.08, reward: 1.24 },
        { key: "phaseShift", name: "PHASE SHIFT", tag: "TELEPORT ROUTE", color: CYAN, hp: 1.04, speed: 1.04, cadence: .84, reward: 1.18 },
        { key: "redline", name: "REDLINE", tag: "NO MERCY", color: HOT, hp: 1.08, speed: 1.16, cadence: .78, damage: 1.18, reward: 1.3 }
      ];
      const runMutatorDefs = [
        { key: "rushHour", name: "RUSH HOUR", tag: "SPEED CONTRACT", color: HOT, desc: "Hostiles route 18% faster; the score market pays a premium.", enemySpeed: 1.18, scoreMultiplier: 1.14, coinMultiplier: .9, spawnMultiplier: 1.04 },
        { key: "thinIce", name: "THIN ICE", tag: "FRAGILE SIGNAL", color: VIOLET, desc: "Incoming damage rises, but every cache is worth more.", damageTaken: 1.22, scoreMultiplier: 1.16, coinMultiplier: 1.12, spawnMultiplier: .96 },
        { key: "doubleExposure", name: "DOUBLE EXPOSURE", tag: "HEAVY BOOK", color: CYAN, desc: "More bodies and thicker elites flood the frontier for a huge score edge.", enemyHp: 1.12, bossHp: 1.1, scoreMultiplier: 1.27, coinMultiplier: 1.04, spawnMultiplier: 1.2 },
        { key: "quietSignal", name: "QUIET SIGNAL", tag: "PRECISION RUN", color: ACID, desc: "Fewer hostiles, tighter routes, and a high-value precision payout.", enemySpeed: .92, scoreMultiplier: 1.31, coinMultiplier: 1.18, spawnMultiplier: .82 },
        { key: "redLedger", name: "RED LEDGER", tag: "VOLATILE BOOK", color: "#ff9d4d", desc: "The frontier reconfigures faster; missed shots leave no room to breathe.", enemySpeed: 1.08, enemyHp: 1.06, damageTaken: 1.08, scoreMultiplier: 1.2, coinMultiplier: .98, spawnMultiplier: 1.08 }
      ];
      const waveContractDefs = [
        { key: "stampede", name: "STAMPEDE", tag: "SWARM ROUTE", color: "#ffd86a", desc: "Fast bodies fill the lanes.", spawnMultiplier: 1.16, enemySpeed: 1.1, enemyHp: .9, scoreMultiplier: 1.08 },
        { key: "fortress", name: "FORTRESS BOOK", tag: "ARMORED ROUTE", color: VIOLET, desc: "Fewer targets, but every target is a wall.", spawnMultiplier: .82, enemySpeed: .84, enemyHp: 1.34, scoreMultiplier: 1.25, bossHp: 1.14 },
        { key: "mirrorPool", name: "MIRROR POOL", tag: "DUPLICATE ROUTE", color: CYAN, desc: "Copies and orbiters get priority.", spawnMultiplier: 1.04, enemySpeed: 1.02, enemyHp: 1.02, scoreMultiplier: 1.12 },
        { key: "liquidation", name: "LIQUIDATION", tag: "NO COVER", color: HOT, desc: "The book is dense and every collision hurts more.", spawnMultiplier: 1.08, enemySpeed: 1.12, enemyHp: 1, damageTaken: 1.14, scoreMultiplier: 1.18 },
        { key: "blueChip", name: "BLUE CHIP", tag: "CONTROLLED FLOW", color: "#8cf7d4", desc: "A calmer route that rewards clean streaks.", spawnMultiplier: .92, enemySpeed: .96, enemyHp: 1.08, scoreMultiplier: 1.2, coinMultiplier: 1.1 }
      ];
      let activeRunMutator = null;
      let activeWaveContract = null;
      let lastRunMutatorKey = "";
      let lastWaveContractKey = "";
      let lastBossAffixKey = "";
      let runSeed = 0;
      let bossRewardTimer = 0;
      let scammerWave = 0;
      let scammerSpawnedThisRun = false;

      function scammerBossChance(nextWave) {
        // A rare, run-limited encounter keeps the reveal special without
        // making the normal boss rotation feel mandatory.
        return clamp(.11 + Math.min(.12, nextWave * .012), .11, .23);
      }

      function chooseRunMutator() {
        const pool = runMutatorDefs.filter((item) => item.key !== lastRunMutatorKey);
        activeRunMutator = (pool.length ? pool : runMutatorDefs)[Math.floor(Math.random() * (pool.length || runMutatorDefs.length))];
        lastRunMutatorKey = activeRunMutator.key;
        runSeed = Math.floor(Math.random() * 0x7fffffff);
      }

      function chooseWaveContract(nextWave) {
        const pool = waveContractDefs.filter((item) => item.key !== lastWaveContractKey);
        activeWaveContract = (pool.length ? pool : waveContractDefs)[Math.floor(Math.random() * (pool.length || waveContractDefs.length))];
        lastWaveContractKey = activeWaveContract.key;
        if (nextWave > 1 && activeWaveContract.key === "fortress" && nextWave % 5 === 0) {
          activeWaveContract = waveContractDefs.find((item) => item.key === "blueChip") || activeWaveContract;
          lastWaveContractKey = activeWaveContract.key;
        }
      }

      function chooseBossAffix() {
        const pool = bossAffixDefs.filter((item) => item.key !== lastBossAffixKey);
        const affix = (pool.length ? pool : bossAffixDefs)[Math.floor(Math.random() * (pool.length || bossAffixDefs.length))];
        lastBossAffixKey = affix.key;
        return affix;
      }

      function contractNameLine() {
        if (!activeRunMutator) return "";
        const runLabel = runtimeText("ui.run", "RUN");
        const waveLabel = runtimeText("ui.wave", "WAVE");
        const mutatorName = localizedMutatorField(activeRunMutator, "name", activeRunMutator.name);
        const contractName = activeWaveContract
          ? localizedContractField(activeWaveContract, "name", activeWaveContract.name)
          : translate("openBook");
        return `${runLabel} // ${mutatorName} / ${waveLabel} // ${contractName}`;
      }

      function playerCombatPower() {
        const weapon = weaponProfile(player.weapon) || weapons[0];
        const pellets = Math.max(1, Number(weapon.pellets) || 1) * .78;
        const blast = Math.max(0, Number(weapon.explosive) || 0) * .34;
        const cadence = Math.max(.12, Number(weapon.cooldown) || .12);
        const dps = (Math.max(0, Number(weapon.damage) || 0) * pellets + blast)
          * Math.max(1, Number(player.damage) || 1)
          * Math.max(1, Number(player.fireRate) || 1) / cadence;
        const levelPressure = Math.max(0, (Number(player.level) || 1) - 1) * .012;
        return clamp(dps / 70 + levelPressure, .75, 5.5);
      }

      function bossAdaptiveScale() {
        return 1 + clamp((playerCombatPower() - 1) * .34, 0, BOSS_ADAPTIVE_HP_CAP - 1);
      }

      function bossRewardFor(enemy) {
        if (!enemy?.boss || enemy.rewardPaid) return;
        enemy.rewardPaid = true;
        const profile = getBossRewardProfile(enemy.bossKind);
        const waveScale = 1 + Math.max(0, wave - 5) * .045;
        const scoreScale = (activeRunMutator?.scoreMultiplier || 1) * (activeWaveContract?.scoreMultiplier || 1);
        const affixScale = enemy.bossAffix?.reward || 1;
        const scoreReward = Math.round(profile.score * profile.difficulty * waveScale * scoreScale * affixScale);
        const coinScale = (activeRunMutator?.coinMultiplier || 1) * (activeWaveContract?.coinMultiplier || 1);
        const coinReward = clamp(Math.round(profile.coins * waveScale * coinScale), 5, enemy.scammerBoss ? 48 : 30);
        const xpReward = Math.round(profile.xp * profile.difficulty * waveScale * Math.min(1.35, affixScale));
        score += scoreReward;
        coins += coinReward;
        gainXp(xpReward);
        pickup(enemy.x, enemy.y, "repair", Math.min(28, 8 + Math.round(profile.difficulty * 6)));
        const cacheName = localizedDefinitionKeyField("reward", enemy.bossKind, "cache", profile.cache);
        const affixName = localizedAffixField(enemy.bossAffix, "name", enemy.bossAffix?.name || translate("boss"));
        v3Readout = runtimeText("msg.bossRewardReadout", `${cacheName} // +${localeNumber(scoreReward)} SCORE // +${coinReward} VALUE`, {
          cache: cacheName,
          score: localeNumber(scoreReward),
          value: coinReward
        });
        v3ReadoutTimer = 4.2;
        bossRewardTimer = 4.2;
        $("bossPhaseText").textContent = `${translate("tier")} ${profile.tier} // ${affixName} // ${runtimeText("status.cacheSecured", "CACHE SECURED")}`;
        combatFlash(runtimeText("status.bossClear", `TIER ${profile.tier} BOSS CLEAR // +${localeNumber(scoreReward)}`, {
          tier: profile.tier,
          score: localeNumber(scoreReward)
        }), 1650);
        story(runtimeText("status.bossCache", `${cacheName} // TIER ${profile.tier} CLEARED.`, {
          cache: cacheName,
          tier: profile.tier
        }), 3.4);
        particle(enemy.x, enemy.y, profile.color, 48, 420);
        v3BlastRings.push({ x: enemy.x, y: enemy.y, r: 16, max: 190 + profile.difficulty * 48, life: 1.05, color: profile.color });
        shake = Math.max(shake, 24 + profile.difficulty * 8);
        arenaPulse = 1;
      }

      function scammerPayoutFor(enemy) {
        if (!enemy?.scammerBoss || enemy.scammerPayoutPaid) return;
        enemy.scammerPayoutPaid = true;
        const waveScale = 1 + Math.max(0, wave - 3) * .06;
        const coinScale = (activeRunMutator?.coinMultiplier || 1) * (activeWaveContract?.coinMultiplier || 1);
        const jackpot = clamp(Math.round((72 + wave * 9) * waveScale * coinScale), 72, 240);
        const visibleShard = Math.max(8, Math.round(jackpot * .14));
        coins += jackpot;
        score += Math.round(jackpot * 4.2);
        pickup(enemy.x - 24, enemy.y, "coin", visibleShard);
        pickup(enemy.x + 24, enemy.y, "coin", visibleShard);
        v3Readout = runtimeText("status.scammerPayoutLine", `SCAMMER PAYOUT // +${jackpot} COINS // COUNTERFEIT RECOVERED`, { amount: localeNumber(jackpot) });
        v3ReadoutTimer = 5.2;
        bossRewardTimer = 5.2;
        $("bossPhaseText").textContent = runtimeText("status.scammerWallet", `TIER X // JACKPOT +${jackpot} // WALLET SECURED`, { amount: localeNumber(jackpot) });
        combatFlash(runtimeText("status.scammerPayoutLine", `SCAMMER PAYOUT // +${jackpot} COINS // COUNTERFEIT RECOVERED`, { amount: localeNumber(jackpot) }), 1900);
        story(runtimeText("status.scammerCache", `COUNTERFEIT CACHE // +${jackpot} COINS RECOVERED.`, { amount: localeNumber(jackpot) }), 4.2);
        particle(enemy.x, enemy.y, "#ff426d", 64, 480);
        v3BlastRings.push({ x: enemy.x, y: enemy.y, r: 20, max: 250, life: 1.25, color: "#ff426d" });
        shake = Math.max(shake, 32);
      }

      function mutatorKillBonus(enemy) {
        if (!enemy || enemy.boss) return;
        const scale = Math.max(1, (activeRunMutator?.scoreMultiplier || 1) * (activeWaveContract?.scoreMultiplier || 1));
        if (scale <= 1) return;
        score += Math.min(24, Math.max(1, Math.round((enemy.value || 2) * 4 * (scale - 1))));
      }

      function applySpawnContract(enemy, isBoss = false) {
        if (!enemy) return;
        const run = activeRunMutator || {};
        const contract = activeWaveContract || {};
        if (enemy.contractApplied) return;
        enemy.contractApplied = true;
        if (isBoss) {
          const hpScale = (run.bossHp || 1) * (contract.bossHp || 1);
          enemy.hp *= hpScale;
          enemy.maxHp = enemy.hp;
          enemy.speed *= contract.bossSpeed || 1;
          return;
        }
        enemy.speed *= (run.enemySpeed || 1) * (contract.enemySpeed || 1);
        enemy.hp *= (run.enemyHp || 1) * (contract.enemyHp || 1);
        enemy.maxHp = enemy.hp;
        enemy.value = clamp(Math.round((enemy.value || 2) * (run.coinMultiplier || 1) * (contract.coinMultiplier || 1)), 2, 48);
      }

      const contractHurt = hurt;
      hurt = function(amount) {
        if (state !== "playing") return;
        if (eggPowerActive("hood") && eggRuntime.hoodCloak > 0 && Math.random() < .38) {
          eggRuntime.hoodCloak = Math.max(0, eggRuntime.hoodCloak - .35);
          combatFlash(runtimeText("msg.hoodPhase", "HOOD SHIFT // HIT PHASED"), 700);
          particle(player.x, player.y, eggPowerDefs.hood.color, 18, 260);
          return;
        }
        const scale = (activeRunMutator?.damageTaken || 1) * (activeWaveContract?.damageTaken || 1);
        contractHurt(amount * scale);
      };
      Object.assign(enemyTypes, {
        mirror: { name: "MIRROR", color: "#8cf7d4", hp: 55, speed: 90, r: 14, touch: 20, value: 22, ranged: true, orbit: true, lore: "It copies the last direction you trusted." },
        splitter: { name: "SPLITTER", color: "#ff6be8", hp: 95, speed: 52, r: 23, touch: 29, value: 25, split: true, lore: "Break it and two markets appear." },
        swarm: { name: "SWARM", color: "#ffd86a", hp: 12, speed: 190, r: 8, touch: 11, value: 4, lore: "A thousand tiny yeses." },
        pulse: { name: "PULSE", color: "#65a7ff", hp: 80, speed: 46, r: 18, touch: 24, value: 24, ranged: true, pulse: true, lore: "It weaponizes the heartbeat of the chain." },
        leech: { name: "LEECH", color: "#9dff72", hp: 48, speed: 104, r: 12, touch: 19, value: 18, drain: true, lore: "It steals your momentum one frame at a time." },
        warden: { name: "WARDEN", color: "#cbb7ff", hp: 180, speed: 38, r: 29, touch: 38, value: 42, elite: true, ranged: true, lore: "A living permission check." }
      });
      enemyTypes.drone.speed = 82;
      enemyTypes.sprint.speed = 160;
      enemyTypes.vault.speed = 58;
      enemyTypes.broker.speed = 64;
      enemyTypes.hunter.speed = 96;
      enemyTypes.lock.speed = 46;

      const v3ResetRun = resetRun;
      const v3StartWave = startWave;
      const v3ChooseType = chooseType;
      const v3SpawnEnemy = spawnEnemy;
      const v3Fire = fire;
      const v3Detonate = detonate;
      const v3Activate = activate;
      const v3KillEnemy = killEnemy;
      const v3Update = update;
      const v3SyncHud = syncHud;
      const v3DrawWorld = drawWorld;

      function v3Say(message, duration = 2.6) {
        v3Readout = message;
        v3ReadoutTimer = duration;
        story(message, duration);
      }

      function v3BossKey() {
        return ["lock", "clearing", "oracle", "robin"][Math.max(0, Math.floor(wave / 5) - 1) % 4];
      }

      resetRun = function() {
        clearRunSave();
        runSaveEntityIdCounter = 1;
        v3ResetRun();
        v3Boss = null;
        v3BlastRings.length = 0;
        v3SpawnBurstTimer = 0;
        scammerWave = 0;
        scammerSpawnedThisRun = false;
        legendaryKillsThisRun = 0;
        lastLegendaryAnchor = null;
        v3DashMax = Math.max(10, Math.ceil(player.maxEnergy / dashEnergyCost()));
        v3DashCharges = dashBudget();
        v3DashRecharge = 0;
        v3Readout = "";
        v3ReadoutTimer = 0;
        v3SeenTypes.clear();
        player.speed = compactDevice ? 270 : 315;
        player.range = compactDevice ? 680 : 720;
        chooseRunMutator();
        chooseWaveContract(1);
        $("runMutatorText").textContent = contractNameLine();
      };

      startWave = function(next) {
        v3StartWave(next);
        v3Boss = null;
      };

      chooseType = function() {
        const pool = ["drone", "drone", "sprint", "swarm"];
        if (wave >= 2) pool.push("sprint", "leech", "swarm");
        if (wave >= 3) pool.push("vault", "splitter");
        if (wave >= 4) pool.push("broker", "mirror");
        if (wave >= 5) pool.push("pulse", "warden");
        if (wave >= 6) pool.push("hunter", "splitter", "mirror");
        if (wave >= 8) pool.push("warden", "pulse", "leech");
        if (frontierEvent.key === "mirrorTrade" && frontierEvent.timer > 0) pool.push("mirror", "mirror", "sprint");
        if (activeWaveContract?.key === "stampede") pool.push("swarm", "swarm", "sprint", "sprint");
        if (activeWaveContract?.key === "fortress") pool.push("vault", "warden", "lock", "vault");
        if (activeWaveContract?.key === "mirrorPool") pool.push("mirror", "mirror", "mirror", "broker");
        if (activeWaveContract?.key === "liquidation") pool.push("hunter", "pulse", "leech", "warden");
        if (activeWaveContract?.key === "blueChip") pool.push("drone", "broker", "mirror");
        return pool[Math.floor(Math.random() * pool.length)];
      };

      spawnEnemy = function() {
        if (enemies.length >= MAX_ENEMIES) return;
        const bossSpawn = bossAlive && waveRemaining === 1;
        const before = enemies.length;
        v3SpawnEnemy();
        const e = enemies.length > before ? enemies[enemies.length - 1] : null;
        if (!e) return;
        e.knockX = 0;
        e.knockY = 0;
        e.stun = 0;
        e.bossTimer = rand(.6, 1.4);
        const archetype = enemyTypes[e.type] || {};
        e.split = !!archetype.split;
        e.orbit = !!archetype.orbit;
        e.pulse = !!archetype.pulse;
        e.drain = !!archetype.drain;
        e.splitDone = false;
        if (!bossSpawn) {
          const entryAngle = Math.atan2(e.y - player.y, e.x - player.x);
          const entryRadius = enemyEntryRadius(0, entryAngle);
          e.x = player.x + Math.cos(entryAngle) * entryRadius;
          e.y = player.y + Math.sin(entryAngle) * entryRadius;
        }
        if (bossSpawn) {
          const scammerSpawn = scammerWave === wave;
          const bossKey = scammerSpawn ? "scammer" : v3BossKey();
          const profile = v3BossProfiles[bossKey];
          const affix = chooseBossAffix();
          e.boss = true;
          e.bossKind = bossKey;
          e.bossAffix = affix;
          e.bossName = profile.name;
          e.bossPattern = profile.pattern;
          e.bossLore = profile.lore;
          e.type = "lock";
          e.r = scammerSpawn ? 56 : 52;
          e.challengeScale = bossAdaptiveScale();
          e.hp = profile.hp
            * (1 + Math.max(0, wave - 5) * .18)
            * e.challengeScale
            * (affix.hp || 1);
          e.maxHp = e.hp;
          e.speed = profile.speed * (1 + wave * .018) * (affix.speed || 1);
          // Bosses should feel rewarding without flooding the economy.  Keep
          // the payout meaningful, but cap it so a single kill cannot fund an
          // entire shop rotation.
          e.value = Math.min(72, Math.round(e.value * 2.2));
          e.elite = true;
          e.phase = 0;
          e.bossAngle = 0;
          const powerPressure = Math.max(0, e.challengeScale - 1);
          e.bossCadenceScale = (affix.cadence || 1) * clamp(1 - powerPressure * .06, .84, 1);
          e.bossDamageScale = (affix.damage || 1) * (1 + Math.min(.12, powerPressure * .12));
          e.affixTimer = rand(2.2, 4.1);
          e.armorTimer = 0;
          e.shiftFlash = 0;
          e.guardTimer = rand(2.8, 4.2);
          e.guardWindow = 0;
          e.rewardPaid = false;
          e.scammerBoss = scammerSpawn;
          e.scammerPatternTimer = scammerSpawn ? rand(1.05, 1.65) : 0;
          e.scammerGlitchTimer = scammerSpawn ? rand(3.1, 4.7) : 0;
          e.scammerTeleportCooldown = scammerSpawn ? rand(1.8, 2.8) : 0;
          e.scammerShieldTimer = 0;
          e.scammerAttackIndex = 0;
          e.scammerPayoutPaid = false;
          applySpawnContract(e, true);
          v3Boss = e;
          $("bossHud").classList.add("show");
          const bossNameLabel = localizedBossField(bossKey, "name", profile.name);
          const affixNameLabel = localizedAffixField(affix, "name", affix.name);
          $("bossNameText").textContent = scammerSpawn
            ? `${bossNameLabel} // ${affixNameLabel}`
            : `${bossNameLabel} // ${affixNameLabel}`;
          const reward = getBossRewardProfile(e.bossKind);
          $("bossPhaseText").textContent = runtimeText("msg.bossPhase", `${translate("tier")} ${reward.tier} // ${affixNameLabel} // ${translate("phase")} 1`, {
            tier: `${translate("tier")} ${reward.tier}`,
            affix: affixNameLabel
          });
           const bossLore = localizedBossField(bossKey, "lore", profile.lore);
           v3Say(runtimeText("msg.bossIntro", `${bossNameLabel} // ${affixNameLabel} // ${bossLore}`, {
             name: bossNameLabel,
             title: `${affixNameLabel} // ${bossLore}`
           }), 4.8);
         } else {
          applySpawnContract(e, false);
          if (!v3SeenTypes.has(e.type)) {
          v3SeenTypes.add(e.type);
           const lore = localizedEnemyLore(e.type, enemyTypes[e.type]?.lore || "");
           if (lore) v3Say(`${localizedEnemyName(e, enemyTypes[e.type]?.name || translate("threatLabel"))} // ${lore}`, 2.8);
          }
        }
      };

      fire = function() {
        if (orientationHold) return;
        const before = bullets.length;
        v3Fire();
        for (let i = before; i < bullets.length; i++) {
          bullets[i].traveled = 0;
          const rangeCap = projectileRangeLimit();
          bullets[i].maxTravel = Math.min(bullets[i].maxTravel || rangeCap, rangeCap);
          const rangeLife = bullets[i].maxTravel / Math.max(1, bullets[i].speed || 1);
          bullets[i].life = bullets[i].returning
            ? Math.min(3.8, Math.max(bullets[i].life || 2.8, rangeLife + (bullets[i].returnDistance || 0) / Math.max(1, bullets[i].speed || 1) * 1.2))
            : Math.min(bullets[i].life || 2.8, rangeLife);
          bullets[i].weapon = bullets[i].weapon || weapons[player.weapon]?.key;
          bullets[i].color = weapons[player.weapon]?.color || bullets[i].color;
        }
      };

      detonate = function(x, y, radius, damage, color = HOT) {
        const blastRadius = radius * 1.48;
        v3BlastRings.push({ x, y, r: 18, max: blastRadius, life: .82, color });
        particle(x, y, color, 86, 520);
        particle(x, y, "#fff7c2", 30, 290);
        flash = Math.max(flash, .32);
        shake = Math.max(shake, 28);
        arenaPulse = .7;
        if (explosionSoundCooldown <= 0) {
          explosionTone(150, .28, "sawtooth", .055);
          explosionSoundCooldown = .08;
        }
        for (const e of enemies) if (e.alive) {
          const dx = e.x - x, dy = e.y - y, d = Math.hypot(dx, dy) || 1;
          if (d < blastRadius + e.r) {
            const falloff = 1 - Math.min(1, d / (blastRadius + e.r)) * .48;
            // Bosses absorb almost all blast displacement. The damage still
            // lands, but a Margin Call cannot punt a boss across the map and
            // trigger a visible rescue/respawn.
            const knockbackResistance = e.boss ? .055 : e.elite ? .46 : 1;
            const impulseX = (e.knockX || 0) + dx / d * (ENEMY_KNOCKBACK_SPEED * falloff * knockbackResistance);
            const impulseY = (e.knockY || 0) + dy / d * (ENEMY_KNOCKBACK_SPEED * falloff * knockbackResistance);
            const impulseMagnitude = Math.hypot(impulseX, impulseY) || 1;
            const impulseScale = Math.min(1, ENEMY_KNOCKBACK_CAP / impulseMagnitude);
            e.knockX = impulseX * impulseScale;
            e.knockY = impulseY * impulseScale;
            e.stun = Math.max(e.stun || 0, (.75 + falloff * .9) * (e.boss ? .09 : e.elite ? .45 : 1));
            // Route blast damage through the same wrapper as bullets. This
            // keeps critical hits, boss armor/phase windows, XP, combo and
            // reward accounting consistent for every source of damage.
            hitEnemy(e, damage * 1.55 * falloff, { color });
          }
        }
      };

      activate = function(name) {
        if (state !== "playing") return;
        if (name === "dash") {
          if (player.ability.dash > 0) return;
          const energyCost = dashEnergyCost();
          if (player.energy < energyCost) {
            toast(runtimeText("msg.dashEmpty", "DASH ENERGY EMPTY // recharge in motion"), 1100);
            return;
          }
          // When the stick/keyboard is already moving, dash follows that
          // vector. Otherwise it keeps the smart-target direction.
          const angle = dashAngle();
          playerFx.dashFlashUntil = nowMs() + 700;
          playerFx.dashAngle = angle;
          v3DashRecharge = 0;
          player.dash = DASH_DURATION;
          player.invuln = DASH_INVULN;
          player.ability.dash = dashCooldown();
          const distance = dashDistance();
          player.x += Math.cos(angle) * distance;
          player.y += Math.sin(angle) * distance;
          player.energy = clamp(player.energy - energyCost, 0, player.maxEnergy);
          syncDashBudget();
          particle(player.x, player.y, CYAN, 34, 420);
          v3BlastRings.push({ x: player.x, y: player.y, r: 20, max: 96, life: .36, color: CYAN });
          buttonTone(640, .09, "triangle", .04);
          if (frontierEvent.timer > 0 && wave >= 4 && legendaryKillsThisRun >= 1 && lastLegendaryAnchor) {
            spawnEasterEgg("gas", lastLegendaryAnchor.x, lastLegendaryAnchor.y, lastLegendaryAnchor);
          }
          triggerEggDashPower();
          syncHud();
          return;
        }
        if (name === "bomb") {
          if (player.ability.bomb > 0) return;
          player.ability.bomb = 6.5;
          playerFx.bombFlashUntil = nowMs() + 1000;
          player.energy = clamp(player.energy - 24, 0, player.maxEnergy);
          const angle = aimAngle();
          detonate(player.x + Math.cos(angle) * 160, player.y + Math.sin(angle) * 160, player.bombRadius * 1.25, 185 * player.damage, HOT);
          v3Say(runtimeText("msg.marginCall", "MARGIN CALL // the whole room just broke."), 2.6);
          syncHud();
          return;
        }
        v3Activate(name);
      };

      killEnemy = function(e) {
        const wasAlive = !!e?.alive;
        const shouldSplit = e.split && !e.splitDone;
        const wasBoss = e.boss;
        const legendaryAnchor = wasAlive && isLegendaryEnemy(e) ? rememberLegendaryAnchor(e) : null;
        v3KillEnemy(e);
        if (wasAlive && !e.alive && legendaryAnchor) {
          legendaryKillsThisRun++;
          lastLegendaryAnchor = legendaryAnchor;
          tryUnlockLegendaryEggs(legendaryAnchor);
        }
        if (shouldSplit) {
          e.splitDone = true;
          for (let i = 0; i < 2; i++) {
            const child = {
              alive: true, type: "swarm", x: e.x + rand(-18, 18), y: e.y + rand(-18, 18),
              r: enemyTypes.swarm.r, hp: enemyTypes.swarm.hp * (1 + wave * .12), maxHp: enemyTypes.swarm.hp * (1 + wave * .12),
              speed: enemyTypes.swarm.speed * (1 + wave * .02), touch: enemyTypes.swarm.touch, value: 4,
              ranged: false, shotTimer: 9, elite: false, hit: 0, phase: Math.random() * 6.28, knockX: 0, knockY: 0, stun: 0,
              contractApplied: false
            };
            applySpawnContract(child, false);
            enemies.push(child);
          }
          v3Say(runtimeText("msg.splitter", "SPLITTER // one position became two."), 1.8);
        }
        if (wasBoss) {
          v3Boss = null;
          $("bossHud").classList.remove("show");
          const closedName = localizedBossField(e.bossKind || "lock", "name", e.bossName || translate("boss"));
          v3Say(runtimeText("msg.signalClosedFor", `${closedName} // SIGNAL CLOSED`, { name: closedName }), 3.6);
          explosionTone(145, .5, "sawtooth", .06);
        }
      };

      const v3BuyUpgrade = buyUpgrade;
      upgrades.push(
        { key: "dashStack", title: "STACKED EXIT", icon: "»»", desc: "Adds dash battery and lowers its energy cost. Chain escapes through the swarm.", base: 75, max: 5 },
        { key: "magnet", title: "GRAVITY WELL", icon: "◎", desc: "Coins and repairs fly to you from farther away.", base: 52, max: 6 },
        { key: "overdrive", title: "OVERDRIVE CORE", icon: "✦", desc: "The whole kit accelerates: movement, fire and dash recovery.", base: 95, max: 6 }
      );
      upgradeLevels.dashStack = 0;
      upgradeLevels.magnet = 0;
      upgradeLevels.overdrive = 0;

      buyUpgrade = function(key, cost) {
        if (key === "dashStack") {
          if (coins < cost || upgradeLevels[key] >= 5) return;
          coins -= cost;
          upgradeLevels[key]++;
          v3DashMax++;
          player.maxEnergy += 8;
          player.energy = Math.min(player.maxEnergy, player.energy + 8);
          syncDashBudget();
            v3Say(runtimeText("msg.stackedExit", "STACKED EXIT // another way out just opened."), 2.1);
          $("shopCoins").textContent = Math.floor(coins);
          renderUpgrades();
          buttonTone(680, .12, "triangle", .03);
          return;
        }
        if (key === "magnet") {
          if (coins < cost || upgradeLevels[key] >= 6) return;
          coins -= cost;
          upgradeLevels[key]++;
          $("shopCoins").textContent = Math.floor(coins);
          renderUpgrades();
            toast(runtimeText("msg.gravityWell", "GRAVITY WELL ONLINE"), 1500);
          buttonTone(620, .1, "sine", .025);
          return;
        }
        if (key === "overdrive") {
          if (coins < cost || upgradeLevels[key] >= 6) return;
          coins -= cost;
          upgradeLevels[key]++;
          player.speed *= 1.08;
          player.fireRate = applySoftGrowth(player.fireRate, 1.08, PLAYER_FIRE_RATE_CAP);
          player.ability.dash = Math.min(player.ability.dash, .08);
          $("shopCoins").textContent = Math.floor(coins);
          renderUpgrades();
          toast(runtimeText("msg.overdrive", "OVERDRIVE CORE // latency collapsing"), 1600);
          buttonTone(850, .12, "square", .03);
          return;
        }
        v3BuyUpgrade(key, cost);
      };

      startWave = function(next) {
        v3StartWave(next);
        chooseWaveContract(next);
        const normalBossWave = !!bossAlive;
        scammerWave = !normalBossWave && !scammerSpawnedThisRun && next >= 3 && Math.random() < scammerBossChance(next)
          ? next
          : 0;
        const scammerBossWave = scammerWave === next;
        if (scammerBossWave) {
          scammerSpawnedThisRun = true;
          bossAlive = true;
        }
        const baseCount = (compactDevice
          ? 10 + Math.floor(wave * 2.7)
          : 12 + Math.floor(wave * 3.1)) + (normalBossWave || scammerBossWave ? 1 : 0);
        waveRemaining = clamp(
          Math.round(baseCount * (activeRunMutator?.spawnMultiplier || 1) * (activeWaveContract?.spawnMultiplier || 1)),
          compactDevice ? 8 : 8,
          compactDevice ? 46 : 52
        );
        // Start quickly enough to establish pressure, while keeping the first
        // two arrivals staggered so touch players can still read the arena.
        spawnTimer = compactDevice
          ? (next === 1 ? .34 : .42)
          : rand(.08, .22);
        v3SpawnBurstTimer = compactDevice
          ? (next === 1 ? .52 : .46)
          : .46;
        armFrontierEvent(next);
        v3Boss = null;
        $("bossHud").classList.remove("show");
        $("runMutatorText").textContent = contractNameLine();
        if (activeWaveContract) {
          const contractName = localizedContractField(activeWaveContract, "name", activeWaveContract.name);
          const contractDesc = localizedContractField(activeWaveContract, "desc", activeWaveContract.desc);
          v3Say(runtimeText("msg.contractIntro", `${contractName} // ${contractDesc}`, {
            name: contractName,
            desc: contractDesc
          }), 2.5);
          combatFlash(runtimeText("msg.contractActive", `${contractName} // CONTRACT ACTIVE`, { name: contractName }), 1000);
        }
        if (normalBossWave) {
          const bossKey = v3BossKey();
          const profile = v3BossProfiles[bossKey];
          const reward = getBossRewardProfile(bossKey);
          const bossName = localizedBossField(bossKey, "name", profile.name);
          const bossTitle = localizedBossField(bossKey, "title", profile.title);
          $("bossPhaseText").textContent = `${translate("tier")} ${reward.tier} // ${translate("phase")} 1`;
          v3Say(runtimeText("msg.bossIntro", `${bossName} // ${bossTitle}`, {
            name: bossName,
            title: bossTitle
          }), 4.5);
        }
        if (scammerBossWave) {
          const profile = v3BossProfiles.scammer;
          const scammerName = localizedBossField("scammer", "name", profile.name);
          const scammerTitle = localizedBossField("scammer", "title", profile.title);
          $("waveName").textContent = `${scammerName} // ${translate("bossLabel")}`;
          $("objectiveText").textContent = runtimeText("status.verifyEverything", "VERIFY EVERYTHING");
          $("bossPhaseText").textContent = runtimeText("msg.bossPhase", `${translate("tier")} X // ${scammerName} // ${translate("phase")} 1`, {
            tier: `${translate("tier")} X`,
            affix: scammerName
          });
          v3Say(runtimeText("msg.bossIntro", `${scammerName} // ${scammerTitle}`, {
            name: scammerName,
            title: scammerTitle
          }), 4.8);
          combatFlash(runtimeText("msg.scammerWaveIntro", `SCAMMER WAVE ${wave} // VERIFY EVERYTHING`, { wave }), 1750);
          haptic([18, 44, 18, 44, 18]);
        }
      };

      function v3ShootAt(x, y, angle, speed, damage, color = HOT, radius = 6, life = 5) {
        const scaledSpeed = speed * mobileProjectileScale() * zoomTempoScale();
        pushEnemyBullet({ x, y, vx: Math.cos(angle) * scaledSpeed, vy: Math.sin(angle) * scaledSpeed, r: radius, life, damage, color });
      }

      function v3RadialFire(x, y, count, speed, damage, color = HOT, phase = 0) {
        for (let i = 0; i < count; i++) v3ShootAt(x, y, phase + i * Math.PI * 2 / count, speed, damage, color, 5, 6);
        particle(x, y, color, Math.min(20, count), 180);
      }

      function spawnScammerDecoy(x, y, life = 3.6) {
        if (enemies.length >= MAX_ENEMIES - 2) return null;
        const mirror = enemyTypes.mirror || enemyTypes.drone;
        const hp = Math.max(24, mirror.hp * .52 + wave * 3.5);
        const decoy = {
          alive: true,
          type: "mirror",
          x, y,
          r: Math.max(10, mirror.r * .82),
          hp,
          maxHp: hp,
          speed: Math.max(82, mirror.speed * (1 + Math.min(.55, wave * .018))),
          touch: Math.max(10, mirror.touch * .58),
          value: 1,
          ranged: false,
          shotTimer: 9,
          elite: false,
          boss: false,
          legendary: false,
          hit: 0,
          phase: Math.random() * 6.28,
          knockX: 0,
          knockY: 0,
          stun: 0,
          orbit: false,
          pulse: false,
          drain: false,
          split: false,
          splitDone: true,
          contractApplied: true,
          scammerDecoy: true,
          decoyLife: life
        };
        enemies.push(decoy);
        v3BlastRings.push({ x, y, r: 8, max: 42, life: .34, color: "#8cf7d4" });
        return decoy;
      }

      function v3ScammerPattern(e, dt) {
        if (!e || !e.alive) return;
        const phase = e.hp / Math.max(1, e.maxHp) < .5 ? 2 : 1;
        e.scammerPatternTimer = (Number.isFinite(e.scammerPatternTimer) ? e.scammerPatternTimer : 1.3) - dt;
        e.scammerGlitchTimer = (Number.isFinite(e.scammerGlitchTimer) ? e.scammerGlitchTimer : 3.8) - dt;
        e.scammerTeleportCooldown = Math.max(0, (e.scammerTeleportCooldown || 0) - dt);
        e.scammerShieldTimer = Math.max(0, (e.scammerShieldTimer || 0) - dt);

        // The signature trick: the real body slips away, leaves readable
        // after-images, and briefly hardens. The rings and callout give the
        // player a reaction window instead of silently deleting a hit.
        if (e.scammerGlitchTimer <= 0 && e.scammerTeleportCooldown <= 0) {
          const previousX = e.x, previousY = e.y;
          const angle = Math.atan2(e.y - player.y, e.x - player.x) + Math.PI + rand(-.62, .62);
          const radius = enemyViewportShellRadius(angle, e, compactDevice ? 28 : 42);
          e.x = player.x + Math.cos(angle) * radius;
          e.y = player.y + Math.sin(angle) * radius;
          e.bbEntryRush = true;
          e.bbEntryGrace = Math.max(Number(e.bbEntryGrace) || 0, .62);
          e.scammerShieldTimer = phase === 2 ? .96 : .78;
          e.scammerGlitchTimer = phase === 2 ? 2.75 : 4.25;
          e.scammerTeleportCooldown = phase === 2 ? 1.55 : 2.15;
          e.scammerPatternTimer = Math.max(e.scammerPatternTimer, .55);
          const decoyCount = phase === 2 ? 3 : 2;
          for (let i = 0; i < decoyCount; i++) {
            spawnScammerDecoy(previousX + rand(-52, 52), previousY + rand(-52, 52), 2.45 + i * .35);
          }
          v3BlastRings.push({ x: previousX, y: previousY, r: 12, max: 118, life: .62, color: "#ff426d" });
          v3BlastRings.push({ x: e.x, y: e.y, r: 16, max: 142, life: .86, color: CYAN });
          particle(previousX, previousY, "#ff426d", 22, 260);
          particle(e.x, e.y, CYAN, 28, 300);
          v3Say(runtimeText("msg.scammerVerify", "SCAMMER // VERIFY THE TARGET"), 1.35);
          combatFlash(runtimeText("msg.glitchInvalid", "GLITCH // QUOTE INVALID"), 880);
        }

        if (e.scammerPatternTimer > 0) return;
        e.scammerAttackIndex = (e.scammerAttackIndex || 0) + 1;
        e.scammerPatternTimer = (phase === 2 ? 1.08 : 1.55) * (e.bossCadenceScale || 1);
        const base = Math.atan2(player.y - e.y, player.x - e.x);
        const attack = e.scammerAttackIndex % 4;
        const damage = (10 + wave * .7) * (e.bossDamageScale || 1);

        if (attack === 0) {
          // A narrow fan looks like a normal quote, then widens at the edge.
          for (let i = -2; i <= 2; i++) {
            v3ShootAt(e.x, e.y, base + i * .13, 278 + wave * 4, damage, "#ff426d", 6, 5.2);
          }
          v3Say(runtimeText("msg.scammerFlash", "SCAMMER // FLASH SALE"), 1.05);
        } else if (attack === 1) {
          // The ring has a deliberate escape gap, so the attack is harsh but
          // readable on a zoomed-out phone screen.
          const count = phase === 2 ? 15 : 12;
          const gap = (e.scammerAttackIndex * 3) % count;
          for (let i = 0; i < count; i++) {
            if (i === gap || i === (gap + 1) % count) continue;
            v3ShootAt(e.x, e.y, e.bossAngle + i * Math.PI * 2 / count, 198 + wave * 3, damage * .92, VIOLET, 5, 6.4);
          }
          v3Say(runtimeText("msg.scammerFee", "SCAMMER // HIDDEN FEE"), 1.05);
        } else if (attack === 2) {
          const decoys = enemies.filter((enemy) => enemy.alive && enemy.scammerDecoy).slice(-3);
          for (const decoy of decoys) {
            const decoyAngle = Math.atan2(player.y - decoy.y, player.x - decoy.x);
            v3ShootAt(decoy.x, decoy.y, decoyAngle, 245 + wave * 4, damage * .78, "#8cf7d4", 5, 4.8);
          }
          v3RadialFire(e.x, e.y, phase === 2 ? 9 : 7, 172 + wave * 3, damage * .72, CYAN, e.bossAngle + .22);
          v3Say(runtimeText("msg.scammerReceipt", "SCAMMER // RECEIPT DUPLICATED"), 1.12);
        } else {
          for (let i = -1; i <= 1; i++) {
            v3ShootAt(e.x, e.y, base + i * .2, 340 + wave * 5, damage * 1.08, HOT, 7, 4.5);
          }
          if (phase === 2) spawnScammerDecoy(e.x + rand(-38, 38), e.y + rand(-38, 38), 2.8);
          v3Say(runtimeText("msg.scammerChargeback", "SCAMMER // CHARGEBACK"), 1.05);
        }
        shake = Math.max(shake, phase === 2 ? 10 : 7);
      }

      function v3BossAffixTick(e, dt) {
        const affix = e?.bossAffix;
        if (!affix) return;
        const phase = e.hp / e.maxHp < .5 ? 2 : 1;
        e.affixTimer = (Number.isFinite(e.affixTimer) ? e.affixTimer : rand(2.4, 4.2)) - dt;
        e.armorTimer = Math.max(0, (e.armorTimer || 0) - dt);
        e.shiftFlash = Math.max(0, (e.shiftFlash || 0) - dt);
        e.guardWindow = Math.max(0, (e.guardWindow || 0) - dt);
        e.guardTimer = (Number.isFinite(e.guardTimer) ? e.guardTimer : rand(3.2, 4.4)) - dt;
        if (e.guardTimer <= 0) {
          e.guardWindow = phase === 2 ? .82 : 1.05;
          e.guardTimer = phase === 2 ? 3.1 : 4.15;
          v3Readout = runtimeText("status.coreLock", "CORE LOCK // DAMAGE DAMPENED");
          v3ReadoutTimer = .95;
          combatFlash(runtimeText("msg.coreOpening", "CORE LOCK // FIND THE OPENING"), 760);
          v3BlastRings.push({ x: e.x, y: e.y, r: e.r + 10, max: e.r + 68, life: .7, color: "#fff7c2" });
        }
        if (e.affixTimer > 0) return;
        if (affix.key === "overclocked") {
          const base = Math.atan2(player.y - e.y, player.x - e.x);
          for (let i = -1; i <= 1; i++) {
            v3ShootAt(e.x, e.y, base + i * .14, 315 + wave * 5, (8 + wave * .45) * (e.bossDamageScale || 1), ACID, 5, 4.6);
          }
          e.affixTimer = phase === 2 ? 1.7 : 2.35;
          v3Say(runtimeText("msg.overclockPattern", "OVERCLOCKED // three lanes, one decision."), 1.05);
        } else if (affix.key === "fortified") {
          e.armorTimer = phase === 2 ? 2.8 : 2.15;
          e.affixTimer = phase === 2 ? 4.3 : 5.4;
          v3BlastRings.push({ x: e.x, y: e.y, r: e.r + 8, max: e.r + 54, life: .58, color: VIOLET });
          particle(e.x, e.y, VIOLET, 18, 170);
          v3Say(runtimeText("msg.fortifiedPattern", "FORTIFIED // armor window is live."), 1.05);
        } else if (affix.key === "phaseShift") {
          const previousX = e.x, previousY = e.y;
          const angle = Math.atan2(e.y - player.y, e.x - player.x) + Math.PI + rand(-.9, .9);
          const radius = enemyViewportShellRadius(angle, e, compactDevice ? 28 : 42);
          e.x = player.x + Math.cos(angle) * radius;
          e.y = player.y + Math.sin(angle) * radius;
          e.bbEntryRush = true;
          e.bbEntryGrace = Math.max(Number(e.bbEntryGrace) || 0, .58);
          e.bossTimer = Math.max(Number(e.bossTimer) || 0, .48);
          e.shiftFlash = .72;
          e.affixTimer = phase === 2 ? 2.9 : 4.1;
          v3BlastRings.push({ x: previousX, y: previousY, r: 10, max: 78, life: .48, color: CYAN });
          v3BlastRings.push({ x: e.x, y: e.y, r: 12, max: 92, life: .62, color: CYAN });
          particle(previousX, previousY, CYAN, 16, 220);
          particle(e.x, e.y, CYAN, 24, 260);
          v3Say(runtimeText("msg.phasePattern", "PHASE SHIFT // the target changed coordinates."), 1.1);
        } else if (affix.key === "redline") {
          v3RadialFire(e.x, e.y, 8 + phase * 2, 248 + wave * 4, (8 + wave * .45) * (e.bossDamageScale || 1) * 1.14, HOT, e.bossAngle + .18);
          e.affixTimer = phase === 2 ? 2.25 : 3.25;
          v3Say(runtimeText("msg.redlinePattern", "REDLINE // no safe side of the book."), 1.05);
        }
      }

      function v3BossPattern(e, dt) {
        if (!e || !e.alive || !e.boss) return;
        // A boss phase shift is routed through the off-screen entry shell.
        // Do not let it fire from that hidden transit position.
        if (e.bbEntryGrace > 0) return;
        const profile = v3BossProfiles[e.bossKind];
        e.bossTimer -= dt;
        e.bossAngle += dt * (e.bossPattern === "orbit" ? 1.2 : .55);
        const phase = e.hp / e.maxHp < .5 ? 2 : 1;
        v3BossAffixTick(e, dt);
        if (e.scammerBoss) {
          v3ScammerPattern(e, dt);
          return;
        }
        if (e.bossTimer > 0) return;
        if (e.bossPattern === "ring") {
          v3RadialFire(e.x, e.y, 14 + phase * 4, 210 + wave * 6, (10 + wave * .7) * (e.bossDamageScale || 1), profile.color, e.bossAngle);
          e.bossTimer = (phase === 2 ? .95 : 1.35) * (e.bossCadenceScale || 1);
          v3Say(runtimeText("msg.lockoutPattern", "THE LOCKOUT // expanding ring."), 1.3);
        } else if (e.bossPattern === "barrage") {
          const base = Math.atan2(player.y - e.y, player.x - e.x);
          for (let i = 0; i < 7; i++) v3ShootAt(e.x, e.y, base + (i - 3) * .11, 270 + wave * 5, (13 + wave * .8) * (e.bossDamageScale || 1), profile.color, 7, 5.5);
          e.bossTimer = (phase === 2 ? .62 : 1.05) * (e.bossCadenceScale || 1);
          v3Say(runtimeText("msg.clearingPattern", "CLEARING HOUSE // collateral incoming."), 1.25);
        } else if (e.bossPattern === "orbit") {
          for (let i = 0; i < 4; i++) {
            const a = e.bossAngle + i * Math.PI / 2;
            v3ShootAt(e.x, e.y, a, 185 + wave * 4, (11 + wave * .6) * (e.bossDamageScale || 1), profile.color, 6, 7);
          }
          e.bossTimer = (phase === 2 ? .55 : .9) * (e.bossCadenceScale || 1);
          v3Say(runtimeText("msg.oraclePattern", "THE ORACLE // prediction tax."), 1.15);
        } else {
          const count = phase === 2 ? 4 : 3;
          for (let i = 0; i < count; i++) {
            const t = enemyTypes.swarm;
            const minion = {
              alive: true, type: "swarm", x: e.x + rand(-35, 35), y: e.y + rand(-35, 35),
              r: t.r, hp: t.hp * (1 + wave * .12), maxHp: t.hp * (1 + wave * .12),
              speed: t.speed * (1 + wave * .02), touch: t.touch, value: t.value,
              ranged: false, shotTimer: 9, elite: false, hit: 0, phase: Math.random() * 6.28,
              knockX: 0, knockY: 0, stun: 0, contractApplied: false
            };
            applySpawnContract(minion, false);
            enemies.push(minion);
          }
          v3RadialFire(e.x, e.y, 8 + phase * 2, 180, (9 + wave * .5) * (e.bossDamageScale || 1), profile.color, e.bossAngle);
          e.bossTimer = (phase === 2 ? 1.35 : 2) * (e.bossCadenceScale || 1);
          v3Say(runtimeText("msg.robinPattern", "ROBIN PRIME // the mascot calls reinforcements."), 1.5);
        }
        shake = Math.max(shake, 7);
        // Boss pattern callouts stay silent; combat audio is reserved for
        // the player's shot, UI buttons, and actual explosions.
      }

      function v3SpecialEnemy(e, dt) {
        if (!e.alive) return;
        if (e.scammerDecoy) {
          e.decoyLife = (Number.isFinite(e.decoyLife) ? e.decoyLife : 3.2) - dt;
          if (e.decoyLife <= 0) {
            e.alive = false;
            particle(e.x, e.y, "#8cf7d4", gameSettings.performance ? 4 : 10, 120);
            v3BlastRings.push({ x: e.x, y: e.y, r: 5, max: 32, life: .24, color: "#8cf7d4" });
            return;
          }
        }
        const specialPreviousX = e.x, specialPreviousY = e.y;
        const hadSpecialMotion = !!(e.knockX || e.knockY || e.stun > 0 || e.orbit);
        if (e.knockX || e.knockY) {
          const knockMagnitude = Math.hypot(e.knockX || 0, e.knockY || 0) || 0;
          if (knockMagnitude > 0) {
            // Cap the actual per-frame displacement as a second guard
            // against a stacked explosion or a long frame on a phone.
            const step = Math.min(knockMagnitude * dt, ENEMY_KNOCKBACK_STEP_CAP);
            e.x += (e.knockX / knockMagnitude) * step;
            e.y += (e.knockY / knockMagnitude) * step;
          }
          e.knockX *= Math.pow(.035, dt);
          e.knockY *= Math.pow(.035, dt);
          if (Math.hypot(e.knockX, e.knockY) < 1.5) e.knockX = e.knockY = 0;
        }
        if (e.stun > 0) {
          e.stun -= dt;
          e.x -= (player.x - e.x) * .02;
          e.y -= (player.y - e.y) * .02;
        }
        if (e.orbit) {
          const dx = player.x - e.x, dy = player.y - e.y, d = Math.hypot(dx, dy) || 1;
          const tangent = Math.atan2(dy, dx) + Math.PI / 2;
          const orbitSpeed = 70 * zoomTempoScale();
          e.x += Math.cos(tangent) * orbitSpeed * dt;
          e.y += Math.sin(tangent) * orbitSpeed * dt;
        }
        if (e.drain && dist(e, player) < 165 / Math.max(.05, viewportZoom())) {
          player.energy = clamp(player.energy - dt * 16, 0, player.maxEnergy);
          v3Readout = runtimeText("msg.leechDrain", "LEECH // momentum siphoned");
          v3ReadoutTimer = .35;
        }
        if (e.pulse) {
          e.pulseTimer = (e.pulseTimer || rand(1.2, 2.3)) - dt;
          if (e.pulseTimer <= 0) {
            e.pulseTimer = Math.max(.7, 1.55 - wave * .025);
            v3RadialFire(e.x, e.y, 8, 165 + wave * 3, 7 + wave * .35, enemyTypes.pulse.color, e.phase);
          }
        }
        // Special movement (orbit, knockback and phase effects) can also
        // cross the player between fixed frames at deep zoom. Preserve the
        // same swept contact guarantee as the main enemy integrator.
        if (hadSpecialMotion && player.invuln <= 0 && segmentDistance(player.x, player.y, specialPreviousX, specialPreviousY, e.x, e.y) < e.r + player.r + 2) {
          hurt(e.touch * dt);
        }
      }

      update = function(dt) {
        if (orientationHold) return;
        v3Update(dt);
        if (state !== "playing") {
          if (state !== "shop") $("bossHud").classList.remove("show");
          return;
        }
        arenaPulse = Math.max(0, arenaPulse - dt);
        if (v3ReadoutTimer > 0) v3ReadoutTimer -= dt;
        // Level-up choices must interrupt the combat frame before extra
        // spawns or a second update can award another level.  On a phone this
        // keeps the first minute readable instead of stacking mutations while
        // the player is still learning the controls.
        if (player.levelQueue > 0) return;
        // Dash is now energy-backed rather than charge-gated.  Keep the
        // readout live so players can see exactly how many chained bursts
        // their current battery can afford.
        syncDashBudget();
        v3SpawnBurstTimer -= dt;
        if (waveRemaining > 0 && v3SpawnBurstTimer <= 0 && aliveCount(enemies) < mobileBurstSpawnCap()) {
          spawnEnemy();
          v3SpawnBurstTimer = mobileBurstInterval();
        }
        for (const e of enemies) {
          if (!e.alive) continue;
          v3SpecialEnemy(e, dt);
          v3BossPattern(e, dt);
        }
        // Knockback, orbit routes and boss teleports all run above the base
        // integrator.  Keep one final leash pass here so a stacked impulse or
        // a malformed coordinate can never strand a target outside the
        // playable tactical radius.
        rescueFarEnemies();
        for (let i = v3BlastRings.length - 1; i >= 0; i--) {
          const ring = v3BlastRings[i];
          const x = Number(ring?.x);
          const y = Number(ring?.y);
          const life = Number(ring?.life);
          const radius = Number(ring?.r);
          const maxRadius = Number(ring?.max);
          if (!ring || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(life)) {
            v3BlastRings.splice(i, 1);
            continue;
          }
          ring.life = life - dt;
          if (ring.life <= 0) {
            v3BlastRings.splice(i, 1);
            continue;
          }
          const safeRadius = Number.isFinite(radius) ? Math.max(0, radius) : 0;
          const safeMax = Number.isFinite(maxRadius) ? Math.max(safeRadius, maxRadius) : safeRadius;
          ring.r = safeRadius + (safeMax - safeRadius) * Math.max(0, Math.min(1, dt * 9));
          ring.max = safeMax;
        }
        const magnetRadius = (95 + upgradeLevels.magnet * 46) / Math.max(.05, viewportZoom());
        for (const p of pickups) {
          const dx = player.x - p.x, dy = player.y - p.y, d = Math.hypot(dx, dy) || 1;
          if (d < magnetRadius) {
            p.x += dx * dt * (2.2 + upgradeLevels.magnet * .32);
            p.y += dy * dt * (2.2 + upgradeLevels.magnet * .32);
          }
        }
        if (v3Boss && v3Boss.alive) {
          $("bossHud").classList.add("show");
          $("bossFill").style.width = `${clamp(v3Boss.hp / v3Boss.maxHp * 100, 0, 100)}%`;
          $("bossPhaseText").textContent = localizedBossPhaseText(v3Boss);
        } else if (bossAlive && waveRemaining === 0 && aliveCount(enemies) === 0) {
          $("bossHud").classList.remove("show");
        }
        syncHud();
      };

      syncHud = function() {
        v3SyncHud();
        const dashButton = document.querySelector('[data-ability="dash"]');
        if (dashButton) {
          const energyCost = dashEnergyCost();
          const readyDashes = dashBudget();
          const cooldownText = player.ability.dash > 0
            ? runtimeText("msg.echoCooldown", `X // ECHO // ${player.ability.dash.toFixed(1)}s`, { value: player.ability.dash.toFixed(1) }).replace(/^X\s*\/\/\s*ECHO\s*\/\/\s*/i, "")
            : translate("ready");
          dashButton.querySelector("small").textContent = `${cooldownText} // ${readyDashes}${translate("times")}`;
          dashButton.title = runtimeText("msg.dashTitle", `Dash costs ${energyCost.toFixed(1)} energy // ${readyDashes} chained bursts available`, {
            cost: energyCost.toFixed(1),
            charges: readyDashes
          });
        }
        const eventDef = frontierEvent.timer > 0
          ? frontierEventDefs.find((item) => item.key === frontierEvent.key)
          : null;
        const eventTitle = eventDef
          ? localizedDefinitionField("frontier", eventDef, "title", eventDef.title)
          : frontierEvent.title;
        const eventText = frontierEvent.timer > 0
          ? `${eventTitle} // ${frontierEvent.timer.toFixed(1)}${translate("seconds")}`
          : "";
        $("combatReadout").textContent = v3ReadoutTimer > 0 ? localizeRuntimeMessage(v3Readout) : eventText;
        $("combatReadout").style.color = frontierEvent.timer > 0 ? frontierEvent.color : "";
        if (v3Boss && v3Boss.alive) {
          $("bossHud").classList.add("show");
          $("bossNameText").textContent = localizedBossField(
            v3Boss.bossKind || "lock",
            "name",
            v3Boss.bossName || translate("boss")
          );
          $("bossFill").style.width = `${clamp(v3Boss.hp / v3Boss.maxHp * 100, 0, 100)}%`;
        }
      };

      drawWorld = function(t) {
        v3DrawWorld(t);
        if (gameSettings.effects && v3BlastRings.length) {
          ctx.save();
          for (const ring of v3BlastRings) {
            const p = worldToScreen(ring.x, ring.y);
            const scale = Math.max(.05, Number(worldRenderScale()) || 1);
            const radius = Math.max(0, Number(ring.r) || 0);
            if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || radius <= 0) continue;
            ctx.globalAlpha = clamp(ring.life / .82, 0, 1);
            ctx.strokeStyle = ring.color;
            ctx.shadowBlur = 18;
            ctx.shadowColor = ring.color;
            ctx.lineWidth = Math.max(1, 3 * scale);
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * scale, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
        if (v3Boss && v3Boss.alive) {
          const p = worldToScreen(v3Boss.x, v3Boss.y);
          const profile = v3BossProfiles[v3Boss.bossKind];
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.scale(worldRenderScale(), worldRenderScale());
          ctx.rotate(t * .35);
          ctx.globalAlpha = .55 + Math.sin(t * 3) * .12;
          ctx.strokeStyle = profile.color;
          ctx.shadowBlur = 30;
          ctx.shadowColor = profile.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, v3Boss.r + 18 + Math.sin(t * 2) * 5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, v3Boss.r + 31, t, t + Math.PI * 1.3);
          ctx.stroke();
          const affixKey = v3Boss.bossAffix?.key;
          if (affixKey === "fortified" && v3Boss.armorTimer > 0) {
            ctx.globalAlpha = .72;
            ctx.strokeStyle = VIOLET;
            ctx.lineWidth = 3;
            setDash([6, 4]);
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const a = -Math.PI / 2 + i * Math.PI / 3;
              const x = Math.cos(a) * (v3Boss.r + 11), y = Math.sin(a) * (v3Boss.r + 11);
              if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
            setDash([]);
          } else if (affixKey === "phaseShift" && v3Boss.shiftFlash > 0) {
            ctx.globalAlpha = .8;
            ctx.strokeStyle = CYAN;
            ctx.lineWidth = 3;
            setDash([3, 8]);
            ctx.beginPath();
            ctx.arc(0, 0, v3Boss.r + 14 + Math.sin(t * 15) * 4, 0, Math.PI * 2);
            ctx.stroke();
            setDash([]);
          } else if (affixKey === "redline") {
            ctx.globalAlpha = .55 + Math.sin(t * 10) * .15;
            ctx.strokeStyle = HOT;
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
              const a = t * .9 + i * Math.PI / 2;
              ctx.beginPath();
              ctx.moveTo(Math.cos(a) * (v3Boss.r + 15), Math.sin(a) * (v3Boss.r + 15));
              ctx.lineTo(Math.cos(a) * (v3Boss.r + 31), Math.sin(a) * (v3Boss.r + 31));
              ctx.stroke();
            }
          }
          ctx.restore();
          if (v3Boss.scammerBoss && gameSettings.effects) {
            const glitchScale = worldRenderScale();
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.scale(glitchScale, glitchScale);
            ctx.globalCompositeOperation = "screen";
            const jitter = Math.sin(t * 34) * 4;
            ctx.globalAlpha = gameSettings.performance ? .16 : .28;
            ctx.fillStyle = "#ff426d";
            ctx.fillRect(-v3Boss.r - 22 + jitter, -v3Boss.r * .48, (v3Boss.r + 22) * 2, 3);
            ctx.fillStyle = CYAN;
            ctx.fillRect(-v3Boss.r - 12 - jitter, v3Boss.r * .24, (v3Boss.r + 12) * 2, 2);
            ctx.globalAlpha = .55;
            ctx.strokeStyle = "#ff426d";
            ctx.lineWidth = 2;
            setDash([4, 7]);
            ctx.beginPath();
            ctx.arc(jitter * .35, -jitter * .2, v3Boss.r + 42 + Math.sin(t * 11) * 5, 0, Math.PI * 2);
            ctx.stroke();
            setDash([]);
            if (v3Boss.scammerShieldTimer > 0) {
              ctx.globalAlpha = .86;
              ctx.strokeStyle = "#fff7c2";
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(0, 0, v3Boss.r + 12 + Math.sin(t * 18) * 3, 0, Math.PI * 2);
              ctx.stroke();
              ctx.fillStyle = "#fff7c2";
              ctx.font = `900 ${Math.max(7, v3Boss.r * .24)}px ui-monospace, monospace`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(runtimeText("canvas.verify", "VERIFY"), 0, -v3Boss.r - 24);
            }
            ctx.restore();
          }
        }
      };

/* ===== 70-progression.js ===== */
// SIGNAL RUN // PLAYER-FACING PROGRESSION PATCH
      // Keep the original combat loop, but add a durable archive, readable
      // progression, and a shop that exposes every upgrade at once.
      const SAVE_COOKIE = "buy_button_signal_archive_v4";
      const defaultArchive = {
        bestScore: 0,
        bestWave: 0,
        bestCoins: 0,
        bestLevel: 0,
        totalRuns: 0,
        totalKills: 0,
        // Kept only to migrate old records. Manual firing is the only
        // supported control mode from this build onward.
        autoFire: false,
        updatedAt: 0
      };
      function parseArchivePayload(raw, encoded = false) {
        try {
          const decoded = encoded ? decodeURIComponent(raw) : raw;
          const value = JSON.parse(decoded);
          return value && typeof value === "object" ? value : null;
        } catch (_) {
          return null;
        }
      }
      function readArchive() {
        const candidates = [];
        try {
          const row = document.cookie.split("; ").find((part) => part.startsWith(`${SAVE_COOKIE}=`));
          const value = row ? parseArchivePayload(row.slice(SAVE_COOKIE.length + 1), true) : null;
          if (value) candidates.push({ source: "cookie", value });
        } catch (_) {}
        for (const entry of readStorageEntries(SAVE_COOKIE)) {
          const value = parseArchivePayload(entry.raw);
          if (value) candidates.push({ source: entry.source, value });
        }
        candidates.sort((a, b) => {
          const revision = (Number(b.value.updatedAt) || 0) - (Number(a.value.updatedAt) || 0);
          return revision || (a.source === "localStorage" ? -1 : 1);
        });
        return { ...defaultArchive, ...(candidates[0]?.value || {}), autoFire: false };
      }
      let archive = { ...readArchive(), autoFire: false };
      function saveArchive() {
        const previousRevision = Number(archive.updatedAt) || 0;
        archive = { ...defaultArchive, ...archive, autoFire: false, updatedAt: Math.max(Date.now(), previousRevision + 1) };
        const serialized = JSON.stringify(archive);
        try { document.cookie = `${SAVE_COOKIE}=${encodeURIComponent(serialized)}; max-age=31536000; path=/; SameSite=Lax`; } catch (_) {}
        // Keep the run archive durable in one place. A legacy session record
        // may still be read by `readArchive`, but new writes stay in the
        // durable local profile so an old tab cannot overwrite a newer run.
        try {
          if (window.localStorage && typeof window.localStorage.setItem === "function") {
            window.localStorage.setItem(SAVE_COOKIE, serialized);
          }
        } catch (_) {}
        bbEmitCloudChange("archive", { ...archive }, archive.updatedAt);
      }
      function refreshArchiveUi() {
        const bestScore = Math.floor(archive.bestScore || 0);
        const bestWave = Math.floor(archive.bestWave || 0);
        const runs = Math.floor(archive.totalRuns || 0);
        if ($("menuBestScore")) $("menuBestScore").textContent = bestScore.toLocaleString();
        if ($("menuBestWave")) $("menuBestWave").textContent = bestWave;
        if ($("menuRuns")) $("menuRuns").textContent = runs;
        if ($("menuRecordBadge")) {
          $("menuRecordBadge").textContent = bestScore > 0
            ? translate("archiveOnline", { wave: bestWave, score: bestScore.toLocaleString() })
            : translate("noRecord");
        }
      }

      // LEGENDS BOARD // LOCAL-FIRST + TELEGRAM IDENTITY
      // The local board remains playable in guest mode and synchronizes across
      // same-origin tabs. Inside Telegram, the verified session is the record
      // identity and the same-origin API persists the best run globally.
      // `emailHash` is retained only as a private legacy field name so old
      // local records can still be read; no email is requested or transmitted.
      const LEADERBOARD_STORAGE_KEY = "buy_button_legends_board_v1";
      const LEADERBOARD_PROFILE_KEY = "buy_button_legends_profile_v1";
      const LEADERBOARD_GUEST_ID_KEY = "buy_button_legends_guest_id_v1";
      const LEADERBOARD_CHANNEL_NAME = "buy_button_legends_channel_v1";
      const LEADERBOARD_LIMIT = 50;
      const leaderboardTelegramCandidate = window.Telegram?.WebApp || null;
      const leaderboardTelegramContext = !!(
        leaderboardTelegramCandidate
        && (
          String(leaderboardTelegramCandidate.initData || "").trim()
          || leaderboardTelegramCandidate.initDataUnsafe?.user
          || window.TelegramWebviewProxy
          || /Telegram/i.test(String(window.navigator?.userAgent || ""))
        )
      );
      const LEADERBOARD_API = (() => {
        const configured = String(
          window.BUY_BUTTON_LEADERBOARD_API
            || (leaderboardTelegramContext ? "/api" : "")
        ).trim();
        if (!configured) return "";
        try {
          const url = new URL(configured, window.location.href);
          if (url.origin !== window.location.origin) return "";
          return url.pathname.replace(/\/+$/, "");
        } catch (_) {
          return "";
        }
      })();
      const leaderboardClientId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      let leaderboardEntries = [];
      let leaderboardProfile = { alias: "" };
      let leaderboardChannel = null;
      let leaderboardEventSource = null;
      let leaderboardTransportReady = false;
      let leaderboardRefreshing = false;
      let leaderboardStatusKey = "leaderboardOffline";
      let leaderboardLastNotified = "";
      let leaderboardProfileStatusTimer = 0;

      function leaderboardHash(value) {
        // FNV-1a is deterministic and lightweight. It is only for deduping
        // local records; it must never be treated as secure identity proof.
        let hash = 2166136261;
        const text = String(value || "");
        for (let i = 0; i < text.length; i++) {
          hash ^= text.charCodeAt(i);
          hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(36);
      }
      function normalizeLeaderboardAlias(value) {
        return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, 24);
      }
      function leaderboardTelegramPlayer() {
        const account = window.__BUY_BUTTON_ACCOUNT__;
        const player = account?.authenticated ? account.player : null;
        return player && (player.id || player.telegramId) ? player : null;
      }
      function leaderboardGuestId() {
        let value = "";
        try { value = String(window.localStorage?.getItem(LEADERBOARD_GUEST_ID_KEY) || ""); } catch (_) {}
        if (!value) {
          try {
            value = typeof window.crypto?.randomUUID === "function"
              ? window.crypto.randomUUID()
              : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
            window.localStorage?.setItem(LEADERBOARD_GUEST_ID_KEY, value);
          } catch (_) {
            value = `guest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
          }
        }
        return value.slice(0, 96);
      }
      function leaderboardIdentity() {
        const player = leaderboardTelegramPlayer();
        if (player) {
          const value = String(player.id || player.telegramId);
          return {
            type: "telegram",
            value,
            hash: value.replace(/[^a-z0-9_-]/gi, "").slice(0, 80),
            label: player.username ? `TELEGRAM // @${player.username}` : "TELEGRAM ACCOUNT"
          };
        }
        const value = leaderboardGuestId();
        return {
          type: "guest",
          value,
          hash: leaderboardHash(`guest:${value}`),
          label: "GUEST // THIS DEVICE"
        };
      }
      function leaderboardIdentityLabel() {
        const identity = leaderboardIdentity();
        return currentLocale === "fa"
          ? identity.type === "telegram" ? "تلگرام // حساب تأییدشده" : "مهمان // همین دستگاه"
          : identity.label;
      }
      function leaderboardProfileHash(profile = leaderboardProfile) {
        return leaderboardIdentity().hash;
      }
      function leaderboardEffectiveAlias() {
        return normalizeLeaderboardAlias(
          leaderboardProfile.alias
            || leaderboardTelegramPlayer()?.publicAlias
            || [leaderboardTelegramPlayer()?.firstName, leaderboardTelegramPlayer()?.lastName].filter(Boolean).join(" ")
        );
      }
      function localizeLeaderboardRemoteEntry(raw) {
        const player = leaderboardTelegramPlayer();
        if (!player || !raw || typeof raw !== "object") return raw;
        const serverPlayerId = String(player.id || "").trim();
        const remoteId = String(raw.id || raw.playerHash || "").trim();
        if (!serverPlayerId || !remoteId || remoteId !== serverPlayerId) return raw;
        const localHash = leaderboardIdentity().hash;
        if (!localHash) return raw;
        // The API intentionally returns an opaque database UUID. Keep one
        // stable local key for the verified Telegram account so a remote
        // refresh never creates a duplicate "me" row beside the local row.
        return { ...raw, id: localHash, emailHash: localHash, playerHash: localHash };
      }
      function leaderboardLevelFor(scoreValue, waveValue) {
        const scorePart = Math.max(0, Number(scoreValue) || 0) / 1200;
        const wavePart = Math.max(0, Number(waveValue) || 0) * .55;
        return clamp(1 + Math.floor(scorePart + wavePart), 1, 99);
      }
      function leaderboardTimestamp(value, fallback = Date.now()) {
        const numeric = Number(value);
        if (Number.isFinite(numeric) && numeric > 0) return Math.floor(numeric);
        const parsed = Date.parse(String(value || ""));
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
      }
      function normalizeLeaderboardEntry(raw) {
        if (!raw || typeof raw !== "object") return null;
        const emailHash = String(raw.emailHash || raw.playerHash || raw.id || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 80);
        if (!emailHash) return null;
        const scoreValue = clamp(Math.floor(Number(raw.score) || 0), 0, 1000000000000);
        const waveValue = clamp(Math.floor(Number(raw.wave) || 0), 0, 100000);
        const coinsValue = clamp(Math.floor(Number(raw.coins ?? raw.value) || 0), 0, 1000000000000);
        const createdAt = leaderboardTimestamp(raw.createdAt);
        const levelValue = leaderboardLevelFor(scoreValue, waveValue);
        return {
          id: String(raw.id || emailHash).slice(0, 90),
          alias: normalizeLeaderboardAlias(raw.alias) || "Legendary Operator",
          emailHash,
          score: scoreValue,
          wave: waveValue,
          coins: coinsValue,
          level: levelValue,
          createdAt,
          updatedAt: Math.max(createdAt, leaderboardTimestamp(raw.updatedAt, createdAt))
        };
      }
      function compareLeaderboardEntries(a, b) {
        return (Number(b.score) || 0) - (Number(a.score) || 0)
          || (Number(b.wave) || 0) - (Number(a.wave) || 0)
          || (Number(b.level) || 0) - (Number(a.level) || 0)
          || (Number(b.coins) || 0) - (Number(a.coins) || 0)
          || (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0)
          || String(a.emailHash || "").localeCompare(String(b.emailHash || ""));
      }
      function sortLeaderboardEntries() {
        leaderboardEntries.sort(compareLeaderboardEntries);
        if (leaderboardEntries.length > LEADERBOARD_LIMIT) leaderboardEntries.length = LEADERBOARD_LIMIT;
      }
      function parseLeaderboardPayload(raw) {
        try {
          const value = typeof raw === "string" ? JSON.parse(raw) : raw;
          return value && typeof value === "object" ? value : null;
        } catch (_) {
          return null;
        }
      }
      function loadLeaderboardProfile() {
        const candidates = readStorageEntries(LEADERBOARD_PROFILE_KEY);
        const source = candidates.find((entry) => parseLeaderboardPayload(entry.raw))?.raw;
        const parsed = parseLeaderboardPayload(source);
        const alias = normalizeLeaderboardAlias(parsed?.alias);
        leaderboardProfile = { alias };
        return leaderboardProfile;
      }
      function persistLeaderboardProfile() {
        const payload = JSON.stringify({
          version: 1,
          alias: normalizeLeaderboardAlias(leaderboardProfile.alias),
          updatedAt: Date.now()
        });
        let stored = false;
        try {
          if (window.localStorage && typeof window.localStorage.setItem === "function") {
            window.localStorage.setItem(LEADERBOARD_PROFILE_KEY, payload);
            stored = true;
          }
        } catch (_) {}
        if (!stored) {
          try { window.sessionStorage?.setItem(LEADERBOARD_PROFILE_KEY, payload); } catch (_) {}
        }
      }
      function loadLeaderboardEntries() {
        const candidates = readStorageEntries(LEADERBOARD_STORAGE_KEY);
        const source = candidates.find((entry) => parseLeaderboardPayload(entry.raw))?.raw;
        const parsed = parseLeaderboardPayload(source);
        const rawEntries = Array.isArray(parsed) ? parsed : parsed?.entries;
        leaderboardEntries = Array.isArray(rawEntries)
          ? rawEntries.map(normalizeLeaderboardEntry).filter(Boolean)
          : [];
        const deduped = new Map();
        for (const entry of leaderboardEntries) {
          const old = deduped.get(entry.emailHash);
          if (!old || compareLeaderboardEntries(entry, old) < 0) deduped.set(entry.emailHash, entry);
        }
        leaderboardEntries = [...deduped.values()];
        sortLeaderboardEntries();
        return leaderboardEntries;
      }
      function persistLeaderboardEntries() {
        sortLeaderboardEntries();
        const payload = JSON.stringify({
          version: 1,
          updatedAt: Date.now(),
          entries: leaderboardEntries.slice(0, LEADERBOARD_LIMIT)
        });
        let stored = false;
        try {
          if (window.localStorage && typeof window.localStorage.setItem === "function") {
            window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, payload);
            stored = true;
          }
        } catch (_) {}
        if (!stored) {
          try { window.sessionStorage?.setItem(LEADERBOARD_STORAGE_KEY, payload); } catch (_) {}
        }
      }
      function leaderboardRankFor(emailHash) {
        const index = leaderboardEntries.findIndex((entry) => entry.emailHash === emailHash);
        return index < 0 ? null : index + 1;
      }
      function upsertLeaderboardEntry(raw) {
        const candidate = normalizeLeaderboardEntry(raw);
        if (!candidate) return { changed: false, metricImproved: false, entry: null, rank: null, isLeader: false };
        const index = leaderboardEntries.findIndex((entry) => entry.emailHash === candidate.emailHash);
        const previousTop = leaderboardEntries[0]?.emailHash || "";
        let changed = false;
        let metricImproved = false;
        if (index < 0) {
          leaderboardEntries.push(candidate);
          changed = true;
          metricImproved = true;
        } else {
          const existing = leaderboardEntries[index];
          metricImproved = compareLeaderboardEntries(candidate, existing) < 0;
          if (metricImproved) {
            candidate.createdAt = existing.createdAt || candidate.createdAt;
            candidate.updatedAt = Date.now();
            leaderboardEntries[index] = candidate;
            changed = true;
          } else if (existing.alias !== candidate.alias) {
            existing.alias = candidate.alias;
            existing.updatedAt = Date.now();
            changed = true;
          }
        }
        sortLeaderboardEntries();
        const entry = leaderboardEntries.find((item) => item.emailHash === candidate.emailHash) || candidate;
        return {
          changed,
          metricImproved,
          entry,
          rank: leaderboardRankFor(entry.emailHash),
          isLeader: !!metricImproved && leaderboardEntries[0]?.emailHash === entry.emailHash && previousTop !== entry.emailHash
        };
      }
      function leaderboardBoardStatus() {
        const key = LEADERBOARD_API && leaderboardStatusKey === "leaderboardOffline"
          ? "leaderboardOnline"
          : leaderboardStatusKey;
        return translate(key);
      }
      function setLeaderboardBoardStatus(key) {
        leaderboardStatusKey = key || (LEADERBOARD_API ? "leaderboardOnline" : "leaderboardOffline");
        const node = $("leaderboardStatus");
        if (node) node.textContent = leaderboardBoardStatus();
      }
      function setLeaderboardProfileStatus(message, duration = 0) {
        const node = $("leaderboardProfileStatus");
        if (!node) return;
        node.textContent = message || "";
        clearTimeout(leaderboardProfileStatusTimer);
        if (duration > 0) {
          leaderboardProfileStatusTimer = window.setTimeout(() => {
            if (node.textContent === message) node.textContent = "";
          }, duration);
        }
      }
      syncLeaderboardProfileFields = function() {
        const aliasField = $("leaderboardAlias");
        if (aliasField && document.activeElement !== aliasField) aliasField.value = leaderboardProfile.alias || "";
        const identityNode = $("leaderboardTelegramIdentity");
        if (identityNode) identityNode.textContent = leaderboardIdentityLabel();
        const notifyButton = $("notifyLeaderboardBtn");
        if (notifyButton && typeof window.Notification === "function" && Notification.permission === "granted") {
          notifyButton.textContent = `${translate("leaderboardNotify")} ✓`;
        } else if (notifyButton) {
          notifyButton.textContent = translate("leaderboardNotify");
        }
      };
      renderLeaderboard = function() {
        const table = $("leaderboardTable");
        if (!table) return;
        table.replaceChildren();
        setLeaderboardBoardStatus(leaderboardStatusKey);
        const header = document.createElement("div");
        header.className = "leaderboard-row header";
        [translate("leaderboardRank"), translate("leaderboardPlayer"), translate("leaderboardScore"), translate("leaderboardWave"), translate("leaderboardLevel"), translate("leaderboardValue")].forEach((label) => {
          const cell = document.createElement("span");
          cell.textContent = label;
          header.appendChild(cell);
        });
        table.appendChild(header);
        const visible = leaderboardEntries.slice(0, 20);
        const myHash = leaderboardProfileHash();
        const mine = myHash ? leaderboardEntries.find((entry) => entry.emailHash === myHash) : null;
        if (mine && !visible.some((entry) => entry.emailHash === mine.emailHash)) visible.push(mine);
        if (!visible.length) {
          const empty = document.createElement("div");
          empty.className = "leaderboard-empty";
          empty.textContent = translate("leaderboardEmpty");
          table.appendChild(empty);
        } else {
          visible.forEach((entry) => {
            const rank = leaderboardRankFor(entry.emailHash) || 0;
            const row = document.createElement("div");
            row.className = `leaderboard-row${rank === 1 ? " top" : ""}${entry.emailHash === myHash ? " me" : ""}`;
            const rankCell = document.createElement("span");
            rankCell.className = "leaderboard-rank";
            rankCell.textContent = `#${rank}`;
            const playerCell = document.createElement("span");
            playerCell.className = "leaderboard-player";
            const name = document.createElement("b");
            name.textContent = entry.alias;
            const meta = document.createElement("small");
            meta.textContent = `${translate("leaderboardLevel")} ${entry.level}${entry.emailHash === myHash ? ` · ${translate("leaderboardYou")}` : ""}`;
            playerCell.append(name, meta);
            const scoreCell = document.createElement("span");
            scoreCell.className = "leaderboard-score";
            scoreCell.textContent = localeNumber(entry.score);
            const waveCell = document.createElement("span");
            waveCell.textContent = localeNumber(entry.wave);
            const levelCell = document.createElement("span");
            levelCell.textContent = localeNumber(entry.level);
            const valueCell = document.createElement("span");
            valueCell.textContent = localeNumber(entry.coins);
            row.append(rankCell, playerCell, scoreCell, waveCell, levelCell, valueCell);
            table.appendChild(row);
          });
        }
        syncLeaderboardProfileFields();
      };
      function leaderboardApiUrl(path = "") {
        if (!LEADERBOARD_API) return "";
        return `${LEADERBOARD_API}${path.startsWith("/") ? path : `/${path}`}`;
      }
      async function leaderboardRequest(url, options = {}) {
        if (!url || typeof window.fetch !== "function") throw new Error("leaderboard-fetch-unavailable");
        const controller = typeof window.AbortController === "function" ? new AbortController() : null;
        const timeout = window.setTimeout(() => controller?.abort(), 4800);
        try {
          const response = await window.fetch(url, {
            credentials: "same-origin",
            cache: "no-store",
            ...options,
            signal: controller?.signal
          });
          if (!response.ok) throw new Error(`leaderboard-http-${response.status}`);
          return await response.json();
        } finally {
          clearTimeout(timeout);
        }
      }
      function announceLeaderboardNotification(entry, external = true) {
        if (!entry) return;
        const key = `${entry.emailHash}:${entry.score}:${entry.wave}:${entry.updatedAt}`;
        if (key === leaderboardLastNotified) return;
        leaderboardLastNotified = key;
        const body = translate("leaderboardRecordBroadcast", { alias: entry.alias });
        if (external) toast(body, 3200);
        if (!external || typeof window.Notification !== "function" || Notification.permission !== "granted") return;
        try {
          new Notification(translate("leaderboardNewRecord", { alias: entry.alias, level: entry.level }), {
            body,
            tag: `buy-button-record-${entry.emailHash}`,
            silent: false
          });
        } catch (_) {}
      }
      function broadcastLeaderboardRecord(entry) {
        if (!entry) return;
        const packet = {
          type: "record",
          sender: leaderboardClientId,
          at: Date.now(),
          entry: { ...entry }
        };
        try { leaderboardChannel?.postMessage(packet); } catch (_) {}
      }
      function acceptIncomingLeaderboardRecord(raw, external = true) {
        const result = upsertLeaderboardEntry(localizeLeaderboardRemoteEntry(raw));
        if (!result.changed) return result;
        persistLeaderboardEntries();
        if (leaderboard && !leaderboard.classList.contains("hidden")) renderLeaderboard();
        if (result.metricImproved && external) announceLeaderboardNotification(result.entry, true);
        return result;
      }
      async function refreshLeaderboard() {
        loadLeaderboardEntries();
        if (!LEADERBOARD_API) {
          setLeaderboardBoardStatus("leaderboardOffline");
          renderLeaderboard();
          return;
        }
        if (leaderboardRefreshing) return;
        leaderboardRefreshing = true;
        setLeaderboardBoardStatus("leaderboardSyncing");
        renderLeaderboard();
        try {
          const payload = await leaderboardRequest(`${leaderboardApiUrl("/leaderboard")}?limit=${LEADERBOARD_LIMIT}`);
          const rows = Array.isArray(payload) ? payload : payload?.entries;
          let changed = false;
          if (Array.isArray(rows)) {
            for (const row of rows) {
              const result = upsertLeaderboardEntry(localizeLeaderboardRemoteEntry(row));
              changed ||= result.changed;
            }
          }
          if (changed) persistLeaderboardEntries();
          setLeaderboardBoardStatus("leaderboardOnline");
        } catch (_) {
          setLeaderboardBoardStatus("leaderboardSubmitFailed");
        } finally {
          leaderboardRefreshing = false;
          renderLeaderboard();
        }
      }
      async function submitLeaderboardRecord(entry) {
        if (!LEADERBOARD_API || !entry) return { skipped: true };
        try {
          const payload = await leaderboardRequest(leaderboardApiUrl("/leaderboard"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alias: entry.alias,
              playerHash: entry.emailHash,
              score: entry.score,
              wave: entry.wave,
              coins: entry.coins,
              level: entry.level
            })
           });
          const remoteEntry = payload?.entry || (payload?.playerHash ? payload : null);
          if (remoteEntry) {
            const result = upsertLeaderboardEntry(localizeLeaderboardRemoteEntry(remoteEntry));
            if (result.changed) persistLeaderboardEntries();
          }
          setLeaderboardBoardStatus("leaderboardOnline");
          if (leaderboard && !leaderboard.classList.contains("hidden")) renderLeaderboard();
          return { ok: true, payload };
        } catch (_) {
          setLeaderboardBoardStatus("leaderboardSubmitFailed");
          return { ok: false };
        }
      }
      function connectLeaderboardTransport() {
        if (leaderboardTransportReady) return;
        leaderboardTransportReady = true;
        try {
          if (typeof window.BroadcastChannel === "function") {
            leaderboardChannel = new BroadcastChannel(LEADERBOARD_CHANNEL_NAME);
            leaderboardChannel.onmessage = (event) => {
              const packet = event?.data;
              if (!packet || packet.sender === leaderboardClientId || packet.type !== "record") return;
              acceptIncomingLeaderboardRecord(packet.entry, true);
            };
          }
        } catch (_) {
          leaderboardChannel = null;
        }
        window.addEventListener("storage", (event) => {
          if (event.key === LEADERBOARD_STORAGE_KEY && event.newValue) {
            const before = leaderboardEntries[0]?.updatedAt || 0;
            loadLeaderboardEntries();
            const after = leaderboardEntries[0]?.updatedAt || 0;
            if (after !== before && leaderboard && !leaderboard.classList.contains("hidden")) renderLeaderboard();
          }
          if (event.key === LEADERBOARD_PROFILE_KEY) {
            loadLeaderboardProfile();
            syncLeaderboardProfileFields();
            if (leaderboard && !leaderboard.classList.contains("hidden")) renderLeaderboard();
          }
        });
        window.addEventListener("bb:telegram-account", () => {
          const player = leaderboardTelegramPlayer();
          if (player && !leaderboardProfile.alias) {
            const alias = normalizeLeaderboardAlias(player.publicAlias || [player.firstName, player.lastName].filter(Boolean).join(" "));
            if (alias) {
              leaderboardProfile = { alias };
              persistLeaderboardProfile();
            }
          }
          syncLeaderboardProfileFields();
          if (leaderboard && !leaderboard.classList.contains("hidden")) renderLeaderboard();
        });
        if (window.BUY_BUTTON_LEADERBOARD_STREAM && typeof window.EventSource === "function") {
          try {
            leaderboardEventSource = new EventSource(`${leaderboardApiUrl("/leaderboard/stream")}?client=${encodeURIComponent(leaderboardClientId)}`);
            leaderboardEventSource.onmessage = (event) => {
              const payload = parseLeaderboardPayload(event?.data);
              const row = payload?.entry || payload;
              const result = acceptIncomingLeaderboardRecord(row, true);
              if (result.metricImproved) setLeaderboardBoardStatus("leaderboardOnline");
            };
            leaderboardEventSource.onerror = () => {
              // Keep the board usable if an SSE endpoint is not configured.
              if (!leaderboardRefreshing) setLeaderboardBoardStatus("leaderboardSubmitFailed");
            };
          } catch (_) {
            leaderboardEventSource = null;
          }
        }
        window.addEventListener("beforeunload", () => {
          try { leaderboardEventSource?.close(); } catch (_) {}
          try { leaderboardChannel?.close(); } catch (_) {}
        }, { once: true });
      }
      function saveLeaderboardProfile() {
        const alias = normalizeLeaderboardAlias($("leaderboardAlias")?.value);
        const effectiveAlias = alias || leaderboardEffectiveAlias();
        if (!effectiveAlias) {
          setLeaderboardProfileStatus(translate("leaderboardNeedProfile"));
          $("leaderboardAlias")?.focus();
          return false;
        }
        leaderboardProfile = { alias: effectiveAlias };
        persistLeaderboardProfile();
        syncLeaderboardProfileFields();
        setLeaderboardProfileStatus(`${translate("leaderboardProfileSaved")} // ${leaderboardIdentityLabel()}`, 4200);
        renderLeaderboard();
        buttonTone(620, .1, "triangle", .025);
        return true;
      }
      function clearLeaderboardProfile() {
        leaderboardProfile = { alias: "" };
        try { window.localStorage?.removeItem(LEADERBOARD_PROFILE_KEY); } catch (_) {}
        try { window.sessionStorage?.removeItem(LEADERBOARD_PROFILE_KEY); } catch (_) {}
        if (!leaderboardTelegramPlayer()) {
          try { window.localStorage?.removeItem(LEADERBOARD_GUEST_ID_KEY); } catch (_) {}
        }
        syncLeaderboardProfileFields();
        setLeaderboardProfileStatus(translate("leaderboardProfileCleared"), 2600);
        renderLeaderboard();
        buttonTone(280, .08, "square", .02);
      }
      function openLeaderboard() {
        loadLeaderboardProfile();
        loadLeaderboardEntries();
        clearInput();
        setLayer(leaderboard, true);
        setLeaderboardBoardStatus(LEADERBOARD_API ? "leaderboardOnline" : "leaderboardOffline");
        renderLeaderboard();
        void refreshLeaderboard();
      }
      function closeLeaderboard() {
        setLayer(leaderboard, false);
        clearInput();
      }
      async function enableLeaderboardNotifications() {
        if (typeof window.Notification !== "function") {
          setLeaderboardProfileStatus(translate("leaderboardNotificationBlocked"));
          return;
        }
        let permission = Notification.permission;
        try {
          if (permission === "default") permission = await Notification.requestPermission();
        } catch (_) {
          permission = "denied";
        }
        syncLeaderboardProfileFields();
        if (permission === "granted") {
          setLeaderboardProfileStatus(translate("leaderboardNotificationEnabled"), 2600);
          buttonTone(760, .1, "sine", .025);
        } else {
          setLeaderboardProfileStatus(translate("leaderboardNotificationBlocked"));
        }
      }
      openLeaderboardPanel = openLeaderboard;
      closeLeaderboardPanel = closeLeaderboard;
      refreshLeaderboardPanel = refreshLeaderboard;
      enableLeaderboardNotificationsPanel = enableLeaderboardNotifications;
      saveLeaderboardProfilePanel = saveLeaderboardProfile;
      clearLeaderboardProfilePanel = clearLeaderboardProfile;
      async function claimLeaderboardRecord(run) {
        const playerHash = leaderboardProfileHash();
        const alias = leaderboardEffectiveAlias();
        if (!playerHash || !alias) {
          if ($("recordClaimStatus")) $("recordClaimStatus").textContent = translate("leaderboardNeedProfile");
          return { claimed: false, reason: "profile" };
        }
        if (!leaderboardProfile.alias) {
          leaderboardProfile = { alias };
          persistLeaderboardProfile();
          syncLeaderboardProfileFields();
        }
        const candidate = normalizeLeaderboardEntry({
          id: playerHash,
          alias,
          emailHash: playerHash,
          score: run?.score,
          wave: run?.wave,
          coins: run?.coins,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
        const result = upsertLeaderboardEntry(candidate);
        if (result.changed) persistLeaderboardEntries();
        const rank = result.rank || leaderboardRankFor(playerHash) || 0;
        if ($("recordClaimStatus")) $("recordClaimStatus").textContent = translate("leaderboardSaved", { rank, level: result.entry?.level || candidate.level });
        if (leaderboard && !leaderboard.classList.contains("hidden")) renderLeaderboard();
        if (result.metricImproved) {
          broadcastLeaderboardRecord(result.entry);
          if (result.isLeader) {
            toast(translate("leaderboardNewLeader", { alias: result.entry.alias }), 3400);
          } else {
            toast(translate("leaderboardNewRecord", { alias: result.entry.alias, level: result.entry.level }), 3000);
          }
        }
        if (result.changed) await submitLeaderboardRecord(result.entry);
        return { claimed: true, ...result };
      }
      loadLeaderboardProfile();
      loadLeaderboardEntries();
      connectLeaderboardTransport();

      const extraUpgrades = [
        { key: "maxEnergy", title: "DEEPER BATTERY", icon: "EN", desc: "+18 maximum energy and a full recharge. Abilities come back harder.", base: 48, max: 8 },
        { key: "shield", title: "BLUE CHIP SHIELD", icon: "SH", desc: "+18 shield capacity and refill it now. Survive a bad fill.", base: 64, max: 7 },
        { key: "crit", title: "VOLATILE EDGE", icon: "CR", desc: "+5% chance for a 2.2x critical hit. The market can surprise both ways.", base: 72, max: 8 },
        { key: "combo", title: "MOMENTUM LOOP", icon: "CO", desc: "Combos decay slower and pay more. Keep the streak alive.", base: 58, max: 7 },
        { key: "pickup", title: "OPEN INTEREST", icon: "OI", desc: "Pull coins and repairs from much farther away.", base: 52, max: 7 }
      ];
      for (const upgrade of extraUpgrades) {
        if (!upgradeLevels[upgrade.key]) {
          upgrades.push(upgrade);
          upgradeLevels[upgrade.key] = 0;
        }
      }
      player.xp = 0;
      player.level = 1;
      player.xpToNext = 100;
      player.crit = 0;
      player.comboPower = 1;
      player.comboDecay = 1;
      player.pickupRadius = 95;
      player.maxShield = 0;
      player.levelQueue = 0;
      let levelReturnState = "playing";

      const patchBaseReset = resetRun;
      const patchBaseEndRun = endRun;
      const patchBaseKillEnemy = killEnemy;
      const patchBaseHitEnemy = hitEnemy;
      const patchBaseUpdate = update;
      const patchBaseSyncHud = syncHud;

      function resetProgression() {
        player.xp = 0;
        player.level = 1;
        player.xpToNext = 100;
        player.crit = 0;
        player.comboPower = 1;
        player.comboDecay = 1;
        player.pickupRadius = 95;
        player.maxShield = 0;
        player.levelQueue = 0;
        aimAssist = false;
        archive.autoFire = false;
      }

      resetRun = function() {
        clearRunSave();
        runSaveEntityIdCounter = 1;
        patchBaseReset();
        resetProgression();
        selectEggPowerLoadout();
        player.shield = player.maxShield;
        refreshArchiveUi();
        syncHud();
      };

      function xpForEnemy(enemy) {
        return Math.max(4, Math.round((enemy.value || 4) * 2.2 + (enemy.elite ? 24 : 0) + (enemy.boss ? 140 : 0)));
      }
      function gainXp(amount) {
        if (state !== "playing" || !Number.isFinite(amount)) return;
        player.xp = Math.max(0, Number(player.xp) || 0) + Math.max(0, Math.min(100000, amount));
        let levelGuard = 0;
        while (player.xp >= player.xpToNext && levelGuard++ < 24) {
          player.xp -= player.xpToNext;
          player.level++;
          player.xpToNext = Math.round(100 + (player.level - 1) * 42);
          player.levelQueue++;
        }
        // A corrupted save or an extreme reward must never trap the frame in
        // an endless level-up loop.
        if (levelGuard >= 24) {
          player.xp = 0;
          player.xpToNext = Math.max(100, Math.round(100 + (player.level - 1) * 42));
        }
        syncHud();
      }

      killEnemy = function(enemy) {
        const wasAlive = !!enemy?.alive;
        const wasBoss = !!enemy?.boss;
        const scoreBefore = score;
        patchBaseKillEnemy(enemy);
        if (wasAlive) {
          // Mutators and wave contracts change the score economy, not the
          // player's ability to buy every patch immediately.  Apply the
          // premium to score while keeping coin drops intentionally scarce.
          const scoreScale = (activeRunMutator?.scoreMultiplier || 1) * (activeWaveContract?.scoreMultiplier || 1);
          const baseScoreDelta = score - scoreBefore;
          if (baseScoreDelta > 0 && scoreScale > 1) score += Math.round(baseScoreDelta * (scoreScale - 1));
          gainXp(xpForEnemy(enemy));
          mutatorKillBonus(enemy);
          triggerEggKillPower(enemy);
          if (wasBoss) {
            bossRewardFor(enemy);
            scammerPayoutFor(enemy);
          }
        }
      };

      hitEnemy = function(enemy, damage, bullet) {
        if (!enemy?.alive || !Number.isFinite(damage)) return;
        const impact = bullet || { color: ACID };
        let dealt = damage;
        if (player.crit > 0 && Math.random() < player.crit) {
          dealt *= 2.2;
          v3Readout = runtimeText("msg.criticalPress", "VOLATILE EDGE // CRITICAL PRESS");
          v3ReadoutTimer = .7;
          particle(enemy.x, enemy.y, "#fff7c2", 12, 250);
          shake = Math.max(shake, 8);
        }
        if (enemy?.bossAffix?.key === "fortified" && enemy.armorTimer > 0) dealt *= .58;
        if (enemy?.bossAffix?.key === "phaseShift" && enemy.shiftFlash > 0) dealt *= .24;
        if (enemy?.scammerBoss && enemy.scammerShieldTimer > 0) {
          dealt *= .34;
          if (!enemy.scammerShieldNoticed) {
            enemy.scammerShieldNoticed = true;
            v3Say(runtimeText("msg.scammerShield", "SCAMMER // shielded quote. wait for the reveal."), 1.05);
          }
        } else if (enemy?.scammerBoss) {
          enemy.scammerShieldNoticed = false;
        }
        if (enemy?.boss && enemy.guardWindow > 0 && enemy.armorTimer <= 0 && enemy.shiftFlash <= 0) {
          dealt *= BOSS_GUARD_DAMAGE_MULTIPLIER;
        }
        patchBaseHitEnemy(enemy, dealt, impact);
      };

      function upgradeCost(upgrade, level) {
        return Math.round(upgrade.base * Math.pow(1.27, level));
      }
      function applyShopUpgrade(key) {
        if (key === "range") player.range = Math.min(playerRangeLimit(), player.range * 1.18);
        if (key === "damage") player.damage = applySoftGrowth(player.damage, 1.16, PLAYER_DAMAGE_CAP);
        if (key === "fireRate") player.fireRate = applySoftGrowth(player.fireRate, 1.12, PLAYER_FIRE_RATE_CAP);
        if (key === "maxHp") { player.maxHp += 18; player.hp = Math.min(player.maxHp, player.hp + 30); }
        if (key === "speed") player.speed *= 1.09;
        if (key === "bombRadius") player.bombRadius *= 1.18;
        if (key === "dashStack") {
          v3DashMax++;
          player.maxEnergy += 8;
          player.energy = Math.min(player.maxEnergy, player.energy + 8);
          syncDashBudget();
        }
        if (key === "magnet") player.pickupRadius += 48;
        if (key === "overdrive") {
          player.speed *= 1.06;
          player.fireRate = applySoftGrowth(player.fireRate, 1.06, PLAYER_FIRE_RATE_CAP);
          player.ability.dash = Math.min(player.ability.dash, .08);
        }
        if (key === "maxEnergy") { player.maxEnergy += 18; player.energy = player.maxEnergy; }
        if (key === "shield") { player.maxShield += 18; player.shield = player.maxShield; }
        if (key === "crit") player.crit = Math.min(.42, player.crit + .05);
        if (key === "combo") { player.comboPower += .12; player.comboDecay *= .86; }
        if (key === "pickup") player.pickupRadius += 78;
        const upgradeColors = { range: CYAN, damage: HOT, fireRate: ACID, maxHp: VIOLET, speed: CYAN, bombRadius: HOT, dashStack: CYAN, magnet: ACID, overdrive: "#fff7c2", maxEnergy: VIOLET, shield: CYAN, crit: HOT, combo: ACID, pickup: "#9dff72" };
        triggerUpgradeFx(upgradeColors[key] || ACID);
      }

      buyUpgrade = function(key, requestedCost) {
        const upgrade = upgrades.find((item) => item.key === key);
        if (!upgrade) return;
        const level = upgradeLevels[key] || 0;
        const cost = requestedCost || upgradeCost(upgrade, level);
        if (coins < cost || level >= upgrade.max) {
          toast(level >= upgrade.max
            ? runtimeText("msg.patchMaxed", "PATCH MAXED // SIGNAL PEAK")
            : runtimeText("msg.notEnough", "NOT ENOUGH RECOVERED VALUE"), 1200);
          return;
        }
        coins -= cost;
        upgradeLevels[key] = level + 1;
        applyShopUpgrade(key);
        const upgradeTitle = localizedItemField("upgrade", upgrade, "title", upgrade.title);
        toast(`${upgradeTitle} ${translate("online")} // ${translate("levelShort")} ${upgradeLevels[key]}`, 1300);
        buttonTone(520 + upgradeLevels[key] * 32, .1, "triangle", .03);
        renderUpgrades();
        syncHud();
        saveRunSnapshotHook?.("shop-upgrade", true);
      };

      function weaponUpgradeCost(key, level = weaponUpgradeLevels[key] || 0) {
        const def = weaponUpgradeDefs[key];
        // Eight levels need to be reachable before the Wave 20 wall. The
        // price still rises every stage, but no longer turns the final two
        // hardware milestones into a purely theoretical purchase.
        return def ? Math.round(def.base * Math.pow(1.38, level)) : Infinity;
      }

      function buyWeaponUpgrade(key) {
        const weapon = weapons.find((item) => item.key === key);
        const def = weaponUpgradeDefs[key];
        if (!weapon || !def) return;
        const level = weaponUpgradeLevels[key] || 0;
        const cost = weaponUpgradeCost(key, level);
        if (level >= def.max) {
          toast(runtimeText("status.weaponPatchMaxed", "WEAPON PATCH MAXED // SIGNAL PEAK"), 1300);
          return;
        }
        if (coins < cost) {
          toast(runtimeText("msg.notEnough", "NOT ENOUGH RECOVERED VALUE"), 1200);
          buttonTone(180, .08, "square", .018);
          return;
        }
        coins -= cost;
        weaponUpgradeLevels[key] = level + 1;
        triggerUpgradeFx(def.color);
        const weaponName = localizedWeaponName(weapons.indexOf(weapon), weapon.name);
        const weaponTag = localizedWeaponUpgradeField(key, def, "tag", def.tag);
        toast(`${weaponName} // ${weaponTag} ${translate("levelShort")} ${weaponUpgradeLevels[key]}`, 1400);
        buttonTone(720 + weaponUpgradeLevels[key] * 34, .1, "triangle", .032);
        renderUpgrades();
        syncHud();
        saveRunSnapshotHook?.("weapon-upgrade", true);
      }

      renderUpgrades = function() {
        const grid = $("upgradeGrid");
        if (!grid) return;
        grid.innerHTML = "";
        upgrades.forEach((upgrade) => {
          const level = upgradeLevels[upgrade.key] || 0;
          const cost = upgradeCost(upgrade, level);
          const card = document.createElement("article");
          card.className = "upgrade-card";
          const meter = Math.round(level / upgrade.max * 100);
          const upgradeTitle = localizedItemField("upgrade", upgrade, "title", upgrade.title);
          const upgradeDesc = localizedItemField("upgrade", upgrade, "desc", upgrade.desc);
          card.innerHTML = `
            <div class="upgrade-topline"><div style="font-size:20px;color:var(--acid)">${upgrade.icon || "UP"}</div><div class="upgrade-level">${translate("levelShort")} ${level}/${upgrade.max}</div></div>
            <div class="upgrade-meter"><i style="width:${meter}%"></i></div>
            <h3>${upgradeTitle}</h3>
            <p>${upgradeDesc}</p>
            <button class="upgrade-btn" type="button" ${level >= upgrade.max || coins < cost ? "disabled" : ""}>${translate("patch")} // ${level >= upgrade.max ? translate("max") : `${cost} ◈`}</button>`;
          card.querySelector("button").addEventListener("click", () => buyUpgrade(upgrade.key, cost));
          grid.appendChild(card);
        });
        const weaponGrid = $("weaponUpgradeGrid");
        if (weaponGrid) {
          weaponGrid.innerHTML = "";
          weapons.forEach((weapon, index) => {
            const def = weaponUpgradeDefs[weapon.key];
            const level = weaponUpgradeLevels[weapon.key] || 0;
            const cost = weaponUpgradeCost(weapon.key, level);
            const equipped = player.weapon === index;
            const meter = Math.round(level / def.max * 100);
            const card = document.createElement("article");
            card.className = `upgrade-card${equipped ? " is-equipped" : ""}`;
            card.style.setProperty("--weapon-color", def.color);
            const weaponTag = localizedWeaponUpgradeField(weapon.key, def, "tag", def.tag);
            const weaponTitle = localizedWeaponUpgradeField(weapon.key, def, "title", def.title);
            const weaponDesc = localizedWeaponUpgradeField(weapon.key, def, "desc", def.desc);
            const weaponName = localizedWeaponName(index, weapon.name);
            const equippedLabel = equipped ? `${runtimeText("ui.equipped", "EQUIPPED")} // ` : "";
            const profile = weaponProfile(index);
            const milestone = weaponUpgradeMilestone(level);
            const statLine = weaponProfileStatLine(index);
            card.innerHTML = `
               <div class="upgrade-topline">
                <div style="font-size:11px;letter-spacing:.12em;color:${def.color}">${pad2(index + 1)} // ${weaponTag}</div>
                <div class="upgrade-level">${translate("levelShort")} ${level}/${def.max}</div>
              </div>
              <div class="upgrade-meter"><i style="width:${meter}%;background:${def.color}"></i></div>
              <h3>${weaponTitle}</h3>
              <p>${weaponDesc}<br /><span style="color:${def.color}">${equippedLabel}${weaponName}</span><br /><span style="color:#e9f6d4;font-size:9px">${statLine}</span><br /><span style="color:${def.color};font-size:9px">NEXT ${milestone.at} // ${milestone.title} — ${milestone.detail}</span></p>
              <button class="upgrade-btn" type="button" ${level >= def.max || coins < cost ? "disabled" : ""}>${translate("patch")} // ${level >= def.max ? translate("max") : `${cost} ◈`}</button>`;
            card.querySelector("button").addEventListener("click", () => buyWeaponUpgrade(weapon.key));
            weaponGrid.appendChild(card);
          });
        }
        if ($("shopCoins")) $("shopCoins").textContent = Math.floor(coins);
      };

      const levelChoiceLocale = {
        hardPress: { title: "HARD PRESS", tag: "DAMAGE", desc: "Controlled weapon growth with a soft power ceiling. Make every click count." },
        rapidRoute: { title: "RAPID ROUTE", tag: "FIRE RATE", desc: "Controlled fire-rate growth plus a small energy refill." },
        ghostLiquidity: { title: "GHOST LIQUIDITY", tag: "MOBILITY", desc: "+14% movement speed and a burst of dash energy." },
        shieldDividend: { title: "SHIELD DIVIDEND", tag: "DEFENSE", desc: "+24 shield capacity and refill it immediately." },
        deepBattery: { title: "DEEP BATTERY", tag: "ENERGY", desc: "+24 max energy and recharge all abilities by 15%." },
        openInterest: { title: "OPEN INTEREST", tag: "COLLECTION", desc: "Coins and repairs fly in from +130 range." }
      };
      const localizedChoice = (choice) => {
        const base = levelChoiceLocale[choice.key] || choice;
        return {
          ...choice,
          title: localizedChoiceField(choice, "title", base.title),
          tag: localizedChoiceField(choice, "tag", base.tag),
          desc: localizedChoiceField(choice, "desc", base.desc)
        };
      };

      const levelChoices = [
        { key: "hardPress", title: "HARD PRESS", tag: "DAMAGE", desc: "Controlled weapon growth with a soft power ceiling. Make every click count.", apply() { player.damage = applySoftGrowth(player.damage, 1.24, PLAYER_DAMAGE_CAP); } },
        { key: "rapidRoute", title: "RAPID ROUTE", tag: "FIRE RATE", desc: "Controlled fire-rate growth plus a small energy refill.", apply() { player.fireRate = applySoftGrowth(player.fireRate, 1.18, PLAYER_FIRE_RATE_CAP); player.energy = Math.min(player.maxEnergy, player.energy + 25); } },
        { key: "ghostLiquidity", title: "GHOST LIQUIDITY", tag: "MOBILITY", desc: "+14% movement speed and a burst of dash energy.", apply() { player.speed *= 1.14; player.energy = Math.min(player.maxEnergy, player.energy + DASH_ENERGY_COST * 1.5); syncDashBudget(); player.invuln = Math.max(player.invuln, .35); } },
        { key: "shieldDividend", title: "SHIELD DIVIDEND", tag: "DEFENSE", desc: "+24 shield capacity and refill it immediately.", apply() { player.maxShield += 24; player.shield = player.maxShield; } },
        { key: "deepBattery", title: "DEEP BATTERY", tag: "ENERGY", desc: "+24 max energy and recharge all abilities by 15%.", apply() { player.maxEnergy += 24; player.energy = player.maxEnergy; for (const key of Object.keys(player.ability)) player.ability[key] *= .85; } },
        { key: "openInterest", title: "OPEN INTEREST", tag: "COLLECTION", desc: "Coins and repairs fly in from +130 range.", apply() { player.pickupRadius += 130; } }
      ];
      let activeLevelChoiceKeys = [];
      function openLevelUp(returnToShop = false) {
        if (state !== "playing" && state !== "shop") return;
        levelReturnState = returnToShop ? "shop" : "playing";
        state = "levelup";
        setLayer(shop, false);
        ui.classList.remove("show");
        setLayer(levelup, true);
        clearInput();
        renderLevelChoices();
        buttonTone(660, .16, "sine", .04);
      }
      function renderLevelChoices() {
        const grid = $("levelupGrid");
        if (!grid) return;
        grid.innerHTML = "";
        const savedPool = activeLevelChoiceKeys
          .map((key) => levelChoices.find((choice) => choice.key === key))
          .filter(Boolean);
        const pool = savedPool.length >= Math.min(3, levelChoices.length)
          ? savedPool.slice(0, 3)
          : levelChoices.slice().sort(() => Math.random() - .5).slice(0, 3);
        activeLevelChoiceKeys = pool.map((choice) => choice.key);
        pool.forEach((choice) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "level-choice";
          const localized = localizedChoice(choice);
          button.innerHTML = `<small>${localized.tag}</small><b>${localized.title}</b><span>${localized.desc}</span>`;
          button.addEventListener("click", () => {
            choice.apply();
            player.levelQueue = Math.max(0, player.levelQueue - 1);
            toast(runtimeText("msg.choiceInstalled", `${localized.title} INSTALLED`, { choice: localized.title }), 1300);
            buttonTone(820, .12, "triangle", .035);
            if (player.levelQueue > 0) {
              activeLevelChoiceKeys = [];
              renderLevelChoices();
            } else {
              activeLevelChoiceKeys = [];
              setLayer(levelup, false);
              if (levelReturnState === "shop") {
                setLayer(shop, true);
                state = "shop";
                renderUpgrades();
              } else {
                ui.classList.add("show");
                state = "playing";
              }
              syncHud();
              saveRunSnapshotHook?.("level-choice", true);
            }
          });
          grid.appendChild(button);
        });
        if ($("levelProgress")) $("levelProgress").textContent = runtimeText("status.levelProgress", `LEVEL ${player.level} // ${Math.floor(player.xp)}/${player.xpToNext} XP // CHOOSE ONE`, {
          level: player.level,
          xp: Math.floor(player.xp),
          next: player.xpToNext
        });
        saveRunSnapshotHook?.("levelup", true);
      }

      // CHECKPOINT CORE // crash-safe, versioned, resumable run state.
      // The score archive is intentionally separate: this slot represents
      // only the unfinished run and is removed as soon as the run ends or a
      // genuinely new run is deployed.
      const RUN_SAVE_KEY = "buy_button_signal_checkpoint_v1";
      const RUN_SAVE_BACKUP_KEY = "buy_button_signal_checkpoint_backup_v1";
      const RUN_SAVE_SESSION_KEY = "buy_button_signal_checkpoint_session_v1";
      const RUN_SAVE_SESSION_BACKUP_KEY = "buy_button_signal_checkpoint_session_backup_v1";
      const RUN_SAVE_VERSION = 1;
      const RUN_SAVE_INTERVAL = 1250;
      const RUN_SAVE_MAX_AGE = 1000 * 60 * 60 * 24 * 90;
      const RUN_SAVE_MAX_BYTES = 750000;
      let runSaveEntityIdCounter = 1;
      let runSaveLastAt = 0;
      let runSaveNextAt = 0;
      let runSaveBusy = false;
      let runSaveRestoring = false;
      let runSaveCached = null;

      const runSaveStates = new Set(["playing", "pause", "shop", "levelup"]);
      const runSaveNumber = (value, fallback = 0) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
      };
      const runSaveClone = (value, fallback = null) => {
        try {
          return JSON.parse(JSON.stringify(value, (key, candidate) => {
            if (typeof candidate === "function") return undefined;
            return candidate;
          }));
        } catch (_) {
          return fallback;
        }
      };
      const runSaveObject = (value, fallback = null) => {
        const clone = runSaveClone(value, fallback);
        return clone && typeof clone === "object" && !Array.isArray(clone) ? clone : fallback;
      };
      const runSaveObjectRows = (rows) => Array.isArray(rows)
        ? rows.map((row) => runSaveObject(row, null)).filter(Boolean)
        : [];
      const runSaveEntityId = (entity) => {
        if (!entity || typeof entity !== "object") return "";
        let id = String(entity.saveId || "");
        if (!id) {
          id = `e${runSaveEntityIdCounter++}`;
          try { entity.saveId = id; } catch (_) {}
        }
        return id;
      };
      const runSaveHash = (text) => {
        let hash = 2166136261;
        const source = String(text || "");
        for (let index = 0; index < source.length; index++) {
          hash ^= source.charCodeAt(index);
          hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(16).padStart(8, "0");
      };
      const runSaveActive = () => runSaveStates.has(state) && wave > 0;
      const runSaveStorageRead = (key) => {
        const values = [];
        const storages = [];
        try { if (window.localStorage) storages.push(window.localStorage); } catch (_) {}
        try { if (window.sessionStorage) storages.push(window.sessionStorage); } catch (_) {}
        for (const storage of storages) {
          try {
            if (storage && typeof storage.getItem === "function") {
              const raw = storage.getItem(key);
              if (raw) values.push(raw);
            }
          } catch (_) {}
        }
        return values;
      };
      const runSaveStorageRemove = (key) => {
        const storages = [];
        try { if (window.localStorage) storages.push(window.localStorage); } catch (_) {}
        try { if (window.sessionStorage) storages.push(window.sessionStorage); } catch (_) {}
        for (const storage of storages) {
          try { storage?.removeItem?.(key); } catch (_) {}
        }
      };
      const runSaveBullet = (bullet) => {
        if (!bullet || typeof bullet !== "object") return null;
        const row = {};
        for (const [key, value] of Object.entries(bullet)) {
          if (key === "hit" || typeof value === "function" || value === undefined) continue;
          row[key] = value && typeof value === "object" ? runSaveClone(value, null) : value;
        }
        row.hitIds = Array.isArray(bullet.hit)
          ? bullet.hit.map(runSaveEntityId).filter(Boolean)
          : [];
        return row;
      };
      const runSaveEnemy = (enemy) => {
        if (!enemy || typeof enemy !== "object") return null;
        const row = runSaveClone(enemy, {});
        row.saveId = runSaveEntityId(enemy);
        return row;
      };
      const runSaveFiniteAnchor = (anchor) => {
        if (!anchor || !Number.isFinite(Number(anchor.x)) || !Number.isFinite(Number(anchor.y))) return null;
        return { x: Number(anchor.x), y: Number(anchor.y) };
      };
      // Effects use performance.now(), which resets when the page reloads.
      // Save only the remaining lifetime; restoring an old absolute timestamp
      // can otherwise generate impossible negative draw radii.
      const RUN_SAVE_FX_MAX_MS = 8000;
      const runSaveEffectRemaining = (until, max = RUN_SAVE_FX_MAX_MS) => {
        const remaining = Number(until) - nowMs();
        return Number.isFinite(remaining) ? Math.max(0, Math.min(max, remaining)) : 0;
      };
      const runSavePlayerFx = () => ({
        weaponFlashRemaining: runSaveEffectRemaining(playerFx.weaponFlashUntil, 6000),
        dashFlashRemaining: runSaveEffectRemaining(playerFx.dashFlashUntil, 1200),
        bombFlashRemaining: runSaveEffectRemaining(playerFx.bombFlashUntil, 1400),
        upgradeFlashRemaining: runSaveEffectRemaining(playerFx.upgradeFlashUntil, 1150),
        upgradeColor: typeof playerFx.upgradeColor === "string" ? playerFx.upgradeColor : ACID,
        upgradePulse: runSaveNumber(playerFx.upgradePulse),
        weaponIndex: Math.max(0, Math.min(weapons.length - 1, Math.floor(runSaveNumber(playerFx.weaponIndex)))),
        dashAngle: runSaveNumber(playerFx.dashAngle, -Math.PI / 2)
      });
      const runSaveEnvelope = (payload) => {
        const body = JSON.stringify(payload);
        return JSON.stringify({ version: RUN_SAVE_VERSION, checksum: runSaveHash(body), body });
      };
      const runSaveParse = (raw) => {
        try {
          if (typeof raw !== "string" || raw.length > RUN_SAVE_MAX_BYTES) return null;
          const envelope = JSON.parse(raw);
          if (!envelope || envelope.version !== RUN_SAVE_VERSION || typeof envelope.body !== "string") return null;
          if (runSaveHash(envelope.body) !== String(envelope.checksum || "")) return null;
          const payload = JSON.parse(envelope.body);
          if (!payload || payload.schema !== RUN_SAVE_VERSION) return null;
          if (!runSaveStates.has(payload.state)) return null;
          if (!Number.isFinite(Number(payload.savedAt)) || Date.now() - Number(payload.savedAt) > RUN_SAVE_MAX_AGE) return null;
          if (!Number.isFinite(Number(payload.wave)) || Number(payload.wave) < 1 || Number(payload.wave) > 100000) return null;
          if (!payload.player || typeof payload.player !== "object" || Array.isArray(payload.player)) return null;
          if (!Array.isArray(payload.enemies) || !Array.isArray(payload.bullets) || !Array.isArray(payload.enemyBullets)) return null;
          if (
            payload.enemies.length > MAX_ENEMIES * 2
            || payload.bullets.length > MAX_PLAYER_BULLETS * 2
            || payload.enemyBullets.length > MAX_ENEMY_BULLETS * 2
            || (Array.isArray(payload.particles) && payload.particles.length > MAX_PARTICLES * 2)
            || (Array.isArray(payload.pickups) && payload.pickups.length > MAX_PICKUPS * 2)
            || (Array.isArray(payload.chainArcs) && payload.chainArcs.length > MAX_CHAIN_ARCS * 2)
            || (Array.isArray(payload.v3BlastRings) && payload.v3BlastRings.length > 128)
          ) return null;
          return payload;
        } catch (_) {
          return null;
        }
      };
      function readRunSave() {
        const candidates = [];
        const keys = [
          RUN_SAVE_KEY,
          RUN_SAVE_BACKUP_KEY,
          RUN_SAVE_SESSION_KEY,
          RUN_SAVE_SESSION_BACKUP_KEY
        ];
        for (const key of keys) {
          for (const raw of runSaveStorageRead(key)) {
            const parsed = runSaveParse(raw);
            if (parsed) candidates.push(parsed);
          }
        }
        candidates.sort((a, b) => runSaveNumber(b.savedAt) - runSaveNumber(a.savedAt));
        runSaveCached = candidates[0] || null;
        if (!runSaveCached) {
          // A malformed or expired checkpoint must never keep poisoning the
          // next boot. Valid records are untouched; invalid slots are safe to
          // remove because the checksum has already rejected them.
          for (const key of keys) {
            for (const raw of runSaveStorageRead(key)) {
              if (!runSaveParse(raw)) runSaveStorageRemove(key);
            }
          }
        }
        return runSaveCached;
      }
      function formatRunSaveTime(timestamp) {
        try {
          return new Date(Number(timestamp)).toLocaleTimeString(currentLocale, { hour: "2-digit", minute: "2-digit" });
        } catch (_) {
          return "--:--";
        }
      }
      function renderRunSaveUi() {
        const panel = $("runSavePanel");
        const summary = $("runSaveSummary");
        if (!panel) return;
        const payload = runSaveCached || readRunSave();
        const visible = !!payload && runSaveStates.has(payload.state);
        panel.hidden = !visible;
        if (visible && summary) {
          summary.textContent = translate("checkpointSummary", {
            wave: localeNumber(Math.floor(runSaveNumber(payload.wave))),
            score: localeNumber(Math.floor(runSaveNumber(payload.score))),
            coins: localeNumber(Math.floor(runSaveNumber(payload.coins))),
            time: formatRunSaveTime(payload.savedAt)
          });
        } else if (summary) {
          summary.textContent = "";
        }
      }
      function clearRunSave() {
        [
          RUN_SAVE_KEY,
          RUN_SAVE_BACKUP_KEY,
          RUN_SAVE_SESSION_KEY,
          RUN_SAVE_SESSION_BACKUP_KEY
        ].forEach(runSaveStorageRemove);
        runSaveCached = null;
        runSaveLastAt = 0;
        runSaveNextAt = 0;
        runSaveEntityIdCounter = 1;
        renderRunSaveUi();
        bbEmitCloudChange("checkpoint", null, Date.now(), { cleared: true });
      }
      const runSaveWrite = (serialized) => {
        let primary = false;
        let backup = false;
        try {
          if (window.localStorage && typeof window.localStorage.setItem === "function") {
            try { window.localStorage.setItem(RUN_SAVE_BACKUP_KEY, serialized); backup = true; } catch (_) {}
            try { window.localStorage.setItem(RUN_SAVE_KEY, serialized); primary = true; } catch (_) {}
          }
        } catch (_) {}
        if (!primary && !backup) {
          try {
            if (window.sessionStorage && typeof window.sessionStorage.setItem === "function") {
              try { window.sessionStorage.setItem(RUN_SAVE_SESSION_BACKUP_KEY, serialized); backup = true; } catch (_) {}
              try { window.sessionStorage.setItem(RUN_SAVE_SESSION_KEY, serialized); primary = true; } catch (_) {}
            }
          } catch (_) {}
        }
        return primary || backup;
      };
      function buildRunSave(reason = "tick") {
        // Assign stable IDs before serializing references held by bullets and
        // lock-on targets. IDs survive array compaction and browser reloads.
        const enemyRows = enemies.map(runSaveEnemy).filter(Boolean);
        const enemyId = (enemy) => enemy ? runSaveEntityId(enemy) : "";
        return {
          schema: RUN_SAVE_VERSION,
          savedAt: Date.now(),
          reason: String(reason || "tick"),
          state,
          wave: Math.max(1, Math.floor(runSaveNumber(wave, 1))),
          waveRemaining: Math.max(0, Math.floor(runSaveNumber(waveRemaining))),
          spawnTimer: runSaveNumber(spawnTimer),
          score: Math.max(0, runSaveNumber(score)),
          coins: Math.max(0, runSaveNumber(coins)),
          combo: Math.max(0, runSaveNumber(combo)),
          comboTimer: runSaveNumber(comboTimer),
          elapsed: Math.max(0, runSaveNumber(elapsed)),
          shake: runSaveNumber(shake),
          storyTimer: runSaveNumber(storyTimer),
          flash: runSaveNumber(flash),
          arenaPulse: runSaveNumber(arenaPulse),
          bossAlive: !!bossAlive,
          combatMaintenanceTimer: runSaveNumber(combatMaintenanceTimer),
          targetCycleIndex: Math.floor(runSaveNumber(targetCycleIndex, -1)),
          player: runSaveClone(player, {}),
          playerFx: runSavePlayerFx(),
          upgradeLevels: runSaveClone(upgradeLevels, {}),
          weaponUpgradeLevels: runSaveClone(weaponUpgradeLevels, {}),
          enemies: enemyRows,
          bullets: bullets.map(runSaveBullet).filter(Boolean),
          enemyBullets: enemyBullets.map((item) => runSaveClone(item, null)).filter(Boolean),
          particles: runSaveClone(particles.slice(-180), []),
          pickups: runSaveClone(pickups, []),
          chainArcs: runSaveClone(chainArcs, []),
          v3BlastRings: runSaveClone(v3BlastRings.slice(-64), []),
          refs: {
            hardLockId: enemyId(hardLockTarget),
            lockId: enemyId(lockTarget),
            bossId: enemyId(v3Boss)
          },
          frontierEvent: runSaveClone(frontierEvent, {}),
          activeRunMutatorKey: activeRunMutator?.key || "",
          activeWaveContractKey: activeWaveContract?.key || "",
          lastRunMutatorKey: lastRunMutatorKey || "",
          lastWaveContractKey: lastWaveContractKey || "",
          lastBossAffixKey: lastBossAffixKey || "",
          runSeed: Math.floor(runSaveNumber(runSeed)),
          bossRewardTimer: runSaveNumber(bossRewardTimer),
          scammerWave: Math.floor(runSaveNumber(scammerWave)),
          scammerSpawnedThisRun: !!scammerSpawnedThisRun,
          legendaryKillsThisRun: Math.floor(runSaveNumber(legendaryKillsThisRun)),
          lastLegendaryAnchor: runSaveFiniteAnchor(lastLegendaryAnchor),
          easterEggRunSpawned: [...easterEggRunSpawned],
          v3SeenTypes: [...v3SeenTypes],
          eggRuntime: {
            active: [...eggRuntime.active],
            order: [...eggRuntime.order],
            primary: eggRuntime.primary || "",
            killCount: Math.floor(runSaveNumber(eggRuntime.killCount)),
            darkPulse: runSaveNumber(eggRuntime.darkPulse),
            chainCooldown: runSaveNumber(eggRuntime.chainCooldown),
            chainProcessing: !!eggRuntime.chainProcessing,
            crowdSurge: runSaveNumber(eggRuntime.crowdSurge),
            dashEchoCooldown: runSaveNumber(eggRuntime.dashEchoCooldown),
            walletCoinMark: runSaveNumber(eggRuntime.walletCoinMark),
            walletShieldBank: runSaveNumber(eggRuntime.walletShieldBank),
            hoodCloak: runSaveNumber(eggRuntime.hoodCloak),
            dipUsed: !!eggRuntime.dipUsed,
            echoCooldown: runSaveNumber(eggRuntime.echoCooldown),
            justUnlocked: eggRuntime.justUnlocked || ""
          },
          v3: {
            spawnBurstTimer: runSaveNumber(v3SpawnBurstTimer),
            dashCharges: Math.floor(runSaveNumber(v3DashCharges)),
            dashMax: Math.floor(runSaveNumber(v3DashMax, 10)),
            dashRecharge: runSaveNumber(v3DashRecharge),
            readout: String(v3Readout || ""),
            readoutTimer: runSaveNumber(v3ReadoutTimer)
          },
          levelReturnState: levelReturnState === "shop" ? "shop" : "playing",
          activeLevelChoiceKeys: [...activeLevelChoiceKeys],
          aimAssist: false
        };
      }
      function saveRunSnapshot(reason = "tick", force = false) {
        if (runSaveRestoring || !runSaveActive() || runSaveBusy) return false;
        const stamp = Date.now();
        if (!force && stamp < runSaveNextAt) return false;
        runSaveBusy = true;
        try {
          const payload = buildRunSave(reason);
          const serialized = runSaveEnvelope(payload);
          const stored = runSaveWrite(serialized);
          if (stored) {
            runSaveCached = payload;
            runSaveLastAt = stamp;
            runSaveNextAt = stamp + RUN_SAVE_INTERVAL;
            renderRunSaveUi();
            bbEmitCloudChange("checkpoint", serialized, payload.savedAt, { cleared: false });
          }
          return stored;
        } catch (error) {
          try { console.warn("[BUY BUTTON] checkpoint write skipped", error); } catch (_) {}
          return false;
        } finally {
          runSaveBusy = false;
        }
      }
      function restoreRunSave(payload) {
        if (!payload || !runSaveStates.has(payload.state)) return false;
        runSaveRestoring = true;
        try {
          clearInput();
          resetEntities();
          v3BlastRings.length = 0;
          state = payload.state;
          wave = Math.max(1, Math.floor(runSaveNumber(payload.wave, 1)));
          waveRemaining = Math.max(0, Math.floor(runSaveNumber(payload.waveRemaining)));
          spawnTimer = runSaveNumber(payload.spawnTimer);
          score = Math.max(0, runSaveNumber(payload.score));
          coins = Math.max(0, runSaveNumber(payload.coins));
          combo = Math.max(0, runSaveNumber(payload.combo));
          comboTimer = runSaveNumber(payload.comboTimer);
          elapsed = Math.max(0, runSaveNumber(payload.elapsed));
          shake = runSaveNumber(payload.shake);
          storyTimer = runSaveNumber(payload.storyTimer);
          flash = runSaveNumber(payload.flash);
          arenaPulse = runSaveNumber(payload.arenaPulse);
          bossAlive = !!payload.bossAlive;
          combatMaintenanceTimer = runSaveNumber(payload.combatMaintenanceTimer);
          targetCycleIndex = Math.floor(runSaveNumber(payload.targetCycleIndex, -1));
          const savedPlayer = runSaveObject(payload.player, {});
          Object.assign(player, {
            x: 0, y: 0, r: 15, hp: 100, maxHp: 100, energy: 100, maxEnergy: 100,
            speed: 235, range: 510, damage: 1, fireRate: 1, bombRadius: 115, shield: 0,
            dash: 0, invuln: 0, weapon: 0, cooldown: 0, surge: 0, kills: 0,
            xp: 0, level: 1, xpToNext: 100, crit: 0, comboPower: 1, comboDecay: 1,
            pickupRadius: 95, maxShield: 0, levelQueue: 0
          }, savedPlayer);
          player.ability = {
            surge: 0,
            dash: 0,
            bomb: 0,
            ...runSaveObject(savedPlayer.ability, {})
          };
          Object.keys(upgradeLevels).forEach((key) => { upgradeLevels[key] = Math.max(0, Math.floor(runSaveNumber(payload.upgradeLevels?.[key]))); });
          Object.keys(weaponUpgradeLevels).forEach((key) => { weaponUpgradeLevels[key] = Math.max(0, Math.floor(runSaveNumber(payload.weaponUpgradeLevels?.[key]))); });
          const savedFx = runSaveObject(payload.playerFx, {});
          const restoredFxNow = nowMs();
          const restoredFxRemaining = (key, max = RUN_SAVE_FX_MAX_MS) =>
            Math.max(0, Math.min(max, runSaveNumber(savedFx[key], 0)));
          Object.assign(playerFx, {
            // Legacy checkpoints stored absolute performance.now() values.
            // They are deliberately expired; current saves store remaining
            // lifetime and are rebased onto this page's clock.
            weaponFlashUntil: restoredFxNow + restoredFxRemaining("weaponFlashRemaining", 6000),
            dashFlashUntil: restoredFxNow + restoredFxRemaining("dashFlashRemaining", 1200),
            bombFlashUntil: restoredFxNow + restoredFxRemaining("bombFlashRemaining", 1400),
            upgradeFlashUntil: restoredFxNow + restoredFxRemaining("upgradeFlashRemaining", 1150),
            upgradeColor: typeof savedFx.upgradeColor === "string" ? savedFx.upgradeColor : ACID,
            upgradePulse: runSaveNumber(savedFx.upgradePulse),
            weaponIndex: Math.max(0, Math.min(weapons.length - 1, Math.floor(runSaveNumber(savedFx.weaponIndex)))),
            dashAngle: runSaveNumber(savedFx.dashAngle, -Math.PI / 2)
          });

          enemies.push(...runSaveObjectRows(payload.enemies));
          bullets.push(...payload.bullets.map((item) => {
            const row = runSaveObject(item, null);
            if (!row) return null;
            row.__runSaveHitIds = Array.isArray(row.hitIds)
              ? row.hitIds.map((id) => String(id)).slice(0, MAX_ENEMIES)
              : [];
            delete row.hitIds;
            row.hit = [];
            return row;
          }).filter(Boolean));
          enemyBullets.push(...runSaveObjectRows(payload.enemyBullets));
          particles.push(...runSaveObjectRows(payload.particles));
          pickups.push(...runSaveObjectRows(payload.pickups));
          chainArcs.push(...runSaveObjectRows(payload.chainArcs));
          v3BlastRings.push(...runSaveObjectRows(payload.v3BlastRings));

          activeRunMutator = runMutatorDefs.find((item) => item.key === payload.activeRunMutatorKey) || null;
          activeWaveContract = waveContractDefs.find((item) => item.key === payload.activeWaveContractKey) || null;
          lastRunMutatorKey = String(payload.lastRunMutatorKey || "");
          lastWaveContractKey = String(payload.lastWaveContractKey || "");
          lastBossAffixKey = String(payload.lastBossAffixKey || "");
          runSeed = Math.floor(runSaveNumber(payload.runSeed));
          bossRewardTimer = runSaveNumber(payload.bossRewardTimer);
          scammerWave = Math.floor(runSaveNumber(payload.scammerWave));
          scammerSpawnedThisRun = !!payload.scammerSpawnedThisRun;
          legendaryKillsThisRun = Math.floor(runSaveNumber(payload.legendaryKillsThisRun));
          lastLegendaryAnchor = runSaveFiniteAnchor(payload.lastLegendaryAnchor);
          easterEggRunSpawned.clear();
          (Array.isArray(payload.easterEggRunSpawned) ? payload.easterEggRunSpawned : []).forEach((id) => {
            if (eggCatalog.some((egg) => egg.id === id)) easterEggRunSpawned.add(id);
          });
          v3SeenTypes.clear();
          (Array.isArray(payload.v3SeenTypes) ? payload.v3SeenTypes : []).forEach((id) => v3SeenTypes.add(String(id)));

          const savedEvent = runSaveObject(payload.frontierEvent, {});
          Object.assign(frontierEvent, { key: "", title: "", color: ACID, timer: 0, cooldown: 0 }, savedEvent || {});
          frontierEvent.timer = runSaveNumber(frontierEvent.timer);
          frontierEvent.cooldown = runSaveNumber(frontierEvent.cooldown);
          if (typeof frontierEvent.color !== "string") frontierEvent.color = ACID;

          const savedEgg = runSaveObject(payload.eggRuntime, {});
          eggRuntime.active.clear();
          (Array.isArray(savedEgg.active) ? savedEgg.active : []).forEach((id) => { if (eggPowerDefs[id]) eggRuntime.active.add(id); });
          eggRuntime.order.length = 0;
          (Array.isArray(savedEgg.order) ? savedEgg.order : []).forEach((id) => { if (eggPowerDefs[id] && !eggRuntime.order.includes(id)) eggRuntime.order.push(id); });
          eggRuntime.primary = eggPowerDefs[savedEgg.primary] ? savedEgg.primary : (eggRuntime.order[0] || "");
          eggRuntime.killCount = Math.floor(runSaveNumber(savedEgg.killCount));
          eggRuntime.darkPulse = runSaveNumber(savedEgg.darkPulse);
          eggRuntime.chainCooldown = runSaveNumber(savedEgg.chainCooldown);
          eggRuntime.chainProcessing = !!savedEgg.chainProcessing;
          eggRuntime.crowdSurge = runSaveNumber(savedEgg.crowdSurge);
          eggRuntime.dashEchoCooldown = runSaveNumber(savedEgg.dashEchoCooldown);
          eggRuntime.walletCoinMark = runSaveNumber(savedEgg.walletCoinMark, coins);
          eggRuntime.walletShieldBank = runSaveNumber(savedEgg.walletShieldBank);
          eggRuntime.hoodCloak = runSaveNumber(savedEgg.hoodCloak);
          eggRuntime.dipUsed = !!savedEgg.dipUsed;
          eggRuntime.echoCooldown = runSaveNumber(savedEgg.echoCooldown);
          eggRuntime.justUnlocked = eggPowerDefs[savedEgg.justUnlocked] ? savedEgg.justUnlocked : "";

          const savedV3 = runSaveObject(payload.v3, {});
          v3SpawnBurstTimer = runSaveNumber(savedV3.spawnBurstTimer);
          v3DashCharges = Math.floor(runSaveNumber(savedV3.dashCharges));
          v3DashMax = Math.max(1, Math.floor(runSaveNumber(savedV3.dashMax, 10)));
          v3DashRecharge = runSaveNumber(savedV3.dashRecharge);
          v3Readout = String(savedV3.readout || "");
          v3ReadoutTimer = runSaveNumber(savedV3.readoutTimer);
          levelReturnState = payload.levelReturnState === "shop" ? "shop" : "playing";
          activeLevelChoiceKeys = (Array.isArray(payload.activeLevelChoiceKeys) ? payload.activeLevelChoiceKeys : [])
            .map((key) => String(key))
            .filter((key) => levelChoices.some((choice) => choice.key === key))
            .slice(0, 3);
          // Never revive legacy auto-fire from an older checkpoint.
          aimAssist = false;
          archive.autoFire = false;
          runSaveEntityIdCounter = 1;
          for (const enemy of enemies) {
            const id = runSaveEntityId(enemy);
            const numeric = Number(String(id).replace(/^e/, ""));
            if (Number.isFinite(numeric)) runSaveEntityIdCounter = Math.max(runSaveEntityIdCounter, numeric + 1);
          }

          // Sanitize before rebuilding references; the guard may compact dead
          // entities, so IDs are safer than array indexes here.
          if (typeof bbRuntimeSanitizeState === "function") bbRuntimeSanitizeState();
          const enemyById = new Map(enemies.map((enemy) => [runSaveEntityId(enemy), enemy]));
          bullets.forEach((bullet) => {
            const ids = Array.isArray(bullet.__runSaveHitIds) ? bullet.__runSaveHitIds : [];
            bullet.hit = ids.map((id) => enemyById.get(String(id))).filter(Boolean);
            delete bullet.__runSaveHitIds;
          });
          const refs = payload.refs || {};
          hardLockTarget = enemyById.get(String(refs.hardLockId || "")) || null;
          lockTarget = enemyById.get(String(refs.lockId || "")) || null;
          v3Boss = enemyById.get(String(refs.bossId || "")) || enemies.find((enemy) => enemy.boss && enemy.alive) || null;

          last = 0;
          accumulator = 0;
          orientationHold = false;
          orientationPromptVisible = false;
          eggHudSignature = "";
          setLayer(menu, false);
          setLayer(briefing, false);
          setLayer(gameover, false);
          setLayer(easterEggLayer, false);
          setLayer(levelup, state === "levelup");
          setLayer(shop, state === "shop");
          setLayer(pause, state === "pause");
          if (state === "playing") {
            ui.classList.add("show");
            stopAmbient();
            startAmbient();
          } else {
            ui.classList.remove("show");
            stopAmbient();
          }
          if (state === "shop") renderUpgrades();
          if (state === "levelup") renderLevelChoices();
          if (activeRunMutator || activeWaveContract) $("runMutatorText").textContent = contractNameLine();
          if (state === "pause") syncSettingsPanel();
          resize();
          requestLandscapeMode(false);
          updateOrientationGuard();
          syncHud();
          refreshEggPowerHud(true);
          return true;
        } catch (error) {
          // A checksum-valid but structurally damaged record must never leave
          // the player in a half-restored combat state.  Fall back to a clean
          // menu; resumeSavedRun() then removes that bad record.
          try {
            clearInput();
            resetEntities();
            v3BlastRings.length = 0;
            hardLockTarget = null;
            lockTarget = null;
            v3Boss = null;
            activeLevelChoiceKeys = [];
            levelReturnState = "playing";
            state = "menu";
            ui.classList.remove("show");
            stopAmbient();
            setLayer(briefing, false);
            setLayer(levelup, false);
            setLayer(shop, false);
            setLayer(pause, false);
            setLayer(gameover, false);
            setLayer(easterEggLayer, false);
            setLayer(menu, true);
          } catch (_) {}
          try { console.warn("[BUY BUTTON] checkpoint restore skipped", error); } catch (_) {}
          return false;
        } finally {
          runSaveRestoring = false;
        }
      }
      function resumeSavedRun() {
        const payload = readRunSave();
        if (!payload || !restoreRunSave(payload)) {
          clearRunSave();
          toast(translate("checkpointInvalid"), 1800);
          return false;
        }
        runSaveCached = payload;
        renderRunSaveUi();
        saveRunSnapshot("resume", true);
        toast(translate("checkpointRestored"), 1900);
        return true;
      }
      saveRunSnapshotHook = saveRunSnapshot;
      clearRunSaveHook = clearRunSave;
      renderRunSaveUiHook = renderRunSaveUi;
      resumeSavedRunHook = resumeSavedRun;
      renderRunSaveUi();

      endRun = function() {
        if (state === "gameover") return;
        clearRunSave();
        const previous = { score: archive.bestScore || 0, wave: archive.bestWave || 0, coins: archive.bestCoins || 0 };
        const newScore = score > previous.score;
        const newWave = wave > previous.wave;
        const newCoins = coins > previous.coins;
        archive.totalRuns = (archive.totalRuns || 0) + 1;
        archive.totalKills = (archive.totalKills || 0) + (player.kills || 0);
        archive.bestScore = Math.max(previous.score, Math.floor(score));
        archive.bestWave = Math.max(previous.wave, Math.floor(wave));
        archive.bestCoins = Math.max(previous.coins, Math.floor(coins));
        archive.bestLevel = Math.max(archive.bestLevel || 0, player.level || 1);
        saveArchive();
        refreshArchiveUi();
        if ($("recordResult")) $("recordResult").textContent = (newScore || newWave || newCoins)
          ? runtimeText("status.newRecord", "NEW RECORD // SIGNAL ARCHIVED")
          : runtimeText("status.runSaved", "RUN SAVED // BEAT YOUR BEST");
        if ($("previousRecord")) $("previousRecord").textContent = runtimeText("status.previousBest", `PREVIOUS BEST // WAVE ${previous.wave} · SCORE ${localeNumber(previous.score)} · VALUE ${localeNumber(previous.coins)}`, {
          wave: previous.wave,
          score: localeNumber(Math.floor(previous.score)),
          value: localeNumber(Math.floor(previous.coins))
        });
        if ($("finalLevel")) $("finalLevel").textContent = player.level || 1;
        patchBaseEndRun();
        if ($("recordClaimStatus")) $("recordClaimStatus").textContent = "";
        void claimLeaderboardRecord({ score: Math.floor(score), wave: Math.floor(wave), coins: Math.floor(coins) });
      };

      update = function(dt) {
        patchBaseUpdate(dt);
        if (player.levelQueue > 0 && state === "playing") openLevelUp(false);
        else if (player.levelQueue > 0 && state === "shop") openLevelUp(true);
        if (state !== "playing") return;
        updateEggPowers(dt);
        bossRewardTimer = Math.max(0, bossRewardTimer - dt);
        player.comboPower ||= 1;
        player.comboDecay ||= 1;
        if (comboTimer > 0) {
          score += dt * Math.max(0, combo - 1) * player.comboPower * 1.4;
        }
        if (player.pickupRadius > 95) {
          for (const pickupItem of pickups) {
            const dx = player.x - pickupItem.x, dy = player.y - pickupItem.y, distance = Math.hypot(dx, dy) || 1;
            if (distance < player.pickupRadius) {
              pickupItem.x += dx * dt * 2.8;
              pickupItem.y += dy * dt * 2.8;
            }
          }
        }
        if (player.maxShield > 0 && player.shield < player.maxShield && player.energy > 70) {
          player.shield = Math.min(player.maxShield, player.shield + dt * .9);
        }
        syncHud();
        saveRunSnapshotHook?.("tick");
      };

      syncHud = function() {
        patchBaseSyncHud();
        if ($("levelText")) $("levelText").textContent = `${translate("levelXp")} ${player.level || 1} // ${Math.floor(player.xp || 0)}/${player.xpToNext || 100} XP`;
        const desktopHint = $("desktopFireHint");
        if (desktopHint) desktopHint.textContent = translate("desktopFireHint");
        if ($("shopCoins") && state === "shop") $("shopCoins").textContent = Math.floor(coins);
        refreshEggPowerHud();
        const mutatorNode = $("runMutatorText");
        if (mutatorNode) {
          mutatorNode.textContent = contractNameLine();
          mutatorNode.style.color = activeWaveContract?.color || activeRunMutator?.color || "";
        }
        const storyVisible = $("storyBanner")?.classList.contains("show");
        const narrativeReadout = storyVisible && v3ReadoutTimer > 0;
        if (bossRewardTimer <= 0 && v3Boss && v3Boss.alive) {
          $("bossPhaseText").textContent = localizedBossPhaseText(v3Boss);
        }
        // A narrative callout and the compact readout carry the same message
        // during wave/boss introductions. Keep only one visible on small
        // screens (and avoid making the desktop HUD say it twice).
        if ($("combatReadout") && narrativeReadout) {
          $("combatReadout").textContent = "";
        }
      };

      const legacyContinueButtons = [...document.querySelectorAll("#shop button")].filter((button) => button.id !== "continueBtn" && /PRESS BUY/.test(button.textContent || ""));
      legacyContinueButtons.forEach((button) => button.remove());
      $("continueBtn")?.addEventListener("click", continueWave);
      $("eggPowerBtn")?.addEventListener("click", (event) => {
        // The button is the reliable touch target: tap to cast, hold Shift
        // while clicking to route to the next discovered power.  Keyboard
        // routing remains on Z so mobile and desktop share the same mental
        // model.
        if (event.shiftKey) cycleEggPower();
        else activateEggEcho();
      });
      const settingsFields = [
        ["zoomRange", "zoom", Number],
        ["masterVolumeRange", "masterVolume", Number],
        ["musicVolumeRange", "musicVolume", Number],
        ["performanceToggle", "performance", Boolean],
        ["effectsToggle", "effects", Boolean],
        ["hapticsToggle", "haptics", Boolean]
      ];
      settingsFields.forEach(([id, key, parser]) => {
        const commitSetting = (event) => {
          gameSettings[key] = parser === Boolean ? event.target.checked : parser(event.target.value);
          if (key === "zoom" && compactDevice) gameSettings.mobileZoomProfile = MOBILE_ZOOM_PROFILE;
          applySettings();
          saveSettings();
          if (key === "masterVolume") buttonTone(430, .045, "sine", .02);
        };
        $(id)?.addEventListener("input", commitSetting);
        $(id)?.addEventListener("change", commitSetting);
      });
      $("resetSettingsBtn")?.addEventListener("click", () => {
        gameSettings = { ...defaultSettings };
        applySettings();
        saveSettings();
        applyLocale();
        toast(`${translate("resetSettings")} // ${translate("settingsStatus")}`, 1400);
        buttonTone(560, .1, "triangle", .025);
      });
      window.addEventListener("keydown", (event) => {
        // Q and E already belong to the combat abilities (BUY SURGE and
        // EXIT LIQUIDITY).  Keep the Easter controls on their own keys so a
        // hidden power can never steal a combat input. F is intentionally
        // unbound: firing is always an explicit Space/mouse/touch action.
        if (event.code === "KeyX") activateEggEcho();
        if (event.code === "KeyZ") cycleEggPower();
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          clearInput();
          saveRunSnapshotHook?.("hidden", true);
        } else {
          last = 0;
          accumulator = 0;
        }
      });
      window.addEventListener("pagehide", () => {
        saveRunSnapshotHook?.("pagehide", true);
      }, { capture: true });
      window.addEventListener("beforeunload", () => {
        saveRunSnapshotHook?.("beforeunload", true);
      }, { capture: true });
      refreshArchiveUi();

      buildHud();
      applyLocale();
      // Touch abilities cast on contact, which keeps a second finger free for
      // the movement stick. Capture-phase click suppression prevents the
      // delayed synthetic click from spending the same ability a second time.
      document.querySelectorAll(".ability-btn").forEach((button) => {
        let touchAt = 0;
        button.addEventListener("pointerdown", (event) => {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          touchAt = nowMs();
          unlockAudio();
          activate(button.dataset.ability);
        });
        button.addEventListener("click", (event) => {
          if (touchAt && nowMs() - touchAt < 520) {
            event.preventDefault();
            event.stopImmediatePropagation();
            touchAt = 0;
          }
        }, true);
      });
      const touchDashButton = $("touchDashBtn");
      if (touchDashButton) {
        let touchDashAt = 0;
        touchDashButton.addEventListener("pointerdown", (event) => {
          if (event.pointerType === "mouse") return;
          event.preventDefault();
          event.stopPropagation();
          touchDashAt = nowMs();
          unlockAudio();
          activate("dash");
        });
        touchDashButton.addEventListener("click", (event) => {
          if (touchDashAt) {
            event.preventDefault();
            event.stopImmediatePropagation();
            touchDashAt = 0;
          }
        }, true);
        // Fallback for older Safari/WebViews where Pointer Events are absent:
        // the browser still delivers a regular click after a touch.
        touchDashButton.addEventListener("click", () => {
          if (!touchDashAt) activate("dash");
        });
      }
      const touchFireButton = $("touchFireBtn");
      if (touchFireButton) {
        let suppressTouchFireClick = false;
        let suppressTouchFireClickTimer = 0;
        const clearSyntheticFireClickGuard = () => {
          suppressTouchFireClick = false;
          if (suppressTouchFireClickTimer) {
            clearTimeout(suppressTouchFireClickTimer);
            suppressTouchFireClickTimer = 0;
          }
        };
        const armSyntheticFireClickGuard = () => {
          clearSyntheticFireClickGuard();
          suppressTouchFireClick = true;
          // A few embedded mobile browsers never dispatch the synthetic
          // click. Expire the guard so a later deliberate accessibility
          // click is never swallowed.
          suppressTouchFireClickTimer = setTimeout(clearSyntheticFireClickGuard, 900);
        };
        const setMobileFireHeld = (held, pointerId = null) => {
          mobileFireHeld = !!held && state === "playing" && !orientationHold;
          mobileFirePointerId = mobileFireHeld ? pointerId : null;
          touchFireButton.classList.toggle("is-held", mobileFireHeld);
          touchFireButton.setAttribute("aria-pressed", String(mobileFireHeld));
          syncPointerFire();
        };
        const clearMobileFireCapture = () => {
          mobileFireHeld = false;
          mobileFirePointerId = null;
          touchFireButton.classList.remove("is-held");
          touchFireButton.setAttribute("aria-pressed", "false");
          syncPointerFire();
        };
        const pressMobileFire = (event) => {
          // The visible control is intended for touch/pen. Mouse users fire
          // with a held left button or Space, which keeps desktop controls
          // predictable and avoids duplicate synthetic clicks.
          if (event?.pointerType === "mouse") return;
          if (event?.cancelable) event.preventDefault();
          event?.stopPropagation?.();
          // Touch browsers may emit a delayed synthetic click after the
          // pointer sequence. Suppress exactly that click so a long hold
          // never creates an extra shot on release.
          armSyntheticFireClickGuard();
          unlockAudio();
          if (state !== "playing" || orientationHold) return;
          try { touchFireButton.setPointerCapture?.(event.pointerId); } catch (_) {}
          setMobileFireHeld(true, event?.pointerId ?? null);
          // Fire immediately on press; the fixed-step update loop continues
          // firing while the button remains held.
          if (!(typeof aimAssist !== "undefined" && aimAssist)) fire();
        };
        const releaseMobileFire = (event) => {
          const pointerId = event?.pointerId;
          if (
            mobileFirePointerId !== null
            && pointerId !== undefined
            && pointerId !== mobileFirePointerId
          ) return;
          if (event?.cancelable) event.preventDefault();
          event?.stopPropagation?.();
          setMobileFireHeld(false);
        };
        touchFireButton.addEventListener("pointerdown", pressMobileFire);
        touchFireButton.addEventListener("pointerup", releaseMobileFire);
        touchFireButton.addEventListener("pointercancel", releaseMobileFire);
        touchFireButton.addEventListener("lostpointercapture", releaseMobileFire);
        // A window-level release closes the latch if the finger leaves the
        // button before pointer capture is available (older WebViews).
        window.addEventListener("pointerup", (event) => {
          if (event?.pointerId === mobileFirePointerId) {
            releaseMobileFire(event);
          }
        });
        window.addEventListener("pointercancel", (event) => {
          if (event?.pointerId === mobileFirePointerId) {
            releaseMobileFire(event);
          }
        });
        window.addEventListener("blur", clearMobileFireCapture);
        // Compatibility path for browsers without Pointer Events.
        if (typeof window.PointerEvent !== "function") {
          touchFireButton.addEventListener("touchstart", pressMobileFire, { passive: false });
          touchFireButton.addEventListener("touchend", releaseMobileFire, { passive: false });
          touchFireButton.addEventListener("touchcancel", releaseMobileFire, { passive: false });
        }
        // Suppress the delayed synthetic click generated after a touch.
        touchFireButton.addEventListener("click", (event) => {
          if (suppressTouchFireClick) {
            event.preventDefault();
            event.stopImmediatePropagation();
            clearSyntheticFireClickGuard();
            return;
          }
          // Old embedded browsers may synthesize only a click after touch.
          // Give that path one deliberate shot without creating a toggle.
          if (state === "playing" && !orientationHold) {
            event.preventDefault();
            event.stopPropagation();
            unlockAudio();
            if (!(typeof aimAssist !== "undefined" && aimAssist)) fire();
          }
        }, true);
      }
      document.querySelectorAll(".weapon-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopImmediatePropagation();
          setWeapon(Number(button.dataset.weapon));
        }, true);
      });

/* ===== 75-hardcore-combat.js ===== */
      // HARDCORE FRONTIER // Wave 20 combat layer.
      // This component sits after progression and before the runtime guard so
      // its extra AI, HUD and projectile hooks receive the same fault-tolerant
      // frame wrapper as the rest of the game.
      const bbHardcoreTelegraphs = [];
      let bbHardcoreActiveProfile = null;
      let bbHardcoreThreat = 0;
      let bbHardcoreDashBreaks = 0;

      function bbHardcoreProfile(inputWave = wave) {
        const requested = Math.max(1, Math.floor(Number(inputWave) || 1));
        const capped = Math.min(20, requested);
        const progress = (capped - 1) / 19;
        const overrun = Math.max(0, requested - 20);
        const tier = Math.min(5, Math.floor((capped - 1) / 4) + 1);
        return {
          wave: requested,
          cappedWave: capped,
          tier,
          hp: 1 + progress * .7 + overrun * .03,
          bossHp: 1 + progress * .52 + overrun * .025,
          speed: 1 + progress * .28 + overrun * .01,
          damage: 1 + progress * .34 + overrun * .012,
          spawnExtra: Math.min(10, Math.floor((capped - 1) / 3) + (capped >= 12 ? 1 : 0)),
          spawnCadence: Math.max(.68, 1 - progress * .24),
          chargerChance: capped < 4 ? 0 : .08 + progress * .13,
          sniperChance: capped < 6 ? 0 : .055 + progress * .115,
          threat: Math.round(18 + progress * 72),
          label: requested <= 20 ? `TIER ${tier} // WAVE ${capped}/20` : `ENDLESS // WAVE ${requested}`
        };
      }

      function bbHardcoreSafeProfile() {
        bbHardcoreActiveProfile = bbHardcoreProfile(wave || 1);
        return bbHardcoreActiveProfile;
      }

      function bbHardcoreEnemyVisible(enemy, padding = 0) {
        try {
          return enemyIsVisibleInViewport(enemy, padding);
        } catch (_) {
          return false;
        }
      }

      function bbHardcoreApplyEnemy(enemy) {
        if (!enemy || !enemy.alive || enemy.bbHardcoreApplied) return;
        const profile = bbHardcoreSafeProfile();
        enemy.bbHardcoreApplied = true;
        enemy.bbHardcoreDamageScale = profile.damage;
        enemy.bbEntryGrace = Math.max(Number(enemy.bbEntryGrace) || 0, enemy.boss ? .64 : .3);
        if (!bbHardcoreEnemyVisible(enemy, 0)) enemy.bbEntryRush = true;

        // Decoys are a visual boss mechanic. They stay fragile so the player
        // can still distinguish a real survival encounter from a fake target.
        if (enemy.scammerDecoy) return;

        const healthScale = enemy.boss ? profile.bossHp : profile.hp;
        enemy.hp = Math.max(1, Number(enemy.hp) || 1) * healthScale;
        enemy.maxHp = Math.max(1, Number(enemy.maxHp) || Number(enemy.hp) || 1) * healthScale;
        enemy.speed = Math.max(1, Number(enemy.speed) || 1) * profile.speed;
        enemy.touch = Math.max(1, Number(enemy.touch) || 1) * profile.damage;
        enemy.bbHardcoreBaseSpeed = enemy.speed;

        if (enemy.type === "charger") {
          enemy.bbChargeState = "stalk";
          enemy.bbChargeTimer = 0;
          enemy.bbChargeCooldown = rand(1.15, 2.25);
          enemy.bbChargeDirection = 0;
        } else if (enemy.type === "sniper") {
          enemy.bbSniperState = "cooldown";
          enemy.bbSniperTimer = rand(1.1, 2.05);
          enemy.bbSniperAim = 0;
        }
      }

      Object.assign(enemyTypes, {
        charger: {
          name: "BREACHER",
          color: "#ff7a47",
          hp: 106,
          speed: 92,
          r: 18,
          touch: 34,
          value: 27,
          lore: "The orange lane is a dash check, not an invitation."
        },
        sniper: {
          name: "WATCHER",
          color: "#75b8ff",
          hp: 68,
          speed: 56,
          r: 15,
          touch: 19,
          value: 29,
          lore: "Its reticle is your warning. Move before the quote lands."
        }
      });

      const bbHardcoreBaseResetRun = resetRun;
      const bbHardcoreBaseStartWave = startWave;
      const bbHardcoreBaseChooseType = chooseType;
      const bbHardcoreBaseSpawnEnemy = spawnEnemy;
      const bbHardcoreBaseFire = fire;
      const bbHardcoreBaseHitEnemy = hitEnemy;
      const bbHardcoreBaseKillEnemy = killEnemy;
      const bbHardcoreBaseUpdate = update;
      const bbHardcoreBaseDrawWorld = drawWorld;
      const bbHardcoreBaseSyncHud = syncHud;
      const bbHardcoreBasePushEnemyBullet = pushEnemyBullet;

      resetRun = function bbHardcoreResetRun() {
        const result = bbHardcoreBaseResetRun.apply(this, arguments);
        bbHardcoreTelegraphs.length = 0;
        bbHardcoreActiveProfile = bbHardcoreProfile(1);
        bbHardcoreThreat = 0;
        bbHardcoreDashBreaks = 0;
        return result;
      };

      startWave = function bbHardcoreStartWave(next) {
        const result = bbHardcoreBaseStartWave.apply(this, arguments);
        const profile = bbHardcoreSafeProfile();
        // Preserve the boss as the final arrival while increasing total
        // pressure. The active-entity budget is still enforced by spawnEnemy.
        const maxWaveTotal = compactDevice ? 56 : 66;
        waveRemaining = Math.max(1, Math.min(maxWaveTotal, Math.round(waveRemaining + profile.spawnExtra)));
        spawnTimer = Math.max(.1, (Number(spawnTimer) || .2) * profile.spawnCadence);
        bbHardcoreTelegraphs.length = 0;
        bbHardcoreThreat = profile.threat;
        try {
          $("hardcoreReadout").textContent = `HARDCORE // ${profile.label}`;
          $("hardcoreThreatFill").style.width = `${profile.threat}%`;
        } catch (_) {}
        try { syncHud(true); } catch (_) {}
        return result;
      };

      chooseType = function bbHardcoreChooseType() {
        const profile = bbHardcoreSafeProfile();
        const roll = Math.random();
        if (wave >= 4 && roll < profile.chargerChance) return "charger";
        if (wave >= 6 && roll < profile.chargerChance + profile.sniperChance) return "sniper";
        return bbHardcoreBaseChooseType.apply(this, arguments);
      };

      spawnEnemy = function bbHardcoreSpawnEnemy() {
        const before = enemies.length;
        const result = bbHardcoreBaseSpawnEnemy.apply(this, arguments);
        for (let index = before; index < enemies.length; index += 1) {
          bbHardcoreApplyEnemy(enemies[index]);
        }
        return result;
      };

      pushEnemyBullet = function bbHardcorePushEnemyBullet(spec) {
        const next = spec && typeof spec === "object" ? spec : {};
        if (!next.bbHardcoreDamageApplied) {
          const profile = bbHardcoreSafeProfile();
          next.damage = Math.max(.25, Number(next.damage) || 1) * profile.damage;
          next.bbHardcoreDamageApplied = true;
        }
        return bbHardcoreBasePushEnemyBullet(next);
      };

      function bbHardcoreApplyImpact(enemy, bullet) {
        const impact = Math.max(0, Math.min(220, Number(bullet?.bbWeaponImpact) || 0));
        if (!enemy?.alive || impact <= 0) return;
        const velocityX = Number(bullet?.vx) || 0;
        const velocityY = Number(bullet?.vy) || 0;
        const magnitude = Math.hypot(velocityX, velocityY) || 1;
        // Bosses intentionally receive only a trace of the impact. Combined
        // with the bomb resistance in the combat layer, this keeps them
        // planted without making weapon hits feel ignored.
        const resistance = enemy.boss ? .055 : enemy.elite ? .42 : 1;
        const nextX = (Number(enemy.knockX) || 0) + velocityX / magnitude * impact * resistance;
        const nextY = (Number(enemy.knockY) || 0) + velocityY / magnitude * impact * resistance;
        const nextMagnitude = Math.hypot(nextX, nextY) || 1;
        const scale = Math.min(1, ENEMY_KNOCKBACK_CAP / nextMagnitude);
        enemy.knockX = nextX * scale;
        enemy.knockY = nextY * scale;
      }

      hitEnemy = function bbHardcoreHitEnemy(enemy, damage, bullet = null) {
        if (!enemy?.alive) return;
        let finalDamage = Math.max(0, Number(damage) || 0);
        const weaponCrit = Math.max(0, Math.min(.12, Number(bullet?.bbWeaponCrit) || 0));
        if (weaponCrit > 0 && Math.random() < weaponCrit) {
          finalDamage *= 1.34;
          try { particle(enemy.x, enemy.y, "#fff7c2", 5, 160); } catch (_) {}
        }
        bbHardcoreApplyImpact(enemy, bullet);
        return bbHardcoreBaseHitEnemy(enemy, finalDamage, bullet || { color: ACID });
      };

      fire = function bbHardcoreFire() {
        const existing = new Set(bullets);
        const result = bbHardcoreBaseFire.apply(this, arguments);
        const profile = weaponProfile(player.weapon);
        if (!profile.echo) return result;
        const fresh = bullets.filter((bullet) => !existing.has(bullet) && bullet && !bullet.bbWeaponEcho);
        for (const bullet of fresh) {
          if (bullets.length >= MAX_PLAYER_BULLETS) break;
          const speed = Math.max(1, Number(bullet.speed) || Math.hypot(Number(bullet.vx) || 0, Number(bullet.vy) || 0));
          const angle = (Number(bullet.angle) || Math.atan2(Number(bullet.vy) || 0, Number(bullet.vx) || 1)) + (Math.random() < .5 ? -.075 : .075);
          bullets.push({
            ...bullet,
            x: Number(bullet.x) || player.x,
            y: Number(bullet.y) || player.y,
            angle,
            speed: speed * .84,
            vx: Math.cos(angle) * speed * .84,
            vy: Math.sin(angle) * speed * .84,
            damage: Math.max(.25, (Number(bullet.damage) || 1) * .46),
            life: Math.max(.1, (Number(bullet.life) || .5) * .78),
            maxTravel: Math.max(80, (Number(bullet.maxTravel) || 180) * .78),
            traveled: 0,
            size: Math.max(3, (Number(bullet.size) || 5) * .82),
            hit: [],
            bbWeaponEcho: true,
            // Cosmetic firing styles should not clone an echo into another
            // branch; the level-eight core is already its own secondary shot.
            bbCustomizationShot: true
          });
        }
        return result;
      };

      killEnemy = function bbHardcoreKillEnemy(enemy) {
        const wasAlive = !!enemy?.alive;
        const type = enemy?.type;
        const result = bbHardcoreBaseKillEnemy.apply(this, arguments);
        if (wasAlive && !enemy?.alive && type === "charger") {
          bbHardcoreDashBreaks = Math.min(1000000, bbHardcoreDashBreaks + 1);
          player.energy = Math.min(player.maxEnergy, player.energy + 7);
        }
        return result;
      };

      function bbHardcoreRefreshTelegraphs() {
        bbHardcoreTelegraphs.length = 0;
        for (const enemy of enemies) {
          if (!enemy?.alive || !bbHardcoreEnemyVisible(enemy, 96)) continue;
          if (enemy.bbChargeState === "tell" || enemy.bbChargeState === "charge") {
            bbHardcoreTelegraphs.push({
              enemy,
              kind: "charge",
              timer: Math.max(0, Number(enemy.bbChargeTimer) || 0),
              max: enemy.bbChargeState === "tell" ? .58 : .46
            });
          } else if (enemy.bbSniperState === "tell") {
            bbHardcoreTelegraphs.push({
              enemy,
              kind: "sniper",
              timer: Math.max(0, Number(enemy.bbSniperTimer) || 0),
              max: .72
            });
          }
        }
      }

      function bbHardcorePrepareCharger(enemy, dt) {
        const baseSpeed = Math.max(1, Number(enemy.bbHardcoreBaseSpeed) || Number(enemy.speed) || 1);
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        let state = enemy.bbChargeState || "stalk";
        let timer = Number(enemy.bbChargeTimer) || 0;
        let cooldown = Math.max(0, Number(enemy.bbChargeCooldown) || 0);
        const canReadAttack = bbHardcoreEnemyVisible(enemy, 16) && enemy.bbEntryGrace <= 0;
        if (state === "stalk") {
          cooldown = Math.max(0, cooldown - dt);
          enemy.speed = baseSpeed;
          const minDistance = 150 / Math.max(.05, viewportZoom());
          const maxDistance = 520 / Math.max(.05, viewportZoom());
          if (canReadAttack && cooldown <= 0 && distance >= minDistance && distance <= maxDistance) {
            state = "tell";
            timer = .58;
            enemy.bbChargeDirection = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.speed = baseSpeed * .08;
          }
        } else if (state === "tell") {
          timer -= dt;
          enemy.speed = baseSpeed * .08;
          if (timer <= 0) {
            state = "charge";
            timer = .46;
            enemy.bbChargeDirection = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.speed = baseSpeed * 5.15;
          }
        } else if (state === "charge") {
          timer -= dt;
          enemy.speed = baseSpeed * 5.15;
          if (timer <= 0) {
            state = "recover";
            timer = .58;
            cooldown = rand(1.55, 2.65);
            enemy.speed = baseSpeed * .3;
          }
        } else {
          timer -= dt;
          enemy.speed = baseSpeed * .3;
          if (timer <= 0) {
            state = "stalk";
            enemy.speed = baseSpeed;
          }
        }
        enemy.bbChargeState = state;
        enemy.bbChargeTimer = timer;
        enemy.bbChargeCooldown = cooldown;
      }

      function bbHardcorePrepareSniper(enemy, dt) {
        const baseSpeed = Math.max(1, Number(enemy.bbHardcoreBaseSpeed) || Number(enemy.speed) || 1);
        let state = enemy.bbSniperState || "cooldown";
        let timer = Number(enemy.bbSniperTimer) || 0;
        const visible = bbHardcoreEnemyVisible(enemy, 20) && enemy.bbEntryGrace <= 0;
        if (state === "cooldown") {
          enemy.speed = baseSpeed * .78;
          if (visible) timer -= dt;
          if (timer <= 0) {
            state = "tell";
            timer = .72;
            enemy.bbSniperAim = Math.atan2(player.y - enemy.y, player.x - enemy.x);
            enemy.speed = baseSpeed * .12;
          }
        } else {
          enemy.speed = baseSpeed * .12;
          timer -= dt;
        }
        enemy.bbSniperState = state;
        enemy.bbSniperTimer = timer;
      }

      function bbHardcorePrepareFrame(dt) {
        if (state !== "playing") return;
        for (const enemy of enemies) {
          bbHardcoreApplyEnemy(enemy);
          if (!enemy?.alive || enemy.boss || enemy.scammerDecoy) continue;
          if (enemy.type === "charger") bbHardcorePrepareCharger(enemy, dt);
          if (enemy.type === "sniper") bbHardcorePrepareSniper(enemy, dt);
        }
        bbHardcoreRefreshTelegraphs();
      }

      function bbHardcoreResolveCharger(enemy) {
        if (!enemy?.alive || enemy.bbChargeState !== "charge" || player.dash <= 0) return;
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distance > enemy.r + player.r + 26) return;
        enemy.bbChargeState = "recover";
        enemy.bbChargeTimer = .82;
        enemy.bbChargeCooldown = rand(1.9, 3.1);
        enemy.stun = Math.max(Number(enemy.stun) || 0, 1.15);
        enemy.knockX = (Number(enemy.knockX) || 0) - Math.cos(playerFx.dashAngle || 0) * 54;
        enemy.knockY = (Number(enemy.knockY) || 0) - Math.sin(playerFx.dashAngle || 0) * 54;
        hitEnemy(enemy, Math.max(12, (Number(enemy.maxHp) || 100) * .1), { color: CYAN, bbWeaponImpact: 46 });
        bbHardcoreDashBreaks = Math.min(1000000, bbHardcoreDashBreaks + 1);
        try {
          combatFlash("DASH BREAK // BREACHER STAGGERED", 740);
          particle(enemy.x, enemy.y, CYAN, 18, 290);
        } catch (_) {}
      }

      function bbHardcoreResolveSniper(enemy) {
        if (!enemy?.alive || enemy.bbSniperState !== "tell" || enemy.bbSniperTimer > 0) return;
        const visible = bbHardcoreEnemyVisible(enemy, 20) && enemy.bbEntryGrace <= 0;
        enemy.bbSniperState = "cooldown";
        enemy.bbSniperTimer = rand(1.45, 2.45);
        if (!visible) return;
        const profile = bbHardcoreSafeProfile();
        const angle = Number.isFinite(Number(enemy.bbSniperAim))
          ? Number(enemy.bbSniperAim)
          : Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const speed = (520 + profile.cappedWave * 7) * mobileProjectileScale() * zoomTempoScale();
        const damage = (12 + profile.cappedWave * .58) * profile.damage;
        pushEnemyBullet({
          x: enemy.x,
          y: enemy.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 7,
          life: 3.6,
          damage,
          color: enemyTypes.sniper.color,
          kind: "sniper",
          bbHardcoreDamageApplied: true
        });
        try {
          particle(enemy.x, enemy.y, enemyTypes.sniper.color, 10, 210);
          combatFlash("WATCHER // LINE FIRED", 520);
        } catch (_) {}
      }

      function bbHardcoreResolveFrame() {
        if (state !== "playing") return;
        let specialCount = 0;
        for (const enemy of enemies) {
          if (!enemy?.alive) continue;
          if (enemy.type === "charger") {
            bbHardcoreResolveCharger(enemy);
            specialCount += 1;
          } else if (enemy.type === "sniper") {
            bbHardcoreResolveSniper(enemy);
            specialCount += 1;
          }
        }
        const profile = bbHardcoreSafeProfile();
        const activeEnemies = aliveCount(enemies);
        bbHardcoreThreat = Math.max(0, Math.min(100, Math.round(profile.threat + activeEnemies * .65 + specialCount * 3 + (v3Boss?.alive ? 9 : 0))));
        bbHardcoreRefreshTelegraphs();
      }

      update = function bbHardcoreUpdate(dt) {
        const safeDt = Math.max(0, Math.min(.05, Number(dt) || 0));
        bbHardcorePrepareFrame(safeDt);
        const result = bbHardcoreBaseUpdate.apply(this, arguments);
        bbHardcoreResolveFrame();
        return result;
      };

      function bbHardcoreDrawTelegraphs(time) {
        if (state !== "playing" || !bbHardcoreTelegraphs.length) return;
        ctx.save();
        for (const telegraph of bbHardcoreTelegraphs) {
          const enemy = telegraph?.enemy;
          if (!enemy?.alive) continue;
          const point = worldToScreen(enemy.x, enemy.y);
          if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
          const scale = enemyRenderScale();
          const pulse = .68 + Math.sin(time * 18 + (enemy.phase || 0)) * .22;
          if (telegraph.kind === "charge") {
            const angle = Number(enemy.bbChargeDirection) || Math.atan2(player.y - enemy.y, player.x - enemy.x);
            const charging = enemy.bbChargeState === "charge";
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            ctx.rotate(angle);
            ctx.globalAlpha = charging ? .8 : .46 + pulse * .24;
            ctx.strokeStyle = "#ff7a47";
            ctx.fillStyle = "#ff7a47";
            ctx.shadowBlur = gameSettings.performance ? 0 : 18;
            ctx.shadowColor = "#ff7a47";
            ctx.lineWidth = charging ? 3 : 2;
            setDash([charging ? 4 : 8, 5]);
            ctx.beginPath();
            ctx.moveTo(enemy.r + 6, 0);
            ctx.lineTo(enemy.r + 66, 0);
            ctx.stroke();
            setDash([]);
            ctx.beginPath();
            ctx.moveTo(enemy.r + 70, 0);
            ctx.lineTo(enemy.r + 54, -8);
            ctx.lineTo(enemy.r + 54, 8);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else if (telegraph.kind === "sniper") {
            const angle = Number(enemy.bbSniperAim) || Math.atan2(player.y - enemy.y, player.x - enemy.x);
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.scale(scale, scale);
            ctx.rotate(angle);
            ctx.globalAlpha = .44 + pulse * .3;
            ctx.strokeStyle = enemyTypes.sniper.color;
            ctx.shadowBlur = gameSettings.performance ? 0 : 18;
            ctx.shadowColor = enemyTypes.sniper.color;
            ctx.lineWidth = 2;
            setDash([3, 5]);
            ctx.beginPath();
            ctx.moveTo(enemy.r + 4, 0);
            ctx.lineTo(enemy.r + 142, 0);
            ctx.stroke();
            setDash([]);
            ctx.beginPath();
            ctx.arc(0, 0, enemy.r + 10 + pulse * 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        }
        ctx.restore();
      }

      drawWorld = function bbHardcoreDrawWorld(time) {
        const result = bbHardcoreBaseDrawWorld.apply(this, arguments);
        try { bbHardcoreDrawTelegraphs(Number(time) || 0); } catch (_) {}
        return result;
      };

      syncHud = function bbHardcoreSyncHud() {
        const result = bbHardcoreBaseSyncHud.apply(this, arguments);
        try {
          const profile = bbHardcoreSafeProfile();
          const readout = $("hardcoreReadout");
          const threatText = $("hardcoreThreatText");
          const threatFill = $("hardcoreThreatFill");
          const dashText = $("hardcoreDashText");
          if (readout) readout.textContent = `HARDCORE // ${profile.label}`;
          if (threatText) threatText.textContent = `THREAT // ${bbHardcoreThreat}%`;
          if (threatFill) threatFill.style.width = `${bbHardcoreThreat}%`;
          if (dashText) {
            const ready = player.ability?.dash <= 0 && player.energy >= dashEnergyCost();
            dashText.textContent = ready
              ? "DASH // READY — BREAK BREACHERS"
              : `DASH // ${Math.ceil(Math.max(0, dashEnergyCost() - player.energy))} ENERGY`;
          }
        } catch (_) {}
        return result;
      };

      try {
        window.__BUY_BUTTON_HARDCORE__ = Object.freeze({
          version: "wave-20-hardcore",
          getProfile: (inputWave = 20) => Object.freeze({ ...bbHardcoreProfile(inputWave) }),
          getStatus: () => Object.freeze({
            wave: Math.max(0, Number(wave) || 0),
            threat: bbHardcoreThreat,
            dashBreaks: bbHardcoreDashBreaks,
            telegraphs: bbHardcoreTelegraphs.length
          }),
          getSpawnShell: (inputAngle = 0) => {
            const angle = Number.isFinite(Number(inputAngle)) ? Number(inputAngle) : 0;
            const radius = enemyViewportShellRadius(angle, null, 0);
            const worldX = player.x + Math.cos(angle) * radius;
            const worldY = player.y + Math.sin(angle) * radius;
            const screen = worldToScreen(worldX, worldY);
            return Object.freeze({
              radius,
              x: screen.x,
              y: screen.y,
              outsideViewport: screen.x < 0 || screen.x > W || screen.y < 0 || screen.y > H
            });
          }
        });
      } catch (_) {}

/* ===== 80-runtime-safety.js ===== */
// RUNTIME GUARD // one bad value must not kill the animation loop.
      // The game is intentionally forgiving here: a damaged entity is
      // discarded, transient effects are trimmed, and the run stays alive.
      const bbRuntimeSafety = {
        frameCount: 0,
        lastFrameAt: nowMs(),
        lastFaultAt: 0,
        lastWarningAt: 0,
        faults: 0,
        updateFaults: 0,
        drawFaults: 0,
        hudFaults: 0,
        recovering: false,
        safeMode: false,
        hudBusy: false,
        lastHudAt: 0,
        drawSkipUntil: 0,
        rafPending: false,
        watchdogTimer: 0,
        customShots: 0,
        customTargetRefreshes: 0,
        autoFireTicks: 0,
        enemyRescues: 0
      };
      const BB_RUNTIME_STEP = 1 / 60;
      const BB_RUNTIME_MAX_STEPS = 4;
      const BB_RUNTIME_WORLD_LIMIT = 100000;
      const BB_RUNTIME_MAX_TEXT = 112;
      const bbRuntimeNumber = (value, fallback = 0) => {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
      };
      const bbRuntimeClamp = (value, min, max, fallback = min) =>
        Math.max(min, Math.min(max, bbRuntimeNumber(value, fallback)));
      const bbRuntimeInt = (value, min, max, fallback = min) =>
        Math.round(bbRuntimeClamp(value, min, max, fallback));
      const bbRuntimeShortTextMap = Object.freeze({
        "OVERCLOCKED // three lanes, one decision.": "OVERCLOCKED // THREE LANES",
        "FORTIFIED // armor window is live.": "FORTIFIED // ARMOR UP",
        "PHASE SHIFT // the target changed coordinates.": "PHASE SHIFT // TARGET MOVED",
        "REDLINE // no safe side of the book.": "REDLINE // NO SAFE SIDE",
        "THE LOCKOUT // expanding ring.": "LOCKOUT // RING",
        "CLEARING HOUSE // collateral incoming.": "CLEARING HOUSE // INCOMING",
        "THE ORACLE // prediction tax.": "ORACLE // PREDICTION TAX",
        "ROBIN PRIME // the mascot calls reinforcements.": "ROBIN PRIME // REINFORCEMENTS",
        "SCAMMER // receipt duplicated": "SCAMMER // RECEIPT DUPLICATED",
        "SCAMMER // chargeback": "SCAMMER // CHARGEBACK",
        "ZERO-G DASH // gravity has left the room.": "ZERO-G DASH // GRAVITY OFF",
        "DARK MATTER // seven presses just bent time.": "DARK MATTER // TIME BENT",
        "CROWD SURGE // the book is moving with you.": "CROWD SURGE // BOOK MOVING",
        "BUY THE DIP // the last stand is live.": "BUY THE DIP // LAST STAND"
      });
      const bbRuntimeShortText = (value) => {
        if (value === undefined || value === null) return "";
        let text = String(value).replace(/\s+/g, " ").trim();
        text = bbRuntimeShortTextMap[text] || text;
        if (text.length > BB_RUNTIME_MAX_TEXT) text = `${text.slice(0, BB_RUNTIME_MAX_TEXT - 1)}…`;
        return text;
      };
      const bbRuntimeResetCanvas = () => {
        try {
          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = "source-over";
          ctx.filter = "none";
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
          if (typeof ctx.setLineDash === "function") ctx.setLineDash([]);
          if (typeof ctx.setTransform === "function") {
            const scale = Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
            ctx.setTransform(scale, 0, 0, scale, 0, 0);
          }
          ctx.clearRect(0, 0, Math.max(1, W), Math.max(1, H));
        } catch (_) {}
      };
      const bbRuntimePaintFallbackFrame = () => {
        bbRuntimeResetCanvas();
        try {
          const width = Math.max(1, bbRuntimeNumber(W, 1));
          const height = Math.max(1, bbRuntimeNumber(H, 1));
          ctx.save();
          ctx.fillStyle = "#050807";
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = "rgba(204,255,0,.12)";
          ctx.lineWidth = 1;
          const grid = 72;
          for (let x = 0; x <= width; x += grid) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
          }
          for (let y = 0; y <= height; y += grid) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }
          ctx.fillStyle = "#ccff00";
          ctx.globalAlpha = .82;
          ctx.font = "900 11px ui-monospace, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("RENDER RECOVERING // HOLD THE SIGNAL", width * .5, height * .5);
          ctx.restore();
        } catch (_) {
          bbRuntimeResetCanvas();
        }
      };
      const bbRuntimeSanitizeList = (list, maxLength, kind = "entity") => {
        if (!Array.isArray(list)) return;
        for (let i = list.length - 1; i >= 0; i--) {
          const item = list[i];
          if (!item || typeof item !== "object") {
            list.splice(i, 1);
            continue;
          }
          const pairs = kind === "arc"
            ? [["x1", "y1"], ["x2", "y2"]]
            : [["x", "y"]];
          let valid = true;
          for (const [xKey, yKey] of pairs) {
            const x = Number(item[xKey]), y = Number(item[yKey]);
            if (!Number.isFinite(x) || !Number.isFinite(y)
              || Math.abs(x) > BB_RUNTIME_WORLD_LIMIT
              || Math.abs(y) > BB_RUNTIME_WORLD_LIMIT) {
              valid = false;
              break;
            }
            item[xKey] = bbRuntimeClamp(x, -BB_RUNTIME_WORLD_LIMIT, BB_RUNTIME_WORLD_LIMIT, 0);
            item[yKey] = bbRuntimeClamp(y, -BB_RUNTIME_WORLD_LIMIT, BB_RUNTIME_WORLD_LIMIT, 0);
          }
          if (!valid) {
            list.splice(i, 1);
            continue;
          }
          if (kind === "enemy") {
            if (typeof item.alive !== "boolean") item.alive = true;
            item.r = bbRuntimeClamp(item.r, 1, 600, 12);
            item.hp = bbRuntimeClamp(item.hp, -100000, 100000, 0);
            item.maxHp = bbRuntimeClamp(item.maxHp, 1, 100000, Math.max(1, Math.abs(item.hp)));
            item.speed = bbRuntimeClamp(item.speed, -5000, 5000, 0);
            item.touch = bbRuntimeClamp(item.touch, 0, 100000, 0);
            item.value = bbRuntimeClamp(item.value, 0, 100000, 1);
            item.phase = bbRuntimeClamp(item.phase, -100000, 100000, 0);
            item.hit = bbRuntimeClamp(item.hit, 0, 60, 0);
            item.stun = bbRuntimeClamp(item.stun, -60, 60, 0);
            item.knockX = bbRuntimeClamp(item.knockX, -50000, 50000, 0);
            item.knockY = bbRuntimeClamp(item.knockY, -50000, 50000, 0);
            item.shotTimer = bbRuntimeClamp(item.shotTimer, -60, 60, 0);
            item.bbEntryGrace = bbRuntimeClamp(item.bbEntryGrace, 0, 12, 0);
            item.bbChargeTimer = bbRuntimeClamp(item.bbChargeTimer, -60, 60, 0);
            item.bbChargeCooldown = bbRuntimeClamp(item.bbChargeCooldown, 0, 60, 0);
            item.bbSniperTimer = bbRuntimeClamp(item.bbSniperTimer, -60, 60, 0);
            item.bbHardcoreDamageScale = bbRuntimeClamp(item.bbHardcoreDamageScale, .1, 20, 1);
            if (typeof item.bbRespawnPending !== "boolean") item.bbRespawnPending = false;
          } else if (kind === "bullet") {
            item.vx = bbRuntimeClamp(item.vx, -50000, 50000, 0);
            item.vy = bbRuntimeClamp(item.vy, -50000, 50000, 0);
            item.r = bbRuntimeClamp(item.r, 1, 120, 6);
            item.size = bbRuntimeClamp(item.size, 1, 120, item.r);
            item.life = bbRuntimeClamp(item.life, -120, 120, 0);
            item.traveled = bbRuntimeClamp(item.traveled, 0, 1000000, 0);
            if (Array.isArray(item.hit) && item.hit.length > MAX_ENEMIES) item.hit.length = MAX_ENEMIES;
          } else if (kind === "particle") {
            item.vx = bbRuntimeClamp(item.vx, -50000, 50000, 0);
            item.vy = bbRuntimeClamp(item.vy, -50000, 50000, 0);
            item.life = bbRuntimeClamp(item.life, -120, 120, 0);
            item.max = bbRuntimeClamp(item.max, .01, 120, 1);
            item.size = bbRuntimeClamp(item.size, .1, 120, 2);
          } else if (kind === "pickup") {
            item.life = bbRuntimeClamp(item.life, -120, 120, 0);
            item.spin = bbRuntimeClamp(item.spin, -100000, 100000, 0);
            item.amount = bbRuntimeClamp(item.amount, 0, 100000, 1);
            if (typeof item.kind !== "string") item.kind = "coin";
          } else if (kind === "arc") {
            item.life = bbRuntimeClamp(item.life, -120, 120, 0);
            item.max = bbRuntimeClamp(item.max, .01, 120, 1);
          } else if (kind === "ring") {
            item.r = bbRuntimeClamp(item.r, 0, 100000, 0);
            item.max = bbRuntimeClamp(item.max, 0, 100000, item.r);
            item.life = bbRuntimeClamp(item.life, -120, 120, 0);
          }
        }
        if (Number.isFinite(maxLength) && list.length > maxLength) {
          list.splice(0, list.length - maxLength);
        }
      };
      function bbRuntimeSanitizeState() {
        try {
          if (!player || typeof player !== "object") return;
          player.x = bbRuntimeClamp(player.x, -BB_RUNTIME_WORLD_LIMIT, BB_RUNTIME_WORLD_LIMIT, 0);
          player.y = bbRuntimeClamp(player.y, -BB_RUNTIME_WORLD_LIMIT, BB_RUNTIME_WORLD_LIMIT, 0);
          player.r = bbRuntimeClamp(player.r, 2, 180, 15);
          player.maxHp = bbRuntimeClamp(player.maxHp, 1, 100000, 100);
          player.hp = bbRuntimeClamp(player.hp, 0, player.maxHp, player.maxHp);
          player.maxEnergy = bbRuntimeClamp(player.maxEnergy, 1, 100000, 100);
          player.energy = bbRuntimeClamp(player.energy, 0, player.maxEnergy, player.maxEnergy);
          player.speed = bbRuntimeClamp(player.speed, 0, 10000, 235);
          player.range = bbRuntimeClamp(player.range, 1, 100000, 510);
          player.damage = bbRuntimeClamp(player.damage, 0, 100000, 1);
          player.fireRate = bbRuntimeClamp(player.fireRate, 0, 100000, 1);
          player.bombRadius = bbRuntimeClamp(player.bombRadius, 1, 100000, 115);
          player.shield = bbRuntimeClamp(player.shield, 0, 100000, 0);
          player.cooldown = bbRuntimeClamp(player.cooldown, -60, 60, 0);
          player.dash = bbRuntimeClamp(player.dash, -60, 60, 0);
          player.invuln = bbRuntimeClamp(player.invuln, -60, 60, 0);
          player.surge = bbRuntimeClamp(player.surge, -60, 60, 0);
          player.level = bbRuntimeInt(player.level, 1, 100000, 1);
          player.levelQueue = bbRuntimeInt(player.levelQueue, 0, 24, 0);
          player.xp = bbRuntimeClamp(player.xp, 0, 10000000, 0);
          player.xpToNext = bbRuntimeClamp(player.xpToNext, 1, 10000000, 100);
          player.kills = bbRuntimeInt(player.kills, 0, 100000000, 0);
          player.weapon = bbRuntimeInt(player.weapon, 0, Math.max(0, weapons.length - 1), 0);
          if (typeof weaponUpgradeLevels === "object" && weaponUpgradeLevels) {
            for (const weapon of weapons) {
              if (!weapon?.key) continue;
              weaponUpgradeLevels[weapon.key] = bbRuntimeInt(weaponUpgradeLevels[weapon.key], 0, 8, 0);
            }
          }
          if (!player.ability || typeof player.ability !== "object") {
            player.ability = { surge: 0, dash: 0, bomb: 0 };
          }
          for (const key of Object.keys(player.ability)) {
            player.ability[key] = bbRuntimeClamp(player.ability[key], -60, 60, 0);
          }
          wave = bbRuntimeInt(wave, 0, 100000, 0);
          waveRemaining = bbRuntimeInt(waveRemaining, 0, 100000, 0);
          spawnTimer = bbRuntimeClamp(spawnTimer, -60, 60, 0);
          score = bbRuntimeClamp(score, 0, 1000000000, 0);
          coins = bbRuntimeClamp(coins, 0, 100000000, 0);
          combo = bbRuntimeClamp(combo, 0, 1000, 0);
          comboTimer = bbRuntimeClamp(comboTimer, -60, 60, 0);
          elapsed = bbRuntimeClamp(elapsed, 0, 100000000, 0);
          shake = bbRuntimeClamp(shake, 0, 1000, 0);
          flash = bbRuntimeClamp(flash, 0, 10, 0);
          arenaPulse = bbRuntimeClamp(arenaPulse, 0, 10, 0);
          accumulator = bbRuntimeClamp(accumulator, 0, .25, 0);
          if (typeof bossRewardTimer !== "undefined") bossRewardTimer = bbRuntimeClamp(bossRewardTimer, -60, 60, 0);
          if (typeof v3SpawnBurstTimer !== "undefined") v3SpawnBurstTimer = bbRuntimeClamp(v3SpawnBurstTimer, -60, 60, 0);
          if (typeof v3DashCharges !== "undefined") v3DashCharges = bbRuntimeInt(v3DashCharges, 0, 1000, 0);
          if (typeof v3DashMax !== "undefined") v3DashMax = bbRuntimeInt(v3DashMax, 0, 1000, 10);
          if (typeof v3DashRecharge !== "undefined") v3DashRecharge = bbRuntimeClamp(v3DashRecharge, -60, 60, 0);
          if (typeof v3ReadoutTimer !== "undefined") v3ReadoutTimer = bbRuntimeClamp(v3ReadoutTimer, -60, 60, 0);
          if (typeof bbHardcoreThreat !== "undefined") bbHardcoreThreat = bbRuntimeClamp(bbHardcoreThreat, 0, 100, 0);
          if (typeof bbHardcoreDashBreaks !== "undefined") bbHardcoreDashBreaks = bbRuntimeInt(bbHardcoreDashBreaks, 0, 1000000, 0);
          bbRuntimeSanitizeList(enemies, MAX_ENEMIES, "enemy");
          bbRuntimeSanitizeList(bullets, MAX_PLAYER_BULLETS, "bullet");
          bbRuntimeSanitizeList(enemyBullets, MAX_ENEMY_BULLETS, "bullet");
          bbRuntimeSanitizeList(particles, MAX_PARTICLES, "particle");
          bbRuntimeSanitizeList(pickups, MAX_PICKUPS, "pickup");
          bbRuntimeSanitizeList(chainArcs, MAX_CHAIN_ARCS, "arc");
          if (typeof v3BlastRings !== "undefined") bbRuntimeSanitizeList(v3BlastRings, 64, "ring");
          compactCombatArrays();
        } catch (_) {}
      }
      function bbRuntimeRecover(error, phase = "runtime") {
        const stamp = nowMs();
        if (bbRuntimeSafety.recovering) return;
        bbRuntimeSafety.recovering = true;
        try {
          if (stamp - bbRuntimeSafety.lastFaultAt > 5000) bbRuntimeSafety.faults = 0;
          bbRuntimeSafety.lastFaultAt = stamp;
          bbRuntimeSafety.faults++;
          bbRuntimeSafety.lastFrameAt = stamp;
          bbRuntimeSanitizeState();
          last = 0;
          accumulator = 0;
          if (bbRuntimeSafety.faults >= 2 && !bbRuntimeSafety.safeMode) {
            bbRuntimeSafety.safeMode = true;
            gameSettings.performance = true;
            gameSettings.effects = false;
            document.body.classList.add("low-power", "no-effects");
          }
          if (bbRuntimeSafety.faults >= 3) {
            bullets.length = 0;
            enemyBullets.length = 0;
            particles.length = 0;
            chainArcs.length = 0;
          if (typeof v3BlastRings !== "undefined") v3BlastRings.length = 0;
            if (typeof bbHardcoreTelegraphs !== "undefined") bbHardcoreTelegraphs.length = 0;
            bbRuntimeResetCanvas();
          }
          if (stamp - bbRuntimeSafety.lastWarningAt > 3000) {
            bbRuntimeSafety.lastWarningAt = stamp;
            try {
              const detail = error && error.message ? `: ${error.message}` : "";
              console.warn(`[BUY BUTTON] recovered ${phase}${detail}`);
            } catch (_) {}
          }
        } finally {
          bbRuntimeSafety.recovering = false;
        }
      }

      // Capture the fully patched functions, then put a small fuse around
      // each hot path.  The original gameplay code remains untouched.
      const bbBaseUpdate = update;
      const bbBaseDraw = draw;
      const bbBaseSyncHud = syncHud;
      update = function bbSafeUpdate(dt = BB_RUNTIME_STEP) {
        const step = bbRuntimeClamp(dt, 0, .05, BB_RUNTIME_STEP);
        try {
          bbBaseUpdate(step);
          saveRunSnapshotHook?.("tick");
          bbRuntimeSafety.updateFaults = 0;
          bbRuntimeSafety.frameCount++;
          if (bbRuntimeSafety.frameCount % 180 === 0) bbRuntimeSanitizeState();
        } catch (error) {
          bbRuntimeSafety.updateFaults++;
          bbRuntimeRecover(error, "update");
        } finally {
          bbRuntimeSafety.lastFrameAt = nowMs();
        }
      };
      syncHud = function bbSafeSyncHud(force = false) {
        const stamp = nowMs();
        if (!force && stamp - bbRuntimeSafety.lastHudAt < 80) return;
        if (bbRuntimeSafety.hudBusy) return;
        bbRuntimeSafety.hudBusy = true;
        try {
          bbBaseSyncHud();
          ["combatReadout", "storyText", "toast", "combatFlash"].forEach((id) => {
            const node = $(id);
            if (node && node.textContent) node.textContent = bbRuntimeShortText(node.textContent);
          });
          bbRuntimeSafety.hudFaults = 0;
        } catch (error) {
          bbRuntimeSafety.hudFaults++;
          bbRuntimeRecover(error, "hud");
        } finally {
          bbRuntimeSafety.lastHudAt = stamp;
          bbRuntimeSafety.hudBusy = false;
        }
      };
      draw = function bbSafeDraw(time) {
        const stamp = nowMs();
        if (stamp < bbRuntimeSafety.drawSkipUntil) {
          bbRuntimePaintFallbackFrame();
          return;
        }
        try {
          bbBaseDraw(Number.isFinite(Number(time)) ? Number(time) : stamp / 1000);
          bbRuntimeSafety.drawFaults = 0;
        } catch (error) {
          bbRuntimeSafety.drawFaults++;
          bbRuntimeSafety.drawSkipUntil = stamp + 220;
          bbRuntimePaintFallbackFrame();
          bbRuntimeRecover(error, "draw");
        }
      };

      const bbRuntimeScheduleFrame = () => {
        if (bbRuntimeSafety.rafPending) return;
        bbRuntimeSafety.rafPending = true;
        try {
          raf((stamp) => {
            bbRuntimeSafety.rafPending = false;
            loop(stamp);
          });
        } catch (error) {
          bbRuntimeSafety.rafPending = false;
          bbRuntimeRecover(error, "raf");
          try {
            window.setTimeout(() => {
              bbRuntimeSafety.rafPending = false;
              loop(nowMs());
            }, 32);
          } catch (_) {}
        }
      };
      loop = function bbSafeLoop(now) {
        const frameStamp = bbRuntimeNumber(now, nowMs());
        bbRuntimeSafety.lastFrameAt = nowMs();
        try {
          if (document.hidden) {
            last = frameStamp;
            accumulator = 0;
            return;
          }
          try {
            updateOrientationGuard();
          } catch (error) {
            bbRuntimeRecover(error, "orientation");
          }
          if (!Number.isFinite(last) || last <= 0 || frameStamp < last) last = frameStamp;
          let frameDelta = (frameStamp - last) / 1000;
          if (!Number.isFinite(frameDelta) || frameDelta < 0) frameDelta = BB_RUNTIME_STEP;
          frameDelta = Math.min(.05, frameDelta);
          last = frameStamp;
          accumulator = bbRuntimeClamp(accumulator + frameDelta, 0, .2, 0);
          let steps = 0;
          while (accumulator >= BB_RUNTIME_STEP && steps < BB_RUNTIME_MAX_STEPS) {
            const before = accumulator;
            update(BB_RUNTIME_STEP);
            steps++;
            accumulator -= BB_RUNTIME_STEP;
            if (!Number.isFinite(accumulator) || accumulator >= before) {
              accumulator = 0;
              break;
            }
          }
          if (steps >= BB_RUNTIME_MAX_STEPS) accumulator = 0;
          draw(frameStamp / 1000);
        } catch (error) {
          bbRuntimeRecover(error, "loop");
          last = frameStamp;
          accumulator = 0;
        } finally {
          bbRuntimeSafety.lastFrameAt = nowMs();
          bbRuntimeScheduleFrame();
        }
      };
      const bbRuntimeArmWatchdog = () => {
        try {
          clearTimeout(bbRuntimeSafety.watchdogTimer);
          bbRuntimeSafety.watchdogTimer = window.setTimeout(() => {
            try {
              const age = nowMs() - bbRuntimeSafety.lastFrameAt;
              if (!document.hidden && age > 2200) {
                bbRuntimeSafety.rafPending = false;
                bbRuntimeRecover(new Error("frame watchdog"), "watchdog");
                last = 0;
                accumulator = 0;
                bbRuntimeScheduleFrame();
              }
            } catch (error) {
              bbRuntimeRecover(error, "watchdog");
            } finally {
              bbRuntimeArmWatchdog();
            }
          }, 1500);
        } catch (error) {
          bbRuntimeRecover(error, "watchdog-arm");
        }
      };
      const bbRuntimeIgnoredError = (reason) => {
        const name = reason?.name || "";
        const message = String(reason?.message || reason || "");
        return name === "AbortError" || /ResizeObserver loop limit exceeded/i.test(message);
      };
      window.addEventListener("error", (event) => {
        // Ignore normal image/font resource failures; the UI already has
        // fallbacks for those and they should not enter safe mode.
        if (event?.target && event.target !== window) return;
        const reason = event?.error || new Error(event?.message || "window error");
        if (!bbRuntimeIgnoredError(reason)) bbRuntimeRecover(reason, "window");
      });
      window.addEventListener("unhandledrejection", (event) => {
        const reason = event?.reason instanceof Error
          ? event.reason
          : new Error(String(event?.reason || "promise rejection"));
        if (!bbRuntimeIgnoredError(reason)) bbRuntimeRecover(reason, "promise");
      });
      try {
        window.__BUY_BUTTON_RUNTIME__ = bbRuntimeSafety;
      } catch (_) {}

      try {
        resize();
      } catch (error) {
        bbRuntimeRecover(error, "initial-resize");
      }
      bbRuntimeArmWatchdog();
      bbRuntimeScheduleFrame();

      // FRONTIER PATCH // readable arenas, hard separation and adaptive runs.
      const BB_UPGRADE_FLOW_KEY = "buy_button_upgrade_flow_v1";
      let bbUpgradeFlowEnabled = true;
      try { bbUpgradeFlowEnabled = localStorage.getItem(BB_UPGRADE_FLOW_KEY) !== "off"; } catch (_) {}
      let bbArenaAnchor = { x: 0, y: 0 };
      let bbArenaSkill = .5;
      let bbArenaWaveStartedAt = 0;
      let bbArenaLastWave = 0;

      function bbArenaRadius(inputWave = wave) {
        const n = Math.max(1, Number(inputWave) || 1);
        const bounded = Math.min(10, n);
        return 540 + Math.pow(bounded - 1, 1.16) * 126;
      }
      function bbArenaRefreshButton() {
        const button = $("shopToggleBtn");
        if (!button) return;
        button.classList.toggle("off", !bbUpgradeFlowEnabled);
        button.setAttribute("aria-pressed", String(bbUpgradeFlowEnabled));
        button.textContent = bbUpgradeFlowEnabled ? "UPGRADES // AUTO" : "UPGRADES // SKIP";
        button.title = bbUpgradeFlowEnabled ? "Between-wave upgrade screen is enabled" : "Between-wave upgrade screen is skipped";
      }
      function bbArenaSeparateEntities() {
        const live = enemies.filter((enemy) => enemy && enemy.alive && Number.isFinite(enemy.x) && Number.isFinite(enemy.y));
        for (let i = 0; i < live.length; i++) {
          const left = live[i];
          for (let j = i + 1; j < live.length; j++) {
            const right = live[j];
            const dx = right.x - left.x, dy = right.y - left.y;
            const distance = Math.hypot(dx, dy) || .001;
            const minimum = (Number(left.r) || 10) + (Number(right.r) || 10) + 3;
            if (distance >= minimum) continue;
            const push = (minimum - distance) * .5;
            const nx = dx / distance, ny = dy / distance;
            left.x -= nx * push; left.y -= ny * push;
            right.x += nx * push; right.y += ny * push;
          }
        }
        for (const enemy of live) {
          const dx = enemy.x - player.x, dy = enemy.y - player.y;
          const distance = Math.hypot(dx, dy) || .001;
          const minimum = (Number(enemy.r) || 10) + (Number(player.r) || 16) + 5;
          if (distance >= minimum) continue;
          const nx = dx / distance, ny = dy / distance;
          enemy.x = player.x + nx * minimum;
          enemy.y = player.y + ny * minimum;
          enemy.knockX = (enemy.knockX || 0) + nx * 38;
          enemy.knockY = (enemy.knockY || 0) + ny * 38;
        }
      }
      function bbArenaApplyBounds(dt) {
        if (state !== "playing" || !player) return;
        const distance = Math.hypot(player.x - bbArenaAnchor.x, player.y - bbArenaAnchor.y);
        const radius = bbArenaRadius(wave);
        if (wave <= 10) {
          if (distance > radius) {
            const nx = (player.x - bbArenaAnchor.x) / Math.max(distance, .001);
            const ny = (player.y - bbArenaAnchor.y) / Math.max(distance, .001);
            player.x = bbArenaAnchor.x + nx * radius;
            player.y = bbArenaAnchor.y + ny * radius;
          }
          return;
        }
        const softRadius = bbArenaRadius(10) + (wave - 10) * 180;
        const overflow = Math.max(0, distance - softRadius);
        if (overflow > 0 && typeof hurt === "function") hurt(Math.min(22, 1.8 + overflow * .012) * dt);
      }
      function bbArenaUpdateHud() {
        const threat = $("hardcoreThreatText");
        if (!threat || state !== "playing") return;
        if (wave > 10) {
          const distance = Math.hypot(player.x - bbArenaAnchor.x, player.y - bbArenaAnchor.y);
          const limit = bbArenaRadius(10) + (wave - 10) * 180;
          const overflow = Math.max(0, distance - limit);
          threat.textContent = overflow > 0 ? `BOUNDARY // HP DRAIN ${Math.min(99, Math.ceil(overflow / 10))}%` : `ENDLESS // SKILL ${Math.round(bbArenaSkill * 100)}%`;
        }
      }

      // Two extra archetypes are deliberately rare and are selected from the
      // same pool as the existing expansion/hardcore enemies.
      Object.assign(enemyTypes, {
        phase: { name: "PHASE", color: "#8cf7d4", hp: 72, speed: 116, r: 13, touch: 23, value: 26, ranged: true, orbit: true, lore: "It refuses the route you just learned." },
        surge: { name: "SURGE", color: "#ffcc66", hp: 92, speed: 68, r: 17, touch: 28, value: 31, ranged: true, pulse: true, lore: "Its pattern changes when you aim at it." }
      });

      const bbFrontierBaseResetRun = resetRun;
      const bbFrontierBaseStartWave = startWave;
      const bbFrontierBaseChooseType = chooseType;
      const bbFrontierBaseSpawnEnemy = spawnEnemy;
      const bbFrontierBaseUpdate = update;
      const bbFrontierBaseOpenShop = openShop;
      const bbFrontierBaseDrawWorld = drawWorld;

      resetRun = function bbFrontierResetRun() {
        const result = bbFrontierBaseResetRun.apply(this, arguments);
        bbArenaAnchor = { x: Number(player.x) || 0, y: Number(player.y) || 0 };
        bbArenaSkill = .5;
        bbArenaWaveStartedAt = 0;
        bbArenaLastWave = 0;
        bbArenaRefreshButton();
        return result;
      };
      startWave = function bbFrontierStartWave(next) {
        if (bbArenaLastWave > 0 && next > bbArenaLastWave) {
          const hpRatio = clamp((Number(player.hp) || 0) / Math.max(1, Number(player.maxHp) || 1), 0, 1);
          const waveSeconds = Math.max(1, (Number(elapsed) || 0) - bbArenaWaveStartedAt);
          const tempo = clamp(36 / waveSeconds, 0, 1);
          const performance = hpRatio * .58 + tempo * .22 + clamp((Number(player.kills) || 0) / Math.max(8, next * 2.2), 0, 1) * .2;
          bbArenaSkill = clamp(bbArenaSkill * .72 + performance * .28, .22, .98);
        }
        const result = bbFrontierBaseStartWave.apply(this, arguments);
        bbArenaLastWave = Math.max(1, Number(next) || 1);
        bbArenaWaveStartedAt = Number(elapsed) || 0;
        bbArenaRefreshButton();
        return result;
      };
      chooseType = function bbFrontierChooseType() {
        const roll = Math.random();
        if (wave >= 4 && roll < Math.min(.11, .035 + wave * .003)) return "phase";
        if (wave >= 6 && roll > .93) return "surge";
        return bbFrontierBaseChooseType.apply(this, arguments);
      };
      spawnEnemy = function bbFrontierSpawnEnemy() {
        const before = enemies.length;
        const result = bbFrontierBaseSpawnEnemy.apply(this, arguments);
        const skillScale = clamp(.91 + bbArenaSkill * .27 + Math.max(0, wave - 10) * .008, .88, 1.28);
        for (let i = before; i < enemies.length; i++) {
          const enemy = enemies[i];
          if (!enemy || !enemy.alive) continue;
          enemy.hp *= skillScale;
          enemy.maxHp *= skillScale;
          enemy.speed *= clamp(.96 + (skillScale - .9) * .32, .92, 1.1);
          enemy.touch *= clamp(.95 + (skillScale - .9) * .35, .9, 1.12);
        }
        return result;
      };
      update = function bbFrontierUpdate(dt) {
        bbFrontierBaseUpdate(dt);
        if (state === "playing") {
          bbArenaApplyBounds(dt);
          bbArenaSeparateEntities();
          bbArenaUpdateHud();
        }
      };
      openShop = function bbFrontierOpenShop() {
        if (!bbUpgradeFlowEnabled) {
          continueWave();
          return;
        }
        return bbFrontierBaseOpenShop.apply(this, arguments);
      };
      drawWorld = function bbFrontierDrawWorld(time) {
        bbFrontierBaseDrawWorld.apply(this, arguments);
        if (state !== "playing" || !ctx || !player) return;
        const center = worldToScreen(bbArenaAnchor.x, bbArenaAnchor.y);
        ctx.save();
        ctx.globalAlpha = wave <= 10 ? .32 : .18;
        ctx.strokeStyle = wave <= 10 ? "#5ff4ff" : "#ffb35f";
        ctx.setLineDash([10, 12]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(center.x, center.y, bbArenaRadius(wave) * worldRenderScale(), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };
      $("shopToggleBtn")?.addEventListener("click", () => {
        bbUpgradeFlowEnabled = !bbUpgradeFlowEnabled;
        try { localStorage.setItem(BB_UPGRADE_FLOW_KEY, bbUpgradeFlowEnabled ? "on" : "off"); } catch (_) {}
        bbArenaRefreshButton();
        toast(bbUpgradeFlowEnabled ? "UPGRADE TERMINAL // ENABLED" : "UPGRADE TERMINAL // AUTO-SKIP", 1300);
        buttonTone(bbUpgradeFlowEnabled ? 720 : 260, .08, "square");
      });
      bbArenaRefreshButton();

/* ===== 90-customization-catalog.js ===== */
      // OPERATOR STUDIO // durable cosmetics and player-selected assist rules.
      // This fragment deliberately lives inside the runtime closure so it can
      // extend the mature v5 engine without exposing mutable globals.
      const BB_CUSTOMIZATION_KEY = "buy_button_operator_studio_v1";
      const BB_CUSTOMIZATION_VERSION = 1;
      const BB_OPERATOR_CATALOG = Object.freeze([
        { id: "signal-runner", name: "SIGNAL RUNNER", fa: "دوندهٔ سیگنال", title: "Balanced core", faTitle: "هستهٔ متعادل", description: "Clean green pulse.", faDescription: "پالس سبز تمیز.", glyph: "B", shape: "ring", palette: "acid", trail: "spark" },
        { id: "arc-broker", name: "ARC BROKER", fa: "کارگزار قوسی", title: "Electric analyst", faTitle: "تحلیل‌گر الکتریکی", description: "Cyan route.", faDescription: "مسیر فیروزه‌ای.", glyph: "A", shape: "hex", palette: "cyan", trail: "arc" },
        { id: "hood-phantom", name: "HOOD PHANTOM", fa: "شبح هود", title: "Quiet escape artist", faTitle: "فراریِ خاموش", description: "Violet afterimage.", faDescription: "رد بنفش.", glyph: "H", shape: "diamond", palette: "violet", trail: "ghost" },
        { id: "cold-vault", name: "COLD VAULT", fa: "خزانهٔ سرد", title: "Reserve keeper", faTitle: "نگهبان ذخیره", description: "Ice-blue shell.", faDescription: "پوستهٔ آبی یخی.", glyph: "K", shape: "square", palette: "ice", trail: "shield" },
        { id: "nova-clerk", name: "NOVA CLERK", fa: "کارمند نُوا", title: "Burst specialist", faTitle: "متخصص انفجار", description: "Amber burst.", faDescription: "انفجار کهربایی.", glyph: "N", shape: "star", palette: "amber", trail: "comet" },
        { id: "chain-walker", name: "CHAIN WALKER", fa: "رهرو زنجیره", title: "Linked operator", faTitle: "اپراتور پیوندی", description: "Linked steps.", faDescription: "قدم‌های پیوندی.", glyph: "46", shape: "hex", palette: "mint", trail: "arc" },
        { id: "margin-miner", name: "MARGIN MINER", fa: "معدن‌چی مارجین", title: "Deep-field worker", faTitle: "کارگر میدان عمیق", description: "Orange heat.", faDescription: "گرمای نارنجی.", glyph: "M", shape: "triangle", palette: "orange", trail: "ember" },
        { id: "oracle-lime", name: "ORACLE LIME", fa: "اوراکل لایم", title: "Pattern reader", faTitle: "خوانندهٔ الگو", description: "Clean line.", faDescription: "خط صاف.", glyph: "O", shape: "ring", palette: "lime", trail: "grid" },
        { id: "pulse-rider", name: "PULSE RIDER", fa: "سوار پالس", title: "Fast-lane courier", faTitle: "پیک خط سریع", description: "Pink comet.", faDescription: "دنبالهٔ صورتی.", glyph: "P", shape: "diamond", palette: "rose", trail: "comet" },
        { id: "night-ledger", name: "NIGHT LEDGER", fa: "دفتر شب", title: "Low-light navigator", faTitle: "ناوبرِ نور کم", description: "Monochrome core.", faDescription: "هستهٔ تک‌رنگ.", glyph: "L", shape: "square", palette: "mono", trail: "ghost" },
        { id: "green-warden", name: "GREEN WARDEN", fa: "نگهبان سبز", title: "Frontier guardian", faTitle: "نگهبان مرز", description: "Emerald aura.", faDescription: "هالهٔ زمردی.", glyph: "G", shape: "triangle", palette: "emerald", trail: "shield" },
        { id: "eclipse-scout", name: "ECLIPSE SCOUT", fa: "پیشاهنگ کسوف", title: "Silent mapper", faTitle: "نقشه‌بردار خاموش", description: "Black-gold geometry.", faDescription: "هندسهٔ سیاه و طلایی.", glyph: "E", shape: "star", palette: "gold", trail: "grid" }
      ]);
      const BB_PALETTE_CATALOG = Object.freeze([
        { id: "acid", name: "ACID", fa: "سبز اسیدی", primary: "#ccff00", bright: "#f4ff77", dim: "#6e9217", rgb: "204, 255, 0" },
        { id: "cyan", name: "CYAN", fa: "فیروزه‌ای", primary: "#5ff4ff", bright: "#d2fdff", dim: "#277e86", rgb: "95, 244, 255" },
        { id: "violet", name: "VIOLET", fa: "بنفش", primary: "#ad84ff", bright: "#e7d9ff", dim: "#5f4298", rgb: "173, 132, 255" },
        { id: "ice", name: "ICE", fa: "یخی", primary: "#8cf7d4", bright: "#edfff8", dim: "#367b6b", rgb: "140, 247, 212" },
        { id: "amber", name: "AMBER", fa: "کهربایی", primary: "#ffb35f", bright: "#fff0d4", dim: "#9c5e22", rgb: "255, 179, 95" },
        { id: "mint", name: "MINT", fa: "نعنایی", primary: "#76f7c5", bright: "#dffff1", dim: "#2a8966", rgb: "118, 247, 197" },
        { id: "orange", name: "ORANGE", fa: "نارنجی", primary: "#ff8e45", bright: "#ffe0c7", dim: "#994515", rgb: "255, 142, 69" },
        { id: "lime", name: "LIME", fa: "لایم", primary: "#a5ff4d", bright: "#edffd8", dim: "#568d20", rgb: "165, 255, 77" },
        { id: "rose", name: "ROSE", fa: "رز", primary: "#ff72d2", bright: "#ffe0f5", dim: "#91365f", rgb: "255, 114, 210" },
        { id: "emerald", name: "EMERALD", fa: "زمردی", primary: "#39e98c", bright: "#d9ffe9", dim: "#197447", rgb: "57, 233, 140" },
        { id: "gold", name: "GOLD", fa: "طلایی", primary: "#ffd86a", bright: "#fff3c9", dim: "#916e13", rgb: "255, 216, 106" },
        { id: "mono", name: "MONO", fa: "تک‌رنگ", primary: "#e9f0e6", bright: "#ffffff", dim: "#6c7569", rgb: "233, 240, 230" }
      ]);
      const BB_TRAIL_CATALOG = Object.freeze([
        { id: "spark", name: "SPARK", fa: "جرقه", description: "Short bright pulses.", faDescription: "پالس‌های کوتاه و روشن." },
        { id: "arc", name: "ARC", fa: "قوس", description: "Linked electric points.", faDescription: "نقاط الکتریکیِ پیوسته." },
        { id: "ghost", name: "GHOST", fa: "شبح", description: "Soft fading echoes.", faDescription: "اکوهای نرم و محو." },
        { id: "shield", name: "SHIELD", fa: "سپر", description: "A defensive ring wake.", faDescription: "رد حلقه‌ای دفاعی." },
        { id: "comet", name: "COMET", fa: "دنباله‌دار", description: "A long fast tail.", faDescription: "دنباله‌ای بلند و سریع." },
        { id: "ember", name: "EMBER", fa: "اخگر", description: "Warm square embers.", faDescription: "اخگرهای مربعی گرم." },
        { id: "grid", name: "GRID", fa: "گرید", description: "Clean tactical markers.", faDescription: "نشانگرهای تاکتیکی تمیز." }
      ]);
      const BB_AIM_MODE_CATALOG = Object.freeze([
        { id: "smart", name: "SMART", fa: "هوشمند", description: "Balanced target.", faDescription: "هدف متعادل." },
        { id: "nearest", name: "NEAREST", fa: "نزدیک‌ترین", description: "Closest first.", faDescription: "نزدیک‌ترین اول." },
        { id: "weakest", name: "WEAKEST", fa: "ضعیف‌ترین", description: "Finish the weak.", faDescription: "ضعیف‌تر را تمام کن." },
        { id: "boss", name: "BOSS FIRST", fa: "اول باس", description: "Bosses first.", faDescription: "اول باس." },
        { id: "cursor", name: "CURSOR", fa: "نشانگر ماوس", description: "Near the cursor.", faDescription: "نزدیک نشانگر." },
        { id: "manual", name: "MANUAL", fa: "دستی", description: "Point and fire.", faDescription: "نشانه بگیر و شلیک کن." }
      ]);
      const BB_SHOT_MODE_CATALOG = Object.freeze([
        { id: "native", name: "NATIVE", fa: "اصلی", description: "Weapon default.", faDescription: "الگوی اصلی." },
        { id: "twin", name: "TWIN LINK", fa: "دوقلو", description: "Mirrored shot.", faDescription: "شلیک قرینه." },
        { id: "fan", name: "FAN SPREAD", fa: "بادبزنی", description: "Wide fan.", faDescription: "پوشش بادبزنی." },
        { id: "pierce", name: "PIERCE ROUTE", fa: "نفوذی", description: "More pierce.", faDescription: "نفوذ بیشتر." },
        { id: "orbit", name: "ORBITAL", fa: "مداری", description: "Gentle arc.", faDescription: "قوس ملایم." },
        { id: "burst", name: "BURST ECHO", fa: "انفجار اکو", description: "Slow echo.", faDescription: "اکوی کند." }
      ]);
      const BB_CROSSHAIR_CATALOG = Object.freeze([
        { id: "bracket", name: "BRACKET", fa: "براکت" },
        { id: "dot", name: "DOT", fa: "نقطه" },
        { id: "ring", name: "RING", fa: "حلقه" },
        { id: "diamond", name: "DIAMOND", fa: "لوزی" },
        { id: "off", name: "OFF", fa: "خاموش" }
      ]);
      const BB_UI_SCALE_CATALOG = Object.freeze([
        { id: "compact", name: "COMPACT", fa: "فشرده" },
        { id: "standard", name: "STANDARD", fa: "استاندارد" },
        { id: "large", name: "LARGE", fa: "بزرگ" }
      ]);
      const BB_CUSTOMIZATION_DEFAULT = Object.freeze({
        version: BB_CUSTOMIZATION_VERSION,
        operatorId: "signal-runner",
        paletteId: "acid",
        trailId: "spark",
        aimModeId: "smart",
        shotModeId: "native",
        crosshairId: "bracket",
        uiScaleId: "standard",
        // Manual input is the safe first-run default. Auto-fire remains a
        // deliberate opt-in from Operator Studio or the F shortcut.
        autoFire: false,
        aimLine: true,
        auraStrength: 72,
        updatedAt: 0
      });
      let bbCustomizationHadLocalRecord = false;
      const bbCustomizationCatalogById = (catalog, id, fallbackId) =>
        catalog.find((item) => item.id === id)
        || catalog.find((item) => item.id === fallbackId)
        || catalog[0];
      const bbCustomizationLabel = (entry, field = "name") => {
        if (!entry) return "";
        if (currentLocale === "fa") return entry[`fa${field.charAt(0).toUpperCase()}${field.slice(1)}`] || entry.fa || entry[field] || entry.name || "";
        return entry[field] || entry.name || "";
      };
      const bbCustomizationText = (english, persian) => currentLocale === "fa" ? persian : english;
      const bbCustomizationSafeNumber = (value, fallback, min, max) => {
        const number = Number(value);
        return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
      };
      const bbSanitizeCustomization = (value) => {
        const raw = value && typeof value === "object" ? value : {};
        const operator = bbCustomizationCatalogById(BB_OPERATOR_CATALOG, String(raw.operatorId || ""), BB_CUSTOMIZATION_DEFAULT.operatorId);
        const palette = bbCustomizationCatalogById(BB_PALETTE_CATALOG, String(raw.paletteId || ""), operator.palette || BB_CUSTOMIZATION_DEFAULT.paletteId);
        const trail = bbCustomizationCatalogById(BB_TRAIL_CATALOG, String(raw.trailId || ""), operator.trail || BB_CUSTOMIZATION_DEFAULT.trailId);
        return {
          version: BB_CUSTOMIZATION_VERSION,
          operatorId: operator.id,
          paletteId: palette.id,
          trailId: trail.id,
          aimModeId: bbCustomizationCatalogById(BB_AIM_MODE_CATALOG, String(raw.aimModeId || ""), BB_CUSTOMIZATION_DEFAULT.aimModeId).id,
          shotModeId: bbCustomizationCatalogById(BB_SHOT_MODE_CATALOG, String(raw.shotModeId || ""), BB_CUSTOMIZATION_DEFAULT.shotModeId).id,
          crosshairId: bbCustomizationCatalogById(BB_CROSSHAIR_CATALOG, String(raw.crosshairId || ""), BB_CUSTOMIZATION_DEFAULT.crosshairId).id,
          uiScaleId: bbCustomizationCatalogById(BB_UI_SCALE_CATALOG, String(raw.uiScaleId || ""), BB_CUSTOMIZATION_DEFAULT.uiScaleId).id,
          autoFire: typeof raw.autoFire === "boolean" ? raw.autoFire : BB_CUSTOMIZATION_DEFAULT.autoFire,
          aimLine: typeof raw.aimLine === "boolean" ? raw.aimLine : BB_CUSTOMIZATION_DEFAULT.aimLine,
          auraStrength: Math.round(bbCustomizationSafeNumber(raw.auraStrength, BB_CUSTOMIZATION_DEFAULT.auraStrength, 0, 100)),
          updatedAt: Math.max(0, Math.floor(Number(raw.updatedAt) || 0))
        };
      };
      const bbReadCustomization = () => {
        const candidates = [];
        for (const entry of readStorageEntries(BB_CUSTOMIZATION_KEY)) {
          try {
            const parsed = JSON.parse(entry.raw);
            if (parsed && typeof parsed === "object") candidates.push({ source: entry.source, value: parsed });
          } catch (_) {}
        }
        candidates.sort((left, right) => {
          const freshness = (Number(right.value.updatedAt) || 0) - (Number(left.value.updatedAt) || 0);
          return freshness || (left.source === "localStorage" ? -1 : 1);
        });
        bbCustomizationHadLocalRecord = candidates.length > 0;
        return bbSanitizeCustomization(candidates[0]?.value || BB_CUSTOMIZATION_DEFAULT);
      };
      let bbCustomization = bbReadCustomization();
      let bbCustomizationPanel = null;
      let bbCustomizationPanelLastFocus = null;
      let bbCustomizationTrail = [];
      let bbCustomizationTrailClock = 0;
      let bbCustomizationLastTargetId = "";
      let bbCustomizationTargetNonce = 0;
      const bbOperatorFor = () => bbCustomizationCatalogById(BB_OPERATOR_CATALOG, bbCustomization.operatorId, BB_CUSTOMIZATION_DEFAULT.operatorId);
      const bbPaletteFor = () => bbCustomizationCatalogById(BB_PALETTE_CATALOG, bbCustomization.paletteId, BB_CUSTOMIZATION_DEFAULT.paletteId);
      const bbTrailFor = () => bbCustomizationCatalogById(BB_TRAIL_CATALOG, bbCustomization.trailId, BB_CUSTOMIZATION_DEFAULT.trailId);
      const bbAimModeFor = () => bbCustomizationCatalogById(BB_AIM_MODE_CATALOG, bbCustomization.aimModeId, BB_CUSTOMIZATION_DEFAULT.aimModeId);
      const bbShotModeFor = () => bbCustomizationCatalogById(BB_SHOT_MODE_CATALOG, bbCustomization.shotModeId, BB_CUSTOMIZATION_DEFAULT.shotModeId);
      const bbCrosshairFor = () => bbCustomizationCatalogById(BB_CROSSHAIR_CATALOG, bbCustomization.crosshairId, BB_CUSTOMIZATION_DEFAULT.crosshairId);
      const bbUiScaleFor = () => bbCustomizationCatalogById(BB_UI_SCALE_CATALOG, bbCustomization.uiScaleId, BB_CUSTOMIZATION_DEFAULT.uiScaleId);
      const bbPersistCustomization = () => {
        bbCustomization = bbSanitizeCustomization({ ...bbCustomization, updatedAt: Date.now() });
        const serialized = JSON.stringify(bbCustomization);
        let persisted = false;
        try {
          window.localStorage?.setItem(BB_CUSTOMIZATION_KEY, serialized);
          persisted = true;
        } catch (_) {}
        if (!persisted) {
          try { window.sessionStorage?.setItem(BB_CUSTOMIZATION_KEY, serialized); } catch (_) {}
        }
        bbEmitCloudChange("customization", { ...bbCustomization }, bbCustomization.updatedAt);
      };
      const bbApplyCustomizationTheme = () => {
        const palette = bbPaletteFor();
        const root = document.documentElement;
        root.style.setProperty("--bb-accent", palette.primary);
        root.style.setProperty("--bb-accent-rgb", palette.rgb);
        root.style.setProperty("--bb-accent-strong", palette.bright);
        root.style.setProperty("--acid", palette.primary);
        root.style.setProperty("--acid-soft", palette.dim);
        document.body.classList.add("bb-customized");
        document.body.dataset.bbOperator = bbCustomization.operatorId;
        document.body.dataset.bbPalette = bbCustomization.paletteId;
        document.body.dataset.bbTrail = bbCustomization.trailId;
        document.body.dataset.bbUiScale = bbCustomization.uiScaleId;
        document.body.dataset.bbAimMode = bbCustomization.aimModeId;
        document.body.dataset.bbShotMode = bbCustomization.shotModeId;
        document.body.classList.toggle("bb-aim-line-off", !bbCustomization.aimLine);
        try { document.querySelector('meta[name="theme-color"]')?.setAttribute("content", palette.primary); } catch (_) {}
      };
      const bbSyncCustomizationToEngine = () => {
        aimAssist = !!bbCustomization.autoFire;
        try {
          if (archive && typeof archive === "object") archive.autoFire = aimAssist;
        } catch (_) {}
      };
      const bbCommitCustomization = (patch = {}, announce = false) => {
        bbCustomization = bbSanitizeCustomization({ ...bbCustomization, ...patch, updatedAt: Date.now() });
        bbPersistCustomization();
        bbApplyCustomizationTheme();
        bbSyncCustomizationToEngine();
        try { saveArchive?.(); } catch (_) {}
        try { syncHud?.(true); } catch (_) {}
        try { bbRefreshCustomizationUi?.(); } catch (_) {}
        if (announce) {
          try {
            toast(`${bbCustomizationText("OPERATOR PROFILE", "پروفایل اپراتور")} // ${bbCustomizationLabel(bbOperatorFor())}`, 1500);
          } catch (_) {}
        }
      };
      bbApplyCustomizationTheme();
      bbSyncCustomizationToEngine();

/* ===== 91-customization-ui.js ===== */
      // OPERATOR STUDIO // presentation component.
      const bbElement = (tag, className = "", text = "") => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
      };
      const bbSetButtonLabel = (button, text, title = "") => {
        if (!button) return;
        button.textContent = text;
        if (title) button.title = title;
      };
      const bbOperatorDescription = (operator) => bbCustomizationLabel(operator, "description");
      const bbTitle = (english, persian) => bbCustomizationText(english, persian);
      const bbMakeStudioButton = (id, label, className = "ghost-btn") => {
        const button = bbElement("button", `${className} bb-studio-trigger`, label);
        button.id = id;
        button.type = "button";
        button.setAttribute("aria-haspopup", "dialog");
        button.addEventListener("click", () => bbOpenCustomizationPanel());
        return button;
      };
      const bbChoiceButton = (group, entry, selectedId, palette = null) => {
        const button = bbElement("button", "bb-choice-card");
        button.type = "button";
        button.dataset.bbSelect = group;
        button.dataset.bbValue = entry.id;
        button.classList.toggle("selected", entry.id === selectedId);
        button.setAttribute("aria-pressed", String(entry.id === selectedId));
        if (palette) {
          button.style.setProperty("--bb-card-color", palette.primary);
          button.style.setProperty("--bb-card-rgb", palette.rgb);
        }
        return button;
      };
      const bbRenderOperatorCards = (host) => {
        const palette = bbPaletteFor();
        host.replaceChildren();
        for (const operator of BB_OPERATOR_CATALOG) {
          const operatorPalette = bbCustomizationCatalogById(BB_PALETTE_CATALOG, operator.palette, "acid");
          const button = bbChoiceButton("operatorId", operator, bbCustomization.operatorId, operatorPalette);
          const emblem = bbElement("span", `bb-operator-emblem ${operator.shape}`, operator.glyph);
          const copy = bbElement("span", "bb-card-copy");
          const heading = bbElement("b", "", bbCustomizationLabel(operator));
          const title = bbElement("small", "", bbCustomizationLabel(operator, "title"));
          const description = bbElement("span", "", bbOperatorDescription(operator));
          copy.append(heading, title, description);
          button.append(emblem, copy);
          host.appendChild(button);
        }
        host.style.setProperty("--bb-current-rgb", palette.rgb);
      };
      const bbRenderPaletteChoices = (host) => {
        host.replaceChildren();
        for (const palette of BB_PALETTE_CATALOG) {
          const button = bbChoiceButton("paletteId", palette, bbCustomization.paletteId, palette);
          button.classList.add("bb-palette-choice");
          const swatch = bbElement("span", "bb-palette-swatch");
          const name = bbElement("b", "", bbCustomizationLabel(palette));
          button.append(swatch, name);
          host.appendChild(button);
        }
      };
      const bbRenderCompactChoices = (host, group, catalog, selectedId, className = "") => {
        host.replaceChildren();
        for (const entry of catalog) {
          const button = bbChoiceButton(group, entry, selectedId, bbPaletteFor());
          if (className) button.classList.add(className);
          const name = bbElement("b", "", bbCustomizationLabel(entry));
          const description = entry.description || entry.faDescription
            ? bbElement("small", "", bbCustomizationLabel(entry, "description"))
            : null;
          button.append(name);
          if (description) button.append(description);
          host.appendChild(button);
        }
      };
      const bbBuildCustomizationPanel = () => {
        const layer = bbElement("section", "bb-customization-layer hidden");
        layer.id = "bbCustomizationPanel";
        layer.setAttribute("role", "dialog");
        layer.setAttribute("aria-modal", "true");
        layer.setAttribute("aria-labelledby", "bbCustomizationTitle");
        layer.setAttribute("aria-hidden", "true");
        const card = bbElement("div", "bb-customization-card");
        const header = bbElement("header", "bb-customization-head");
        const titleWrap = bbElement("div");
        titleWrap.append(
          bbElement("div", "eyebrow", bbTitle("OPERATOR STUDIO // LOCAL PROFILE", "استودیوی اپراتور // پروفایل محلی")),
          bbElement("h2", "", bbTitle("CUSTOMIZE THE SIGNAL.", "سیگنال را شخصی‌سازی کن."))
        );
        titleWrap.querySelector("h2").id = "bbCustomizationTitle";
        const close = bbElement("button", "bb-studio-close", "×");
        close.type = "button";
        close.dataset.bbAction = "close";
        close.setAttribute("aria-label", bbTitle("Close customization", "بستن شخصی‌سازی"));
        header.append(titleWrap, close);

        const status = bbElement("div", "bb-profile-status");
        status.id = "bbCustomizationStatus";
        const body = bbElement("div", "bb-customization-scroll");
        body.tabIndex = 0;

        const operatorSection = bbElement("section", "bb-studio-section");
        operatorSection.append(
          bbElement("div", "bb-section-kicker", bbTitle("01 // OPERATOR", "۰۱ // اپراتور")),
          bbElement("h3", "", bbTitle("CHOOSE A CORE", "هسته را انتخاب کن.")),
          bbElement("p", "", bbTitle("Pick a look. Every run stays fair.", "ظاهر را انتخاب کن؛ بازی منصفانه می‌ماند."))
        );
        const operators = bbElement("div", "bb-operator-grid");
        operators.id = "bbOperatorChoices";
        operatorSection.appendChild(operators);

        const visualSection = bbElement("section", "bb-studio-section");
        visualSection.append(
          bbElement("div", "bb-section-kicker", bbTitle("02 // VISUALS", "۰۲ // ظاهر")),
          bbElement("h3", "", bbTitle("PALETTE, TRAIL & RETICLE", "رنگ، رد و نشانه‌گیر"))
        );
        const palettes = bbElement("div", "bb-palette-grid");
        palettes.id = "bbPaletteChoices";
        visualSection.appendChild(palettes);
        const visualSettings = bbElement("div", "bb-studio-split");
        const trailColumn = bbElement("div", "bb-mini-control");
        trailColumn.append(bbElement("b", "", bbTitle("TRAIL", "رد حرکت")));
        const trails = bbElement("div", "bb-compact-choice-grid");
        trails.id = "bbTrailChoices";
        trailColumn.appendChild(trails);
        const crosshairColumn = bbElement("div", "bb-mini-control");
        crosshairColumn.append(bbElement("b", "", bbTitle("CROSSHAIR", "نشانه‌گیر")));
        const crosshairs = bbElement("div", "bb-compact-choice-grid");
        crosshairs.id = "bbCrosshairChoices";
        crosshairColumn.appendChild(crosshairs);
        visualSettings.append(trailColumn, crosshairColumn);
        visualSection.appendChild(visualSettings);
        const auraRow = bbElement("label", "bb-range-row");
        auraRow.append(
          bbElement("span", "", bbTitle("AURA INTENSITY", "شدت هاله")),
          (() => {
            const input = document.createElement("input");
            input.type = "range";
            input.min = "0";
            input.max = "100";
            input.step = "1";
            input.value = String(bbCustomization.auraStrength);
            input.id = "bbAuraRange";
            input.dataset.bbInput = "auraStrength";
            return input;
          })(),
          (() => {
            const output = bbElement("output", "", `${bbCustomization.auraStrength}%`);
            output.id = "bbAuraValue";
            return output;
          })()
        );
        visualSection.appendChild(auraRow);

        const combatSection = bbElement("section", "bb-studio-section");
        combatSection.append(
          bbElement("div", "bb-section-kicker", bbTitle("03 // CONTROL ASSIST", "۰۳ // دستیار کنترل")),
          bbElement("h3", "", bbTitle("AIM, FIRE & AUTO-SELECT", "نشانه‌گیری، شلیک و انتخاب خودکار")),
          bbElement("p", "", bbTitle("Turn Auto on when you want the game to aim and fire.", "اگر خواستی بازی خودش هدف بگیرد و شلیک کند، Auto را روشن کن."))
        );
        const toggles = bbElement("div", "bb-toggle-grid");
        const controlMode = bbElement("button", "bb-switch bb-control-mode-setting");
        controlMode.type = "button";
        controlMode.id = "bbCombatModeSetting";
        controlMode.dataset.bbAction = "combatMode";
        const autoFire = bbElement("button", "bb-switch");
        autoFire.type = "button";
        autoFire.id = "bbAutoFireSetting";
        autoFire.dataset.bbAction = "autoFire";
        const aimLine = bbElement("button", "bb-switch");
        aimLine.type = "button";
        aimLine.id = "bbAimLineSetting";
        aimLine.dataset.bbAction = "aimLine";
        toggles.append(controlMode, autoFire, aimLine);
        combatSection.appendChild(toggles);
        const aimBlock = bbElement("div", "bb-choice-block");
        aimBlock.append(bbElement("b", "", bbTitle("TARGET MODE", "حالت هدف‌گیری")));
        const aims = bbElement("div", "bb-compact-choice-grid bb-aim-grid");
        aims.id = "bbAimChoices";
        aimBlock.appendChild(aims);
        combatSection.appendChild(aimBlock);
        const shotBlock = bbElement("div", "bb-choice-block");
        shotBlock.append(bbElement("b", "", bbTitle("FIRING STYLE", "سبک شلیک")));
        const shots = bbElement("div", "bb-compact-choice-grid bb-shot-grid");
        shots.id = "bbShotChoices";
        shotBlock.appendChild(shots);
        combatSection.appendChild(shotBlock);
        const chooseTarget = bbElement("button", "main-btn bb-target-now", bbTitle("AUTO-SELECT TARGET NOW", "هدف را خودکار انتخاب کن"));
        chooseTarget.type = "button";
        chooseTarget.dataset.bbAction = "selectTarget";
        combatSection.appendChild(chooseTarget);

        const interfaceSection = bbElement("section", "bb-studio-section");
        interfaceSection.append(
          bbElement("div", "bb-section-kicker", bbTitle("04 // INTERFACE", "۰۴ // رابط")),
          bbElement("h3", "", bbTitle("MAKE IT READABLE", "رابط را خوانا کن."))
        );
        const scales = bbElement("div", "bb-compact-choice-grid bb-scale-grid");
        scales.id = "bbUiScaleChoices";
        interfaceSection.appendChild(scales);
        const controls = bbElement("div", "bb-controls-note");
        controls.innerHTML = `<b>${bbTitle("QUICK CONTROLS", "کنترل‌های سریع")}</b><span>${bbTitle("C: studio · M: manual/auto control · G: auto-select target · F: auto-fire · 1–7: weapon · Tab: lock target", "C: استودیو · M: کنترل دستی/خودکار · G: انتخاب خودکار هدف · F: شلیک خودکار · ۱ تا ۷: سلاح · Tab: قفل هدف")}</span>`;
        interfaceSection.appendChild(controls);

        const footer = bbElement("footer", "bb-studio-footer");
        const resetVisuals = bbElement("button", "ghost-btn");
        resetVisuals.type = "button";
        resetVisuals.dataset.bbAction = "resetVisuals";
        resetVisuals.textContent = bbTitle("RESET VISUALS", "بازنشانی ظاهر");
        const resetAll = bbElement("button", "ghost-btn");
        resetAll.type = "button";
        resetAll.dataset.bbAction = "resetAll";
        resetAll.textContent = bbTitle("RESET PROFILE", "بازنشانی پروفایل");
        const done = bbElement("button", "main-btn");
        done.type = "button";
        done.dataset.bbAction = "close";
        done.textContent = bbTitle("DONE", "انجام شد");
        footer.append(resetVisuals, resetAll, done);

        body.append(operatorSection, visualSection, combatSection, interfaceSection);
        card.append(header, status, body, footer);
        layer.appendChild(card);
        document.body.appendChild(layer);
        layer.addEventListener("click", (event) => {
          if (event.target === layer) bbCloseCustomizationPanel();
        });
        card.addEventListener("click", bbHandleCustomizationInteraction);
        card.addEventListener("input", bbHandleCustomizationInteraction);
        card.addEventListener("change", bbHandleCustomizationInteraction);
        return layer;
      };
      function bbRenderCustomizationPanel() {
        if (!bbCustomizationPanel) return;
        bbRenderOperatorCards($("bbOperatorChoices"));
        bbRenderPaletteChoices($("bbPaletteChoices"));
        bbRenderCompactChoices($("bbTrailChoices"), "trailId", BB_TRAIL_CATALOG, bbCustomization.trailId, "bb-trail-choice");
        bbRenderCompactChoices($("bbCrosshairChoices"), "crosshairId", BB_CROSSHAIR_CATALOG, bbCustomization.crosshairId, "bb-crosshair-choice");
        bbRenderCompactChoices($("bbAimChoices"), "aimModeId", BB_AIM_MODE_CATALOG, bbCustomization.aimModeId, "bb-aim-choice");
        bbRenderCompactChoices($("bbShotChoices"), "shotModeId", BB_SHOT_MODE_CATALOG, bbCustomization.shotModeId, "bb-shot-choice");
        bbRenderCompactChoices($("bbUiScaleChoices"), "uiScaleId", BB_UI_SCALE_CATALOG, bbCustomization.uiScaleId, "bb-scale-choice");
        const controlMode = $("bbCombatModeSetting");
        const autoFire = $("bbAutoFireSetting");
        const aimLine = $("bbAimLineSetting");
        const aura = $("bbAuraRange");
        const auraValue = $("bbAuraValue");
        const autoControl = !!bbCustomization.autoFire;
        bbSetButtonLabel(controlMode, autoControl ? bbTitle("CONTROL // AUTO", "کنترل // خودکار") : bbTitle("CONTROL // MANUAL", "کنترل // دستی"));
        bbSetButtonLabel(autoFire, autoControl ? bbTitle("FIRE // AUTO", "شلیک // خودکار") : bbTitle("FIRE // MANUAL", "شلیک // دستی"));
        bbSetButtonLabel(aimLine, `${bbTitle("AIM LINE", "خط نشانه‌گیری")}: ${bbCustomization.aimLine ? bbTitle("ON", "روشن") : bbTitle("OFF", "خاموش")}`);
        controlMode?.classList.toggle("on", autoControl);
        autoFire?.classList.toggle("on", bbCustomization.autoFire);
        aimLine?.classList.toggle("on", bbCustomization.aimLine);
        controlMode?.setAttribute("aria-pressed", String(autoControl));
        autoFire?.setAttribute("aria-pressed", String(bbCustomization.autoFire));
        aimLine?.setAttribute("aria-pressed", String(bbCustomization.aimLine));
        if (aura) aura.value = String(bbCustomization.auraStrength);
        if (auraValue) auraValue.textContent = `${bbCustomization.auraStrength}%`;
        const operator = bbOperatorFor();
        const palette = bbPaletteFor();
        const status = $("bbCustomizationStatus");
        if (status) {
          status.style.setProperty("--bb-profile-color", palette.primary);
          status.textContent = `${bbCustomizationLabel(operator)} // ${bbCustomizationLabel(bbAimModeFor())} // ${bbCustomizationLabel(bbShotModeFor())}`;
        }
      }
      function bbRefreshCustomizationUi() {
        bbRenderCustomizationPanel();
        const hudControl = $("bbCombatModeBtn");
        const hudTarget = $("bbTargetModeBtn");
        const hudAutoFire = $("bbAutoFireHudBtn");
        const targetTitle = bbAimModeFor();
        if (hudControl) {
          const enabled = !!bbCustomization.autoFire;
          hudControl.textContent = enabled
            ? bbTitle("CONTROL // AUTO", "کنترل // خودکار")
            : bbTitle("CONTROL // MANUAL", "کنترل // دستی");
          hudControl.classList.toggle("on", enabled);
          hudControl.setAttribute("aria-pressed", String(enabled));
          hudControl.setAttribute("aria-keyshortcuts", "M");
          hudControl.title = bbTitle("Toggle complete manual/automatic control. M is the shortcut.", "کنترل کامل دستی/خودکار را تغییر بده. میانبر M است.");
        }
        if (hudTarget) {
          hudTarget.textContent = `AIM // ${bbCustomizationLabel(targetTitle)}`;
          hudTarget.classList.toggle("on", bbCustomization.aimModeId !== "manual");
          hudTarget.title = bbTitle("Click: choose target now. Shift-click: cycle target mode.", "کلیک: انتخاب هدف. شیفت+کلیک: تغییر حالت هدف‌گیری.");
        }
        if (hudAutoFire) {
          const enabled = !!bbCustomization.autoFire;
          hudAutoFire.textContent = enabled
            ? bbTitle("FIRE // AUTO", "شلیک // خودکار")
            : bbTitle("FIRE // MANUAL", "شلیک // دستی");
          hudAutoFire.classList.toggle("on", enabled);
          hudAutoFire.setAttribute("aria-pressed", String(enabled));
          hudAutoFire.setAttribute("aria-keyshortcuts", "F");
          hudAutoFire.title = bbTitle("Click to toggle automatic fire. F is the shortcut.", "برای روشن/خاموش کردن شلیک خودکار بزن. میانبر F است.");
        }
        const studioLabels = document.querySelectorAll("[data-bb-studio-label]");
        studioLabels.forEach((button) => {
          button.textContent = bbTitle("CUSTOMIZE", "شخصی‌سازی");
        });
      }
      function bbOpenCustomizationPanel() {
        if (!bbCustomizationPanel) bbCustomizationPanel = bbBuildCustomizationPanel();
        bbCustomizationPanelLastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        bbRenderCustomizationPanel();
        bbCustomizationPanel.classList.remove("hidden");
        bbCustomizationPanel.setAttribute("aria-hidden", "false");
        window.setTimeout(() => $("bbCustomizationPanel")?.querySelector(".bb-studio-close")?.focus(), 0);
      }
      function bbCloseCustomizationPanel() {
        if (!bbCustomizationPanel) return;
        bbCustomizationPanel.classList.add("hidden");
        bbCustomizationPanel.setAttribute("aria-hidden", "true");
        try { bbCustomizationPanelLastFocus?.focus(); } catch (_) {}
      }
      function bbHandleCustomizationInteraction(event) {
        const target = event.target instanceof Element ? event.target : null;
        if (!target) return;
        const selector = target.closest("[data-bb-select]");
        if (selector) {
          const group = selector.dataset.bbSelect;
          const value = selector.dataset.bbValue;
          if (group && value) {
            const patch = { [group]: value };
            if (group === "operatorId") {
              const operator = bbCustomizationCatalogById(BB_OPERATOR_CATALOG, value, BB_CUSTOMIZATION_DEFAULT.operatorId);
              if (bbCustomization.paletteId === bbOperatorFor().palette) patch.paletteId = operator.palette;
              if (bbCustomization.trailId === bbOperatorFor().trail) patch.trailId = operator.trail;
            }
            bbCommitCustomization(patch, true);
          }
          return;
        }
        const action = target.closest("[data-bb-action]")?.dataset.bbAction;
        if (action === "close") bbCloseCustomizationPanel();
        if (action === "combatMode") bbToggleCombatControlMode(true);
        if (action === "autoFire") bbToggleAutoFire(true);
        if (action === "aimLine") bbCommitCustomization({ aimLine: !bbCustomization.aimLine }, false);
        if (action === "selectTarget") bbAutoSelectTarget(true);
        if (action === "resetVisuals") {
          bbCommitCustomization({
            operatorId: BB_CUSTOMIZATION_DEFAULT.operatorId,
            paletteId: BB_CUSTOMIZATION_DEFAULT.paletteId,
            trailId: BB_CUSTOMIZATION_DEFAULT.trailId,
            crosshairId: BB_CUSTOMIZATION_DEFAULT.crosshairId,
            uiScaleId: BB_CUSTOMIZATION_DEFAULT.uiScaleId,
            auraStrength: BB_CUSTOMIZATION_DEFAULT.auraStrength,
            aimLine: BB_CUSTOMIZATION_DEFAULT.aimLine
          }, true);
        }
        if (action === "resetAll") bbCommitCustomization(BB_CUSTOMIZATION_DEFAULT, true);
        const input = target.closest("[data-bb-input]");
        if (input?.dataset.bbInput === "auraStrength") {
          bbCommitCustomization({ auraStrength: input.value }, false);
        }
      }
      function bbMountCustomizationControls() {
        const menuUtility = document.querySelector("#menu .menu-utility-row");
        if (menuUtility && !$("bbMenuStudioBtn")) {
          const button = bbMakeStudioButton("bbMenuStudioBtn", bbTitle("CUSTOMIZE", "شخصی‌سازی"));
          button.dataset.bbStudioLabel = "true";
          menuUtility.insertBefore(button, menuUtility.firstChild);
        }
        const pauseActions = document.querySelector("#pause .pause-actions");
        if (pauseActions && !$("bbPauseStudioBtn")) {
          const button = bbMakeStudioButton("bbPauseStudioBtn", bbTitle("CUSTOMIZE", "شخصی‌سازی"));
          button.dataset.bbStudioLabel = "true";
          pauseActions.insertBefore(button, pauseActions.firstChild);
        }
        const bottomHud = document.querySelector("#ui .bottom-hud");
        if (bottomHud) {
          let assistControls = bottomHud.querySelector(".bb-assist-controls");
          if (!assistControls) {
            assistControls = bbElement("div", "bb-assist-controls");
            bottomHud.appendChild(assistControls);
          }
          if (!$("bbTargetModeBtn")) {
            const targetButton = bbElement("button", "hud-toggle bb-target-mode");
            targetButton.id = "bbTargetModeBtn";
            targetButton.type = "button";
            targetButton.addEventListener("click", (event) => {
              if (event.shiftKey) bbCycleAimMode();
              else bbAutoSelectTarget(true);
            });
            assistControls.appendChild(targetButton);
          }
          if (!$("bbCombatModeBtn")) {
            const controlButton = bbElement("button", "hud-toggle bb-combat-control-mode");
            controlButton.id = "bbCombatModeBtn";
            controlButton.type = "button";
            controlButton.addEventListener("click", () => bbToggleCombatControlMode(true));
            assistControls.appendChild(controlButton);
          }
          if (!$("bbAutoFireHudBtn")) {
            const autoFireButton = bbElement("button", "hud-toggle bb-auto-fire-mode");
            autoFireButton.id = "bbAutoFireHudBtn";
            autoFireButton.type = "button";
            autoFireButton.addEventListener("click", () => bbToggleAutoFire(true));
            assistControls.appendChild(autoFireButton);
          }
        }
        bbRefreshCustomizationUi();
      }

/* ===== 92-customization-runtime.js ===== */
      // OPERATOR STUDIO // gameplay extension with fail-soft hooks.
      function bbAliveTargets() {
        return Array.isArray(enemies) ? enemies.filter((enemy) => enemy && enemy.alive) : [];
      }
      function bbDistanceToPlayer(enemy) {
        return enemy ? Math.hypot((enemy.x || 0) - player.x, (enemy.y || 0) - player.y) : Infinity;
      }
      const bbAutomaticControlEnabled = () =>
        typeof aimAssist !== "undefined" && !!aimAssist && !!bbCustomization?.autoFire;
      function bbAutomaticTarget(mode = bbCustomization.aimModeId) {
        const targets = bbAliveTargets();
        if (!targets.length) return null;
        const requestedMode = String(mode || bbCustomization.aimModeId || "smart");
        // Cursor/manual modes remain selectable in the studio, but once auto
        // fire is on they resolve to a world-space AI choice. This makes the
        // mouse purely cosmetic while the automatic controller is active.
        const effectiveMode = bbAutomaticControlEnabled()
          && (requestedMode === "cursor" || requestedMode === "manual")
          ? "smart"
          : requestedMode;
        // A deliberate lock is authoritative for the balanced/manual modes,
        // but explicit assist modes must be allowed to recalculate. Without
        // this boundary, switching from NEAREST to WEAKEST/BOSS could appear
        // to do nothing until the old lock died.
        if (hardLockTarget?.alive && (effectiveMode === "smart" || effectiveMode === "manual")) return hardLockTarget;
        const closest = () => targets.reduce((best, candidate) => bbDistanceToPlayer(candidate) < bbDistanceToPlayer(best) ? candidate : best, targets[0]);
        if (effectiveMode === "smart") return closest();
        if (effectiveMode === "manual") return null;
        if (effectiveMode === "nearest") return closest();
        if (effectiveMode === "weakest") {
          return targets.reduce((best, candidate) => {
            const candidateRatio = (candidate.hp || 0) / Math.max(1, candidate.maxHp || candidate.hp || 1);
            const bestRatio = (best.hp || 0) / Math.max(1, best.maxHp || best.hp || 1);
            return candidateRatio < bestRatio || (candidateRatio === bestRatio && bbDistanceToPlayer(candidate) < bbDistanceToPlayer(best)) ? candidate : best;
          }, targets[0]);
        }
        if (effectiveMode === "boss") {
          const priority = targets.filter((enemy) => enemy.boss || enemy.elite || enemy.legendary);
          return priority.length ? priority.reduce((best, candidate) => bbDistanceToPlayer(candidate) < bbDistanceToPlayer(best) ? candidate : best, priority[0]) : closest();
        }
        if (effectiveMode === "cursor" && pointer.id !== null && Number.isFinite(pointer.x) && Number.isFinite(pointer.y)) {
          const cursor = screenToWorld(pointer.x, pointer.y);
          return targets.reduce((best, candidate) => {
            const candidateDistance = Math.hypot((candidate.x || 0) - cursor.x, (candidate.y || 0) - cursor.y);
            const bestDistance = Math.hypot((best.x || 0) - cursor.x, (best.y || 0) - cursor.y);
            return candidateDistance < bestDistance ? candidate : best;
          }, targets[0]);
        }
        return null;
      }
      function bbResolveAutomaticTarget() {
        if (!bbAutomaticControlEnabled()) return null;
        let target = null;
        try {
          target = bbAutomaticTarget(bbCustomization.aimModeId);
          if (!target?.alive) target = bbAutomaticTarget("smart");
        } catch (_) {}
        if (target?.alive) {
          lockTarget = target;
          return target;
        }
        return null;
      }
      function bbTargetLabel(target) {
        if (!target) return bbTitle("SCANNING", "در حال اسکن");
        try {
          if (target.boss) return localizedBossField(target.bossKind || "lock", "name", target.bossName || translate("boss"));
          return localizedEnemyName(target, translate("threatLabel"));
        } catch (_) {
          return target.type || bbTitle("TARGET", "هدف");
        }
      }
      function bbAutoSelectTarget(announce = false) {
        let target = null;
        try {
          target = bbAutomaticTarget(bbCustomization.aimModeId === "manual" ? "smart" : bbCustomization.aimModeId)
            || bbCustomizationBaseNearestEnemy?.();
        } catch (_) {}
        if (!target?.alive) {
          if (announce) {
            try { toast(bbTitle("NO LIVE TARGET // SCANNING", "هدف فعالی نیست // در حال اسکن"), 950); } catch (_) {}
          }
          return null;
        }
        hardLockTarget = target;
        lockTarget = target;
        bbCustomizationTargetNonce += 1;
        try { bbRuntimeSafety.customTargetRefreshes = (bbRuntimeSafety.customTargetRefreshes || 0) + 1; } catch (_) {}
        bbCustomizationLastTargetId = `${target.type || "target"}:${Math.round(target.x || 0)}:${Math.round(target.y || 0)}:${bbCustomizationTargetNonce}`;
        const lockButton = $("lockStatus");
        if (lockButton) {
          lockButton.textContent = `${bbTitle("LOCK-ON", "قفل")} // ${bbTargetLabel(target)}`;
          lockButton.style.borderColor = bbPaletteFor().primary;
        }
        if (announce) {
          try {
            toast(`${bbTitle("AI TARGET", "هدف هوشمند")} // ${bbTargetLabel(target)}`, 1200);
            buttonTone(760, .07, "triangle", .024);
          } catch (_) {}
        }
        return target;
      }
      function bbCycleAimMode() {
        const index = BB_AIM_MODE_CATALOG.findIndex((item) => item.id === bbCustomization.aimModeId);
        const next = BB_AIM_MODE_CATALOG[(Math.max(0, index) + 1) % BB_AIM_MODE_CATALOG.length];
        bbCommitCustomization({ aimModeId: next.id }, false);
        try { toast(`${bbTitle("TARGET MODE", "حالت هدف")} // ${bbCustomizationLabel(next)}`, 1200); } catch (_) {}
        if (next.id !== "manual") bbAutoSelectTarget(false);
      }
      const bbCustomizationBaseNearestEnemy = nearestEnemy;
      nearestEnemy = function bbCustomizedNearestEnemy() {
        try {
          if (bbAutomaticControlEnabled()) {
            const automaticTarget = bbResolveAutomaticTarget();
            if (automaticTarget?.alive) {
              lockTarget = automaticTarget;
              return automaticTarget;
            }
          }
          const mode = bbCustomization.aimModeId;
          if (mode === "smart") return bbCustomizationBaseNearestEnemy();
          const target = bbAutomaticTarget(mode);
          if (target?.alive) {
            lockTarget = target;
            return target;
          }
          if (mode === "manual") {
            lockTarget = hardLockTarget?.alive ? hardLockTarget : null;
            return lockTarget;
          }
        } catch (_) {}
        return bbCustomizationBaseNearestEnemy();
      };
      const bbCloneShot = (bullet, angleOffset = 0, damageScale = 1, extras = {}) => {
        if (!bullet || bullets.length >= MAX_PLAYER_BULLETS) return null;
        const speed = Math.max(1, Number(bullet.speed) || Math.hypot(Number(bullet.vx) || 0, Number(bullet.vy) || 0));
        const angle = (Number(bullet.angle) || Math.atan2(Number(bullet.vy) || 0, Number(bullet.vx) || 1)) + angleOffset;
        const clone = {
          ...bullet,
          x: Number(bullet.x) || player.x,
          y: Number(bullet.y) || player.y,
          angle,
          speed,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          damage: Math.max(.25, (Number(bullet.damage) || 1) * damageScale),
          life: Math.max(.12, Number(bullet.life) || .5),
          traveled: 0,
          hit: [],
          bbCustomizationShot: true,
          ...extras
        };
        bullets.push(clone);
        return clone;
      };
      const bbStyleNewShots = (freshShots) => {
        const mode = bbCustomization.shotModeId;
        if (mode === "native" || !freshShots.length) return;
        const weapon = weaponProfile(player.weapon);
        const weaponLevel = Math.max(0, Math.floor(Number(weapon?.level) || 0));
        // Every loadout starts as a true single-shot weapon. Cosmetic firing
        // styles that clone bullets unlock only after the first upgrade.
        if (weaponLevel <= 1 && ["twin", "fan", "orbit", "burst"].includes(mode)) return;
        for (let index = 0; index < freshShots.length; index += 1) {
          const shot = freshShots[index];
          if (!shot || shot.bbCustomizationShot) continue;
          shot.bbCustomizationShot = true;
          if (mode === "twin") {
            shot.damage *= .86;
            bbCloneShot(shot, index % 2 ? -.12 : .12, 1);
          } else if (mode === "fan") {
            shot.damage *= .68;
            bbCloneShot(shot, -.18, .62);
            bbCloneShot(shot, .18, .62);
          } else if (mode === "pierce") {
            shot.damage *= .88;
            shot.pierce = Math.min(14, (Number(shot.pierce) || 0) + 2);
            shot.size = Math.min(18, (Number(shot.size) || 5) + 1);
          } else if (mode === "orbit") {
            shot.damage *= .78;
            shot.bbCustomizationOrbit = index % 2 ? -.62 : .62;
            bbCloneShot(shot, index % 2 ? .09 : -.09, .72, { bbCustomizationOrbit: index % 2 ? .62 : -.62 });
          } else if (mode === "burst") {
            shot.damage *= .76;
            bbCloneShot(shot, index % 2 ? -.045 : .045, .58, {
              speed: Math.max(1, (Number(shot.speed) || 1) * .72),
              vx: (Number(shot.vx) || 0) * .72,
              vy: (Number(shot.vy) || 0) * .72,
              life: Math.max(.14, (Number(shot.life) || .5) * 1.18),
              size: Math.min(18, (Number(shot.size) || 5) + 2)
            });
          }
        }
        while (bullets.length > MAX_PLAYER_BULLETS) bullets.shift();
      };
      const bbCustomizationBaseFire = fire;
      fire = function bbCustomizedFire() {
        let result = null;
        let fresh = [];
        try {
          const before = new Set(bullets);
          result = bbCustomizationBaseFire.apply(this, arguments);
          fresh = bullets.filter((bullet) => !before.has(bullet));
        } catch (error) {
          // The base engine owns cadence and resource safety. If it throws,
          // fail soft for this frame instead of invoking it twice and
          // potentially duplicating a shot.
          try { console.warn("[BUY BUTTON] base shot skipped", error); } catch (_) {}
          return null;
        }
        if (fresh.length) {
          // Keep a small observable counter for diagnostics and smoke tests.
          // It counts native shots only; cosmetic fan/twin clones are still
          // governed by the normal MAX_PLAYER_BULLETS budget.
          try {
            bbRuntimeSafety.customShots = Math.min(
              1000000,
              (Number(bbRuntimeSafety.customShots) || 0) + fresh.length
            );
          } catch (_) {}
        }
        try { bbStyleNewShots(fresh); } catch (error) {
          // A cosmetic firing style is optional; the native shot remains
          // valid even if a future style extension contains a bad value.
          try { console.warn("[BUY BUTTON] custom shot style ignored", error); } catch (_) {}
        }
        return result;
      };
      const bbCustomizationBaseUpdate = update;
      update = function bbCustomizedUpdate(dt) {
        bbCustomizationBaseUpdate(dt);
        try {
          if (state !== "playing") return;
          // v4 intentionally starts with manual fire. This layer provides
          // the opt-in automatic trigger while reusing native cooldown,
          // target selection and mouse/gamepad aim behavior.
          if (bbCustomization.autoFire && !orientationHold) {
            try {
              bbRuntimeSafety.autoFireTicks = Math.min(
                1000000,
                (Number(bbRuntimeSafety.autoFireTicks) || 0) + 1
              );
            } catch (_) {}
            fire();
          }
          const step = Math.max(0, Math.min(.05, Number(dt) || 0));
          bbCustomizationTrailClock += step;
          if (bbCustomizationTrailClock >= .042) {
            bbCustomizationTrailClock = 0;
            bbCustomizationTrail.push({ x: player.x, y: player.y, life: 1, max: 1, size: 3 + bbCustomization.auraStrength * .035 });
          }
          const maxTrail = gameSettings.performance ? 10 : 24;
          while (bbCustomizationTrail.length > maxTrail) bbCustomizationTrail.shift();
          for (let index = bbCustomizationTrail.length - 1; index >= 0; index -= 1) {
            const point = bbCustomizationTrail[index];
            point.life -= step * (bbCustomization.trailId === "ghost" ? 1.8 : 2.8);
            if (!Number.isFinite(point.life) || point.life <= 0) bbCustomizationTrail.splice(index, 1);
          }
          if (bbCustomization.shotModeId === "orbit") {
            for (const bullet of bullets) {
              if (!bullet?.bbCustomizationOrbit || !Number.isFinite(bullet.speed)) continue;
              const spin = bullet.bbCustomizationOrbit * step;
              const angle = Math.atan2(bullet.vy, bullet.vx) + spin;
              bullet.angle = angle;
              bullet.vx = Math.cos(angle) * bullet.speed;
              bullet.vy = Math.sin(angle) * bullet.speed;
            }
          }
        } catch (error) {
          try { console.warn("[BUY BUTTON] custom update ignored", error); } catch (_) {}
        }
      };
      const bbPolygon = (sides, radius, rotation = 0) => {
        ctx.beginPath();
        for (let index = 0; index < sides; index += 1) {
          const angle = rotation + index / sides * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      };
      const bbDrawOperatorGlyph = (time) => {
        const operator = bbOperatorFor();
        const palette = bbPaletteFor();
        const intensity = bbCustomization.auraStrength / 100;
        const scale = coreVisualScale();
        const radius = 43 + Math.sin(time * 4) * 2;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(scale, scale);
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = .36 + intensity * .46;
        ctx.strokeStyle = palette.primary;
        ctx.fillStyle = palette.primary;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = gameSettings.performance ? 0 : 14 + intensity * 26;
        ctx.lineWidth = 1.8 + intensity * 1.8;
        ctx.rotate(time * .15);
        if (operator.shape === "ring") {
          ctx.setLineDash([7, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        } else if (operator.shape === "diamond") {
          bbPolygon(4, radius, Math.PI / 4);
          ctx.stroke();
        } else if (operator.shape === "hex") {
          bbPolygon(6, radius, Math.PI / 6);
          ctx.stroke();
        } else if (operator.shape === "square") {
          ctx.strokeRect(-radius * .72, -radius * .72, radius * 1.44, radius * 1.44);
        } else if (operator.shape === "triangle") {
          bbPolygon(3, radius, -Math.PI / 2);
          ctx.stroke();
        } else {
          bbPolygon(5, radius, -Math.PI / 2);
          ctx.stroke();
          ctx.rotate(Math.PI / 5);
          bbPolygon(5, radius * .62, -Math.PI / 2);
          ctx.stroke();
        }
        ctx.globalAlpha = .25 + intensity * .22;
        ctx.font = "900 12px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(operator.glyph, 0, 0);
        ctx.restore();
      };
      const bbDrawCustomizationTrail = () => {
        if (!bbCustomizationTrail.length || state !== "playing") return;
        const palette = bbPaletteFor();
        const trail = bbTrailFor();
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        for (const point of bbCustomizationTrail) {
          const screen = worldToScreen(point.x, point.y);
          if (screen.x < -50 || screen.x > W + 50 || screen.y < -50 || screen.y > H + 50) continue;
          const alpha = Math.max(0, point.life) * (.12 + bbCustomization.auraStrength / 260);
          const radius = Math.max(1, point.size * point.life * coreVisualScale());
          ctx.globalAlpha = alpha;
          ctx.fillStyle = palette.primary;
          ctx.strokeStyle = palette.bright;
          ctx.shadowColor = palette.primary;
          ctx.shadowBlur = gameSettings.performance ? 0 : 10;
          if (trail.id === "arc") {
            ctx.beginPath();
            ctx.arc(screen.x, screen.y, radius * 1.4, 0, Math.PI * 2);
            ctx.stroke();
          } else if (trail.id === "shield") {
            ctx.beginPath();
            ctx.arc(screen.x, screen.y, radius * 2, 0, Math.PI * 2);
            ctx.stroke();
          } else if (trail.id === "grid") {
            ctx.strokeRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);
          } else if (trail.id === "ember") {
            ctx.fillRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);
          } else if (trail.id === "ghost") {
            ctx.beginPath();
            ctx.arc(screen.x, screen.y, radius * 2.1, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(screen.x, screen.y, trail.id === "comet" ? radius * 1.9 : radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      };
      const bbDrawCrosshair = (time) => {
        if (bbCustomization.crosshairId === "off" || state !== "playing") return;
        let point = null;
        if (bbAutomaticControlEnabled()) {
          const automaticTarget = bbResolveAutomaticTarget();
          if (automaticTarget?.alive) point = worldToScreen(automaticTarget.x, automaticTarget.y);
        } else if (pointer.id !== null && Number.isFinite(pointer.x) && Number.isFinite(pointer.y)) {
          point = { x: pointer.x, y: pointer.y };
        }
        else if (lockTarget?.alive) point = worldToScreen(lockTarget.x, lockTarget.y);
        if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
        const palette = bbPaletteFor();
        const size = 12 + Math.sin(time * 5) * 1.5;
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = .76;
        ctx.strokeStyle = palette.bright;
        ctx.fillStyle = palette.primary;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = gameSettings.performance ? 0 : 13;
        if (bbCustomization.aimLine) {
          ctx.globalAlpha = .14;
          ctx.beginPath();
          ctx.moveTo(W / 2, H / 2);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
          ctx.globalAlpha = .82;
        }
        if (bbCustomization.crosshairId === "dot") {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (bbCustomization.crosshairId === "ring") {
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (bbCustomization.crosshairId === "diamond") {
          ctx.translate(point.x, point.y);
          bbPolygon(4, size, Math.PI / 4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(point.x - size, point.y - size); ctx.lineTo(point.x - size * .45, point.y - size);
          ctx.moveTo(point.x + size, point.y - size); ctx.lineTo(point.x + size * .45, point.y - size);
          ctx.moveTo(point.x - size, point.y + size); ctx.lineTo(point.x - size * .45, point.y + size);
          ctx.moveTo(point.x + size, point.y + size); ctx.lineTo(point.x + size * .45, point.y + size);
          ctx.stroke();
        }
        ctx.restore();
      };
      const bbCustomizationBaseDraw = draw;
      draw = function bbCustomizedDraw(time) {
        bbCustomizationBaseDraw(time);
        try {
          const safeTime = Number.isFinite(Number(time)) ? Number(time) : nowMs() / 1000;
          bbDrawCustomizationTrail();
          if (state === "playing" || state === "briefing") bbDrawOperatorGlyph(safeTime);
          bbDrawCrosshair(safeTime);
        } catch (error) {
          try { console.warn("[BUY BUTTON] custom draw ignored", error); } catch (_) {}
        }
      };
      $("autoFireBtn")?.addEventListener("click", () => {
        window.setTimeout(() => {
          if (bbCustomization.autoFire !== aimAssist) bbCommitCustomization({ autoFire: !!aimAssist }, false);
        }, 0);
      });
      const bbCustomizationBaseApplyLocale = applyLocale;
      applyLocale = function bbCustomizedApplyLocale() {
        const result = bbCustomizationBaseApplyLocale.apply(this, arguments);
        try {
          // The studio is generated DOM, so rebuild it when the locale
          // changes to translate section headings and helper copy too.
          const wasOpen = !!bbCustomizationPanel
            && !bbCustomizationPanel.classList.contains("hidden");
          if (bbCustomizationPanel) {
            bbCustomizationPanel.remove();
            bbCustomizationPanel = null;
          }
          if (wasOpen) bbOpenCustomizationPanel();
          else bbRefreshCustomizationUi?.();
        } catch (_) {}
        return result;
      };
      const bbCustomizationBaseResetRun = resetRun;
      resetRun = function bbCustomizedResetRun() {
        const result = bbCustomizationBaseResetRun.apply(this, arguments);
        try { bbSyncCustomizationToEngine(); bbRefreshCustomizationUi?.(); } catch (_) {}
        return result;
      };
      const bbCustomizationBaseResumeSavedRun = resumeSavedRunHook;
      resumeSavedRunHook = function bbCustomizedResumeSavedRun() {
        const result = bbCustomizationBaseResumeSavedRun?.apply(this, arguments);
        if (result) {
          try { bbSyncCustomizationToEngine(); bbRefreshCustomizationUi?.(); } catch (_) {}
        }
        return result;
      };
      const bbToggleCombatControlMode = (announce = true) => {
        const enableAuto = !bbCustomization.autoFire;
        const patch = enableAuto
          ? {
              autoFire: true,
              aimModeId: bbCustomization.aimModeId === "manual" ? "smart" : bbCustomization.aimModeId
            }
          : {
              autoFire: false,
              aimModeId: "manual"
            };
        bbCommitCustomization(patch, false);
        if (enableAuto) {
          // Drop any pointer-created lock before selecting the first AI target.
          hardLockTarget = null;
          lockTarget = null;
          bbAutoSelectTarget(false);
        }
        if (announce) {
          try {
            toast(enableAuto
              ? bbTitle("CONTROL // AUTO TARGET + AUTO FIRE", "کنترل // هدف‌گیری و شلیک خودکار")
              : bbTitle("CONTROL // MANUAL MOUSE AIM", "کنترل // نشانه‌گیری دستی با ماوس"), 1400);
          } catch (_) {}
        }
      };
      const bbToggleAutoFire = (announce = true) => {
        const enableAuto = !bbCustomization.autoFire;
        const patch = { autoFire: enableAuto };
        // The F shortcut must remain useful even after the player previously
        // chose manual control. Turn on a smart target at the same time so
        // auto-fire cannot silently have nothing to shoot at.
        if (enableAuto && bbCustomization.aimModeId === "manual") patch.aimModeId = "smart";
        bbCommitCustomization(patch, false);
        if (enableAuto) {
          hardLockTarget = null;
          lockTarget = null;
          bbAutoSelectTarget(false);
        }
        if (announce) {
          try {
            toast(enableAuto
              ? bbTitle("FIRE // AUTO", "شلیک // خودکار")
              : bbTitle("FIRE // MANUAL", "شلیک // دستی"), 1100);
          } catch (_) {}
        }
      };
      window.addEventListener("keydown", (event) => {
        const code = getKeyCode(event);
        const focused = document.activeElement;
        const editing = focused instanceof HTMLInputElement || focused instanceof HTMLTextAreaElement || focused instanceof HTMLSelectElement;
        if (code === "Escape" && bbCustomizationPanel && !bbCustomizationPanel.classList.contains("hidden")) {
          event.preventDefault();
          bbCloseCustomizationPanel();
          return;
        }
        if (editing) return;
        if (code === "KeyC" && (state === "menu" || state === "pause")) {
          event.preventDefault();
          bbOpenCustomizationPanel();
        }
        if (code === "KeyG" && state === "playing") {
          event.preventDefault();
          bbAutoSelectTarget(true);
        }
        if (code === "KeyM" && !event.repeat) {
          event.preventDefault();
          bbToggleCombatControlMode(true);
        }
        if (code === "KeyF" && !event.repeat) {
          event.preventDefault();
          bbToggleAutoFire(true);
        }
      });
      bbMountCustomizationControls();
      bbRefreshCustomizationUi();

/* ===== 93-telegram-mini-app.js ===== */
      // TELEGRAM MINI APP // secure account bridge
      //
      // The game remains fully playable as a standalone guest build. When it
      // is launched from Telegram, this layer authenticates with the server
      // using the raw initData supplied by Telegram, hydrates cloud state,
      // renders the verified profile, and mirrors local-first state changes.
      // No bot token or raw initData is ever exposed after the auth request.
      const bbTelegramCandidate = window.Telegram?.WebApp || null;
      const bbTelegramContext = !!(
        bbTelegramCandidate
        && (
          String(bbTelegramCandidate.initData || "").trim()
          || bbTelegramCandidate.initDataUnsafe?.user
          || window.TelegramWebviewProxy
          || /Telegram/i.test(String(window.navigator?.userAgent || ""))
        )
      );
      const bbTelegramWebApp = bbTelegramContext ? bbTelegramCandidate : null;
      const bbTelegramApiBase = (() => {
        const configured = String(window.BUY_BUTTON_API_BASE || "").trim().replace(/\/+$/, "");
        if (!configured) return "";
        try {
          const url = new URL(configured, window.location.href);
          if (url.origin !== window.location.origin) return "";
          const pathname = url.pathname.replace(/\/+$/, "");
          return pathname === "/api" ? "" : pathname;
        } catch (_) {
          return "";
        }
      })();
      const bbTelegramState = {
        available: !!bbTelegramWebApp,
        authenticated: false,
        status: bbTelegramWebApp ? "connecting" : "guest",
        player: null,
        lastError: "",
        lastSyncAt: 0
      };
      let bbTelegramHydrated = false;
      let bbTelegramHydrating = false;
      let bbTelegramAuthInFlight = null;
      let bbTelegramAuthAttempts = 0;
      let bbTelegramCloudQueue = new Map();
      let bbTelegramCloudFlushTimer = 0;
      let bbTelegramCloudRetryTimer = 0;
      let bbTelegramCloudFlushInFlight = false;
      let bbTelegramCloudRetryCount = 0;
      let bbTelegramProfileCard = null;
      let bbTelegramProfileAvatar = null;
      let bbTelegramProfileName = null;
      let bbTelegramProfileHandle = null;
      let bbTelegramProfileStatus = null;

      const bbTelegramApiUrl = (path) => `${bbTelegramApiBase}${String(path || "").startsWith("/") ? path : `/${path}`}`;
      const bbTelegramClone = (value, fallback = null) => {
        try { return JSON.parse(JSON.stringify(value)); } catch (_) { return fallback; }
      };
      const bbTelegramInitials = (player) => {
        const parts = [player?.firstName, player?.lastName].filter(Boolean).join(" ").trim().split(/\s+/).filter(Boolean);
        return (parts.slice(0, 2).map((part) => part[0]).join("") || "BB").toUpperCase();
      };
      const bbTelegramText = (english, persian) => currentLocale === "fa" ? persian : english;
      const bbTelegramSetStatus = (status, error = "") => {
        bbTelegramState.status = String(status || "");
        bbTelegramState.lastError = String(error || "");
        if (bbTelegramProfileStatus) {
          const labels = {
            connecting: bbTelegramText("TELEGRAM // CONNECTING", "تلگرام // در حال اتصال"),
            online: bbTelegramText("TELEGRAM // ONLINE", "تلگرام // متصل"),
            syncing: bbTelegramText("TELEGRAM // SYNCING", "تلگرام // همگام‌سازی"),
            synced: bbTelegramText("TELEGRAM // CLOUD SYNCED", "تلگرام // ذخیرهٔ ابری"),
            guest: bbTelegramText("GUEST MODE // LOCAL SAVE", "حالت مهمان // ذخیرهٔ محلی"),
            offline: bbTelegramText("TELEGRAM // OFFLINE RETRY", "تلگرام // تلاش دوباره"),
            unconfigured: bbTelegramText("TELEGRAM // SERVER SETUP REQUIRED", "تلگرام // تنظیم سرور لازم است"),
            expired: bbTelegramText("TELEGRAM // REOPEN APP", "تلگرام // برنامه را دوباره باز کن")
          };
          bbTelegramProfileStatus.textContent = labels[bbTelegramState.status] || bbTelegramState.status;
          bbTelegramProfileStatus.dataset.state = bbTelegramState.status;
        }
      };

      function bbEnsureTelegramProfileCard() {
        if (!bbTelegramWebApp || bbTelegramProfileCard) return;
        const copy = document.querySelector("#menu .menu-copy");
        const start = $("startBtn");
        if (!copy || !start) return;
        const card = document.createElement("div");
        card.id = "bbTelegramProfile";
        card.className = "bb-telegram-profile";
        card.setAttribute("aria-live", "polite");
        const avatar = document.createElement("div");
        avatar.className = "bb-telegram-avatar";
        avatar.setAttribute("aria-hidden", "true");
        const image = document.createElement("img");
        image.alt = "";
        image.decoding = "async";
        image.loading = "eager";
        image.referrerPolicy = "no-referrer";
        avatar.appendChild(image);
        const content = document.createElement("div");
        content.className = "bb-telegram-profile-copy";
        const eyebrow = document.createElement("span");
        eyebrow.className = "bb-telegram-profile-eyebrow";
        eyebrow.textContent = bbTelegramText("TELEGRAM PLAYER ID", "شناسهٔ بازیکن تلگرام");
        const name = document.createElement("b");
        name.className = "bb-telegram-profile-name";
        name.textContent = bbTelegramText("CONNECTING…", "در حال اتصال…");
        const handle = document.createElement("small");
        handle.className = "bb-telegram-profile-handle";
        handle.textContent = "";
        const status = document.createElement("span");
        status.className = "bb-telegram-profile-status";
        content.append(eyebrow, name, handle, status);
        card.append(avatar, content);
        copy.insertBefore(card, start);
        bbTelegramProfileCard = card;
        bbTelegramProfileAvatar = image;
        bbTelegramProfileName = name;
        bbTelegramProfileHandle = handle;
        bbTelegramProfileStatus = status;
      }

      function bbRenderTelegramProfile() {
        if (!bbTelegramWebApp) return;
        bbEnsureTelegramProfileCard();
        const player = bbTelegramState.player;
        if (bbTelegramProfileCard) bbTelegramProfileCard.classList.toggle("is-online", !!player);
        if (bbTelegramProfileName) {
          bbTelegramProfileName.textContent = player?.publicAlias
            || [player?.firstName, player?.lastName].filter(Boolean).join(" ")
            || bbTelegramText("Telegram Operator", "اپراتور تلگرام");
        }
        if (bbTelegramProfileHandle) {
          bbTelegramProfileHandle.textContent = player?.username ? `@${player.username}` : bbTelegramText("Telegram account", "حساب تلگرام");
        }
        if (bbTelegramProfileAvatar) {
          bbTelegramProfileAvatar.alt = player?.publicAlias || "";
          bbTelegramProfileAvatar.src = player?.photoUrl || "";
          if (bbTelegramProfileAvatar.parentElement) bbTelegramProfileAvatar.parentElement.dataset.initials = bbTelegramInitials(player || {});
          bbTelegramProfileAvatar.classList.toggle("has-photo", !!player?.photoUrl);
          bbTelegramProfileAvatar.onerror = () => {
            bbTelegramProfileAvatar.removeAttribute("src");
            bbTelegramProfileAvatar.classList.remove("has-photo");
          };
        }
        bbTelegramSetStatus(bbTelegramState.status);
      }

      function bbTelegramApplyShell() {
        if (!bbTelegramWebApp) return;
        try { bbTelegramWebApp.ready?.(); } catch (_) {}
        try { bbTelegramWebApp.expand?.(); } catch (_) {}
        try {
          const palette = typeof bbPaletteFor === "function" ? bbPaletteFor() : null;
          if (palette?.primary) bbTelegramWebApp.setHeaderColor?.(palette.primary);
          bbTelegramWebApp.setBackgroundColor?.("#050607");
        } catch (_) {}
        document.documentElement.dataset.telegramMiniApp = "true";
        document.body.classList.add("bb-telegram-mini-app");
      }

      async function bbTelegramFetch(path, options = {}) {
        if (typeof window.fetch !== "function") throw new Error("fetch-unavailable");
        const controller = typeof window.AbortController === "function" ? new AbortController() : null;
        const timeout = window.setTimeout(() => controller?.abort(), 9000);
        try {
          const response = await window.fetch(bbTelegramApiUrl(path), {
            credentials: "same-origin",
            cache: "no-store",
            headers: { Accept: "application/json", ...(options.headers || {}) },
            ...options,
            signal: controller?.signal
          });
          let payload = null;
          try { payload = await response.json(); } catch (_) {}
          if (!response.ok) {
            const error = new Error(payload?.error?.message || `http-${response.status}`);
            error.status = response.status;
            error.payload = payload;
            throw error;
          }
          return payload || {};
        } finally {
          window.clearTimeout(timeout);
        }
      }

      const bbTelegramLocalCheckpoint = () => {
        const candidates = [];
        try {
          for (const raw of runSaveStorageRead(RUN_SAVE_KEY)) {
            const parsed = runSaveParse(raw);
            if (parsed) candidates.push({ raw, savedAt: Number(parsed.savedAt) || 0 });
          }
          for (const raw of runSaveStorageRead(RUN_SAVE_BACKUP_KEY)) {
            const parsed = runSaveParse(raw);
            if (parsed) candidates.push({ raw, savedAt: Number(parsed.savedAt) || 0 });
          }
        } catch (_) {}
        candidates.sort((left, right) => right.savedAt - left.savedAt);
        return candidates[0] || { raw: null, savedAt: 0 };
      };

      const bbTelegramCloudStamp = (kind, value, fallback = 0) => {
        if (kind === "checkpoint") {
          try {
            const parsed = typeof value === "string" ? JSON.parse(value) : null;
            const payload = parsed?.body ? JSON.parse(parsed.body) : null;
            return Math.max(0, Number(payload?.savedAt) || fallback || 0);
          } catch (_) {
            return Math.max(0, Number(fallback) || 0);
          }
        }
        return Math.max(0, Number(value?.updatedAt) || Number(fallback) || 0);
      };

      function bbTelegramQueueChange(kind, value, updatedAt, extra = {}) {
        if (!bbTelegramState.authenticated || !bbTelegramHydrated || bbTelegramHydrating) return;
        const safeKind = String(kind || "");
        if (!["settings", "customization", "archive", "checkpoint"].includes(safeKind)) return;
        const stamp = bbTelegramCloudStamp(safeKind, value, updatedAt);
        const previous = bbTelegramCloudQueue.get(safeKind);
        if (previous && Number(previous.updatedAt) > stamp) return;
        bbTelegramCloudQueue.set(safeKind, {
          value: safeKind === "checkpoint" ? (typeof value === "string" ? value : null) : bbTelegramClone(value, {}),
          updatedAt: stamp,
          cleared: !!extra.cleared
        });
        bbTelegramSetStatus("syncing");
        window.clearTimeout(bbTelegramCloudFlushTimer);
        bbTelegramCloudFlushTimer = window.setTimeout(() => { void bbTelegramFlushCloud(); }, 700);
      }

      function bbTelegramApplyRemoteState(remoteState) {
        const cloud = remoteState && typeof remoteState === "object" ? remoteState : {};
        const remoteUpdated = cloud.updatedAt || {};
        const localCheckpoint = bbTelegramLocalCheckpoint();
        const local = {
          settings: { value: gameSettings, stamp: settingsHadLocalRecord ? Number(gameSettings.updatedAt) || 0 : 0 },
          customization: { value: bbCustomization, stamp: bbCustomizationHadLocalRecord ? Number(bbCustomization.updatedAt) || 0 : 0 },
          archive: { value: archive, stamp: Number(archive?.updatedAt) || 0 },
          checkpoint: { value: localCheckpoint.raw, stamp: localCheckpoint.savedAt }
        };
        const remote = {
          settings: { value: cloud.settings, stamp: Number(remoteUpdated.settings) || 0 },
          customization: { value: cloud.customization, stamp: Number(remoteUpdated.customization) || 0 },
          archive: { value: cloud.archive, stamp: Number(remoteUpdated.archive) || 0 },
          checkpoint: { value: cloud.checkpoint, stamp: Number(remoteUpdated.checkpoint) || 0 }
        };

        bbTelegramHydrating = true;
        try {
          for (const kind of ["settings", "customization", "archive", "checkpoint"]) {
            const localRow = local[kind];
            const remoteRow = remote[kind];
            const remoteMeaningful = kind === "checkpoint"
              ? typeof remoteRow.value === "string" && remoteRow.value.length > 0
              : remoteRow.value && typeof remoteRow.value === "object" && Object.keys(remoteRow.value).length > 0;
            if (remoteMeaningful && remoteRow.stamp > localRow.stamp) {
              if (kind === "settings") {
                normalizeSettings(remoteRow.value);
                applySettings();
                applyLocale();
                saveSettings();
              } else if (kind === "customization") {
                bbCustomization = bbSanitizeCustomization(remoteRow.value);
                bbPersistCustomization();
                bbApplyCustomizationTheme();
                bbSyncCustomizationToEngine();
                bbRefreshCustomizationUi?.();
              } else if (kind === "archive") {
                archive = { ...defaultArchive, ...bbTelegramClone(remoteRow.value, {}) };
                refreshArchiveUi();
                saveArchive();
              } else if (kind === "checkpoint") {
                const parsed = runSaveParse(remoteRow.value);
                if (parsed) {
                  runSaveWrite(remoteRow.value);
                  runSaveCached = parsed;
                  renderRunSaveUi();
                }
                }
            } else if (kind === "checkpoint" && remoteRow.value === null && remoteRow.stamp > localRow.stamp && remoteRow.stamp > 0) {
              clearRunSave();
            } else if (localRow.stamp > 0 && localRow.stamp > remoteRow.stamp) {
              bbTelegramCloudQueue.set(kind, {
                value: kind === "checkpoint" ? localRow.value : bbTelegramClone(localRow.value, {}),
                updatedAt: localRow.stamp,
                cleared: kind === "checkpoint" && !localRow.value
              });
            } else if (remoteRow.stamp === 0 && localRow.stamp > 0) {
              bbTelegramCloudQueue.set(kind, {
                value: kind === "checkpoint" ? localRow.value : bbTelegramClone(localRow.value, {}),
                updatedAt: localRow.stamp,
                cleared: kind === "checkpoint" && !localRow.value
              });
            }
          }
        } catch (error) {
          try { console.warn("[BUY BUTTON] Telegram cloud hydration skipped", error); } catch (_) {}
        } finally {
          bbTelegramHydrating = false;
        }
        bbTelegramHydrated = true;
        if (bbTelegramCloudQueue.size) {
          bbTelegramSetStatus("syncing");
          window.clearTimeout(bbTelegramCloudFlushTimer);
          bbTelegramCloudFlushTimer = window.setTimeout(() => { void bbTelegramFlushCloud(); }, 120);
        } else {
          bbTelegramState.lastSyncAt = Date.now();
          bbTelegramSetStatus("synced");
        }
      }

      async function bbTelegramFlushCloud(options = {}) {
        if (
          !bbTelegramState.authenticated
          || !bbTelegramHydrated
          || bbTelegramCloudFlushInFlight
          || !bbTelegramCloudQueue.size
        ) return false;
        window.clearTimeout(bbTelegramCloudRetryTimer);
        bbTelegramCloudFlushInFlight = true;
        const batch = new Map(bbTelegramCloudQueue);
        const body = {};
        for (const [kind, item] of batch) {
          if (kind === "checkpoint") {
            body.checkpoint = item.value;
            body.checkpointUpdatedAt = item.updatedAt;
          } else {
            body[kind] = item.value;
          }
        }
        try {
          bbTelegramSetStatus("syncing");
          await bbTelegramFetch("/api/state", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            keepalive: !!options.keepalive
          });
          for (const [kind, item] of batch) {
            const current = bbTelegramCloudQueue.get(kind);
            if (current && Number(current.updatedAt) <= Number(item.updatedAt)) bbTelegramCloudQueue.delete(kind);
          }
          bbTelegramCloudRetryCount = 0;
          bbTelegramState.lastSyncAt = Date.now();
          bbTelegramSetStatus(bbTelegramCloudQueue.size ? "syncing" : "synced");
          if (bbTelegramCloudQueue.size) {
            window.clearTimeout(bbTelegramCloudFlushTimer);
            bbTelegramCloudFlushTimer = window.setTimeout(() => { void bbTelegramFlushCloud(); }, 180);
          }
          return true;
        } catch (error) {
          if (Number(error?.status) === 401) {
            bbTelegramState.authenticated = false;
            bbTelegramHydrated = false;
            bbTelegramSetStatus("expired", error?.message);
          } else {
            bbTelegramCloudRetryCount = Math.min(6, bbTelegramCloudRetryCount + 1);
            bbTelegramSetStatus("offline", error?.message);
            const delay = Math.min(30000, 1200 * (2 ** Math.max(0, bbTelegramCloudRetryCount - 1)));
            window.clearTimeout(bbTelegramCloudRetryTimer);
            bbTelegramCloudRetryTimer = window.setTimeout(() => { void bbTelegramFlushCloud(); }, delay);
          }
          return false;
        } finally {
          bbTelegramCloudFlushInFlight = false;
        }
      }

      async function bbAuthenticateTelegram() {
        if (!bbTelegramWebApp || bbTelegramAuthInFlight) return bbTelegramAuthInFlight;
        bbTelegramAuthInFlight = (async () => {
          let initData = "";
          for (let attempt = 0; attempt < 4; attempt += 1) {
            initData = String(bbTelegramWebApp.initData || "").trim();
            if (initData) break;
            await new Promise((resolve) => window.setTimeout(resolve, 180 * (attempt + 1)));
          }
          if (!initData) {
            bbTelegramSetStatus("guest", "telegram-init-data-empty");
            bbRenderTelegramProfile();
            return false;
          }
          bbTelegramAuthAttempts += 1;
          bbTelegramSetStatus("connecting");
          bbRenderTelegramProfile();
          try {
            const payload = await bbTelegramFetch("/api/auth/telegram", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ initData })
            });
            if (!payload?.player) throw new Error("telegram-player-missing");
            bbTelegramState.player = payload.player;
            bbTelegramState.authenticated = true;
            bbTelegramState.lastError = "";
            bbRenderTelegramProfile();
            bbTelegramApplyShell();
            bbTelegramApplyRemoteState(payload.state || {});
            try {
              window.__BUY_BUTTON_ACCOUNT__ = {
                provider: "telegram-mini-app",
                authenticated: true,
                player: bbTelegramClone(payload.player, null),
                getState: () => ({
                  authenticated: bbTelegramState.authenticated,
                  player: bbTelegramClone(bbTelegramState.player, null),
                  lastSyncAt: bbTelegramState.lastSyncAt
                }),
                sync: () => bbTelegramFlushCloud()
              };
              window.dispatchEvent(new CustomEvent("bb:telegram-account", {
                detail: { player: bbTelegramClone(payload.player, null) }
              }));
            } catch (_) {}
            return true;
          } catch (error) {
            bbTelegramState.authenticated = false;
            bbTelegramHydrated = false;
            const status = Number(error?.status) === 401
              ? "expired"
              : Number(error?.status) === 503
                ? "unconfigured"
                : "offline";
            bbTelegramSetStatus(status, error?.message);
            bbRenderTelegramProfile();
            try { console.warn("[BUY BUTTON] Telegram auth unavailable", error?.message || error); } catch (_) {}
            return false;
          } finally {
            bbTelegramAuthInFlight = null;
          }
        })();
        return bbTelegramAuthInFlight;
      }

      function bbTelegramBindEvents() {
        if (!bbTelegramWebApp) return;
        try {
          bbTelegramWebApp.onEvent?.("themeChanged", bbTelegramApplyShell);
          bbTelegramWebApp.onEvent?.("viewportChanged", () => {
            try { resize?.(); } catch (_) {}
          });
          bbTelegramWebApp.onEvent?.("activated", () => {
            last = 0;
            accumulator = 0;
          });
          bbTelegramWebApp.onEvent?.("deactivated", () => {
            clearInput?.();
            if (state === "playing") {
              try { pauseRun?.(); } catch (_) {}
            }
            try { void bbTelegramFlushCloud({ keepalive: true }); } catch (_) {}
          });
        } catch (_) {}
        window.addEventListener("bb:cloud-change", (event) => {
          const detail = event?.detail;
          if (!detail || detail.version !== 1) return;
          bbTelegramQueueChange(detail.kind, detail.value, detail.updatedAt, detail);
        });
        window.addEventListener("pagehide", () => {
          try { void bbTelegramFlushCloud({ keepalive: true }); } catch (_) {}
        }, { capture: true });
        window.addEventListener("beforeunload", () => {
          try { void bbTelegramFlushCloud({ keepalive: true }); } catch (_) {}
        }, { capture: true });
      }

      if (bbTelegramWebApp) {
        bbTelegramApplyShell();
        bbEnsureTelegramProfileCard();
        bbTelegramBindEvents();
        bbRenderTelegramProfile();
        // Let the mature runtime finish its first boot frame before network
        // work begins. A failed auth request never blocks the game menu.
        deferMicrotask(() => { void bbAuthenticateTelegram(); });
      } else {
        try {
          window.__BUY_BUTTON_ACCOUNT__ = {
            provider: "guest",
            authenticated: false,
            getState: () => ({ authenticated: false, player: null, lastSyncAt: 0 })
          };
        } catch (_) {}
      }

/* ===== 99-close.js ===== */
      });
    })();
