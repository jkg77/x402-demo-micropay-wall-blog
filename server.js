const express = require("express");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

// In-memory "database" of paid invoices
const paidInvoices = new Set();
// Map of payment tokens to invoices
const paymentTokens = new Map();

const ARTICLE = {
  title: "The Future of Micropayments: Why HTTP 402 Matters",
  intro:
    "For decades, the web has lacked a native payment layer. We've relied on ads, subscriptions, and clunky checkout flows. But in 2025, the resurrection of HTTP 402 changed everything.",
  premiumContent: `
        <p>The beauty of the x402 protocol lies in its simplicity. It treats money like any other data packet—a fundamental primitive of the web request.</p>
        
        <h3>The Hidden Economy of API Calls</h3>
        <p>Imagine an API that charges 0.0001 cents per call. Too small for a credit card, but trivial for a streaming payment channel. This enables "utility computing" where you pay strictly for what you use, down to the millisecond of compute time or the byte of storage.</p>
        
        <h3>Beyond the Paywall</h3>
        <p>It's not just about blocking content. It's about enabling <strong>autonomous agents</strong> (like the one writing this code!) to negotiate services with each other. An AI agent can now "bribe" a priority queue, pay for a high-resolution image generation, or access a premium dataset without human intervention.</p>
        
        <p>This is the web we were promised. Frictionless, decentralized, and economically vibrant.</p>
        
        <div class="test-proof">
            <em>You are reading this because your browser successfully negotiated a cryptographic payment token. Welcome to the future.</em>
        </div>
    `,
};

// Endpoint to get the article
app.get("/api/article", (req, res) => {
  const authHeader = req.get("Authorization");

  // Check if user has a valid payment token
  if (authHeader && authHeader.startsWith('X402 token="')) {
    const token = authHeader.match(/token="([^"]+)"/)[1];
    if (paymentTokens.has(token)) {
      // Valid payment! Return full content
      return res.json({
        ...ARTICLE,
        isPremium: true,
      });
    }
  }

  // No valid payment. Return 402 with invoice.
  const invoiceId = uuidv4();
  const amount = "0.01";

  res.set(
    "WWW-Authenticate",
    `X402 invoice="${invoiceId}", amount="${amount}", currency="USD"`
  );
  res.status(402).json({
    title: ARTICLE.title,
    intro: ARTICLE.intro,
    isPremium: false,
    message: "Payment Required to view full content.",
  });
});

// Mock Payment Gateway
app.post("/api/pay", (req, res) => {
  const { invoice } = req.body;

  if (!invoice) {
    return res.status(400).json({ error: "Missing invoice ID" });
  }

  // Simulate payment processing time
  setTimeout(() => {
    const token = `pay_${uuidv4().split("-")[0]}`; // Mock token
    paymentTokens.set(token, invoice);
    paidInvoices.add(invoice);

    console.log(`[Payment] Invoice ${invoice} paid. Issued token ${token}`);

    res.json({ token });
  }, 1500);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
