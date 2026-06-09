/* ============================================================
   THERAPIST WEBSITE v3 — main.js
   ============================================================ */

const CONFIG = {
  calendlyUrl:      "https://calendly.com/YOUR_USERNAME/free-consult",
  formspreeEndpoint:"https://formspree.io/f/YOUR_FORM_ID",
};

// ── UTILITIES ──────────────────────────────────────────────
function getEl(id) {
  return document.getElementById(id);
}

// ── BOOKING / CALENDLY ─────────────────────────────────────
function openBooking() {
  if (typeof Calendly !== "undefined") {
    Calendly.initPopupWidget({ url: CONFIG.calendlyUrl });
  } else {
    window.open(CONFIG.calendlyUrl, "_blank", "noopener,noreferrer");
  }
}

function initBookingButtons() {
  // Nav, hero, and service-card booking buttons
  ["navBookBtn", "heroBookBtn"].forEach(function(id) {
    var btn = getEl(id);
    if (btn) btn.addEventListener("click", openBooking);
  });

  // All service card "Book a Consultation" buttons
  document.querySelectorAll(".service-book-btn").forEach(function(btn) {
    btn.addEventListener("click", openBooking);
  });
}

// ── NAV SCROLL SHADOW ──────────────────────────────────────
function initNavScroll() {
  var nav = document.querySelector("nav");
  if (!nav) return;
  window.addEventListener("scroll", function() {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });
}

// ── MOBILE NAV ─────────────────────────────────────────────
function initMobileNav() {
  var hamburger = getEl("navHamburger");
  var navLinks  = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;

  var open = false;

  hamburger.addEventListener("click", function() {
    open = !open;
    if (open) {
      navLinks.style.cssText = [
        "display:flex",
        "flex-direction:column",
        "position:absolute",
        "top:70px",
        "left:0",
        "right:0",
        "background:rgba(245,240,232,0.98)",
        "padding:1.5rem 6vw",
        "gap:1.2rem",
        "border-bottom:1px solid #DDD0BC",
        "z-index:199"
      ].join(";");
    } else {
      navLinks.style.cssText = "display:none";
    }
  });

  navLinks.querySelectorAll("a").forEach(function(link) {
    link.addEventListener("click", function() {
      open = false;
      navLinks.style.cssText = "display:none";
    });
  });
}

// ── SCROLL REVEAL ──────────────────────────────────────────
function initScrollReveal() {
  var targets = document.querySelectorAll(
    ".service-card, .specialty-card, .fee-card, .process-step, .credential, .who-card"
  );

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  targets.forEach(function(el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  initBookingButtons();
  initNavScroll();
  initMobileNav();
  initScrollReveal();
});

// ── CALENDLY POPUP SCRIPT ──────────────────────────────────
// To enable the popup, add this before </body> in index.html:
// <script src="https://assets.calendly.com/assets/external/widget.js"></script>