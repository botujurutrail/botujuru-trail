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

  // Close mobile menu when a nav link is clicked
  const navToggle = document.querySelector("#nav-toggle");
  if (navToggle) {
    document.querySelectorAll("nav.links a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.checked = false;
      });
    });
  }

  // Lotes: highlight the active one and show a countdown
  const loteCards = document.querySelectorAll(".lote-card[data-lote-start]");
  const countdownText = document.querySelector("#countdown-text");
  if (loteCards.length) {
    const now = new Date();
    let active = null;
    let next = null;

    loteCards.forEach((card) => {
      const start = new Date(`${card.dataset.loteStart}T00:00:00`);
      const end = new Date(`${card.dataset.loteEnd}T23:59:59`);
      card.classList.remove("active");
      if (now >= start && now <= end) {
        active = card;
      } else if (now < start && (!next || start < new Date(`${next.dataset.loteStart}T00:00:00`))) {
        next = card;
      }
    });

    if (active) active.classList.add("active");

    if (countdownText) {
      if (active) {
        const end = new Date(`${active.dataset.loteEnd}T23:59:59`);
        const diffDays = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
        countdownText.innerHTML = `<b>${diffDays}d</b> para o fim do lote atual`;
      } else if (next) {
        const start = new Date(`${next.dataset.loteStart}T00:00:00`);
        const diffDays = Math.max(0, Math.ceil((start - now) / (1000 * 60 * 60 * 24)));
        countdownText.innerHTML = `<b>${diffDays}d</b> para abertura das vendas`;
      } else {
        countdownText.innerHTML = "<b>Inscrições encerradas</b>";
      }
    }
  }
});
