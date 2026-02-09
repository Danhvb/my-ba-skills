# Sample Interview: E-commerce Checkout Feature

## Interview Details
- **Date**: January 15, 2026
- **Interviewer**: Sarah Chen (Business Analyst)
- **Interviewee**: Michael Rodriguez
- **Role/Title**: Head of E-commerce Operations
- **Department**: Digital Commerce
- **Project**: Checkout Flow Optimization
- **Duration**: 60 minutes

## Interview Summary
This interview focused on understanding current pain points in the checkout process and gathering requirements for a redesigned, streamlined checkout experience.

---

## Interview Transcript (Key Sections)

### Background & Context

**BA**: Can you describe your role and how you interact with the checkout system?

**Michael**: I oversee the entire e-commerce operation, which includes monitoring conversion rates, analyzing cart abandonment, and working with our customer service team on checkout-related issues. I review analytics daily and work closely with marketing on optimization initiatives.

**BA**: What systems do you currently use?

**Michael**: We use Shopify Plus for our storefront, Stripe for payments, ShipStation for fulfillment, and Google Analytics for tracking. We also have a custom loyalty program integration.

### Current State & Pain Points

**BA**: Can you walk me through what happens when a customer tries to check out?

**Michael**: Sure. Currently, customers add items to cart, then click "Checkout." They're taken to a multi-step process:
1. Shipping address entry
2. Shipping method selection  
3. Payment information
4. Order review
5. Confirmation

The problem is we're seeing 68% cart abandonment rate, which is way above industry average of 45%.

**BA**: That's significant. What do you think is causing this?

**Michael**: Several things. First, we require account creation before checkout - that's a huge friction point. Second, the process takes too long - customers have to click through 4 separate pages. Third, we don't save cart information, so if someone leaves and comes back, they start over. And finally, we only accept credit cards - no PayPal, Apple Pay, or Google Pay.

**BA**: How much time does the average checkout take?

**Michael**: From our analytics, about 4-5 minutes for first-time customers, 2-3 minutes for returning customers. Industry best practice is under 2 minutes.

**BA**: What workarounds have you or your team developed?

**Michael**: We've started offering a "save cart" option via email, but it's manual and clunky. Customer service also manually processes orders over the phone for frustrated customers - we get about 50 of these calls per week.

### Requirements & Needs

**BA**: What would an ideal checkout experience look like?

**Michael**: **[KEY REQUIREMENT]** Guest checkout is absolutely critical - we need to let people buy without creating an account. We can offer account creation after purchase.

**[KEY REQUIREMENT]** Single-page checkout would be ideal - all information on one screen, no clicking through multiple pages.

**[KEY REQUIREMENT]** We need to support multiple payment methods - at minimum PayPal, Apple Pay, and Google Pay in addition to credit cards.

**[KEY REQUIREMENT]** Auto-save cart functionality - if someone leaves and comes back (even days later), their cart should be preserved.

**BA**: What about mobile experience?

**Michael**: **[KEY REQUIREMENT]** Mobile is 60% of our traffic, so the checkout must be mobile-optimized. We need address autofill, easy form filling, and digital wallet support.

**BA**: Any other must-have features?

**Michael**: **[KEY REQUIREMENT]** Real-time shipping cost calculation - customers abandon when they see unexpected shipping costs at the end.

**[KEY REQUIREMENT]** Order summary always visible - customers should see what they're buying and the total at all times.

**[NICE TO HAVE]** Promo code field that doesn't distract from checkout.

**[NICE TO HAVE]** Estimated delivery date display.

**[NICE TO HAVE]** Save multiple shipping addresses for returning customers.

### Constraints & Dependencies

**BA**: Are there any technical constraints we should know about?

**Michael**: We need to maintain our current Stripe integration - we can't switch payment processors. We also need to stay on Shopify Plus platform. Any solution needs to work within those constraints.

**BA**: What about compliance or regulatory requirements?

**Michael**: PCI DSS compliance is mandatory - we can't store credit card information directly. We also need to comply with GDPR for EU customers and CCPA for California customers, especially around data collection and consent.

