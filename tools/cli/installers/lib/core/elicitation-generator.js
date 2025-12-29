/**
 * Elicitation Category Generator
 *
 * Generates category-specific markdown files from methods.csv during installation.
 * Reads category-metadata.csv for category display info and file names.
 *
 * These files are placed in _bmad/core/workflows/advanced-elicitation/categories/
 * and can be referenced by workflows to get context-specific elicitation methods.
 */

const fs = require('fs-extra');
const path = require('node:path');
const { parse } = require('csv-parse/sync');

/**
 * Validate consistency between methods.csv and category-metadata.csv
 * @param {Object} byCategory - Methods grouped by category
 * @param {Object} categoryMetadata - Metadata lookup by category
 * @returns {Object} Validation result with errors and warnings
 */
function validateCsvConsistency(byCategory, categoryMetadata) {
  const errors = [];
  const warnings = [];

  const methodCategories = new Set(Object.keys(byCategory));
  const metadataCategories = new Set(Object.keys(categoryMetadata));

  // Check for categories in methods.csv without metadata
  for (const category of methodCategories) {
    if (!metadataCategories.has(category)) {
      errors.push(`Category "${category}" exists in methods.csv but missing from category-metadata.csv`);
    }
  }

  // Check for categories in metadata without methods
  for (const category of metadataCategories) {
    if (!methodCategories.has(category)) {
      warnings.push(`Category "${category}" defined in category-metadata.csv but has no methods in methods.csv`);
    }
  }

  // Validate metadata fields
  for (const [category, meta] of Object.entries(categoryMetadata)) {
    if (!meta.fileName) {
      errors.push(`Category "${category}" missing file_name in category-metadata.csv`);
    }
    if (!meta.displayName) {
      warnings.push(`Category "${category}" missing display_name in category-metadata.csv`);
    }
    if (!meta.whenToUse) {
      warnings.push(`Category "${category}" missing when_to_use in category-metadata.csv`);
    }
  }

  return { errors, warnings, isValid: errors.length === 0 };
}

/**
 * Generate category-specific elicitation files
 * @param {string} bmadDir - The _bmad installation directory
 * @param {string} sourceDir - Path to advanced-elicitation source directory
 */
async function generateElicitationCategories(bmadDir, sourceDir) {
  const methodsCsvPath = path.join(sourceDir, 'methods.csv');
  const metadataCsvPath = path.join(sourceDir, 'category-metadata.csv');

  // Check if category-metadata.csv exists
  if (!(await fs.pathExists(metadataCsvPath))) {
    throw new Error(
      `category-metadata.csv not found at ${metadataCsvPath}. ` + 'This file is required to generate elicitation category files.',
    );
  }

  // Read and parse category-metadata.csv
  const metadataContent = await fs.readFile(metadataCsvPath, 'utf-8');
  const metadataRows = parse(metadataContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Build metadata lookup by category
  const categoryMetadata = {};
  for (const row of metadataRows) {
    categoryMetadata[row.category] = {
      displayName: row.display_name,
      icon: row.icon,
      whenToUse: row.when_to_use,
      fileName: row.file_name,
    };
  }

  // Read and parse methods.csv
  const methodsContent = await fs.readFile(methodsCsvPath, 'utf-8');
  const methods = parse(methodsContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  // Group methods by category
  const byCategory = {};
  for (const method of methods) {
    const category = method.category;
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push({
      num: parseInt(method.num, 10),
      name: method.method_name,
      description: method.description,
      pattern: method.output_pattern,
    });
  }

  // Validate CSV consistency
  const validation = validateCsvConsistency(byCategory, categoryMetadata);

  // Log warnings
  for (const warning of validation.warnings) {
    console.warn(`  Warning: ${warning}`);
  }

  // Throw on errors
  if (!validation.isValid) {
    const errorMsg = validation.errors.join('\n  - ');
    throw new Error(`Elicitation CSV validation failed:\n  - ${errorMsg}`);
  }

  // Create output directory
  const outputDir = path.join(bmadDir, 'core', 'workflows', 'advanced-elicitation', 'categories');
  await fs.ensureDir(outputDir);

  // Generate a file for each category
  const generatedFiles = [];

  for (const [category, categoryMethods] of Object.entries(byCategory)) {
    const metadata = categoryMetadata[category];

    const content = generateCategoryMarkdown(category, metadata, categoryMethods);
    const filePath = path.join(outputDir, metadata.fileName);

    await fs.writeFile(filePath, content, 'utf-8');
    generatedFiles.push(metadata.fileName);
  }

  // Copy category-metadata.csv to output for workflow access
  const targetMetadataPath = path.join(bmadDir, 'core', 'workflows', 'advanced-elicitation', 'category-metadata.csv');
  await fs.copy(metadataCsvPath, targetMetadataPath);

  // Generate index file
  await generateIndexFile(outputDir, byCategory, categoryMetadata);
  generatedFiles.push('_index.md');

  return generatedFiles;
}

/**
 * Generate markdown content for a category
 */
function generateCategoryMarkdown(category, metadata, methods) {
  const lines = [
    `# ${metadata.icon} ${metadata.displayName}`,
    '',
    `> **When to use:** ${metadata.whenToUse.replaceAll(';', ',')}`,
    '',
    `**${methods.length} methods** in this category.`,
    '',
    '---',
    '',
  ];

  for (const method of methods) {
    lines.push(`## ${method.num}. ${method.name}`, '', method.description, '', `**Pattern:** \`${method.pattern}\``, '');
  }

  lines.push('---', '', `*Category: ${category} | Generated during BMAD installation*`);

  return lines.join('\n');
}

/**
 * Generate index file listing all categories
 */
async function generateIndexFile(outputDir, byCategory, categoryMetadata) {
  const lines = [
    '# Advanced Elicitation Categories',
    '',
    'Context-specific elicitation method files for BMAD workflows.',
    '',
    '## Available Categories',
    '',
    '| Category | Methods | When to Use |',
    '|----------|---------|-------------|',
  ];

  for (const [category, methods] of Object.entries(byCategory)) {
    const metadata = categoryMetadata[category];
    if (!metadata) continue;

    const whenToUse = metadata.whenToUse.replaceAll(';', ',');
    lines.push(`| [${metadata.icon} ${metadata.displayName}](./${metadata.fileName}) | ${methods.length} | ${whenToUse} |`);
  }

  lines.push(
    '',
    '## Usage',
    '',
    'Workflows reference `category-metadata.csv` to determine which category file to load.',
    'The workflow reads the metadata to match context with appropriate categories.',
    '',
    '*Generated during BMAD installation*',
  );

  await fs.writeFile(path.join(outputDir, '_index.md'), lines.join('\n'), 'utf-8');
}

module.exports = { generateElicitationCategories };
