# Technical Design Document: Verification Report Generator

**Task ID:** T6
**Version:** 1.0
**Date:** 2026-01-12
**Author:** Expert Software Architect (AI Agent)

---

## Executive Summary

This document presents the technical design for a Verification Report Generator system that transforms deep-verify workflow findings into formatted, human-readable reports. The system supports multiple output formats (Markdown, HTML, JSON), handles large verification sessions with 100+ findings efficiently, provides customizable templates for different audiences, and maintains full traceability from findings to report sections.

The architecture employs a pipeline-based approach with pluggable format handlers, a template engine supporting audience-specific customization, and a rendering system optimized for diff-friendly output. The design emphasizes extensibility, maintainability, and performance.

---

## Architecture Overview

### High-Level Architecture

```
+------------------+     +-------------------+     +------------------+
|  Verification    |     |  Report          |     |  Output          |
|  Findings Input  | --> |  Generation      | --> |  Formats         |
|  (JSON/Internal) |     |  Pipeline        |     |  (MD/HTML/JSON)  |
+------------------+     +-------------------+     +------------------+
                               |
                               v
                    +-------------------+
                    |  Template Engine  |
                    |  (Audience-based) |
                    +-------------------+
```

### Component Architecture

```
ReportGenerator/
|-- core/
|   |-- pipeline.ts           # Main rendering pipeline
|   |-- finding-processor.ts   # Finding normalization/grouping
|   |-- traceability.ts       # Finding-to-report mapping
|
|-- templates/
|   |-- base/                  # Base template definitions
|   |-- executive/             # Executive summary templates
|   |-- technical/             # Technical detail templates
|   |-- compliance/            # Audit/compliance templates
|   |-- custom/                # User-defined templates
|
|-- formatters/
|   |-- markdown.ts            # Markdown output handler
|   |-- html.ts                # HTML output handler
|   |-- json.ts                # JSON output handler
|   |-- base-formatter.ts      # Abstract formatter interface
|
|-- visualizations/
|   |-- severity-chart.ts      # Severity distribution
|   |-- category-breakdown.ts  # Category analysis
|   |-- timeline.ts            # Finding timeline
|
|-- utils/
|   |-- diff-optimizer.ts      # Diff-friendly output
|   |-- chunking.ts            # Large session handling
|   |-- evidence-formatter.ts  # Quote formatting
```

---

## Detailed Design

### Requirement 1: Transform Verification Findings into Readable Reports

**Design Approach:**

The system implements a multi-stage transformation pipeline:

```typescript
interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  evidence: Evidence[];
  methods_used: string[];
  location: ArtifactLocation;
  timestamp: Date;
  confidence: number;
}

interface Report {
  metadata: ReportMetadata;
  executiveSummary: ExecutiveSummary;
  detailedFindings: FindingSection[];
  appendices: Appendix[];
  traceabilityMap: TraceabilityEntry[];
}
```

**Pipeline Stages:**

1. **Ingestion Stage**: Parse raw findings from verification session
2. **Normalization Stage**: Standardize finding format and fill defaults
3. **Grouping Stage**: Organize findings by severity, category, or custom criteria
4. **Enrichment Stage**: Add statistics, cross-references, and context
5. **Templating Stage**: Apply audience-specific templates
6. **Rendering Stage**: Output to specified format

```typescript
class ReportPipeline {
  private stages: PipelineStage[] = [];

  addStage(stage: PipelineStage): this {
    this.stages.push(stage);
    return this;
  }

  async execute(input: FindingSet): Promise<Report> {
    let context = new PipelineContext(input);
    for (const stage of this.stages) {
      context = await stage.process(context);
    }
    return context.getReport();
  }
}
```

---

### Requirement 2: Support Multiple Formats (Markdown, HTML, JSON)

**Design Approach:**

Implement a Formatter abstraction with format-specific handlers:

```typescript
interface ReportFormatter {
  format: 'markdown' | 'html' | 'json';
  render(report: Report, options: FormatterOptions): string;
  renderIncremental(section: ReportSection): string;
  getFileExtension(): string;
}

class MarkdownFormatter implements ReportFormatter {
  format = 'markdown' as const;

  render(report: Report, options: FormatterOptions): string {
    const sections = [
      this.renderHeader(report.metadata),
      this.renderExecutiveSummary(report.executiveSummary),
      this.renderFindings(report.detailedFindings),
      this.renderAppendices(report.appendices),
    ];
    return sections.join('\n\n---\n\n');
  }

  private renderFindings(findings: FindingSection[]): string {
    return findings.map(f => this.renderFindingSection(f)).join('\n\n');
  }

  private renderFindingSection(section: FindingSection): string {
    return `## ${section.title}

