# Chasma — Cash on Delivery funnel

## What is included

- Next.js 14 + responsive custom CSS premium storefront
- Landing page, `/checkout`, `/thank-you`, and a secure `POST /api/order` route
- Google Sheets order append through a Google service account
- Gmail-compatible HTML notification email to the business and confirmation email to the customer
- Server-side validation, server-authoritative product price, duplicate-submit prevention, and no client-side secrets

## Order flow

1. The shopper selects quantity and clicks a CTA.
2. The selected quantity travels to checkout in the URL; product and price are filled automatically.
3. Checkout posts only to `/api/order`. The server revalidates the fixed product, unit price, and total.
4. The server creates an order ID, appends it to Google Sheets, then sends both emails.
5. Only after all three actions succeed does the shopper reach `/thank-you`.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local`—never commit it. `EMAIL_SERVICE_API_KEY` is kept as a placeholder for a future email provider but is not used by the SMTP implementation.

### Google Sheet

1. Create a Google Spreadsheet and create/rename the tab to `sheet1` (or set `GOOGLE_SHEET_TAB_NAME`).
2. Add this exact header row in row 1:

   `Order ID | Date & Time | Customer Name | Phone Number | Email Address | Exact Location | Product Name | Quantity | Price Per Piece | Total Price | Payment Method | Order Status | Notes`

3. In Google Sheets, use **Data → Create a filter** on that header row.
4. Select the Order Status column, then **Data → Data validation → Dropdown**. Add: `New Order`, `Order Confirmed`, `Order Ongoing`, `Delivered`, and `Cancelled`.
5. The Sheet ID is the part of its URL between `/d/` and `/edit`.
6. In Google Cloud, create a service account, enable the **Google Sheets API**, create a JSON key, and copy its `client_email` to `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` to `GOOGLE_PRIVATE_KEY`. Preserve newline escapes as `\\n` in `.env.local`.
7. Share the spreadsheet with the service account email as **Editor**.

### Email / Gmail SMTP

For Gmail, set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER` to the Gmail sender, and `SMTP_PASS` to a [Google App Password](https://myaccount.google.com/apppasswords), not your normal Google password. Set `BUSINESS_EMAIL` to the inbox that receives orders and `EMAIL_FROM` to a verified sender address.

## Test before launch

With valid environment variables, place a test order using your own email. Confirm a new Google Sheet row, the business notification, the customer receipt, and redirect to `/thank-you`. Do not rely on a successful UI redirect alone.

## Vercel deployment

1. Push the project to GitHub and import it at [Vercel](https://vercel.com/new).
2. Add every key from `.env.example` under **Settings → Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the deployed `https://` URL.
4. Deploy, then run the test order above on the production URL.

`GOOGLE_PRIVATE_KEY` needs its literal `\\n` escapes in Vercel. The API route runs on the Node.js runtime, so it supports the Google and SMTP SDKs.
