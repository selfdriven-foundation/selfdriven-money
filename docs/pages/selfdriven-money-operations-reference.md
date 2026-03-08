---
layout: selfdriven
title: Enablement Reference - selfdriven Money
permalink: /enablement-reference
---

**Enablement Reference**

**& Information Security**

**Management System**

*selfdriven.money --- Comprehensive operational procedures, information security controls, and ISO 27001 alignment for sovereign banking operations built on KERI autonomous identity infrastructure.*

**Classification:** CONFIDENTIAL

**Document Owner:** Chief Risk Officer (CRO)

**Version:** 1.0 --- March 2026

**Review Cycle:** Annual (next review: March 2027)

**Approved by:** Board of Directors, selfdriven.money

selfdriven Foundation · selfdriven.money · selfdriven.foundation

**Contents**

**Part A --- Operations Reference**

This section defines the operational procedures, workflows, and standards governing the day-to-day operation of selfdriven.money as an Australian Authorised Deposit-taking Institution (ADI) regulated by APRA.

**1. Operational Governance**

selfdriven.money operates under a three-tier governance model designed to satisfy APRA prudential standards while embodying the selfdriven Foundation's principles of sovereign identity and community self-governance.

**1.1 Governance Structure**

-   **Board of Directors:** Fiduciary oversight, strategic approval, regulatory interface. Each director holds a KERI AID with a vLEI Legal Entity credential. Board decisions are recorded as KERI interaction events.

-   **Executive Committee:** CEO, CFO, CTO, CRO, CCO. Operational authority delegated via ACDC role credentials with defined scope and expiry. Authority matrix enforced cryptographically.

-   **Community Governance Council:** Customer-elected advisory body. Provides input on product direction, fee structures, and community investment. Voting is KERI-verified with immutable records.

-   **Operational Management:** Department heads across Banking Operations, Risk & Compliance, Technology, Engagement, and Enablement. Each operates within delegated authority limits attested by ACDC credentials.

**1.2 Authority Matrix**

  --------------------------------- --------------------- -------------------------- ------------------------
  **Decision Type**                 **Authority Level**   **Approval Required**      **KERI Event**

  **Daily operations (\<\$50k)**    Department Head       Single signature           ixn (interaction)

  **Operational (\$50k--\$500k)**   Executive Committee   Dual signature             ixn (interaction)

  **Strategic (\$500k--\$5M)**      CEO + CFO             Board notification         ixn + ACDC attestation

  **Material (\>\$5M)**             Board of Directors    Board resolution           rot (key ceremony)

  **Regulatory submissions**        CCO + CEO             Board ratification         ixn + ACDC credential

  **Key rotation / identity**       CTO + CRO             Dual control               rot (rotation event)

  **Customer data access**          Privacy Officer       Purpose limitation check   ixn (audit trail)

  **Emergency response**            Incident Commander    CRO delegation             ixn (timestamped)
  --------------------------------- --------------------- -------------------------- ------------------------

**1.3 Regulatory Framework**

selfdriven.money operates within the following Australian regulatory framework:

-   **APRA:** Australian Prudential Regulation Authority --- ADI licence holder obligations, prudential standards (CPS/APS series), capital adequacy (Basel III), liquidity requirements

-   **ASIC:** Australian Securities and Investments Commission --- Consumer protection, responsible lending, product disclosure, market conduct

-   **AUSTRAC:** Australian Transaction Reports and Analysis Centre --- AML/CTF Act compliance, suspicious matter reporting, customer due diligence

-   **OAIC:** Office of the Australian Information Commissioner --- Privacy Act 1988, Australian Privacy Principles (APPs), CDR data protection

-   **ACCC:** Australian Competition and Consumer Commission --- Consumer Data Right (CDR) accreditation, open banking compliance

**2. Banking Operations**

**2.1 Account Lifecycle**

**2.1.1 Account Origination**

Account opening follows a KERI-native workflow that replaces traditional identity verification with cryptographic proof:

1.  Customer initiates onboarding via selfdriven.money webapp or mobile application

2.  KERI AID inception event (icp) generated --- Ed25519 key pair created on customer device

3.  FIDO2/WebAuthn passkey registered and linked to AID via interaction event (ixn)

4.  Identity verification: Document verification + liveness check → ACDC KYC credential issued

5.  AUSTRAC customer due diligence completed; credential anchored to KERI key event log

6.  BSB (802-985) and account number assigned; PayID registered (email and/or mobile)