**Severity:** ${section.severity}
**Category:** ${section.category}

${section.description}

### Evidence

${section.evidence.map(e => `> ${e.quote}\n> *Source: ${e.source}*`).join('\n\n')}
`;
  }
}

class HtmlFormatter implements ReportFormatter {
  format = 'html' as const;
  private templateEngine: TemplateEngine;

  render(report: Report, options: FormatterOptions): string {
    return this.templateEngine.render('report.html', {
      report,
      styles: options.includeStyles ? this.getStyles() : '',
      scripts: options.includeInteractive ? this.getScripts() : '',
    });
  }
}

class JsonFormatter implements ReportFormatter {
  format = 'json' as const;

  render(report: Report, options: FormatterOptions): string {
    return JSON.stringify(report, null, options.prettyPrint ? 2 : 0);
  }
}
```

**Format Factory:**

```typescript
class FormatterFactory {
  private formatters: Map<string, ReportFormatter> = new Map();

  register(formatter: ReportFormatter): void {
    this.formatters.set(formatter.format, formatter);
  }

  get(format: string): ReportFormatter {
    const formatter = this.formatters.get(format);
    if (!formatter) {
      throw new Error(`Unknown format: ${format}`);
    }
    return formatter;
  }
}
```

---

### Requirement 3: Include Executive Summary, Detailed Findings, Evidence Quotes

**Design Approach:**

**Executive Summary Generator:**

```typescript
interface ExecutiveSummary {
  overview: string;
  keyMetrics: SummaryMetrics;
  criticalFindings: FindingSummary[];
  recommendations: Recommendation[];
  riskAssessment: RiskLevel;
}

class ExecutiveSummaryGenerator {
  generate(findings: Finding[]): ExecutiveSummary {
    return {
      overview: this.generateOverview(findings),
      keyMetrics: this.calculateMetrics(findings),
      criticalFindings: this.extractCritical(findings),
      recommendations: this.generateRecommendations(findings),
      riskAssessment: this.assessOverallRisk(findings),
    };
  }

  private calculateMetrics(findings: Finding[]): SummaryMetrics {
    const bySeverity = this.groupBy(findings, 'severity');
    return {
      totalFindings: findings.length,
      critical: bySeverity.critical?.length || 0,
      high: bySeverity.high?.length || 0,
      medium: bySeverity.medium?.length || 0,
      low: bySeverity.low?.length || 0,
      info: bySeverity.info?.length || 0,
      categoriesAffected: new Set(findings.map(f => f.category)).size,
      averageConfidence: this.average(findings.map(f => f.confidence)),
    };
  }
}
```

**Evidence Quote Formatter:**

```typescript
interface Evidence {
  quote: string;
  source: string;
  lineNumber?: number;
  context?: string;
  highlight?: TextRange[];
}

class EvidenceFormatter {
  formatQuote(evidence: Evidence, format: string): string {
    switch (format) {
      case 'markdown':
        return this.formatMarkdownQuote(evidence);
      case 'html':
        return this.formatHtmlQuote(evidence);
      case 'json':
        return evidence; // Return as-is for JSON
    }
  }

  private formatMarkdownQuote(evidence: Evidence): string {
    const lines = evidence.quote.split('\n');
    const quoted = lines.map(l => `> ${l}`).join('\n');
    const source = evidence.lineNumber
      ? `${evidence.source}:${evidence.lineNumber}`
      : evidence.source;
    return `${quoted}\n> \n> *Source: ${source}*`;
  }

  private formatHtmlQuote(evidence: Evidence): string {
    const highlighted = this.applyHighlights(evidence.quote, evidence.highlight);
    return `<blockquote class="evidence">
  <p>${this.escapeHtml(highlighted)}</p>
  <cite>${this.escapeHtml(evidence.source)}</cite>
</blockquote>`;
  }
}
```

---

### Requirement 4: Reports Should Be Diff-Friendly

**Design Approach:**

Implement deterministic output with stable ordering:

