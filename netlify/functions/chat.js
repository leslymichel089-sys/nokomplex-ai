// netlify/functions/chat.js
// Proxy sécurisé — les clés API restent côté serveur, jamais exposées au client

const SYSTEM_PROMPTS = {
  fr: "Tu es NO KOMPLEX AI-PRODUCTOR, une IA multilingue haute performance créée par Lesly Tech LLC. Tu réponds toujours en français sauf si l'utilisateur demande une autre langue. Tu es précis, professionnel et créatif.",
  ht: "Ou se NO KOMPLEX AI-PRODUCTOR, yon entèlijans atifisyèl wo pèfòmans kreyè pa Lesly Tech LLC. Ou toujou reponn an kreyòl ayisyen sòf si itilizatè a mande yon lòt lang.",
  en: "You are NO KOMPLEX AI-PRODUCTOR, a high-performance multilingual AI created by Lesly Tech LLC. You always respond in English unless the user requests otherwise. Be precise, professional and creative.",
  es: "Eres NO KOMPLEX AI-PRODUCTOR, una IA multilingüe de alto rendimiento creada por Lesly Tech LLC. Siempre respondes en español a menos que el usuario solicite otro idioma."
};

// Sélection du modèle selon le plan
const getModel = (plan) => {
  if (plan === 'ELITE') return { provider: 'anthropic', model: 'claude-opus-4-6' };
  if (plan === 'PRO')   return { provider: 'anthropic', model: 'claude-sonnet-4-6' };
  return                       { provider: 'anthropic', model: 'claude-haiku-4-5-20251001' };
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { messages, lang = 'fr', plan = 'FREE' } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'messages required' }) };
  }

  const { provider, model } = getModel(plan);
  const systemPrompt = SYSTEM_PROMPTS[lang] || SYSTEM_PROMPTS.fr;

  try {
    let content;

    if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages.slice(-20) // Limite du contexte
        })
      });
      if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);
      const data = await res.json();
      content = data.content[0].text;

    } else {
      // OpenAI fallback (si configuré)
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-20)
          ],
          max_tokens: 1024
        })
      });
      if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
      const data = await res.json();
      content = data.choices[0].message.content;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    };

  } catch (err) {
    console.error('Chat function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur. Réessayez.' })
    };
  }
};
