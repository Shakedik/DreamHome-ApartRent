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

  const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (maxPrice && priceOut) {
    const setOut = () => (priceOut.textContent = `${fmt(maxPrice.value)} ₪`);
    setOut();
    maxPrice.addEventListener("input", () => {
      setOut();
      filterNow();
    });
  }

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

    if (noResults) {
      if (shown === 0) noResults.classList.remove("hidden");
      else noResults.classList.add("hidden");
    }
  }

  btnSearch?.addEventListener("click", filterNow);
  qCity?.addEventListener("keydown", e => {
    if (e.key === "Enter") filterNow();
  });
  minRooms?.addEventListener("change", filterNow);

  btnClear?.addEventListener("click", () => {
    if (qCity) qCity.value = "";
    if (minRooms) minRooms.value = "0";
    if (maxPrice) maxPrice.value = "12000";
    if (priceOut) priceOut.textContent = "12,000 ₪";
    cards.forEach(card => (card.style.display = ""));
    noResults?.classList.add("hidden");
  });
});

// ===============================
// ===== אימות טופס + POPUP =====
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  // יצירת popup דינמי
  const popup = document.createElement("div");
  popup.id = "successPopup";
  popup.innerHTML = `
    <div class="popup-inner">
      <h3>הטופס נשלח בהצלחה! 🎉</h3>
      <p>נחזור אלייך בהקדם האפשרי.</p>
      <button id="closeSuccess">סגור</button>
    </div>
  `;
  document.body.appendChild(popup);

  const closePopup = () => popup.classList.remove("show");

  document.addEventListener("click", e => {
    if (e.target.id === "closeSuccess") closePopup();
    if (e.target.id === "successPopup") closePopup();
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    let valid = true;

    // איפוס שגיאות
    form.querySelectorAll(".error").forEach(el => el.textContent = "");

    // שם
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, "יש להזין שם מלא.");
      valid = false;
    }

    // אימייל
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, "כתובת אימייל לא תקינה.");
      valid = false;
    }

    // הודעה
    if (messageInput.value.trim().length < 5) {
      showError(messageInput, "ההודעה קצרה מדי.");
      valid = false;
    }

    if (!valid) return;

    // הצלחה 🎉
    popup.classList.add("show");
    form.reset();
  });

  function showError(input, msg) {
    let err = input.nextElementSibling;
    if (!err || !err.classList.contains("error")) {
      err = document.createElement("div");
      err.classList.add("error");
      input.insertAdjacentElement("afterend", err);
    }
    err.textContent = msg;
  }
});
