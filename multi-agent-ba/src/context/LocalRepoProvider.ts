import fs from 'fs/promises';
import path from 'path';
import type { IRepoProvider, RepoContext, FileNode, PackageInfo } from '../types/repo.js';

/**
 * Local repository context provider
 * Reads information from local git repositories
 */
export class LocalRepoProvider implements IRepoProvider {
  private reposBasePath: string;

  constructor(reposBasePath: string) {
    this.reposBasePath = reposBasePath;
  }

  /**
   * Get context from a local repository
   */
  async getContext(repoName: string): Promise<RepoContext> {
    const repoPath = path.join(this.reposBasePath, repoName);

    // Check if repo exists
    try {
      await fs.access(repoPath);
    } catch {
      throw new Error(`Repository not found: ${repoPath}`);
    }

    const [readme, structure, packageInfo, techStack, recentFiles] = await Promise.all([
      this.readREADME(repoPath),
      this.getFileStructure(repoPath),
      this.getPackageInfo(repoPath),
      this.detectTechStack(repoPath),
      this.getRecentFiles(repoPath),
    ]);

    return {
      name: repoName,
      path: repoPath,
      readme,
      structure,
      packageInfo,
      techStack,
      recentFiles,
    };
  }

  /**
   * List all repositories in the repos directory
   */
  async listRepositories(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.reposBasePath, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
        .map(entry => entry.name);
    } catch {
      return [];
    }
  }

  /**
   * Read README file
   */
  private async readREADME(repoPath: string): Promise<string | undefined> {
    const readmeFiles = ['README.md', 'README.MD', 'readme.md', 'Readme.md'];
    
    for (const filename of readmeFiles) {
      try {
        const content = await fs.readFile(path.join(repoPath, filename), 'utf-8');
        return content;
      } catch {
        continue;
      }
    }
    
    return undefined;
  }

  /**
   * Get file structure (limited depth)
   */
  private async getFileStructure(repoPath: string, maxDepth: number = 3): Promise<FileNode[]> {
    return await this.buildFileTree(repoPath, '', 0, maxDepth);
  }

  /**
   * Build file tree recursively
   */
  private async buildFileTree(
    basePath: string,
    relativePath: string,
    currentDepth: number,
    maxDepth: number
  ): Promise<FileNode[]> {
    if (currentDepth >= maxDepth) {
      return [];
    }

    const fullPath = path.join(basePath, relativePath);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    // Ignore common directories
    const ignoreDirs = new Set([
      'node_modules', '.git', '.next', 'dist', 'build', 
      'coverage', '.vscode', '.idea', 'vendor', '__pycache__'
    ]);

    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.env.example') {
        continue;
      }

      if (entry.isDirectory() && ignoreDirs.has(entry.name)) {
        continue;
      }

      const entryPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        const children = await this.buildFileTree(basePath, entryPath, currentDepth + 1, maxDepth);
        nodes.push({
          name: entry.name,
          path: entryPath,
          type: 'directory',
          children,
        });
      } else {
        nodes.push({
          name: entry.name,
          path: entryPath,
          type: 'file',
        });
      }
    }

    return nodes;
  }

  /**
   * Get package.json information
   */
  private async getPackageInfo(repoPath: string): Promise<PackageInfo | undefined> {
    try {
      const packagePath = path.join(repoPath, 'package.json');
      const content = await fs.readFile(packagePath, 'utf-8');
      const pkg = JSON.parse(content);

      return {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        dependencies: pkg.dependencies,
        devDependencies: pkg.devDependencies,
        scripts: pkg.scripts,
      };
    } catch {
      return undefined;
    }
  }

  /**
   * Detect tech stack from files
   */
  private async detectTechStack(repoPath: string): Promise<string[]> {
    const techStack: string[] = [];
    const files = await fs.readdir(repoPath);

    // Check for common files
    const techIndicators: Record<string, string> = {
      'package.json': 'Node.js',
      'requirements.txt': 'Python',
      'Gemfile': 'Ruby',
      'composer.json': 'PHP',
      'pom.xml': 'Java',
      'go.mod': 'Go',
      'Cargo.toml': 'Rust',
      'next.config.js': 'Next.js',
      'nuxt.config.js': 'Nuxt.js',
      'vite.config.js': 'Vite',
      'tsconfig.json': 'TypeScript',
      'Dockerfile': 'Docker',
      'docker-compose.yml': 'Docker Compose',
    };

    for (const file of files) {
      if (techIndicators[file]) {
        techStack.push(techIndicators[file]);
      }
    }

    // Check package.json for frameworks
    const packageInfo = await this.getPackageInfo(repoPath);
    if (packageInfo?.dependencies) {
      const deps = Object.keys(packageInfo.dependencies);
      
      if (deps.includes('react')) techStack.push('React');
      if (deps.includes('vue')) techStack.push('Vue');
      if (deps.includes('angular')) techStack.push('Angular');
      if (deps.includes('express')) techStack.push('Express');
      if (deps.includes('nestjs')) techStack.push('NestJS');
      if (deps.includes('prisma')) techStack.push('Prisma');
      if (deps.includes('mongoose')) techStack.push('MongoDB');
    }

    return [...new Set(techStack)]; // Remove duplicates
  }

  /**
   * Get recently modified files (simplified - just list important files)
   */
  private async getRecentFiles(repoPath: string): Promise<string[]> {
    const importantFiles: string[] = [];
    const files = await fs.readdir(repoPath);

    const important = [
      'README.md', 'package.json', 'tsconfig.json', 
      '.env.example', 'docker-compose.yml', 'Dockerfile'
    ];

    for (const file of files) {
      if (important.includes(file)) {
        importantFiles.push(file);
      }
    }

    return importantFiles;
  }

  /**
   * Format context as markdown for LLM
   */
  formatContextAsMarkdown(context: RepoContext): string {
    let markdown = `# Repository: ${context.name}\n\n`;

    // Tech Stack
    if (context.techStack && context.techStack.length > 0) {
      markdown += `## Tech Stack\n${context.techStack.map(t => `- ${t}`).join('\n')}\n\n`;
    }

    // Package Info
    if (context.packageInfo) {
      markdown += `## Package Information\n`;
      if (context.packageInfo.name) markdown += `- Name: ${context.packageInfo.name}\n`;
      if (context.packageInfo.version) markdown += `- Version: ${context.packageInfo.version}\n`;
      if (context.packageInfo.description) markdown += `- Description: ${context.packageInfo.description}\n`;
      markdown += '\n';
    }

    // File Structure (simplified)
    markdown += `## Project Structure\n`;
    markdown += this.formatFileTree(context.structure, 0);
    markdown += '\n';

    // README excerpt
    if (context.readme) {
      const excerpt = context.readme.substring(0, 1000);
      markdown += `## README Excerpt\n${excerpt}${context.readme.length > 1000 ? '...' : ''}\n\n`;
    }

    return markdown;
  }

  /**
   * Format file tree as markdown
   */
  private formatFileTree(nodes: FileNode[], depth: number): string {
    let output = '';
    const indent = '  '.repeat(depth);

    for (const node of nodes) {
      const icon = node.type === 'directory' ? '📁' : '📄';
      output += `${indent}- ${icon} ${node.name}\n`;

      if (node.children && node.children.length > 0 && depth < 2) {
        output += this.formatFileTree(node.children, depth + 1);
      }
    }

    return output;
  }
}
