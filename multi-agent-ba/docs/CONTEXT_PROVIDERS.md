# Context Providers - GitHub Integration

## Overview

Hệ thống Context Providers cho phép agents truy cập thông tin từ GitHub repositories để có context tốt hơn khi phân tích requirements.

## Architecture

```
Context Providers
├── GitHubProvider      # Fetch từ GitHub API
├── LocalRepoProvider   # Index local repos
└── ManualProvider      # Manual context files
```

## Setup

### 1. GitHub Provider (Automatic)

**Config trong `.env`:**
```bash
# GitHub Integration
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPOS=org/repo1,org/repo2,org/repo3

# Context Options
CONTEXT_INCLUDE_CODE=true
CONTEXT_INCLUDE_README=true
CONTEXT_INCLUDE_ISSUES=false
CONTEXT_INCLUDE_PRS=false
```

**Usage:**
```bash
# Run agent with GitHub context
npm run cli -- agent run senior-ba \
  --input "Analyze payment feature" \
  --repo your-org/product-name \
  --domain ecommerce
```

### 2. Local Repository Provider

**Setup:**
```bash
# Clone repos to local
mkdir -p repos
cd repos
git clone https://github.com/your-org/product1
git clone https://github.com/your-org/product2
```

**Config trong `.env`:**
```bash
LOCAL_REPOS_PATH=../repos
```

**Usage:**
```bash
# Agent tự động scan repos/ folder
npm run cli -- agent run senior-ba \
  --input "Analyze checkout flow" \
  --local-repo product1
```

### 3. Manual Context Files

**Structure:**
```
business-analysis/
└── context/
    ├── product1/
    │   ├── overview.md
    │   ├── architecture.md
    │   ├── api-endpoints.md
    │   └── database-schema.md
    ├── product2/
    │   └── overview.md
    └── README.md
```

**Example Context File:**
```markdown
# Product: E-commerce Platform

## Overview
- Platform: Next.js + Node.js
- Database: PostgreSQL
- Payment: Stripe

## Key Features
- Shopping cart
- Checkout flow
- Payment processing
- Order management

## Architecture
- Frontend: Next.js (App Router)
- Backend: Express.js
- Database: PostgreSQL with Prisma
- Cache: Redis

## API Endpoints
- POST /api/cart/add
- POST /api/checkout
- POST /api/payment/process

## Database Schema
- users
- products
- orders
- payments
```

**Usage:**
```bash
# Agent tự động load context từ business-analysis/context/
npm run cli -- agent run senior-ba \
  --input "Add wishlist feature" \
  --context product1
```

---

## Implementation

### Phase 1: Manual Context (Quick Start)

**Bước 1: Tạo context folder**
```bash
mkdir -p business-analysis/context
```

**Bước 2: Tạo context file cho mỗi product**
```bash
# business-analysis/context/my-product/overview.md
```

**Bước 3: Agent tự động load context**
- Khi run agent với `--context my-product`
- System load tất cả `.md` files trong `context/my-product/`
- Inject vào prompt

### Phase 2: Local Repo Indexing

**Features:**
- Tự động scan `repos/` folder
- Index code structure
- Extract README, package.json, etc.
- Build context từ code

**Implementation:**
```typescript
class LocalRepoProvider {
  async getContext(repoName: string): Promise<RepoContext> {
    const repoPath = path.join(REPOS_PATH, repoName);
    
    return {
      readme: await this.readREADME(repoPath),
      structure: await this.getFileStructure(repoPath),
      packageInfo: await this.getPackageInfo(repoPath),
      recentCommits: await this.getRecentCommits(repoPath),
    };
  }
}
```

### Phase 3: GitHub API Integration

**Features:**
- Fetch repo info via GitHub API
- Get README, code structure
- Optional: Issues, PRs, Wiki

