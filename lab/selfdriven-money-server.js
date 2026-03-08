// ═══════════════════════════════════════════════════════════════
// selfdriven.money — server.js
// Banking Server implementing Australian Consumer Data Right (CDR)
// Open Banking Standard (Consumer Data Standards Australia)
//
// Base path: /cds-au/v1/banking/*
// Spec: https://consumerdatastandardsaustralia.github.io/standards/
// ═══════════════════════════════════════════════════════════════

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ─────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Serve the banking webapp
app.use(express.static("public"));

// ─── CDR Mandatory Headers Middleware ──────────────────────────
// CDR requires specific request/response headers
function cdrHeaders(req, res, next) {
  // Validate mandatory CDR request headers
  const version = req.headers["x-v"];
  const minVersion = req.headers["x-min-v"];
  const fapiInteractionId = req.headers["x-fapi-interaction-id"] || uuidv4();

  // Set CDR response headers
  res.set("x-v", version || "1");
  res.set("x-fapi-interaction-id", fapiInteractionId);

  req.cdr = {
    version: parseInt(version) || 1,
    minVersion: parseInt(minVersion) || 1,
    interactionId: fapiInteractionId,
  };

  next();
}

// ─── KERI Identity Middleware ──────────────────────────────────
// Validates KERI AID-based bearer tokens for authenticated endpoints
function keriAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      errors: [{
        code: "urn:au-cds:error:cds-all:Authorisation/InvalidConsent",
        title: "Unauthorised",
        detail: "Missing or invalid KERI-authenticated bearer token",
      }],
    });
  }

  // In production, this validates the KERI AID signature chain
  // and checks the ACDC credential for banking scope authorisation
  const token = authHeader.slice(7);
  req.keriAid = decodeKeriToken(token);

  if (!req.keriAid) {
    return res.status(403).json({
      errors: [{
        code: "urn:au-cds:error:cds-all:Authorisation/InvalidConsent",
        title: "Forbidden",
        detail: "KERI AID verification failed or ACDC credential expired",
      }],
    });
  }

  // Verify the FAPI customer IP and auth date headers
  req.cdr.customerIp = req.headers["x-fapi-customer-ip-address"];
  req.cdr.authDate = req.headers["x-fapi-auth-date"];
  req.cdr.customerPresent = !!req.cdr.customerIp;

  next();
}

function decodeKeriToken(token) {
  // Stub: In production, verifies KERI key event log and ACDC credential
  // Returns the customer context if valid
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch {
    // For development: accept any token and return mock customer
    return {
      aid: "EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt",
      name: "Mark Byers",
      customerId: "cust-001",
    };
  }
}

// ─── Passkey / WebAuthn Middleware ─────────────────────────────
// Transaction signing via FIDO2 passkeys linked to KERI AIDs
function passkeyVerify(req, res, next) {
  const sig = req.headers["x-selfdriven-passkey-signature"];
  const challenge = req.headers["x-selfdriven-passkey-challenge"];

  if (!sig || !challenge) {
    return res.status(403).json({
      errors: [{
        code: "urn:selfdriven:error:Authorisation/PasskeyRequired",
        title: "Passkey Verification Required",
        detail: "This transaction requires passkey (FIDO2/WebAuthn) signature verification",
      }],
    });
  }

  // In production: verify WebAuthn assertion against registered credential
  // linked to the customer's KERI AID via ixn (interaction) event
  req.passkeyVerified = true;
  next();
}

// ─── CDR Pagination Helper ────────────────────────────────────
function paginate(data, page = 1, pageSize = 25) {
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: data.slice(start, end),
    meta: { totalRecords, totalPages },
    links: {
      self: `?page=${page}&page-size=${pageSize}`,
      first: `?page=1&page-size=${pageSize}`,
      last: `?page=${totalPages}&page-size=${pageSize}`,
      ...(page > 1 && { prev: `?page=${page - 1}&page-size=${pageSize}` }),
      ...(page < totalPages && { next: `?page=${page + 1}&page-size=${pageSize}` }),
    },
  };
}


// ═══════════════════════════════════════════════════════════════
// CDR OPEN BANKING APIs — PUBLIC (No auth required)
// Base: /cds-au/v1/banking
// ═══════════════════════════════════════════════════════════════

// ─── GET /banking/products ────────────────────────────────────
// Returns list of publicly available banking products
// CDR: Get Products (public, unauthenticated)
app.get("/cds-au/v1/banking/products", cdrHeaders, (req, res) => {
  const {
    effective = "CURRENT",
    "updated-since": updatedSince,
    brand,
    "product-category": productCategory,
    page = 1,
    "page-size": pageSize = 25,
  } = req.query;

  let products = PRODUCTS;

  if (productCategory) {
    products = products.filter(p => p.productCategory === productCategory);
  }

  if (brand) {
    products = products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
  }

  const result = paginate(products, parseInt(page), parseInt(pageSize));

  res.json({
    data: { products: result.data },
    links: result.links,
    meta: result.meta,
  });
});

// ─── GET /banking/products/:productId ─────────────────────────
// Returns detailed product information
// CDR: Get Product Detail (public, unauthenticated)
app.get("/cds-au/v1/banking/products/:productId", cdrHeaders, (req, res) => {
  const product = PRODUCTS.find(p => p.productId === req.params.productId);

  if (!product) {
    return res.status(404).json({
      errors: [{
        code: "urn:au-cds:error:cds-banking:Authorisation/InvalidBankingAccount",
        title: "Product Not Found",
        detail: req.params.productId,
      }],
    });
  }

  res.json({
    data: { ...product, ...PRODUCT_DETAILS[product.productId] },
    links: { self: req.originalUrl },
    meta: {},
  });
});


// ═══════════════════════════════════════════════════════════════
// CDR OPEN BANKING APIs — AUTHENTICATED (KERI + FAPI)
// Require: Authorization header with KERI-signed bearer token
// ═══════════════════════════════════════════════════════════════

// ─── GET /banking/accounts ────────────────────────────────────
// Returns accounts for the authenticated customer
// CDR: Get Accounts
app.get("/cds-au/v1/banking/accounts", cdrHeaders, keriAuth, (req, res) => {
  const {
    "product-category": productCategory,
    "open-status": openStatus = "OPEN",
    "is-owned": isOwned,
    page = 1,
    "page-size": pageSize = 25,
  } = req.query;

  let accounts = ACCOUNTS.filter(a => a.customerId === req.keriAid.customerId);

  if (productCategory) {
    accounts = accounts.filter(a => a.productCategory === productCategory);
  }
  if (openStatus !== "ALL") {
    accounts = accounts.filter(a => a.openStatus === openStatus);
  }

  const result = paginate(accounts, parseInt(page), parseInt(pageSize));

  res.json({
    data: { accounts: result.data.map(formatAccountSummary) },
    links: result.links,
    meta: result.meta,
  });
});

