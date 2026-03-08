---
name: selfdriven-ecosystem
description: "Build selfdriven Foundation ecosystem properties — branded webapps, documents, APIs, and organisational frameworks. Use when the user mentions selfdriven, selfdriven.money, KERI/ACDC identity, Australian CDR Open Banking, ISO 27001 ISMS, Areas of Focus, Human Conductor models, or the selfdriven brand palette (flamingo #C8442F)."
---

# selfdriven Ecosystem Builder

Build production-grade web properties, documents, APIs, and organisational frameworks for the selfdriven Foundation ecosystem.

## Overview

The selfdriven Foundation operates a family of interconnected domains spanning sovereign identity, banking, AI, community, and professional services. This skill captures the brand system, architectural patterns, content frameworks, and technical standards needed to build consistently across the ecosystem.

### Trigger Contexts

This skill should be consulted for any mention of:
- Any selfdriven domain: selfdriven.money, .foundation, .pro, .network, .ai, .services, .community, .finance, .bot
- TANA (community actuation platform) or selfdriven-branded properties
- Banking webapps combining Australian financial services (APRA, AUSTRAC, CDR, NPP, BPAY, PayID) with sovereign identity (KERI, ACDC, passkeys, vLEI)
- ISO 27001 ISMS documents, Statements of Applicability, or APRA CPS 234 compliance
- The selfdriven brand palette: flamingo #C8442F / #E85D4A, cream #F5F2ED, dark #0A0A0A
- 8 Areas of Focus framework, Human Conductor organisational models, community self-actuation
- CDR Open Banking API development for Australian banking

### When to Use This Skill

- Creating or modifying any selfdriven-branded webapp, site, or dashboard
- Writing organisational papers, compliance documents, or governance frameworks
- Building API servers (especially CDR Open Banking, KERI identity, banking operations)
- Designing team/organisational structures using the 8 Areas of Focus
- Creating presentation or marketing pages for selfdriven properties
- Any task involving the selfdriven brand palette, typography, or design language

## Brand System

### Design Tokens

Always use CSS variables for theming. Support both light and dark modes via `prefers-color-scheme`.

```css
/* Light mode (default) */
:root {
  --bg: #f5f2ed;
  --surface: #edeae3;
  --surface2: #e5e1d8;
  --border: #ddd8ce;
  --text: #1a1410;
  --muted: #6b5f52;
  --muted2: #9e9085;
  --accent: #c8442f;
  --accent-dim: rgba(200, 68, 47, 0.10);
  --accent-strong: rgba(200, 68, 47, 0.18);
  --card-radius: 20px;
  --shadow: 0 2px 16px rgba(0,0,0,0.07);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0a0a0a;
    --surface: #161616;
    --surface2: #1e1e1e;
    --border: #2a2a2a;
    --text: #f0ede8;
    --muted: #b0a89e;
    --muted2: #7a7268;
    --accent: #e85d4a;
    --accent-dim: rgba(232, 93, 74, 0.12);
    --accent-strong: rgba(232, 93, 74, 0.20);
    --shadow: 0 2px 16px rgba(0,0,0,0.4);
  }
}
```

### Typography

- **Primary font**: `Poppins` (Google Fonts) — weights 300–900
- **Monospace**: `JetBrains Mono` — for identifiers, BSBs, AIDs, code, financial data
- **Never use**: Inter, Roboto, Arial, system fonts, DM Sans, Space Grotesk
- **Heading style**: Poppins 800/900 weight, tight letter-spacing (-0.04em), large sizes
- **Body style**: Poppins 400/500, colour `var(--muted)`, 1.6–1.8 line-height
- **Eyebrow labels**: 11px, weight 700, letter-spacing 0.12em, uppercase, colour `var(--accent)`

### Logo

The selfdriven logo is a square flamingo-coloured mark. When available as an uploaded file, embed it as base64 for self-contained HTML. Use it at:
- 80×80px on cover pages and auth screens
- 30–36px in navigation bars
- 18–20px in footers
- Always with `border-radius: 8–14px` and `overflow: hidden`

### Visual Language

