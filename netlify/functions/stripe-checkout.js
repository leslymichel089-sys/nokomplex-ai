// netlify/functions/stripe-checkout.js
// Crée une session Stripe Checkout pour les plans PRO et ELITE

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { plan } = body; // 'PRO' ou 'ELITE'

  const priceMap = {
    PRO:   process.env.STRIPE_PRO_PRICE_ID,
    ELITE: process.env.STRIPE_ELITE_PRICE_ID,
  };

  const priceId = priceMap[plan];
  if (!priceId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Plan invalide' }) };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.REACT_APP_URL}/?payment=success&plan=${plan}`,
      cancel_url:  `${process.env.REACT_APP_URL}/?payment=cancelled`,
      metadata: { plan },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erreur Stripe' }) };
  }
};
