# Technical Design Document: Incremental Verification System

**Task ID:** T8
**Version:** 1.0
**Date:** 2026-01-12
**Author:** Expert Software Architect (AI Agent)

---

## Executive Summary

This document presents the technical design for an Incremental Verification System that optimizes verification performance by detecting changes since the last verification run and determining the minimum scope required to verify only what has changed. The system handles content changes, structural changes, and dependency changes; intelligently caches previous verification results; detects when full re-verification is necessary; supports force-full-verification override; integrates with git-based change detection; and correctly handles renamed/moved files.

The architecture employs a multi-layer change detection approach (git integration, content hashing, AST diffing), a dependency graph for scope calculation, and an invalidation-aware cache system. The design prioritizes accuracy of change detection, correctness of scope calculation, and efficient cache utilization.

---

## Architecture Overview

### High-Level Architecture

```
+------------------+     +--------------------+     +------------------+
| Change Detection |     | Scope Calculator   |     | Verification     |
| Layer            | --> | (Dependency Graph) | --> | Executor         |
| (Git + Hash)     |     |                    |     | (Incremental)    |
+------------------+     +--------------------+     +------------------+
        |                        |                         |
        v                        v                         v
+------------------+     +--------------------+     +------------------+
| File State       |     | Verification       |     | Result           |
| Index            |     | Cache              |     | Aggregator       |
+------------------+     +--------------------+     +------------------+
```

### Component Architecture

```
IncrementalVerification/
|-- detection/
|   |-- change-detector.ts        # Main change detection orchestrator
|   |-- git-detector.ts           # Git-based change detection
|   |-- content-hasher.ts         # Content hash comparison
|   |-- structural-differ.ts      # AST/structure diffing
|   |-- rename-tracker.ts         # File rename detection
|
|-- scope/
|   |-- scope-calculator.ts       # Calculate verification scope
|   |-- dependency-graph.ts       # Build and query dependency graph
|   |-- impact-analyzer.ts        # Analyze change impact
|   |-- full-verify-detector.ts   # Detect when full verification needed
|
|-- cache/
|   |-- verification-cache.ts     # Cache management
|   |-- cache-invalidator.ts      # Smart invalidation logic
|   |-- cache-storage.ts          # Persistence layer
|
|-- execution/
|   |-- incremental-executor.ts   # Execute incremental verification
|   |-- result-merger.ts          # Merge cached + new results
|   |-- progress-tracker.ts       # Track verification progress
|
|-- index/
|   |-- file-state-index.ts       # Track file states
|   |-- baseline-manager.ts       # Manage verification baselines
```

---

## Detailed Design

### Requirement 1: Detect What Changed Since Last Verification

**Design Approach:**

Implement a multi-strategy change detection system:

```typescript
interface ChangeDetectionResult {
  changedFiles: FileChange[];
  addedFiles: string[];
  deletedFiles: string[];
  renamedFiles: RenamedFile[];
  unchangedFiles: string[];
  detectionMethod: 'git' | 'hash' | 'timestamp' | 'hybrid';
  baselineTimestamp: Date;
}

interface FileChange {
  path: string;
  changeType: 'content' | 'structural' | 'metadata';
  previousHash: string;
  currentHash: string;
  diffSummary?: DiffSummary;
}

interface RenamedFile {
  previousPath: string;
  currentPath: string;
  similarity: number;  // 0-1, how similar the content is
}

class ChangeDetector {
  private gitDetector: GitDetector;
  private contentHasher: ContentHasher;
  private structuralDiffer: StructuralDiffer;
  private renameTracker: RenameTracker;

  async detectChanges(
    targetPaths: string[],
    baseline: VerificationBaseline
  ): Promise<ChangeDetectionResult> {
    // Strategy 1: Git-based detection (fastest, preferred)
    if (await this.gitDetector.isGitRepository()) {
      const gitChanges = await this.gitDetector.detectChanges(baseline.commitHash);
      if (gitChanges.isReliable) {
        return this.enrichWithRenameDetection(gitChanges);
      }
    }

    // Strategy 2: Content hash comparison (fallback)
    const hashChanges = await this.contentHasher.compareWithBaseline(
      targetPaths,
      baseline.fileHashes
    );

    // Strategy 3: Structural diff for fine-grained changes
    const structuralChanges = await this.structuralDiffer.analyzeChanges(
      hashChanges.changedFiles
    );

    return this.mergeDetectionResults(hashChanges, structuralChanges);
  }

  private async enrichWithRenameDetection(
    changes: ChangeDetectionResult
  ): Promise<ChangeDetectionResult> {
    // Detect renames by finding similar content between deleted and added files
    const renames = await this.renameTracker.detectRenames(
      changes.deletedFiles,
      changes.addedFiles
    );

    return {
      ...changes,
      renamedFiles: renames,
      deletedFiles: changes.deletedFiles.filter(
        d => !renames.some(r => r.previousPath === d)
      ),
      addedFiles: changes.addedFiles.filter(
        a => !renames.some(r => r.currentPath === a)
      )
    };
  }
}
```

