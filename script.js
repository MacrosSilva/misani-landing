// =========================================================================
// CONFIGURAÇÃO DO NEGÓCIO — ponto único de edição.
// Troque os valores abaixo pelos dados reais do MISANI antes de divulgar o site.
// =========================================================================
const BUSINESS = {
  whatsapp: "5575000000000",              // TODO: número real, formato 55 + DDD + número (só dígitos)
  whatsappDisplay: "(75) 00000-0000",     // TODO: número formatado para exibição
  instagramUrl: "https://www.instagram.com/misaninailspa/",
  instagramHandle: "@misaninailspa",
  email: "contato@misaninailspa.com.br",  // TODO: confirmar e-mail real
  addressLines: ["Feira de Santana — BA", "Endereço completo a confirmar"], // TODO: endereço real
  hours: "Terça a Sábado, 9h às 19h",     // TODO: confirmar horário real
};

function waLink(message) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // ---- wire up every WhatsApp CTA with the configured number + message ----
  document.querySelectorAll(".js-wa").forEach((el) => {
    const msg = el.dataset.waMsg || "Olá! Gostaria de agendar um horário no MISANI.";
    el.href = waLink(msg);
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll(".js-instagram").forEach((el) => {
    el.href = BUSINESS.instagramUrl;
  });

  const footWhatsapp = document.getElementById("footWhatsapp");
  if (footWhatsapp) footWhatsapp.textContent = BUSINESS.whatsappDisplay;

  const footInstagram = document.getElementById("footInstagram");
  if (footInstagram) footInstagram.textContent = BUSINESS.instagramHandle;

  const footEmail = document.getElementById("footEmail");
  if (footEmail) {
    footEmail.textContent = BUSINESS.email;
    footEmail.href = `mailto:${BUSINESS.email}`;
  }

  const footAddress = document.getElementById("footAddress");
  if (footAddress) {
    footAddress.innerHTML = "";
    [...BUSINESS.addressLines, BUSINESS.hours].forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      footAddress.appendChild(li);
    });
  }

  // ---- header shadow/blur on scroll ----
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---- mobile menu ----
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    navToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  // ---- word cycler in hero ----
  const cycler = document.getElementById("wordCycler");
  if (cycler) {
    const words = ["cuidado.", "estúdio.", "olhar.", "ritual."];
    let i = 0;
    const makeWord = (text, cls) => {
      const span = document.createElement("span");
      span.className = `w ${cls}`;
      span.textContent = text;
      return span;
    };
    let current = makeWord(words[0], "active");
    cycler.appendChild(current);
    setInterval(() => {
      i = (i + 1) % words.length;
      const next = makeWord(words[i], "");
      cycler.appendChild(next);
      requestAnimationFrame(() => {
        current.classList.remove("active");
        current.classList.add("leave");
        next.classList.add("active");
      });
      setTimeout(() => {
        current.remove();
        current = next;
      }, 700);
    }, 2600);
  }

  // ---- reveal on scroll ----
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // ---- FAQ accordion ----
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((el) => el.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });
});
