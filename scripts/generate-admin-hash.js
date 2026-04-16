#!/usr/bin/env node
// Exécuter une seule fois : node scripts/generate-admin-hash.js
// Copier la valeur générée dans ADMIN_CODE_HASH sur Netlify

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Entrez votre code admin secret : ', (code) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(code + salt).digest('hex');

  console.log('\n✅ Valeurs à copier dans Netlify > Site Settings > Environment Variables :');
  console.log(`ADMIN_CODE_HASH=${hash}`);
  console.log(`ADMIN_SALT=${salt}`);
  console.log('\n⚠️  Gardez ces valeurs secrètes. Ne les commitez JAMAIS sur GitHub.');
  rl.close();
});