- **Card style**: `var(--card-radius)` (20px), `1px solid var(--border)`, `var(--shadow)` on hover
- **Accent bar**: 3px top border on cards/modals using `var(--accent)` — signature selfdriven motif
- **Buttons**: Pill-shaped (`border-radius: 999px`) for CTAs, rounded (`border-radius: 12px`) for in-app actions
- **Dark sections**: Invert to `var(--text)` background with light text for contrast sections on light-mode pages. In dark mode, use slightly lighter surface (`#141414`) to differentiate
- **Scroll animations**: Use `IntersectionObserver` with staggered `transitionDelay` for card reveals
- **No noise textures**: Unlike the dark banking app, the brand sites use clean surfaces

### selfdriven Domain Family

| Domain | Purpose |
|--------|---------|
| selfdriven.foundation | Parent foundation entity |
| selfdriven.money | APRA-regulated banking platform |
| selfdriven.services | Professional services marketplace |
| selfdriven.pro | Human Conductor webapp (9 professional domains) |
| selfdriven.network | TANA community actuation platform |
| selfdriven.ai | AI automation and agent services |
| selfdriven.community | Community hub and governance |
| selfdriven.finance | Financial services and DeFi |
| selfdriven.bot | Agent marketplace and A2A protocols |

## 8 Areas of Focus Framework

The selfdriven Foundation organises all entities using 8 Areas of Focus. When building organisational content, always use these consistently:

| # | Area | Purpose | Banking (selfdriven.money) Application |
|---|------|---------|----------------------------------------|
| 01 | Direction | Strategy, vision, governance | ADI licensing, regulatory roadmap, Board interface |
| 02 | Engagement | Community, partnerships, ecosystem | Customer acquisition, Cardano/KERI partnerships |
| 03 | Enablement | Education, skills, developer tools | Financial literacy, SSI onboarding, CDR APIs |
| 04 | Protocols | Identity, technical standards | KERI/ACDC, passkeys, NPP/BPAY/SWIFT, CDR |
| 05 | Sustainability | Revenue, capital, long-term viability | NIM, interchange, Basel III, ACDC-attested reserves |
| 06 | Processes | Operations, workflows, delivery | Account origination, payments, lending |
| 07 | Accountability | Compliance, audit, transparency | ISO 27001, AML/CTF, KERI-verified governance |
| 08 | Organisational | Structure, team design, culture | Board + Executive + Community Council, remote-first |

### Human Conductor Model

Each Area of Focus is led by a **human conductor** who orchestrates AI agents:
- Conductor dedicates ~70% energy to primary area, ~30% across supporting areas
- Each conductor holds a KERI AID with an ACDC role credential
- AI agents operate under KERI-delegated AIDs with scoped authority
- Conductors handle: strategy, judgment, relationships, ethics, accountability
- Agents handle: volume, consistency, monitoring, reporting, automation

## Banking-Specific Standards

### Australian Regulatory Framework

When building banking content, always reference the correct regulators:
- **APRA**: Prudential standards (CPS/APS series), ADI licensing, capital adequacy
- **ASIC**: Consumer protection, responsible lending, product disclosure
- **AUSTRAC**: AML/CTF Act 2006, suspicious matter reporting, KYC/CDD
- **OAIC**: Privacy Act 1988, APPs, Notifiable Data Breaches scheme
- **ACCC**: Consumer Data Right (CDR), open banking accreditation

### CDR Open Banking API Structure

Base path: `/cds-au/v1/banking/`

Public endpoints (no auth):
- `GET /banking/products` — Product listing
- `GET /banking/products/:id` — Product detail
- `GET /discovery/status` — System status
- `GET /discovery/outages` — Outage schedule

Authenticated endpoints (KERI bearer token + FAPI headers):
- `GET /banking/accounts` — Account listing
- `GET /banking/accounts/:id` — Account detail (BSB, account number, PayID)
- `GET /banking/accounts/:id/balance` — Balance
- `GET /banking/accounts/:id/transactions` — Transaction history
- `GET /banking/payees` — Payees (BSB, PayID, BPAY billers)
- `GET /banking/payments/scheduled` — Scheduled payments
- `GET /banking/payments/direct-debits` — Direct debits
- `GET /common/customer` — Customer information