7.  Account activated; welcome credential issued as ACDC attestation

Total target time: \<10 minutes from initiation to active account.

**2.1.2 Account Types**

  -------------------------- ---------------------- --------------- -----------------------------------------------------
  **Product**                **Category**           **Interest**    **Features**

  **Everyday Account**       TRANS_AND_SAVINGS      0.00%           Visa Debit, PayID, BPAY, no monthly fees

  **Bills Account**          TRANS_AND_SAVINGS      0.00%           Dedicated bill payment, direct debit management

  **Goal Saver**             SAVINGS                5.25% (bonus)   Bonus rate on no-withdrawal months

  **Term Deposit**           TERM_DEPOSIT           4.80% (12mo)    Fixed rate, ACDC-attested deposit certificate

  **Mortgage Offset**        OFFSET                 N/A             100% offset against home loan, full transactional

  **Home Loan**              RESIDENTIAL_MORTGAGE   6.19% var.      Variable rate, redraw, offset, KERI-signed contract

  **Platinum Credit Card**   CREDIT_CARD            20.99%          Mastercard, travel insurance, rewards
  -------------------------- ---------------------- --------------- -----------------------------------------------------

**2.1.3 Account Closure**

Account closure requires passkey verification and generates a final KERI interaction event. Closure procedures:

-   Zero balance requirement (or transfer of remaining funds)

-   Cancellation of all linked direct debits, scheduled payments, and card authorisations

-   PayID de-registration via NPP

-   ACDC account holder credential revocation

-   Seven-year data retention per AUSTRAC requirements (encrypted at rest)

-   Final statement generation with ACDC attestation

**2.2 Payments Processing**

**2.2.1 Domestic Transfers**

  ----------------------- ----------------------- --------------------- ---------------------- ----------------------
  **Channel**             **Method**              **Speed**             **Limit**              **Hours**

  **PayID (NPP)**         New Payments Platform   Real-time (\<30s)     \$10,000/day default   24/7/365

  **BSB Transfer**        Direct Entry (DE)       Next business day     \$20,000/day default   Business hours batch

  **BPAY**                BPAY Scheme             Same day / next day   Per biller limits      24/7 submission

  **Internal Transfer**   Book transfer           Immediate             No limit               24/7/365

  **Osko (NPP)**          Fast payment            Real-time             \$10,000/day default   24/7/365
  ----------------------- ----------------------- --------------------- ---------------------- ----------------------

All outgoing payments require FIDO2 passkey signature linked to the customer's KERI AID. The signed transaction payload includes amount, recipient, timestamp, and a SHA-256 digest, recorded as a KERI interaction event.

**2.2.2 International Transfers**

International wire transfers operate via SWIFT network with the following parameters:

-   Cut-off time: 2:00 PM AEST for same-day processing

-   Settlement: T+1 to T+3 depending on destination and correspondent banking chain

-   FX rates: Mid-market rate + published margin (updated every 60 seconds during market hours)

-   Fees: \$22.00 AUD per transfer (reduced to \$12.00 for premium account holders)

-   Sanctions screening: Automated check against DFAT consolidated list and UN sanctions

-   Purpose of payment: Mandatory field per AUSTRAC international funds transfer instruction requirements

**2.2.3 Card Operations**

Visa Debit and Mastercard Platinum cards are issued on EMV chip with contactless capability. Card operations include:

-   Instant digital card issuance (card number available in-app within 60 seconds of approval)

-   Physical card delivery: 5--7 business days (Australia Post registered)

-   Apple Pay, Google Pay, Garmin Pay provisioning via card network tokenisation

-   Real-time transaction notifications via push notification

-   Instant card lock/unlock via passkey-authenticated API call

-   Fraud detection: Real-time scoring with machine learning + KERI-verified merchant identity where available

**3. Compliance Operations**

**3.1 KYC / Customer Due Diligence**

selfdriven.money implements a risk-based approach to customer due diligence as required by the AML/CTF Act 2006:

**3.1.1 CDD Tiers**

  ------------------- ---------------- ---------------------------------- ------------------------------------------ --------------
  **Tier**            **Risk Level**   **Verification**                   **Monitoring**                             **Review**

  **Simplified**      Low              Govt ID + selfie                   Automated transaction monitoring           36 months

  **Standard**        Medium           Govt ID + selfie + address         Enhanced monitoring + periodic review      24 months

  **Enhanced**        High             Full EDD: source of funds/wealth   Real-time monitoring + manual review       12 months

  **PEP/Sanctions**   Elevated         EDD + senior management approval   Continuous monitoring + quarterly review   6 months
  ------------------- ---------------- ---------------------------------- ------------------------------------------ --------------

