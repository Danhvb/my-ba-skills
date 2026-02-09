# Implementation Plan for Shopee Flash Sale

- [ ] **Review Analysis with Stakeholders**
  - Discuss the "Stock Reservation" logic (lock on cart vs lock on checkout).
  - Confirm the "Price Integrity" validation rules.

- [ ] **Design Data Model**
  - Table: `flash_sale_campaigns` (slots, status).
  - Table: `flash_sale_items` (product_id, price, stock, limit_per_user).

- [ ] **Mockup UI**
  - Mobile: Homepage widget, Flash Sale landing page.
  - Seller Center: Nomination flow.

- [ ] **Technical Spec**
  - Redis integration for high-concurrency inventory counting.
  - Job queue for price flipping (Start/End events).

- [ ] **Finalize Spec**