// ─── GET /banking/accounts/:accountId ─────────────────────────
// Returns detailed account information
// CDR: Get Account Detail
app.get("/cds-au/v1/banking/accounts/:accountId", cdrHeaders, keriAuth, (req, res) => {
  const account = ACCOUNTS.find(
    a => a.accountId === req.params.accountId && a.customerId === req.keriAid.customerId
  );

  if (!account) {
    return res.status(404).json({
      errors: [{
        code: "urn:au-cds:error:cds-banking:Authorisation/UnavailableBankingAccount",
        title: "Unavailable Banking Account",
        detail: req.params.accountId,
      }],
    });
  }

  res.json({
    data: formatAccountDetail(account),
    links: { self: req.originalUrl },
    meta: {},
  });
});

// ─── GET /banking/accounts/:accountId/balance ─────────────────
// Returns account balance
// CDR: Get Account Balance
app.get("/cds-au/v1/banking/accounts/:accountId/balance", cdrHeaders, keriAuth, (req, res) => {
  const account = ACCOUNTS.find(
    a => a.accountId === req.params.accountId && a.customerId === req.keriAid.customerId
  );

  if (!account) {
    return res.status(404).json({
      errors: [{
        code: "urn:au-cds:error:cds-banking:Authorisation/UnavailableBankingAccount",
        title: "Unavailable Banking Account",
        detail: req.params.accountId,
      }],
    });
  }

  res.json({
    data: {
      accountId: account.accountId,
      currentBalance: account.currentBalance,
      availableBalance: account.availableBalance,
      creditLimit: account.creditLimit || null,
      amortisedLimit: null,
      currency: "AUD",
      purses: null,
    },
    links: { self: req.originalUrl },
    meta: {},
  });
});

// ─── GET /banking/accounts/balances ───────────────────────────
// Returns balances for all accounts (bulk)
// CDR: Get Bulk Balances
app.get("/cds-au/v1/banking/accounts/balances", cdrHeaders, keriAuth, (req, res) => {
  const accounts = ACCOUNTS.filter(a => a.customerId === req.keriAid.customerId);

  const balances = accounts.map(a => ({
    accountId: a.accountId,
    currentBalance: a.currentBalance,
    availableBalance: a.availableBalance,
    creditLimit: a.creditLimit || null,
    amortisedLimit: null,
    currency: "AUD",
    purses: null,
  }));

  res.json({
    data: { balances },
    links: { self: req.originalUrl },
    meta: { totalRecords: balances.length, totalPages: 1 },
  });
});

// ─── GET /banking/accounts/:accountId/transactions ────────────
// Returns transactions for an account
// CDR: Get Transactions For Account
app.get("/cds-au/v1/banking/accounts/:accountId/transactions", cdrHeaders, keriAuth, (req, res) => {
  const {
    "oldest-time": oldestTime,
    "newest-time": newestTime,
    "min-amount": minAmount,
    "max-amount": maxAmount,
    text,
    page = 1,
    "page-size": pageSize = 25,
  } = req.query;

  const account = ACCOUNTS.find(
    a => a.accountId === req.params.accountId && a.customerId === req.keriAid.customerId
  );

  if (!account) {
    return res.status(404).json({
      errors: [{
        code: "urn:au-cds:error:cds-banking:Authorisation/UnavailableBankingAccount",
        title: "Unavailable Banking Account",
        detail: req.params.accountId,
      }],
    });
  }

  let txns = TRANSACTIONS.filter(t => t.accountId === req.params.accountId);

  if (text) {
    txns = txns.filter(t => t.description.toLowerCase().includes(text.toLowerCase()));
  }
  if (minAmount) {
    txns = txns.filter(t => Math.abs(parseFloat(t.amount)) >= parseFloat(minAmount));
  }
  if (maxAmount) {
    txns = txns.filter(t => Math.abs(parseFloat(t.amount)) <= parseFloat(maxAmount));
  }

  const result = paginate(txns, parseInt(page), parseInt(pageSize));

  res.json({
    data: { transactions: result.data.map(formatTransaction) },
    links: result.links,
    meta: {
      ...result.meta,
      isQueryParamUnsupported: false,
    },
  });
});

// ─── GET /banking/payees ──────────────────────────────────────
// Returns payees for the authenticated customer
// CDR: Get Payees
app.get("/cds-au/v1/banking/payees", cdrHeaders, keriAuth, (req, res) => {
  const { type, page = 1, "page-size": pageSize = 25 } = req.query;

  let payees = PAYEES.filter(p => p.customerId === req.keriAid.customerId);

  if (type) {
    payees = payees.filter(p => p.type === type);
  }

  const result = paginate(payees, parseInt(page), parseInt(pageSize));

  res.json({
    data: { payees: result.data.map(formatPayee) },
    links: result.links,
    meta: result.meta,
  });
});

// ─── GET /banking/payees/:payeeId ─────────────────────────────
// Returns detail for a specific payee
// CDR: Get Payee Detail
app.get("/cds-au/v1/banking/payees/:payeeId", cdrHeaders, keriAuth, (req, res) => {
  const payee = PAYEES.find(
    p => p.payeeId === req.params.payeeId && p.customerId === req.keriAid.customerId
  );

  if (!payee) {
    return res.status(404).json({
      errors: [{
        code: "urn:au-cds:error:cds-banking:Resource/NotFound",
        title: "Payee Not Found",
        detail: req.params.payeeId,
      }],
    });
  }

  res.json({
    data: formatPayeeDetail(payee),
    links: { self: req.originalUrl },
    meta: {},
  });
});

// ─── GET /banking/payments/scheduled ──────────────────────────
// Returns scheduled payments for the authenticated customer
// CDR: Get Scheduled Payments Bulk
app.get("/cds-au/v1/banking/payments/scheduled", cdrHeaders, keriAuth, (req, res) => {
  const { page = 1, "page-size": pageSize = 25 } = req.query;

  const payments = SCHEDULED_PAYMENTS.filter(p => p.customerId === req.keriAid.customerId);
  const result = paginate(payments, parseInt(page), parseInt(pageSize));

  res.json({
    data: { scheduledPayments: result.data.map(formatScheduledPayment) },
    links: result.links,
    meta: result.meta,
  });
});