All CDD outcomes are recorded as ACDC verifiable credentials anchored to the customer's KERI key event log. Credential expiry triggers automated re-verification workflows.

**3.1.2 Ongoing Monitoring**

-   Transaction monitoring: Automated rules engine + ML anomaly detection against customer risk profile

-   Sanctions screening: Real-time screening of all parties against DFAT, UN, EU, OFAC lists (updated daily)

-   PEP screening: Automated screening against Dow Jones, Refinitiv, or equivalent PEP databases

-   Threshold reporting: Automatic generation of Threshold Transaction Reports (TTRs) for cash transactions ≥\$10,000

-   Suspicious matter reporting: SMRs filed with AUSTRAC within 24 hours of suspicion forming

**3.2 Regulatory Reporting**

  ----------------------------------- --------------- ----------------- -------------------------------------
  **Report**                          **Regulator**   **Frequency**     **Method**

  **Capital Adequacy (ARF 110)**      APRA            Quarterly         D2A automated submission

  **Liquidity Coverage Ratio**        APRA            Monthly           Automated calculation + submission

  **Large Exposures (ARF 221)**       APRA            Quarterly         Automated from lending system

  **Threshold Transaction Reports**   AUSTRAC         Within 10 days    Automated on transaction

  **Suspicious Matter Reports**       AUSTRAC         Within 24 hours   Manual review + submission

  **IFTI Reports**                    AUSTRAC         Within 10 days    Automated on international transfer

  **Compliance Reports**              ASIC            Annual / ad hoc   CCO preparation + Board sign-off

  **CDR Metrics**                     ACCC            Monthly           Automated API metrics collection

  **Privacy Impact Assessments**      OAIC            Per project       Privacy Officer review
  ----------------------------------- --------------- ----------------- -------------------------------------

All regulatory reports are backed by ACDC credentials, enabling regulators to cryptographically verify data provenance without relying solely on the institution's representations.

**4. Business Continuity & Disaster Recovery**

**4.1 Business Continuity Plan**

selfdriven.money maintains a Business Continuity Plan (BCP) aligned with APRA Prudential Standard CPS 232 Business Continuity Management:

-   **RPO (Recovery Point Objective):** Zero data loss for transaction data (synchronous replication); 1 hour for non-critical systems

-   **RTO (Recovery Time Objective):** Core banking services: 2 hours; Full service: 4 hours; Non-critical: 24 hours

-   **MTPD (Maximum Tolerable Period of Disruption):** 4 hours for payment processing; 24 hours for full services

**4.2 Disaster Recovery Architecture**

-   Primary: AWS ap-southeast-2 (Sydney) --- multi-AZ deployment

-   Secondary: AWS ap-southeast-4 (Melbourne) --- warm standby with synchronous database replication

-   KERI witness network: Geographically distributed (Sydney, Frankfurt, Singapore) --- any 2 of 3 sufficient for operation

-   Data backup: Encrypted daily snapshots to isolated account with 90-day retention

-   Annual DR testing: Full failover exercise with documented results reported to Board

**4.3 Incident Classification**

  --------------------- ------------------------------------------- ------------------- ------------------- ---------------------------------------------
  **Severity**          **Description**                             **Response Time**   **Escalation**      **Example**

  **P1 --- Critical**   Complete service outage or data breach      15 minutes          CEO + CRO + Board   Core banking unavailable, ransomware

  **P2 --- Major**      Significant degradation or security event   30 minutes          CTO + CRO           Payment channel down, credential compromise

  **P3 --- Moderate**   Partial service impact                      2 hours             Department Head     Single API degraded, non-critical system

  **P4 --- Low**        Minor issue, workaround available           Next business day   Operations team     UI bug, non-urgent maintenance
  --------------------- ------------------------------------------- ------------------- ------------------- ---------------------------------------------

**Part B --- Information Security Management System**

This section defines the Information Security Management System (ISMS) for selfdriven.money, aligned with ISO/IEC 27001:2022 and its Annex A controls. The ISMS scope covers all information assets, systems, processes, and people involved in the delivery of banking services.

selfdriven.money's ISMS is uniquely enhanced by KERI/ACDC cryptographic identity infrastructure, providing architecturally-enforced security controls that go beyond traditional policy-based approaches.

