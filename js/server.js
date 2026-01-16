// FILE NAME: server.js
// 1. Load necessary tools
require('dotenv').config(); // Loads your secrets
const express = require('express');
const cors = require('cors');
// REPLACE THIS with your 'sk_test_...' Secret Key from Stripe Dashboard
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY_GOES_HERE');

const app = express();

// 2. Allow your HTML page to talk to this server
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const DOMAIN = 'http://localhost:3000'; // Your local computer address

// 3. The Route that creates the payment session
app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('Received payment request...'); // This logs to your terminal when clicked

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PAPI CENTRAL - Commercial License',
              description: 'Access to Aegis Security & Auto-Code Tools',
            },
            unit_amount: 1999, // $19.99 (in cents)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${DOMAIN}/success.html`, // Create these files later
      cancel_url: `${DOMAIN}/cancel.html`,
    });

    console.log('Session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Start the Server
app.listen(3000, () => console.log('✅ Node Server is running on port 3000'));
