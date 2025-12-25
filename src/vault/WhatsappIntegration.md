# WhatsApp Cloud API – MVP Integration Plan (No BSP, Low Cost)

## Purpose

This document captures the **decision, constraints, and exact steps** for integrating **WhatsApp Cloud API directly from Meta** for the MVP stage of Arkasoft, without using third-party providers (BSPs) and without upfront company registration.

The goal is to:

- Go live fast
- Spend near-zero money
- Stay Meta-policy compliant
- Allow smooth migration to production later

---

## Key Constraints

- No registered company yet
- No GST / CIN
- Limited budget
- Founder is employed full-time elsewhere
- MVP first, revenue later

---

## High-Level Decision Summary

| Item | Decision |
|----|----|
| WhatsApp Integration | Meta WhatsApp **Cloud API (Direct)** |
| BSP / Provider | ❌ Not used |
| Business Entity | Individual / Family-owned (Parent as owner) |
| Domain | Temporary domain (friend-owned) |
| Landing Page | GitHub Pages |
| Server | Old PC (self-hosted) |
| Public Exposure | Cloudflare Tunnel (no raw IP exposure) |
| Email | Domain-based (Zoho / routing) |
| AI Usage | Internal only (not marketed as chatbot) |

---

## Why WhatsApp Cloud API (Meta Direct)

- Hosted by Meta (no infra cost)
- No BSP monthly fees
- Official, long-term supported
- Only pay Meta conversation charges when applicable
- Suitable for MVP testing

Official Docs:  
<https://developers.facebook.com/docs/whatsapp/cloud-api/get-started>

---

## Domain Strategy (MVP)

### Current Situation

- Desired domain: `arkasoft.ai`
- Cost too high for now

### MVP Decision

- Use **friend’s domain** temporarily
- Domain must look legitimate and tech/business related

### Allowed by Meta

- Website URL **can be changed later**
- Business Manager settings can be updated
- WhatsApp number does **not** need re-registration

### Future Migration

1. Buy `arkasoft.ai`
2. Deploy same site content
3. Update:
   - Business Manager website URL
   - App settings
   - Privacy Policy & Terms links

---

## Business Email Requirement

Meta does **not accept free emails** like Gmail/Yahoo.

### MVP Setup

- Email: `contact@<friend-domain>`
- Provider options:
  - Zoho Mail (free)
  - Cloudflare Email Routing

Used for:

- Meta Business Manager
- App contact
- Verification communication

---

## Landing Page (Mandatory)

### Purpose

- Establish business legitimacy
- Explain WhatsApp usage clearly
- Pass Meta manual review

### Hosting

- GitHub Pages
- Custom domain (friend’s)

### Required Pages

- `/` (Home)
- `/privacy-policy`
- `/terms`

### Safe Wording (Important)

Use:

- Customer notifications
- Campaign messaging
- Business communication
- Customer engagement

Avoid:

- AI chatbot
- LLM assistant
- ChatGPT on WhatsApp

> AI (RAG) is allowed internally but **not marketed via WhatsApp**

---

## Server & Infrastructure (MVP)

### Server

- Old PC (friend-owned)
- Linux (Ubuntu Server preferred)
- Used for:
  - WhatsApp Webhooks
  - CI/CD (GitHub self-hosted runner)
  - Backend APIs

### Public Access

❌ Do NOT expose raw IP or ports

✅ Use:

- Cloudflare Tunnel
- Cloudflare proxy + HTTPS

Benefits:

- No port forwarding
- Free SSL
- DDoS protection

---

## WhatsApp Cloud API Setup – Steps

### 1. Meta Business Manager

- Create business as **Individual**
- Business name: Arkasoft
- Owner: Parent (Mother/Father)
- Website: Friend’s domain
- Email: Domain-based email

Link: <https://business.facebook.com/>

---

### 2. Meta Developer App

- App Type: Business
- Add Product: WhatsApp

Link: <https://developers.facebook.com/>

---

### 3. WhatsApp Configuration

- Add **fresh phone number**
- Verify via OTP
- Obtain:
  - Phone Number ID
  - Business Account ID
  - Access Token

---

### 4. Webhook Setup

- HTTPS endpoint (NodeTS)
- Verification challenge handling
- Events:
  - messages
  - message_status
  - message_reads

Meta only validates:

- HTTPS
- Correct challenge response

---

## CI/CD (MVP)

- GitHub Actions
- Self-hosted runner on old PC
- Build + deploy containers
- Minimal automation initially

---

## Legal & Employment Safety

- Product in parent’s name
- No employer IP or resources used
- Personal time development
- Common and safe early-stage practice in India

---

## Known Risks & Mitigations

| Risk | Mitigation |
|----|----|
| Meta rejection | Use compliant wording |
| Domain change later | Allowed by Meta |
| Server downtime | Cloudflare Tunnel |
| AI policy issues | Don’t market AI on WhatsApp |

---

## MVP Definition of Done

- WhatsApp number approved
- Webhook receiving messages
- Messages sent via Cloud API
- Landing page live
- Zero BSP dependency

---

## Future Improvements (Post-Revenue)

- Buy `arkasoft.ai`
- Business verification
- Higher WhatsApp message tiers
- Production-grade infra
- Formal company registration

---

## References

- WhatsApp Cloud API Docs  
  <https://developers.facebook.com/docs/whatsapp/cloud-api/get-started>
- Meta Business Manager  
  <https://business.facebook.com/>
