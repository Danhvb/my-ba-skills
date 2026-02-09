import { BaseAgent } from './BaseAgent.js';
import { SkillLoader } from '../skills/index.js';
import type { ILLMProvider } from '../types/index.js';

/**
 * Senior BA Agent with 31 professional skills
 */
export class SeniorBAAgent extends BaseAgent {
  private skillLoader: SkillLoader;

  constructor(llmProvider: ILLMProvider, skillsBasePath: string) {
    super('Senior BA', 'senior-ba', llmProvider);
    this.skillLoader = new SkillLoader(skillsBasePath);
  }

  async loadSkills(): Promise<void> {
    this.skills = await this.skillLoader.loadSkillsForAgent('senior-ba');
    console.log(`✓ Senior BA Agent loaded ${this.skills.length} skills`);
  }
}

/**
 * Domain Knowledge Agent with 6 domain skills
 */
export class DomainKnowledgeAgent extends BaseAgent {
  private skillLoader: SkillLoader;

  constructor(llmProvider: ILLMProvider, skillsBasePath: string) {
    super('Domain Knowledge', 'domain-knowledge', llmProvider);
    this.skillLoader = new SkillLoader(skillsBasePath);
  }

  async loadSkills(): Promise<void> {
    this.skills = await this.skillLoader.loadSkillsForAgent('domain-knowledge');
    console.log(`✓ Domain Knowledge Agent loaded ${this.skills.length} skills`);
  }
}

/**
 * Product Owner Agent
 */
export class ProductOwnerAgent extends BaseAgent {
  private skillLoader: SkillLoader;

  constructor(llmProvider: ILLMProvider, skillsBasePath: string) {
    super('Product Owner', 'product-owner', llmProvider);
    this.skillLoader = new SkillLoader(skillsBasePath);
  }

  async loadSkills(): Promise<void> {
    this.skills = await this.skillLoader.loadSkillsForAgent('product-owner');
    console.log(`✓ Product Owner Agent loaded ${this.skills.length} skills`);
  }
}

/**
 * QA Lead Agent
 */
export class QALeadAgent extends BaseAgent {
  private skillLoader: SkillLoader;

  constructor(llmProvider: ILLMProvider, skillsBasePath: string) {
    super('QA Lead', 'qa-lead', llmProvider);
    this.skillLoader = new SkillLoader(skillsBasePath);
  }

  async loadSkills(): Promise<void> {
    this.skills = await this.skillLoader.loadSkillsForAgent('qa-lead');
    console.log(`✓ QA Lead Agent loaded ${this.skills.length} skills`);
  }
}

/**
 * Solution Architect Agent
 */
export class SolutionArchitectAgent extends BaseAgent {
  private skillLoader: SkillLoader;

  constructor(llmProvider: ILLMProvider, skillsBasePath: string) {
    super('Solution Architect', 'solution-architect', llmProvider);
    this.skillLoader = new SkillLoader(skillsBasePath);
  }

  async loadSkills(): Promise<void> {
    this.skills = await this.skillLoader.loadSkillsForAgent('solution-architect');
    console.log(`✓ Solution Architect Agent loaded ${this.skills.length} skills`);
  }
}