**Git-Based Detection:**

```typescript
class GitDetector {
  async isGitRepository(): Promise<boolean> {
    try {
      await this.exec('git rev-parse --git-dir');
      return true;
    } catch {
      return false;
    }
  }

  async detectChanges(baselineCommit: string): Promise<GitChangeResult> {
    const currentCommit = await this.exec('git rev-parse HEAD');

    // Get changed files between baseline and current
    const diff = await this.exec(
      `git diff --name-status ${baselineCommit}..${currentCommit}`
    );

    const changes = this.parseDiffOutput(diff);

    return {
      changedFiles: changes.modified.map(path => ({
        path,
        changeType: 'content',
        previousHash: await this.getFileHashAtCommit(path, baselineCommit),
        currentHash: await this.getFileHashAtCommit(path, currentCommit)
      })),
      addedFiles: changes.added,
      deletedFiles: changes.deleted,
      renamedFiles: changes.renamed,
      isReliable: !changes.hasUncommittedChanges
    };
  }

  private parseDiffOutput(output: string): ParsedDiff {
    const lines = output.trim().split('\n');
    const result: ParsedDiff = {
      modified: [],
      added: [],
      deleted: [],
      renamed: [],
      hasUncommittedChanges: false
    };

    for (const line of lines) {
      const [status, ...paths] = line.split('\t');
      switch (status[0]) {
        case 'M': result.modified.push(paths[0]); break;
        case 'A': result.added.push(paths[0]); break;
        case 'D': result.deleted.push(paths[0]); break;
        case 'R':
          result.renamed.push({
            previousPath: paths[0],
            currentPath: paths[1],
            similarity: parseInt(status.slice(1)) / 100
          });
          break;
      }
    }

    return result;
  }
}
```

**Content Hash Comparison:**

```typescript
class ContentHasher {
  private algorithm = 'sha256';

  async hashFile(path: string): Promise<string> {
    const content = await fs.readFile(path, 'utf-8');
    return this.hashContent(content);
  }

  hashContent(content: string): string {
    return crypto.createHash(this.algorithm)
      .update(content)
      .digest('hex');
  }

  async compareWithBaseline(
    paths: string[],
    baselineHashes: Map<string, string>
  ): Promise<ChangeDetectionResult> {
    const changes: FileChange[] = [];
    const added: string[] = [];
    const deleted: string[] = [];
    const unchanged: string[] = [];

    // Check all target paths
    for (const path of paths) {
      const currentHash = await this.hashFile(path);
      const baselineHash = baselineHashes.get(path);

      if (!baselineHash) {
        added.push(path);
      } else if (currentHash !== baselineHash) {
        changes.push({
          path,
          changeType: 'content',
          previousHash: baselineHash,
          currentHash
        });
      } else {
        unchanged.push(path);
      }
    }

    // Find deleted files
    for (const [path] of baselineHashes) {
      if (!paths.includes(path)) {
        deleted.push(path);
      }
    }

    return {
      changedFiles: changes,
      addedFiles: added,
      deletedFiles: deleted,
      renamedFiles: [],
      unchangedFiles: unchanged,
      detectionMethod: 'hash',
      baselineTimestamp: new Date()
    };
  }
}
```

---

### Requirement 2: Determine Minimum Verification Scope for Changes

**Design Approach:**

```typescript
interface VerificationScope {
  directlyChanged: string[];      // Files that changed
  impactedByDependency: string[]; // Files affected by dependency changes
  requiresVerification: string[]; // All files needing verification
  cachedResults: string[];        // Files with valid cached results
  scopeRationale: ScopeRationale[];
}

interface ScopeRationale {
  file: string;
  reason: 'directly-changed' | 'dependency-changed' | 'structural-impact' | 'cross-reference';
  dependencyChain?: string[];
}

class ScopeCalculator {
  private dependencyGraph: DependencyGraph;

  calculateScope(
    changes: ChangeDetectionResult,
    previousResults: VerificationResultSet
  ): VerificationScope {
    const scope: VerificationScope = {
      directlyChanged: changes.changedFiles.map(c => c.path),
      impactedByDependency: [],
      requiresVerification: [],
      cachedResults: [],
      scopeRationale: []
    };

    // Direct changes always need verification
    for (const file of changes.changedFiles) {
      scope.scopeRationale.push({
        file: file.path,
        reason: 'directly-changed'
      });
    }

    // New files always need verification
    for (const file of changes.addedFiles) {
      scope.directlyChanged.push(file);
      scope.scopeRationale.push({
        file,
        reason: 'directly-changed'
      });
    }

    // Find files impacted by dependency changes
    const impacted = this.findImpactedFiles(scope.directlyChanged);
    scope.impactedByDependency = impacted.filter(
      f => !scope.directlyChanged.includes(f)
    );

    for (const file of scope.impactedByDependency) {
      scope.scopeRationale.push({
        file,
        reason: 'dependency-changed',
        dependencyChain: this.dependencyGraph.getChain(file, scope.directlyChanged)
      });
    }

    // Combine for total scope
    scope.requiresVerification = [
      ...new Set([...scope.directlyChanged, ...scope.impactedByDependency])
    ];

    // Determine cached results that can be reused
    scope.cachedResults = changes.unchangedFiles.filter(
      f => !scope.impactedByDependency.includes(f)
    );

    return scope;
  }

  private findImpactedFiles(changedFiles: string[]): string[] {
    const impacted = new Set<string>();

    for (const changed of changedFiles) {
      // Find all files that depend on this changed file
      const dependents = this.dependencyGraph.getDependents(changed);
      for (const dep of dependents) {
        impacted.add(dep);
        // Recursively find dependents (transitive dependencies)
        const transitive = this.dependencyGraph.getTransitiveDependents(dep);
        transitive.forEach(t => impacted.add(t));
      }
    }

    return Array.from(impacted);
  }
}
```

