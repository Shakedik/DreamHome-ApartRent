// ===== ניהול תפריט במובייל =====
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", () => links.classList.toggle("show"));
  }
});

// ===== פילטרים לדירות =====
document.addEventListener("DOMContentLoaded", () => {
  const qCity = document.getElementById("qCity");
  const maxPrice = document.getElementById("maxPrice");
  const priceOut = document.getElementById("priceOut");
  const minRooms = document.getElementById("minRooms");
  const btnSearch = document.getElementById("doSearch");
  const btnClear = document.getElementById("clearFilters");
  const cardsWrap = document.getElementById("cards");
  const noResults = document.getElementById("noResults");

  if (!cardsWrap) return;
  const cards = Array.from(cardsWrap.querySelectorAll(".apartment-card"));

  // עיצוב מספר יפה ל־₪
  const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // עדכון תווית מחיר בזמן גרירה
  if (maxPrice && priceOut) {
    const setOut = () => (priceOut.textContent = `${fmt(maxPrice.value)} ₪`);
    setOut();
    maxPrice.addEventListener("input", () => {
      setOut();
      filterNow();
    });
  }

  // לוגיקה של סינון
  function filterNow() {
    const cityQuery = (qCity?.value || "").trim();
    const max = Number(maxPrice?.value || 12000);
    const roomsMin = Number(minRooms?.value || 0);

    let shown = 0;

    cards.forEach(card => {
      const city = (card.dataset.city || "").trim();
      const rooms = Number(card.dataset.rooms || 0);
      const price = Number(card.dataset.price || 0);

      const byCity =
        cityQuery === "" ||
        city.includes(cityQuery) ||
        city.toLowerCase().includes(cityQuery.toLowerCase());

      const byRooms = rooms >= roomsMin;
      const byPrice = price <= max;

      const ok = byCity && byRooms && byPrice;

      card.style.display = ok ? "" : "none";
      if (ok) shown += 1;
    });

    // הודעת אין תוצאות
    if (noResults) {
      if (shown === 0) noResults.classList.remove("hidden");
      else noResults.classList.add("hidden");
    }
  }

  // אירועים
  btnSearch?.addEventListener("click", filterNow);
  qCity?.addEventListener("keydown", e => {
    if (e.key === "Enter") filterNow();
  });
  minRooms?.addEventListener("change", filterNow);

  // ניקוי מסננים
  btnClear?.addEventListener("click", () => {
    if (qCity) qCity.value = "";
    if (minRooms) minRooms.value = "0";
    if (maxPrice) maxPrice.value = "12000";
    if (priceOut) priceOut.textContent = "12,000 ₪";
    cards.forEach(card => (card.style.display = ""));
    noResults?.classList.add("hidden");
  });
});
