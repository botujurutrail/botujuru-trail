document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.querySelector("#year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-q");
    if (!question) return;
    question.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((open) => open.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Show "Kit Experience Encerrado" rows only after their cutoff date has passed
  document.querySelectorAll(".price-encerrado[data-hide-until]").forEach((row) => {
    const hideUntil = new Date(`${row.dataset.hideUntil}T23:59:59`);
    if (new Date() > hideUntil) {
      row.style.display = "";
    }
  });

  // Close mobile menu when a nav link is clicked
  const navToggle = document.querySelector("#nav-toggle");
  if (navToggle) {
    document.querySelectorAll("nav.links a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.checked = false;
      });
    });
  }

  // Lotes: highlight the active one and run a live countdown
  const loteCards = document.querySelectorAll(".lote-card[data-lote-start]");
  const countdownText = document.querySelector("#countdown-text");

  function formatDate(date) {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  function tickLotes() {
    const now = new Date();
    let active = null;
    let next = null;

    loteCards.forEach((card) => {
      const start = new Date(`${card.dataset.loteStart}T00:00:00`);
      const end = new Date(`${card.dataset.loteEnd}T23:59:59`);
      card.classList.remove("active");

      const status = card.querySelector(".lote-status");
      if (now >= start && now <= end) {
        active = { card, start, end };
        if (status) {
          status.className = "lote-status is-active";
          status.textContent = `Fecha em ${formatDuration(end - now)}`;
        }
      } else if (now < start) {
        if (!next || start < next.start) next = { card, start };
      } else if (status) {
        status.className = "lote-status is-closed";
        status.textContent = "Encerrado";
      }
    });

    if (active) active.card.classList.add("active");

    if (next) {
      const status = next.card.querySelector(".lote-status");
      if (status) {
        status.className = "lote-status is-next";
        status.textContent = `Abre em ${formatDate(next.start)}`;
      }
    }

    if (countdownText) {
      if (active) {
        countdownText.innerHTML = `<b>${formatDuration(active.end - now)}</b> para o fim do lote atual`;
      } else if (next) {
        countdownText.innerHTML = `<b>${formatDuration(next.start - now)}</b> para abertura das vendas`;
      } else {
        countdownText.innerHTML = "<b>Inscrições encerradas</b>";
      }
    }
  }

  if (loteCards.length) {
    tickLotes();
    setInterval(tickLotes, 1000);
  }

  // Route map (percurso section): illustrated trace built from real GPX data,
  // toggle against the official map photo, hydration/medical markers, elevation profile.
  const routeMapEl = document.querySelector("#route-map");
  if (routeMapEl) {
    const ROUTES = {
      "6": {
        d: "M64.2,25 L64.9,124.9 L136.7,238.9 L198.9,323 L281.8,318.7 L288.5,416.3 L320.4,436.4 L335.8,541.1 L324.1,563.6 L240.3,573.4 L186.4,568.5 L189.1,552.9 L188.8,549.2 L190.8,547.4 L193,545.1 L194.8,542.7 L196.8,540.8 L199.2,538.4 L201.2,536.1 L202.8,533.1 L204.9,529.6 L205.7,527 L206.4,524.5 L207.2,521.9 L208,518.7 L207.8,515.7 L207.3,512.4 L207,508.1 L207.9,503.5 L209.4,498.7 L210.8,494.3 L212,490.2 L213.1,485.8 L214,481 L215.2,476.2 L215.9,471.2 L216.9,466 L217.1,461.3 L217.7,456.2 L218.2,450.7 L218.5,445.4 L218.7,440.2 L219.3,435.5 L219.5,431.5 L218.1,430.2 L215.8,429.8 L213.7,428.8 L211.1,428.1 L209.2,425.8 L208.7,423 L208.9,420.8 L209.9,419.3 L211.9,417.2 L213.2,414.8 L213.3,412.6 L213.2,410.4 L212.3,408.4 L211.1,407.4 L136.3,361.8 L111.6,355.4 L112.7,352.4 L116.1,356.2 L118.4,360.5 L119.2,365.3 L118.4,370.6 L116.7,375.7 L115,380.1 L113.2,384.4 L111.9,389.3 L110.3,394 L108.8,398 L107,401.6 L105.8,405.4 L104.7,409.4 L102.8,413.4 L100.1,417.9 L97.1,423.5 L94.5,428.6 L92.1,434.8 L91,440.6 L90.7,442.2 L90.6,442 L90,444.4 L89.8,448.5 L89.7,453 L90.1,456.9 L91.6,460.6 L94.7,464.2 L98,467.3 L102.1,469.1 L106.3,469.2 L109.9,468 L113.1,466.5 L116.2,465.3 L119.7,464.8 L123.2,465.4 L127.1,467.6 L130.4,470.9 L132.5,474.9 L141.3,476 L202.5,505.5 L199.9,575 L316.3,422.7 L279.9,355.7 L238,227.4 L169.9,190 L140.9,108.7 L128.9,82.1 L78.6,114.4 L69.8,82.2 L69.9,27.8",
        start: [64.2, 25],
        gain: "207 m",
        eleMax: 842,
        eleMin: 755,
        eleEnd: "6,00 km",
        road: { x1: 20, y1: 415, x2: 380, y2: 405 },
        water: [{ x: 99.9, y: 418.2 }],
        photo: "assets/img/mapa-percurso-6km.jpg",
        gpx: "assets/docs/percurso-6km-botujuru-trail-2026.gpx",
        gpxLabel: "6 km",
        spark: [842, 810, 776, 755, 775, 782, 781, 781, 783, 786, 790, 794, 800, 804, 808, 812, 814, 810, 807, 806, 807, 807, 806, 805, 805, 781, 779, 783, 780, 778, 777, 776, 772, 767, 762, 761, 760, 762, 764, 766, 771, 775, 777, 783, 774, 812, 833, 841],
      },
      "12": {
        d: "M58.8,28.5 L59.5,37.9 L64,51.6 L60.1,63.6 L63.6,78.2 L69.9,80.7 L80.6,68.2 L98.8,60.7 L111.6,67.2 L110.6,78.1 L113.4,98.6 L120.9,120.8 L138.1,136.7 L153.8,147.4 L172.3,143.1 L190.6,142.3 L205.9,151.8 L223.7,151.6 L234,134.4 L237.4,115.4 L256.2,111.2 L278.7,115.1 L299.1,122.1 L318.6,130.5 L324.2,151.5 L337,146.8 L341.2,143.8 L329.3,152.8 L322.9,144 L320.2,131.4 L307.6,123.4 L295.4,117.9 L282,114.9 L263.6,115.1 L244.6,112.4 L231.5,132.9 L222.4,154.5 L202.2,148.7 L184,141.5 L171.5,146.5 L184.5,167 L201,188.2 L214.6,206.7 L213.2,226.8 L199.2,228.9 L193.4,242.4 L201.7,266.8 L221.5,271.7 L225.9,293.4 L230.4,316.1 L235,338.9 L227.6,359.1 L208.9,366.9 L195.5,365.6 L181.2,367.4 L165.8,369.8 L150.7,372.2 L141.3,360.8 L149.3,350.1 L155.2,336.8 L158.5,324.9 L160.4,311.8 L161.4,290.8 L157,276.6 L155.7,264.8 L149.6,262.4 L138.8,258.3 L129.9,250.6 L118.9,241.4 L111.8,232 L98.1,228.6 L83.5,222.9 L93.1,233.1 L94,251.8 L84.5,271.9 L76.7,295.1 L94.9,302.3 L104.7,303.5 L111,304.8 L116.5,315.2 L126.8,318.8 L140.8,318.4 L149,326.1 L158.4,315.3 L153.2,333.9 L145.7,351.1 L139.9,363.2 L132.9,367.9 L129.9,382.5 L125.7,396.8 L112.1,415.7 L112.3,438.9 L104.5,453.4 L105.6,469.1 L113.1,486 L94.6,501.4 L91.1,512.9 L104.2,514.3 L121.9,518.6 L133.2,524.1 L139.3,536.9 L148.7,547.5 L155.9,559.5 L169.9,557.5 L181.4,574.1 L193.6,575 L198.5,555.3 L217.9,547.7 L232.3,537.2 L243.9,524.6 L251.1,513.2 L253.3,507.4 L259.6,498.7 L261.7,477.6 L240.8,467.4 L249.7,448 L253,429.8 L243,408.2 L224.7,392.7 L202.7,382.9 L213.6,369.3 L230.3,357.6 L234,333.2 L228.3,311.8 L226.1,287.5 L221.4,269.5 L234,263.7 L246.8,276.9 L251.9,299.7 L257.2,321.5 L269.3,339.6 L283.1,350.2 L284.6,349.8 L271.1,338.8 L258.8,327.6 L256.1,309.5 L253.5,287.9 L245.3,267.7 L224.8,265.3 L216.8,267 L202.1,265.8 L195.9,259.6 L197.8,233.5 L202.6,219.8 L204.6,205.7 L196.2,199.7 L190.2,213 L186.1,223.5 L176.2,228.2 L165.6,222.7 L154.8,216.7 L145.6,210.3 L141.6,198.9 L134.2,188.4 L124,179.7 L115.9,170.4 L107,160.6 L99,149.8 L91.3,130.7 L83,118.4 L73.6,107.2 L59.1,90.2 L59.8,67 L63.1,45.3 L60.4,25 L59.4,25",
        start: [58.8, 28.5],
        gain: "523 m",
        eleMax: 848,
        eleMin: 737,
        eleEnd: "11,82 km",
        road: { x1: 20, y1: 220, x2: 380, y2: 205 },
        water: [
          { x: 83.8, y: 220 },
          { x: 224.4, y: 545.8 },
        ],
        photo: "assets/img/mapa-percurso-12km.jpg",
        gpx: "assets/docs/percurso-12km-botujuru-trail-2026.gpx",
        gpxLabel: "12 km",
        spark: [848, 838, 816, 812, 783, 773, 791, 789, 788, 792, 797, 774, 771, 755, 737, 758, 788, 757, 820, 822, 778, 766, 758, 781, 811, 785, 794, 783, 771, 769, 793, 790, 787, 748, 752, 747, 755, 755, 756, 763, 759, 769, 782, 792, 826, 831, 839, 836],
      },
    };

    const svgNS = "http://www.w3.org/2000/svg";
    let currentKm = "12";

    const pathEl = routeMapEl.querySelector("#route-map-path");
    const startEl = routeMapEl.querySelector("#route-map-start");
    const startRingEl = routeMapEl.querySelector("#route-map-start-ring");
    const roadG = routeMapEl.querySelector("#route-map-road");
    const waterG = routeMapEl.querySelector("#route-map-water");
    const medicG = routeMapEl.querySelector("#route-map-medic");
    const arrowsG = routeMapEl.querySelector("#route-map-arrows");
    const photoImg = routeMapEl.querySelector("#route-map-photo");
    // These now live in .route-card (quick facts column), not inside #route-map.
    const gainEl = document.querySelector("#route-map-gain");
    const eleMaxEl = document.querySelector("#route-map-ele-max");
    const eleMinEl = document.querySelector("#route-map-ele-min");
    const eleEndEl = document.querySelector("#route-map-ele-end");
    const sparkEl = document.querySelector("#route-map-spark");
    const sparkLineEl = document.querySelector("#route-map-spark-line");
    const eleKmEl = document.querySelector("#route-map-elev-km");
    const downloadLink = document.querySelector("#route-map-download");
    const downloadLabel = document.querySelector("#route-map-download-label");

    function waterIconMarkup() {
      return '<circle r="9"/><path d="M0 -6c2.2 2.8 3.6 4.6 3.6 6.6a3.6 3.6 0 1 1-7.2 0c0-2 1.4-3.8 3.6-6.6z"/>';
    }
    function medicIconMarkup() {
      return '<circle r="8"/><path d="M-1.4 -5.4h2.8v3.6h3.6v2.8h-3.6v3.6h-2.8v-3.6h-3.6v-2.8h3.6v-3.6z"/>';
    }

    function drawRoute(key) {
      const route = ROUTES[key];
      if (!route) return;

      pathEl.setAttribute("d", route.d);
      // restart the draw-in animation
      pathEl.style.animation = "none";
      // eslint-disable-next-line no-unused-expressions
      pathEl.getBoundingClientRect();
      pathEl.style.animation = null;

      startEl.setAttribute("cx", route.start[0]);
      startEl.setAttribute("cy", route.start[1]);
      startRingEl.setAttribute("cx", route.start[0]);
      startRingEl.setAttribute("cy", route.start[1]);

      if (gainEl) gainEl.textContent = route.gain;
      if (eleMaxEl) eleMaxEl.textContent = route.eleMax + " m";
      if (eleMinEl) eleMinEl.textContent = route.eleMin + " m";
      if (eleEndEl) eleEndEl.textContent = route.eleEnd;
      if (eleKmEl) eleKmEl.textContent = route.gpxLabel;
      if (downloadLabel) downloadLabel.textContent = route.gpxLabel;
      if (downloadLink) downloadLink.setAttribute("href", route.gpx);
      if (photoImg) photoImg.setAttribute("src", route.photo);

      medicG.setAttribute("class", "route-map-poi-medic");
      medicG.setAttribute("transform", `translate(${route.start[0] + 18},${route.start[1] - 2})`);
      medicG.innerHTML = medicIconMarkup();

      roadG.innerHTML = `
        <line class="route-map-road" x1="${route.road.x1}" y1="${route.road.y1}" x2="${route.road.x2}" y2="${route.road.y2}"/>
        <line class="route-map-road-center" x1="${route.road.x1}" y1="${route.road.y1}" x2="${route.road.x2}" y2="${route.road.y2}"/>
        <text class="route-map-road-tag" x="${route.road.x1 + 4}" y="${route.road.y1 - 8}">SP-021</text>
      `;

      waterG.innerHTML = "";
      route.water.forEach((w) => {
        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("class", "route-map-poi-water");
        g.setAttribute("transform", `translate(${w.x},${w.y})`);
        g.innerHTML = waterIconMarkup();
        waterG.appendChild(g);
      });

      if (sparkEl && sparkLineEl) {
        const min = route.eleMin;
        const max = route.eleMax;
        const w = 380;
        const h = 70;
        const pad = 3;
        const pts = route.spark.map((v, i) => {
          const x = (i / (route.spark.length - 1)) * w;
          const y = h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
          return x.toFixed(1) + "," + y.toFixed(1);
        });
        sparkLineEl.setAttribute("points", pts.join(" "));
        sparkEl.setAttribute("points", "0," + h + " " + pts.join(" ") + " " + w + "," + h);
      }

      requestAnimationFrame(() => {
        const len = pathEl.getTotalLength();
        arrowsG.innerHTML = "";
        const arrowFracs = [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82, 0.94];
        arrowFracs.forEach((f) => {
          const p = pathEl.getPointAtLength(len * f);
          const p2 = pathEl.getPointAtLength(Math.min(len, len * f + 2));
          const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
          const tri = document.createElementNS(svgNS, "polygon");
          tri.setAttribute("points", "-5,-4 5,0 -5,4");
          tri.setAttribute("class", "route-map-arrow");
          tri.setAttribute("transform", `translate(${p.x},${p.y}) rotate(${angle})`);
          arrowsG.appendChild(tri);
        });
      });
    }

    routeMapEl.querySelectorAll(".route-map-toggle-km button").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentKm = btn.dataset.km;
        routeMapEl.querySelectorAll(".route-map-toggle-km button").forEach((b) => b.classList.toggle("active", b === btn));
        drawRoute(currentKm);
      });
    });

    const svgEl = routeMapEl.querySelector("#route-map-svg");
    const photoNote = routeMapEl.querySelector("#route-map-photo-note");
    routeMapEl.querySelectorAll(".route-map-toggle-view button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        routeMapEl.querySelectorAll(".route-map-toggle-view button").forEach((b) => b.classList.toggle("active", b === btn));
        if (svgEl) svgEl.style.display = view === "illust" ? "block" : "none";
        if (photoImg) photoImg.hidden = view !== "photo";
        if (photoNote) photoNote.hidden = view !== "photo";
      });
    });

    drawRoute(currentKm);
  }
});
