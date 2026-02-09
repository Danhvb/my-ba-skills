---
name: Process Optimization
description: Analyze existing processes to identify inefficiencies (waste) and design optimized workflows (Lean/Six Sigma)
---

# Process Optimization Skill

## Purpose
Streamline business operations by removing waste, reducing variation, and improving speed/quality. Moving from "As-Is" to a better "To-Be".

## When to Use
- "Process is too slow" complaints.
- High error rates or rework.
- Cost reduction initiatives.
- Automation projects (Automating a bad process = Faster bad process).
- Scaling operations (Manual process won't scale).

## Methodologies

### 1. Lean (Eliminate Waste)
Focus: Speed and Efficiency.
identify the **8 Wastes (DOWNTIME)**:
1.  **D**efects: Rework, errors.
2.  **O**verproduction: Making more than needed.
3.  **W**aiting: Idle time between steps.
4.  **N**on-utilized Talent: Underusing people's skills.
5.  **T**ransportation: Moving items unnecessarily.
6.  **I**nventory: Storing excess work/materials.
7.  **M**otion: Unnecessary movement of people.
8.  **E**xtra Processing: Doing more work than customer values (Gold plating).

### 2. Six Sigma (Reduce Variation)
Focus: Quality and Consistency (DMAIC).
- **Define**: Problem statement.
- **Measure**: Baseline current performance.
- **Analyze**: Root cause analysis.
- **Improve**: Implement solutions.
- **Control**: Sustain gains.

### 3. BPR (Business Process Reengineering)
Focus: Radical redesign (Blow it up and start over).

## Analysis Techniques

### 1. Value Added Analysis
For every process step, ask:
*   **Value Added (VA)**: Customer pays for this (e.g., Assembling product). -> **Keep/Optimize**.
*   **Business Value Added (BVA)**: Customer doesn't care, but regulation/business needs it (e.g., Audit logs, Payroll). -> **Minimize**.
*   **Non-Value Added (NVA)**: Waste (e.g., Waiting for approval, re-entering data). -> **Eliminate**.

### 2. Root Cause Analysis (5 Whys)
Problem: "Report is late."
1.  **Why?** Data wasn't ready.
2.  **Why?** System export failed.
3.  **Why?** Server timeout.
4.  **Why?** Query optimization issues.
5.  **Why?** No index on date column. -> **Root Cause**.

### 3. Fishbone Diagram (Ishikawa)
Categories causes of a problem:
- People
- Process
- Technology/Equipment
- Materials
- Environment

## Optimization Strategies (ECRS)

| Strategy | Action | Example |
|----------|--------|---------|
| **E**liminate | Remove NVA steps. | Stop printing emails to sign them. |
| **C**ombine | Merge steps/roles. | Cashier also packs bags. |
| **R**earrange | Change sequence. | Validate data *before* processing payment. |
| **S**implify | Make step easier. | Use dropdown instead of text field. |

## Process Optimization Report Template

### 1. Problem Statement
"Order fulfillment takes 5 days average, resulting in 10% cancellation rate."

### 2. Current State Metrics (Baseline)
- Cycle Time: 5 days
- Touch Time: 45 mins (Actual work duration)
- Process Efficiency: (45 mins / 5 days) = < 2% (Very bad - mostly waiting)

### 3. Root Cause Analysis
- Bottleneck at "Manager Approval" step (avg wait 2 days).
- Duplicate data entry between CRM and ERP (error prone).

### 4. Proposed Improvements
- **Short Term**: Raise approval threshold from $0 to $500 (Eliminates 80% of approvals).
- **Long Term**: Integrate CRM <-> ERP (Eliminates data entry).

### 5. Expected Benefits (To-Be)
- Cycle Time: 1 day (-80%)
- Cancellations: < 2%
- Annual Savings: $50k in labor.

## Checklist for Optimization
- [ ] Have I mapped the As-Is process?
- [ ] Have I measured the baseline?
- [ ] Have I identified the bottleneck? (Theory of Constraints)
- [ ] Have I consulted the people doing the work?
- [ ] Have I considered "Don't automate, obliterate" (Eliminate step first)?

## References
- The Goal (Eliyahu Goldratt).
- Lean Six Sigma Pocket Toolbook.
