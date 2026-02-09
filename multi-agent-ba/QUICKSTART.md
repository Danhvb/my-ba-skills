# Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies

```bash
cd multi-agent-ba
npm install
```

### 2. Configure API Keys

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```bash
# For Gemini (recommended)
GEMINI_API_KEY=your_gemini_api_key_here
DEFAULT_LLM_PROVIDER=gemini

# OR for Claude
ANTHROPIC_API_KEY=your_claude_api_key_here
DEFAULT_LLM_PROVIDER=claude
```

**Get API Keys:**
- Gemini: https://makersuite.google.com/app/apikey
- Claude: https://console.anthropic.com/

### 3. Test the System

```bash
# Check system status
npm run cli -- status

# List all skills
npm run cli -- skills list

# List skills for specific agent
npm run cli -- skills list --agent senior-ba
```

## Usage Examples

### Example 1: Analyze Requirements

```bash
npm run cli -- agent run senior-ba \
  --input "Analyze requirements for a shopping cart feature in an e-commerce app" \
  --domain ecommerce
```

### Example 2: Create BRD

```bash
npm run cli -- agent run senior-ba \
  --skill brd-creation \
  --input "Flash sale feature for Shopee: Users can purchase limited-quantity products at discounted prices during specific time windows" \
  --domain ecommerce
```

### Example 3: Domain Knowledge

```bash
npm run cli -- agent run domain-knowledge \
  --input "What are the key requirements for an e-commerce checkout flow?" \
  --domain ecommerce
```

### Example 4: Test Strategy

```bash
npm run cli -- agent run qa-lead \
  --input "Create test strategy for user authentication feature with email/password and social login"
```

## Available Agents

| Agent | Type | Skills | Use For |
|-------|------|--------|---------|
| **senior-ba** | Senior BA | 31 skills | Requirements, BRD, FRS, Use Cases, Process Mapping |
| **domain-knowledge** | Domain Expert | 6 domains | E-commerce, CRM, ERP, CDP, Mobile/Web context |
| **product-owner** | Product Owner | 1 skill | Backlog management, prioritization |
| **qa-lead** | QA Lead | 1 skill | Test strategy, test planning |
| **solution-architect** | Architect | 1 skill | System design, technical architecture |

## Available Skills (Senior BA)

- **Requirements**: elicitation, prioritization, validation, modeling
- **Documentation**: BRD creation, FRS creation, API documentation
- **User Stories**: user story writing, acceptance criteria, use case documentation
- **Process**: process mapping, gap analysis, process optimization
- **Data**: data modeling, data flow diagrams, SQL analysis
- **Testing**: test case creation, UAT planning
- **Stakeholder**: stakeholder analysis, meeting facilitation, presentation creation
- **Best Practices**: BA best practices, Agile BA practices, business analysis planning

## Tips

1. **Be Specific**: The more detailed your input, the better the output
2. **Use Domain Context**: Add `--domain` to get domain-specific insights
3. **Specify Skills**: Use `--skill` to use a specific skill instead of auto-selection
4. **Check Skills**: Use `skills show <name>` to see skill details before using

## Troubleshooting

### "API key not found"
- Make sure you've created `.env` file
- Check that your API key is correct
- Verify `DEFAULT_LLM_PROVIDER` matches your API key

### "Skill not found"
- List available skills: `npm run cli -- skills list`
- Check skill name spelling
- Make sure `.agent/skills` folder exists

### "No matching version found"
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Next Steps

After testing Phase 1:
- **Phase 2**: Multi-agent workflows (agents working together)
- **Phase 3**: Knowledge base learning (learn from past analyses)
- **Phase 4**: Web dashboard (optional UI)

## Support

For issues or questions, check:
- README.md for detailed documentation
- implementation_plan.md for architecture details