**5. Context of the Organisation (ISO 27001 Clause 4)**

**5.1 Scope**

The ISMS applies to all information processing facilities, information assets, business processes, and personnel involved in the provision of selfdriven.money banking services, including:

-   Core banking platform and all supporting infrastructure

-   KERI identity infrastructure (key event logs, witness network, credential issuance)

-   Customer data (personal information, financial records, transaction history)

-   Payment processing systems (NPP, BPAY, SWIFT, card networks)

-   CDR Open Banking API platform

-   Internal communication and collaboration systems

-   Third-party service provider interfaces

-   Physical premises (registered office, data centre access)

**5.2 Interested Parties**

  -------------------------- ------------------------------------------------------------- ----------------------------------------------------
  **Stakeholder**            **Expectations**                                              **Relevant Requirements**

  **Customers**              Data protection, service availability, identity sovereignty   Privacy Act, CDR, KERI credential integrity

  **APRA**                   Prudential soundness, operational resilience                  CPS 234 (InfoSec), CPS 230 (OpRisk), CPS 232 (BCP)

  **AUSTRAC**                AML/CTF compliance, transaction reporting                     AML/CTF Act 2006, AUSTRAC Rules

  **OAIC**                   Privacy compliance, data breach notification                  Privacy Act 1988, NDB scheme

  **ACCC**                   CDR compliance, data sharing standards                        CDR Rules, Consumer Data Standards

  **Board & Shareholders**   Risk management, regulatory compliance                        Corporations Act, APRA governance standards

  **Employees**              Safe working environment, clear policies                      Employment law, security awareness requirements

  **Technology Partners**    Secure integration, API standards                             Contractual SLAs, security assessments
  -------------------------- ------------------------------------------------------------- ----------------------------------------------------

**5.3 Leadership Commitment (ISO 27001 Clause 5)**

The Board of Directors and Executive Committee demonstrate leadership commitment to information security through:

-   Annual approval of the Information Security Policy and ISMS objectives

-   Allocation of adequate resources for ISMS implementation and improvement

-   Integration of ISMS requirements into banking operations and project delivery

-   Regular review of security metrics, incidents, and risk treatment progress

-   Appointment of a Chief Information Security Officer (CISO) reporting to the CRO with direct Board access

**6. Risk Assessment & Treatment (ISO 27001 Clause 6)**

**6.1 Risk Assessment Methodology**

selfdriven.money employs a risk assessment methodology aligned with ISO 27005 and APRA CPS 220 Risk Management:

8.  Asset identification: Catalogue all information assets with ownership, classification, and criticality rating

9.  Threat identification: Map threats using STRIDE model (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege)

10. Vulnerability assessment: Identify vulnerabilities through automated scanning, penetration testing, and architectural review

11. Risk calculation: Likelihood × Impact = Risk Rating (using 5×5 matrix)

12. Risk treatment: Accept, Mitigate, Transfer, or Avoid --- with KERI-specific mitigations where applicable

13. Residual risk acceptance: By risk owner with documented rationale, reviewed quarterly

**6.2 Risk Register (Key Risks)**

  ------------- ---------------------------------------- -------------- ------------------------------------------------------------------ --------------
  **Risk ID**   **Risk Description**                     **Inherent**   **KERI Mitigation**                                                **Residual**

  **R-001**     Credential compromise / identity theft   Critical       Pre-rotated keys; KERI AID cannot be impersonated without KEL      Low

  **R-002**     Unauthorised transaction execution       High           Passkey + KERI ixn signing; dual control for high-value            Low

  **R-003**     Data breach / exfiltration               Critical       Encryption at rest + transit; ACDC credential-gated access         Medium

  **R-004**     Third-party / supply chain compromise    High           KERI-verified vendor identities; ACDC scope limitation             Medium

  **R-005**     Ransomware / destructive malware         Critical       Immutable KERI logs; isolated backup; witness network redundancy   Low

  **R-006**     Insider threat / privilege misuse        High           ACDC role credentials with expiry; KERI audit trail                Low

  **R-007**     DDoS / service unavailability            High           CDN + rate limiting; multi-region failover                         Medium

  **R-008**     Key management failure                   Critical       KERI pre-rotation; HSM-backed root keys; witness threshold         Low

  **R-009**     Regulatory non-compliance                High           Automated credential-based compliance reporting                    Low

  **R-010**     Social engineering / phishing            High           Passkey-only auth (phishing-resistant); no passwords/SMS OTP       Low
  ------------- ---------------------------------------- -------------- ------------------------------------------------------------------ --------------

