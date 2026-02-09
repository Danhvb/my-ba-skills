# Sample Workshop Output: CRM Lead Management

## Workshop Details
- **Date**: January 10, 2026
- **Time**: 9:00 AM - 1:00 PM (4 hours)
- **Facilitator**: Jennifer Park (Senior BA)
- **Scribe**: Alex Thompson
- **Project**: CRM Lead Management Enhancement

## Participants
| Name | Role | Department |
|------|------|------------|
| David Kim | VP of Sales | Sales |
| Lisa Chen | Sales Manager | Sales |
| Marcus Johnson | Marketing Director | Marketing |
| Priya Patel | Sales Operations | Sales Ops |
| Tom Wilson | Sales Rep | Sales |
| Emma Davis | Marketing Automation Specialist | Marketing |

---

## Workshop Outcomes Summary

### Key Decisions Made
1. ✅ Lead scoring will be implemented using a 0-100 point system
2. ✅ Marketing Qualified Leads (MQL) threshold set at 60 points
3. ✅ Sales Qualified Leads (SQL) threshold set at 75 points
4. ✅ Lead assignment will be automated based on territory and product interest
5. ✅ Integration with HubSpot (marketing automation) is mandatory

---

## Session 1: Current State Process Map

### Current Lead Flow (As-Is)

```
Marketing Campaign → Lead Capture Form → Email to Sales → Manual Review → 
Manual Assignment → Sales Follow-up
```

### Pain Points Identified (Prioritized by Dot Voting)

| Pain Point | Votes | Priority |
|------------|-------|----------|
| Leads not followed up within 24 hours | 🔴🔴🔴🔴🔴🔴 (6) | P1 |
| No clear definition of qualified lead | 🔴🔴🔴🔴🔴 (5) | P1 |
| Manual lead assignment causes delays | 🔴🔴🔴🔴 (4) | P2 |
| Duplicate leads in system | 🔴🔴🔴🔴 (4) | P2 |
| No visibility into lead source ROI | 🔴🔴🔴 (3) | P3 |
| Lost leads due to lack of follow-up | 🔴🔴🔴 (3) | P3 |
| Inconsistent lead data quality | 🔴🔴 (2) | P4 |
| No lead nurturing for not-ready leads | 🔴🔴 (2) | P4 |

### What's Working Well
- ✅ Integration with website forms
- ✅ Email notifications to sales team
- ✅ Basic lead tracking in CRM

---

## Session 2: Future State Vision

### Future Lead Flow (To-Be)

```
Marketing Campaign → Lead Capture → Auto-Scoring → 
Auto-Qualification (MQL/SQL) → Auto-Assignment → 
Sales Notification → Immediate Follow-up

                                    ↓ (If not qualified)
                              Lead Nurturing Campaign
```

### Future State Capabilities

**Automated Lead Scoring**
- Real-time scoring based on demographic and behavioral data
- Score visible to sales and marketing
- Automatic re-scoring as lead engages

**Intelligent Lead Routing**
- Auto-assignment based on territory, product interest, and rep capacity
- Round-robin for equal distribution
- Escalation rules for high-value leads

**Lead Nurturing**
- Automated email sequences for low-score leads
- Re-engagement campaigns
- Automatic promotion to sales when score increases

**Analytics & Reporting**
- Lead source performance dashboard
- Conversion rates by source and campaign
- Sales rep performance metrics
- Lead velocity and aging reports

---

## Session 3: Requirements Brainstorming

### Functional Requirements (MoSCoW Prioritization)

#### Must Have (Critical for MVP)

**Lead Scoring Engine**
- REQ-001: System shall automatically score leads based on configurable criteria
- REQ-002: System shall assign points for demographic data (company size, industry, job title)
- REQ-003: System shall assign points for behavioral data (website visits, content downloads, email opens)
- REQ-004: System shall display lead score prominently in lead record
- REQ-005: System shall automatically update score in real-time as lead engages

**Lead Qualification**
- REQ-006: System shall automatically classify leads as MQL when score ≥ 60
- REQ-007: System shall automatically classify leads as SQL when score ≥ 75
- REQ-008: System shall send notification to sales when lead becomes SQL
- REQ-009: System shall allow manual override of qualification status

**Lead Assignment**
- REQ-010: System shall automatically assign SQLs to sales reps based on territory
- REQ-011: System shall support round-robin assignment within territories
- REQ-012: System shall check rep capacity before assignment (max 50 active leads)
- REQ-013: System shall send email and in-app notification to assigned rep
- REQ-014: System shall escalate to manager if lead not contacted within 24 hours

**Duplicate Management**
- REQ-015: System shall check for duplicate leads before creation (email match)
- REQ-016: System shall merge duplicate leads and preserve all activity history
- REQ-017: System shall alert user when potential duplicate is detected

**Integration**
- REQ-018: System shall integrate with HubSpot for bi-directional data sync
- REQ-019: System shall sync lead data every 15 minutes
- REQ-020: System shall capture lead source and campaign information from HubSpot

#### Should Have (Important but not critical)

**Lead Nurturing**
- REQ-021: System shall automatically enroll low-score leads in nurturing campaigns
- REQ-022: System shall remove leads from nurturing when score reaches MQL threshold
- REQ-023: System shall track nurturing email engagement

**Reporting**
- REQ-024: System shall provide lead source performance dashboard
- REQ-025: System shall show conversion rates by source and campaign
- REQ-026: System shall display lead aging report (time in each stage)
- REQ-027: System shall show sales rep performance metrics

**Lead Enrichment**
- REQ-028: System shall integrate with Clearbit for automatic company data enrichment
- REQ-029: System shall populate company size, industry, and revenue automatically