**Dependency Graph:**

```typescript
interface DependencyEdge {
  from: string;  // Dependent file
  to: string;    // Dependency file
  type: 'import' | 'reference' | 'extends' | 'includes' | 'semantic';
  strength: 'strong' | 'weak';
}

class DependencyGraph {
  private edges: Map<string, DependencyEdge[]> = new Map();
  private reverseEdges: Map<string, DependencyEdge[]> = new Map();

  addEdge(edge: DependencyEdge): void {
    // Forward edge (from depends on to)
    const forward = this.edges.get(edge.from) || [];
    forward.push(edge);
    this.edges.set(edge.from, forward);

    // Reverse edge (to is depended on by from)
    const reverse = this.reverseEdges.get(edge.to) || [];
    reverse.push(edge);
    this.reverseEdges.set(edge.to, reverse);
  }

  // Get files that depend on the given file
  getDependents(file: string): string[] {
    const reverse = this.reverseEdges.get(file) || [];
    return reverse.map(e => e.from);
  }

  // Get files that the given file depends on
  getDependencies(file: string): string[] {
    const forward = this.edges.get(file) || [];
    return forward.map(e => e.to);
  }

  // Get all transitive dependents
  getTransitiveDependents(file: string, visited = new Set<string>()): string[] {
    if (visited.has(file)) return [];
    visited.add(file);

    const direct = this.getDependents(file);
    const transitive: string[] = [];

    for (const dep of direct) {
      transitive.push(dep);
      transitive.push(...this.getTransitiveDependents(dep, visited));
    }

    return transitive;
  }

  // Get the dependency chain from target to any of the sources
  getChain(target: string, sources: string[]): string[] {
    const queue: { file: string; chain: string[] }[] = [{ file: target, chain: [target] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { file, chain } = queue.shift()!;
      if (visited.has(file)) continue;
      visited.add(file);

      if (sources.includes(file)) {
        return chain;
      }

      const deps = this.getDependencies(file);
      for (const dep of deps) {
        queue.push({ file: dep, chain: [...chain, dep] });
      }
    }

    return [];
  }
}

class DependencyGraphBuilder {
  async buildGraph(files: string[]): Promise<DependencyGraph> {
    const graph = new DependencyGraph();

    for (const file of files) {
      const deps = await this.extractDependencies(file);
      for (const dep of deps) {
        graph.addEdge({
          from: file,
          to: dep.path,
          type: dep.type,
          strength: dep.strength
        });
      }
    }

    return graph;
  }

  private async extractDependencies(file: string): Promise<ExtractedDependency[]> {
    const content = await fs.readFile(file, 'utf-8');
    const deps: ExtractedDependency[] = [];

    // Extract imports/includes based on file type
    const ext = path.extname(file);

    switch (ext) {
      case '.ts':
      case '.js':
        deps.push(...this.extractJsImports(content, file));
        break;
      case '.md':
        deps.push(...this.extractMarkdownReferences(content, file));
        break;
      case '.yaml':
      case '.yml':
        deps.push(...this.extractYamlReferences(content, file));
        break;
    }

    return deps;
  }
}
```

---

### Requirement 3: Handle Content Changes, Structural Changes, Dependency Changes

**Design Approach:**

