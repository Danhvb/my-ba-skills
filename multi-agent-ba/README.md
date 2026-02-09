# Multi-Agent BA System

A multi-agent orchestration system for Business Analysis workflows, leveraging existing skills and enabling knowledge learning.

## Features

- 🤖 **5 Specialized Agents**: Senior BA, Domain Knowledge, Product Owner, QA Lead, Solution Architect
- 🎯 **32 Professional Skills**: Automatically loaded from existing SKILL.md files
- 🔄 **Multi-Agent Workflows**: Orchestrate multiple agents for comprehensive analysis
- 📚 **Knowledge Learning**: Learn from past analyses and improve over time
- 🛠️ **CLI Interface**: Easy-to-use command-line interface
- 🔌 **LLM Integration**: Support for Gemini and Claude APIs

## Quick Start

### 1. Installation

```bash
cd multi-agent-ba
npm install
```

### 2. Configuration

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY or ANTHROPIC_API_KEY
```

### 3. Run

```bash
# Development mode
npm run dev

# Build and run
npm run build
npm start

# Use CLI
npm run cli -- --help
```

## Usage

### List Available Skills

```bash
npm run cli skills list
npm run cli skills list --agent senior-ba
```

### Run Single Agent

```bash
npm run cli agent run senior-ba \
  --skill requirements-elicitation \
  --input "User wants to add wishlist feature"
```

### Execute Workflow

```bash
npm run cli workflow run full-ba-analysis \
  --feature "Flash Sale" \
  --domain ecommerce
```

### Interactive Mode

```bash
npm run cli interactive
```

## Project Structure

```
multi-agent-ba/
├── src/
│   ├── agents/          # Agent implementations
│   ├── skills/          # Skill loading and execution
│   ├── orchestrator/    # Task routing and workflows
│   ├── knowledge/       # Knowledge base integration
│   ├── llm/            # LLM provider integration
│   ├── cli/            # CLI interface
│   └── types/          # TypeScript types
├── .agent/             # Existing skills (external)
├── business-analysis/  # Knowledge storage (external)
└── tests/             # Test files
```

## Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## Architecture

The system is built around an orchestration layer that:
1. Loads existing skills from `.agent/skills/` directory
2. Routes tasks to appropriate agents
3. Executes multi-agent workflows
4. Learns from past work in `business-analysis/` folder

## License

MIT