Required CDR headers: `x-v`, `x-min-v`, `x-fapi-interaction-id`, `x-fapi-customer-ip-address`, `x-fapi-auth-date`

### Mock Account Data

Use these consistent mock values across all selfdriven.money outputs:

- **BSB**: 802-985 (selfdriven.money)
- **Everyday Account**: 4471 8823 — $12,847.63
- **Bills Account**: 4471 8831 — $3,240.00
- **Goal Saver**: 4471 8847 — $45,620.18 (5.25% bonus rate)
- **Mortgage Offset**: 4471 8855 — $28,500.00
- **Home Loan**: $487,240 (6.19% variable, LVR 68%)
- **Term Deposit**: $25,000 (4.80%, 12 months)
- **Visa Debit**: 4823 •••• •••• 7741 (exp 09/28)
- **Mastercard Platinum**: 5412 •••• •••• 3309 (exp 11/27, $15k limit)
- **KERI AID**: EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt
- **PayID Email**: octo@selfdriven.foundation
- **Customer**: Octo, Ocean 0000

### Payment Channels

| Channel | Method | Speed | Available |
|---------|--------|-------|-----------|
| PayID | NPP | Real-time (<30s) | 24/7/365 |
| BSB Transfer | Direct Entry | Next business day | Business hours |
| BPAY | BPAY Scheme | Same/next day | 24/7 |
| Internal | Book transfer | Immediate | 24/7/365 |
| International | SWIFT | T+1 to T+3 | Cut-off 2pm AEST |

## KERI/ACDC Identity Architecture

### Key Concepts

- **AID**: Autonomous Identifier — self-certifying, no central authority
- **KEL**: Key Event Log — append-only, witnessed, tamper-evident
- **Event types**: `icp` (inception), `rot` (rotation), `ixn` (interaction), `dip` (delegated inception)
- **ACDC**: Authentic Chained Data Container — verifiable credential anchored to KERI
- **Witness network**: Distributed (typically 3 witnesses, 2-of-3 threshold)
- **Pre-rotation**: Next keys committed before current keys are used — enables instant recovery
- **Passkey binding**: FIDO2/WebAuthn credentials linked to KERI AID via `ixn` event

### Trust Model (Three Layers)

1. **Key Events**: KERI provides root of trust via append-only key event log
2. **Credentials**: ACDC credentials attest claims (KYC, role, account authority) anchored in KERI
3. **Transactions**: Banking operations reference the credential layer with cryptographic links

## Document Creation

### Word Documents (docx)

Use the `docx` skill for creating Word documents. selfdriven-specific conventions:
- **Font**: Poppins (not Arial) — set in document styles
- **Heading colours**: H1 in `#1A1410` (dark), H2 in `#C8442F` (accent), H3 in `#1A1410`
- **Table headers**: Fill `#C8442F`, text white, font Poppins 10pt bold
- **Table alternating rows**: `#F5E8E5` (accent light)
- **Monospace data**: JetBrains Mono for AIDs, BSBs, account numbers, hashes
- **Cover page**: Logo at top, title in 28pt bold, accent rule divider, metadata below
- **Headers**: "selfdriven.money · [Document Title]" with CONFIDENTIAL right-aligned
- **Footers**: Page number centred with document reference

### ISO 27001 Documents

When creating ISMS documentation:
- **SoA (Statement of Applicability)**: Landscape A4 for wide tables, all 93 Annex A controls
- **Column structure**: Control ID, Name, Applicable (Yes/N/A), Implemented, Justification, Implementation
- **Status colours**: Green background for "Yes", amber for "N/A"
- **KERI enhancements**: Every control should note where KERI/ACDC provides architectural enforcement beyond policy
- **APRA CPS 234 mapping**: Include as appendix — maps CPS 234 requirements to ISMS controls
- **Approval table**: CISO, CRO, CEO, Board Chair with signature and date columns

### Markdown Conversion

When converting docx to markdown: `pandoc input.docx -o output.md --wrap=none`

## Webapp Patterns

### Banking App (selfdriven.money)