```typescript
class DiffOptimizer {
  // Ensure consistent ordering of findings
  stabilizeOrder(findings: Finding[]): Finding[] {
    return findings.sort((a, b) => {
      // Primary: by ID for stability
      if (a.id !== b.id) return a.id.localeCompare(b.id);
      // Secondary: by severity (for meaningful grouping)
      const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
      return severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity);
    });
  }

  // Avoid timestamps in body, use metadata section
  removeVolatileContent(report: Report): Report {
    return {
      ...report,
      metadata: {
        ...report.metadata,
        generatedAt: null, // Move to separate line for easy diff exclusion
      }
    };
  }

  // Use semantic line breaks (one sentence per line)
  formatForDiff(text: string): string {
    return text
      .replace(/\. /g, '.\n')
      .replace(/\n\n+/g, '\n\n');
  }

  // Stable hash for finding identification
  generateStableId(finding: Finding): string {
    const content = `${finding.category}:${finding.title}:${finding.location.path}`;
    return this.hash(content);
  }
}
```

**Output Guidelines for Diff-Friendliness:**

1. One finding per section with clear delimiters
2. Alphabetically sorted categories within sections
3. Stable evidence ordering (by source location)
4. Metadata separated from content
5. Semantic line breaks in prose sections

---

### Requirement 5: Handle Large Verification Sessions (100+ Findings)

**Design Approach:**

**Chunked Processing:**

```typescript
class LargeSessionHandler {
  private readonly CHUNK_SIZE = 50;
  private readonly MAX_MEMORY_MB = 100;

  async processLargeSession(findings: Finding[]): Promise<Report> {
    if (findings.length <= this.CHUNK_SIZE) {
      return this.processDirectly(findings);
    }

    // Process in chunks to manage memory
    const chunks = this.chunkArray(findings, this.CHUNK_SIZE);
    const partialReports: PartialReport[] = [];

    for (const chunk of chunks) {
      const partial = await this.processChunk(chunk);
      partialReports.push(partial);

      // Allow GC between chunks
      await this.yieldToEventLoop();
    }

    return this.mergePartialReports(partialReports);
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
```

**Pagination Support for HTML:**

```typescript
interface PaginationOptions {
  findingsPerPage: number;
  enableNavigation: boolean;
  generateTOC: boolean;
}

class HtmlPaginatedReport {
  generate(findings: Finding[], options: PaginationOptions): HtmlReport {
    const pages = this.paginate(findings, options.findingsPerPage);

    return {
      index: this.generateIndex(pages),
      pages: pages.map((page, i) => this.renderPage(page, i, pages.length)),
      toc: options.generateTOC ? this.generateTOC(findings) : null,
      navigation: options.enableNavigation ? this.generateNav(pages.length) : null,
    };
  }
}
```

**Summary View for Large Reports:**

```typescript
class SummaryGenerator {
  generateCompactSummary(findings: Finding[]): CompactSummary {
    return {
      overview: this.generateOverviewParagraph(findings),
      byCategory: this.aggregateByCategory(findings),
      bySeverity: this.aggregateBySeverity(findings),
      topFindings: this.getTopFindings(findings, 10),
      fullReportLink: '#detailed-findings',
    };
  }
}
```

---

### Requirement 6: Support Custom Templates for Different Audiences

**Design Approach:**

**Template Engine:**

```typescript
interface Template {
  id: string;
  name: string;
  audience: 'executive' | 'technical' | 'compliance' | 'custom';
  sections: TemplateSection[];
  styles?: string;
  variables: TemplateVariable[];
}

interface TemplateSection {
  id: string;
  type: 'header' | 'summary' | 'findings' | 'appendix' | 'custom';
  template: string;
  condition?: string; // e.g., "findings.critical.length > 0"
}

class TemplateEngine {
  private templates: Map<string, Template> = new Map();
  private helpers: Map<string, TemplateHelper> = new Map();

  registerTemplate(template: Template): void {
    this.templates.set(template.id, template);
  }

  async render(templateId: string, context: TemplateContext): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error(`Template not found: ${templateId}`);

    const sections = template.sections
      .filter(s => this.evaluateCondition(s.condition, context))
      .map(s => this.renderSection(s, context));

    return sections.join('\n\n');
  }

  private renderSection(section: TemplateSection, context: TemplateContext): string {
    // Use Mustache-like syntax for simplicity
    return section.template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      return this.resolveValue(key.trim(), context);
    });
  }
}
```

**Pre-defined Audience Templates:**

```typescript
const ExecutiveTemplate: Template = {
  id: 'executive',
  name: 'Executive Summary Report',
  audience: 'executive',
  sections: [
    {
      id: 'header',
      type: 'header',
      template: '# Verification Report\n\n**Date:** {{metadata.date}}\n**Status:** {{status}}'
    },
    {
      id: 'summary',
      type: 'summary',
      template: `## Executive Summary

