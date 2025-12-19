# x402 Micropay-Wall Blog Demo Implementation Plan

## Goal Description

Create a "Micropay-Wall" blog where premium content is protected by the x402 protocol. This demonstrates how a browser can seamlessly handle HTTP 402 responses, pay for content programmatically, and unlock the resource without a traditional login/subscription flow.

## Mock x402 Protocol Specification

Since the formal spec is hypothetical, we will use this convention:

1. **Challenge**: Server refuses premium content.

   - Status: `402 Payment Required`
   - Header: `WWW-Authenticate: X402 invoice="<uuid>", amount="0.01", currency="USD"`

2. **Payment**: Client "pays" the invoice (mock wallet interaction).

   - POST `/api/pay` with `{ invoice: "<uuid>" }`
   - Returns: `{ token: "pay_abc123" }`

3. **Redemption**: Client retries the request with proof of payment.
   - Header: `Authorization: X402 token="pay_abc123"`

## Proposed Changes

### Project Structure (Node.js)

Initialize a standard Express app in `.`.

#### [NEW] [server.js](file:///Users/jackgao/JKG_Data/codes/temp/x402-demo/server.js)

- **Dependencies**: `express` (web server), `uuid` (for invoices).
- **Endpoints**:
  - `GET /api/article`: Returns full content if valid token present. Returns `402` with valid invoice if not.
  - `POST /api/pay`: Mock payment gateway. Accepts invoice ID, returns payment token.
  - `GET /`: Serve static files.

#### [NEW] [public/index.html](file:///Users/jackgao/JKG_Data/codes/temp/x402-demo/public/index.html)

- A beautiful, minimalist blog article layout.
- "Premium Content" section is initially hidden or blurred (handled effectively by the backend not sending it, but frontend showing a "processing" state).

#### [NEW] [public/client.js](file:///Users/jackgao/JKG_Data/codes/temp/x402-demo/public/client.js)

- Fetches article content.
- Intercepts `402` errors.
- Extract `WWW-Authenticate` header.
- Calls `/api/pay` to simulate user confirmation (or auto-pay).
- Retries functionality with the new token.

#### [NEW] [public/style.css](file:///Users/jackgao/JKG_Data/codes/temp/x402-demo/public/style.css)

- Premium aesthetics: Serif fonts for readability, plenty of whitespace, subtle animations for the "unlocking" effect.

## Verification Plan

### Manual Verification

1. Open the page. Verify only the excerpt is visible or content is missing.
2. Watch the Network tab.
3. Observe the `402` error.
4. Click a "Read Full Article (0.01 USD)" button (or auto-trigger).
5. Verify the payment request and subsequent successful fetch of the full article.
