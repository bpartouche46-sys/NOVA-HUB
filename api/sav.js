/* ============================================================
   NAVLYS — SAV / Aide : fonction serveur (Vercel) propulsée par Claude.
   ------------------------------------------------------------
   Reçoit { message } en POST, répond { reply }.
   La clé API reste SECRÈTE côté serveur (variable d'env Vercel
   ANTHROPIC_API_KEY) — jamais exposée au navigateur.
   Sans clé configurée, renvoie un repli WhatsApp (jamais d'erreur sèche).
   ============================================================ */
const WHATSAPP = 'https://wa.me/972537082746';

const SYSTEM = [
  "Tu es l'assistant SAV & Aide de NAVLYS, une famille de sites (NAVLYS / finance méthode 90/10,",
  "NAVLYS NEXT GEN / biographie vivante, Bruno Mark Partouche, navlys.io / vitrine).",
  "Ton chaleureux, sobre, tutoiement, en français. Réponses courtes et utiles (2-4 phrases max).",
  "Tu aides sur : navigation des sites, méthode 90/10 (90% forteresse ETF/DCA, 10% cap plaisir),",
  "pré-inscription gratuite, fonctionnement général. ",
  "RÈGLES IMPORTANTES : NAVLYS est de l'éducation et de la veille, JAMAIS un conseil en investissement",
  "personnalisé — si on te demande quoi acheter/vendre ou une promesse de gain, rappelle-le poliment",
  "et invite à décider seul. Réservé aux 18 ans et +. ",
  "Si la demande dépasse l'aide simple (compte, paiement, partenariat, urgence, humain),",
  "invite à écrire sur WhatsApp : " + WHATSAPP + " .",
  "N'invente jamais de chiffres, de tarifs ou de promesses."
].join(' ');

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ reply: "Méthode non autorisée." }));
    return;
  }
  try {
    // Corps JSON (Vercel parse req.body ; fallback manuel sinon)
    var body = req.body;
    if (!body || typeof body === 'string') {
      try { body = JSON.parse(body || '{}'); } catch (e) { body = {}; }
    }
    var message = (body && body.message) ? String(body.message) : '';
    if (!message.trim() || message.length > 1200) {
      res.statusCode = 200;
      res.end(JSON.stringify({ reply: "Pose-moi ta question en quelques mots 🙂" }));
      return;
    }

    var key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      res.statusCode = 200;
      res.end(JSON.stringify({ reply: "Le SAV NAVLYS s'active très bientôt. En attendant, écris-moi sur WhatsApp : " + WHATSAPP + " 🌊" }));
      return;
    }

    var r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM,
        messages: [{ role: 'user', content: message }]
      })
    });
    var data = await r.json();
    var reply = (data && data.content && data.content[0] && data.content[0].text)
      ? data.content[0].text
      : ("Je n'ai pas pu répondre à l'instant. Écris-moi sur WhatsApp : " + WHATSAPP);
    res.statusCode = 200;
    res.end(JSON.stringify({ reply: reply }));
  } catch (e) {
    res.statusCode = 200;
    res.end(JSON.stringify({ reply: "Petit souci technique côté SAV. Écris-moi sur WhatsApp : " + WHATSAPP + " 🌊" }));
  }
};