**7. Information Security Controls (ISO 27001 Annex A)**

The following maps selfdriven.money's implementation of ISO 27001:2022 Annex A controls, organised by control theme. Each control includes the selfdriven.money-specific implementation with KERI/ACDC enhancements where applicable.

**7.1 Organisational Controls (A.5)**

**A.5.1 Policies for Information Security**

A comprehensive set of information security policies is maintained, approved by the Board, and reviewed annually. Policies are version-controlled and distributed via the internal knowledge base. Policy acceptance is recorded as ACDC credentials for each staff member.

**A.5.2 Information Security Roles and Responsibilities**

Security roles are defined via ACDC role credentials with explicit scope:

-   **CISO:** Overall ISMS accountability, risk management, security architecture, Board reporting

-   **Security Operations:** Monitoring, incident response, vulnerability management, threat intelligence

-   **Security Engineering:** Secure development, infrastructure hardening, cryptographic operations, KERI witness management

-   **Privacy Officer:** Privacy impact assessments, data subject requests, breach notification, CDR compliance

-   **All Staff:** Security awareness, incident reporting, acceptable use, credential management

**A.5.3 Segregation of Duties**

Segregation of duties is enforced architecturally through ACDC credential scoping. No single credential grants both initiation and approval authority. Key segregation controls:

-   Transaction initiation vs. approval: Separate KERI AIDs required for dual-control transactions

-   Code deployment vs. production access: Separate credentials for CI/CD pipeline and production environment

-   Key generation vs. key usage: HSM ceremony requires multiple custodians with separate KERI AIDs

-   Security monitoring vs. system administration: Separate role credentials with no overlap

**A.5.7 Threat Intelligence**

selfdriven.money maintains a threat intelligence programme that ingests indicators from AusCERT, ACSC (Australian Cyber Security Centre), financial sector ISACs, and commercial feeds. Threat intelligence is correlated with KERI witness network telemetry to detect identity-layer attacks.

**A.5.8 Information Security in Project Management**

All projects undergo a security review gate at each phase: initiation (threat modelling), design (architecture review), implementation (secure code review), testing (penetration testing), and deployment (change management). Projects affecting KERI infrastructure require CTO sign-off.

**7.2 People Controls (A.6)**

**A.6.1 Screening**

All staff, contractors, and third-party personnel undergo background screening proportionate to their access level:

-   Criminal history check (AFP National Police Check)

-   Employment and qualification verification

-   ASIC banned and disqualified persons register check

-   APRA fit and proper assessment for responsible persons

-   Ongoing monitoring: Annual re-screening for privileged access holders

**A.6.3 Information Security Awareness, Education and Training**

Security awareness programme delivered in three tiers:

-   **All staff:** Quarterly awareness training covering phishing, social engineering, data handling, incident reporting. Completion tracked via ACDC training credentials.

-   **Technical staff:** Annual secure development training (OWASP Top 10, KERI-specific security), cryptographic operations certification.

-   **Executive/Board:** Bi-annual briefing on threat landscape, regulatory changes, incident trends, and ISMS performance metrics.

**A.6.4 Disciplinary Process**

Information security policy violations are subject to a graduated disciplinary process documented in the Staff Handbook. Severe violations (intentional data breach, credential sharing) may result in immediate termination and regulatory reporting.

**7.3 Physical Controls (A.7)**

selfdriven.money operates a remote-first model with minimal physical premises. Physical controls apply to:

-   **Registered office:** Access card + biometric entry, CCTV monitoring, visitor management system, clean desk policy

-   **Data centre (AWS):** Inherited controls from AWS SOC 2 Type II reports. selfdriven.money reviews AWS compliance reports annually and maintains a shared responsibility model documentation.

-   **HSM locations:** Hardware Security Modules for KERI root key material are hosted in AWS CloudHSM (FIPS 140-2 Level 3). Key ceremony procedures require multi-party physical presence.

-   **Employee devices:** MDM-enrolled, encrypted storage, remote wipe capability, FIDO2 hardware key requirement for production access

**7.4 Technological Controls (A.8)**

**A.8.1 User Endpoint Devices**

-   All corporate devices enrolled in Mobile Device Management (MDM)

-   Full-disk encryption mandatory (FileVault / BitLocker)

