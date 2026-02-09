# D-Core API - Comprehensive Source Code Analysis

**Ngày phân tích:** 08/02/2026  
**Repository:** `/Users/vandanh/Code/DDV/ddv-dcore-api`  
**Phiên bản:** 1.0.8

---

## 📋 Executive Summary

**D-Core API** là hệ thống ERP (Enterprise Resource Planning) backend core của **Di Động Việt (DDV)**, được xây dựng trên **Node.js** với kiến trúc **MVC** (Model-View-Controller). Hệ thống quản lý toàn bộ quy trình bán hàng, kho vận, nhân sự, và tài chính của DDV.

### Quy mô hệ thống:
- **170+ API Routers**
- **162+ Controllers**
- **182+ Services**
- **299+ Database Models**
- **Tech Stack:** Node.js, Express, Sequelize, MySQL, Redis, RabbitMQ, Google Cloud Platform

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     D-Core API (Express)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Routers    │→ │ Controllers  │→ │   Services   │      │
│  │  (170+)      │  │   (162+)     │  │   (182+)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                              ↓                │
│                                    ┌──────────────┐          │
│                                    │  Repositories│          │
│                                    └──────────────┘          │
│                                              ↓                │
│                                    ┌──────────────┐          │
│                                    │    Models    │          │
│                                    │    (299+)    │          │
│                                    └──────────────┘          │
└─────────────────────────────────────────────────────────────┘
                    ↓                           ↓
        ┌───────────────────┐       ┌───────────────────┐
        │  MySQL Database   │       │  Redis Cache      │
        └───────────────────┘       └───────────────────┘
                    ↓
        ┌───────────────────────────────────────┐
        │  External Integrations                │
        ├───────────────────────────────────────┤
        │ • RabbitMQ (Message Queue)            │
        │ • Google Cloud (Storage, Logging)     │
        │ • Firebase (Push Notifications)       │
        │ • Antsomi (CDP Integration)           │
        │ • Ladi (Marketing Automation)         │
        │ • MBF, SVFC (Installment Partners)    │
        └───────────────────────────────────────┘
