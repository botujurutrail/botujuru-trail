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
});
