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
  // Estrutura usada para calcular "aberto agora" e o schema.org JSON-LD.
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
    if (text) text.textContent = open ? "Aberto agora" : "Fechado no momento";
  });
}

// ---- schema.org LocalBusiness (SEO) a partir dos dados reais do negócio ----
function injectStructuredData() {
  const scheduleLd = BUSINESS.schedule.map((rule) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: rule.days.map(
      (d) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d]
    ),
    opens: rule.open,
    closes: rule.close,
  }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "MISANI Nail Spa & Design",
    email: BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.addressLines[0],
      addressLocality: "Feira de Santana",
      addressRegion: "BA",
      addressCountry: "BR",
    },
    telephone: `+${BUSINESS.whatsapp}`,
    sameAs: [BUSINESS.instagramUrl],
    openingHoursSpecification: scheduleLd,
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

// ---- barra de progresso de leitura ----
function initScrollProgress() {
  const bar = document.createElement("div");
  bar.id = "scrollProgress";
  document.body.appendChild(bar);
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = max > 0 ? `${(scrolled / max) * 100}%` : "0%";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ---- botões com efeito magnético (seguem o cursor sutilmente) ----
function initMagneticButtons() {
  if (PREFERS_REDUCED_MOTION) return;
  if (window.matchMedia("(hover: none)").matches) return; // toque: sem cursor pra "seguir", e sem mouseleave garantido pra desfazer o transform
  document.querySelectorAll(".btn.magnetic").forEach((btn) => {
    const strength = 0.35;
    btn.addEventListener("mouseenter", () => btn.classList.add("is-tracking"));
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.classList.remove("is-tracking");
      btn.style.transform = "";
    });
  });
}

// ---- leve parallax do visual do hero ao mover o mouse ----
function initHeroParallax() {
  if (PREFERS_REDUCED_MOTION) return;
  const hero = document.querySelector(".hero");
  const media = document.querySelector(".hero-media");
  const glow = document.querySelector(".hero-glow");
  if (!hero || !media) return;
  if (window.matchMedia("(hover: none)").matches) return; // sem parallax em touch
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    media.style.transform = `translate3d(${px * -14}px, ${py * -10}px, 0)`;
    if (glow) glow.style.transform = `translate3d(${px * 20}px, ${py * 20}px, 0)`;
  });
  hero.addEventListener("mouseleave", () => {
    media.style.transform = "";
    if (glow) glow.style.transform = "";
  });
}

// ---- tilt 3D + lightbox na galeria ----
function initGallery() {
  const items = document.querySelectorAll(".g-item");
  if (!items.length) return;

  items.forEach((item) => {
    const hint = document.createElement("span");
    hint.className = "zoom-hint";
    hint.innerHTML =
      '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>';
    item.appendChild(hint);

    if (!PREFERS_REDUCED_MOTION && !window.matchMedia("(hover: none)").matches) {
      item.addEventListener("mousemove", (e) => {
        const r = item.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        item.style.transform = `translateY(-4px) rotateX(${py * -8}deg) rotateY(${px * 8}deg)`;
      });
      item.addEventListener("mouseleave", () => {
        item.style.transform = "";
      });
    }
  });

  // ---- lightbox ----
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <img src="" alt="">
      <span class="lightbox-tag"></span>
      <button class="lightbox-close" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    </div>`;
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector("img");
  const lbTag = lightbox.querySelector(".lightbox-tag");
  const lbClose = lightbox.querySelector(".lightbox-close");

  const openLightbox = (item) => {
    const img = item.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbTag.textContent = item.dataset.tag || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  items.forEach((item) => item.addEventListener("click", () => openLightbox(item)));
  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
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

  updateStatusBadges();
  setInterval(updateStatusBadges, 60000);
  injectStructuredData();
  initScrollProgress();
  initMagneticButtons();
  initHeroParallax();
  initGallery();

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
  if (cycler && !cycler.dataset.cyclerInit) {
    cycler.dataset.cyclerInit = "1";
    const words = ["cuidado.", "estúdio.", "olhar.", "ritual."];
    let i = 0;
    const makeWord = (text, cls) => {
      const span = document.createElement("span");
      span.className = `w ${cls}`;
      span.textContent = text;
      return span;
    };
    cycler.appendChild(makeWord(words[0], "active"));

    // Encadeamento auto-agendado (em vez de setInterval) para que o próximo
    // ciclo só comece depois que o atual terminar de verdade — nunca há dois
    // ciclos sobrepostos. O elemento "current" é sempre lido do DOM (nunca
    // uma variável presa em closure), então mesmo que um frame seja perdido
    // (aba em segundo plano, thread ocupada), o próximo ciclo se autocorrige.
    const tick = () => {
      const current = cycler.querySelector(".w.active") || cycler.lastElementChild;
      i = (i + 1) % words.length;
      const next = makeWord(words[i], "");
      cycler.appendChild(next);
      requestAnimationFrame(() => {
        if (current && current !== next) {
          current.classList.remove("active");
          current.classList.add("leave");
        }
        next.classList.add("active");
      });
      setTimeout(() => {
        cycler.querySelectorAll(".w").forEach((el) => {
          if (el !== next) el.remove();
        });
        setTimeout(tick, 1900);
      }, 700);
    };
    setTimeout(tick, 2600);
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
      { threshold: 0.15, rootMargin: "200px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));

    // Rede de segurança: em saltos de rolagem muito rápidos (ex.: arrastar a
    // barra de rolagem, "End"/Page Down repetido), o IntersectionObserver pode
    // pular a transição de um elemento sem nunca reportá-lo como visível,
    // deixando a seção em branco (opacity/blur presos) para sempre. Garante
    // que qualquer .reveal já dentro (ou já ultrapassado) da viewport apareça.
    const revealFallback = () => {
      const remaining = document.querySelectorAll(".reveal:not(.in)");
      if (!remaining.length) {
        window.removeEventListener("scroll", revealFallback);
        return;
      }
      remaining.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add("in");
      });
    };
    window.addEventListener("scroll", revealFallback, { passive: true });
    revealFallback();
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
