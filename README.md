# Proof Approval System

A reusable, mobile-friendly proof approval page for client design sign-offs. Clients pick a layout, approve (as-is or with changes), sign with their name + date, and submit. You get the approval by email through **Formspree**.

It's a plain static site — HTML/CSS/JavaScript, no build step, no framework. Deploys to **GitHub Pages**.

## File structure

```
index.html                 ← the page (don't usually edit)
css/styles.css             ← styling (don't usually edit)
js/app.js                  ← logic (don't usually edit)
js/proof-config.js         ← ★ EDIT THIS per client (incl. Formspree endpoint)
assets/brand/              ← your logo (logo.png + logo-print.png)
assets/fonts/              ← Playfair + DMSans
assets/proofs/<client>/    ← ★ PUT PROOF IMAGES HERE
README.md
```

## Add a new client proof (the short version)

1. **Add images.** Make a folder `assets/proofs/<client-slug>/` and drop in your layout JPGs (e.g. `layout-01.jpg` … `layout-04.jpg`).
2. **Edit `js/proof-config.js`** — change the client name, project name, design type, the `layouts` array (labels + image paths), policy text, and subject.
3. Open `index.html` to preview. Deploy. Send the link.

## Duplicate the config for the next client

All per-client data lives in **one file**: `js/proof-config.js`. To reuse: edit that file, swap the images in `assets/proofs/<client>/`, and redeploy.

## Replace proof images

Drop new files into `assets/proofs/<client>/` and update the `img:` paths in `layouts`. Use relative paths starting with `./` so they work on GitHub Pages. If a path is wrong, the card shows a clean "Image didn't load" placeholder instead of breaking.

## Watermark on / off

In `js/proof-config.js`:

```js
watermark: { enabled: true, text: "PROOF" }
```

- `enabled: true` → a light diagonal **PROOF** stamp sits on top of each proof image (cards, confirmation gallery, and print).
- `enabled: false` → no watermark for this project.
- Change `text` to anything (e.g. `"DRAFT"`, `"SAMPLE"`).

## Using Formspree

The form emails you through Formspree (you already have an account).

1. Log into Formspree (https://formspree.io).
2. Create a new form.
3. Copy the Formspree endpoint — it looks like `https://formspree.io/f/your-form-id`.
4. Paste the endpoint into `js/proof-config.js`:
   ```js
   formspreeEndpoint: "https://formspree.io/f/your-form-id",
   ```
5. Deploy the site to GitHub Pages (see below).
6. Open the live GitHub Pages URL.
7. Submit a test proof approval.
8. Confirm the approval email arrives in the target email inbox.
9. If the email does not arrive, check the Formspree dashboard, your spam folder, and the target email settings. (Formspree may require you to confirm the form once via its first test email.)

The email includes: client name, project name, design type, proof specs, selected layout, approval status, correction notes, signed name, signed date, submitted timestamp, and your designer contact info. The subject is auto-generated as `Proof Approval — [Client Name] — [Project Name]` (override with `notifyEmailSubject` in the config).

## How to know the form is live

- If **demo mode** is showing (a note under the Submit button says the form is *not sending emails yet*), the form is **not** live.
- If `formspreeEndpoint` still says the `PASTE_...` placeholder (or is blank), the form is **not** live — it runs in demo mode.
- If a **real** Formspree endpoint is pasted in, the form submits to Formspree and the demo note disappears.
- Always test from the **live GitHub Pages URL** before sending the link to a client. (Submitting from a local `file://` page can fail.)

## Test demo mode

Leave `formspreeEndpoint` as the default placeholder. The page validates and shows the confirmation screen but sends nothing. The "Demo mode" note appears under the Submit button.

## Test live mode

1. Paste your real Formspree endpoint into `js/proof-config.js`.
2. Open the page (ideally the live GitHub Pages URL), pick a layout, approve, sign, submit.
3. A success/confirmation screen appears **only** after Formspree returns success. If Formspree fails, you'll see a clear error message and the form stays open — no fake success.
4. Check your inbox for the approval email.

## Deploy to GitHub Pages

1. Create a GitHub repository and push these files to it.
2. In the repo: **Settings → Pages**.
3. Under "Build and deployment", set **Source** = *Deploy from a branch*, **Branch** = `main` (folder `/root`), then Save.
4. Wait ~1 minute. Your site will be at:
   `https://USERNAME.github.io/REPOSITORY-NAME/`
5. Open that URL and run a test submission.

All asset paths are relative (`./css/...`, `./js/...`, `./assets/...`), so the app works correctly under the `/REPOSITORY-NAME/` subpath.

## Send the link to a client

After deploying, send the GitHub Pages URL. The client opens it, reviews, signs, and submits — you get the email.

## Security notes

- This app contains **no** passwords, SMTP credentials, Gmail passwords, or API tokens. The only submission setting is the Formspree endpoint URL, which is safe to expose (it's a public form URL, like an HTML `<form action>`).
- Never paste email passwords or private keys into any file here — everything in a static site is publicly visible.
- This page is a sign-off record, not a certified e-signature service. Keep the Formspree emails for your records.