{{summary.overview}}

### Key Metrics
- **Total Findings:** {{metrics.total}}
- **Critical Issues:** {{metrics.critical}}
- **Risk Level:** {{riskAssessment}}

### Top Recommendations
{{#recommendations}}
1. {{.}}
{{/recommendations}}`
    },
    {
      id: 'critical-findings',
      type: 'findings',
      template: '## Critical Findings\n\n{{#criticalFindings}}### {{title}}\n{{description}}\n{{/criticalFindings}}',
      condition: 'findings.critical.length > 0'
    }
  ],
  variables: [
    { name: 'companyName', required: false, default: 'Organization' }
  ]
};

const TechnicalTemplate: Template = {
  id: 'technical',
  name: 'Technical Detail Report',
  audience: 'technical',
  sections: [
    // ... detailed technical sections with code snippets, evidence, etc.
  ]
};

const ComplianceTemplate: Template = {
  id: 'compliance',
  name: 'Compliance Audit Report',
  audience: 'compliance',
  sections: [
    // ... sections focused on audit trail, evidence chain, etc.
  ]
};
```

---

### Requirement 7: Preserve Traceability (Finding -> Report Section)

**Design Approach:**

```typescript
interface TraceabilityEntry {
  findingId: string;
  reportSections: SectionReference[];
  generatedAt: Date;
  transformations: Transformation[];
}

interface SectionReference {
  sectionId: string;
  sectionTitle: string;
  anchor: string; // For HTML linking
  lineRange?: { start: number; end: number }; // For text formats
}

interface Transformation {
  stage: string;
  action: string;
  timestamp: Date;
}

class TraceabilityManager {
  private entries: Map<string, TraceabilityEntry> = new Map();

  recordFindingPlacement(findingId: string, section: SectionReference): void {
    const entry = this.entries.get(findingId) || {
      findingId,
      reportSections: [],
      generatedAt: new Date(),
      transformations: []
    };
    entry.reportSections.push(section);
    this.entries.set(findingId, entry);
  }

  recordTransformation(findingId: string, stage: string, action: string): void {
    const entry = this.entries.get(findingId);
    if (entry) {
      entry.transformations.push({ stage, action, timestamp: new Date() });
    }
  }

  generateTraceabilityReport(): TraceabilityReport {
    return {
      entries: Array.from(this.entries.values()),
      summary: {
        totalFindings: this.entries.size,
        averageSectionsPerFinding: this.calculateAverage(),
      },
      crossReference: this.buildCrossReference(),
    };
  }

  // Generate anchors for two-way linking
  generateAnchor(findingId: string): string {
    return `finding-${findingId}`;
  }

  // Build reverse index: section -> findings
  private buildCrossReference(): Map<string, string[]> {
    const xref = new Map<string, string[]>();
    for (const [findingId, entry] of this.entries) {
      for (const section of entry.reportSections) {
        const findings = xref.get(section.sectionId) || [];
        findings.push(findingId);
        xref.set(section.sectionId, findings);
      }
    }
    return xref;
  }
}
```

**Embedded Traceability in Output:**

```markdown
## Finding F-001 {#finding-f001}

**Severity:** High
**Traced to:** Executive Summary (line 15), Technical Details (line 89)

...finding content...

<!-- Traceability: F-001 appears in sections: exec-summary, tech-detail-001 -->
```

---

### Requirement 8: Include Visualizations Where Helpful

**Design Approach:**

**Visualization Types:**

```typescript
interface Visualization {
  id: string;
  type: 'severity-distribution' | 'category-breakdown' | 'timeline' | 'heatmap';
  data: VisualizationData;
  render(format: string): string;
}

class SeverityDistributionChart implements Visualization {
  id = 'severity-dist';
  type = 'severity-distribution' as const;

  constructor(private findings: Finding[]) {
    this.data = this.prepareData();
  }

  render(format: string): string {
    switch (format) {
      case 'markdown':
        return this.renderAsciiChart();
      case 'html':
        return this.renderSvgChart();
      case 'json':
        return JSON.stringify(this.data);
    }
  }

  private renderAsciiChart(): string {
    const counts = this.data as SeverityCounts;
    const max = Math.max(...Object.values(counts));
    const scale = 40 / max; // 40 char width

    return `
### Severity Distribution

\`\`\`
Critical |${'#'.repeat(Math.round(counts.critical * scale))} (${counts.critical})
High     |${'#'.repeat(Math.round(counts.high * scale))} (${counts.high})
Medium   |${'#'.repeat(Math.round(counts.medium * scale))} (${counts.medium})
Low      |${'#'.repeat(Math.round(counts.low * scale))} (${counts.low})
Info     |${'#'.repeat(Math.round(counts.info * scale))} (${counts.info})
\`\`\`
`;
  }

  private renderSvgChart(): string {
    // Generate SVG bar chart
    return `<svg class="severity-chart" viewBox="0 0 400 200">
      <!-- SVG chart implementation -->
    </svg>`;
  }
}

