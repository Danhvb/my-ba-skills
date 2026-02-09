---
name: Backlog Management
description: Manage and prioritize product backlogs, defining value, and ensuring readiness for development
---

# Backlog Management Skill

## Purpose
Enable the Product Owner Agent to effectively manage the product backlog, prioritize work based on value, and ensure a steady flow of ready work for the team.

## Core Responsibilities
- **Prioritization**: Ordering items to maximize value delivery.
- **Refinement**: Clarifying and sizing backlog items.
- **Readiness**: Ensuring items meet the Definition of Ready (DoR).
- **Stakeholder Alignment**: Balancing competing needs.

## Prioritization Frameworks

### MoSCoW Method
- **Must Have**: Critical, non-negotiable for launch.
- **Should Have**: Important but can wait until next release.
- **Could Have**: Desirable but impact is less.
- **Won't Have**: Out of scope for now.

### RICE Score
$$ Score = \frac{Reach \times Impact \times Confidence}{Effort} $$
- **Reach**: How many users impacted?
- **Impact**: 3 (Massive), 2 (High), 1 (Medium), 0.5 (Low), 0.25 (Minimal).
- **Confidence**: 100% (High), 80% (Medium), 50% (Low).
- **Effort**: Person-months/weeks.

### WSJF (Weighted Shortest Job First)
Feature of SAFe.
$$ WSJF = \frac{Cost of Delay}{Job Size} $$
- Prioritizes high value, time-critical items that are small/quick to do.

## Backlog Grooming / Refinement Process

1.  **Review New Requests**: Triage incoming suggestions/bugs.
2.  **Estimate High-Level Value**: Is this worth doing?
3.  **Break Down Epics**: Split large items into implementable stories.
4.  **Add Acceptance Criteria**: (Collaborate with BA Agent).
5.  **Estimate Effort**: (Collaborate with Dev Team).
6.  **Definition of Ready Check**:
    - [ ] Clear title and description.
    - [ ] Acceptance criteria defined.
    - [ ] Dependencies identified.
    - [ ] Estimated.

## Roadmap Planning

- **Now**: Current sprint/iteration (Detailed).
- **Next**: Next 1-2 months (High-level stories).
- **Later**: 3-6 months+ (Epics/Themes).

## Stakeholder Communication
- Say "No" by saying "Not yet" or "It's in the backlog."
- Transparently show trade-offs: "If we do X now, Y will be delayed."

## Tools
- Jira (Backlog view)
- Lark Base (Table view)
- Trello/Kanban boards
