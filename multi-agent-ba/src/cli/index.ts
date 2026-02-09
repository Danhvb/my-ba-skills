#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  SeniorBAAgent,
  DomainKnowledgeAgent,
  ProductOwnerAgent,
  QALeadAgent,
  SolutionArchitectAgent,
} from '../agents/index.js';
import { LLMProviderFactory } from '../llm/index.js';
import { SkillRegistry } from '../skills/index.js';
import { LocalRepoProvider } from '../context/index.js';
import type { IAgent, AgentType } from '../types/index.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default paths (relative to project root)
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SKILLS_PATH = process.env.SKILLS_PATH || path.join(PROJECT_ROOT, '.agent/skills');
const BUSINESS_ANALYSIS_PATH = process.env.BUSINESS_ANALYSIS_PATH || path.join(PROJECT_ROOT, '../business-analysis');
const REPOS_PATH = process.env.REPOS_PATH || path.join(PROJECT_ROOT, '../repos');

const program = new Command();

program
  .name('ba-agent')
  .description('Multi-agent BA system with skill orchestration')
  .version('0.1.0');

// Skills command
const skillsCmd = program
  .command('skills')
  .description('Manage and view skills');

skillsCmd
  .command('list')
  .description('List all available skills')
  .option('-a, --agent <type>', 'Filter by agent type')
  .action(async (options) => {
    try {
      const llmProvider = LLMProviderFactory.createFromEnv();
      const agents = await initializeAgents(llmProvider);
      const registry = new SkillRegistry();

      // Register all skills
      for (const agent of agents) {
        registry.registerSkills(agent.listSkills());
      }

      console.log(chalk.bold.blue('\n📚 Available Skills\n'));

      if (options.agent) {
        const skills = registry.getSkillsByAgent(options.agent);
        console.log(chalk.yellow(`Agent: ${options.agent}`));
        console.log(chalk.gray(`Skills: ${skills.length}\n`));
        
        for (const skill of skills) {
          console.log(chalk.green(`  ✓ ${skill.metadata.name}`));
          console.log(chalk.gray(`    ${skill.metadata.description}`));
          console.log();
        }
      } else {
        const agentTypes = registry.getAgentTypes();
        
        for (const agentType of agentTypes) {
          const skills = registry.getSkillsByAgent(agentType);
          console.log(chalk.yellow(`${agentType}:`), chalk.gray(`${skills.length} skills`));
          
          for (const skill of skills) {
            console.log(chalk.green(`  ✓ ${skill.metadata.name}`));
          }
          console.log();
        }
      }

      console.log(chalk.bold(`Total: ${registry.getSkillCount()} skills\n`));
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

skillsCmd
  .command('show <skillName>')
  .description('Show details of a specific skill')
  .action(async (skillName) => {
    try {
      const llmProvider = LLMProviderFactory.createFromEnv();
      const agents = await initializeAgents(llmProvider);
      const registry = new SkillRegistry();

      for (const agent of agents) {
        registry.registerSkills(agent.listSkills());
      }

      const skills = registry.searchSkills(skillName);
      
      if (skills.length === 0) {
        console.log(chalk.red(`Skill '${skillName}' not found`));
        process.exit(1);
      }

      const skill = skills[0];
      console.log(chalk.bold.blue(`\n📖 ${skill.metadata.name}\n`));
      console.log(chalk.gray(`Agent: ${skill.agentType}`));
      console.log(chalk.gray(`Description: ${skill.metadata.description}`));
      console.log(chalk.gray(`Path: ${skill.filePath}\n`));
      console.log(chalk.yellow('Content Preview:'));
      console.log(skill.content.substring(0, 500) + '...\n');
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Agent command
const agentCmd = program
  .command('agent')
  .description('Run agents');

agentCmd
  .command('run <agentType>')
  .description('Run a specific agent')
  .requiredOption('-i, --input <text>', 'Input text for the task')
  .option('-s, --skill <skillName>', 'Specific skill to use')
  .option('-d, --domain <domain>', 'Domain context')
  .option('-r, --repo <repoName>', 'Local repository name for context')
  .action(async (agentType: AgentType, options) => {
    try {
      console.log(chalk.bold.blue(`\n🤖 Running ${agentType} agent...\n`));

      const llmProvider = LLMProviderFactory.createFromEnv();
      const agent = await createAgent(agentType, llmProvider);
      await agent.loadSkills();

      console.log(chalk.gray(`Loaded ${agent.getSkillCount()} skills`));

      // Load repository context if specified
      let repoContextText: string | undefined;
      if (options.repo) {
        try {
          console.log(chalk.yellow(`Loading repository context: ${options.repo}...`));
          const repoProvider = new LocalRepoProvider(REPOS_PATH);
          const repoContext = await repoProvider.getContext(options.repo);
          repoContextText = repoProvider.formatContextAsMarkdown(repoContext);
          console.log(chalk.green(`✓ Repository context loaded`));
          console.log(chalk.gray(`  Tech Stack: ${repoContext.techStack?.join(', ') || 'Unknown'}`));
        } catch (error) {
          console.log(chalk.red(`✗ Failed to load repository: ${error instanceof Error ? error.message : error}`));
          console.log(chalk.gray(`  Make sure the repo exists in: ${REPOS_PATH}`));
        }
      }

      console.log();

      const task = {
        id: `task-${Date.now()}`,
        description: options.input,
        domain: options.domain,
        skillName: options.skill,
        context: {
          repoContext: repoContextText,
        },
      };

      console.log(chalk.yellow('Executing task...'));
      const result = await agent.executeTask(task);

      if (result.success) {
        console.log(chalk.bold.green('\n✓ Success!\n'));
        console.log(result.output);
      } else {
        console.log(chalk.bold.red('\n✗ Failed\n'));
        console.log(chalk.red(result.error));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show system status')
  .action(async () => {
    try {
      console.log(chalk.bold.blue('\n📊 System Status\n'));

      const llmProvider = LLMProviderFactory.createFromEnv();
      console.log(chalk.green('✓ LLM Provider initialized'));

      const agents = await initializeAgents(llmProvider);
      console.log(chalk.green(`✓ ${agents.length} agents loaded\n`));

      for (const agent of agents) {
        console.log(chalk.yellow(`${agent.name}:`), chalk.gray(`${agent.getSkillCount()} skills`));
      }

      console.log(chalk.gray(`\nSkills Path: ${SKILLS_PATH}`));
      console.log(chalk.gray(`Business Analysis Path: ${BUSINESS_ANALYSIS_PATH}\n`));
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Helper functions
async function initializeAgents(llmProvider: any): Promise<IAgent[]> {
  const agents = [
    new SeniorBAAgent(llmProvider, SKILLS_PATH),
    new DomainKnowledgeAgent(llmProvider, SKILLS_PATH),
    new ProductOwnerAgent(llmProvider, SKILLS_PATH),
    new QALeadAgent(llmProvider, SKILLS_PATH),
    new SolutionArchitectAgent(llmProvider, SKILLS_PATH),
  ];

  await Promise.all(agents.map(agent => agent.loadSkills()));
  return agents;
}

async function createAgent(agentType: AgentType, llmProvider: any): Promise<IAgent> {
  switch (agentType) {
    case 'senior-ba':
      return new SeniorBAAgent(llmProvider, SKILLS_PATH);
    case 'domain-knowledge':
      return new DomainKnowledgeAgent(llmProvider, SKILLS_PATH);
    case 'product-owner':
      return new ProductOwnerAgent(llmProvider, SKILLS_PATH);
    case 'qa-lead':
      return new QALeadAgent(llmProvider, SKILLS_PATH);
    case 'solution-architect':
      return new SolutionArchitectAgent(llmProvider, SKILLS_PATH);
    default:
      throw new Error(`Unknown agent type: ${agentType}`);
  }
}

program.parse();
