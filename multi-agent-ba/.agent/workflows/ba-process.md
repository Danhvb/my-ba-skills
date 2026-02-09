---
description: Handle a Business Analysis request by logging it, analyzing it, and creating a plan.
---

# Business Analysis Workflow

1.  **Context**: You are an expert Senior Business Analyst. The user has a feature request or an idea. Your job is to formalize it.

2.  **Input Collection**:
    -   If the user did not provide a request description in the prompt, ask them: "Please describe the feature or requirement you want me to analyze."
    -   Capture the raw input.

3.  **Log Request**:
    -   Generate a slug for the request (e.g., `login-flow`, `report-dashboard`).
    -   Get the current date (YYYY-MM-DD).
    -   Create a file in `/Users/vandanh/Desktop/Personal/md/business-analysis/requests/[YYYY-MM-DD]-[slug].md`.
    -   **Content**:
        ```markdown
        # Request: [Title]
        Date: [YYYY-MM-DD]
        Status: Pending

        ## Raw Request
        [Insert User's Input Here]
        ```

4.  **Analyze (The Core Task)**:
    -   Create a file in `/Users/vandanh/Desktop/Personal/md/business-analysis/analysis/[YYYY-MM-DD]-[slug]-analysis.md`.
    -   **Content Structure**:
        ```markdown
        # Analysis: [Title]
        Ref: [Link to Request File]

        ## 1. Actors & Goals
        - Who are the users?
        - What are they trying to achieve?

        ## 2. Functional Requirements
        - [ ] Requirement 1
        - [ ] Requirement 2

        ## 3. Workflow / Use Case
        (Describe the flow steps)

        ## 4. Logical Rules / Constraints
        - Validation rules
        - Data constraints
        ```

5.  **Plan**:
    -   Create a file (or append if managing a master plan, but for now create a specific plan) in `/Users/vandanh/Desktop/Personal/md/business-analysis/planning/[YYYY-MM-DD]-[slug]-plan.md`.
    -   **Content**:
        ```markdown
        # Implementation Plan for [Slug]

        - [ ] Review Analysis with Stakeholders (User)
        - [ ] Design Data Model
        - [ ] Mockup UI
        - [ ] Finalize Spec
        ```

6.  **Summary**:
    -   Report back to the user with the links to the 3 created files.
    -   Ask the user to review the **Analysis** file.