```typescript
enum ChangeCategory {
  Content = 'content',           // Text/data changed
  Structural = 'structural',     // Structure changed (sections, hierarchy)
  Dependency = 'dependency',     // Dependencies changed
  Metadata = 'metadata'          // Only metadata changed (timestamps, etc.)
}

interface CategorizedChange {
  file: string;
  categories: ChangeCategory[];
  details: ChangeDetail[];
}

interface ChangeDetail {
  category: ChangeCategory;
  description: string;
  impact: 'high' | 'medium' | 'low';
  affectedSections?: string[];
}

class ChangeCategorizator {
  categorize(change: FileChange, previousContent: string, currentContent: string): CategorizedChange {
    const categories: ChangeCategory[] = [];
    const details: ChangeDetail[] = [];

    // Check content changes
    if (this.hasContentChange(previousContent, currentContent)) {
      categories.push(ChangeCategory.Content);
      details.push({
        category: ChangeCategory.Content,
        description: 'File content modified',
        impact: this.assessContentImpact(previousContent, currentContent)
      });
    }

    // Check structural changes
    const structuralDiff = this.compareStructure(previousContent, currentContent);
    if (structuralDiff.hasChanges) {
      categories.push(ChangeCategory.Structural);
      details.push({
        category: ChangeCategory.Structural,
        description: structuralDiff.description,
        impact: structuralDiff.impact,
        affectedSections: structuralDiff.affectedSections
      });
    }

    // Check dependency changes
    const depDiff = this.compareDependencies(previousContent, currentContent);
    if (depDiff.hasChanges) {
      categories.push(ChangeCategory.Dependency);
      details.push({
        category: ChangeCategory.Dependency,
        description: `Dependencies changed: +${depDiff.added.length}, -${depDiff.removed.length}`,
        impact: depDiff.added.length + depDiff.removed.length > 0 ? 'high' : 'low'
      });
    }

    return { file: change.path, categories, details };
  }

  private compareStructure(prev: string, curr: string): StructuralDiff {
    // For markdown: compare heading structure
    const prevHeadings = this.extractHeadings(prev);
    const currHeadings = this.extractHeadings(curr);

    const addedHeadings = currHeadings.filter(h => !prevHeadings.includes(h));
    const removedHeadings = prevHeadings.filter(h => !currHeadings.includes(h));

    return {
      hasChanges: addedHeadings.length > 0 || removedHeadings.length > 0,
      description: `Headings: +${addedHeadings.length}, -${removedHeadings.length}`,
      impact: this.assessStructuralImpact(addedHeadings, removedHeadings),
      affectedSections: [...addedHeadings, ...removedHeadings]
    };
  }

  private compareDependencies(prev: string, curr: string): DependencyDiff {
    const prevDeps = this.extractDependencyReferences(prev);
    const currDeps = this.extractDependencyReferences(curr);

    return {
      hasChanges: !this.arraysEqual(prevDeps, currDeps),
      added: currDeps.filter(d => !prevDeps.includes(d)),
      removed: prevDeps.filter(d => !currDeps.includes(d))
    };
  }
}
```

**Impact Analysis:**

```typescript
class ImpactAnalyzer {
  analyzeImpact(
    categorizedChanges: CategorizedChange[],
    dependencyGraph: DependencyGraph
  ): ImpactAnalysis {
    const analysis: ImpactAnalysis = {
      directImpact: [],
      transitiveImpact: [],
      totalFilesAffected: 0,
      recommendedScope: 'incremental',
      riskLevel: 'low'
    };

    for (const change of categorizedChanges) {
      // Direct impact
      analysis.directImpact.push({
        file: change.file,
        categories: change.categories,
        riskContribution: this.calculateRisk(change)
      });

      // Transitive impact through dependencies
      if (change.categories.includes(ChangeCategory.Dependency) ||
          change.categories.includes(ChangeCategory.Structural)) {
        const dependents = dependencyGraph.getTransitiveDependents(change.file);
        for (const dep of dependents) {
          analysis.transitiveImpact.push({
            file: dep,
            cause: change.file,
            propagationType: this.getPropagationType(change)
          });
        }
      }
    }

    analysis.totalFilesAffected = new Set([
      ...analysis.directImpact.map(i => i.file),
      ...analysis.transitiveImpact.map(i => i.file)
    ]).size;

    // Recommend full verification if impact is too broad
    analysis.recommendedScope = analysis.totalFilesAffected > 50 ? 'full' : 'incremental';
    analysis.riskLevel = this.assessOverallRisk(analysis);

    return analysis;
  }
}
```

---

### Requirement 4: Cache Previous Verification Results Intelligently

**Design Approach:**

