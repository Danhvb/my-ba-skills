import type { IAgent, AgentType, Skill, Task, TaskResult, ILLMProvider } from '../types/index.js';
import { SkillExecutor } from '../skills/index.js';

/**
 * Base agent implementation
 */
export abstract class BaseAgent implements IAgent {
  name: string;
  type: AgentType;
  skills: Skill[] = [];
  protected skillExecutor: SkillExecutor;

  constructor(name: string, type: AgentType, llmProvider: ILLMProvider) {
    this.name = name;
    this.type = type;
    this.skillExecutor = new SkillExecutor(llmProvider);
  }

  /**
   * Load skills for this agent (to be implemented by subclasses)
   */
  abstract loadSkills(): Promise<void>;

  /**
   * Execute a task using the best skill
   */
  async executeTask(task: Task): Promise<TaskResult> {
    // If specific skill requested, use it
    if (task.skillName) {
      const skill = this.skills.find(s => s.skillName === task.skillName);
      if (!skill) {
        return {
          taskId: task.id,
          success: false,
          output: '',
          error: `Skill '${task.skillName}' not found for agent '${this.name}'`,
        };
      }
      return await this.executeWithSkill(skill, task);
    }

    // Otherwise, select best skill
    const skill = await this.selectBestSkill(task);
    if (!skill) {
      return {
        taskId: task.id,
        success: false,
        output: '',
        error: `No suitable skill found for task: ${task.description}`,
      };
    }

    return await this.executeWithSkill(skill, task);
  }

  /**
   * Select the best skill for a task
   */
  async selectBestSkill(task: Task): Promise<Skill | null> {
    if (this.skills.length === 0) {
      return null;
    }

    // Simple selection: match keywords in task description with skill names/descriptions
    const taskLower = task.description.toLowerCase();
    
    // Score each skill
    const scoredSkills = this.skills.map(skill => {
      let score = 0;
      const nameLower = skill.metadata.name.toLowerCase();
      const descLower = skill.metadata.description.toLowerCase();
      
      // Check for keyword matches
      const keywords = taskLower.split(/\s+/);
      for (const keyword of keywords) {
        if (nameLower.includes(keyword)) score += 3;
        if (descLower.includes(keyword)) score += 2;
        if (skill.skillName.includes(keyword)) score += 2;
      }
      
      return { skill, score };
    });

    // Sort by score and return best
    scoredSkills.sort((a, b) => b.score - a.score);
    
    // Return best skill if it has any score, otherwise return first skill
    return scoredSkills[0].score > 0 ? scoredSkills[0].skill : this.skills[0];
  }

  /**
   * Execute task with a specific skill
   */
  protected async executeWithSkill(skill: Skill, task: Task): Promise<TaskResult> {
    const context = {
      task,
      domain: task.domain,
      repoContext: task.context?.repoContext,
      additionalContext: task.context,
    };

    return await this.skillExecutor.executeSkill(skill, context);
  }

  /**
   * Get skill count
   */
  getSkillCount(): number {
    return this.skills.length;
  }

  /**
   * List all skills
   */
  listSkills(): Skill[] {
    return [...this.skills];
  }
}