**BA**: Timeline expectations?

**Michael**: We're planning a major marketing campaign in Q2, so we'd like this live by end of March. That gives us about 10 weeks.

### Success Criteria

**BA**: How will you measure success of this project?

**Michael**: **Primary KPI**: Reduce cart abandonment rate from 68% to under 50% within first month.

**Secondary KPIs**:
- Increase conversion rate by at least 15%
- Reduce average checkout time to under 2 minutes
- Increase mobile conversion rate by 20%
- Reduce checkout-related customer service calls by 50%

**BA**: What would make this project a failure?

**Michael**: If cart abandonment doesn't improve, or if we introduce new technical issues that hurt the customer experience. Also, if we can't meet PCI compliance, that's a showstopper.

---

## Key Requirements Identified

| ID | Requirement | Type | Priority | Notes |
|----|-------------|------|----------|-------|
| REQ-001 | Guest checkout capability | Functional | Must Have | Critical for reducing abandonment |
| REQ-002 | Single-page checkout design | Functional | Must Have | Reduce friction, fewer clicks |
| REQ-003 | Multiple payment methods (PayPal, Apple Pay, Google Pay, Credit Card) | Functional | Must Have | Customer preference |
| REQ-004 | Auto-save cart functionality | Functional | Must Have | Preserve cart across sessions |
| REQ-005 | Mobile-optimized checkout | Non-Functional | Must Have | 60% of traffic is mobile |
| REQ-006 | Real-time shipping calculation | Functional | Must Have | Prevent surprise costs |
| REQ-007 | Persistent order summary | Functional | Must Have | Transparency |
| REQ-008 | Address autofill | Functional | Should Have | Improve mobile UX |
| REQ-009 | Promo code support | Functional | Should Have | Marketing requirement |
| REQ-010 | Estimated delivery date | Functional | Could Have | Nice to have |
| REQ-011 | Multiple saved addresses | Functional | Could Have | Returning customer convenience |
| REQ-012 | PCI DSS compliance | Constraint | Must Have | Regulatory requirement |
| REQ-013 | GDPR/CCPA compliance | Constraint | Must Have | Regulatory requirement |
| REQ-014 | Stripe integration | Constraint | Must Have | Technical constraint |
| REQ-015 | Shopify Plus compatibility | Constraint | Must Have | Platform constraint |
| REQ-016 | Checkout time < 2 minutes | Non-Functional | Must Have | Performance target |
| REQ-017 | Cart abandonment < 50% | Non-Functional | Must Have | Success metric |

---

## Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Share interview notes with Michael for validation | Sarah | Jan 16 | ✅ Done |
| Schedule follow-up with customer service team | Sarah | Jan 18 | In Progress |
| Review current Stripe API capabilities | Tech Lead | Jan 20 | Pending |
| Analyze cart abandonment data by step | Analytics | Jan 20 | Pending |
| Research Shopify Plus checkout customization options | Sarah | Jan 22 | Pending |

---

## Follow-up Questions

1. **For Customer Service Team**: What are the most common checkout issues customers call about?
2. **For Technical Team**: What are the limitations of Shopify Plus checkout customization?
3. **For Marketing**: What promo code strategies are planned for Q2 campaign?
4. **For Michael**: Can we get access to heatmap data showing where users drop off in current checkout?

---

## Additional Notes

- Michael mentioned that their main competitor (CompanyX) has a very smooth one-page checkout that customers often reference
- There's a loyalty program integration that needs to be maintained - points should be redeemable at checkout
- International shipping is currently limited but may expand in Q3 - keep this in mind for scalability
- Mobile app is planned for later this year - checkout solution should be API-based to support future app

---

## Next Steps
1. ✅ Validate notes with Michael
2. Schedule workshop with cross-functional team (CS, Marketing, Tech, UX)
3. Conduct competitive analysis of checkout flows
4. Create detailed process map of current vs. future state
5. Begin drafting BRD for checkout optimization project
6. Schedule demo of best-in-class checkout experiences
