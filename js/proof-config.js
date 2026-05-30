/* ============================================================
   PROOF CONFIG  —  edit this file for each new client.
   To start a new client: copy this file, change the values,
   point `layouts[].img` at your new images, and load it from
   index.html. Nothing else needs to change.
   ============================================================ */
window.PROOF_CONFIG = {
  // --- Client / project ---
  clientName:   "Jerry Thomas Foundation",
  projectName:  "Jerry Thomas Foundation for Music and Arts",
  // The headline is split so the second word can be colored orange.
  headline:     { lead: "Jerry Thomas", accent: "Foundation" },
  designType:   "33 × 80 Retractable Banner",
  proofSpecs:   "33 × 80 Retractable Banner",

  // --- Layout options (proof images) ---
  // imgFallback shows if the main image fails to load.
  layouts: [
    { id: "01", label: "Layout 01", env: "Studio",    tone: "Light", note: "", img: "./assets/proofs/jerry-thomas-foundation/layout-01.jpg" },
    { id: "02", label: "Layout 02", env: "Studio",    tone: "Dark",  note: "", img: "./assets/proofs/jerry-thomas-foundation/layout-02.jpg" },
    { id: "03", label: "Layout 03", env: "Sanctuary", tone: "Light", note: "", img: "./assets/proofs/jerry-thomas-foundation/layout-03.jpg" },
    { id: "04", label: "Layout 04", env: "Sanctuary", tone: "Dark",  note: "", img: "./assets/proofs/jerry-thomas-foundation/layout-04.jpg" },
  ],

  // --- Policy / legal copy ---
  directions:  "Please confirm colors, spelling, and verbiage. Select the one layout you prefer below.",
  revisionPolicy: "Design includes 2 sets of revisions; additional fees apply afterward. Upon approval we are <span class=\"o\">not</span> responsible for errors in content, and fees apply if graphics need to be reprinted.",
  disclaimer: "By submitting, I confirm I am authorized to approve this design and that my typed name and the date above act as my electronic signature, which I intend to be legally binding.",

  // --- Designer / business contact ---
  contact: {
    phone:   "240-681-9875",
    email:   "designer@raionadenise.com",
    website: "www.RAIONADENISE.com",
    instagram: "@raionadenise",
    tagline: "Bringing Vision to Reality",
  },

  // --- Watermark (per project) ---
  watermark: {
    enabled: true,      // set false to turn off for this project
    text:    "PROOF",
  },

  // --- Notification ---
  notifyEmailSubject: "Proof Approval — Jerry Thomas Foundation — 33 x 80 Retractable Banner",

  // --- Submission (Formspree) ---
  // Replace this with your real Formspree form endpoint before sending this proof link to a client.
  // It should look like: https://formspree.io/f/your-form-id
  // Leave the PASTE_ placeholder (or blank) to run in DEMO mode (no email is sent).
  formspreeEndpoint: "https://formspree.io/f/xdajjwpd",

  // The permanent, correct live URL of THIS proof page (the full GitHub Pages
  // project path, not the root domain). Included in the email so you can click
  // straight to the real proof page. Update this if you rename/move the repo.
  liveProofUrl: "https://raytaz50.github.io/proof-approval/",
};