-   Automatic OS and application patching within 72 hours of release

-   Endpoint Detection and Response (EDR) agent deployed on all devices

-   FIDO2 hardware security key required for production system access

**A.8.2 Privileged Access Rights**

Privileged access is managed through ACDC role credentials with the following controls:

-   Just-in-time (JIT) privileged access: Credentials issued for defined duration and scope, auto-expire

-   Break-glass procedures: Emergency access requires dual-approval KERI signing and generates immediate alert

-   Privileged Access Workstations (PAWs): Dedicated, hardened devices for production administration

-   Session recording: All privileged sessions recorded and retained for 12 months

-   Quarterly access review: All privileged access re-certified by access owners

**A.8.3 Information Access Restriction**

Access to information is controlled by the ACDC credential layer:

-   Every API request requires a valid KERI-authenticated bearer token with appropriate ACDC scope

-   Customer data access requires specific ACDC credentials matching the data classification level

-   CDR data sharing requires customer consent captured and stored as a verifiable credential

-   Database access: No direct query access; all data retrieval via credential-gated API layer

**A.8.5 Secure Authentication**

selfdriven.money eliminates passwords entirely. Authentication is FIDO2/WebAuthn passkey-only, linked to KERI AIDs:

-   **Customer authentication:** Passkey (biometric/device-bound) linked to KERI AID via ixn event. No passwords, no SMS OTP, no knowledge-based authentication.

-   **Staff authentication:** FIDO2 hardware security key + device certificate. SSO via SAML/OIDC with KERI AID binding.

-   **API authentication:** mTLS + KERI-signed bearer tokens. OAuth 2.0 / FAPI profile for CDR endpoints.

-   **Transaction signing:** WebAuthn assertion challenge with transaction-specific data binding. Prevents relay attacks.

**A.8.9 Configuration Management**

-   Infrastructure as Code (IaC): All infrastructure defined in Terraform, version-controlled, peer-reviewed

-   Immutable deployments: Container images built in CI/CD, signed, deployed to Kubernetes. No runtime modification.

-   CIS Benchmarks: Automated compliance scanning against CIS benchmarks for AWS, Kubernetes, and OS images

-   Drift detection: Automated alerts for any configuration drift from declared state

**A.8.10 Information Deletion**

Data retention and deletion follows a defined schedule:

  ------------------------- --------------------------- ------------------------------------ -----------------------------
  **Data Category**         **Retention Period**        **Deletion Method**                  **Authority**

  **Transaction records**   7 years (AUSTRAC)           Crypto-shred (AES key destruction)   Automated on expiry

  **KYC documents**         7 years post-relationship   Secure deletion + certificate        Privacy Officer

  **KERI key event logs**   Permanent (append-only)     N/A (immutable by design)            N/A

  **Session logs**          12 months                   Automated purge                      Security Operations

  **Marketing data**        Until consent withdrawn     Immediate on revocation              Automated on CDR withdrawal

  **Employee records**      7 years post-employment     Secure deletion + certificate        HR + Privacy Officer
  ------------------------- --------------------------- ------------------------------------ -----------------------------

**A.8.12 Data Leakage Prevention**

-   DLP policies enforced at email gateway, cloud storage, and endpoint

-   Customer financial data classified as CONFIDENTIAL; automated detection of patterns (BSB, account numbers, card numbers)

-   API egress monitoring: All CDR data sharing logged with credential-linked audit trail

-   KERI witness network: Tamper-evident logging prevents silent exfiltration of identity data

**A.8.15 Logging**

Comprehensive logging across all layers:

-   Application logs: Structured JSON, shipped to SIEM in real-time

-   KERI event logs: Append-only key event receipts stored across witness network (tamper-evident)

-   Infrastructure logs: AWS CloudTrail, VPC Flow Logs, Kubernetes audit logs

-   Access logs: Every authentication, authorisation decision, and data access recorded with KERI AID attribution

-   Retention: 12 months hot storage, 7 years cold storage (encrypted, immutable S3 bucket with Object Lock)

**A.8.16 Monitoring Activities**

-   24/7 Security Operations Centre (SOC) monitoring via managed SIEM

-   Real-time alerting on: Failed authentication patterns, privilege escalation, anomalous transactions, KERI witness disagreements

-   Automated response playbooks for common attack patterns

-   Monthly threat hunting exercises focused on identity-layer and credential-based attacks

**A.8.20--22 Network Security**