**Implementation:**
```typescript
class GitHubProvider {
  async getContext(repo: string): Promise<RepoContext> {
    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    
    const [owner, name] = repo.split('/');
    
    return {
      readme: await this.fetchREADME(owner, name),
      structure: await this.fetchFileTree(owner, name),
      recentCommits: await this.fetchCommits(owner, name),
      issues: INCLUDE_ISSUES ? await this.fetchIssues(owner, name) : [],
    };
  }
}
```

---

## Usage Examples

### Example 1: Manual Context

```bash
# 1. Create context file
cat > business-analysis/context/shopee-clone/overview.md << EOF
# Shopee Clone - E-commerce Platform

## Tech Stack
- Frontend: Next.js 14
- Backend: NestJS
- Database: PostgreSQL
- Payment: Stripe

## Current Features
- Product catalog
- Shopping cart
- User authentication
- Order management
EOF

# 2. Run agent with context
npm run cli -- agent run senior-ba \
  --input "Analyze flash sale feature requirements" \
  --context shopee-clone \
  --domain ecommerce
```

### Example 2: Local Repo

```bash
# 1. Clone repo
cd repos
git clone https://github.com/your-org/shopee-clone

# 2. Run agent
npm run cli -- agent run senior-ba \
  --input "Add wishlist feature" \
  --local-repo shopee-clone
```

### Example 3: GitHub API

```bash
# 1. Set GitHub token in .env
GITHUB_TOKEN=ghp_xxxxx

# 2. Run agent
npm run cli -- agent run senior-ba \
  --input "Analyze payment integration" \
  --repo your-org/shopee-clone
```

---

## Context Injection

Context được inject vào LLM prompt như sau:

```
You are a Senior Business Analyst...

SKILL: Requirements Elicitation
[skill content]

TASK: Analyze flash sale feature

PRODUCT CONTEXT:
Repository: shopee-clone
Tech Stack: Next.js 14, NestJS, PostgreSQL
Current Features:
- Product catalog
- Shopping cart
- User authentication

Architecture:
[architecture details]

Recent Changes:
- Added payment integration (2 days ago)
- Refactored cart logic (1 week ago)

INSTRUCTIONS:
Consider the existing architecture and tech stack when analyzing requirements...
```

---

## Best Practices

### 1. Context File Organization

```
business-analysis/context/
├── README.md                    # Index of all products
├── product1/
│   ├── overview.md             # High-level overview
│   ├── architecture.md         # System architecture
│   ├── api.md                  # API documentation
│   ├── database.md             # Database schema
│   └── features.md             # Current features
└── product2/
    └── overview.md
```

### 2. Keep Context Updated

- Update context files khi có thay đổi lớn
- Commit context files vào git
- Review context định kỳ

### 3. Context Size Management

- Không include toàn bộ code
- Chỉ include high-level structure
- Focus vào relevant parts

---

## Roadmap

### ✅ Phase 1: Manual Context (Immediate)
- Create `business-analysis/context/` folder
- Add context files for products
- Update CLI to load context

### 🔄 Phase 2: Local Repo Indexing (Week 1-2)
- Implement LocalRepoProvider
- Auto-scan repos folder
- Extract key information

### 📅 Phase 3: GitHub Integration (Week 3-4)
- Implement GitHubProvider
- GitHub API integration
- Caching strategy

---

## Quick Start (5 minutes)

```bash
# 1. Create context for your product
mkdir -p business-analysis/context/my-product

cat > business-analysis/context/my-product/overview.md << EOF
# My Product

## Tech Stack
- Frontend: React
- Backend: Node.js
- Database: MongoDB

## Features
- User management
- Dashboard
- Reports
EOF

# 2. Update .env (if using GitHub)
echo "GITHUB_TOKEN=your_token" >> multi-agent-ba/.env

# 3. Run agent with context
cd multi-agent-ba
npm run cli -- agent run senior-ba \
  --input "Your analysis task" \
  --context my-product
```

Done! 🎉
