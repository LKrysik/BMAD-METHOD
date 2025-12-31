/**
 * Advanced Elicitation Methods Generator
 *
 * Generates primary_verify.md, primary_discover.md, and ae_by_categories/*.md
 * from methods.csv source of truth.
 *
 * @module ae-methods-generator
 */

const path = require('node:path');
const fs = require('fs-extra');
const { parse } = require('csv-parse/sync');
const crypto = require('node:crypto');

const SOURCE_PATH = 'src/core/workflows/advanced-elicitation/methods.csv';
const OUTPUT_DIR = 'src/core/workflows/advanced-elicitation';

class AEMethodsGenerator {
  /**
   * Create a new AEMethodsGenerator instance
   * @param {string} projectRoot - The root directory of the project
   */
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.methods = [];
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Main generation method
   * @returns {Promise<Object>} Generation report
   */
  async generate() {
    // 1. Load and parse CSV
    await this.loadMethods();

    // 2. Validate CSV
    this.validateMethods();

    if (this.errors.length > 0) {
      throw new Error(`CSV Validation failed:\n${this.errors.join('\n')}`);
    }

    // 3. Calculate source hash for header
    const sourceHash = await this.calculateSourceHash();

    // 4. Generate primary_verify.md
    await this.generatePrimaryVerify(sourceHash);

    // 5. Generate primary_discover.md
    await this.generatePrimaryDiscover(sourceHash);

    // 6. Generate ae_by_categories/*.md
    await this.generateCategoryFiles(sourceHash);

    // 7. Report results
    return this.buildReport();
  }

  /**
   * Load methods from CSV file
   */
  async loadMethods() {
    const csvPath = path.join(this.projectRoot, SOURCE_PATH);
    const content = await fs.readFile(csvPath, 'utf8');

    this.methods = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Add line numbers for error reporting
    for (const [index, method] of this.methods.entries()) {
      method._line = index + 2; // +2 for header and 0-indexing
    }
  }

  /**
   * Validate the loaded methods
   */
  validateMethods() {
    const nums = new Set();
    const required = ['num', 'category', 'method_name', 'description', 'output_pattern'];

    for (const method of this.methods) {
      // Check duplicate num
      if (nums.has(method.num)) {
        this.errors.push(`Duplicate num: ${method.num} at line ${method._line}`);
      }
      nums.add(method.num);

      // Check required fields
      for (const field of required) {
        if (!method[field] || method[field].trim() === '') {
          this.errors.push(`Missing ${field} at line ${method._line}`);
        }
      }

      // Validate primary_verify column
      if (method.primary_verify && !['yes', 'no', ''].includes(method.primary_verify.toLowerCase())) {
        this.errors.push(`Invalid primary_verify value at line ${method._line}: ${method.primary_verify}`);
      }

      // Validate primary_discover column
      if (method.primary_discover && !['yes', 'no', ''].includes(method.primary_discover.toLowerCase())) {
        this.errors.push(`Invalid primary_discover value at line ${method._line}: ${method.primary_discover}`);
      }
    }

    // Check primary counts
    const verifyCount = this.methods.filter((m) => m.primary_verify?.toLowerCase() === 'yes').length;
    const discoverCount = this.methods.filter((m) => m.primary_discover?.toLowerCase() === 'yes').length;

    if (verifyCount < 10 || verifyCount > 15) {
      this.warnings.push(`primary_verify count is ${verifyCount}, recommended: 10-15`);
    }
    if (discoverCount < 10 || discoverCount > 15) {
      this.warnings.push(`primary_discover count is ${discoverCount}, recommended: 10-15`);
    }
  }

  /**
   * Calculate SHA256 hash of source CSV
   * @returns {Promise<string>} First 8 characters of hash
   */
  async calculateSourceHash() {
    const csvPath = path.join(this.projectRoot, SOURCE_PATH);
    const content = await fs.readFile(csvPath);
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
  }

  /**
   * Generate the header comment for generated files
   * @param {string} sourceHash - Hash of source CSV
   * @returns {string} Header comment
   */
  generateHeader(sourceHash) {
    const timestamp = new Date().toISOString();
    return `<!-- GENERATED: ${timestamp} -->
<!-- SOURCE: methods.csv (hash: ${sourceHash}) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

`;
  }