- Sidebar navigation with logo, nav groups (Banking, Payments, Insights, Identity), identity card at bottom
- Topbar with page title, KERI status pill, notification bell, lock button
- Hero balance card with accent top-bar, total balance, quick action buttons
- Transfer modal with tabbed interface: Between Accounts, To Someone (PayID), BPAY, International
- Passkey signing animation for all mutating operations (transfers, card actions, statement downloads)
- Toast notification system for feedback
- Confirmation dialogs for destructive actions (card lock, passkey removal)
- Transaction search and CSV export
- Settings with functional toggle switches
- Auth screen: Passkey + KERI AID options, biometric verification animation
- **Always support dark mode** via `prefers-color-scheme: dark`

### Presentation/Marketing Site

- Fixed nav with logo, section links, CTA button (pill-shaped)
- Full-viewport hero with bold headline, eyebrow label, staggered fade-up animations
- Stats strip with scroll-triggered counter reveals
- Feature grid (3-column) with accent-top-bar hover cards
- Step-by-step flow cards with numbered counters
- Dark inverted section for trust/security messaging
- 8 Areas of Focus grid (4-column) with numbered cards
- CTA section with accent-topped card
- Scroll reveal via IntersectionObserver with staggered delays

### Team/Organisational Page

- 4-column card grid for 8 Areas of Focus
- Progress bar showing conductor recruitment status
- Each card: number badge, status (APPOINTED/OPEN), title, conductor slot
- Expandable detail panel: description, responsibilities, AI agents, KPIs
- Conductor slot: Dashed border when open, solid green when filled
- Philosophy section explaining the human conductor model
- Default Direction conductor: "selfdriven Actuation Team Member" with initials "sd"

## API Server Patterns

### Express.js Structure

```
server.js
├── CDR middleware (cdrHeaders) — validates/sets x-v, x-fapi-interaction-id
├── KERI auth middleware (keriAuth) — validates bearer token, extracts AID
├── Passkey middleware (passkeyVerify) — validates WebAuthn signature for mutations
├── CDR Public APIs — /cds-au/v1/banking/products, /discovery/*
├── CDR Authenticated APIs — /cds-au/v1/banking/accounts, /transactions, /payees
├── Internal APIs — /api/v1/transfers, /payments/domestic, /payments/bpay, /payments/international
├── KERI Identity APIs — /api/v1/identity/aid, /credentials, /kel, /passkeys
├── Card Management — /api/v1/cards, lock/unlock
├── Spending Insights — /api/v1/insights/spending
├── Statements — /api/v1/accounts/:id/statements
└── Health — /health (component status: database, keriWitness, npp, bpay, cardSchemes)
```

### CDR Error Format

```json
{
  "errors": [{
    "code": "urn:au-cds:error:cds-banking:Authorisation/UnavailableBankingAccount",
    "title": "Unavailable Banking Account",
    "detail": "account-id-here"
  }]
}
```

### KERI Event in Transaction Response

Every mutating operation should include a KERI event reference:
```json
{
  "keriEvent": {
    "type": "ixn",
    "aid": "EKE4g_0hDGBOqDLKzNBT3kFOPxoP7wXkqt",
    "sn": 1709971200000,
    "digest": "sha256-hex-of-request-body"
  }
}
```

## Checklist

Before delivering any selfdriven output, verify:

- [ ] Uses Poppins + JetBrains Mono (not generic fonts)
- [ ] Accent colour is `#C8442F` (light) / `#E85D4A` (dark) — not purple, not blue
- [ ] Dark mode supported and tested for text contrast
- [ ] Logo embedded (if available) at correct size for context
- [ ] Card radius is 20px with accent top-bar on hover/focus
- [ ] Buttons are pill-shaped (999px radius) for CTAs
- [ ] KERI/ACDC terminology is correct (AID not "address", KEL not "log", ixn not "event")
- [ ] BSB is 802-985 (selfdriven.money)
- [ ] 8 Areas of Focus are numbered 01–08 in correct order
- [ ] Regulatory references are correct (APRA not "APRC", AUSTRAC not "FINCEN")
- [ ] CDR API paths start with `/cds-au/v1/`
- [ ] Documents use Poppins in styles (not Arial)