// ─── GET /banking/payments/direct-debits ──────────────────────
// Returns direct debits across all accounts
// CDR: Get Direct Debits Bulk
app.get("/cds-au/v1/banking/payments/direct-debits", cdrHeaders, keriAuth, (req, res) => {
  const { page = 1, "page-size": pageSize = 25 } = req.query;

  const debits = DIRECT_DEBITS.filter(d => d.customerId === req.keriAid.customerId);
  const result = paginate(debits, parseInt(page), parseInt(pageSize));

  res.json({
    data: { directDebitAuthorisations: result.data.map(formatDirectDebit) },
    links: result.links,
    meta: result.meta,
  });
});


// ═══════════════════════════════════════════════════════════════
// CDR COMMON APIs (Customer information)
// Base: /cds-au/v1/common
// ═══════════════════════════════════════════════════════════════

// ─── GET /common/customer ─────────────────────────────────────
// Returns basic customer information
// CDR: Get Customer
app.get("/cds-au/v1/common/customer", cdrHeaders, keriAuth, (req, res) => {
  res.json({
    data: {
      customerUType: "person",
      person: {
        lastUpdateTime: "2026-03-01T00:00:00+11:00",
        firstName: "Mark",
        lastName: "Byers",
        middleNames: [],
        prefix: "Mr",
        occupationCode: "261111", // ICT Business Analyst (ANZSCO)
        occupationCodeVersion: "1220.0 2013, Version 1.3",
      },
    },
    links: { self: req.originalUrl },
    meta: {},
  });
});

// ─── GET /common/customer/detail ──────────────────────────────
// Returns detailed customer information
// CDR: Get Customer Detail
app.get("/cds-au/v1/common/customer/detail", cdrHeaders, keriAuth, (req, res) => {
  res.json({
    data: {
      customerUType: "person",
      person: {
        lastUpdateTime: "2026-03-01T00:00:00+11:00",
        firstName: "Mark",
        lastName: "Byers",
        middleNames: [],
        prefix: "Mr",
        occupationCode: "261111",
        occupationCodeVersion: "1220.0 2013, Version 1.3",
        phoneNumbers: [
          { isPreferred: true, purpose: "MOBILE", countryCode: "+61", fullNumber: "+614XXXXXXXX" },
        ],
        emailAddresses: [
          { isPreferred: true, purpose: "WORK", address: "mark@selfdriven.foundation" },
        ],
        physicalAddresses: [
          {
            addressUType: "simple",
            simple: {
              mailingName: "Mark Byers",
              addressLine1: "*** ********",
              city: "Sydney",
              state: "NSW",
              postcode: "2000",
              country: "AUS",
            },
            purpose: "REGISTERED",
          },
        ],
      },
    },
    links: { self: req.originalUrl },
    meta: {},
  });
});


// ═══════════════════════════════════════════════════════════════
// selfdriven.money INTERNAL APIs (Non-CDR)
// Banking operations, payments, KERI identity
// ═══════════════════════════════════════════════════════════════

// ─── POST /api/v1/transfers ───────────────────────────────────
// Transfer between own accounts
app.post("/api/v1/transfers", keriAuth, passkeyVerify, (req, res) => {
  const { fromAccountId, toAccountId, amount, description } = req.body;

  if (!fromAccountId || !toAccountId || !amount) {
    return res.status(400).json({
      errors: [{ code: "INVALID_REQUEST", title: "Missing required fields" }],
    });
  }

  const transfer = {
    transferId: uuidv4(),
    fromAccountId,
    toAccountId,
    amount: parseFloat(amount).toFixed(2),
    currency: "AUD",
    description: description || "Transfer between accounts",
    status: "COMPLETED",
    executionDateTime: new Date().toISOString(),
    keriEvent: {
      type: "ixn",
      aid: req.keriAid.aid,
      sn: Date.now(),
      digest: crypto.createHash("sha256").update(JSON.stringify(req.body)).digest("hex"),
    },
  };

  res.status(201).json({ data: transfer });
});

// ─── POST /api/v1/payments/domestic ───────────────────────────
// Pay to BSB/account number or PayID
app.post("/api/v1/payments/domestic", keriAuth, passkeyVerify, (req, res) => {
  const { fromAccountId, payeeType, payee, amount, description, schedule } = req.body;

  if (!fromAccountId || !payeeType || !amount) {
    return res.status(400).json({
      errors: [{ code: "INVALID_REQUEST", title: "Missing required fields" }],
    });
  }

  // Validate payee type
  const validPayeeTypes = ["BSB", "PAYID_EMAIL", "PAYID_PHONE", "PAYID_ABN", "PAYID_ORG_ID"];
  if (!validPayeeTypes.includes(payeeType)) {
    return res.status(400).json({
      errors: [{ code: "INVALID_PAYEE_TYPE", title: `Invalid payee type. Must be one of: ${validPayeeTypes.join(", ")}` }],
    });
  }

  const payment = {
    paymentId: uuidv4(),
    fromAccountId,
    payeeType,
    payee,
    amount: parseFloat(amount).toFixed(2),
    currency: "AUD",
    description,
    // NPP real-time for PayID, standard clearing for BSB
    paymentMethod: payeeType.startsWith("PAYID") ? "NPP" : "DE",
    status: schedule ? "SCHEDULED" : "PROCESSING",
    schedule: schedule || null,
    executionDateTime: schedule ? null : new Date().toISOString(),
    estimatedArrival: payeeType.startsWith("PAYID")
      ? new Date().toISOString() // NPP: instant
      : new Date(Date.now() + 86400000).toISOString(), // DE: next business day
    keriEvent: {
      type: "ixn",
      aid: req.keriAid.aid,
      sn: Date.now(),
      digest: crypto.createHash("sha256").update(JSON.stringify(req.body)).digest("hex"),
    },
  };

  res.status(201).json({ data: payment });
});

// ─── POST /api/v1/payments/bpay ───────────────────────────────
// BPAY bill payment
app.post("/api/v1/payments/bpay", keriAuth, passkeyVerify, (req, res) => {
  const { fromAccountId, billerCode, crn, amount, payDate } = req.body;

  if (!fromAccountId || !billerCode || !crn || !amount) {
    return res.status(400).json({
      errors: [{ code: "INVALID_REQUEST", title: "Missing required fields: fromAccountId, billerCode, crn, amount" }],
    });
  }

  // Validate biller code format (typically 4-6 digits)
  if (!/^\d{4,6}$/.test(billerCode)) {
    return res.status(400).json({
      errors: [{ code: "INVALID_BILLER_CODE", title: "Biller code must be 4-6 digits" }],
    });
  }

  const payment = {
    paymentId: uuidv4(),
    type: "BPAY",
    fromAccountId,
    billerCode,
    billerName: BPAY_BILLERS[billerCode] || "Unknown Biller",
    crn,
    amount: parseFloat(amount).toFixed(2),
    currency: "AUD",
    payDate: payDate || new Date().toISOString().split("T")[0],
    status: payDate && payDate > new Date().toISOString().split("T")[0] ? "SCHEDULED" : "PROCESSING",
    keriEvent: {
      type: "ixn",
      aid: req.keriAid.aid,
      sn: Date.now(),
      digest: crypto.createHash("sha256").update(JSON.stringify(req.body)).digest("hex"),
    },
  };

  res.status(201).json({ data: payment });
});