```typescript
interface CachedVerificationResult {
  file: string;
  contentHash: string;
  structureHash: string;
  findings: Finding[];
  verificationTimestamp: Date;
  methodsUsed: string[];
  expiresAt: Date;
  invalidationReasons: InvalidationReason[];
}

interface InvalidationReason {
  reason: string;
  timestamp: Date;
  triggeredBy?: string;
}

class VerificationCache {
  private storage: CacheStorage;
  private invalidator: CacheInvalidator;
  private readonly DEFAULT_TTL_DAYS = 30;

  async get(file: string): Promise<CachedVerificationResult | null> {
    const cached = await this.storage.get(this.getCacheKey(file));

    if (!cached) return null;

    // Check if cache is still valid
    if (this.isExpired(cached)) {
      await this.invalidate(file, 'expired');
      return null;
    }

    return cached;
  }

  async set(
    file: string,
    result: VerificationResult,
    contentHash: string,
    structureHash: string
  ): Promise<void> {
    const cached: CachedVerificationResult = {
      file,
      contentHash,
      structureHash,
      findings: result.findings,
      verificationTimestamp: new Date(),
      methodsUsed: result.methodsUsed,
      expiresAt: this.calculateExpiry(),
      invalidationReasons: []
    };

    await this.storage.set(this.getCacheKey(file), cached);
  }

  async invalidate(file: string, reason: string): Promise<void> {
    const cached = await this.storage.get(this.getCacheKey(file));
    if (cached) {
      cached.invalidationReasons.push({
        reason,
        timestamp: new Date()
      });
      // Move to invalidated storage for audit
      await this.storage.moveToInvalidated(this.getCacheKey(file), cached);
    }
    await this.storage.delete(this.getCacheKey(file));
  }

  async invalidateByDependency(changedFile: string, dependents: string[]): Promise<void> {
    for (const dependent of dependents) {
      await this.invalidate(dependent, `dependency changed: ${changedFile}`);
    }
  }

  private isExpired(cached: CachedVerificationResult): boolean {
    return new Date() > cached.expiresAt;
  }

  private calculateExpiry(): Date {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + this.DEFAULT_TTL_DAYS);
    return expiry;
  }
}
```

**Smart Invalidation:**

```typescript
class CacheInvalidator {
  async smartInvalidation(
    changes: ChangeDetectionResult,
    cache: VerificationCache,
    dependencyGraph: DependencyGraph
  ): Promise<InvalidationResult> {
    const invalidated: string[] = [];
    const preserved: string[] = [];

    // Invalidate directly changed files
    for (const change of changes.changedFiles) {
      await cache.invalidate(change.path, 'content-changed');
      invalidated.push(change.path);
    }

    // Invalidate files that depend on changed files
    for (const change of changes.changedFiles) {
      const dependents = dependencyGraph.getTransitiveDependents(change.path);
      await cache.invalidateByDependency(change.path, dependents);
      invalidated.push(...dependents);
    }

    // Handle renamed files - transfer cache with updated path
    for (const rename of changes.renamedFiles) {
      await this.transferCache(rename.previousPath, rename.currentPath, cache);
      // Don't count as invalidated if content similar enough
      if (rename.similarity > 0.9) {
        preserved.push(rename.currentPath);
      }
    }

    // Handle deleted files
    for (const deleted of changes.deletedFiles) {
      await cache.invalidate(deleted, 'file-deleted');
    }

    return {
      invalidated: [...new Set(invalidated)],
      preserved,
      cacheHitRate: this.calculateHitRate(invalidated, changes.unchangedFiles)
    };
  }

  private async transferCache(
    oldPath: string,
    newPath: string,
    cache: VerificationCache
  ): Promise<void> {
    const oldCache = await cache.get(oldPath);
    if (oldCache) {
      oldCache.file = newPath;
      oldCache.invalidationReasons.push({
        reason: `renamed from ${oldPath}`,
        timestamp: new Date()
      });
      await cache.set(newPath, oldCache as any, oldCache.contentHash, oldCache.structureHash);
      await cache.invalidate(oldPath, 'file-renamed');
    }
  }
}
```

---

### Requirement 5: Detect When Full Re-Verification is Necessary

**Design Approach:**