```

### Architectural Pattern

**Layered Architecture (MVC + Service Layer):**

1. **Routers** (`src/routers/`) - Định nghĩa API endpoints
2. **Controllers** (`src/controllers/`) - Xử lý HTTP requests/responses
3. **Services** (`src/services/`) - Business logic layer
4. **Repositories** (`src/repositories/`) - Data access layer
5. **Models** (`src/models/`) - Sequelize ORM models (299+ models)

---

## 🛠️ Tech Stack Analysis

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | ≥ 14.0.0 | Runtime environment |
| **Express** | 4.17.1 | Web framework |
| **Sequelize** | 5.22.5 | ORM for MySQL |
| **MySQL** | ≥ 8.0.0 | Primary database |
| **Redis** | ≥ 3.1.0 | Caching layer |

### Key Dependencies

#### Infrastructure & Monitoring
- **Google Cloud Platform:**
  - `@google-cloud/storage` - File storage
  - `@google-cloud/logging-winston` - Centralized logging
  - `@google-cloud/trace-agent` - Distributed tracing
  - `@google-cloud/error-reporting` - Error tracking
- **Prometheus:** `express-prometheus-middleware` - Metrics collection
- **Winston:** Logging framework
- **PM2:** Process management (read/write cluster separation)

#### Message Queue & Events
- **RabbitMQ:** `amqplib` - Async message processing
- **Node-cron:** Scheduled tasks

#### Authentication & Security
- **JWT:** `jsonwebtoken` - Token-based auth
- **bcrypt:** Password hashing
- **OAuth2:** Custom implementation

#### External Integrations
- **Firebase Admin:** Push notifications
- **Axios:** HTTP client for external APIs
- **Nodemailer:** Email sending
- **Google APIs:** `googleapis` - Google services integration

#### Data Processing
- **Excel:** `exceljs`, `excel4node`, `xlsx` - Excel file handling
- **QR Code:** `qrcode` - QR generation
- **Sharp:** Image processing
- **Moment:** Date/time manipulation

#### Validation & Utilities
- **Joi:** Request validation
- **Lodash:** Utility functions
- **Ajv:** JSON schema validation

---

## 📦 Core Modules Analysis

### 1. **Sales & Order Management** (Bán hàng)

**Models:**
- `bill.js` (11,702 bytes) - Hóa đơn bán hàng
- `billitem.js` - Chi tiết sản phẩm trong hóa đơn
- `order.js` (7,680 bytes) - Đơn hàng
- `orderitem.js` - Chi tiết đơn hàng
- `payment.js` - Thanh toán
- `transaction.js` - Giao dịch

**Controllers:**
- `BillController.js`
- `BillControllerV2.js` (Version 2 - refactored)
- `BillSearchController.js` - Tìm kiếm hóa đơn
- `BillOneTouchPointController.js` - One-touch checkout

**Key Features:**
- ✅ Multi-channel sales (Online, Offline, Mobile)
- ✅ Complex pricing logic (discounts, vouchers, installments)
- ✅ Bill VAT support (`billvat.js`)
- ✅ Affiliate tracking (`bill-affiliate-tracking.js`)

### 2. **Inventory Management** (Quản lý kho)

**Models:**
- `stockslip.js` (5,921 bytes) - Phiếu kho
- `stockslipdetail.js` - Chi tiết phiếu kho
- `productstock.js` - Tồn kho sản phẩm
- `inventorybalance.js` - Cân đối kho
- `inventoryquotas.js` - Hạn mức tồn kho
- `productimeistock.js` - Quản lý IMEI

**Controllers:**
- `CheckStockController.js`
- `ImeiController.js`
- `ImeiActiveReportController.js`

**Key Features:**
- ✅ IMEI tracking for electronics
- ✅ Stock transfer between stores
- ✅ Inventory quotas management
- ✅ Stock check/audit functionality

### 3. **Product Management** (Quản lý sản phẩm)

**Models:**
- `product.js` (8,038 bytes) - Sản phẩm chính
- `category.js` - Danh mục sản phẩm
- `brand.js` - Thương hiệu
- `productPrice.js` - Giá sản phẩm
- `productPriceConfig.js` - Cấu hình giá
- `productcombo.js` - Combo sản phẩm
- `flexiblecombo.js` - Combo linh hoạt

**Controllers:**
- `ProductController.js`
- `CategoryController.js`
- `BrandController.js`
- `ComboController.js`
- `FlexibleComboController.js`

**Key Features:**
- ✅ Dynamic pricing (price history tracking)
- ✅ Product combos & flexible combos
- ✅ Product properties & variants
- ✅ External category mapping

### 4. **Customer Management** (Quản lý khách hàng)

**Models:**
- `customer.js` (3,559 bytes) - Khách hàng
- `customerMembership.js` - Thành viên
- `customerpoint.js` - Điểm tích lũy
- `customerType.js` - Phân loại khách hàng
- `customercare.js` - Chăm sóc khách hàng
- `rfmSegments.js` - RFM segmentation

**Controllers:**
- `CustomerController.js`
- `CustomerRFMController.js` - RFM analysis
- `CustomerCareController.js`
- `CustomerOTPController.js`

**Key Features:**
- ✅ Customer loyalty program
- ✅ RFM segmentation for marketing
- ✅ Customer care tracking
- ✅ OTP authentication

### 5. **HR & Payroll** (Nhân sự & Lương)

**Models:**
- `employee.js` (3,875 bytes) - Nhân viên
- `payroll.js` (7,103 bytes) - Bảng lương
- `salaryreport.js` - Báo cáo lương
- `allowanceconfig.js` - Cấu hình phụ cấp
- `rewardprogram.js` - Chương trình thưởng

**Controllers:**
- `EmployeeController.js`
- `HumanResourceController.js`
- `AllowanceController.js`

**Key Features:**
- ✅ Complex payroll calculation
- ✅ Allowance & reward management
- ✅ Employee debt tracking
- ✅ HRM system sync

### 6. **Promotion & Marketing** (Khuyến mãi)

**Models:**
- `couponprogram.js` - Chương trình coupon
- `discountprogram.js` - Chương trình giảm giá
- `promotion.js` - Khuyến mãi
- `campaign.js` - Chiến dịch marketing
- `pointprogram.js` - Chương trình điểm

**Controllers:**
- `CouponController.js`
- `CampaignController.js`
- `PromotionController.js`

**Key Features:**
- ✅ Multi-type promotions
- ✅ Coupon management
- ✅ Point accumulation programs
- ✅ Campaign tracking

### 7. **Trade-In & Warranty** (Thu cũ & Bảo hành)

**Models:**
- `tradein.js` (4,410 bytes) - Thu cũ đổi mới
- `tradeinprogram.js` - Chương trình thu cũ
- `warranty.js` (3,386 bytes) - Bảo hành
- `warrantyPackage.js` - Gói bảo hành

**Controllers:**
- `TradeInController.js`
- `WarrantyController.js`

**Key Features:**
- ✅ Trade-in valuation
- ✅ Warranty registration
- ✅ Warranty claim tracking

### 8. **Installment & Financing** (Trả góp)

**Models:**
- `installment-program.js` (3,894 bytes)
- `loanapplication.js` - Đơn vay
- `mbf-transaction.js` - MBF transactions
- `svfcprogram.js` - SVFC program

**Controllers:**
- `InstallmentController.js`
- `MBFController.js`

**Key Features:**
- ✅ Multiple installment partners (MBF, SVFC, Kredivo)
- ✅ Loan application processing
- ✅ Installment transaction tracking

### 9. **Reporting & Analytics** (Báo cáo)

**Models:**
- `salaryreport.js` (4,993 bytes)
- `targetreport.js` - Báo cáo chỉ tiêu
- `imeiactivereport.js` - Báo cáo kích hoạt IMEI
- `power-bi-report.js` - Power BI integration

**Controllers:**
- `ReportController.js`
- `ImeiActiveReportController.js`
- `MobileReportController.js`

**Key Features:**
- ✅ Power BI integration
- ✅ Mobile reporting
- ✅ Real-time analytics

### 10. **External Integrations** (Tích hợp bên ngoài)

**Sync Modules:**
- **CMS Sync:** `cms-sync-config.js`, `CMSSyncController.js`
- **Antsomi (CDP):** `antsomi-sync-config.js`, `AntsomiController.js`
- **Ladi (Marketing):** `ladi-sync-config.js`, `LadiController.js`
- **HRM Sync:** `hrm-sync-config.js`, `HRMSyncController.js`
- **Fast Sync:** `fast-sync-config.js`, `FastSyncController.js`
- **MR Sync:** `mr-sync-config.js`

**Key Features:**
- ✅ Multi-system synchronization
- ✅ Webhook event handling
- ✅ Retry & error handling mechanisms

---

## 🔧 Infrastructure & DevOps

### Deployment Architecture

**Multi-Cluster Setup:**
```javascript
// From app.js
if (process.env.SERVER_PURPOSE === 'read') {
    // Read cluster - handles GET requests
    notificator.receive(customMessageHandler);
}
if (process.env.SERVER_PURPOSE === 'write') {
    // Write cluster - handles POST/PUT/DELETE
    productRevenueChanel.receive(customMessageHandler);
}
```

**PM2 Process Management:**
- `pm2.config.json` - Development
- `pm2.config.read.json` - Production read cluster
- `pm2.config.write.json` - Production write cluster

### Monitoring & Observability

**Google Cloud Integration:**
- **Trace Agent:** Distributed tracing
- **Error Reporting:** Automatic error capture
- **Cloud Logging:** Centralized logs via Winston

**Prometheus Metrics:**
```javascript
// From app.js
app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    customLabels: ['req_ip', 'req_user_agent', 'req_username']
}));
```

### Message Queue (RabbitMQ)

**Channels:**
- `notificator` - General notifications
- `productRevenueChanel` - Product revenue events

**Usage:**
- Async processing
- Event-driven architecture
- Decoupling services

### Docker Support

**Files:**
- `Dockerfile` - Production build
- `Dockerfile.dev` - Development build
- `docker-compose.yml` - Production
- `docker-compose.development.yml` - Development
- `docker-compose.staging.yml` - Staging

---

## 📊 Database Schema Overview

### Total Models: **299+**

**Major Entity Groups:**

1. **Sales (Bán hàng):** 15+ models
   - bill, billitem, order, orderitem, payment, transaction

2. **Inventory (Kho):** 20+ models
   - stockslip, productstock, inventorybalance, imei tracking

3. **Products (Sản phẩm):** 25+ models
   - product, category, brand, pricing, combos

4. **Customers (Khách hàng):** 15+ models
   - customer, membership, points, RFM segments

5. **HR (Nhân sự):** 20+ models
   - employee, payroll, allowance, rewards

6. **Promotions (Khuyến mãi):** 10+ models
   - coupons, discounts, campaigns, loyalty programs

7. **Trade-In & Warranty:** 10+ models
   - tradein, warranty, valuation

8. **Installments (Trả góp):** 8+ models
   - installment programs, loan applications, partner integrations

9. **Sync & Integration:** 15+ models
   - CMS, Antsomi, Ladi, HRM, Fast sync configs

10. **System (Hệ thống):** 20+ models
    - users, roles, api-keys, oauth2, settings

---

## 🔐 Authentication & Authorization

### Authentication Methods

1. **JWT Tokens:** `jsonwebtoken`
   - Access tokens
   - Refresh tokens (OAuth2)

2. **API Keys:** `api-key.js` model
   - Partner API authentication

3. **OAuth2:** Custom implementation
   - `oauth2-accesstokens.js`
   - `oauth2-refreshtokens.js`
   - `oauth2-applications.js`

4. **Firebase Auth:** For mobile apps

### Authorization

**Role-Based Access Control (RBAC):**
- `role.js` - Roles definition
- `rolefeature.js` - Feature permissions
- `user-access.js` - User access control

---

## 📈 Code Quality & Standards

### Code Organization

**Strengths:**
- ✅ Clear separation of concerns (MVC + Service layer)
- ✅ Consistent naming conventions
- ✅ Modular structure
- ✅ Comprehensive error handling

**Areas for Improvement:**
- ⚠️ Large model files (e.g., `bill.js` 11KB, `product.js` 8KB)
- ⚠️ Sequelize v5 (outdated, current is v6)
- ⚠️ Mixed ES5/ES6 syntax (should standardize)

### Testing

**Test Framework:** Jest
- `jest.config.js` configured
- Test files in `tests/` directory
- Coverage reporting enabled

**Test Scripts:**
```json
"test": "jest --setupFiles dotenv/config",
"coverage": "jest --setupFiles dotenv/config --coverage"
```

### Code Standards

**Linting:**
- ESLint configured (`.eslintrc.json`)
- Prettier for code formatting (`.prettierrc.json`)

**Scripts:**
```json
"lint": "./node_modules/.bin/eslint src --fix",
"pretty": "prettier --write \"src/**/*.{js,jsx,json}\""
```

---

## 🚀 Performance Optimizations

### Caching Strategy

**Redis Integration:**
- Session caching
- Query result caching
- Frequently accessed data

### Database Optimization

**Sequelize Features:**
- Connection pooling
- Query optimization
- Eager loading for related data

### Read/Write Separation

**Cluster Architecture:**
- Read cluster for GET requests
- Write cluster for POST/PUT/DELETE
- Load balancing via PM2

---

## 🔄 Migration & Database Management

**Sequelize CLI:**
```bash
npm run db:migrate      # Run migrations
npm run db:status       # Check migration status
```

**Migration Files:** `src/migrations/`
- Raw SQL migrations in `migrations/raw_sqls/`

---

## 📝 API Documentation

**HTTP Test Files:** `http/` directory
- Manual API testing files
- Request examples

**Swagger/OpenAPI:**
- Not currently implemented
- **Recommendation:** Add Swagger for API documentation

---

## ⚠️ Technical Debt & Recommendations

### Critical Issues

1. **Sequelize Version (v5.22.5)**
   - ❌ **Outdated** (current stable: v6.x)
   - ❌ Security vulnerabilities
   - ✅ **Recommendation:** Upgrade to Sequelize v6

2. **Node.js Version (v14)**
   - ⚠️ **EOL** (End of Life: April 2023)
   - ✅ **Recommendation:** Upgrade to Node.js v18 LTS or v20 LTS

3. **Large Model Files**
   - ⚠️ Some models exceed 10KB (e.g., `bill.js`, `payroll.js`)
   - ✅ **Recommendation:** Split into smaller, focused modules

### Security Concerns

1. **Dependency Vulnerabilities**
   - Run `npm audit` to check
   - Update vulnerable packages

2. **CORS Configuration**
   ```javascript
   cors({ origin: '*' })  // ⚠️ Too permissive
   ```
   - ✅ **Recommendation:** Restrict to specific domains

3. **Environment Variables**
   - Ensure `.env` files are not committed
   - Use secret management (Google Secret Manager)

### Performance Improvements

1. **Database Indexing**
   - Review and optimize indexes
   - Add composite indexes for common queries

2. **Query Optimization**
   - Implement query result caching
   - Use database views for complex reports

3. **API Response Time**
   - Implement pagination for large datasets
   - Add request rate limiting

### Code Quality

1. **TypeScript Migration**
   - ✅ **Recommendation:** Gradually migrate to TypeScript
   - Better type safety and IDE support

2. **API Documentation**
   - ✅ **Recommendation:** Implement Swagger/OpenAPI
   - Auto-generate API docs from code

3. **Unit Test Coverage**
   - ✅ **Recommendation:** Increase test coverage to >80%
   - Add integration tests

### Architecture Improvements

1. **Microservices Consideration**
   - Current: Monolithic architecture
   - ✅ **Recommendation:** Consider breaking into microservices:
     - Sales Service
     - Inventory Service
     - Customer Service
     - HR Service

2. **Event Sourcing**
   - ✅ **Recommendation:** Implement event sourcing for audit trails
   - Better data consistency and debugging

3. **GraphQL API**
   - ✅ **Recommendation:** Add GraphQL layer for flexible querying
   - Reduce over-fetching/under-fetching

---

## 📚 Documentation References

**Internal Documentation:**
- Confluence: https://didongviet.atlassian.net/wiki/home
- Team Rules: https://didongviet.atlassian.net/wiki/spaces/CORE/pages/175341614/Team+Rules
- Workflow: https://didongviet.atlassian.net/wiki/spaces/CORE/pages/169738241/WorkFlow+BUG+in+Jira
- Deployment: https://didongviet.atlassian.net/wiki/spaces/CORE/pages/174882860/Deloyment+D-Core+Rules
- Code Rules: https://didongviet.atlassian.net/wiki/spaces/CORE/pages/178520065/Development+code+rules

---

## 🎯 Summary & Key Takeaways

### Strengths

1. ✅ **Comprehensive ERP System** - Covers all business operations
2. ✅ **Well-Structured Code** - Clear MVC + Service layer architecture
3. ✅ **Scalable Infrastructure** - Read/write cluster separation
4. ✅ **Robust Monitoring** - Google Cloud + Prometheus integration
5. ✅ **Extensive Integrations** - Multiple external systems connected

### Weaknesses

1. ❌ **Outdated Dependencies** - Sequelize v5, Node.js v14
2. ❌ **Monolithic Architecture** - Difficult to scale individual components
3. ❌ **Limited API Documentation** - No Swagger/OpenAPI
4. ⚠️ **Security Concerns** - Permissive CORS, potential vulnerabilities

### Priority Actions

**Short-term (1-3 months):**
1. Upgrade Node.js to v18/v20 LTS
2. Run security audit and fix vulnerabilities
3. Implement API documentation (Swagger)
4. Restrict CORS configuration

**Medium-term (3-6 months):**
1. Upgrade Sequelize to v6
2. Increase unit test coverage
3. Optimize database queries and indexes
4. Implement request rate limiting

**Long-term (6-12 months):**
1. Consider TypeScript migration
2. Evaluate microservices architecture
3. Implement event sourcing for critical flows
4. Add GraphQL API layer

---

## 📞 Contact & Support

**Development Team:** DDV Core Team  
**Documentation:** https://didongviet.atlassian.net/wiki/home  
**Repository:** GitLab (Internal)

---

*Phân tích này được tạo bởi AI Agent dựa trên source code thực tế của D-Core API.*
