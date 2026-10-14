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
  hours: "Terça a sábado, 9h às 19h",     // TODO: confirmar horário real
  // Usado para calcular "aberto agora" e o schema.org JSON-LD.
  // days: 0=domingo ... 6=sábado. Ajuste para o horário real antes de publicar.
  schedule: [
    { days: [2, 3, 4, 5, 6], open: "09:00", close: "19:00" }, // terça a sábado
  ],
};

const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function waLink(message) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

// ---- "aberto agora" a partir de BUSINESS.schedule ----
function isOpenNow(date = new Date()) {
  const day = date.getDay();
  const minutes = date.getHours() * 60 + date.getMinutes();
  return BUSINESS.schedule.some((rule) => {
    if (!rule.days.includes(day)) return false;
    const [openH, openM] = rule.open.split(":").map(Number);
    const [closeH, closeM] = rule.close.split(":").map(Number);
    return minutes >= openH * 60 + openM && minutes < closeH * 60 + closeM;
  });
}

function updateStatusBadges() {
  const open = isOpenNow();
  document.querySelectorAll(".status-badge").forEach((badge) => {
    badge.classList.toggle("is-open", open);
    badge.classList.toggle("is-closed", !open);
    const text = badge.querySelector(".status-text");
    if (text) text.textContent = open ? "Aberto agora" : "Fechado agora";
  });
}

// ---- schema.org LocalBusiness (SEO local) ----
function injectStructuredData() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "MISANI Nail Spa & Design",
    email: BUSINESS.email,
    telephone: `+${BUSINESS.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.addressLines[0],
      addressLocality: "Feira de Santana",
      addressRegion: "BA",
      addressCountry: "BR",
    },
    sameAs: [BUSINESS.instagramUrl],
    openingHoursSpecification: BUSINESS.schedule.map((rule) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: rule.days.map(
        (d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]
      ),
      opens: rule.open,
      closes: rule.close,
    })),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

// ---- links de contato + rodapé ----
function wireContacts() {
  document.querySelectorAll(".js-wa").forEach((el) => {
    el.href = waLink(el.dataset.waMsg || "Olá! Gostaria de agendar um horário no MISANI.");
    el.target = "_blank";
    el.rel = "noopener";
    // Evento de conversão — aproveitado automaticamente se GA4/GTM/Meta Pixel forem instalados.
    el.addEventListener("click", () => {
      const label = el.textContent.trim() || "whatsapp";
      (window.dataLayer = window.dataLayer || []).push({ event: "whatsapp_click", label });
      if (typeof window.fbq === "function") window.fbq("track", "Contact");
    });
  });

  document.querySelectorAll(".js-instagram").forEach((el) => (el.href = BUSINESS.instagramUrl));

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
    return el;
  };
  setText("footWhatsapp", BUSINESS.whatsappDisplay);
  setText("footInstagram", BUSINESS.instagramHandle);
  const email = setText("footEmail", BUSINESS.email);
  if (email) email.href = `mailto:${BUSINESS.email}`;

  const footAddress = document.getElementById("footAddress");
  if (footAddress) {
    [...BUSINESS.addressLines, BUSINESS.hours].forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      footAddress.appendChild(li);
    });
  }

  const finalInfo = document.getElementById("finalInfo");
  if (finalInfo) {
    const pin = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';
    const clock = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>';
    [[pin, BUSINESS.addressLines[0]], [clock, BUSINESS.hours]].forEach(([icon, text]) => {
      const li = document.createElement("li");
      li.innerHTML = icon;
      li.appendChild(document.createTextNode(text));
      finalInfo.appendChild(li);
    });
  }
}

// ---- header, barra de progresso e CTAs fixos ----
function initScrollUi() {
  const header = document.getElementById("siteHeader");
  const bar = document.createElement("div");
  bar.id = "scrollProgress";
  document.body.appendChild(bar);

  const mobileBar = document.getElementById("mobileCtaBar");
  const fab = document.getElementById("fabWhatsapp");
  const hero = document.querySelector(".hero");
  const finalCta = document.getElementById("contato");

  // CTAs fixos só aparecem depois que o CTA do hero saiu da tela, e somem no CTA final
  // (evita dois botões iguais competindo na mesma tela).
  let pastHero = false;
  let atFinal = false;
  const syncFloating = () => {
    const show = pastHero && !atFinal;
    mobileBar && mobileBar.classList.toggle("show", show);
    fab && fab.classList.toggle("show", show);
  };
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; syncFloating(); }, { rootMargin: "-40% 0px 0px 0px" }).observe(hero);
    if (finalCta) new IntersectionObserver(([e]) => { atFinal = e.isIntersecting; syncFloating(); }, { threshold: 0.35 }).observe(finalCta);
  } else {
    pastHero = true;
    syncFloating();
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
      header.classList.toggle("scrolled", window.scrollY > 20);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ---- menu mobile ----
function initMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");
  if (!toggle || !menu) return;
  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
}

// ---- reveal on scroll ----
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || PREFERS_REDUCED_MOTION) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));

  // Rede de segurança: em saltos de rolagem muito rápidos o IntersectionObserver pode
  // nunca reportar um elemento como visível, deixando a seção invisível para sempre.
  const fallback = () => {
    const remaining = document.querySelectorAll(".reveal:not(.in)");
    if (!remaining.length) return window.removeEventListener("scroll", fallback);
    remaining.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
    });
  };
  window.addEventListener("scroll", fallback, { passive: true });
}

// ---- FAQ ----
function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ---- lightbox da galeria ----
function initGallery() {
  const items = document.querySelectorAll(".g-item");
  if (!items.length) return;
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML =
    '<img src="" alt=""><button class="lightbox-close" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  document.body.appendChild(lightbox);
  const img = lightbox.querySelector("img");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const close = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };
  items.forEach((item) => {
    item.tabIndex = 0;
    item.setAttribute("role", "button");
    const open = () => {
      const src = item.querySelector("img");
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };
    item.addEventListener("click", open);
    item.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), open()));
  });
  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => e.target === lightbox && close());
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());
}

document.addEventListener("DOMContentLoaded", () => {
  wireContacts();
  updateStatusBadges();
  setInterval(updateStatusBadges, 60000);
  injectStructuredData();
  initScrollUi();
  initMobileMenu();
  initReveal();
  initFaq();
  initGallery();
});