// ─── POST /api/v1/payments/international ──────────────────────
// International wire transfer (SWIFT)
app.post("/api/v1/payments/international", keriAuth, passkeyVerify, (req, res) => {
  const {
    fromAccountId, recipientName, recipientCountry,
    swiftBic, accountNumber, amount, currency = "AUD",
    reason, description,
  } = req.body;

  if (!fromAccountId || !recipientName || !swiftBic || !accountNumber || !amount) {
    return res.status(400).json({
      errors: [{ code: "INVALID_REQUEST", title: "Missing required fields for international transfer" }],
    });
  }

  // Calculate FX and fees
  const fxRates = { USD: 0.6524, GBP: 0.5142, NZD: 1.0891, JPY: 98.42, SGD: 0.8823, EUR: 0.6012 };
  const targetCurrency = currency !== "AUD" ? currency : "USD";
  const rate = fxRates[targetCurrency] || 0.65;
  const fee = 22.00;
  const convertedAmount = (parseFloat(amount) * rate).toFixed(2);

  const payment = {
    paymentId: uuidv4(),
    type: "INTERNATIONAL",
    fromAccountId,
    recipient: {
      name: recipientName,
      country: recipientCountry,
      swiftBic,
      accountNumber,
    },
    sendAmount: parseFloat(amount).toFixed(2),
    sendCurrency: "AUD",
    receiveAmount: convertedAmount,
    receiveCurrency: targetCurrency,
    exchangeRate: rate,
    fee: fee.toFixed(2),
    feeCurrency: "AUD",
    reason,
    description,
    status: "PROCESSING",
    estimatedArrival: new Date(Date.now() + 3 * 86400000).toISOString(), // T+3
    keriEvent: {
      type: "ixn",
      aid: req.keriAid.aid,
      sn: Date.now(),
      digest: crypto.createHash("sha256").update(JSON.stringify(req.body)).digest("hex"),
    },
  };

  res.status(201).json({ data: payment });
});


// ═══════════════════════════════════════════════════════════════
// KERI IDENTITY APIs
// Sovereign identity management
// ═══════════════════════════════════════════════════════════════

// ─── GET /api/v1/identity/aid ─────────────────────────────────
// Returns the customer's KERI AID and key state
app.get("/api/v1/identity/aid", keriAuth, (req, res) => {
  res.json({
    data: {
      aid: req.keriAid.aid,
      state: {
        vn: [1, 0],
        i: req.keriAid.aid,
        s: "24",
        p: "EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt",
        d: "EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt",
        f: "24",
        dt: "2026-03-01T00:00:00.000000+00:00",
        et: "ixn",
        kt: "1",
        k: ["DKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt"],
        nt: "1",
        n: ["EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt"],
        bt: "3",
        b: [
          "BIFb5aLVAOx4nP7Bfqt4V2dppXEkjjMFiEPKMVkz_kRV", // witness 1
          "BFUOmK7xGLZsb7hzuQPPXc7VyYLcJOK1qHiJjOP3mXVS", // witness 2
          "BMsHByVxV2r0GFhnAponn3E0qcZifQXoZSm2c4Gx5_YF", // witness 3
        ],
        c: [],
        ee: { s: "23", d: "EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt", br: [], ba: [] },
        di: "",
      },
    },
    links: { self: req.originalUrl },
  });
});

// ─── GET /api/v1/identity/credentials ─────────────────────────
// Returns ACDC credentials held by the customer
app.get("/api/v1/identity/credentials", keriAuth, (req, res) => {
  res.json({
    data: {
      credentials: [
        {
          said: "EBfdlu8R27Fbx-ehrqwImnK-8Cm79sqbAQ4MmvEAYqao",
          schema: "EBf...qR7",
          type: "KYC_ATTESTATION",
          issuer: "selfdriven.money compliance",
          issuanceDate: "2025-07-12T00:00:00Z",
          status: "VERIFIED",
          attributes: { level: "FULL", jurisdiction: "AU", amlChecked: true },
        },
        {
          said: "ECKydq2R27Fbx-ehrqwImnK-8Cm79sqbAQ4MmvEAYqao",
          schema: "EXk...m3P",
          type: "ACCOUNT_HOLDER",
          issuer: "selfdriven.money",
          issuanceDate: "2025-07-12T00:00:00Z",
          status: "VERIFIED",
          attributes: { accounts: ["acct-001", "acct-002", "acct-003", "acct-004"] },
        },
        {
          said: "EFGtlu8R27Fbx-ehrqwImnK-8Cm79sqbAQ4MmvEAYqao",
          schema: "EBf...qR7",
          type: "VLEI_LEGAL_ENTITY",
          issuer: "GLEIF QVI",
          issuanceDate: "2025-01-10T00:00:00Z",
          status: "VERIFIED",
          attributes: { lei: "5493001KJTIIGC8Y1R17", entity: "selfdriven Foundation" },
        },
      ],
    },
    links: { self: req.originalUrl },
  });
});

// ─── GET /api/v1/identity/kel ─────────────────────────────────
// Returns the Key Event Log for the customer's AID
app.get("/api/v1/identity/kel", keriAuth, (req, res) => {
  res.json({
    data: {
      aid: req.keriAid.aid,
      events: [
        { sn: 0, type: "icp", dt: "2025-01-10T00:00:00Z", description: "Inception — Ed25519 + Passkey binding" },
        { sn: 5, type: "rot", dt: "2025-07-10T00:00:00Z", description: "Scheduled key rotation" },
        { sn: 6, type: "ixn", dt: "2025-07-12T00:00:00Z", description: "Banking credential anchored (KYC)" },
        { sn: 12, type: "dip", dt: "2025-09-03T00:00:00Z", description: "Delegated inception — Agent sub-AID" },
        { sn: 20, type: "ixn", dt: "2026-02-14T00:00:00Z", description: "Second passkey registered (iPhone)" },
        { sn: 23, type: "rot", dt: "2026-03-01T00:00:00Z", description: "Scheduled key rotation" },
      ],
    },
    links: { self: req.originalUrl },
  });
});