```typescript
interface FullVerificationTrigger {
  triggered: boolean;
  reasons: TriggerReason[];
  confidence: number;
}

interface TriggerReason {
  type: string;
  description: string;
  severity: 'mandatory' | 'recommended' | 'suggested';
}

class FullVerificationDetector {
  private readonly MANDATORY_TRIGGERS = [
    'schema-change',
    'method-definition-change',
    'workflow-structure-change',
    'verification-config-change'
  ];

  private readonly THRESHOLD_TRIGGERS = {
    fileChangePercentage: 0.5,      // >50% files changed
    dependencyDepth: 5,              // Dependency chain > 5 levels
    cascadeCount: 20,                // >20 files affected by cascade
    staleCache: 30                   // Days since last full verification
  };

  detect(
    changes: ChangeDetectionResult,
    scope: VerificationScope,
    lastFullVerification: Date
  ): FullVerificationTrigger {
    const reasons: TriggerReason[] = [];

    // Check for mandatory triggers
    for (const change of changes.changedFiles) {
      const mandatoryTrigger = this.checkMandatoryTrigger(change);
      if (mandatoryTrigger) {
        reasons.push({
          type: mandatoryTrigger,
          description: `Mandatory full verification: ${mandatoryTrigger}`,
          severity: 'mandatory'
        });
      }
    }

    // Check threshold triggers
    const totalFiles = this.getTotalFileCount();
    const changePercentage = changes.changedFiles.length / totalFiles;
    if (changePercentage > this.THRESHOLD_TRIGGERS.fileChangePercentage) {
      reasons.push({
        type: 'high-change-volume',
        description: `${(changePercentage * 100).toFixed(1)}% of files changed`,
        severity: 'recommended'
      });
    }

    // Check cascade depth
    const maxDepth = this.getMaxDependencyDepth(scope);
    if (maxDepth > this.THRESHOLD_TRIGGERS.dependencyDepth) {
      reasons.push({
        type: 'deep-dependency-cascade',
        description: `Dependency cascade depth: ${maxDepth} levels`,
        severity: 'recommended'
      });
    }

    // Check cascade count
    if (scope.impactedByDependency.length > this.THRESHOLD_TRIGGERS.cascadeCount) {
      reasons.push({
        type: 'large-cascade',
        description: `${scope.impactedByDependency.length} files affected by cascade`,
        severity: 'recommended'
      });
    }

    // Check cache staleness
    const daysSinceFullVerification = this.daysBetween(lastFullVerification, new Date());
    if (daysSinceFullVerification > this.THRESHOLD_TRIGGERS.staleCache) {
      reasons.push({
        type: 'stale-cache',
        description: `${daysSinceFullVerification} days since last full verification`,
        severity: 'suggested'
      });
    }

    const hasMandatory = reasons.some(r => r.severity === 'mandatory');
    const hasRecommended = reasons.some(r => r.severity === 'recommended');

    return {
      triggered: hasMandatory || (hasRecommended && reasons.length >= 2),
      reasons,
      confidence: this.calculateConfidence(reasons)
    };
  }

  private checkMandatoryTrigger(change: FileChange): string | null {
    const path = change.path.toLowerCase();

    if (path.includes('methods.csv')) return 'method-definition-change';
    if (path.includes('workflow') && path.endsWith('.md')) return 'workflow-structure-change';
    if (path.includes('schema') && path.endsWith('.json')) return 'schema-change';
    if (path.includes('config') && path.includes('verification')) return 'verification-config-change';

    return null;
  }
}
```

---

### Requirement 6: Support Force-Full-Verification Override

**Design Approach:**

```typescript
interface VerificationOptions {
  mode: 'auto' | 'incremental' | 'full';
  force: boolean;
  skipCache: boolean;
  reasonForForce?: string;
}

class IncrementalVerificationExecutor {
  async execute(
    targetPaths: string[],
    options: VerificationOptions
  ): Promise<VerificationResult> {
    // Force full verification override
    if (options.force || options.mode === 'full') {
      console.log(`Full verification requested: ${options.reasonForForce || 'user override'}`);
      return this.executeFullVerification(targetPaths, {
        ...options,
        skipCache: true
      });
    }

    // Auto mode - determine best approach
    if (options.mode === 'auto') {
      const changes = await this.changeDetector.detectChanges(
        targetPaths,
        await this.getBaseline()
      );

      const scope = this.scopeCalculator.calculateScope(
        changes,
        await this.getPreviousResults()
      );

      const fullVerifyTrigger = this.fullVerifyDetector.detect(
        changes,
        scope,
        await this.getLastFullVerificationDate()
      );

      if (fullVerifyTrigger.triggered) {
        console.log('Full verification triggered:', fullVerifyTrigger.reasons);
        return this.executeFullVerification(targetPaths, options);
      }

      return this.executeIncrementalVerification(scope, options);
    }

    // Incremental mode
    const changes = await this.changeDetector.detectChanges(
      targetPaths,
      await this.getBaseline()
    );

    const scope = this.scopeCalculator.calculateScope(
      changes,
      await this.getPreviousResults()
    );

    return this.executeIncrementalVerification(scope, options);
  }

  private async executeFullVerification(
    paths: string[],
    options: VerificationOptions
  ): Promise<VerificationResult> {
    // Clear cache if requested
    if (options.skipCache) {
      await this.cache.clearAll();
    }

    // Run verification on all files
    const results = await this.verifier.verifyAll(paths);

    // Update cache with fresh results
    await this.updateCache(results);

    // Update baseline
    await this.updateBaseline();

    return {
      ...results,
      mode: 'full',
      filesVerified: paths.length,
      cacheHits: 0
    };
  }

  private async executeIncrementalVerification(
    scope: VerificationScope,
    options: VerificationOptions
  ): Promise<VerificationResult> {
    // Get cached results for unchanged files
    const cachedResults = options.skipCache ? [] : await this.getCachedResults(scope.cachedResults);

    // Verify only files that require verification
    const freshResults = await this.verifier.verifyAll(scope.requiresVerification);

    // Update cache with fresh results
    await this.updateCache(freshResults);

    // Merge cached and fresh results
    const merged = this.resultMerger.merge(cachedResults, freshResults);

    return {
      ...merged,
      mode: 'incremental',
      filesVerified: scope.requiresVerification.length,
      cacheHits: cachedResults.length
    };
  }
}
```

**CLI Interface:**

