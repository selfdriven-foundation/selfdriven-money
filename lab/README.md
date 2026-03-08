npm install express cors helmet morgan uuid && node selfdriven-money-server.js

---

Understanding of the Australian CDR/Open Banking standard.
Implementing the Australian Consumer Data Right (CDR) Open Banking standard for selfdriven.money.
The API structure follows the Consumer Data Standards Australia specification at `consumerdatastandardsaustralia.github.io/standards/`.

**CDR Public APIs** (no auth, as per spec):
- `GET /cds-au/v1/banking/products` — Product listing with category filtering
- `GET /cds-au/v1/banking/products/:productId` — Product detail with features, fees, rates
- `GET /cds-au/v1/discovery/status` — CDR system status
- `GET /cds-au/v1/discovery/outages` — Scheduled outages

**CDR Authenticated APIs** (KERI bearer token + FAPI headers):
- `GET /cds-au/v1/banking/accounts` — Account listing
- `GET /cds-au/v1/banking/accounts/:id` — Account detail with BSB, account number, PayID
- `GET /cds-au/v1/banking/accounts/:id/balance` — Balance
- `GET /cds-au/v1/banking/accounts/balances` — Bulk balances
- `GET /cds-au/v1/banking/accounts/:id/transactions` — Transactions with search/filter
- `GET /cds-au/v1/banking/payees` — Payees (domestic BSB, PayID, BPAY billers)
- `GET /cds-au/v1/banking/payments/scheduled` — Scheduled payments
- `GET /cds-au/v1/banking/payments/direct-debits` — Direct debits
- `GET /cds-au/v1/common/customer` — Customer info (basic + detail)

**selfdriven.money Internal APIs** (KERI auth + passkey signing):
- `POST /api/v1/transfers` — Between own accounts
- `POST /api/v1/payments/domestic` — BSB or PayID (NPP real-time)
- `POST /api/v1/payments/bpay` — BPAY with biller code/CRN
- `POST /api/v1/payments/international` — SWIFT with FX rates/fees
- `GET/POST /api/v1/cards/*` — Card management, lock/unlock
- `GET /api/v1/insights/spending` — Spending categories and trends
- `GET /api/v1/accounts/:id/statements` — ACDC-attested statements

**KERI Identity APIs**:
- `GET /api/v1/identity/aid` — Full KERI key state
- `GET /api/v1/identity/credentials` — ACDC credentials (KYC, vLEI, account holder)
- `GET /api/v1/identity/kel` — Key Event Log
- `GET /api/v1/identity/passkeys` — Registered FIDO2 passkeys

Every mutating operation (transfers, payments, card actions) requires passkey verification and generates a KERI interaction event with a SHA-256 digest, creating a cryptographic audit trail. To run: `npm install express cors helmet morgan uuid && node server.js`