// ─── GET /api/v1/identity/passkeys ────────────────────────────
// Returns registered passkeys linked to KERI AID
app.get("/api/v1/identity/passkeys", keriAuth, (req, res) => {
  res.json({
    data: {
      passkeys: [
        {
          credentialId: "YTJhM2E4ZjItNWE5...",
          publicKeyAlgorithm: "ES256",
          deviceName: "MacBook Pro — Touch ID",
          registeredAt: "2025-01-10T00:00:00Z",
          lastUsedAt: "2026-03-07T12:34:00Z",
          keriIxnSn: 0, // linked to inception event
          transports: ["internal"],
        },
        {
          credentialId: "ZDc3NTFkYzctOGRi...",
          publicKeyAlgorithm: "ES256",
          deviceName: "iPhone 16 Pro — Face ID",
          registeredAt: "2026-02-14T00:00:00Z",
          lastUsedAt: "2026-03-06T18:22:00Z",
          keriIxnSn: 20, // linked to interaction event
          transports: ["internal", "hybrid"],
        },
      ],
    },
    links: { self: req.originalUrl },
  });
});


// ═══════════════════════════════════════════════════════════════
// SPENDING INSIGHTS API
// ═══════════════════════════════════════════════════════════════

app.get("/api/v1/insights/spending", keriAuth, (req, res) => {
  const { period = "CURRENT_MONTH" } = req.query;

  res.json({
    data: {
      period,
      totalSpent: "3847.22",
      totalIncome: "8450.00",
      netPosition: "4602.78",
      savingsRate: "0.54",
      budget: "5000.00",
      categories: [
        { category: "HOUSING", label: "Housing & Utilities", amount: "2840.00", percentage: 0.738, transactionCount: 2 },
        { category: "GROCERIES", label: "Groceries", amount: "412.30", percentage: 0.107, transactionCount: 8 },
        { category: "DINING", label: "Dining & Takeaway", amount: "186.50", percentage: 0.048, transactionCount: 5 },
        { category: "TRANSPORT", label: "Transport", amount: "148.42", percentage: 0.039, transactionCount: 4 },
        { category: "SHOPPING", label: "Shopping", amount: "89.99", percentage: 0.023, transactionCount: 1 },
        { category: "SUBSCRIPTIONS", label: "Bills & Subscriptions", amount: "170.01", percentage: 0.044, transactionCount: 6 },
      ],
      monthlyTrend: [
        { month: "2025-10", spent: "4200.00" },
        { month: "2025-11", spent: "3900.00" },
        { month: "2025-12", spent: "5100.00" },
        { month: "2026-01", spent: "4400.00" },
        { month: "2026-02", spent: "4300.00" },
        { month: "2026-03", spent: "3847.22" },
      ],
    },
    links: { self: req.originalUrl },
  });
});


// ═══════════════════════════════════════════════════════════════
// CARD MANAGEMENT APIs
// ═══════════════════════════════════════════════════════════════

app.get("/api/v1/cards", keriAuth, (req, res) => {
  res.json({
    data: {
      cards: [
        {
          cardId: "card-001",
          type: "DEBIT",
          scheme: "VISA",
          maskedNumber: "4823 **** **** 7741",
          nameOnCard: "MARK BYERS",
          expiryDate: "09/28",
          status: "ACTIVE",
          linkedAccountId: "acct-001",
          limits: { daily: "5000.00", contactless: "200.00", international: true, online: true, atm: true },
          digitalWallets: [
            { provider: "APPLE_PAY", status: "ACTIVE", deviceName: "iPhone 16 Pro" },
            { provider: "GOOGLE_PAY", status: "ACTIVE", deviceName: "Pixel 9" },
          ],
        },
        {
          cardId: "card-002",
          type: "CREDIT",
          scheme: "MASTERCARD",
          tier: "PLATINUM",
          maskedNumber: "5412 **** **** 3309",
          nameOnCard: "MARK BYERS",
          expiryDate: "11/27",
          status: "ACTIVE",
          creditLimit: "15000.00",
          availableCredit: "12240.50",
          balanceOwing: "2759.50",
          minimumPayment: "55.19",
          paymentDueDate: "2026-03-22",
          interestRate: "20.99",
          limits: { international: true, online: true },
        },
      ],
    },
    links: { self: req.originalUrl },
  });
});

// ─── POST /api/v1/cards/:cardId/lock ──────────────────────────
app.post("/api/v1/cards/:cardId/lock", keriAuth, passkeyVerify, (req, res) => {
  res.json({
    data: {
      cardId: req.params.cardId,
      status: "LOCKED",
      lockedAt: new Date().toISOString(),
      lockedBy: req.keriAid.aid,
      keriEvent: {
        type: "ixn",
        aid: req.keriAid.aid,
        sn: Date.now(),
        description: `Card ${req.params.cardId} locked`,
      },
    },
  });
});

// ─── POST /api/v1/cards/:cardId/unlock ────────────────────────
app.post("/api/v1/cards/:cardId/unlock", keriAuth, passkeyVerify, (req, res) => {
  res.json({
    data: {
      cardId: req.params.cardId,
      status: "ACTIVE",
      unlockedAt: new Date().toISOString(),
      unlockedBy: req.keriAid.aid,
    },
  });
});


// ═══════════════════════════════════════════════════════════════
// STATEMENTS API
// ═══════════════════════════════════════════════════════════════

app.get("/api/v1/accounts/:accountId/statements", keriAuth, (req, res) => {
  const account = ACCOUNTS.find(
    a => a.accountId === req.params.accountId && a.customerId === req.keriAid.customerId
  );

  if (!account) {
    return res.status(404).json({
      errors: [{ code: "ACCOUNT_NOT_FOUND", title: "Account not found" }],
    });
  }

  res.json({
    data: {
      statements: [
        { statementId: "stmt-202602", period: "1 Feb – 28 Feb 2026", openingBalance: "7237.57", closingBalance: "12895.48", format: "PDF", acdcAttested: true },
        { statementId: "stmt-202601", period: "1 Jan – 31 Jan 2026", openingBalance: "5104.22", closingBalance: "7237.57", format: "PDF", acdcAttested: true },
        { statementId: "stmt-202512", period: "1 Dec – 31 Dec 2025", openingBalance: "6892.10", closingBalance: "5104.22", format: "PDF", acdcAttested: true },
      ],
    },
    links: { self: req.originalUrl },
  });
});


