/* ============================================================
   THERAPIST WEBSITE — main.js
   Handles: Calendly popup, contact form submission
   ============================================================ */

// ── CONFIGURATION ──────────────────────────────────────────
// Replace these values with your actual info before going live

const CONFIG = {
  // Paste your Calendly URL here (e.g. https://calendly.com/yourname/consult)
  calendlyUrl: "https://calendly.com/YOUR_USERNAME/free-consult",

  // For the contact form, you can use Formspree (free).
  // 1. Sign up at https://formspree.io
  // 2. Create a form and paste the endpoint URL below
  formspreeEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};


// ── CALENDLY POPUP ─────────────────────────────────────────
// Calendly's embed script must be loaded for this to work.
// Add this line just before </body> in index.html when ready:
// <script src="https://assets.calendly.com/assets/external/widget.js"></script>

function openCalendlyPopup() {
  if (typeof Calendly !== "undefined") {
    Calendly.initPopupWidget({ url: CONFIG.calendlyUrl });
  } else {
    // Fallback: open in new tab if Calendly script isn't loaded yet
    window.open(CONFIG.calendlyUrl, "_blank");
  }
}

const calendlyBtn1 = document.getElementById("openCalendly");
const calendlyBtn2 = document.getElementById("openCalendly2");
const navCtaBtn = document.querySelector(".nav-cta");

if (calendlyBtn1) calendlyBtn1.addEventListener("click", openCalendlyPopup);
if (calendlyBtn2) calendlyBtn2.addEventListener("click", openCalendlyPopup);
if (navCtaBtn)   navCtaBtn.addEventListener("click", openCalendlyPopup);


// ── CONTACT FORM ───────────────────────────────────────────
// Uses Formspree — no backend required, free up to 50 submissions/month.
// For HIPAA compliance, upgrade to a HIPAA-compliant service like:
//   - Hushmail (hushmail.com)
//   - IntakeQ
//   - SimplePractice's built-in intake forms

const submitBtn   = document.getElementById("submitForm");
const formStatus  = document.getElementById("formStatus");

if (submitBtn) {
  submitBtn.addEventListener("click", async () => {
    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic validation
    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields.";
      formStatus.style.color = "var(--clay)";
      return;
    }

    if (!isValidEmail(email)) {
      formStatus.textContent = "Please enter a valid email address.";
      formStatus.style.color = "var(--clay)";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    formStatus.textContent = "";

    try {
      const response = await fetch(CONFIG.formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        formStatus.textContent = "Message sent! I'll be in touch within 1–2 business days.";
        formStatus.style.color = "var(--sage-deep)";
        document.getElementById("name").value    = "";
        document.getElementById("email").value   = "";
        document.getElementById("message").value = "";
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      formStatus.textContent = "Something went wrong. Please try emailing directly.";
      formStatus.style.color = "var(--clay)";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

// ── HELPERS ────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── SMOOTH NAV SCROLL ──────────────────────────────────────
// If you add id anchors to your sections (e.g. id="services"),
// the nav links will scroll smoothly to them automatically
// because of `scroll-behavior: smooth` in the CSS.

// ── SCROLL FADE-IN (optional enhancement) ─────────────────
// Adds a subtle fade-in as sections enter the viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".service-card, .testimonial, .credential").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(16px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(el);
});
