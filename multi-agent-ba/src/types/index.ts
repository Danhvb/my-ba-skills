/**
 * Core type definitions for the multi-agent BA system
 */

/**
 * Skill metadata from YAML frontmatter
 */
export interface SkillMetadata {
  name: string;
  description: string;
}

/**
 * A skill loaded from SKILL.md file
 */
export interface Skill {
  metadata: SkillMetadata;
  content: string;
  filePath: string;
  agentType: string; // e.g., "senior-ba", "domain-knowledge"
  skillName: string; // e.g., "requirements-elicitation"
}

/**
 * Task to be executed by an agent
 */
export interface Task {
  id: string;
  description: string;
  domain?: string;
  context?: Record<string, any>;
  input?: string;
  skillName?: string; // Specific skill to use
}

/**
 * Result from task execution
 */
export interface TaskResult {
  taskId: string;
  success: boolean;
  output: string;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Agent types in the system
 */
export type AgentType = 
  | 'senior-ba'
  | 'domain-knowledge'
  | 'product-owner'
  | 'qa-lead'
  | 'solution-architect';

/**
 * Base agent interface
 */
export interface IAgent {
  name: string;
  type: AgentType;
  skills: Skill[];
  
  loadSkills(): Promise<void>;
  executeTask(task: Task): Promise<TaskResult>;
  selectBestSkill(task: Task): Promise<Skill | null>;
  getSkillCount(): number;
  listSkills(): Skill[];
}

/**
 * Workflow step definition
 */
export interface WorkflowStep {
  agent: AgentType;
  task: string;
  skills?: string[];
  input?: string;
  output: string;
}

/**
 * Workflow definition
 */
export interface Workflow {
  name: string;
  description: string;
  agents: AgentType[];
  steps: WorkflowStep[];
}

/**
 * LLM provider configuration
 */
export interface LLMConfig {
  provider: 'gemini' | 'claude';
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * LLM provider interface
 */
export interface ILLMProvider {
  generateCompletion(prompt: string, config?: Partial<LLMConfig>): Promise<string>;
}

/**
 * Context for skill execution
 */
export interface SkillContext {
  task: Task;
  domain?: string;
  similarAnalyses?: string[];
  stakeholders?: string[];
  repoContext?: string; // Formatted repository context
  additionalContext?: Record<string, any>;
}