-   Zero-trust network architecture: No implicit trust based on network location

-   All internal communication encrypted (mTLS between services)

-   Network segmentation: Production, staging, development, and management in isolated VPCs

-   Web Application Firewall (WAF) on all public endpoints with OWASP Core Rule Set

-   DDoS protection via AWS Shield Advanced

**A.8.25--26 Secure Development & Testing**

-   Secure SDLC: Threat modelling at design, SAST/DAST in CI/CD, peer review for all code changes

-   Dependency scanning: Automated vulnerability scanning of all third-party dependencies (npm, pip)

-   Annual penetration testing by independent CREST-accredited firm

-   Bug bounty programme for responsible disclosure of vulnerabilities

-   KERI-specific testing: Key rotation exercises, witness failover testing, credential revocation testing

**A.8.28 Secure Coding**

Secure coding standards based on OWASP Application Security Verification Standard (ASVS) Level 2, with additional requirements for KERI/ACDC operations:

-   Input validation on all API endpoints (CDR-compliant error responses)

-   Parameterised queries (no SQL injection surface)

-   Output encoding for all user-facing content

-   KERI-specific: Cryptographic verification of all AID operations; no trust based on token content alone

-   Secrets management: All secrets in AWS Secrets Manager; zero secrets in code or configuration

**8. Information Security Incident Management**

**8.1 Incident Response Plan**

selfdriven.money maintains an Incident Response Plan aligned with NIST SP 800-61 and APRA CPS 234:

**Phase 1: Detection & Triage**

-   Automated detection via SIEM correlation rules and ML-based anomaly detection

-   Manual reporting via internal incident hotline and secure messaging channel

-   Triage: Incident Commander (on-call rotation) classifies severity per the P1--P4 matrix

-   KERI-timestamped incident record created with interaction event

**Phase 2: Containment**

-   Immediate: Isolate affected systems, revoke compromised credentials (ACDC revocation)

-   Short-term: Block attack vectors, rotate affected KERI keys (pre-rotation enables instant recovery)

-   Evidence preservation: Forensic snapshots of affected systems, KERI log extraction

**Phase 3: Eradication & Recovery**

-   Root cause analysis with documented findings

-   Rebuild affected systems from known-good images

-   KERI key rotation for any potentially compromised AIDs

-   Service restoration with enhanced monitoring

**Phase 4: Post-Incident**

-   Post-incident review within 5 business days of resolution

-   Lessons learned incorporated into ISMS risk register

-   Regulatory notifications: APRA (CPS 234 material incident), OAIC (Notifiable Data Breach), ACSC (critical infrastructure)

-   Customer notification if personal data involved (per NDB scheme timeline)

**8.2 Data Breach Notification**

selfdriven.money complies with the Notifiable Data Breaches (NDB) scheme under Part IIIC of the Privacy Act 1988:

-   **Assessment:** Reasonable grounds assessment completed within 72 hours of becoming aware

-   **Notification to OAIC:** If eligible data breach confirmed, notification submitted via NDB form within 30 days

-   **Customer notification:** Affected individuals notified with description of breach, data involved, and recommended actions

-   **APRA notification:** Material information security incidents reported to APRA as soon as possible, and no later than 72 hours

**9. Performance Evaluation & Improvement (ISO 27001 Clauses 9--10)**

**9.1 Security Metrics**

  ----------------------------------------------- ------------------------------- ---------------- ----------------------
  **Metric**                                      **Target**                      **Frequency**    **Owner**

  **Mean Time to Detect (MTTD)**                  \<30 minutes for P1/P2          Monthly          CISO

  **Mean Time to Respond (MTTR)**                 \<2 hours for P1                Monthly          Security Operations

  **Patch compliance (critical)**                 \>95% within 72 hours           Weekly           Security Engineering

  **Security awareness training completion**      100% quarterly                  Quarterly        People & Culture

  **Privileged access review completion**         100% quarterly                  Quarterly        Security Operations

  **Penetration test findings (critical/high)**   Zero unresolved \>30 days       Per engagement   Security Engineering

  **KERI witness availability**                   \>99.9% (2 of 3 minimum)        Real-time        CTO

  **Passkey authentication success rate**         \>99.5%                         Monthly          Product Engineering

  **CDR API availability**                        \>99.5% (CDR SLA requirement)   Monthly          Platform Engineering

  **Incidents requiring APRA notification**       Zero target                     Per incident     CRO
  ----------------------------------------------- ------------------------------- ---------------- ----------------------

