/* ============================================================
   Proof Approval System — app logic
   Reads window.PROOF_CONFIG (js/proof-config.js). No per-client
   edits needed here.
   ============================================================ */
(function () {
  const CFG = window.PROOF_CONFIG;
  if (!CFG) { console.error("PROOF_CONFIG missing — check js/proof-config.js loads first."); return; }

  const CHECK = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const APPROVALS = [
    { id: 'approved_as_is',       label: 'Approved As Is',        sub: 'Ready to print — no changes' },
    { id: 'approved_with_changes',label: 'Approved With Changes', sub: 'Proceed after the notes below' },
  ];
  const wmOn = !!(CFG.watermark && CFG.watermark.enabled);
  const wmText = (CFG.watermark && CFG.watermark.text) || 'PROOF';

  const $ = id => document.getElementById(id);
  let sel = { layout: null, approval: null, consent: false };

  // ---- Build a proof image frame with optional watermark + error state ----
  function frame(layout) {
    return `<div class="proof-frame${wmOn ? ' wm' : ''}" data-wm="${esc(wmText)}">
      <img src="${esc(layout.img)}" alt="${esc(layout.label)} — ${esc(CFG.projectName)}" loading="lazy"
           onerror="this.closest('.proof-frame').classList.add('error')">
      <div class="imgerr">Image didn't load.<br>${esc(layout.label)}</div>
    </div>`;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

  // ---- Populate header / intro copy from config ----
  function fillStatic() {
    document.title = "Proof for Approval — " + CFG.clientName;
    $('mPhone').textContent = CFG.contact.phone;
    $('mEmail').textContent = CFG.contact.email;
    $('mWeb').textContent = CFG.contact.website;
    $('h1lead').textContent = CFG.headline.lead + ' ';
    $('h1accent').textContent = CFG.headline.accent;
    $('subLine').innerHTML = `<b>DESIGN TYPE</b> &nbsp;${esc(CFG.designType)} &nbsp;&middot;&nbsp; ${CFG.layouts.length} Layout Options`;
    $('directions').innerHTML = `<b>${esc(CFG.directions)}</b> ${CFG.revisionPolicy}`;
    $('disclaimer').textContent = CFG.disclaimer;
    $('footMain').innerHTML = `${esc(CFG.contact.tagline)} &nbsp;&middot;&nbsp; <span class="at">${esc(CFG.contact.instagram)}</span> &nbsp;&middot;&nbsp; ${esc(CFG.contact.email)}`;
    $('footDone').innerHTML = `${esc(CFG.clientName)} &nbsp;&middot;&nbsp; <span class="at">${esc(CFG.contact.instagram)}</span>`;
    // default date = today (local)
    const t = new Date(); const iso = new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    $('dateInput').value = iso;
  }

  // ---- Layout cards ----
  function buildGrid() {
    const grid = $('grid');
    CFG.layouts.forEach(l => {
      const d = document.createElement('div');
      d.className = 'opt'; d.dataset.id = l.id;
      const sub = [l.env, l.tone].filter(Boolean).join(' · ');
      d.innerHTML = `<div class="tick"><svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        ${frame(l)}
        <div class="cap"><b>${esc(l.label)}</b><span>${esc(sub)}${l.note ? ' · ' + esc(l.note) : ''}</span></div>`;
      d.onclick = () => { sel.layout = l.id; [...grid.children].forEach(c => c.classList.toggle('sel', c.dataset.id === l.id)); clearErr(); };
      grid.appendChild(d);
    });
  }

  // ---- Approval choices ----
  function buildChoices() {
    const choices = $('choices');
    APPROVALS.forEach(a => {
      const d = document.createElement('div');
      d.className = 'choice'; d.dataset.id = a.id;
      d.innerHTML = `<div class="box">${CHECK}</div><div><b>${a.label}</b><small>${a.sub}</small></div>`;
      d.onclick = () => { sel.approval = a.id; [...choices.children].forEach(c => c.classList.toggle('sel', c.dataset.id === a.id)); clearErr(); };
      choices.appendChild(d);
    });
  }

  function clearErr() { $('err').textContent = ''; }
  function prettyDate(v) {
    if (!v) return '';
    const [y, m, d] = v.split('-');
    const mo = ['January','February','March','April','May','June','July','August','September','October','November','December'][parseInt(m, 10) - 1];
    return `${mo} ${parseInt(d, 10)}, ${y}`;
  }

  const ep = (CFG.formspreeEndpoint || '').trim();
  const DEMO = !ep || ep.indexOf('PASTE_') === 0;

  function submit() {
    const btn = $('submitBtn');
    const name = $('name').value.trim();
    const corrections = $('corrections').value.trim();
    const dateVal = $('dateInput').value;
    const err = $('err');

    if (!sel.layout)   { err.textContent = 'Please select a layout (step 1).'; return; }
    if (!sel.approval) { err.textContent = "Please choose how you're approving (step 2)."; return; }
    if (!name)         { err.textContent = 'Please type your full name to sign off.'; return; }
    if (!dateVal)      { err.textContent = 'Please enter the date.'; return; }
    if (!sel.consent)  { err.textContent = 'Please check the consent box to submit.'; return; }
    if (sel.approval === 'approved_with_changes' && !corrections) { err.textContent = 'You chose “with changes” — please note the corrections.'; return; }

    const L = CFG.layouts.find(l => l.id === sel.layout);
    const approvalLabel = APPROVALS.find(a => a.id === sel.approval).label;
    const subDetail = [L.env, L.tone].filter(Boolean).join(' · ');
    const data = {
      client: CFG.clientName,
      project: CFG.projectName,
      design_type: CFG.designType,
      proof_specs: CFG.proofSpecs || CFG.designType,
      selected_layout: `${L.label}${subDetail ? ' (' + subDetail + ')' : ''}`,
      approval: approvalLabel,
      corrections: corrections || '(none)',
      signed_name: name,
      signed_date: prettyDate(dateVal),
      submitted_at: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    };

    btn.disabled = true; btn.textContent = 'Submitting…';
    send(data).then(() => showDone(data)).catch(() => {
      btn.disabled = false; btn.textContent = 'Submit Approval';
      err.textContent = `Could not send. Please try again, or email ${CFG.contact.email}.`;
    });
  }

  async function send(data) {
    if (DEMO) { await new Promise(r => setTimeout(r, 650)); return; }
    // Email via Formspree
    const subject = CFG.notifyEmailSubject || `Proof Approval — ${CFG.clientName} — ${CFG.designType}`;
    const proofLink = CFG.liveProofUrl || window.location.href;
    const fd = new FormData();
    fd.append('_subject', subject);  // sets the actual email subject line
    fd.append('subject', subject);   // also shown in the email body
    fd.append('Client', data.client);
    fd.append('Project', data.project);
    fd.append('Design_Type', data.design_type);
    fd.append('Proof_Specs', data.proof_specs);
    fd.append('Selected_Layout', data.selected_layout);
    fd.append('Approval', data.approval);
    fd.append('Corrections', data.corrections);
    fd.append('Signed_Name', data.signed_name);
    fd.append('Signed_Date', data.signed_date);
    fd.append('Submitted_At', data.submitted_at);
    fd.append('Designer', `${CFG.contact.email} · ${CFG.contact.phone}`);
    fd.append('proof_link', proofLink);                       // correct permanent proof URL (from config)
    fd.append('submitted_from_page', window.location.href);   // the actual page the client used

    const r = await fetch(ep, { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
    if (!r.ok) {
      let msg = 'submission failed';
      try { const j = await r.json(); if (j.errors) msg = j.errors.map(e => e.message).join(', '); } catch (e) {}
      throw new Error(msg);
    }
  }

  function showDone(p) {
    $('formview').style.display = 'none';
    $('rgallery').innerHTML = CFG.layouts.map(l => {
      const s = l.id === sel.layout;
      const sub = [l.env, l.tone].filter(Boolean).join(' · ');
      return `<div class="rcard ${s ? 'sel' : ''}"><div class="badge">Your Selection</div>${frame(l)}<div class="rcap"><b>${esc(l.label)}</b>${esc(sub)}</div></div>`;
    }).join('');
    $('recap').innerHTML = `
      <div class="r"><span class="k">Client</span><span class="v">${esc(p.client)}</span></div>
      <div class="r"><span class="k">Project</span><span class="v">${esc(p.project)}</span></div>
      <div class="r"><span class="k">Selected</span><span class="v o">${esc(p.selected_layout)}</span></div>
      <div class="r"><span class="k">Approval</span><span class="v">${esc(p.approval)}</span></div>
      <div class="r"><span class="k">Corrections</span><span class="v">${esc(p.corrections)}</span></div>
      <div class="r"><span class="k">Signed By</span><span class="v">${esc(p.signed_name)}</span></div>
      <div class="r"><span class="k">Date</span><span class="v">${esc(p.signed_date)}</span></div>
      <div class="r"><span class="k">Submitted</span><span class="v">${esc(p.submitted_at)}</span></div>`;
    $('done').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---- Init ----
  fillStatic();
  buildGrid();
  buildChoices();
  const consentEl = $('consent');
  consentEl.onclick = () => { sel.consent = !sel.consent; consentEl.classList.toggle('sel', sel.consent); clearErr(); };
  $('submitBtn').onclick = submit;
  if (DEMO) $('demoNote').textContent = 'Demo mode — this form is not sending emails yet. Add your Formspree endpoint in js/proof-config.js to go live.';
})();
