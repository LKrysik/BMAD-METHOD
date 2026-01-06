/**
 * Advanced Elicitation Methods Generator v5.1
 *
 * Generates from methods.csv + ae-custom-lists.yaml:
 * - primary_verify.md
 * - primary_discover.md
 * - ae_by_categories/*.md
 * - ae-lists/*.md (one file per list from ae-custom-lists.yaml)
 *
 * Output location: src/core/methods/
 *
 * @module ae-methods-generator
 */

const path = require('node:path');
const fs = require('fs-extra');
const { parse } = require('csv-parse/sync');
const crypto = require('node:crypto');
const yaml = require('js-yaml');

const DATA_DIR = 'src/core/methods';
const SOURCE_CSV = 'methods.csv';
const CUSTOM_LISTS_FILE = 'ae-custom-lists.yaml';

class AEMethodsGenerator {
  /**
   * Create a new AEMethodsGenerator instance
   * @param {string} projectRoot - The root directory of the project
   */
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.methods = [];
    this.customLists = null;
    this.errors = [];
    this.warnings = [];
    this.sourceHash = null;
  }

  /**
   * Main generation method
   * @returns {Promise<Object>} Generation report
   */
  async generate() {
    // 1. Load and parse CSV
    await this.loadMethods();

    // 2. Load custom lists (required - source of truth)
    await this.loadCustomLists();

    // 3. Validate CSV
    this.validateMethods();

    // 4. Validate custom lists
    this.validateCustomLists();

    if (this.errors.length > 0) {
      throw new Error(`Validation failed:\n${this.errors.join('\n')}`);
    }

    // 5. Calculate source hash for header
    this.sourceHash = await this.calculateSourceHash();

    // 6. Generate primary_verify.md
    await this.generatePrimaryVerify(this.sourceHash);

    // 7. Generate primary_discover.md
    await this.generatePrimaryDiscover(this.sourceHash);

    // 8. Generate ae_by_categories/*.md
    await this.generateCategoryFiles(this.sourceHash);

    // 9. Generate ae-lists/*.md (from ae-custom-lists.yaml)
    await this.generateListFiles(this.sourceHash);

    // 10. Report results
    return this.buildReport();
  }

  /**
   * Load methods from CSV file
   * @throws {Error} If CSV file cannot be read or parsed
   */
  async loadMethods() {
    const csvPath = path.join(this.projectRoot, DATA_DIR, SOURCE_CSV);

    let content;
    try {
      content = await fs.readFile(csvPath, 'utf8');
    } catch (error) {
      throw new Error(`Cannot read methods file: ${csvPath}\n  ${error.message}`);
    }

    try {
      this.methods = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (error) {
      throw new Error(
        `Invalid CSV syntax in ${SOURCE_CSV}:\n` + `  ${error.message}\n` + `  Check for unescaped quotes or malformed rows.`,
      );
    }

    // Add line numbers for error reporting
    for (const [index, method] of this.methods.entries()) {
      method._line = index + 2; // +2 for header and 0-indexing
    }

    // Create lookup map by method number
    this.methodsById = new Map();
    for (const method of this.methods) {
      this.methodsById.set(parseInt(method.num, 10), method);
    }
  }

  /**
   * Load custom lists from YAML file (required - source of truth)
   * @throws {Error} If YAML file cannot be read or parsed
   */
  async loadCustomLists() {
    const yamlPath = path.join(this.projectRoot, DATA_DIR, CUSTOM_LISTS_FILE);

    let content;
    try {
      content = await fs.readFile(yamlPath, 'utf8');
    } catch (error) {
      throw new Error(`Cannot read custom lists file: ${yamlPath}\n  ${error.message}`);
    }

    try {
      this.customLists = yaml.load(content);
    } catch (error) {
      throw new Error(
        `Invalid YAML syntax in ${CUSTOM_LISTS_FILE}:\n` +
          `  Line ${error.mark?.line || '?'}: ${error.reason || error.message}\n` +
          `  Check indentation and structure.`,
      );
    }

    if (!this.customLists || typeof this.customLists !== 'object') {
      throw new Error(`${CUSTOM_LISTS_FILE} must contain a valid YAML object`);
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
    }
  }

  /**
   * Validate custom lists references exist in methods.csv
   * Validates: verify-lists, discover-lists, domain-lists, primary
   */
  validateCustomLists() {
    const allMethodNums = new Set(this.methods.map((m) => parseInt(m.num, 10)));
    const validNamePattern = /^[a-z0-9-]+$/;

    // Helper to validate method array
    const validateMethods = (context, methods) => {
      if (!Array.isArray(methods)) {
        this.errors.push(`${context} methods must be an array`);
        return;
      }
      for (const num of methods) {
        if (!allMethodNums.has(num)) {
          this.errors.push(`${context} references non-existent method: ${num}`);
        }
      }
    };

    // Validate verify-lists
    if (this.customLists['verify-lists']) {
      for (const [listId, config] of Object.entries(this.customLists['verify-lists'])) {
        if (!validNamePattern.test(listId)) {
          this.errors.push(`verify-lists.${listId} has invalid ID format`);
        }
        validateMethods(`verify-lists.${listId}`, config.methods);
      }
    }

    // Validate discover-lists
    if (this.customLists['discover-lists']) {
      for (const [listId, config] of Object.entries(this.customLists['discover-lists'])) {
        if (!validNamePattern.test(listId)) {
          this.errors.push(`discover-lists.${listId} has invalid ID format`);
        }
        validateMethods(`discover-lists.${listId}`, config.methods);
      }
    }

    // Validate domain-lists (have both verify and discover)
    if (this.customLists['domain-lists']) {
      for (const [listId, config] of Object.entries(this.customLists['domain-lists'])) {
        if (!validNamePattern.test(listId)) {
          this.errors.push(`domain-lists.${listId} has invalid ID format`);
        }
        if (config.verify) {
          validateMethods(`domain-lists.${listId}.verify`, config.verify);
        }
        if (config.discover) {
          validateMethods(`domain-lists.${listId}.discover`, config.discover);
        }
        if (!config.verify && !config.discover) {
          this.errors.push(`domain-lists.${listId} must have 'verify' or 'discover' array`);
        }
      }
    }

    // Validate primary pools
    if (this.customLists.primary) {
      if (this.customLists.primary.verify) {
        validateMethods('primary.verify', this.customLists.primary.verify.methods);
      }
      if (this.customLists.primary.discover) {
        validateMethods('primary.discover', this.customLists.primary.discover.methods);
      }
    } else {
      this.errors.push('Missing required "primary" section with verify and discover pools');
    }

    // Check primary counts
    const verifyCount = this.customLists.primary?.verify?.methods?.length || 0;
    const discoverCount = this.customLists.primary?.discover?.methods?.length || 0;

    if (verifyCount < 10 || verifyCount > 25) {
      this.warnings.push(`primary.verify count is ${verifyCount}, recommended: 10-25`);
    }
    if (discoverCount < 10 || discoverCount > 25) {
      this.warnings.push(`primary.discover count is ${discoverCount}, recommended: 10-25`);
    }
  }

  /**
   * Calculate SHA256 hash of source files (CSV + ae-custom-lists.yaml)
   * @returns {Promise<string>} First 8 characters of hash
   */
  async calculateSourceHash() {
    const csvPath = path.join(this.projectRoot, DATA_DIR, SOURCE_CSV);
    const customListsPath = path.join(this.projectRoot, DATA_DIR, CUSTOM_LISTS_FILE);

    const csvContent = await fs.readFile(csvPath);
    const customListsContent = await fs.readFile(customListsPath);

    const combined = Buffer.concat([csvContent, customListsContent]);
    return crypto.createHash('sha256').update(combined).digest('hex').slice(0, 8);
  }

  /**
   * Generate the header comment for generated files
   * @param {string} sourceHash - Hash of source files
   * @returns {string} Header comment
   */
  generateHeader(sourceHash) {
    const timestamp = new Date().toISOString();
    return `<!-- GENERATED: ${timestamp} -->
<!-- SOURCE: methods.csv + ae-custom-lists.yaml (hash: ${sourceHash}) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

`;
  }

  /**
   * Generate primary_verify.md file
   * @param {string} sourceHash - Hash of source files
   */
  async generatePrimaryVerify(sourceHash) {
    const methodNums = this.customLists.primary?.verify?.methods || [];
    const verifyMethods = methodNums.map((num) => this.methodsById.get(num)).filter(Boolean);

    let content = this.generateHeader(sourceHash);
    content += `# Primary Verify Methods

${verifyMethods.length} methods optimized for verification and quality checking.

Use these methods to validate generated content, find inconsistencies, identify risks, and ensure quality.

---

`;

    for (const method of verifyMethods) {
      content += `## #${method.num} ${method.method_name}

${method.description}

**Pattern:** ${method.output_pattern}

---

`;
    }

    const outputPath = path.join(this.projectRoot, DATA_DIR, 'primary_verify.md');
    await fs.writeFile(outputPath, content, 'utf8');
  }

  /**
   * Generate primary_discover.md file
   * @param {string} sourceHash - Hash of source files
   */
  async generatePrimaryDiscover(sourceHash) {
    const methodNums = this.customLists.primary?.discover?.methods || [];
    const discoverMethods = methodNums.map((num) => this.methodsById.get(num)).filter(Boolean);

    let content = this.generateHeader(sourceHash);
    content += `# Primary Discover Methods

${discoverMethods.length} methods optimized for discovery and requirements elicitation.

Use these methods to explore requirements, uncover hidden assumptions, and deepen understanding.

---

`;

    for (const method of discoverMethods) {
      content += `## #${method.num} ${method.method_name}

${method.description}

**Pattern:** ${method.output_pattern}

---

`;
    }

    const outputPath = path.join(this.projectRoot, DATA_DIR, 'primary_discover.md');
    await fs.writeFile(outputPath, content, 'utf8');
  }

  /**
   * Generate category files in ae_by_categories/
   * @param {string} sourceHash - Hash of source files
   * @returns {Promise<number>} Number of categories generated
   */
  async generateCategoryFiles(sourceHash) {
    // Get unique categories dynamically
    const categories = [...new Set(this.methods.map((m) => m.category))];

    const categoriesDir = path.join(this.projectRoot, DATA_DIR, 'ae_by_categories');
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
        content += `## #${method.num} ${method.method_name}${badge}

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
   * Generate list files in ae-lists/ from ae-custom-lists.yaml
   * Creates one file per list (verify-lists, discover-lists, domain-lists)
   * @param {string} sourceHash - Hash of source files
   * @returns {Promise<Object>} Counts of generated lists by type
   */
  async generateListFiles(sourceHash) {
    const listsDir = path.join(this.projectRoot, DATA_DIR, 'ae-lists');
    await fs.ensureDir(listsDir);

    // Clean old list files
    const existingFiles = await fs.readdir(listsDir);
    for (const file of existingFiles) {
      if (file.endsWith('.md')) {
        await fs.remove(path.join(listsDir, file));
      }
    }

    const counts = { verify: 0, discover: 0, domain: 0 };

    // Generate verify-only lists
    if (this.customLists['verify-lists']) {
      for (const [listId, config] of Object.entries(this.customLists['verify-lists'])) {
        await this.generateSingleListFile(listsDir, listId, config, 'verify', sourceHash);
        counts.verify++;
      }
    }

    // Generate discover-only lists
    if (this.customLists['discover-lists']) {
      for (const [listId, config] of Object.entries(this.customLists['discover-lists'])) {
        await this.generateSingleListFile(listsDir, listId, config, 'discover', sourceHash);
        counts.discover++;
      }
    }

    // Generate domain lists (combined verify + discover)
    if (this.customLists['domain-lists']) {
      for (const [listId, config] of Object.entries(this.customLists['domain-lists'])) {
        await this.generateDomainListFile(listsDir, listId, config, sourceHash);
        counts.domain++;
      }
    }

    return counts;
  }

  /**
   * Generate a single verify or discover list file
   * @param {string} dir - Output directory
   * @param {string} listId - List identifier
   * @param {Object} config - List configuration
   * @param {string} type - 'verify' or 'discover'
   * @param {string} sourceHash - Source hash
   */
  async generateSingleListFile(dir, listId, config, type, sourceHash) {
    const methodNums = config.methods || [];
    const listMethods = methodNums.map((num) => this.methodsById.get(num)).filter(Boolean);
    const name = config.name || this.capitalize(listId);
    const typeLabel = type === 'verify' ? 'Verify' : 'Discover';

    let content = this.generateHeader(sourceHash);
    content += `# ${name}

**Type:** ${typeLabel}-only list
**Description:** ${config.description || 'No description'}
**Methods:** ${listMethods.length}

Use \`aeList: '${listId}'\` in step frontmatter.

---

`;

    for (const method of listMethods) {
      content += `## #${method.num} ${method.method_name}

${method.description}

**Pattern:** ${method.output_pattern}

---

`;
    }

    const outputPath = path.join(dir, `${listId}.md`);
    await fs.writeFile(outputPath, content, 'utf8');
  }

  /**
   * Generate a domain list file (combined verify + discover)
   * @param {string} dir - Output directory
   * @param {string} listId - List identifier
   * @param {Object} config - List configuration
   * @param {string} sourceHash - Source hash
   */
  async generateDomainListFile(dir, listId, config, sourceHash) {
    const name = config.name || this.capitalize(listId);

    let content = this.generateHeader(sourceHash);
    content += `# ${name}

**Type:** Domain list (verify + discover)
**Description:** ${config.description || 'No description'}

Use \`aeList: '${listId}'\` in step frontmatter.

---

`;

    // Verify methods section
    if (config.verify && config.verify.length > 0) {
      const verifyMethods = config.verify.map((num) => this.methodsById.get(num)).filter(Boolean);
      content += `## Verify Methods (${verifyMethods.length})

`;
      for (const method of verifyMethods) {
        content += `### #${method.num} ${method.method_name}

${method.description}

**Pattern:** ${method.output_pattern}

`;
      }
      content += `---

`;
    }

    // Discover methods section
    if (config.discover && config.discover.length > 0) {
      const discoverMethods = config.discover.map((num) => this.methodsById.get(num)).filter(Boolean);
      content += `## Discover Methods (${discoverMethods.length})

`;
      for (const method of discoverMethods) {
        content += `### #${method.num} ${method.method_name}

${method.description}

**Pattern:** ${method.output_pattern}

`;
      }
    }

    const outputPath = path.join(dir, `${listId}.md`);
    await fs.writeFile(outputPath, content, 'utf8');
  }

  /**
   * Get badge string for method based on primary pools
   * @param {Object} method - Method object
   * @returns {string} Badge string like " [V]", " [D]", " [V][D]", or ""
   */
  getBadge(method) {
    const badges = [];
    const num = parseInt(method.num, 10);

    // Check if in primary verify
    if (this.customLists.primary?.verify?.methods?.includes(num)) {
      badges.push('V');
    }
    // Check if in primary discover
    if (this.customLists.primary?.discover?.methods?.includes(num)) {
      badges.push('D');
    }

    return badges.length > 0 ? ` [${badges.join('][')}]` : '';
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
    const verifyMethods = this.customLists.primary?.verify?.methods || [];
    const discoverMethods = this.customLists.primary?.discover?.methods || [];
    const categories = [...new Set(this.methods.map((m) => m.category))];

    // Count lists by type
    const verifyLists = Object.keys(this.customLists['verify-lists'] || {});
    const discoverLists = Object.keys(this.customLists['discover-lists'] || {});
    const domainLists = Object.keys(this.customLists['domain-lists'] || {});
    const totalLists = verifyLists.length + discoverLists.length + domainLists.length;

    const generatedFiles = [
      'data/primary_verify.md',
      'data/primary_discover.md',
      `data/ae_by_categories/ (${categories.length} files)`,
      `data/ae-lists/ (${totalLists} files)`,
    ];

    return {
      totalMethods: this.methods.length,
      primaryVerifyCount: verifyMethods.length,
      primaryDiscoverCount: discoverMethods.length,
      categoryCount: categories.length,
      categories: categories,
      listCounts: {
        verify: verifyLists.length,
        discover: discoverLists.length,
        domain: domainLists.length,
        total: totalLists,
      },
      lists: {
        verify: verifyLists,
        discover: discoverLists,
        domain: domainLists,
      },
      sourceHash: this.sourceHash,
      warnings: this.warnings,
      generatedFiles: generatedFiles,
    };
  }

  /**
   * Check if generated files are up-to-date with source files
   * @param {string} projectRoot - Project root directory
   * @returns {Promise<Object>} Freshness check result
   */
  static async checkFreshness(projectRoot) {
    const csvPath = path.join(projectRoot, DATA_DIR, SOURCE_CSV);
    const customListsPath = path.join(projectRoot, DATA_DIR, CUSTOM_LISTS_FILE);
    const verifyPath = path.join(projectRoot, DATA_DIR, 'primary_verify.md');

    // Calculate current source hash
    let currentHash;
    try {
      const csvContent = await fs.readFile(csvPath);
      const customListsContent = await fs.readFile(customListsPath);

      const combined = Buffer.concat([csvContent, customListsContent]);
      currentHash = crypto.createHash('sha256').update(combined).digest('hex').slice(0, 8);
    } catch {
      return { fresh: false, reason: 'Cannot read source files', currentHash: null, generatedHash: null };
    }

    // Read hash from generated file
    let generatedHash = null;
    try {
      const verifyContent = await fs.readFile(verifyPath, 'utf8');
      const hashMatch = verifyContent.match(/hash: ([a-f0-9]{8})/);
      generatedHash = hashMatch ? hashMatch[1] : null;
    } catch {
      return { fresh: false, reason: 'Generated files not found', currentHash, generatedHash: null };
    }

    if (!generatedHash) {
      return { fresh: false, reason: 'No hash found in generated files', currentHash, generatedHash: null };
    }

    const fresh = currentHash === generatedHash;
    return {
      fresh,
      reason: fresh ? 'Up to date' : 'Source files changed since last generation',
      currentHash,
      generatedHash,
    };
  }
}

module.exports = { AEMethodsGenerator };
