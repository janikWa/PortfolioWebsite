(function () {
  "use strict";

  var LANG_KEY = "site-lang";

  var dict = {
    common: {
      skip_link: { de: "Zum Inhalt springen", en: "Skip to content" },
      nav_home: { de: "Start", en: "Home" },
      nav_services: { de: "Leistungen", en: "Services" },
      nav_process: { de: "Ablauf", en: "Process" },
      nav_work: { de: "Referenzen", en: "Work" },
      nav_about: { de: "Über mich", en: "About" },
      nav_contact_btn: { de: "Kontakt", en: "Contact" },
      nav_toggle_aria: { de: "Menü öffnen", en: "Open menu" },
      footer_nav_aria: { de: "Footer-Navigation", en: "Footer navigation" },
      social_aria: { de: "Soziale Netzwerke", en: "Social links" },
      footer_name: { de: "janik wahrheit · Websites & Tools", en: "janik wahrheit · Websites & tools" },
      brand_tag: { de: "Websites & Tools", en: "Websites & tools" }
    },

    home: {
      title: {
        de: "Janik Wahrheit — Websites & IT-Lösungen",
        en: "Janik Wahrheit — Websites & IT Solutions"
      },
      meta_desc: {
        de: "Ich baue Websites und individuelle IT-Lösungen für kleine Unternehmen und Selbstständige – persönlich, verständlich und direkt mit mir.",
        en: "I build websites and custom IT solutions for small businesses and freelancers — personal, clear, and directly with me."
      },
      hero_aria: { de: "Einleitung", en: "Introduction" },
      hero_eyebrow: { de: "Für Selbstständige & kleine Betriebe", en: "For freelancers & small local businesses" },
      hero_h1: {
        de: "Individuelle <span class=\"rotator\" data-words=\"Software|Websites|Dashboards|Web-Apps\">Software</span> für dein Unternehmen — <span class=\"accent-text\">persönlich entwickelt.</span>",
        en: "Custom <span class=\"rotator\" data-words=\"software|websites|dashboards|web apps\">software</span> for your business — <span class=\"accent-text\">built by me, personally.</span>"
      },
      hero_sub: {
        de: "Ich baue dir eine moderne Website – und schaue gemeinsam mit dir, wo individuelle IT-Lösungen deinen Arbeitsalltag spürbar leichter machen. Persönlich, ehrlich und ohne Fachchinesisch.",
        en: "I'll build you a modern website — and together we'll look at where custom IT solutions can make your day-to-day noticeably easier. Personal, honest and jargon-free."
      },
      hero_cta_primary: {
        de: "Schreib mir",
        en: "Get in touch"
      },
      hero_cta_secondary: { de: "So arbeite ich", en: "How I work" },


      services_eyebrow: { de: "Was ich anbiete", en: "What I offer" },
      services_h2: {
        de: "Drei Wege, wie ich dir helfen kann",
        en: "Three ways I can help you"
      },
      services_sub: {
        de: "Pragmatisch statt überladen: Ich baue genau das, was du im Alltag wirklich brauchst – nicht mehr und nicht weniger.",
        en: "Pragmatic, not bloated: I build exactly what you actually need day to day — no more, no less."
      },

      service1_title: { de: "Websites", en: "Websites" },
      service1_desc: {
        de: "Schnelle, saubere Websites, die auf dem Handy genauso gut funktionieren wie am Laptop und klar zeigen, was du anbietest – von der einfachen Landingpage bis zur kompletten Seite für deinen Betrieb.",
        en: "Fast, clean websites that work as well on a phone as on a laptop and make clear what you offer — from a simple landing page to a full site for your business."
      },
      service2_title: { de: "Interne Tools & Dashboards", en: "Internal tools & dashboards" },
      service2_desc: {
        de: "Kleine Programme, Dashboards und Automatisierungen, die zu deinen echten Abläufen passen – statt Excel-Listen, bei denen irgendwann keiner mehr durchblickt.",
        en: "Small tools, dashboards and automation that fit how you actually work — instead of spreadsheets nobody can make sense of anymore."
      },
      service3_title: { de: "Ehrliche Einschätzung", en: "Honest advice" },
      service3_desc: {
        de: "Du bist unsicher, welches Tool oder welche Lösung zu dir passt? Ich schaue es mir mit dir an und sage dir ehrlich, was sich lohnt – und was nicht.",
        en: "Not sure which tool or solution fits you? I'll look at it with you and tell you honestly what's worth it — and what isn't."
      },
      chat_q: { de: "Brauche ich wirklich eine eigene App?", en: "Do I really need my own app?" },
      chat_a: {
        de: "Ehrlich? Wahrscheinlich nicht. Eine gute Web-App reicht völlig.",
        en: "Honestly? Probably not. A good web app will do the job."
      },

      flow_eyebrow: { de: "Mehr als eine Website", en: "More than a website" },
      flow_h2: { de: "Von der Website zur passenden IT‑Lösung", en: "From website to the right IT solution" },
      flow_sub: {
        de: "Die meisten Projekte starten mit einer Website. Wenn wir uns unterhalten, sehen wir oft, wo im Alltag unnötig Zeit verloren geht – und genau da setze ich mit individuellen IT-Lösungen an.",
        en: "Most projects start with a website. When we talk, we often spot where time is being lost day to day — and that's exactly where I step in with custom IT solutions."
      },
      flow1_label: { de: "Der Start", en: "The start" },
      flow1_title: {
        de: "Deine Website",
        en: "Your website"
      },
      flow1_desc: {
        de: "Ein moderner, schneller Auftritt, der dein Angebot klar zeigt und dir Anfragen bringt.",
        en: "A modern, fast online presence that shows what you offer and brings you enquiries."
      },
      flow2_label: { de: "Im Gespräch", en: "In conversation" },
      flow2_title: { de: "Potenzial erkennen", en: "Spot the potential" },
      flow2_desc: {
        de: "Wir schauen uns gemeinsam deine Abläufe an: Wo pflegst du Daten doppelt, überträgst sie per Hand oder suchst ewig?",
        en: "We look at your workflows together: where are you entering data twice, copying it by hand or searching forever?"
      },
      flow3_label: { de: "Der nächste Schritt", en: "The next step" },
      flow3_title: { de: "Individuelle IT-Lösung", en: "Custom IT solution" },
      flow3_desc: {
        de: "Tools, Dashboards und Automatisierungen, die genau zu deinem Betrieb passen.",
        en: "Tools, dashboards and automation that fit exactly how your business works."
      },
      flow3_chip1: { de: "Anfragen automatisch erfassen", en: "Capture enquiries automatically" },
      flow3_chip2: { de: "Excel → Dashboard", en: "Spreadsheet → dashboard" },
      flow3_chip3: { de: "Online-Terminbuchung", en: "Online booking" },
      flow_note: {
        de: "Kein Muss: Wenn eine Website alles ist, was du brauchst, bleibt es genau dabei.",
        en: "No pressure: if a website is all you need, that's exactly what you get."
      },

      process_eyebrow: { de: "So läuft's ab", en: "How it works" },
      process_h2: { de: "Vom ersten Kontakt bis zum Go‑live", en: "From first contact to go‑live" },
      process_sub: {
        de: "Vier klare Schritte – du weißt jederzeit, wo dein Projekt steht.",
        en: "Four clear steps — you always know where your project stands."
      },
      step1_title: { de: "Erstkontakt", en: "First contact" },
      step1_desc: {
        de: "Du erzählst mir kurz, worum es geht. In einem unverbindlichen Gespräch klären wir deine Ziele, Wünsche und den Rahmen.",
        en: "You tell me briefly what it's about. In a no-obligation chat we figure out your goals, wishes and scope."
      },
      step2_title: { de: "Konzept", en: "Concept" },
      step2_desc: {
        de: "Du bekommst von mir einen klaren Plan mit Aufbau, Funktionen, Zeitrahmen und Kosten – bevor es losgeht.",
        en: "I send you a clear plan covering structure, features, timeline and cost — before anything starts."
      },
      step3_title: { de: "Entwicklung", en: "Development" },
      step3_desc: {
        de: "Ich setze Design und Technik um. Du siehst regelmäßig Zwischenstände und gibst mir Feedback.",
        en: "I build the design and the tech. You see regular progress and give me feedback along the way."
      },
      step4_title: { de: "Launch & Go", en: "Launch & go" },
      step4_desc: {
        de: "Test, Feinschliff, live. Danach bin ich weiter für Anpassungen und neue Ideen für dich da.",
        en: "Testing, polish, live. After that I'm still around for changes and new ideas."
      },

      work_eyebrow: { de: "Referenzen", en: "Selected work" },
      work_h2: { de: "Kundenprojekte", en: "Client projects" },
      work_sub: {
        de: "Sobald die ersten Kundenprojekte online sind, findest du sie hier.",
        en: "As soon as the first client projects are live, you'll find them here."
      },

      work_placeholder_cat: { de: "Kundenprojekt", en: "Client project" },
      work_placeholder_title: { de: "Demnächst hier", en: "Coming soon" },
      work_placeholder_desc: { de: "Hier erscheint bald ein Kundenprojekt.", en: "A client project will appear here soon." },
      teaser_p1: {
        de: "<strong>Hi, ich bin Janik</strong> – ich studiere Wirtschaftsingenieurwesen (M.Sc.) am KIT und komme aus der Data Science. Ich baue Websites und kleine Tools für Selbstständige und kleine Betriebe.",
        en: "<strong>Hi, I’m Janik</strong> — I’m studying Industrial Engineering (M.Sc.) at KIT and come from a data science background. I build websites and small tools for freelancers and small businesses."
      },
      teaser_p2: {
        de: "Kein Agentur-Apparat, keine Buzzwords: Du sprichst direkt mit mir, und ich sage dir ehrlich, was für dich sinnvoll ist.",
        en: "No agency machine, no buzzwords: you talk directly to me, and I'll tell you honestly what makes sense for you."
      },
      teaser_link: { de: "Mehr über mich →", en: "More about me →" },
      teaser_img_alt: { de: "Memoji von Janik", en: "Memoji of Janik" },

      contact_status: {
        de: "Ich habe Zeit für neue Projekte",
        en: "I have time for new projects"
      },
      contact_h2: {
        de: "Lass uns über dein Projekt sprechen",
        en: "Let's talk about your project"
      },
      contact_sub: {
        de: "Ob Website oder individuelles Tool: Erzähl mir kurz, was du vorhast. Ich melde mich innerhalb von 48 Stunden persönlich bei dir – mit einer ersten, ehrlichen Einschätzung.",
        en: "Website or custom tool: tell me briefly what you have in mind. I'll get back to you personally within 48 hours with an honest first take."
      },
      contact_email_btn: {
        de: "Schreib mir",
        en: "Write to me"
      },
      contact_linkedin_btn: { de: "LinkedIn", en: "LinkedIn" },
      contact_copy: { de: "Kopieren", en: "Copy" },
      contact_copied: { de: "Kopiert!", en: "Copied!" },
      contact_time: { de: "Lokalzeit Karlsruhe", en: "Local time in Karlsruhe" },
      contact_meta: {
        de: "Ich sitze in Karlsruhe und arbeite auch gern remote mit dir zusammen.",
        en: "I'm based in Karlsruhe and just as happy to work with you remotely."
      }
    },

    about: {
      title: { de: "Über mich — Janik Wahrheit", en: "About — Janik Wahrheit" },
      meta_desc: {
        de: "Janik Wahrheit — Masterstudent Wirtschaftsingenieurwesen am KIT. Ich baue maßgeschneiderte digitale Werkzeuge und Web-Projekte. Lebenslauf und Portfolio.",
        en: "Janik Wahrheit — Master's student in Industrial Engineering at KIT building custom digital tools and web projects. CV and portfolio."
      },
      page_h1: { de: "Über mich", en: "About Me" },
      page_sub: {
        de: "Masterstudent am KIT – und derjenige, der dein Projekt von der Idee bis zum fertigen Code umsetzt.",
        en: "Master's student at KIT — and the person who takes your project from idea to finished code."
      },
      photo_alt: { de: "Foto von Janik Wahrheit", en: "Photo of Janik Wahrheit" },

      p_wave: { de: "Hi 👋", en: "Hi 👋" },
      p1: {
        de: "Ich bin Janik, Masterstudent des Wirtschaftsingenieurwesens am KIT (Karlsruher Institut für Technologie).",
        en: "I'm Janik, a Master's student in Industrial Engineering at KIT (Karlsruhe Institute of Technology)."
      },
      p2: {
        de: 'Neben meinem Studium unterstütze ich kleine Unternehmen und Selbstständige dabei, ihre Abläufe zu digitalisieren – indem ich die Software und Websites baue, die sie dafür brauchen. Mein technisches Fundament habe ich unter anderem in der Data-Science-Abteilung bei Porsche und beim Aufbau meines Startups <a href="https://usegradias.ai/" target="_blank" rel="noopener">usegradias.ai</a> gesammelt.',
        en: 'Alongside my studies, I help small businesses and freelancers digitize their workflows by building the exact software and websites they need. I gained my technical foundation in the Data Science department at Porsche and by building my startup <a href="https://usegradias.ai/" target="_blank" rel="noopener">usegradias.ai</a>.'
      },
      p3: {
        de: "Durch mein ingenieurwissenschaftliches Studium gehe ich Probleme analytisch an. Ich schreibe keine dicken Berater-Konzepte, sondern programmiere Werkzeuge, die du direkt nutzen kannst und die dir im Alltag Zeit sparen.",
        en: "My engineering studies taught me to approach problems analytically. I don't write thick consulting reports — I build tools you can use right away and that save you time every day."
      },
      p4: {
        de: "Wenn ich nicht am Schreibtisch sitze, bin ich meistens sportlich unterwegs – ob als Läufer auf der 3000-Meter-Bahn, beim Halbmarathon oder auf dem Rennrad. Außerdem koche ich gerne und lese viel über Psychologie, Wirtschaft und Biologie, um immer wieder neue Perspektiven kennenzulernen.",
        en: "When I'm not at my desk, I'm usually highly active – whether running on the 3000m track, racing a half marathon, or riding my road bike. I also enjoy cooking and reading about psychology, economics, and biology to constantly discover new perspectives."
      },
      p5: {
        de: "Danke, dass du vorbeischaust – schreib mir einfach, wenn wir zusammen etwas bauen sollen!",
        en: "Thanks for stopping by — just drop me a message if we should build something together!"
      },

      techstack_eyebrow: { de: "Werkzeugkasten", en: "Toolbox" },
      techstack_h2: { de: "Kern-Technologien", en: "Core Technologies" },
      techstack_sub: {
        de: "Die Sprachen, Frameworks und Tools, die ich für meine Projekte nutze.",
        en: "The languages, frameworks, and tools I use to build my projects."
      },

      cv_eyebrow: { de: "Werdegang", en: "Track record" },
      cv_h2: { de: "Lebenslauf", en: "CV" },
      cv_sub: { de: "Studium, berufliche Stationen und Praktika.", en: "Studies, professional experience, and internships." },

      cv1_date: { de: "03/2021", en: "03/2021" },
      cv1_title: { de: "Abitur", en: "High School Diploma" },
      cv1_desc: {
        de: "Europa-Gymnasium Wörth · Abiturnote: 1,3<br>Leistungskurse: Mathematik, Physik, Politikwissenschaft.",
        en: "Europa Gymnasium Wörth · GPA: 1.3 (equivalent to an A)<br>Advanced Courses: Mathematics, Physics, Political Science."
      },
      cv2_date: { de: "10/2021 – 10/2022", en: "10/2021 – 10/2022" },
      cv2_title: { de: "Jurastudium", en: "Law Studies" },
      cv2_desc: { de: "Universität Heidelberg", en: "University of Heidelberg" },

      cv3_date: { de: "06/2022 – 09/2022", en: "06/2022 – 09/2022" },
      cv3_title: { de: "Praktikum bei der MTS Group", en: "Internship at MTS Group" },
      cv3_desc: {
        de: "Fischer Bikes · Category Management / Entwicklungsabteilung",
        en: "Fischer Bikes · Category Management / Development Department"
      },

      cv4_date: { de: "10/2022 – 03/2026", en: "10/2022 – 03/2026" },
      cv4_title: { de: "B.Sc. Wirtschaftsingenieurwesen", en: "B.Sc. Industrial Engineering" },
      cv4_desc: { de: "Karlsruher Institut für Technologie (KIT)", en: "Karlsruhe Institute of Technology (KIT)" },

      cv5_date: { de: "10/2023 – 03/2024", en: "10/2023 – 03/2024" },
      cv5_title: { de: 'Tutor — "Programmieren I: Java"', en: 'Tutor — "Programming I: Java"' },
      cv5_desc: {
        de: "AIFB — Institut für Angewandte Informatik und Formale Beschreibungsverfahren",
        en: "AIFB — Institute for Applied Informatics and Formal Description Methods"
      },

      cv6_date: { de: "seit 11/2023", en: "since 11/2023" },
      cv6_title: { de: "Mitglied bei LinkIT", en: "Member at LinkIT" },
      cv6_desc: { de: "Studentische Vereinigung für Data Science und ML", en: "Student Association for Data Science and ML" },

      cv7_date: { de: "04/2024 – 07/2024", en: "04/2024 – 07/2024" },
      cv7_title: { de: "Praktikant im Bereich Data Science bei Porsche", en: "Data Science Intern at Porsche" },
      cv7_desc: { de: "Fachbereich Data Science — Data.Driven.Quality", en: "Data Science Department — Data.Driven.Quality" },

      cv8_date: { de: "10/2024 – 04/2026", en: "10/2024 – 04/2026" },
      cv8_title: { de: "Werkstudent bei Porsche", en: "Working Student at Porsche" },
      cv8_desc: { de: "Fachbereich Data Science — Data.Driven.Quality", en: "Data Science Department — Data.Driven.Quality" },

      cv9_date: { de: "seit 12/2025", en: "since 12/2025" },
      cv9_title: { de: "Mitgründer von usegradias.ai", en: "Co-Founder at usegradias.ai" },
      cv9_desc: { de: "Aufbau von usegradias.ai", en: "Building usegradias.ai" },

      cv10_date: { de: "03/2026", en: "03/2026" },
      cv10_title: { de: "Bachelorarbeit — Note: 1,0", en: "Bachelor's Thesis — Grade: 1.0" },
      cv10_desc: {
        de: '"Layer-wise Weight Distributions in Neural Networks and Explicit Heavy-Tailed Regularization"',
        en: '"Layer-wise Weight Distributions in Neural Networks and Explicit Heavy-Tailed Regularization"'
      },

      cv11_date: { de: "seit 04/2026", en: "since 04/2026" },
      cv11_title: { de: "M.Sc. Wirtschaftsingenieurwesen", en: "M.Sc. Industrial Engineering" },
      cv11_desc: { de: "Karlsruher Institut für Technologie (KIT)", en: "Karlsruhe Institute of Technology (KIT)" },

      projects_eyebrow: { de: "Projekte", en: "Side projects" },
      projects_h2: { de: "Weitere Arbeiten", en: "Other Work" },
      projects_sub: {
        de: "Studienprojekte und persönliche Entwicklungen, die meine technische Bandbreite zeigen.",
        en: "University coursework and personal projects that show the breadth of my technical skills."
      },
      techlabel: { de: "technologien", en: "technologies" },

      proj1_desc: {
        de: "Eine interaktive Visualisierung von Dijkstras Shortest-Path-Algorithmus.",
        en: "An interactive visualization of Dijkstra's shortest-path algorithm."
      },
      proj1_tag: { de: "Datenstrukturen & Algorithmen", en: "data structures & algorithms" },

      proj2_desc: {
        de: "Verwandelt eine URL mit Laufergebnissen automatisch in einen Bericht — erstellt mit Quarto, um Pace- und Leistungsdaten aus Laufwettbewerben sichtbar zu machen.",
        en: "Turns a race-results URL into an automated report — built with Quarto to surface pacing and performance insights from running races."
      },
      proj2_tag: { de: "Datenvisualisierung & Reporting", en: "data visualization & reporting" },

      proj3_title: { de: "Straßenverkehrslärm", en: "Road Traffic Noise" },
      proj3_desc: {
        de: "Ein Universitätsprojekt zur Analyse von Straßenverkehrslärm-Daten.",
        en: "A university project analyzing road traffic noise data."
      },
      proj3_tag: { de: "Universitätsprojekt", en: "university project" },

      proj4_desc: {
        de: "Eine React + Vite App zum Durchsuchen einer Filmdatenbank, mit einem Appwrite-Backend, das die meistgesuchten Titel in einem Live-Ranking erfasst.",
        en: "A React + Vite app for browsing a movie database, with an Appwrite backend that tracks the most-searched titles into a live ranking."
      },

      proj5_desc: {
        de: "Ein Universitätsprojekt zur Erkennung von Lochfraß (Pitting) in der Produktion anhand von Live-Daten, mit Streamlit-Dashboard und automatischen E-Mail-Warnungen.",
        en: "A university project detecting pitting defects in production from live data, with a Streamlit dashboard and automatic email alerts."
      },
      proj5_tag: { de: "Vorausschauende Qualitätsüberwachung", en: "predictive quality monitoring" },

      proj6_desc: {
        de: "Mein Startup – mitgegründet im Dezember 2025.",
        en: "My startup — co-founded in December 2025."
      },
      proj6_link: { de: "usegradias.ai besuchen →", en: "visit usegradias.ai →" }
    }
  };

  function get(key) {
    var parts = key.split(".");
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      node = node ? node[parts[i]] : undefined;
    }
    return node;
  }

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var entry = get(el.getAttribute("data-i18n"));
      if (entry && entry[lang] != null) el.textContent = entry[lang];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var entry = get(el.getAttribute("data-i18n-html"));
      if (entry && entry[lang] != null) el.innerHTML = entry[lang];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      // format: "attr:key" e.g. data-i18n-attr="alt:home.teaser_img_alt"
      var spec = el.getAttribute("data-i18n-attr").split(":");
      var attr = spec[0], key = spec[1];
      var entry = get(key);
      if (entry && entry[lang] != null) el.setAttribute(attr, entry[lang]);
    });

    var titleEl = document.querySelector("[data-i18n-title]");
    if (titleEl) {
      var titleEntry = get(titleEl.getAttribute("data-i18n-title"));
      if (titleEntry && titleEntry[lang] != null) document.title = titleEntry[lang];
    }

    var metaEl = document.querySelector('meta[name="description"][data-i18n-content]');
    if (metaEl) {
      var metaEntry = get(metaEl.getAttribute("data-i18n-content"));
      if (metaEntry && metaEntry[lang] != null) metaEl.setAttribute("content", metaEntry[lang]);
    }

    var toggle = document.getElementById("lang-toggle");
    if (toggle) {
      var other = lang === "de" ? "en" : "de";
      toggle.textContent = other.toUpperCase();
      toggle.setAttribute("aria-label", lang === "de" ? "Switch to English" : "Auf Deutsch umschalten");
    }
  }

  var initialLang = "de";
  try {
    var stored = localStorage.getItem(LANG_KEY);
    if (stored === "de" || stored === "en") initialLang = stored;
  } catch (e) { /* storage unavailable */ }

  applyLanguage(initialLang);

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.getElementById("lang-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var current = document.documentElement.lang === "en" ? "en" : "de";
      var next = current === "de" ? "en" : "de";
      applyLanguage(next);
      try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* storage unavailable */ }
    });
  });
})();
