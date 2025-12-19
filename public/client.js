// State
let currentInvoice = null;

// DOM Elements
const loadingEl = document.getElementById("loading");
const articleEl = document.getElementById("article-content");
const titleEl = document.getElementById("article-title");
const bodyEl = document.getElementById("article-body");
const paywallEl = document.getElementById("paywall-overlay");
const payBtn = document.getElementById("pay-btn");
const btnText = payBtn.querySelector(".btn-text");
const btnLoader = payBtn.querySelector(".loader");

// Initialize
fetchArticle();

// Payment Button Listener
payBtn.addEventListener("click", handlePayment);

async function fetchArticle(paymentToken = null) {
  // Show loading initial state if first load
  if (!paymentToken) {
    loadingEl.classList.remove("hidden");
    articleEl.classList.add("hidden");
  }

  const headers = {};
  if (paymentToken) {
    headers["Authorization"] = `X402 token="${paymentToken}"`;
  }

  try {
    const response = await fetch("/api/article", { headers });
    const data = await response.json();

    if (response.status === 200) {
      renderArticle(data);
    } else if (response.status === 402) {
      handle402Response(response, data);
    } else {
      console.error("Unknown error");
    }
  } catch (err) {
    console.error("Network error", err);
  } finally {
    loadingEl.classList.add("hidden");
    articleEl.classList.remove("hidden");
  }
}

function handle402Response(response, data) {
  // 1. Render the partial public content
  titleEl.textContent = data.title;
  // Show intro and fade out
  bodyEl.innerHTML = `<p>${data.intro}</p>`;

  // 2. Extract payment challenge
  const authHeader = response.headers.get("WWW-Authenticate");
  if (authHeader) {
    const invoiceMatch = authHeader.match(/invoice="([^"]+)"/);
    if (invoiceMatch) {
      currentInvoice = invoiceMatch[1];
      paywallEl.classList.remove("hidden");
      console.log("X402 Challenge Received:", currentInvoice);
    }
  }
}

async function handlePayment() {
  if (!currentInvoice) return;

  // UI: Loading state
  payBtn.disabled = true;
  btnText.textContent = "Processing...";
  btnLoader.classList.remove("hidden");

  try {
    console.log("Paying invoice...", currentInvoice);

    // 1. Call Payment API (Mock Wallet)
    const payRes = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoice: currentInvoice }),
    });

    const payData = await payRes.json();

    if (payData.token) {
      console.log("Payment successful! Token:", payData.token);

      // 2. Retry Article Fetch with Token
      await fetchArticle(payData.token);

      // UI: Success state
      paywallEl.classList.add("hidden"); // Remove paywall
    } else {
      alert("Payment failed.");
    }
  } catch (err) {
    console.error("Payment error", err);
    alert("Payment system error.");
  } finally {
    // Reset button state (if we didn't succeed and hide it)
    payBtn.disabled = false;
    btnText.textContent = "Pay Instantly";
    btnLoader.classList.add("hidden");
  }
}

function renderArticle(data) {
  titleEl.textContent = data.title;
  // Assuming data.intro + data.premiumContent
  bodyEl.innerHTML = `
        <p class="intro">${data.intro}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 2rem 0;">
        ${data.premiumContent}
    `;

  // Ensure paywall is gone
  paywallEl.classList.add("hidden");
}
