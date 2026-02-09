import type { Skill, Task, SkillContext, TaskResult, ILLMProvider } from '../types/index.js';

/**
 * Executes skills using LLM providers
 */
export class SkillExecutor {
  private llmProvider: ILLMProvider;

  constructor(llmProvider: ILLMProvider) {
    this.llmProvider = llmProvider;
  }

  /**
   * Execute a skill with the given context
   */
  async executeSkill(skill: Skill, context: SkillContext): Promise<TaskResult> {
    try {
      const prompt = this.buildPromptFromSkill(skill, context);
      const output = await this.llmProvider.generateCompletion(prompt);

      return {
        taskId: context.task.id,
        success: true,
        output,
        metadata: {
          skillUsed: skill.skillName,
          agentType: skill.agentType,
        },
      };
    } catch (error) {
      return {
        taskId: context.task.id,
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Build LLM prompt from skill and context
   */
  buildPromptFromSkill(skill: Skill, context: SkillContext): string {
    const { task, domain, similarAnalyses, stakeholders, repoContext, additionalContext } = context;

    let prompt = `You are a professional Business Analyst with expertise in ${domain || 'business analysis'}.

SKILL: ${skill.metadata.name}
DESCRIPTION: ${skill.metadata.description}

SKILL GUIDELINES AND EXAMPLES:
${skill.content}

---

TASK: ${task.description}
`;

    // Add input if provided
    if (task.input) {
      prompt += `\nINPUT:\n${task.input}\n`;
    }

    // Add context if available
    if (domain) {
      prompt += `\nDOMAIN: ${domain}`;
    }

    // Add repository context
    if (repoContext) {
      prompt += `\n\nREPOSITORY CONTEXT:\n${repoContext}`;
    }

    if (similarAnalyses && similarAnalyses.length > 0) {
      prompt += `\n\nSIMILAR PAST ANALYSES:\n${similarAnalyses.join('\n')}`;
    }

    if (stakeholders && stakeholders.length > 0) {
      prompt += `\n\nSTAKEHOLDERS: ${stakeholders.join(', ')}`;
    }

    if (additionalContext) {
      prompt += `\n\nADDITIONAL CONTEXT:\n${JSON.stringify(additionalContext, null, 2)}`;
    }

    prompt += `

---

INSTRUCTIONS:
1. Apply the skill guidelines and best practices shown above
2. Use the examples and templates from the skill as reference
3. Consider the domain-specific patterns and requirements
${repoContext ? '4. Take into account the repository context and tech stack\n5. Reference similar past analyses if provided\n6. Produce professional, comprehensive output' : '4. Reference similar past analyses if provided\n5. Produce professional, comprehensive output'}

Please provide your analysis following the skill guidelines:`;

    return prompt;
  }

  /**
   * Apply skill templates to data
   */
  applySkillTemplates(skill: Skill, data: Record<string, any>): string {
    // Simple template replacement
    let result = skill.content;

    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return result;
  }
}
