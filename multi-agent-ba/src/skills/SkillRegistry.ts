import type { Skill } from '../types/index.js';

/**
 * Registry for indexing and searching skills
 */
export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();
  private skillsByAgent: Map<string, Skill[]> = new Map();

  /**
   * Register a skill in the registry
   */
  registerSkill(skill: Skill): void {
    const key = `${skill.agentType}:${skill.skillName}`;
    this.skills.set(key, skill);

    // Index by agent type
    if (!this.skillsByAgent.has(skill.agentType)) {
      this.skillsByAgent.set(skill.agentType, []);
    }
    this.skillsByAgent.get(skill.agentType)!.push(skill);
  }

  /**
   * Register multiple skills
   */
  registerSkills(skills: Skill[]): void {
    for (const skill of skills) {
      this.registerSkill(skill);
    }
  }

  /**
   * Get a skill by agent type and skill name
   */
  getSkill(agentType: string, skillName: string): Skill | undefined {
    const key = `${agentType}:${skillName}`;
    return this.skills.get(key);
  }

  /**
   * Get all skills for an agent type
   */
  getSkillsByAgent(agentType: string): Skill[] {
    return this.skillsByAgent.get(agentType) || [];
  }

  /**
   * Search skills by query (searches in name and description)
   */
  searchSkills(query: string): Skill[] {
    const lowerQuery = query.toLowerCase();
    const results: Skill[] = [];

    for (const skill of this.skills.values()) {
      const nameMatch = skill.metadata.name.toLowerCase().includes(lowerQuery);
      const descMatch = skill.metadata.description.toLowerCase().includes(lowerQuery);
      
      if (nameMatch || descMatch) {
        results.push(skill);
      }
    }

    return results;
  }

  /**
   * Get all skills
   */
  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get skill count
   */
  getSkillCount(): number {
    return this.skills.size;
  }

  /**
   * Get agent types
   */
  getAgentTypes(): string[] {
    return Array.from(this.skillsByAgent.keys());
  }

  /**
   * Clear the registry
   */
  clear(): void {
    this.skills.clear();
    this.skillsByAgent.clear();
  }
}
