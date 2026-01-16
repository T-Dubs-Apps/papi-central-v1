const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("⚡ CODE AUTOMATION ENGINE STARTED...");

// 1. CREATE DIRECTORY STRUCTURE
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir);
    console.log("✅ Created 'public' directory.");
}

// 2. MOVE PAPI CENTRAL FILE
// Checks for PapiCentral.html or index.html and moves it
const possibleFiles = ['PapiCentral.html', 'index.html'];
let fileMoved = false;

possibleFiles.forEach(file => {
    const oldPath = path.join(__dirname, file);
    const newPath = path.join(publicDir, file);
    
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
        console.log(`✅ Moved '${file}' to 'public/' folder.`);
        fileMoved = true;
    }
});

if (!fileMoved) {
    console.log("⚠️  NOTICE: Could not find 'PapiCentral.html' to move. Please drag it into the 'public' folder manually after this finishes.");
}

// 3. GENERATE SERVER.JS (The Brain)
const serverCode = `
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(cors());
app.use(express.static('public')); // Serves the files in 'public' folder
app.use(express.json());

const DOMAIN = 'http://localhost:3000';

app.post('/create-checkout-session', async (req, res) => {
  try {
    console.log("💳 Payment Request Received");
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
            unit_amount: 1999,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: \`\${DOMAIN}/success.html\`,
      cancel_url: \`\${DOMAIN}/cancel.html\`,
    });
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('🚀 PAPI SERVER RUNNING on http://localhost:3000/PapiCentral.html'));
`;

fs.writeFileSync('server.js', serverCode);
console.log("✅ Generated 'server.js' logic.");

// 4. GENERATE .ENV FILE (Secrets)
// NOTE: You must replace the text inside the quotes with your real key later!
const envContent = `STRIPE_SECRET_KEY=sk_test_REPLACE_THIS_WITH_YOUR_REAL_KEY`;
if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envContent);
    console.log("✅ Generated '.env' file for security keys.");
}

// 5. AUTO-INSTALL DEPENDENCIES
console.log("📦 Installing necessary system modules (This may take a minute)...");
try {
    // Initialize npm if package.json doesn't exist
    if (!fs.existsSync('package.json')) {
        execSync('npm init -y', { stdio: 'ignore' });
    }
    // Install packages
    execSync('npm install express stripe cors dotenv', { stdio: 'inherit' });
    console.log("✅ Modules installed successfully.");
} catch (error) {
    console.error("❌ Error installing modules. You may need to run 'npm install express stripe cors dotenv' manually.");
}

console.log("\n==================================================");
console.log("   🎉 SYSTEM READY FOR DEPLOYMENT");
console.log("   1. Open '.env' file and paste your Stripe Secret Key (sk_test_...)");
console.log("   2. Run 'node server.js' to start.");
console.log("==================================================");

module.exports = "Script Generated";