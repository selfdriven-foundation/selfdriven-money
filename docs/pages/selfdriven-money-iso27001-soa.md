---
layout: selfdriven
title: Enablement ISO27001 SOA - selfdriven Money
permalink: /enablement-iso27001-soa
---

**ISO 27001:2022**

**Statement of Applicability**

*Complete mapping of all 93 Annex A controls from ISO/IEC 27001:2022 to selfdriven.money's Information Security Management System, including applicability determination, implementation status, and KERI/ACDC-specific security enhancements.*

**Document ID:** DOC-ISMS-002

**Classification:** CONFIDENTIAL

**Document Owner:** Chief Information Security Officer (CISO)

**Approved by:** Board of Directors

**Version:** 1.0 --- March 2026

**Review Cycle:** Annual (next: March 2027)

**Total Controls:** 93

**Applicable:** 88 controls

**Not Applicable:** 5 controls (justified below)

**Implemented:** 88 of 88 applicable controls (100%)

selfdriven Foundation · selfdriven.money · selfdriven.foundation

**Statement of Applicability --- Overview**

This Statement of Applicability (SoA) documents the applicability and implementation status of all 93 controls from ISO/IEC 27001:2022 Annex A for selfdriven.money. The SoA is a mandatory requirement of the ISMS (Clause 6.1.3 d) and serves as the central reference linking the risk treatment plan to implemented controls.

Each control is assessed for applicability based on the risk assessment results, legal/regulatory requirements, contractual obligations, and business requirements. Where a control is deemed not applicable, a justification is provided. For applicable controls, the implementation description details how selfdriven.money addresses the control objective, including KERI/ACDC-specific enhancements where relevant.

**Applicability Legend**

**Yes:** Control is applicable and required for the ISMS scope

**N/A:** Control is not applicable --- justified below (typically due to cloud-first, remote-first operating model)

**Implemented:** Control has been fully implemented and is operational

**A.5 --- Organisational Controls (37 controls)**

