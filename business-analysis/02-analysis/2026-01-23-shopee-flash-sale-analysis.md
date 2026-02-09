# Analysis: Tính năng Flash Sale Shopee
Ref: [Link to Request File](../requests/2026-01-23-shopee-flash-sale.md)

## 1. Actors & Goals
- **Buyer (Người mua)**:
  - Wants to purchase products at a significantly discounted price.
  - Wants to see upcoming sales to plan purchases.
  - Wants a fair chance to buy limited stock items.
- **Seller (Người bán)**:
  - Wants to increase shop traffic and followers.
  - Wants to clear inventory (stock clearance).
  - Wants to boost sales volume to improve product ranking.
- **System Admin (Shopee Operation)**:
  - Wants to organize attractive campaigns to drive traffic to the platform.
  - Wants to ensure system stability during high-traffic peaks.
  - Wants to control quality of products in Flash Sale (no fake discounts).

## 2. Functional Requirements
### 2.1. Campaign Management (Admin)
- [ ] Create Flash Sale time slots (e.g., 00:00, 09:00, 12:00, 21:00).
- [ ] Set criteria for participation (min discount %, min stock, category restrictions).
- [ ] Approve/Reject seller nominations.

### 2.2. Product Nomination (Seller)
- [ ] View available Flash Sale slots.
- [ ] Nominate products for specific slots.
- [ ] Set Flash Sale price (must met criteria) and Flash Sale stock quantity.
- [ ] View nomination status (Pending, Approved, Rejected).

### 2.3. Flash Sale Display (Buyer)
- [ ] **Homepage Banner**: Entry point to Flash Sale section.
- [ ] **Timeline Bar**: Show current and upcoming time slots.
- [ ] **Product Card**:
  - Show original price vs. Flash Sale price.
  - Show discount percentage tag.
  - Show progress bar (sold quantity / total flash sale stock).
  - Show "Sold Out" overlay if stock is 0.
- [ ] **Remind Me**: Button to receive notification 3 minutes before sale starts.

### 2.4. Purchasing Logic
- [ ] **Price Application**: Apply Flash Sale price only during the time slot.
- [ ] **Purchase Limit**: Limit Quantity Per User (e.g., max 1 item per user) to prevent scalping.
- [ ] **Stock Reservation**: Temporarily hold stock when added to cart (or only on checkout start - TBD based on tech constraints).

## 3. Workflow / Use Case
**Step 1: Campaign Setup**
1. Admin creates a "Tet Holiday Flash Sale" campaign with slots at 9AM, 12PM, 9PM.
2. System opens registration for eligible sellers.

**Step 2: Seller Registration**
1. Seller A logs into Seller Center -> Marketing Centre -> Flash Sale.
2. Seller A selects 12PM slot.
3. Seller A adds "Wireless Mouse" (Original: 100k, FS Price: 50k, Stock: 100).
4. System validates price rules (< lowest price in 30 days).

**Step 3: Approval**
1. System auto-approves if high seller rating, or Admin manually reviews.

**Step 4: Live Event**
1. At 11:57 AM, System sends "Reminder" notification to interested users.
2. At 12:00 PM, Price flips to 50k.
3. User B buys 1 item.
4. Stock decreases to 99. Progress bar updates.

**Step 5: Post-Event**
1. At 13:00 PM, Flash Sale ends. Price reverts to 100k (or normal price).

## 4. Logical Rules / Constraints
- **Inventory Locking**: Flash Sale stock is separate from normal stock or locked from standard inventory.
- **Time Overlap**: A product cannot participate in two overlapping Flash Sale slots.
- **Price Integrity**: Discounted price must be lower than the lowest paid price in the last 7 days to avoid "fake pricing".
- **Designated Stock**: Only the designated quantity is sold at the FS price. Once sold out, the item either shows "Sold Out" or reverts to normal price (Business Decision: usually "Sold Out" for the slot).