```typescript
// Example CLI usage
class VerificationCLI {
  async run(args: string[]): Promise<void> {
    const options = this.parseArgs(args);

    /*
     * --full          Force full verification
     * --incremental   Force incremental (even if triggers would suggest full)
     * --auto          Auto-detect best approach (default)
     * --skip-cache    Don't use cached results
     * --reason "..."  Reason for forcing full verification
     */

    const executor = new IncrementalVerificationExecutor();
    const result = await executor.execute(options.paths, {
      mode: options.full ? 'full' : options.incremental ? 'incremental' : 'auto',
      force: options.full,
      skipCache: options.skipCache,
      reasonForForce: options.reason
    });

    this.displayResults(result);
  }
}
```

---

### Requirement 7: Work with Git-Based Change Detection

**Design Approach:**

See Requirement 1 for GitDetector implementation. Additional git integration:

```typescript
class GitIntegration {
  // Get the commit hash for the last successful verification
  async getLastVerifiedCommit(): Promise<string | null> {
    const baseline = await this.baselineManager.getBaseline();
    return baseline?.commitHash || null;
  }

  // Get files changed in a specific commit range
  async getChangedFilesInRange(fromCommit: string, toCommit: string = 'HEAD'): Promise<string[]> {
    const output = await this.exec(
      `git diff --name-only ${fromCommit}..${toCommit}`
    );
    return output.trim().split('\n').filter(Boolean);
  }

  // Get blame information for a file
  async getBlameInfo(file: string, lineRange?: { start: number; end: number }): Promise<BlameInfo[]> {
    const rangeArg = lineRange ? `-L ${lineRange.start},${lineRange.end}` : '';
    const output = await this.exec(
      `git blame --porcelain ${rangeArg} ${file}`
    );
    return this.parseBlameOutput(output);
  }

  // Check if there are uncommitted changes
  async hasUncommittedChanges(): Promise<boolean> {
    const output = await this.exec('git status --porcelain');
    return output.trim().length > 0;
  }

  // Get the current branch
  async getCurrentBranch(): Promise<string> {
    return (await this.exec('git rev-parse --abbrev-ref HEAD')).trim();
  }

  // Create a verification checkpoint (tag)
  async createCheckpoint(name: string): Promise<void> {
    await this.exec(`git tag -f verification-${name}`);
  }
}

class BaselineManager {
  private readonly BASELINE_FILE = '.verification-baseline.json';

  async getBaseline(): Promise<VerificationBaseline | null> {
    try {
      const content = await fs.readFile(this.BASELINE_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  async updateBaseline(commitHash: string, fileHashes: Map<string, string>): Promise<void> {
    const baseline: VerificationBaseline = {
      commitHash,
      timestamp: new Date().toISOString(),
      fileHashes: Object.fromEntries(fileHashes)
    };
    await fs.writeFile(this.BASELINE_FILE, JSON.stringify(baseline, null, 2));
  }
}
```

---

### Requirement 8: Handle Renamed/Moved Files Correctly

**Design Approach:**

```typescript
class RenameTracker {
  private readonly SIMILARITY_THRESHOLD = 0.6;  // 60% similarity to consider a rename

  async detectRenames(
    deletedFiles: string[],
    addedFiles: string[]
  ): Promise<RenamedFile[]> {
    if (deletedFiles.length === 0 || addedFiles.length === 0) {
      return [];
    }

    const renames: RenamedFile[] = [];
    const matchedAdded = new Set<string>();

    for (const deleted of deletedFiles) {
      const deletedContent = await this.getDeletedContent(deleted);
      let bestMatch: { path: string; similarity: number } | null = null;

      for (const added of addedFiles) {
        if (matchedAdded.has(added)) continue;

        const addedContent = await fs.readFile(added, 'utf-8');
        const similarity = this.calculateSimilarity(deletedContent, addedContent);

        if (similarity >= this.SIMILARITY_THRESHOLD) {
          if (!bestMatch || similarity > bestMatch.similarity) {
            bestMatch = { path: added, similarity };
          }
        }
      }

      if (bestMatch) {
        renames.push({
          previousPath: deleted,
          currentPath: bestMatch.path,
          similarity: bestMatch.similarity
        });
        matchedAdded.add(bestMatch.path);
      }
    }

    return renames;
  }

  private calculateSimilarity(content1: string, content2: string): number {
    // Use Jaccard similarity on line-level
    const lines1 = new Set(content1.split('\n'));
    const lines2 = new Set(content2.split('\n'));

    const intersection = new Set([...lines1].filter(x => lines2.has(x)));
    const union = new Set([...lines1, ...lines2]);

    return intersection.size / union.size;
  }

  private async getDeletedContent(path: string): Promise<string> {
    // Get content from git history
    try {
      return await this.exec(`git show HEAD~1:${path}`);
    } catch {
      return '';
    }
  }

  // Handle verification results for renamed files
  transferVerificationResults(
    renames: RenamedFile[],
    previousResults: Map<string, VerificationResult>
  ): Map<string, VerificationResult> {
    const transferred = new Map(previousResults);

    for (const rename of renames) {
      const previousResult = transferred.get(rename.previousPath);
      if (previousResult) {
        // Transfer with path update and annotation
        transferred.set(rename.currentPath, {
          ...previousResult,
          file: rename.currentPath,
          annotations: [
            ...(previousResult.annotations || []),
            {
              type: 'renamed',
              from: rename.previousPath,
              similarity: rename.similarity
            }
          ]
        });
        transferred.delete(rename.previousPath);
      }
    }

    return transferred;
  }
}
```