Organisational controls establish the governance, policy, and management framework for information security. All 37 controls are applicable to selfdriven.money as an APRA-regulated ADI.

  ------------- ------------------------------------------------------------------- ----------- ----------- ------------------------------- -------------------------------------------------------------------------------------------------------
  **Control**   **Control Name**                                                    **Appl.**   **Impl.**   **Justification / Exclusion**   **selfdriven.money Implementation**

  **A.5.1**     Policies for information security                                   **Yes**     **Yes**     Required for ISMS               Board-approved policy suite; annual review; ACDC-attested staff acknowledgement

  **A.5.2**     Information security roles and responsibilities                     **Yes**     **Yes**     Required for ISMS               CISO, SecOps, SecEng, Privacy Officer defined; ACDC role credentials with explicit scope

  **A.5.3**     Segregation of duties                                               **Yes**     **Yes**     Critical for banking            Enforced via ACDC credential scoping; no single credential grants initiate + approve

  **A.5.4**     Management responsibilities                                         **Yes**     **Yes**     Required for ISMS               Executive Committee quarterly ISMS review; Board annual security briefing

  **A.5.5**     Contact with authorities                                            **Yes**     **Yes**     Regulatory obligation           Established relationships with APRA, AUSTRAC, ACSC, OAIC, AFP Cybercrime

  **A.5.6**     Contact with special interest groups                                **Yes**     **Yes**     Threat intelligence             AusCERT member; FS-ISAC participant; KERI community; ACSC partnership

  **A.5.7**     Threat intelligence                                                 **Yes**     **Yes**     Required for banking            Multi-source TI programme; ACSC feeds; commercial feeds; KERI witness network telemetry

  **A.5.8**     Information security in project management                          **Yes**     **Yes**     Required for SDLC               Security review gate at each phase; KERI infrastructure changes require CTO sign-off

  **A.5.9**     Inventory of information and other associated assets                **Yes**     **Yes**     Required for risk assessment    Comprehensive asset register; KERI AID assigned to all critical system identities

  **A.5.10**    Acceptable use of information and other associated assets           **Yes**     **Yes**     Required for ISMS               Acceptable Use Policy; annual acknowledgement tracked via ACDC training credential

  **A.5.11**    Return of assets                                                    **Yes**     **Yes**     Employment lifecycle            Automated device wipe on offboarding; ACDC credential revocation within 4 hours

  **A.5.12**    Classification of information                                       **Yes**     **Yes**     Required for banking            Four-tier: PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED. CDR data classified per CDR Rules

  **A.5.13**    Labelling of information                                            **Yes**     **Yes**     Supports classification         Automated labelling in document management; email classification headers; API response classification

  **A.5.14**    Information transfer                                                **Yes**     **Yes**     Required for CDR/banking        TLS 1.3 for all transfers; KERI-signed payloads for identity data; CDR FAPI profile for open banking

  **A.5.15**    Access control                                                      **Yes**     **Yes**     Critical for banking            KERI AID-based authentication; ACDC credential-based authorisation; zero-trust architecture

  **A.5.16**    Identity management                                                 **Yes**     **Yes**     Core to selfdriven.money        KERI autonomous identifiers for all entities; passkey-linked AIDs; no shared accounts

  **A.5.17**    Authentication information                                          **Yes**     **Yes**     Critical control                Passkey-only (FIDO2); no passwords; no SMS OTP; KERI AID binding for all auth events

  **A.5.18**    Access rights                                                       **Yes**     **Yes**     Required for ISMS               ACDC role credentials with scope and expiry; JIT privileged access; quarterly review

  **A.5.19**    Information security in supplier relationships                      **Yes**     **Yes**     APRA CPS 234 requirement        Vendor security assessment framework; ACDC-scoped access; annual re-assessment

  **A.5.20**    Addressing information security within supplier agreements          **Yes**     **Yes**     Contractual requirement         Security schedules in all vendor contracts; right to audit; breach notification obligations

  **A.5.21**    Managing information security in the ICT supply chain               **Yes**     **Yes**     Supply chain risk               Dependency scanning; SBOM maintenance; vendor KERI identity verification where supported

  **A.5.22**    Monitoring, review and change management of supplier services       **Yes**     **Yes**     Ongoing assurance               Quarterly vendor performance review; SOC 2 report review; change notification requirements

  **A.5.23**    Information security for use of cloud services                      **Yes**     **Yes**     AWS primary infrastructure      AWS shared responsibility model documented; CIS benchmark compliance; CloudTrail monitoring

  **A.5.24**    Information security incident management planning and preparation   **Yes**     **Yes**     Required for banking            IRP aligned with NIST 800-61; APRA CPS 234 incident procedures; tabletop exercises

  **A.5.25**    Assessment and decision on information security events              **Yes**     **Yes**     SOC operations                  SIEM correlation; P1-P4 classification matrix; Incident Commander on-call rotation

  **A.5.26**    Response to information security incidents                          **Yes**     **Yes**     Required for banking            Four-phase IRP; KERI key rotation for compromise recovery; evidence preservation

  **A.5.27**    Learning from information security incidents                        **Yes**     **Yes**     Continual improvement           Post-incident review within 5 days; lessons learned in risk register; policy updates

  **A.5.28**    Collection of evidence                                              **Yes**     **Yes**     Legal/regulatory need           Forensic procedures documented; chain of custody with KERI-timestamped evidence records

  **A.5.29**    Information security during disruption                              **Yes**     **Yes**     APRA CPS 232                    BCP maintains security controls during disruption; KERI witness failover tested annually

  **A.5.30**    ICT readiness for business continuity                               **Yes**     **Yes**     APRA CPS 232                    RPO zero / RTO 2hr for core; multi-region DR; annual failover testing

  **A.5.31**    Legal, statutory, regulatory and contractual requirements           **Yes**     **Yes**     ADI obligations                 Compliance register maintained; APRA/ASIC/AUSTRAC/OAIC/ACCC requirements mapped

  **A.5.32**    Intellectual property rights                                        **Yes**     **Yes**     Software licensing              Licence compliance scanning; open-source policy; KERI/ACDC spec compliance

  **A.5.33**    Protection of records                                               **Yes**     **Yes**     AUSTRAC retention               7-year transaction retention; encrypted at rest; KERI logs permanent and immutable

  **A.5.34**    Privacy and protection of personal information                      **Yes**     **Yes**     Privacy Act / CDR               APPs compliance; Privacy Officer appointed; PIAs for new processing; CDR data rules

  **A.5.35**    Independent review of information security                          **Yes**     **Yes**     APRA CPS 234                    Annual independent ISMS audit; annual pen test by CREST firm; APRA CPS 234 review

  **A.5.36**    Compliance with policies, rules and standards                       **Yes**     **Yes**     Required for ISMS               Automated compliance monitoring; quarterly control testing; exception management process

  **A.5.37**    Documented operating procedures                                     **Yes**     **Yes**     Operational requirement         Runbooks for all critical operations; KERI ceremony procedures; change management
  ------------- ------------------------------------------------------------------- ----------- ----------- ------------------------------- -------------------------------------------------------------------------------------------------------