#### Could Have (Nice to have)

**Advanced Features**
- REQ-030: System shall support A/B testing of lead scoring models
- REQ-031: System shall provide predictive lead scoring using ML
- REQ-032: System shall recommend next best action for each lead
- REQ-033: System shall support custom lead stages beyond MQL/SQL

**Mobile**
- REQ-034: Sales reps shall be able to view and update leads on mobile app
- REQ-035: Mobile app shall send push notifications for new lead assignments

#### Won't Have (Out of scope for now)

- Advanced AI-powered lead recommendations
- Video prospecting integration
- Social media lead capture (beyond current LinkedIn forms)
- International territory management (future phase)

---

### Non-Functional Requirements

**Performance**
- REQ-NFR-001: Lead scoring shall complete within 5 seconds of data update
- REQ-NFR-002: Lead assignment shall occur within 1 minute of qualification
- REQ-NFR-003: System shall support 10,000 leads processed per month

**Usability**
- REQ-NFR-004: Lead score shall be visible on lead list view
- REQ-NFR-005: Sales reps shall be able to view scoring breakdown (why this score?)
- REQ-NFR-006: Admin shall be able to configure scoring rules without IT support

**Reliability**
- REQ-NFR-007: System shall have 99.5% uptime during business hours
- REQ-NFR-008: Failed integrations shall retry automatically with exponential backoff

**Security**
- REQ-NFR-009: Lead data shall be encrypted at rest and in transit
- REQ-NFR-010: Access to lead data shall be controlled by role-based permissions

---

## Session 4: Lead Scoring Model (Defined in Workshop)

### Demographic Scoring (Max 40 points)

| Criteria | Points |
|----------|--------|
| **Job Title** | |
| C-Level (CEO, CTO, CFO) | 20 |
| VP/Director | 15 |
| Manager | 10 |
| Individual Contributor | 5 |
| **Company Size** | |
| Enterprise (1000+ employees) | 15 |
| Mid-Market (100-999 employees) | 10 |
| Small Business (10-99 employees) | 5 |
| Startup (<10 employees) | 2 |
| **Industry** | |
| Target Industries (Tech, Finance, Healthcare) | 5 |
| Other Industries | 0 |

### Behavioral Scoring (Max 60 points)

| Activity | Points |
|----------|--------|
| Visited pricing page | 15 |
| Downloaded whitepaper | 10 |
| Attended webinar | 15 |
| Requested demo | 25 |
| Opened email | 2 |
| Clicked email link | 5 |
| Visited website (per visit, max 10) | 2 |
| Filled out contact form | 10 |

### Negative Scoring (Deductions)

| Criteria | Points |
|----------|--------|
| Personal email address (gmail, yahoo, etc.) | -10 |
| Competitor company | -50 |
| Student email (.edu) | -15 |
| No activity in 90 days | -20 |

---

## Dependencies & Constraints

### Dependencies
- HubSpot API access and credentials
- Clearbit API subscription (for enrichment)
- CRM admin access for configuration
- Sales team training on new process

### Constraints
- Must use existing Salesforce CRM platform
- Budget: $50K for implementation
- Timeline: Go-live by March 31, 2026
- Cannot change HubSpot instance (marketing owns this)

### Assumptions
- Sales reps will adopt new process with proper training
- Lead volume will remain consistent (~2000 leads/month)
- HubSpot API will remain stable and available
- Clearbit data quality is acceptable

---

## Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Document detailed lead scoring algorithm | Jennifer | Jan 15 | ✅ Done |
| Get HubSpot API credentials | Marcus | Jan 17 | In Progress |
| Create territory mapping spreadsheet | Priya | Jan 20 | Pending |
| Design lead assignment logic flowchart | Jennifer | Jan 22 | Pending |
| Schedule technical feasibility review | Jennifer | Jan 24 | Pending |
| Draft BRD for lead management enhancement | Jennifer | Jan 30 | Pending |
| Present workshop outcomes to executive team | David | Feb 5 | Pending |

---

## Parking Lot (Out of Scope Items)

1. **Account-based marketing (ABM) integration** - Deferred to Phase 2
2. **LinkedIn Sales Navigator integration** - Requires separate budget approval
3. **Custom lead stages beyond MQL/SQL** - Will revisit after 3 months of usage
4. **International territory rules** - Not needed until Q3 expansion
5. **AI-powered email content suggestions** - Nice to have, not critical

---

## Next Steps

1. ✅ Share workshop summary with all participants for validation
2. Create detailed process flows (current state vs. future state)
3. Draft Business Requirement Document (BRD)
4. Schedule technical architecture review with IT team
5. Create project timeline and resource plan
6. Identify vendor/implementation partner if needed
7. Begin FRS development for lead scoring engine
8. Plan change management and training approach

---

## Facilitator Notes

**Group Dynamics**:
- Sales and Marketing had initial disagreement on MQL definition - resolved through data-driven discussion
- Tom (sales rep) provided valuable ground-level perspective on lead quality issues
- Strong consensus on need for automation - everyone aligned on pain points

**Key Insights**:
- Current 48-hour average response time is hurting conversion - industry best practice is <5 minutes
- 30% of leads are duplicates due to multiple form submissions
- Sales reps spend 2 hours/day on manual lead research - automation could save 10 hours/week per rep
- Marketing has rich behavioral data in HubSpot not being leveraged

**Risks Identified**:
- Change management - sales team may resist new process
- Data quality in HubSpot needs cleanup before integration
- Scoring model may need tuning after go-live based on actual conversion data
