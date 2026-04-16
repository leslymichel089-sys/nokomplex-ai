// netlify/functions/admin.js
// Le code admin est vérifié CÔTÉ SERVEUR — jamais exposé dans le frontend

const crypto = require('crypto');

const hashCode = (code) =>
  crypto.createHash('sha256').update(code + process.env.ADMIN_SALT || '').digest('hex');

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

  const { code } = body;
  if (!code || typeof code !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ authorized: false }) };
  }

  // Comparaison du hash — jamais en clair
  const inputHash = hashCode(code);
  const validHash = process.env.ADMIN_CODE_HASH;

  if (!validHash) {
    console.error('ADMIN_CODE_HASH non configuré dans les variables d\'environnement');
    return { statusCode: 500, body: JSON.stringify({ authorized: false }) };
  }

  const authorized = crypto.timingSafeEqual(
    Buffer.from(inputHash),
    Buffer.from(validHash)
  );

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorized })
  };
};
