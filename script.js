(() => {
  "use strict";

  const pages = {
    start: "index.html",
    petition: "petition.html",
    spenden: "spenden.html",
    transparenz: "transparenz.html",
  };

  // Keep previously shared links such as /#petition working.
  function redirectLegacyLink() {
    const page = location.hash.slice(1);
    if (Object.hasOwn(pages, page) && page !== document.body.dataset.page) {
      location.replace(new URL(pages[page], location.href));
      return true;
    }
    return false;
  }

  if (redirectLegacyLink()) return;
  window.addEventListener("hashchange", redirectLegacyLink);

  const storageKey = "kuegelibahn-winti-demo-v1";
  const state = { signatures: 0, total: 0, amount: 80 };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    state.signatures = Math.max(0, Math.min(20000, Number(saved.signatures) || 0));
    state.total = Math.max(0, Math.min(1000000, Number(saved.total) || 0));
  } catch {
    // The demo also works when browser storage is unavailable.
  }

  function save() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          signatures: state.signatures,
          total: state.total,
        }),
      );
    } catch {
      // Keep the current page usable without persistent storage.
    }
  }

  function money(value) {
    return "CHF " + Math.round(value).toLocaleString("de-CH");
  }

  function render() {
    document.querySelectorAll("[data-petition-count]").forEach((element) => {
      element.textContent = state.signatures.toLocaleString("de-CH");
    });
    document.querySelectorAll("[data-donation-total]").forEach((element) => {
      element.textContent = money(state.total);
    });
    document.querySelectorAll("[data-progress-bar]").forEach((element) => {
      element.style.width = Math.min(100, (state.total / 5000) * 100) + "%";
    });
    document.querySelectorAll("[data-petition-progress]").forEach((element) => {
      element.style.width = Math.min(100, (state.signatures / 20000) * 100) + "%";
    });

    const chosenAmount = document.getElementById("chosen-amount");
    if (chosenAmount) chosenAmount.textContent = money(state.amount);

    const rewardNote = document.getElementById("reward-note");
    if (rewardNote) {
      rewardNote.textContent =
        state.amount >= 100
          ? "Ab CHF 100: Einladung zum Eröffnungsapéro und eine speziell angefertigte Holzkugel per Post (geplant)."
          : state.amount >= 80
            ? "Ab CHF 80: Einladung zum geplanten Eröffnungsapéro."
            : "Ab CHF 1: Auf Wunsch erhältst du regelmässig Neuigkeiten zum Projekt.";
    }
  }

  // This original browser-styled button keeps its native appearance.
  document.querySelector("[data-go]")?.addEventListener("click", (event) => {
    location.href = pages[event.currentTarget.dataset.go];
  });

  const menu = document.getElementById("menu");
  const navigation = document.getElementById("navlinks");
  menu.addEventListener("click", () => {
    navigation.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(navigation.classList.contains("open")));
  });

  const toast = document.getElementById("toast");
  let toastTimeout;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 3800);
  }

  // Each form is only present on its own page.
  document.getElementById("petition-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    state.signatures++;
    save();
    render();
    document.getElementById("petition-result").classList.add("visible");
    event.currentTarget.reset();
    notify("Demo-Unterschrift gezählt – nichts wurde versendet.");
  });

  const customAmount = document.getElementById("custom-amount");
  document.querySelectorAll("[data-amount]").forEach((button) => {
    button.addEventListener("click", () => {
      state.amount = Number(button.dataset.amount);
      customAmount.value = "";
      document.querySelectorAll("[data-amount]").forEach((option) => {
        option.classList.toggle("selected", option === button);
      });
      render();
    });
  });

  customAmount?.addEventListener("input", (event) => {
    const amount = Number(event.target.value);
    if (amount > 0 && amount <= 100000) {
      state.amount = amount;
      document.querySelectorAll("[data-amount]").forEach((button) => {
        button.classList.remove("selected");
      });
      render();
    }
  });

  document.getElementById("demo-donation")?.addEventListener("click", () => {
    if (!Number.isFinite(state.amount) || state.amount < 1 || state.amount > 100000) {
      notify("Bitte gültigen Betrag auswählen.");
      return;
    }
    state.total += state.amount;
    save();
    render();
    document.getElementById("donation-result").classList.add("visible");
    notify("Nur simuliert: Es wurde kein Geld überwiesen.");
  });

  function shareUrl(page) {
    return new URL(pages[page], location.href).href;
  }

  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", () => {
      const message =
        "Schau dir dieses Kügelibahn-Projekt für Winterthur an: " + shareUrl(button.dataset.share);
      if (button.dataset.shareKind === "email") {
        location.href =
          "mailto:?subject=" +
          encodeURIComponent("Kügelibahn für Winterthur") +
          "&body=" +
          encodeURIComponent(message);
      } else {
        window.open(
          "https://wa.me/?text=" + encodeURIComponent(message),
          "_blank",
          "noopener,noreferrer",
        );
      }
    });
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const url = shareUrl("start");
      try {
        await navigator.clipboard.writeText(url);
        notify("Link kopiert!");
      } catch {
        notify("Link: " + url);
      }
    });
  });

  render();
})();