**A.6 --- People Controls (8 controls)**

People controls address human aspects of information security including screening, awareness, and secure working practices. All 8 controls are applicable.

  ------------- ------------------------------------------------------------ ----------- ----------- ------------------------------- ----------------------------------------------------------------------------------------------------
  **Control**   **Control Name**                                             **Appl.**   **Impl.**   **Justification / Exclusion**   **selfdriven.money Implementation**

  **A.6.1**     Screening                                                    **Yes**     **Yes**     APRA fit & proper               AFP check; employment verification; ASIC register; APRA responsible persons assessment

  **A.6.2**     Terms and conditions of employment                           **Yes**     **Yes**     Employment requirement          Security obligations in contracts; NDA; AUP acknowledgement via ACDC credential

  **A.6.3**     Information security awareness, education and training       **Yes**     **Yes**     APRA CPS 234                    Three-tier programme: all staff quarterly, technical annual, Board bi-annual. ACDC tracking

  **A.6.4**     Disciplinary process                                         **Yes**     **Yes**     Policy enforcement              Graduated process documented; severe violations may result in termination + AUSTRAC report

  **A.6.5**     Responsibilities after termination or change of employment   **Yes**     **Yes**     Data protection                 Exit interview; NDA reminder; ACDC credential revocation; 4-hour access removal SLA

  **A.6.6**     Confidentiality or non-disclosure agreements                 **Yes**     **Yes**     Banking requirement             NDA in all employment contracts; vendor NDAs; Board member confidentiality obligations

  **A.6.7**     Remote working                                               **Yes**     **Yes**     Remote-first model              MDM enrolment; VPN/ZTNA; encrypted devices; FIDO2 hardware key for production access

  **A.6.8**     Information security event reporting                         **Yes**     **Yes**     ISMS requirement                Internal incident hotline; secure reporting channel; no-blame reporting culture; KERI timestamping
  ------------- ------------------------------------------------------------ ----------- ----------- ------------------------------- ----------------------------------------------------------------------------------------------------

**A.7 --- Physical Controls (14 controls)**

Physical controls protect premises, equipment, and physical assets. selfdriven.money operates a cloud-first, remote-first model with no on-premises data centre. 4 of 14 controls are not applicable, with justification provided. Physical data centre controls are inherited from AWS under the shared responsibility model (validated via AWS SOC 2 Type II reports reviewed annually).

  ------------- ------------------------------------------------------- ----------- ----------- ------------------------------- --------------------------------------------------------------------------------------------
  **Control**   **Control Name**                                        **Appl.**   **Impl.**   **Justification / Exclusion**   **selfdriven.money Implementation**

  **A.7.1**     Physical security perimeters                            **Yes**     **Yes**     Office + AWS inherited          Registered office: access-controlled perimeter. AWS: SOC 2 Type II inherited controls

  **A.7.2**     Physical entry                                          **Yes**     **Yes**     Office access                   Access card + biometric; visitor management; CCTV at entry points

  **A.7.3**     Securing offices, rooms and facilities                  **Yes**     **Yes**     Office security                 Clean desk policy; secure print; shredding; locked cabinets for sensitive materials

  **A.7.4**     Physical security monitoring                            **Yes**     **Yes**     24/7 monitoring                 CCTV monitoring; after-hours intrusion detection; security guard response

  **A.7.5**     Protecting against physical and environmental threats   **N/A**     **N/A**     No on-premises data centre      AWS manages: fire suppression, flood protection, power, cooling. Inherited via SOC 2

  **A.7.6**     Working in secure areas                                 **N/A**     **N/A**     No secure rooms required        Remote-first; no on-premises server rooms or data processing areas

  **A.7.7**     Clear desk and clear screen                             **Yes**     **Yes**     Data protection                 Clean desk policy enforced; automatic screen lock (5 min); privacy screens issued

  **A.7.8**     Equipment siting and protection                         **N/A**     **N/A**     Cloud infrastructure            AWS manages physical equipment. Corporate devices: MDM-managed, encrypted

  **A.7.9**     Security of assets off-premises                         **Yes**     **Yes**     Remote workforce                MDM enrolment; FDE mandatory; remote wipe; VPN/ZTNA for all corporate access

  **A.7.10**    Storage media                                           **Yes**     **Yes**     Data handling                   Encrypted storage only; secure disposal of hardware (NIST 800-88 wipe); no removable media

  **A.7.11**    Supporting utilities                                    **N/A**     **N/A**     Cloud infrastructure            AWS manages power, cooling, connectivity. Inherited via SOC 2 Type II

  **A.7.12**    Cabling security                                        **N/A**     **N/A**     Cloud infrastructure            AWS manages cabling infrastructure. Office: structured cabling with labelling

  **A.7.13**    Equipment maintenance                                   **Yes**     **Yes**     Device management               Corporate devices: automated patching via MDM; annual hardware refresh cycle

  **A.7.14**    Secure disposal or re-use of equipment                  **Yes**     **Yes**     Data protection                 NIST 800-88 compliant wipe; certificate of destruction; ACDC-attested disposal record
  ------------- ------------------------------------------------------- ----------- ----------- ------------------------------- --------------------------------------------------------------------------------------------

