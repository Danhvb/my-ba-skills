import dotenv from 'dotenv';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { LLMProviderFactory } from './llm/index.js';
import { SeniorBAAgent } from './agents/index.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SKILLS_PATH = process.env.SKILLS_PATH || path.join(PROJECT_ROOT, '.agent/skills');

async function main() {
  try {
    console.log(chalk.bold.blue('\n🚀 Multi-Agent BA System\n'));

    // Initialize LLM provider
    console.log(chalk.yellow('Initializing LLM provider...'));
    const llmProvider = LLMProviderFactory.createFromEnv();
    console.log(chalk.green('✓ LLM provider initialized\n'));

    // Create and load Senior BA agent
    console.log(chalk.yellow('Loading Senior BA Agent...'));
    const baAgent = new SeniorBAAgent(llmProvider, SKILLS_PATH);
    await baAgent.loadSkills();
    console.log(chalk.green(`✓ Loaded ${baAgent.getSkillCount()} skills\n`));

    // List skills
    console.log(chalk.bold('Available Skills:'));
    const skills = baAgent.listSkills();
    for (const skill of skills.slice(0, 5)) {
      console.log(chalk.cyan(`  • ${skill.metadata.name}`));
      console.log(chalk.gray(`    ${skill.metadata.description}`));
    }
    if (skills.length > 5) {
      console.log(chalk.gray(`  ... and ${skills.length - 5} more\n`));
    }

    console.log(chalk.bold.green('\n✓ System ready!\n'));
    console.log(chalk.gray('Use the CLI to interact with agents:'));
    console.log(chalk.gray('  npm run cli -- skills list'));
    console.log(chalk.gray('  npm run cli -- agent run senior-ba -i "Your task"\n'));
  } catch (error) {
    console.error(chalk.red('\n✗ Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
