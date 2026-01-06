/**
 * Advanced Elicitation Methods Generator v4.0
 *
 * Generates from methods.csv + ae_mapping.yaml:
 * - data/primary_verify.md
 * - data/primary_discover.md
 * - data/ae_by_categories/*.md
 * - data/ae_by_roles/*.md
 *
 * @module ae-methods-generator
 */

const path = require('node:path');
const fs = require('fs-extra');
const { parse } = require('csv-parse/sync');
const crypto = require('node:crypto');
const yaml = require('js-yaml');

const DATA_DIR = 'src/core/workflows/advanced-elicitation/data';
const SOURCE_CSV = 'methods.csv';
const MAPPING_FILE = 'ae-mapping.yaml';
const CUSTOM_LISTS_FILE = 'custom-lists.yaml';

class AEMethodsGenerator {
  /**
   * Create a new AEMethodsGenerator instance
   * @param {string} projectRoot - The root directory of the project
   */
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.methods = [];
    this.mapping = null;
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

    // 2. Load and parse YAML mapping
    await this.loadMapping();

    // 3. Load custom lists (optional)
    await this.loadCustomLists();

    // 4. Validate CSV
    this.validateMethods();

    // 5. Validate mapping
    this.validateMapping();

    // 6. Validate custom lists
    this.validateCustomLists();

    if (this.errors.length > 0) {
      throw new Error(`Validation failed:\n${this.errors.join('\n')}`);
    }

    // 7. Calculate source hash for header
    this.sourceHash = await this.calculateSourceHash();

    // 8. Generate primary_verify.md
    await this.generatePrimaryVerify(this.sourceHash);

    // 9. Generate primary_discover.md
    await this.generatePrimaryDiscover(this.sourceHash);

    // 10. Generate ae_by_categories/*.md
    await this.generateCategoryFiles(this.sourceHash);

    // 11. Generate ae_by_roles/*.md
    await this.generateRoleFiles(this.sourceHash);

    // 12. Generate ae_user_lists.md (if custom lists exist)
    await this.generateUserListsFile(this.sourceHash);

    // 13. (Removed - scenarios dir no longer exists, quick_mode.md is in deep-verify/ and deep-discover/)

    // 14. Report results
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
   * Load mapping from YAML file
   * @throws {Error} If YAML file cannot be read or parsed
   */
  async loadMapping() {
    const yamlPath = path.join(this.projectRoot, DATA_DIR, MAPPING_FILE);

    let content;
    try {
      content = await fs.readFile(yamlPath, 'utf8');
    } catch (error) {
      throw new Error(`Cannot read mapping file: ${yamlPath}\n  ${error.message}`);
    }

    try {
      this.mapping = yaml.load(content);
    } catch (error) {
      throw new Error(
        `Invalid YAML syntax in ${MAPPING_FILE}:\n` +
          `  Line ${error.mark?.line || '?'}: ${error.reason || error.message}\n` +
          `  Check indentation and structure.`,
      );
    }

    if (!this.mapping || typeof this.mapping !== 'object') {
      throw new Error(`${MAPPING_FILE} must contain a valid YAML object`);
    }
  }

