import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';
import type { Skill, SkillMetadata } from '../types/index.js';

/**
 * Loads and parses SKILL.md files from the .agent/skills directory
 */
export class SkillLoader {
  private skillsBasePath: string;

  constructor(skillsBasePath: string) {
    this.skillsBasePath = skillsBasePath;
  }

  /**
   * Load all skills from the skills directory
   */
  async loadAllSkills(): Promise<Skill[]> {
    const skillFiles = await this.findSkillFiles();
    const skills: Skill[] = [];

    for (const filePath of skillFiles) {
      try {
        const skill = await this.loadSkillFromFile(filePath);
        skills.push(skill);
      } catch (error) {
        console.error(`Error loading skill from ${filePath}:`, error);
      }
    }

    return skills;
  }

  /**
   * Load skills for a specific agent type
   */
  async loadSkillsForAgent(agentType: string): Promise<Skill[]> {
    const allSkills = await this.loadAllSkills();
    return allSkills.filter(skill => skill.agentType === agentType);
  }

  /**
   * Load a single skill by name
   */
  async loadSkillByName(agentType: string, skillName: string): Promise<Skill | null> {
    const skillPath = path.join(this.skillsBasePath, agentType, skillName, 'SKILL.md');
    
    try {
      await fs.access(skillPath);
      return await this.loadSkillFromFile(skillPath);
    } catch {
      return null;
    }
  }

  /**
   * Find all SKILL.md files in the skills directory
   */
  private async findSkillFiles(): Promise<string[]> {
    const pattern = path.join(this.skillsBasePath, '**/SKILL.md');
    return await glob(pattern, { absolute: true });
  }

  /**
   * Load and parse a single SKILL.md file
   */
  private async loadSkillFromFile(filePath: string): Promise<Skill> {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);

    // Extract agent type and skill name from file path
    const relativePath = path.relative(this.skillsBasePath, filePath);
    const pathParts = relativePath.split(path.sep);
    const agentType = pathParts[0];
    const skillName = pathParts[1];

    // Validate metadata
    if (!data.name || !data.description) {
      throw new Error(`Invalid skill metadata in ${filePath}: missing name or description`);
    }

    const metadata: SkillMetadata = {
      name: data.name,
      description: data.description,
    };

    return {
      metadata,
      content: markdownContent.trim(),
      filePath,
      agentType,
      skillName,
    };
  }

  /**
   * Get the base path for skills
   */
  getSkillsBasePath(): string {
    return this.skillsBasePath;
  }
}
