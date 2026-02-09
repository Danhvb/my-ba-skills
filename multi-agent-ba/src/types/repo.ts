/**
 * Repository context information
 */
export interface RepoContext {
  name: string;
  path: string;
  readme?: string;
  structure: FileNode[];
  packageInfo?: PackageInfo;
  techStack?: string[];
  recentFiles?: string[];
}

/**
 * File tree node
 */
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

/**
 * Package information
 */
export interface PackageInfo {
  name?: string;
  version?: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
}

/**
 * Repository provider interface
 */
export interface IRepoProvider {
  getContext(repoPath: string): Promise<RepoContext>;
  listRepositories(): Promise<string[]>;
}
