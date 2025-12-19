# x402 Micropay-Wall Demo

A specialized demonstration of the **x402 protocol** (HTTP 402 Payment Required), envisioning a 2025 web where micropayments are a native browser primitive.

This project implements a "Micropay-Wall" blog where premium content is unlocked programmatically via a simulated payment wallet, bypassing traditional subscriptions or login flows.

## 🚀 How It Works

1.  **Request**: Browser requests `/api/article`.
2.  **Challenge**: Server checks for a payment token. If missing, it returns `402 Payment Required` with an `X402` invoice header.
3.  **Interception**: Client-side JS intercepts the 402 status.
4.  **Payment**: User clicks "Pay Instantly". The Client POSTs the invoice to a mock Payment Gateway (`/api/pay`).
5.  **Redemption**: The Payment Gateway returns a token. The Client retries the original request with `Authorization: X402 token="..."`.
6.  **Unlock**: Server validates the token and serves the full content.

## 🛠️ Project Structure

- `server.js`: Node.js/Express server implementing the HTTP 402 logic.
- `public/`:
  - `client.js`: Intelligent agent handling the negotiation.
  - `index.html`: The article UI.
  - `style.css`: Premium editorial styling.

## 📦 Installation & Usage

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Start the Server**

    ```bash
    node server.js
    ```

3.  **View the Demo**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 Documentation

- **[Implementation Plan](implementation_plan.md)**: Detailed technical specs and protocol design.
- **[Walkthrough](walkthrough.md)**: Visual proof of verification and feature breakdown.

## 🔮 The Vision

HTTP 402 has been reserved since the 90s for digital cash. This demo helps visualize how reviving it can enable:

- AI Agents paying for API usage autonomously.
- Pay-per-article instead of monthly subscriptions.
- Frictionless, privacy-preserving micropayments.
