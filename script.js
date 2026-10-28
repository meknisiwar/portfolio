const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const copyButton = document.getElementById("copyEmail");
const toast = document.getElementById("toast");
copyButton.addEventListener("click", async () => {
  const email = "sywarmekni@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    toast.textContent = "Adresse e-mail copiée.";
  } catch {
    toast.textContent = "E-mail : " + email;
  }
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
});

const revealItems = document.querySelectorAll(".skill-card, .project-card, .experience, .education-card, .language-card");
revealItems.forEach(item => item.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}


// Animated role/typewriter effect.
const typewriter = document.getElementById("typewriter");
const roles = ["SOC & Incident Response", "SIEM / SOAR Automation", "Network Security", "Penetration Testing"];
let roleIndex = 0, charIndex = roles[0].length, deleting = false;
function typeRole() {
  if (!typewriter || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typewriter.textContent = current.slice(0, charIndex);
    if (charIndex >= current.length) { deleting = true; window.setTimeout(typeRole, 1450); return; }
  } else {
    charIndex--;
    typewriter.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  window.setTimeout(typeRole, deleting ? 28 : 55);
}
if (typewriter && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setTimeout(() => { deleting = true; typeRole(); }, 1500);
}

// Scroll progress bar.
const pageProgress = document.getElementById("pageProgress");
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (pageProgress) pageProgress.style.width = `${progress}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Subtle pointer glow and tilt, only on devices with a fine pointer.
const cursorGlow = document.getElementById("cursorGlow");
if (window.matchMedia("(hover:hover) and (pointer:fine)").matches && cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

// Project category filters.
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".projects-grid .project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
      if (show) {
        card.classList.remove("visible");
        requestAnimationFrame(() => card.classList.add("visible"));
      }
    });
  });
});

// Lightweight animated network particles, no external library required.
const canvas = document.getElementById("cyberCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let particles = [];
function setupCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(55, Math.floor(window.innerWidth / 23));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .28,
    vy: (Math.random() - .5) * .28,
    r: Math.random() * 1.4 + .5
  }));
}
function drawNetwork() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(91,227,182,.55)"; ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 115) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(91,227,182,${(1 - distance / 115) * .13})`;
        ctx.lineWidth = .7; ctx.stroke();
      }
    }
  }
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(drawNetwork);
}
if (canvas && ctx) {
  setupCanvas();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) drawNetwork();
  else requestAnimationFrame(drawNetwork);
  window.addEventListener("resize", setupCanvas, { passive: true });
}