class CategoryBreakdownChart implements Visualization {
  // Pie/donut chart showing category distribution
}

class TimelineChart implements Visualization {
  // Timeline showing when findings were discovered during session
}
```

**Visualization Manager:**

```typescript
class VisualizationManager {
  private visualizations: Visualization[] = [];

  generateAll(findings: Finding[]): void {
    this.visualizations = [
      new SeverityDistributionChart(findings),
      new CategoryBreakdownChart(findings),
      new TimelineChart(findings),
    ];
  }

  renderForSection(sectionType: string, format: string): string {
    const relevantViz = this.selectForSection(sectionType);
    return relevantViz.map(v => v.render(format)).join('\n\n');
  }

  private selectForSection(sectionType: string): Visualization[] {
    const mapping: Record<string, string[]> = {
      'executive-summary': ['severity-dist'],
      'category-overview': ['category-breakdown'],
      'detailed-findings': ['timeline'],
    };
    return this.visualizations.filter(v =>
      mapping[sectionType]?.includes(v.type)
    );
  }
}
```

---

## Implementation Plan

### Phase 1: Core Pipeline (Week 1-2)
1. Implement Finding data model and normalization
2. Build basic pipeline infrastructure
3. Create Markdown formatter (simplest first)
4. Implement executive summary generator

### Phase 2: Multi-Format Support (Week 3)
1. Implement HTML formatter with basic template
2. Implement JSON formatter
3. Add format factory and selection logic
4. Create unit tests for all formatters

### Phase 3: Template Engine (Week 4)
1. Design and implement template syntax
2. Create audience-specific templates (executive, technical, compliance)
3. Implement custom template loading
4. Add template validation

### Phase 4: Advanced Features (Week 5-6)
1. Implement traceability system
2. Build visualization generators
3. Add diff-optimization logic
4. Implement large session handling with chunking

### Phase 5: Testing and Polish (Week 7)
1. Integration testing with real verification sessions
2. Performance testing with 100+ findings
3. Documentation and examples
4. Edge case handling

---

## Assumptions Made

1. **Input Format**: Findings are provided in a structured JSON format from the deep-verify workflow, with consistent field names and types.

2. **Output Destination**: Reports are written to the filesystem; network/API delivery is out of scope for initial implementation.

3. **Template Syntax**: Using a Mustache-like syntax for templates; more complex logic would require a different engine (Handlebars, Nunjucks).

4. **Visualization Complexity**: ASCII charts for Markdown, SVG for HTML; no external charting library dependencies.

5. **Memory Constraints**: System has at least 256MB available for processing; large sessions processed in chunks.

6. **Concurrency**: Single-threaded execution; parallel report generation is out of scope.

7. **Localization**: English only for initial release; i18n support deferred.

8. **Evidence Storage**: Evidence quotes are stored with findings; external evidence lookup is not supported.

9. **Template Storage**: Templates stored as files in a designated directory; database storage is out of scope.

10. **Diff Tool Compatibility**: Standard diff tools (git diff, diff); semantic diff tools not specifically supported.

---

## Appendix: API Reference

### Main Entry Point

```typescript
class ReportGenerator {
  constructor(options: ReportGeneratorOptions);

  // Generate report from findings
  generate(
    findings: Finding[],
    format: 'markdown' | 'html' | 'json',
    templateId?: string
  ): Promise<GeneratedReport>;

  // Stream for large sessions
  generateStream(
    findings: AsyncIterable<Finding>,
    format: string
  ): AsyncIterable<ReportChunk>;

  // Template management
  loadTemplate(path: string): Promise<Template>;
  registerTemplate(template: Template): void;
}

interface GeneratedReport {
  content: string;
  format: string;
  traceability: TraceabilityReport;
  metadata: ReportMetadata;
}
```

### Configuration

```typescript
interface ReportGeneratorOptions {
  templatesDir: string;
  defaultTemplate: string;
  diffFriendly: boolean;
  includeVisualizations: boolean;
  chunkSize: number;
  maxMemoryMb: number;
}
```
