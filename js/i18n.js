(function () {
  "use strict";

  var LANG_KEY = "site-lang";

  var dict = {
    common: {
      skip_link: { de: "Zum Inhalt springen", en: "Skip to content" },
      nav_home: { de: "Start", en: "Home" },
      nav_work: { de: "Projekte", en: "Projects" },
      nav_about: { de: "Über mich", en: "About" },
      nav_cv: { de: "Lebenslauf", en: "CV" },
      nav_contact_btn: { de: "Kontakt", en: "Contact" },
      nav_toggle_aria: { de: "Menü öffnen", en: "Open menu" },
      footer_nav_aria: { de: "Footer-Navigation", en: "Footer navigation" },
      social_aria: { de: "Soziale Netzwerke", en: "Social links" },
      footer_name: { de: "janik wahrheit · Portfolio", en: "janik wahrheit · Portfolio" },
      made_by: { de: "Made by", en: "Made by" }
    },

    home: {
      title: { de: "Janik Wahrheit — Portfolio", en: "Janik Wahrheit — Portfolio" },
      meta_desc: {
        de: "Portfolio von Janik Wahrheit – Masterstudent Wirtschaftsingenieurwesen am KIT mit Schwerpunkt Data Science. Projekte, Tech-Stack und Lebenslauf.",
        en: "Portfolio of Janik Wahrheit — Master’s student in Industrial Engineering at KIT with a focus on data science. Projects, tech stack and CV."
      },
      hero_aria: { de: "Einleitung", en: "Introduction" },
      hero_eyebrow: { de: "Wirtschaftsingenieurwesen (M.Sc.) · KIT", en: "Industrial Engineering (M.Sc.) · KIT" },
      hero_h1: {
        de: "Hi, ich bin Janik.<br>Ich baue <span class=\"rotator\" data-words=\"Websites|Web-Apps|Tools|Software\">Websites</span> und <span class=\"accent-text\">Datenprojekte.</span>",
        en: "Hi, I’m Janik.<br>I build <span class=\"rotator\" data-words=\"websites|web apps|tools|software\">websites</span> and <span class=\"accent-text\">data projects.</span>"
      },
      hero_sub: {
        de: "Ich studiere am KIT mit Schwerpunkt Data Science, habe bei Porsche im Data-Science-Team gearbeitet und baue nebenbei eigene Projekte – von Uni-Algorithmen bis zum Startup usegradias.ai.",
        en: "I’m studying at KIT with a focus on data science, worked on the data science team at Porsche, and build projects of my own on the side — from university algorithms to my startup usegradias.ai."
      },
      hero_cta_primary: { de: "Projekte ansehen", en: "See my projects" },
      hero_cta_secondary: { de: "Kontakt", en: "Contact" },

      projects_eyebrow: { de: "Projekte", en: "Projects" },
      projects_h2: { de: "Ausgewählte Projekte", en: "Selected projects" },
      projects_sub: {
        de: "Studien- und eigene Projekte – von Algorithmen über Datenanalysen bis zu Web-Apps.",
        en: "University and personal projects — from algorithms and data analysis to web apps."
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

      proj6_desc: { de: "Mein Startup – mitgegründet im Dezember 2025.", en: "My startup — co-founded in December 2025." },
      proj6_link: { de: "usegradias.ai besuchen →", en: "visit usegradias.ai →" },

      teaser_p1: {
        de: "<strong>Hi, ich bin Janik</strong> – Masterstudent im Wirtschaftsingenieurwesen am KIT mit Schwerpunkt Data Science. Ich baue gern Dinge, die funktionieren: von Datenanalysen bis zu kompletten Web-Apps.",
        en: "<strong>Hi, I’m Janik</strong> — a Master’s student in Industrial Engineering at KIT with a focus on data science. I like building things that work: from data analyses to complete web apps."
      },
      teaser_p2: {
        de: "Nebenbei arbeite ich als Mitgründer an usegradias.ai und bin viel auf der Laufbahn oder dem Rennrad unterwegs.",
        en: "On the side I’m co-founding usegradias.ai, and you’ll often find me on the running track or on my road bike."
      },
      teaser_link: { de: "Mehr über mich →", en: "More about me →" },
      teaser_img_alt: { de: "Memoji von Janik", en: "Memoji of Janik" },

      contact_status: { de: "Offen für Austausch", en: "Open to chat" },
      contact_h2: { de: "Schreib mir einfach.", en: "Just write to me." },
      contact_sub: {
        de: "Ob Frage, Feedback oder einfach Hallo – ich freue mich über jede Nachricht und antworte meist innerhalb von ein bis zwei Tagen.",
        en: "Whether it’s a question, feedback or just a hello — I’m happy about every message and usually reply within a day or two."
      },
      contact_email_btn: { de: "E-Mail schreiben", en: "Send an email" },
      contact_linkedin_btn: { de: "LinkedIn", en: "LinkedIn" }
    },

    about: {
      title: { de: "Über mich — Janik Wahrheit", en: "About — Janik Wahrheit" },
      meta_desc: {
        de: "Janik Wahrheit — Masterstudent Wirtschaftsingenieurwesen am KIT mit Schwerpunkt Data Science. Lebenslauf, Tech-Stack und Hintergrund.",
        en: "Janik Wahrheit — Master’s student in Industrial Engineering at KIT with a focus on data science. CV, tech stack and background."
      },
      page_h1: { de: "Über mich", en: "About Me" },
      page_sub: {
        de: "Masterstudent am KIT mit Schwerpunkt Data Science – und jemand, der Dinge gern selbst baut.",
        en: "Master’s student at KIT with a focus on data science — and someone who likes building things."
      },
      photo_alt: { de: "Foto von Janik Wahrheit", en: "Photo of Janik Wahrheit" },

      p_wave: { de: "Hi 👋", en: "Hi 👋" },
      p1: {
        de: "Ich bin Janik, Masterstudent des Wirtschaftsingenieurwesens am KIT (Karlsruher Institut für Technologie) mit Schwerpunkt Data Science.",
        en: "I’m Janik, a Master’s student in Industrial Engineering at KIT (Karlsruhe Institute of Technology) with a focus on data science."
      },
      p2: {
        de: "Aktuell baue ich als Mitgründer <a href=\"https://usegradias.ai/\" target=\"_blank\" rel=\"noopener\">usegradias.ai</a> auf – mit Erfahrung aus meiner Zeit im Data-Science-Team bei Porsche und meiner Bachelorarbeit über heavy-tailed Regularisierung in neuronalen Netzen.",
        en: "Right now I’m co-founding <a href=\"https://usegradias.ai/\" target=\"_blank\" rel=\"noopener\">usegradias.ai</a> — drawing on my time on the data science team at Porsche and my Bachelor’s thesis on heavy-tailed regularization in neural networks."
      },
      p3: {
        de: "Mich interessieren Machine Learning, Data Science und Statistik – genauso wie Full-Stack-Entwicklung. Ich gehe Probleme analytisch an und baue Dinge lieber selbst, als nur darüber zu reden.",
        en: "I’m interested in machine learning, data science and statistics — just as much as full-stack development. I approach problems analytically and prefer building things myself over just talking about them."
      },
      p4: {
        de: "Wenn ich nicht am Schreibtisch sitze, bin ich meistens sportlich unterwegs – ob als Läufer auf der 3000-Meter-Bahn, beim Halbmarathon oder auf dem Rennrad. Außerdem koche ich gerne und lese viel über Psychologie, Wirtschaft und Biologie, um immer wieder neue Perspektiven kennenzulernen.",
        en: "When I'm not at my desk, I'm usually highly active – whether running on the 3000m track, racing a half marathon, or riding my road bike. I also enjoy cooking and reading about psychology, economics, and biology to constantly discover new perspectives."
      },
      p5: {
        de: "Danke fürs Vorbeischauen – schreib mir gerne, wenn du dich vernetzen oder einfach Hallo sagen möchtest!",
        en: "Thanks for stopping by — feel free to write to me if you’d like to connect or just say hi!"
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
      cv11_desc: { de: "Karlsruher Institut für Technologie (KIT)", en: "Karlsruhe Institute of Technology (KIT)" }
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
