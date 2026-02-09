# Domain Knowledge Hub

A central repository of domain-specific knowledge shared across all Agent roles (BA, PO, Dev, QA, Architect).

## Purpose
This directory contains deep knowledge about specific business domains and industry verticals. It is decoupled from specific roles so that any Agent can access the relevant context they need for their tasks.

## Available Domains

### 🛍️ E-commerce (`/ecommerce`)
- Business models (B2B, B2C, Marketplace)
- Core modules (Catalog, Cart, Checkout)
- Customer journeys and KPIs

### 🤝 CRM (`/crm`)
- Sales, Marketing, and Service modules
- Lead management and pipelines
- Customer data models

### 🏭 ERP (`/erp`)
- Finance, HR, Supply Chain, Manufacturing
- Enterprise workflows (Order-to-Cash, Procure-to-Pay)
- Integration patterns

### 🎯 CDP (`/cdp`)
- Customer Data Platforms
- Identity resolution, segmentation, activation
- Data privacy and consent

### 📱 Mobile & Web Patterns (`/mobile-web`)
- Application architectures (Native, PWA, SPA)
- UX patterns and standards
- Platform specific requirements (iOS, Android)

## How to Use
- **Senior BA Agent**: Using this to understand requirements specific to the industry.
- **Product Owner Agent**: Using this to prioritize features based on industry standards.
- **QA Agent**: Using this to design relevant test scenarios.
- **Architect Agent**: Using this to design systems that fit domain data structures.

## Usage
When an Agent needs domain context, they should `view_file` the relevant `SKILL.md` in these subdirectories.