// ═══════════════════════════════════════════════════════════════
// CDR ADMIN/DISCOVERY APIs
// ═══════════════════════════════════════════════════════════════

// ─── GET /cds-au/v1/discovery/status ──────────────────────────
app.get("/cds-au/v1/discovery/status", cdrHeaders, (req, res) => {
  res.json({
    data: {
      status: "OK",
      explanation: null,
      detectionTime: null,
      expectedResolutionTime: null,
      updateTime: new Date().toISOString(),
    },
    links: { self: req.originalUrl },
    meta: {},
  });
});

// ─── GET /cds-au/v1/discovery/outages ─────────────────────────
app.get("/cds-au/v1/discovery/outages", cdrHeaders, (req, res) => {
  res.json({
    data: {
      outages: [],
    },
    links: { self: req.originalUrl },
    meta: {},
  });
});


// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "selfdriven.money",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    components: {
      database: "connected",
      keriWitness: "3/3 active",
      npp: "connected",
      bpay: "connected",
      cardSchemes: "connected",
    },
  });
});


// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const PRODUCTS = [
  {
    productId: "prod-everyday",
    effectiveFrom: "2025-01-01T00:00:00+11:00",
    lastUpdated: "2026-03-01T00:00:00+11:00",
    productCategory: "TRANS_AND_SAVINGS_ACCOUNTS",
    name: "Everyday Account",
    description: "Zero monthly fees. Visa Debit. Real-time PayID. KERI-verified identity.",
    brand: "selfdriven.money",
    brandName: "selfdriven.money",
    isTailored: false,
    additionalInformation: {
      overviewUri: "https://selfdriven.money/products/everyday",
      termsUri: "https://selfdriven.money/legal/terms",
      eligibilityUri: "https://selfdriven.money/products/everyday/eligibility",
      feesAndPricingUri: "https://selfdriven.money/products/everyday/fees",
    },
  },
  {
    productId: "prod-goalsaver",
    effectiveFrom: "2025-01-01T00:00:00+11:00",
    lastUpdated: "2026-03-01T00:00:00+11:00",
    productCategory: "TRANS_AND_SAVINGS_ACCOUNTS",
    name: "Goal Saver",
    description: "5.25% p.a. bonus interest. Grow your savings with sovereign identity protection.",
    brand: "selfdriven.money",
    brandName: "selfdriven.money",
    isTailored: false,
  },
  {
    productId: "prod-termdeposit",
    effectiveFrom: "2025-01-01T00:00:00+11:00",
    lastUpdated: "2026-03-01T00:00:00+11:00",
    productCategory: "TERM_DEPOSITS",
    name: "Term Deposit",
    description: "Competitive fixed rates from 3 to 36 months. ACDC-attested deposit certificates.",
    brand: "selfdriven.money",
    brandName: "selfdriven.money",
    isTailored: false,
  },
  {
    productId: "prod-homeloan",
    effectiveFrom: "2025-01-01T00:00:00+11:00",
    lastUpdated: "2026-03-01T00:00:00+11:00",
    productCategory: "RESIDENTIAL_MORTGAGES",
    name: "Home Loan — Variable",
    description: "Competitive variable rate with 100% offset. KERI-signed loan agreements.",
    brand: "selfdriven.money",
    brandName: "selfdriven.money",
    isTailored: false,
  },
  {
    productId: "prod-creditcard",
    effectiveFrom: "2025-01-01T00:00:00+11:00",
    lastUpdated: "2026-03-01T00:00:00+11:00",
    productCategory: "CRED_AND_CHRG_CARDS",
    name: "Platinum Credit Card",
    description: "Mastercard Platinum with comprehensive travel insurance and rewards.",
    brand: "selfdriven.money",
    brandName: "selfdriven.money",
    isTailored: false,
  },
];

const PRODUCT_DETAILS = {
  "prod-everyday": {
    features: [
      { featureType: "CARD_ACCESS", additionalValue: "Visa Debit with contactless and mobile wallet support" },
      { featureType: "DIGITAL_BANKING", additionalValue: "Full web and mobile banking with passkey authentication" },
      { featureType: "NPP_PAYID", additionalValue: "PayID registration via email, mobile, or ABN" },
      { featureType: "ADDITIONAL_CARDS", additionalValue: "Up to 4 additional cardholders" },
      { featureType: "OTHER", additionalValue: "KERI autonomous identifier with ACDC credential attestation" },
    ],
    fees: [
      { name: "Monthly Account Fee", feeType: "PERIODIC", amount: "0.00", currency: "AUD", additionalValue: "P1M" },
      { name: "International Transaction Fee", feeType: "TRANSACTION", transactionRate: "0.0150", currency: "AUD" },
      { name: "International ATM Withdrawal", feeType: "WITHDRAWAL", amount: "5.00", currency: "AUD" },
    ],
    depositRates: [
      { depositRateType: "VARIABLE", rate: "0.0000", calculationFrequency: "P1D", applicationFrequency: "P1M" },
    ],
  },
  "prod-goalsaver": {
    features: [
      { featureType: "DIGITAL_BANKING", additionalValue: "Full digital banking access" },
      { featureType: "OTHER", additionalValue: "Bonus rate maintained when no withdrawals in calendar month" },
    ],
    fees: [
      { name: "Monthly Account Fee", feeType: "PERIODIC", amount: "0.00", currency: "AUD", additionalValue: "P1M" },
    ],
    depositRates: [
      { depositRateType: "VARIABLE", rate: "0.0100", calculationFrequency: "P1D", applicationFrequency: "P1M", additionalInfo: "Base rate" },
      { depositRateType: "BONUS", rate: "0.0425", calculationFrequency: "P1D", applicationFrequency: "P1M", additionalInfo: "Bonus rate — no withdrawals in month" },
    ],
  },
};