  /**
   * Generate primary_verify.md file
   * @param {string} sourceHash - Hash of source CSV
   */
  async generatePrimaryVerify(sourceHash) {
    const verifyMethods = this.methods.filter((m) => m.primary_verify?.toLowerCase() === 'yes');

    let content = this.generateHeader(sourceHash);
    content += `# Primary Verify Methods

${verifyMethods.length} methods optimized for verification and quality checking.

Use these methods to validate generated content, find inconsistencies, identify risks, and ensure quality.

---

`;

    for (const method of verifyMethods) {
      content += `### #${method.num} ${method.method_name}
${method.description}

**Pattern:** ${method.output_pattern}

---

`;
    }

    const outputPath = path.join(this.projectRoot, OUTPUT_DIR, 'primary_verify.md');
    await fs.writeFile(outputPath, content, 'utf8');
  }

  /**
   * Generate primary_discover.md file
   * @param {string} sourceHash - Hash of source CSV
   */
  async generatePrimaryDiscover(sourceHash) {
    const discoverMethods = this.methods.filter((m) => m.primary_discover?.toLowerCase() === 'yes');

    let content = this.generateHeader(sourceHash);
    content += `# Primary Discover Methods

${discoverMethods.length} methods optimized for discovery and requirements elicitation.

Use these methods to explore requirements, uncover hidden assumptions, and deepen understanding.

---

`;

    for (const method of discoverMethods) {
      content += `### #${method.num} ${method.method_name}
${method.description}

**Pattern:** ${method.output_pattern}

---

`;
    }

    const outputPath = path.join(this.projectRoot, OUTPUT_DIR, 'primary_discover.md');
    await fs.writeFile(outputPath, content, 'utf8');
  }

  /**
   * Generate category files in ae_by_categories/
   * @param {string} sourceHash - Hash of source CSV
   * @returns {Promise<number>} Number of categories generated
   */
  async generateCategoryFiles(sourceHash) {
    // Get unique categories dynamically
    const categories = [...new Set(this.methods.map((m) => m.category))];

    const categoriesDir = path.join(this.projectRoot, OUTPUT_DIR, 'ae_by_categories');
    await fs.ensureDir(categoriesDir);

    // Clean old category files (in case categories change)
    const existingFiles = await fs.readdir(categoriesDir);
    for (const file of existingFiles) {
      if (file.endsWith('.md')) {
        await fs.remove(path.join(categoriesDir, file));
      }
    }

    for (const category of categories) {
      const categoryMethods = this.methods.filter((m) => m.category === category);

      let content = this.generateHeader(sourceHash);
      content += `# ${this.capitalize(category)} Methods

${categoryMethods.length} methods in the ${this.capitalize(category)} category.

---

`;

      for (const method of categoryMethods) {
        const badge = this.getBadge(method);
        content += `### #${method.num} ${method.method_name}${badge}
${method.description}

**Pattern:** ${method.output_pattern}

---

`;
      }

      const outputPath = path.join(categoriesDir, `${category}.md`);
      await fs.writeFile(outputPath, content, 'utf8');
    }

    return categories.length;
  }

  /**
   * Get badge string for method based on primary flags
   * @param {Object} method - Method object
   * @returns {string} Badge string like " [V]", " [D]", " [V][D]", or ""
   */
  getBadge(method) {
    const isV = method.primary_verify?.toLowerCase() === 'yes';
    const isD = method.primary_discover?.toLowerCase() === 'yes';

    if (isV && isD) return ' [V][D]';
    if (isV) return ' [V]';
    if (isD) return ' [D]';
    return '';
  }

  /**
   * Capitalize first letter of string
   * @param {string} str - String to capitalize
   * @returns {string} Capitalized string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Build generation report
   * @returns {Object} Report object
   */
  buildReport() {
    const verifyMethods = this.methods.filter((m) => m.primary_verify?.toLowerCase() === 'yes');
    const discoverMethods = this.methods.filter((m) => m.primary_discover?.toLowerCase() === 'yes');
    const categories = [...new Set(this.methods.map((m) => m.category))];

    return {
      totalMethods: this.methods.length,
      primaryVerifyCount: verifyMethods.length,
      primaryDiscoverCount: discoverMethods.length,
      categoryCount: categories.length,
      categories: categories,
      warnings: this.warnings,
    };
  }
}

module.exports = { AEMethodsGenerator };
