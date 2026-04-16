// netlify/functions/stripe-webhook.js
// Reçoit les événements Stripe (paiement réussi, annulation, etc.)

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig     = event.headers['stripe-signature'];
  const secret  = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, secret);
  } catch (err) {
    console.error('Webhook signature invalide:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Gérer les événements importants
  switch (stripeEvent.type) {

    case 'checkout.session.completed': {
      const session = stripeEvent.data.object;
      const plan    = session.metadata?.plan;
      console.log(`✅ Paiement réussi — Plan: ${plan} — Client: ${session.customer_email}`);
      // TODO: Mettre à jour votre base de données utilisateur ici
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = stripeEvent.data.object;
      console.log(`❌ Abonnement annulé — Client: ${sub.customer}`);
      // TODO: Rétrograder l'utilisateur vers FREE
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = stripeEvent.data.object;
      console.log(`⚠️ Paiement échoué — Client: ${invoice.customer_email}`);
      // TODO: Notifier l'utilisateur
      break;
    }

    default:
      console.log(`Événement non géré: ${stripeEvent.type}`);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
