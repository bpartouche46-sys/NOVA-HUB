/* ============================================================
   NAVLYS — Widget Aide & SAV (chat) branché sur /api/sav (Claude).
   Une ligne à inclure :  <script src="../_shared/navlys-sav.js" defer></script>
   - Bouton flottant "💬 Aide" → panneau de chat.
   - POST {message} → /api/sav → affiche {reply}.
   - Repli WhatsApp géré côté serveur si l'IA n'est pas dispo.
   ============================================================ */
(function () {
  function init() {
    if (document.getElementById('nv-sav')) return;
    var WA = 'https://wa.me/972537082746';
    var css = [
      '#nv-sav-btn{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));z-index:9998;',
      "  display:inline-flex;align-items:center;gap:8px;font-family:'Cinzel',serif;font-size:13px;letter-spacing:.12em;",
      '  padding:12px 18px;border-radius:30px;border:1px solid rgba(125,211,252,.5);cursor:pointer;',
      '  color:#05060a;background:linear-gradient(135deg,#C9A961,#fff6df);box-shadow:0 10px 30px rgba(0,0,0,.45)}',
      '#nv-sav-btn:hover{transform:translateY(-2px)}',
      '#nv-sav{position:fixed;right:16px;bottom:calc(74px + env(safe-area-inset-bottom));z-index:9999;width:min(360px,92vw);',
      '  height:min(520px,70vh);display:none;flex-direction:column;overflow:hidden;border-radius:18px;',
      '  background:rgba(2,4,10,.92);backdrop-filter:blur(18px);border:1px solid rgba(125,211,252,.35);box-shadow:0 24px 70px rgba(0,0,0,.6)}',
      '#nv-sav.open{display:flex}',
      '#nv-sav .hd{display:flex;align-items:center;gap:8px;padding:14px 16px;border-bottom:1px solid rgba(125,211,252,.2);',
      "  font-family:'Cinzel',serif;letter-spacing:.1em;color:#C9A961;font-size:13px}",
      '#nv-sav .hd .x{margin-left:auto;color:#9fb3c8;cursor:pointer;font-size:18px;line-height:1;background:none;border:0}',
      '#nv-sav .msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}',
      "#nv-sav .m{max-width:85%;padding:10px 13px;border-radius:14px;font-family:'Inter',system-ui,sans-serif;font-size:14px;line-height:1.5}",
      '#nv-sav .m.bot{align-self:flex-start;background:rgba(125,211,252,.10);border:1px solid rgba(125,211,252,.25);color:#e7eef2}',
      '#nv-sav .m.you{align-self:flex-end;background:rgba(201,169,97,.16);border:1px solid rgba(201,169,97,.3);color:#f3e4c4}',
      '#nv-sav .m.typing{opacity:.7;font-style:italic}',
      '#nv-sav form{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(125,211,252,.2)}',
      "#nv-sav input{flex:1;padding:11px 13px;border-radius:12px;border:1px solid rgba(125,211,252,.3);",
      '  background:rgba(2,4,10,.6);color:#e7eef2;font-family:Inter,system-ui,sans-serif;font-size:14px;outline:none}',
      '#nv-sav button.send{padding:0 14px;border-radius:12px;border:0;cursor:pointer;color:#05060a;',
      '  background:linear-gradient(135deg,#7DD3FC,#a8e3ff);font-size:18px}',
      '@media(prefers-reduced-motion:reduce){#nv-sav-btn{transition:none}}'
    ].join('\n');
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.id = 'nv-sav-btn'; btn.type = 'button';
    btn.innerHTML = '💬 Aide';
    var box = document.createElement('div');
    box.id = 'nv-sav';
    box.innerHTML =
      '<div class="hd">🌊 NAVLYS · Aide &amp; SAV<button class="x" aria-label="Fermer">×</button></div>' +
      '<div class="msgs" id="nv-sav-msgs"></div>' +
      '<form id="nv-sav-form" autocomplete="off">' +
      '<input id="nv-sav-in" placeholder="Ta question…" maxlength="1000" aria-label="Ta question">' +
      '<button class="send" type="submit" aria-label="Envoyer">➤</button></form>';
    document.body.appendChild(btn);
    document.body.appendChild(box);

    var msgs = box.querySelector('#nv-sav-msgs');
    var form = box.querySelector('#nv-sav-form');
    var input = box.querySelector('#nv-sav-in');
    var greeted = false;

    function add(text, who) {
      var d = document.createElement('div');
      d.className = 'm ' + who; d.textContent = text;
      msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
      return d;
    }
    function open() {
      box.classList.add('open');
      if (!greeted) { greeted = true; add("Salut 👋 Je suis l'aide NAVLYS. Une question, une idée ? Écris-moi.", 'bot'); }
      setTimeout(function () { input.focus(); }, 50);
    }
    function close() { box.classList.remove('open'); }
    btn.addEventListener('click', function () { box.classList.contains('open') ? close() : open(); });
    box.querySelector('.x').addEventListener('click', close);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var q = input.value.trim(); if (!q) return;
      add(q, 'you'); input.value = '';
      var t = add('…', 'bot typing');
      try {
        var r = await fetch('/api/sav', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message: q })
        });
        var data = await r.json();
        t.classList.remove('typing');
        t.textContent = (data && data.reply) ? data.reply : ("Écris-moi sur WhatsApp : " + WA);
      } catch (err) {
        t.classList.remove('typing');
        t.textContent = "Connexion indisponible. Écris-moi sur WhatsApp : " + WA;
      }
      msgs.scrollTop = msgs.scrollHeight;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
