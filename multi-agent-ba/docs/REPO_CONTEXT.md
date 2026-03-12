# Using Local Repository Context

## Quick Setup

### 1. Organize Your Repos

```bash
# Create repos folder (if not exists)
mkdir -p repos

# Link or clone your repositories
cd repos

# Option A: Symlink existing repos
ln -s /path/to/your/existing/repo1 repo1
ln -s /path/to/your/existing/repo2 repo2

# Option B: Clone repos
git clone https://github.com/your-org/repo1
git clone https://github.com/your-org/repo2
```

### 2. Use with Agents

```bash
cd multi-agent-ba

# Run agent with repository context
npm run cli -- agent run senior-ba \
  --input "Analyze shopping cart feature requirements" \
  --repo repo1 \
  --domain ecommerce
```

## What Gets Included

When you use `--repo`, the agent automatically gets:

✅ **README.md** - Project overview and documentation  
✅ **Tech Stack** - Auto-detected from package.json, Dockerfile, etc.  
✅ **Project Structure** - File tree (up to 3 levels deep)  
✅ **Package Info** - Dependencies, scripts, version  
✅ **Important Files** - package.json, tsconfig.json, docker-compose.yml

## Example

```bash
$ npm run cli -- agent run senior-ba \
  --input "Design user authentication feature" \
  --repo my-ecommerce-app \
  --domain ecommerce

🤖 Running senior-ba agent...
Loaded 31 skills
Loading repository context: my-ecommerce-app...
✓ Repository context loaded
  Tech Stack: Node.js, TypeScript, Next.js, React, Prisma

Executing task...
✓ Success!

# Agent generates requirements considering:
# - Existing tech stack (Next.js, Prisma)
# - Current project structure
# - Dependencies already in use
```

## Repository Context Format

The agent receives context like this:

```markdown
# Repository: my-ecommerce-app

## Tech Stack
- Node.js
- TypeScript
- Next.js
- React
- Prisma
- Docker

## Package Information
- Name: my-ecommerce-app
- Version: 1.0.0
- Description: E-commerce platform

## Project Structure
- 📁 src
  - 📁 app
    - 📄 page.tsx
    - 📄 layout.tsx
  - 📁 components
  - 📁 lib
- 📁 prisma
  - 📄 schema.prisma
- 📄 package.json
- 📄 tsconfig.json

## README Excerpt
[First 1000 characters of README]
```

## Tips

### 1. Keep Repos Updated
```bash
cd repos/my-app
git pull origin master
```

### 2. Multiple Repos
```bash
# Analyze feature considering multiple codebases
npm run cli -- agent run senior-ba \
  --input "Design API integration between frontend and backend" \
  --repo frontend-app

# Then analyze backend
npm run cli -- agent run senior-ba \
  --input "Implement API endpoints for frontend integration" \
  --repo backend-api
```

### 3. Combine with Domain
```bash
npm run cli -- agent run senior-ba \
  --input "Add payment processing" \
  --repo my-app \
  --domain ecommerce \
  --skill requirements-elicitation
```

## Benefits

✅ **Context-Aware Analysis**: Agent understands your tech stack  
✅ **Consistent Recommendations**: Suggestions match your architecture  
✅ **Better Requirements**: Considers existing patterns and dependencies  
✅ **Faster Onboarding**: New team members get context automatically  
✅ **No Manual Updates**: Auto-reads from actual codebase

## Folder Structure

```
md/
├── .agent/skills/           # Your 32 skills
├── business-analysis/       # Analysis outputs
├── repos/                   # Your repositories (new!)
│   ├── project1/
│   ├── project2/
│   └── project3/
└── multi-agent-ba/          # Agent system
```

## Advanced: Custom Repos Path

```bash
# In .env
REPOS_PATH=/Users/you/Development/projects

# Now agent will look for repos there
npm run cli -- agent run senior-ba \
  --input "..." \
  --repo my-project
```

## What's NOT Included

To keep context focused and token-efficient:

❌ Full source code (only structure)  
❌ node_modules  
❌ .git history  
❌ Build artifacts (dist, build)  
❌ Hidden files (except .env.example)

## Next Steps

After using repo context, you can:
1. Generate requirements that match your tech stack
2. Create BRDs with accurate technical constraints
3. Design features that integrate with existing code
4. Get domain-specific advice for your platform