  /**
   * Load custom lists from YAML file (optional - no error if missing)
   */
  async loadCustomLists() {
    const yamlPath = path.join(this.projectRoot, DATA_DIR, CUSTOM_LISTS_FILE);

    // Check if file exists - it's optional
    if (!(await fs.pathExists(yamlPath))) {
      this.customLists = null;
      return;
    }

    let content;
    try {
      content = await fs.readFile(yamlPath, 'utf8');
    } catch (error) {
      this.warnings.push(`Cannot read custom lists file: ${error.message}`);
      this.customLists = null;
      return;
    }

    try {
      this.customLists = yaml.load(content);
    } catch (error) {
      this.errors.push(
        `Invalid YAML syntax in ${CUSTOM_LISTS_FILE}:\n` +
          `  Line ${error.mark?.line || '?'}: ${error.reason || error.message}\n` +
          `  Check indentation and structure.`,
      );
      this.customLists = null;
      return;
    }

    if (this.customLists && typeof this.customLists !== 'object') {
      this.errors.push(`${CUSTOM_LISTS_FILE} must contain a valid YAML object`);
      this.customLists = null;
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
   * Validate the mapping references exist in methods.csv
   */
  validateMapping() {
    const allMethodNums = new Set(this.methods.map((m) => parseInt(m.num, 10)));

    // Validate roles
    if (this.mapping.roles) {
      for (const [role, config] of Object.entries(this.mapping.roles)) {
        if (!config.methods || !Array.isArray(config.methods)) {
          this.errors.push(`Role '${role}' missing methods array`);
          continue;
        }
        for (const num of config.methods) {
          if (!allMethodNums.has(num)) {
            this.errors.push(`Role '${role}' references non-existent method: ${num}`);
          }
        }
      }
    }

    // Validate primary
    if (this.mapping.primary) {
      for (const [mode, config] of Object.entries(this.mapping.primary)) {
        if (!config.methods || !Array.isArray(config.methods)) {
          this.errors.push(`Primary '${mode}' missing methods array`);
          continue;
        }
        for (const num of config.methods) {
          if (!allMethodNums.has(num)) {
            this.errors.push(`Primary '${mode}' references non-existent method: ${num}`);
          }
        }
      }
    }

    // Validate quick
    if (this.mapping.quick) {
      for (const [mode, config] of Object.entries(this.mapping.quick)) {
        const allQuick = [...(config.recommended || []), ...(config.additional || [])];
        for (const num of allQuick) {
          if (!allMethodNums.has(num)) {
            this.errors.push(`Quick '${mode}' references non-existent method: ${num}`);
          }
        }
      }
    }

    // Check primary counts
    const verifyCount = this.mapping.primary?.verify?.methods?.length || 0;
    const discoverCount = this.mapping.primary?.discover?.methods?.length || 0;

    if (verifyCount < 10 || verifyCount > 25) {
      this.warnings.push(`primary.verify count is ${verifyCount}, recommended: 10-25`);
    }
    if (discoverCount < 10 || discoverCount > 25) {
      this.warnings.push(`primary.discover count is ${discoverCount}, recommended: 10-25`);
    }
  }

  /**
   * Validate custom lists references exist in methods.csv
   */
  validateCustomLists() {
    if (!this.customLists?.lists) {
      return;
    }

    const allMethodNums = new Set(this.methods.map((m) => parseInt(m.num, 10)));
    const listNames = new Set();
    const validNamePattern = /^[a-z0-9-]+$/;

    for (const [listId, config] of Object.entries(this.customLists.lists)) {
      // Validate list ID format
      if (!validNamePattern.test(listId)) {
        this.errors.push(`Custom list '${listId}' has invalid ID format. ` + `Use lowercase letters, numbers, and hyphens only.`);
      }

      // Check duplicate names
      const name = config.name || listId;
      if (listNames.has(name.toLowerCase())) {
        this.errors.push(`Duplicate custom list name: '${name}'`);
      }
      listNames.add(name.toLowerCase());

      // Validate required fields
      if (!config.name) {
        this.warnings.push(`Custom list '${listId}' missing 'name' field`);
      }
      if (!config.description) {
        this.warnings.push(`Custom list '${listId}' missing 'description' field`);
      }

      // Validate methods array
      if (!config.methods || !Array.isArray(config.methods)) {
        this.errors.push(`Custom list '${listId}' missing 'methods' array`);
        continue;
      }

      if (config.methods.length === 0) {
        this.errors.push(`Custom list '${listId}' has empty 'methods' array`);
        continue;
      }

      // Validate each method reference
      for (const num of config.methods) {
        if (!allMethodNums.has(num)) {
          this.errors.push(`Custom list '${listId}' references non-existent method: ${num}`);
        }
      }

      // Warn about list size
      if (config.methods.length > 10) {
        this.warnings.push(`Custom list '${listId}' has ${config.methods.length} methods. ` + `Recommended: 3-10 for focused sessions.`);
      }
    }
  }

  /**
   * Calculate SHA256 hash of all source files (CSV + YAML mapping + custom lists)
   * @returns {Promise<string>} First 8 characters of hash
   */
  async calculateSourceHash() {
    const csvPath = path.join(this.projectRoot, DATA_DIR, SOURCE_CSV);
    const yamlPath = path.join(this.projectRoot, DATA_DIR, MAPPING_FILE);
    const customListsPath = path.join(this.projectRoot, DATA_DIR, CUSTOM_LISTS_FILE);

    const csvContent = await fs.readFile(csvPath);
    const yamlContent = await fs.readFile(yamlPath);

    // Include custom-lists.yaml if it exists
    let customListsContent = Buffer.alloc(0);
    if (await fs.pathExists(customListsPath)) {
      customListsContent = await fs.readFile(customListsPath);
    }

    const combined = Buffer.concat([csvContent, yamlContent, customListsContent]);
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
<!-- SOURCE: methods.csv + ae-mapping.yaml + custom-lists.yaml (hash: ${sourceHash}) -->
<!-- DO NOT EDIT MANUALLY - regenerate with: npm run bmad:generate-ae-methods -->

`;
  }

  /**
   * Generate primary_verify.md file
   * @param {string} sourceHash - Hash of source files
   */
  async generatePrimaryVerify(sourceHash) {
    const methodNums = this.mapping.primary?.verify?.methods || [];
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
    const methodNums = this.mapping.primary?.discover?.methods || [];
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
   * Generate role files in ae_by_roles/
   * @param {string} sourceHash - Hash of source files
   * @returns {Promise<number>} Number of roles generated
   */
  async generateRoleFiles(sourceHash) {
    const rolesDir = path.join(this.projectRoot, DATA_DIR, 'ae_by_roles');
    await fs.ensureDir(rolesDir);

    // Clean old role files
    const existingFiles = await fs.readdir(rolesDir);
    for (const file of existingFiles) {
      if (file.endsWith('.md')) {
        await fs.remove(path.join(rolesDir, file));
      }
    }

    const roles = Object.entries(this.mapping.roles || {});

    for (const [role, config] of roles) {
      const methodNums = config.methods || [];
      const roleMethods = methodNums.map((num) => this.methodsById.get(num)).filter(Boolean);

      let content = this.generateHeader(sourceHash);
      content += `# ${this.capitalize(role)} Role Methods

**Focus:** ${config.description || 'No description'}

${roleMethods.length} default methods for the ${role} aeRole.

Use \`aeRole: '${role}'\` in step frontmatter to use these methods with [P]redefined option.

---

`;

      for (const method of roleMethods) {
        content += `## #${method.num} ${method.method_name}

${method.description}

**Pattern:** ${method.output_pattern}

---

`;
      }

      const outputPath = path.join(rolesDir, `${role}.md`);
      await fs.writeFile(outputPath, content, 'utf8');
    }

    return roles.length;
  }

  /**
   * Generate ae_user_lists.md file with all custom lists
   * @param {string} sourceHash - Hash of source files
   * @returns {Promise<number>} Number of lists generated
   */
  async generateUserListsFile(sourceHash) {
    if (!this.customLists?.lists) {
      return 0;
    }

    const lists = Object.entries(this.customLists.lists);
    if (lists.length === 0) {
      return 0;
    }

    let content = this.generateHeader(sourceHash);
    content += `# User-Defined Method Lists

${lists.length} custom list(s) available via **[U] User Lists** menu option.

---

## Quick Reference

| List | Methods | Description |
|------|---------|-------------|
`;

    for (const [listId, config] of lists) {
      const methodCount = config.methods?.length || 0;
      const name = config.name || listId;
      const desc = config.description || 'No description';
      content += `| **${name}** | ${methodCount} | ${desc} |\n`;
    }

    content += `
---

`;

    // Generate detailed section for each list
    for (const [listId, config] of lists) {
      const methodNums = config.methods || [];
      const listMethods = methodNums.map((num) => this.methodsById.get(num)).filter(Boolean);
      const name = config.name || listId;

      content += `## ${name}

**ID:** \`${listId}\`
**Description:** ${config.description || 'No description'}
**Methods:** ${listMethods.length}

`;

      for (const method of listMethods) {
        content += `### #${method.num} ${method.method_name}

${method.description}

**Pattern:** ${method.output_pattern}

`;
      }

      content += `---

`;
    }

    const outputPath = path.join(this.projectRoot, DATA_DIR, 'ae_user_lists.md');
    await fs.writeFile(outputPath, content, 'utf8');

    return lists.length;
  }

  // ensureScenariosDir removed - quick_mode.md is now in deep-verify/ and deep-discover/

  /**
   * Get badge string for method based on mapping
   * @param {Object} method - Method object
   * @returns {string} Badge string like " [V]", " [D]", " [V][D]", or ""
   */
  getBadge(method) {
    const badges = [];
    const num = parseInt(method.num, 10);

    // Check if in primary verify
    if (this.mapping.primary?.verify?.methods?.includes(num)) {
      badges.push('V');
    }
    // Check if in primary discover
    if (this.mapping.primary?.discover?.methods?.includes(num)) {
      badges.push('D');
    }
    // Check if in quick verify (recommended)
    if (this.mapping.quick?.verify?.recommended?.includes(num)) {
      badges.push('Q');
    }
    // Check if in quick discover (recommended)
    if (this.mapping.quick?.discover?.recommended?.includes(num)) {
      badges.push('T');
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
    const verifyMethods = this.mapping.primary?.verify?.methods || [];
    const discoverMethods = this.mapping.primary?.discover?.methods || [];
    const categories = [...new Set(this.methods.map((m) => m.category))];
    const roles = Object.keys(this.mapping.roles || {});
    const customLists = this.customLists?.lists ? Object.keys(this.customLists.lists) : [];

    const generatedFiles = [
      'data/primary_verify.md',
      'data/primary_discover.md',
      `data/ae_by_categories/ (${categories.length} files)`,
      `data/ae_by_roles/ (${roles.length} files)`,
    ];

    if (customLists.length > 0) {
      generatedFiles.push('data/ae_user_lists.md');
    }

    return {
      totalMethods: this.methods.length,
      primaryVerifyCount: verifyMethods.length,
      primaryDiscoverCount: discoverMethods.length,
      categoryCount: categories.length,
      categories: categories,
      roleCount: roles.length,
      roles: roles,
      customListCount: customLists.length,
      customLists: customLists,
      sourceHash: this.sourceHash,
      warnings: this.warnings,
      generatedFiles: generatedFiles,
      note: 'scenarios/ae_quick_mode.md is manually maintained (not generated)',
    };
  }

  /**
   * Check if generated files are up-to-date with source files
   * @param {string} projectRoot - Project root directory
   * @returns {Promise<Object>} Freshness check result
   */
  static async checkFreshness(projectRoot) {
    const csvPath = path.join(projectRoot, DATA_DIR, SOURCE_CSV);
    const yamlPath = path.join(projectRoot, DATA_DIR, MAPPING_FILE);
    const customListsPath = path.join(projectRoot, DATA_DIR, CUSTOM_LISTS_FILE);
    const verifyPath = path.join(projectRoot, DATA_DIR, 'primary_verify.md');

    // Calculate current source hash (includes custom-lists.yaml if exists)
    let currentHash;
    try {
      const csvContent = await fs.readFile(csvPath);
      const yamlContent = await fs.readFile(yamlPath);

      // Include custom-lists.yaml if it exists
      let customListsContent = Buffer.alloc(0);
      if (await fs.pathExists(customListsPath)) {
        customListsContent = await fs.readFile(customListsPath);
      }

      const combined = Buffer.concat([csvContent, yamlContent, customListsContent]);
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
