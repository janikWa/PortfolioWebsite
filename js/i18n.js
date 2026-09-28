(function () {
  "use strict";

  var LANG_KEY = "site-lang";

  var dict = {
    common: {
      skip_link: { de: "Zum Inhalt springen", en: "Skip to content" },
      nav_home: { de: "Start", en: "Home" },
      nav_services: { de: "Leistungen", en: "Services" },
      nav_work: { de: "Arbeiten", en: "Work" },
      nav_about: { de: "Über mich", en: "About" },
      nav_contact_btn: { de: "Kontakt", en: "Contact" },
      nav_toggle_aria: { de: "Menü öffnen", en: "Open menu" },
      footer_nav_aria: { de: "Footer-Navigation", en: "Footer navigation" },
      social_aria: { de: "Soziale Netzwerke", en: "Social links" },
      footer_name: { de: "janik wahrheit · IT-Beratung", en: "janik wahrheit · IT Consulting" },
      brand_tag: { de: "IT-Beratung", en: "IT Consulting" }
    },

    home: {
      title: { de: "Janik Wahrheit — IT-Beratung für KMU", en: "Janik Wahrheit — IT Consulting for SMEs" },
      meta_desc: {
        de: "Individuelle Websites, Backend-Apps und Dashboards für kleine und mittlere Unternehmen — von Janik Wahrheit, Data-Science-Student und freiberuflicher IT-Berater.",
        en: "Custom websites, backend apps, and dashboards for small and medium-sized businesses — by Janik Wahrheit, Data Science student and freelance IT consultant."
      },
      hero_aria: { de: "Einleitung", en: "Introduction" },
      hero_eyebrow: { de: "IT-Beratung für KMU & Selbstständige", en: "IT consulting for SMEs & freelancers" },
      hero_h1: {
        de: 'Individuelle Software für Ihr Unternehmen — <span class="accent-text">persönlich entwickelt.</span>',
        en: 'Custom software for your business — <span class="accent-text">built by a real person.</span>'
      },
      hero_sub: {
        de: "Ich entwickle Websites, Backend-Anwendungen und Dashboards, die wirklich zu Ihrem Unternehmen passen – persönlich betreut, verständlich erklärt und mit echter Freude an guter Arbeit.",
        en: "I build websites, backend applications, and dashboards that genuinely fit your business — with personal attention, plain-language explanations, and real care for getting the details right."
      },
      hero_cta_primary: { de: "Kontakt aufnehmen", en: "Get in touch" },
      hero_cta_secondary: { de: "Meine Arbeiten ansehen", en: "See my work" },

      services_eyebrow: { de: "Was ich anbiete", en: "What I offer" },
      services_h2: { de: "Drei Wege, wie ich helfen kann", en: "Three ways I can help" },
      services_sub: {
        de: "Praktische Lösungen, die zu Ihrem Unternehmen passen — unkompliziert, transparent und ohne Umwege.",
        en: "Practical solutions that fit your business — straightforward, transparent, and no unnecessary detours."
      },

      service1_title: { de: "Moderne Websites", en: "Modern Websites" },
      service1_desc: {
        de: "Schnelle, responsive Websites, die auf jedem Gerät überzeugen und aus Besuchern Kunden machen — von der Landingpage bis zur kompletten Unternehmenswebsite.",
        en: "Fast, responsive websites that make a great impression on any device and turn visitors into customers — from a simple landing page to a full business site."
      },
      service2_title: { de: "Individuelle Backend-Apps & Dashboards", en: "Custom Backend Apps & Dashboards" },
      service2_desc: {
        de: "Maßgeschneiderte interne Tools, Live-Dashboards und Automatisierungen, die zu Ihren echten Abläufen passen — keine Excel-Tabellen mehr, die aus allen Nähten platzen.",
        en: "Tailored internal tools, live dashboards, and automation that fit how you actually work — so your spreadsheets can finally stop bursting at the seams."
      },
      service3_title: { de: "IT-Beratung", en: "IT Consulting" },
      service3_desc: {
        de: "Ehrliche Beratung zu Daten, Software und digitalen Tools — damit Sie von Anfang an die richtige Entscheidung treffen.",
        en: "Honest advice on data, software, and digital tools — so you make the right call from day one."
      },

      work_eyebrow: { de: "Referenzen", en: "Selected work" },
      work_h2: { de: "Ausgewählte Projekte", en: "Selected Projects" },
      work_sub: { de: "Echte Web-Projekte, die zeigen, wie ich arbeite.", en: "Real web projects that show how I work." },

      work1_cat: { de: "Startup · SaaS-Produkt", en: "Startup · SaaS Product" },
      work1_title: { de: "gradias.ai", en: "gradias.ai" },
      work1_desc: {
        de: "Von der Idee bis zum Launch: Als Mitgründer habe ich ein SaaS-Produkt komplett selbst aufgebaut — von der Architektur bis zur Oberfläche. Genau die Erfahrung, die auch in Ihr Projekt einfließt.",
        en: "From idea to launch: as co-founder, I built a SaaS product from the ground up — architecture, backend, and interface. That same hands-on experience goes into every client project."
      },
      work1_tag1: { de: "Produkt", en: "Product" },
      work1_tag2: { de: "Full-Stack", en: "Full-Stack" },

      work2_cat: { de: "Web-App · Full-Stack", en: "Web App · Full-Stack" },
      work2_title: { de: "Filmsuche mit Live-Ranking", en: "Movie Search with Live Ranking" },
      work2_desc: {
        de: "Eine moderne Web-App mit eigenem Backend, das Suchanfragen auswertet und daraus ein Live-Ranking erstellt — dasselbe Prinzip lässt sich direkt auf Produktkataloge, Kundenportale oder interne Suchfunktionen übertragen.",
        en: "A modern web app with its own backend that tracks searches and turns them into a live ranking — the same approach works just as well for product catalogs, customer portals, or internal search tools."
      },
      work2_tag1: { de: "React", en: "React" },
      work2_tag2: { de: "Appwrite", en: "Appwrite" },

      work_more: { de: "Alle Projekte ansehen", en: "See all projects" },

      teaser_p1: {
        de: '<strong>Hallo, ich bin Janik</strong> — Masterstudent für Wirtschaftsingenieurwesen mit Schwerpunkt Data Science am KIT, aktuell als Data Scientist tätig und Mitgründer meines eigenen Startups gradias.ai.',
        en: '<strong>Hi, I’m Janik</strong> — a Master’s student in Industrial Engineering &amp; Data Science at KIT, currently working as a data scientist and co-founding my own startup, gradias.ai.'
      },
      teaser_p2: {
        de: "Ich freue mich über jedes Projekt und bringe echtes Interesse und Sorgfalt mit — vom ersten Gespräch bis zum letzten Feinschliff.",
        en: "I genuinely enjoy every project I take on, and I bring real care and attention to it — from our first conversation to the final details."
      },
      teaser_link: { de: "Mehr über mich →", en: "More about me →" },
      teaser_img_alt: { de: "Memoji von Janik", en: "Memoji of Janik" },

      contact_h2: { de: "Lassen Sie uns etwas gemeinsam aufbauen", en: "Let's build something together" },
      contact_sub: {
        de: "Haben Sie ein Projekt im Kopf? Ich freue mich, davon zu hören — meist melde ich mich innerhalb von ein bis zwei Tagen zurück.",
        en: "Have a project in mind? I'd love to hear about it — I usually get back to you within a day or two."
      },
      contact_email_btn: { de: "E-Mail schreiben", en: "Email me" },
      contact_linkedin_btn: { de: "LinkedIn", en: "LinkedIn" },
      contact_meta: {
        de: "Ansässig in Karlsruhe · arbeite remote mit Kunden überall",
        en: "Based in Karlsruhe, Germany · working remotely with clients everywhere"
      }
    },

    about: {
      title: { de: "Über mich — Janik Wahrheit", en: "About — Janik Wahrheit" },
      meta_desc: {
        de: "Janik Wahrheit — Masterstudent für Wirtschaftsingenieurwesen & Data Science am KIT, Data Scientist und Mitgründer von gradias.ai. Lebenslauf, Tech-Stack und Nebenprojekte.",
        en: "Janik Wahrheit — Master's student in Industrial Engineering & Data Science at KIT, data scientist, and co-founder of gradias.ai. CV, tech stack, and side projects."
      },
      page_h1: { de: "Über mich", en: "About Me" },
      page_sub: {
        de: "Student, Data Scientist, Gründer — und die Person, die Ihr Projekt tatsächlich umsetzt.",
        en: "Student, data scientist, founder — and the person who'll actually be building your project."
      },
      photo_alt: { de: "Foto von Janik Wahrheit", en: "Photo of Janik Wahrheit" },

      p_wave: { de: "Hi 👋", en: "Hi 👋" },
      p1: {
        de: "Ich bin Janik, Masterstudent des Wirtschaftsingenieurwesens am KIT (Karlsruher Institut für Technologie) mit Schwerpunkt Data Science.",
        en: "I'm Janik, a Master's student in Industrial Engineering at KIT (Karlsruhe Institute of Technology), with a focus on Data Science."
      },
      p2: {
        de: 'Aktuell baue ich <a href="https://gradias.ai/" target="_blank" rel="noopener">gradias.ai</a> als Mitgründer auf — mit Erfahrung aus meiner Zeit bei Porsche und meiner Bachelorarbeit über heavy-tailed Regularisierung in neuronalen Netzen.',
        en: 'Right now, I’m building <a href="https://gradias.ai/" target="_blank" rel="noopener">gradias.ai</a> as a co-founder — drawing on experience from my time at Porsche and my Bachelor’s thesis on heavy-tailed regularization in neural networks.'
      },
      p3: {
        de: "Mein akademisches und berufliches Interesse liegt in den Bereichen Machine Learning, Data Science und Statistik. Genauso begeistert mich Full-Stack-Entwicklung — genau das, was ich jetzt auch als freiberuflicher IT-Berater anbiete.",
        en: "My academic and professional interests lie in machine learning, data science, and statistics. I'm just as passionate about full-stack development — which is exactly what I now offer as a freelance IT consultant."
      },
      p4: {
        de: "Neben Studium und Beruf bin ich leidenschaftlicher Ausdauersportler. Ich laufe wettkampfmäßig, von der 3000-Meter-Bahn bis zum Halbmarathon. Wenn ich nicht laufe, findet man mich auf dem Rennrad, im Fitnessstudio oder beim Ausprobieren neuer Rezepte in der Küche. Außerdem lese ich gerne und erweitere mein Wissen in Bereichen wie Psychologie, Finanzen, Biologie, persönlicher Entwicklung oder Biografien interessanter Persönlichkeiten.",
        en: "Outside of work and studies, I'm a dedicated endurance athlete. I compete in distances ranging from the 3000m track to the half marathon. When I'm not running, you'll find me on my road bike, at the gym, or trying out new recipes in the kitchen. I also love reading and expanding my knowledge in areas like psychology, finance, biology, personal development, or biographies of people I find interesting."
      },
      p5: {
        de: "Vielen Dank für Ihren Besuch – melden Sie sich gerne, wenn Sie sich vernetzen möchten!",
        en: "Thanks for stopping by – feel free to reach out if you'd like to connect!"
      },

      techstack_eyebrow: { de: "Werkzeugkasten", en: "Toolbox" },
      techstack_h2: { de: "Kern-Technologien", en: "Core Technologies" },
      techstack_sub: {
        de: "Die Sprachen, Frameworks und Tools, mit denen ich täglich arbeite.",
        en: "The languages, frameworks, and tools I work with every day."
      },

      cv_eyebrow: { de: "Werdegang", en: "Track record" },
      cv_h2: { de: "Lebenslauf", en: "CV" },
      cv_sub: { de: "Studium, Praktika und alles dazwischen.", en: "Studies, internships, and the work in between." },

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
      cv9_title: { de: "Mitgründer von gradias.ai", en: "Co-Founder at gradias.ai" },
      cv9_desc: { de: "Aufbau von gradias.ai", en: "Building gradias.ai" },

      cv10_date: { de: "03/2026", en: "03/2026" },
      cv10_title: { de: "Bachelorarbeit — Note: 1,0", en: "Bachelor's Thesis — Grade: 1.0" },
      cv10_desc: {
        de: '"Layer-wise Weight Distributions in Neural Networks and Explicit Heavy-Tailed Regularization"',
        en: '"Layer-wise Weight Distributions in Neural Networks and Explicit Heavy-Tailed Regularization"'
      },

      cv11_date: { de: "seit 04/2026", en: "since 04/2026" },
      cv11_title: { de: "M.Sc. Wirtschaftsingenieurwesen", en: "M.Sc. Industrial Engineering" },
      cv11_desc: { de: "Karlsruher Institut für Technologie (KIT)", en: "Karlsruhe Institute of Technology (KIT)" },

      projects_eyebrow: { de: "Nebenprojekte", en: "Side projects" },
      projects_h2: { de: "Weitere Projekte", en: "Other Projects" },
      projects_sub: {
        de: "Studienprojekte und persönliche Projekte, die die Bandbreite meiner Arbeit zeigen.",
        en: "University coursework and personal projects that show the breadth of what I build."
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
      proj2_tag: { de: "Lauf-Analytics & Reporting", en: "running analytics & reporting" },

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
        de: 'Mein Startup — mitgegründet im Dezember 2025. Auch auf der <a href="index.html#work" style="color:var(--accent); font-weight:600;">Startseite</a> zu sehen.',
        en: 'My startup — co-founded in December 2025. Also featured on the <a href="index.html#work" style="color:var(--accent); font-weight:600;">home page</a>.'
      },
      proj6_link: { de: "gradias.ai besuchen →", en: "visit gradias.ai →" }
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