const ACCOUNTS = [
  {
    accountId: "acct-001", customerId: "cust-001", productId: "prod-everyday",
    productCategory: "TRANS_AND_SAVINGS_ACCOUNTS", productName: "Everyday Account",
    displayName: "Everyday Account", openStatus: "OPEN", isOwned: true,
    bsb: "802-985", accountNumber: "44718823",
    currentBalance: "12847.63", availableBalance: "12847.63",
    maskedNumber: "••8823", nickname: "Everyday",
  },
  {
    accountId: "acct-002", customerId: "cust-001", productId: "prod-everyday",
    productCategory: "TRANS_AND_SAVINGS_ACCOUNTS", productName: "Bills Account",
    displayName: "Bills Account", openStatus: "OPEN", isOwned: true,
    bsb: "802-985", accountNumber: "44718831",
    currentBalance: "3240.00", availableBalance: "3240.00",
    maskedNumber: "••8831", nickname: "Bills",
  },
  {
    accountId: "acct-003", customerId: "cust-001", productId: "prod-goalsaver",
    productCategory: "TRANS_AND_SAVINGS_ACCOUNTS", productName: "Goal Saver",
    displayName: "Goal Saver", openStatus: "OPEN", isOwned: true,
    bsb: "802-985", accountNumber: "44718847",
    currentBalance: "45620.18", availableBalance: "45620.18",
    maskedNumber: "••8847", nickname: "Savings",
    interestRate: "0.0525", bonusRateActive: true,
  },
  {
    accountId: "acct-004", customerId: "cust-001", productId: "prod-everyday",
    productCategory: "TRANS_AND_SAVINGS_ACCOUNTS", productName: "Mortgage Offset",
    displayName: "Mortgage Offset", openStatus: "OPEN", isOwned: true,
    bsb: "802-985", accountNumber: "44718855",
    currentBalance: "28500.00", availableBalance: "28500.00",
    maskedNumber: "••8855", nickname: "Offset",
    linkedLoanId: "loan-001",
  },
];

const TRANSACTIONS = [
  { transactionId: "tx-001", accountId: "acct-001", isDetailAvailable: true, type: "PAYMENT", status: "POSTED", description: "Woolworths Metro Town Hall", postingDateTime: "2026-03-07T01:34:00Z", amount: "-47.85", currency: "AUD", reference: "WOW 1234 SYDNEY", merchantName: "Woolworths", merchantCategoryCode: "5411", category: "GROCERIES" },
  { transactionId: "tx-002", accountId: "acct-001", isDetailAvailable: true, type: "DIRECT_CREDIT", status: "POSTED", description: "Salary — selfdriven Foundation", postingDateTime: "2026-03-06T00:00:00Z", amount: "8450.00", currency: "AUD", reference: "PAYID:mark@selfdriven.foundation", category: "INCOME", keriVerified: true },
  { transactionId: "tx-003", accountId: "acct-002", isDetailAvailable: true, type: "PAYMENT", status: "POSTED", description: "Sydney Water Corporation", postingDateTime: "2026-03-05T00:00:00Z", amount: "-186.40", currency: "AUD", reference: "BPAY 12389 8847291034", billerCode: "12389", category: "BILLS" },
  { transactionId: "tx-004", accountId: "acct-001", isDetailAvailable: true, type: "PAYMENT", status: "POSTED", description: "Uber Eats *3847", postingDateTime: "2026-03-04T00:00:00Z", amount: "-32.50", currency: "AUD", reference: "UBER EATS", merchantCategoryCode: "5812", category: "DINING" },
  { transactionId: "tx-005", accountId: "acct-001", isDetailAvailable: true, type: "PAYMENT", status: "PENDING", description: "Amazon AU *9214", postingDateTime: "2026-03-04T00:00:00Z", amount: "-89.99", currency: "AUD", reference: "AMAZON AU", merchantCategoryCode: "5942", category: "SHOPPING" },
  { transactionId: "tx-006", accountId: "acct-001", isDetailAvailable: true, type: "PAYMENT", status: "POSTED", description: "Opal Card Top Up", postingDateTime: "2026-03-03T00:00:00Z", amount: "-50.00", currency: "AUD", reference: "OPAL AUTO TOPUP", category: "TRANSPORT" },
  { transactionId: "tx-007", accountId: "acct-001", isDetailAvailable: true, type: "TRANSFER_OUTGOING", status: "POSTED", description: "Sarah Chen — Shared groceries", postingDateTime: "2026-03-02T00:00:00Z", amount: "-65.20", currency: "AUD", reference: "PAYID:sarah.chen@email.com", category: "TRANSFER" },
  { transactionId: "tx-008", accountId: "acct-001", isDetailAvailable: true, type: "DIRECT_DEBIT", status: "POSTED", description: "Home Loan Repayment", postingDateTime: "2026-03-01T00:00:00Z", amount: "-2840.00", currency: "AUD", reference: "SELFDRIVEN LENDING", category: "HOUSING" },
];

const PAYEES = [
  { payeeId: "payee-001", customerId: "cust-001", nickname: "Sarah Chen", type: "DOMESTIC", payeeType: "domestic", bsb: "062-000", accountNumber: "12345678", accountName: "Sarah Chen" },
  { payeeId: "payee-002", customerId: "cust-001", nickname: "James Wilson", type: "DOMESTIC", payeeType: "domestic", bsb: "033-042", accountNumber: "87654321", accountName: "James Wilson" },
  { payeeId: "payee-003", customerId: "cust-001", nickname: "ATO", type: "DOMESTIC", payeeType: "domestic", bsb: "092-009", accountNumber: "00012345", accountName: "Australian Taxation Office" },
  { payeeId: "payee-004", customerId: "cust-001", nickname: "selfdriven Foundation", type: "DOMESTIC", payeeType: "payId", payIdType: "EMAIL", payIdValue: "finance@selfdriven.foundation", keriVerified: true },
  { payeeId: "payee-005", customerId: "cust-001", nickname: "Sydney Water", type: "BILLER", payeeType: "biller", billerCode: "12389", crn: "8847291034", billerName: "Sydney Water Corporation" },
  { payeeId: "payee-006", customerId: "cust-001", nickname: "AGL Energy", type: "BILLER", payeeType: "biller", billerCode: "45219", crn: "1029384756", billerName: "AGL Energy Limited" },
  { payeeId: "payee-007", customerId: "cust-001", nickname: "Telstra", type: "BILLER", payeeType: "biller", billerCode: "18642", crn: "7483920156", billerName: "Telstra Corporation" },
];

const SCHEDULED_PAYMENTS = [
  { paymentId: "sched-001", customerId: "cust-001", fromAccountId: "acct-001", payeeId: "payee-001", amount: "375.00", currency: "AUD", description: "Shared rent", recurrence: { nextDateTime: "2026-03-14T00:00:00Z", interval: "P1W" }, status: "ACTIVE" },
  { paymentId: "sched-002", customerId: "cust-001", fromAccountId: "acct-001", toAccountId: "acct-003", amount: "2000.00", currency: "AUD", description: "Goal Saver auto transfer", recurrence: { nextDateTime: "2026-04-01T00:00:00Z", interval: "P1M" }, status: "ACTIVE" },
  { paymentId: "sched-003", customerId: "cust-001", fromAccountId: "acct-001", payeeId: "payee-003", amount: "1200.00", currency: "AUD", description: "ATO tax instalment", recurrence: { nextDateTime: "2026-03-21T00:00:00Z", interval: "P1M" }, status: "ACTIVE" },
];