**9.2 Internal Audit**

The ISMS is subject to internal audit at planned intervals:

-   Annual comprehensive ISMS audit against ISO 27001:2022 requirements

-   Quarterly control effectiveness testing for critical controls (Annex A.8 technological controls)

-   APRA CPS 234 compliance review: Annual, with findings reported to Board

-   CDR compliance review: Annual, aligned with ACCC audit requirements

-   Audit findings tracked to resolution with KERI-timestamped closure evidence

**9.3 Management Review**

The Executive Committee conducts a formal ISMS management review quarterly, covering:

-   Status of actions from previous reviews

-   Changes in internal and external context (threat landscape, regulatory changes)

-   Security metrics performance against targets

-   Incident trends and lessons learned

-   Risk register updates and risk treatment progress

-   Opportunities for ISMS improvement

-   Resource adequacy and budget requirements

Review minutes and decisions are recorded as KERI interaction events and reported to the Board.

**9.4 Continual Improvement**

selfdriven.money is committed to continual improvement of the ISMS through:

-   Corrective actions from audits, incidents, and management reviews

-   Proactive threat modelling as the banking product evolves

-   Regular benchmarking against APRA Prudential Practice Guides (PPGs)

-   Participation in industry forums (AusCERT, FS-ISAC, KERI community)

-   Annual external certification audit against ISO 27001:2022

**Appendix A --- ISO 27001:2022 Statement of Applicability Summary**

The following summarises the applicability of all 93 Annex A controls:

  ----------------------------- --------------- ---------------- ----------------- -----------------------------------------------------
  **Control Theme**             **Controls**    **Applicable**   **Implemented**   **Notes**

  **A.5 Organisational (37)**   A.5.1--A.5.37   37               37                All applicable; ACDC credential enhancements

  **A.6 People (8)**            A.6.1--A.6.8    8                8                 Full screening, awareness, remote work controls

  **A.7 Physical (14)**         A.7.1--A.7.14   10               10                4 N/A (no on-prem data centre); AWS SOC 2 inherited

  **A.8 Technological (34)**    A.8.1--A.8.34   34               34                KERI/ACDC enhancements across all controls
  ----------------------------- --------------- ---------------- ----------------- -----------------------------------------------------

The full Statement of Applicability (SoA) is maintained as a separate controlled document (DOC-ISMS-002) and reviewed annually as part of the ISMS management review cycle.

**Appendix B --- APRA CPS 234 Mapping**

APRA Prudential Standard CPS 234 Information Security requires ADIs to maintain information security capability commensurate with the size and extent of threats to their information assets. The following maps CPS 234 requirements to selfdriven.money controls:

  -------------------------------------- --------------------------------------------------------------------------------------------------
  **CPS 234 Requirement**                **selfdriven.money Implementation**

  **Information security capability**    ISMS aligned to ISO 27001:2022; CISO reports to CRO with Board access; dedicated security team

  **Policy framework**                   Board-approved security policy suite; annual review; ACDC-attested staff acknowledgement

  **Information asset identification**   Asset register maintained; KERI AID assigned to all critical system identities

  **Implementation of controls**         Annex A controls implemented; KERI/ACDC architectural enforcement supplements policy controls

  **Incident management**                Incident response plan per NIST 800-61; APRA notification within 72 hours for material incidents

  **Testing control effectiveness**      Annual pen test; quarterly control testing; continuous automated scanning

  **Internal audit**                     Annual ISMS audit; quarterly CPS 234 compliance checks; findings to Board

  **Notification to APRA**               Material incident notification process documented; CRO responsible for APRA communication

  **Third-party management**             Vendor security assessments; ACDC-scoped access credentials; annual re-assessment
  -------------------------------------- --------------------------------------------------------------------------------------------------

**Appendix C --- Document Control**

  ------------- --------------- -------------------- -------------------------------
  **Version**   **Date**        **Author**           **Changes**

  **0.1**       January 2026    CRO / CISO           Initial draft

  **0.9**       February 2026   CRO / CISO / CCO     Board review draft

  **1.0**       March 2026      Board of Directors   Approved for implementation
  ------------- --------------- -------------------- -------------------------------

This document is classified as CONFIDENTIAL and is subject to the selfdriven.money Information Classification Policy. Distribution is restricted to authorised personnel and regulators on a need-to-know basis.

*selfdriven.money · Trust by architecture.*