**Handling Move vs Content Change:**

```typescript
class MoveDetector {
  detectMoveType(rename: RenamedFile): MoveType {
    const prevDir = path.dirname(rename.previousPath);
    const currDir = path.dirname(rename.currentPath);
    const prevName = path.basename(rename.previousPath);
    const currName = path.basename(rename.currentPath);

    if (prevDir !== currDir && prevName === currName) {
      return 'directory-move';
    } else if (prevDir === currDir && prevName !== currName) {
      return 'rename-in-place';
    } else if (prevDir !== currDir && prevName !== currName) {
      return 'move-and-rename';
    } else {
      return 'unknown';
    }
  }

  shouldInvalidateCache(rename: RenamedFile, moveType: MoveType): boolean {
    // Pure directory moves preserve cache validity
    if (moveType === 'directory-move' && rename.similarity > 0.99) {
      return false;
    }

    // Content changes require re-verification
    if (rename.similarity < 0.95) {
      return true;
    }

    return false;
  }
}
```

---

## Implementation Plan

### Phase 1: Change Detection (Week 1-2)
1. Implement GitDetector with diff parsing
2. Build ContentHasher with SHA-256
3. Create RenameTracker with similarity detection
4. Integrate detection strategies

### Phase 2: Dependency Management (Week 3-4)
1. Implement DependencyGraph data structure
2. Build DependencyGraphBuilder for different file types
3. Create transitive dependency resolution
4. Add dependency chain tracing

### Phase 3: Scope Calculation (Week 5)
1. Implement ScopeCalculator
2. Build ImpactAnalyzer
3. Create FullVerificationDetector
4. Add scope rationale generation

### Phase 4: Caching System (Week 6-7)
1. Implement VerificationCache
2. Build CacheInvalidator with smart invalidation
3. Create cache transfer for renames
4. Add cache persistence layer

### Phase 5: Execution Engine (Week 8)
1. Implement IncrementalVerificationExecutor
2. Build ResultMerger
3. Create CLI interface
4. Add force-full override support

### Phase 6: Testing and Integration (Week 9-10)
1. Unit tests for all components
2. Integration tests with real git repos
3. Performance testing with large repos
4. Documentation and examples

---

## Assumptions Made

1. **Git Availability**: Git is available and the target directory is a git repository for optimal performance; fallback to hash-based detection otherwise.

2. **File System Access**: Full read access to all target files; verification failures for inaccessible files are handled gracefully.

3. **Baseline Persistence**: Baseline file (.verification-baseline.json) is stored in the repository root and may be committed or gitignored.

4. **Content Encoding**: All files are UTF-8 encoded; binary files are tracked by hash only.

5. **Dependency Extraction**: Dependencies are extractable from file content (imports, references); opaque dependencies not detected.

6. **Rename Detection Accuracy**: Jaccard similarity at 60% threshold catches most renames; some edge cases may be missed.

7. **Cache Storage**: File-based cache storage is sufficient; no distributed cache required.

8. **Verification Atomicity**: Verification of individual files is atomic; partial verification results are not persisted.

9. **Git History Depth**: Git history is available for at least the last verification checkpoint; shallow clones may have limitations.

10. **Concurrent Modifications**: No concurrent modifications during verification; file locks not implemented.

---

## Appendix: Configuration Reference

### Configuration File

```yaml
# .verification.yml
incremental:
  enabled: true

  change_detection:
    primary: git           # git | hash | timestamp
    fallback: hash
    similarity_threshold: 0.6

  caching:
    enabled: true
    ttl_days: 30
    storage_path: .verification-cache/

  full_verification_triggers:
    file_change_percentage: 0.5
    dependency_depth: 5
    cascade_count: 20
    stale_cache_days: 30

  mandatory_full_triggers:
    - methods.csv
    - "**/workflow*.md"
    - "**/schema*.json"

  exclude_patterns:
    - node_modules/**
    - .git/**
    - "*.log"
```

### CLI Reference

```
verification [options] [paths...]

Options:
  --mode <mode>       Verification mode: auto|incremental|full (default: auto)
  --force             Force full verification
  --skip-cache        Don't use cached results
  --reason <text>     Reason for forcing full verification
  --baseline <commit> Override baseline commit
  --verbose           Verbose output
  --json              Output results as JSON

Examples:
  verification src/                    # Auto mode on src/
  verification --force --reason "Release" src/
  verification --mode incremental docs/
  verification --skip-cache src/core/
```