**A.8 --- Technological Controls (34 controls)**

Technological controls address the technical implementation of information security. All 34 controls are applicable and fully implemented, with KERI/ACDC architectural enhancements providing defence-in-depth beyond traditional policy-based controls.

  ------------- ------------------------------------------------------------- ----------- ----------- ------------------------------- ---------------------------------------------------------------------------------------------------------
  **Control**   **Control Name**                                              **Appl.**   **Impl.**   **Justification / Exclusion**   **selfdriven.money Implementation**

  **A.8.1**     User endpoint devices                                         **Yes**     **Yes**     Remote workforce                MDM enrolment; FDE; EDR; auto-patching within 72hr; FIDO2 key for production

  **A.8.2**     Privileged access rights                                      **Yes**     **Yes**     Critical control                JIT access via ACDC credentials with expiry; break-glass dual-KERI approval; PAWs; session recording

  **A.8.3**     Information access restriction                                **Yes**     **Yes**     Banking/CDR requirement         ACDC credential-gated API layer; no direct DB access; CDR consent as verifiable credential

  **A.8.4**     Access to source code                                         **Yes**     **Yes**     IP protection                   GitHub Enterprise; branch protection; PR review required; no direct main commits

  **A.8.5**     Secure authentication                                         **Yes**     **Yes**     Core to selfdriven.money        FIDO2 passkey-only; no passwords/SMS OTP; KERI AID binding; mTLS for service-to-service

  **A.8.6**     Capacity management                                           **Yes**     **Yes**     Service availability            Auto-scaling Kubernetes; CloudWatch monitoring; capacity planning reviews quarterly

  **A.8.7**     Protection against malware                                    **Yes**     **Yes**     Endpoint protection             EDR on all devices; real-time scanning; automated containment; no macro execution

  **A.8.8**     Management of technical vulnerabilities                       **Yes**     **Yes**     APRA CPS 234                    Automated scanning (Qualys/Tenable); 72hr critical patch SLA; annual pen test

  **A.8.9**     Configuration management                                      **Yes**     **Yes**     Operational integrity           IaC (Terraform); immutable containers; CIS benchmarks; automated drift detection

  **A.8.10**    Information deletion                                          **Yes**     **Yes**     Privacy Act / AUSTRAC           Defined retention schedule; crypto-shred for expired data; ACDC-attested deletion certificates

  **A.8.11**    Data masking                                                  **Yes**     **Yes**     Privacy / CDR                   PII masked in non-production; CDR Pairwise Pseudonym IDs (PPIDs); log redaction

  **A.8.12**    Data leakage prevention                                       **Yes**     **Yes**     Data protection                 DLP at email/cloud/endpoint; BSB/account/card pattern detection; API egress monitoring

  **A.8.13**    Information backup                                            **Yes**     **Yes**     Business continuity             Encrypted daily snapshots; cross-region replication; 90-day retention; monthly restore testing

  **A.8.14**    Redundancy of information processing facilities               **Yes**     **Yes**     APRA CPS 232                    Multi-AZ primary (Sydney); warm standby (Melbourne); KERI witnesses across 3 regions

  **A.8.15**    Logging                                                       **Yes**     **Yes**     Audit / compliance              Structured JSON to SIEM; KERI append-only event logs; CloudTrail; K8s audit; 7yr retention

  **A.8.16**    Monitoring activities                                         **Yes**     **Yes**     SOC operations                  24/7 managed SIEM; real-time alerting; monthly threat hunting; KERI witness health monitoring

  **A.8.17**    Clock synchronisation                                         **Yes**     **Yes**     Audit integrity                 NTP synchronisation; AWS time sync service; KERI events use ISO 8601 with timezone

  **A.8.18**    Use of privileged utility programs                            **Yes**     **Yes**     Access control                  Restricted to PAWs; usage logged; ACDC credential required; quarterly review

  **A.8.19**    Installation of software on operational systems               **Yes**     **Yes**     Change management               CI/CD pipeline only; signed container images; no manual installation in production

  **A.8.20**    Networks security                                             **Yes**     **Yes**     Infrastructure security         Zero-trust; mTLS between services; VPC segmentation; WAF on public endpoints

  **A.8.21**    Security of network services                                  **Yes**     **Yes**     Service protection              AWS Shield Advanced (DDoS); CloudFront CDN; rate limiting per CDR performance tiers

  **A.8.22**    Segregation of networks                                       **Yes**     **Yes**     Banking requirement             Isolated VPCs: production, staging, dev, management; no cross-VPC routing without explicit rules

  **A.8.23**    Web filtering                                                 **Yes**     **Yes**     Endpoint protection             DNS filtering on corporate devices; category-based blocking; logging of all web access

  **A.8.24**    Use of cryptography                                           **Yes**     **Yes**     Core to KERI/banking            Ed25519 for KERI AIDs; AES-256-GCM at rest; TLS 1.3 in transit; HSM for root keys

  **A.8.25**    Secure development life cycle                                 **Yes**     **Yes**     APRA expectation                Threat modelling; SAST/DAST in CI/CD; peer review; KERI-specific security testing

  **A.8.26**    Application security requirements                             **Yes**     **Yes**     Banking/CDR                     OWASP ASVS Level 2; CDR security profile (FAPI); input validation; parameterised queries

  **A.8.27**    Secure system architecture and engineering principles         **Yes**     **Yes**     Foundational                    Zero-trust; least privilege; defence in depth; KERI pre-rotation; immutable infrastructure

  **A.8.28**    Secure coding                                                 **Yes**     **Yes**     Development standard            OWASP ASVS; no secrets in code; dependency scanning; KERI cryptographic verification in all AID ops

  **A.8.29**    Security testing in development and acceptance                **Yes**     **Yes**     Quality assurance               SAST/DAST/SCA in pipeline; annual CREST pen test; bug bounty; KERI key rotation testing

  **A.8.30**    Outsourced development                                        **Yes**     **Yes**     Vendor management               Security requirements in contracts; code review rights; SAST scanning of delivered code

  **A.8.31**    Separation of development, test and production environments   **Yes**     **Yes**     Standard practice               Separate AWS accounts; no production data in dev/test; masked datasets for testing

  **A.8.32**    Change management                                             **Yes**     **Yes**     Operational control             CAB for production changes; automated CI/CD; rollback procedures; KERI event for infrastructure changes

  **A.8.33**    Test information                                              **Yes**     **Yes**     Data protection                 Synthetic test data; no production PII in test; data masking for integration testing

  **A.8.34**    Protection of information systems during audit testing        **Yes**     **Yes**     Audit integrity                 Audit access via time-limited ACDC credentials; isolated audit environment; monitored sessions
  ------------- ------------------------------------------------------------- ----------- ----------- ------------------------------- ---------------------------------------------------------------------------------------------------------

**Summary & Approval**

This Statement of Applicability covers all 93 controls from ISO/IEC 27001:2022 Annex A. Of these, 88 controls are applicable to the selfdriven.money ISMS scope and are fully implemented. 5 controls are not applicable due to the cloud-first, remote-first operating model, with justifications documented above.

The SoA is reviewed annually as part of the ISMS management review cycle, and updated whenever material changes occur to the risk assessment, regulatory requirements, or ISMS scope.

  ----------------------------- ----------------- ----------------- -----------------
  **Role**                      **Name**          **Signature**     **Date**

  **CISO (Document Owner)**                                         March 2026

  **CRO (Risk Owner)**                                              March 2026

  **CEO (Executive Sponsor)**                                       March 2026

  **Board Chair (Approval)**                                        March 2026
  ----------------------------- ----------------- ----------------- -----------------

*selfdriven.money · Trust by architecture, verified by design.*