const DIRECT_DEBITS = [
  { debitId: "dd-001", customerId: "cust-001", accountId: "acct-001", authorisedEntity: "selfdriven.money Lending", amount: "2840.00", frequency: "MONTHLY", lastDebitDate: "2026-03-01", lastDebitAmount: "2840.00" },
  { debitId: "dd-002", customerId: "cust-001", accountId: "acct-001", authorisedEntity: "Medibank Private", amount: "248.50", frequency: "MONTHLY", lastDebitDate: "2026-03-03", lastDebitAmount: "248.50" },
  { debitId: "dd-003", customerId: "cust-001", accountId: "acct-001", authorisedEntity: "Netflix", amount: "22.99", frequency: "MONTHLY", lastDebitDate: "2026-02-28", lastDebitAmount: "22.99" },
  { debitId: "dd-004", customerId: "cust-001", accountId: "acct-001", authorisedEntity: "Spotify", amount: "13.99", frequency: "MONTHLY", lastDebitDate: "2026-02-28", lastDebitAmount: "13.99" },
  { debitId: "dd-005", customerId: "cust-001", accountId: "acct-001", authorisedEntity: "NRMA Insurance", amount: "1420.00", frequency: "YEARLY", lastDebitDate: "2025-11-14", lastDebitAmount: "1420.00" },
];

const BPAY_BILLERS = {
  "12389": "Sydney Water Corporation",
  "45219": "AGL Energy Limited",
  "18642": "Telstra Corporation",
  "67890": "Optus",
  "11111": "Origin Energy",
};


// ═══════════════════════════════════════════════════════════════
// CDR FORMAT HELPERS
// ═══════════════════════════════════════════════════════════════

function formatAccountSummary(a) {
  return {
    accountId: a.accountId,
    creationDate: "2025-01-10",
    displayName: a.displayName,
    nickname: a.nickname,
    openStatus: a.openStatus,
    isOwned: a.isOwned,
    maskedNumber: a.maskedNumber,
    productCategory: a.productCategory,
    productName: a.productName,
  };
}

function formatAccountDetail(a) {
  return {
    ...formatAccountSummary(a),
    bsb: a.bsb,
    accountNumber: a.accountNumber,
    bundleName: null,
    specificAccountUType: "deposit",
    deposit: {
      depositRateType: a.interestRate ? "BONUS" : "VARIABLE",
      rate: a.interestRate || "0.0000",
      calculationFrequency: "P1D",
      applicationFrequency: "P1M",
    },
    // selfdriven.money extension: KERI identity fields
    "x-selfdriven-keri": {
      aid: "EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt",
      credentialSaid: "ECKydq2R27Fbx-ehrqwImnK-8Cm79sqbAQ4MmvEAYqao",
      payIdEmail: "mark@selfdriven.foundation",
      payIdMobile: "+614XXXXXXXX",
    },
  };
}

function formatTransaction(t) {
  return {
    accountId: t.accountId,
    transactionId: t.transactionId,
    isDetailAvailable: t.isDetailAvailable,
    type: t.type,
    status: t.status,
    description: t.description,
    postingDateTime: t.postingDateTime,
    amount: t.amount,
    currency: t.currency,
    reference: t.reference,
    merchantName: t.merchantName || null,
    merchantCategoryCode: t.merchantCategoryCode || null,
    billerCode: t.billerCode || null,
    billerName: t.billerCode ? BPAY_BILLERS[t.billerCode] : null,
    // selfdriven.money extension
    "x-selfdriven-category": t.category,
    "x-selfdriven-keri-verified": t.keriVerified || false,
  };
}

function formatPayee(p) {
  return {
    payeeId: p.payeeId,
    nickname: p.nickname,
    description: null,
    type: p.type,
    creationDate: "2025-01-10",
  };
}

function formatPayeeDetail(p) {
  const base = formatPayee(p);

  if (p.payeeType === "domestic") {
    return {
      ...base,
      payeeUType: "domestic",
      domestic: {
        payeeAccountUType: "account",
        account: {
          accountName: p.accountName,
          bsb: p.bsb,
          accountNumber: p.accountNumber,
        },
      },
    };
  }

  if (p.payeeType === "payId") {
    return {
      ...base,
      payeeUType: "domestic",
      domestic: {
        payeeAccountUType: "payId",
        payId: {
          name: p.nickname,
          identifier: p.payIdValue,
          type: p.payIdType,
        },
      },
      "x-selfdriven-keri-verified": p.keriVerified || false,
    };
  }

  if (p.payeeType === "biller") {
    return {
      ...base,
      payeeUType: "biller",
      biller: {
        billerCode: p.billerCode,
        crn: p.crn,
        billerName: p.billerName,
      },
    };
  }

  return base;
}

function formatScheduledPayment(p) {
  return {
    scheduledPaymentId: p.paymentId,
    nickname: p.description,
    payerReference: p.description,
    payeeReference: p.description,
    status: p.status,
    from: { accountId: p.fromAccountId },
    paymentSet: [{
      to: p.payeeId
        ? { payeeReference: p.payeeId, type: "payeeId" }
        : { accountId: p.toAccountId, type: "accountId" },
      isAmountCalculated: false,
      amount: p.amount,
      currency: p.currency,
    }],
    recurrence: {
      nextPaymentDate: p.recurrence.nextDateTime.split("T")[0],
      recurrenceUType: "intervalSchedule",
      intervalSchedule: {
        finalPaymentDate: null,
        paymentsRemaining: null,
        nonBusinessDayTreatment: "ON",
        intervals: [{ interval: p.recurrence.interval }],
      },
    },
  };
}

function formatDirectDebit(d) {
  return {
    accountId: d.accountId,
    authorisedEntity: {
      description: d.authorisedEntity,
      financialInstitution: null,
      abn: null,
      acn: null,
      arbn: null,
    },
    lastDebitDateTime: d.lastDebitDate + "T00:00:00+11:00",
    lastDebitAmount: d.lastDebitAmount,
  };
}


// ═══════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   selfdriven.money — Banking Server                       ║
  ║                                                           ║
  ║   CDR Open Banking:  /cds-au/v1/banking/*                 ║
  ║   Internal APIs:     /api/v1/*                            ║
  ║   Health:            /health                              ║
  ║                                                           ║
  ║   Port: ${PORT}                                              ║
  ║   KERI Witnesses: 3/3 active                              ║
  ║   NPP: connected | BPAY: connected                       ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
