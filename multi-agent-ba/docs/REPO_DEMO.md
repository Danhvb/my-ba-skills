# Repository Context Feature - Quick Demo

## Setup (30 seconds)

```bash
# 1. Create repos folder and link your existing repos
mkdir -p repos
cd repos

# Link your existing repositories
ln -s /path/to/your/project1 project1
ln -s /path/to/your/project2 project2

# Or just use any local git repo you have
ln -s ~/Development/my-app my-app
```

## Usage

```bash
cd multi-agent-ba

# Run agent WITH repository context
npm run cli -- agent run senior-ba \
  --input "Analyze requirements for adding a wishlist feature" \
  --repo my-app \
  --domain ecommerce
```

## What Happens

```
🤖 Running senior-ba agent...
Loaded 31 skills
Loading repository context: my-app...
✓ Repository context loaded
  Tech Stack: Node.js, TypeScript, Next.js, React, Prisma

Executing task...
✓ Success!

[Agent generates requirements considering your actual tech stack]
```

## Example Output

The agent will analyze your request with full context:

```markdown
# Wishlist Feature Requirements

## Technical Context
Based on the repository analysis:
- Platform: Next.js 14 with App Router
- Database: PostgreSQL with Prisma ORM
- Authentication: NextAuth.js
- State Management: React Context

## Requirements

### Functional Requirements
1. User can add products to wishlist
2. User can view all wishlist items
3. User can remove items from wishlist
4. Wishlist persists across sessions

### Technical Requirements
1. Create Prisma schema for Wishlist model
2. Implement API routes in /app/api/wishlist/
3. Create wishlist React components
4. Add wishlist state to existing context
5. Integrate with existing authentication

### Database Schema (Prisma)
```prisma
model Wishlist {
  id        String   @id @default(cuid())
  userId    String
  productId String
  createdAt DateTime @default(now())
  
  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])
  
  @@unique([userId, productId])
}
```

[... detailed requirements matching your tech stack ...]
```

## Benefits

✅ **Context-Aware**: Agent knows your Next.js version, database, etc.  
✅ **Accurate Recommendations**: Suggests patterns that match your code  
✅ **Ready to Implement**: Requirements align with your architecture  
✅ **No Manual Context**: Automatically reads from your codebase

## Compare: Without vs With Repo Context

### Without `--repo`
```bash
npm run cli -- agent run senior-ba \
  --input "Add wishlist feature"
```
→ Generic requirements, may not match your tech stack

### With `--repo`
```bash
npm run cli -- agent run senior-ba \
  --input "Add wishlist feature" \
  --repo my-app
```
→ Specific requirements for YOUR Next.js + Prisma setup

## Advanced Examples

### 1. New Feature with Domain + Repo
```bash
npm run cli -- agent run senior-ba \
  --input "Design flash sale feature" \
  --repo ecommerce-platform \
  --domain ecommerce \
  --skill requirements-elicitation
```

### 2. API Design
```bash
npm run cli -- agent run senior-ba \
  --input "Design REST API for user management" \
  --repo backend-api \
  --skill api-documentation
```

### 3. Database Schema
```bash
npm run cli -- agent run senior-ba \
  --input "Design database schema for order management" \
  --repo ecommerce-db \
  --skill data-modeling
```

## What Gets Analyzed

From your repository:
- ✅ README.md
- ✅ package.json (dependencies, scripts)
- ✅ Project structure (folders, key files)
- ✅ Tech stack detection
- ✅ Configuration files

NOT included (to save tokens):
- ❌ Full source code
- ❌ node_modules
- ❌ Build artifacts

## Tips

1. **Keep repos updated**: `cd repos/my-app && git pull`
2. **Use symlinks**: No need to duplicate repos
3. **Multiple repos**: Analyze different parts separately
4. **Combine with skills**: Use `--skill` for specific analysis types

## Troubleshooting

**Error: "Repository not found"**
```bash
# Check repos folder
ls -la repos/

# Make sure symlink is correct
ls -la repos/my-app
```

**No tech stack detected**
- Make sure package.json exists
- Check if repo has standard config files

## Next: Try It!

```bash
# 1. Link a repo
cd repos
ln -s ~/path/to/your/project my-project

# 2. Run analysis
cd ../multi-agent-ba
npm run cli -- agent run senior-ba \
  --input "Your analysis task here" \
  --repo my-project
```

Done! 🎉
