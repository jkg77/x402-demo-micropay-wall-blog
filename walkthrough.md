# x402 Micropay-Wall Demo Walkthrough

## Overview

This project demonstrates the **future of the web** using the hypothetical 2025 x402 protocol specification. It implements a "Micropay-Wall" where content is protected by an HTTP 402 status code and unlocked via a seamless programmatic payment.

## Feature Breakdown

### 1. The Protocol (Server-Side)

The `server.js` implements the core x402 logic:

- **Challenge**: Returns `402 Payment Required` with `WWW-Authenticate: X402 invoice="..."` headers when no token is present.
- **Verification**: Validates `Authorization: X402 token="..."` headers to unlock premium content.
- **Payment**: A mock `/api/pay` endpoint that exchanges invoices for payment tokens relative to a mock wallet.

### 2. The Client (Browser-Side)

The `client.js` acts as an intelligent agent:

- Intercepts `402` responses transparently.
- Extracts the invoice ID.
- Negotiates payment with the "wallet" (user approval via button).
- Retries the original request with the proof of payment to unlock content.

### 3. Aesthetics

The application features a clean, premium editorial design using **Merriweather** and **Inter** typography, ensuring the reading experience feels worth paying for.

## Verification

The following verification steps were performed:

1. **Initial Load**: Verified only the intro text is visible and the paywall is active.
2. **Pay Action**: Clicked "Pay Instantly". Verified the loading state.
3. **Unlock**: Confirmed the paywall disappears and the full article content is injected into the DOM without a page reload.

### Demo Recording

![x402 Verification Flow](/Users/jackgao/.gemini/antigravity/brain/e9df2166-7e16-42a3-8894-2c6cf5f3ba1d/x402_verification_1766132898025.webp)

### Final State (Unlocked)

![Unlocked Article](/Users/jackgao/.gemini/antigravity/brain/e9df2166-7e16-42a3-8894-2c6cf5f3ba1d/unlocked_article_1766132941256.png)
