/**
 * CLI Command: generate-ae-methods
 *
 * Generates Advanced Elicitation method files from methods.csv + ae_mapping.yaml
 */

const chalk = require('chalk');
const { AEMethodsGenerator } = require('../lib/ae-methods-generator');
const { getProjectRoot } = require('../lib/project-root');

module.exports = {
  command: 'generate-ae-methods',
  description: 'Generate Advanced Elicitation method files from methods.csv + ae_mapping.yaml',
  options: [
    ['-v, --verbose', 'Show detailed output'],
    ['-c, --check', 'Check if generated files are up-to-date (no generation)'],
  ],
  action: async (options) => {
    try {
      const projectRoot = getProjectRoot();

      // Check-only mode
      if (options.check) {
        console.log(chalk.cyan('Checking if AE method files are up-to-date...\n'));

        const result = await AEMethodsGenerator.checkFreshness(projectRoot);

        if (result.fresh) {
          console.log(chalk.green('✓ Generated files are up-to-date'));
          console.log(chalk.dim(`  Source hash: ${result.currentHash}`));
          process.exit(0);
        } else {
          console.log(chalk.yellow('⚠ Generated files are STALE'));
          console.log(chalk.dim(`  Reason: ${result.reason}`));
          if (result.currentHash && result.generatedHash) {
            console.log(chalk.dim(`  Source hash:    ${result.currentHash}`));
            console.log(chalk.dim(`  Generated hash: ${result.generatedHash}`));
          }
          console.log(chalk.yellow('\n  Run: npm run bmad:generate-ae-methods'));
          process.exit(1);
        }
      }

      // Normal generation mode
      const generator = new AEMethodsGenerator(projectRoot);

      console.log(chalk.cyan('Generating Advanced Elicitation method files...'));
      console.log(chalk.dim(`Source: src/core/workflows/advanced-elicitation/data/methods.csv`));
      console.log(chalk.dim(`Mapping: src/core/workflows/advanced-elicitation/data/ae-mapping.yaml\n`));

      const report = await generator.generate();

      console.log(chalk.green('\n✓ Generation complete!'));
      console.log(chalk.dim(`  Total methods: ${report.totalMethods}`));
      console.log(chalk.dim(`  primary_verify.md: ${report.primaryVerifyCount} methods`));
      console.log(chalk.dim(`  primary_discover.md: ${report.primaryDiscoverCount} methods`));
      console.log(chalk.dim(`  ae_by_categories/: ${report.categoryCount} category files`));
      console.log(chalk.dim(`  ae_by_roles/: ${report.roleCount} role files`));
      if (report.customListCount > 0) {
        console.log(chalk.dim(`  ae_user_lists.md: ${report.customListCount} custom list(s)`));
      }
      console.log(chalk.dim(`  Source hash: ${report.sourceHash}`));

      if (report.warnings.length > 0) {
        console.log(chalk.yellow('\nWarnings:'));
        for (const warning of report.warnings) {
          console.log(chalk.yellow(`  - ${warning}`));
        }
      }

      if (options.verbose) {
        console.log(chalk.dim('\nCategories generated:'));
        for (const category of report.categories) {
          console.log(chalk.dim(`  - ${category}.md`));
        }
        console.log(chalk.dim('\nRoles generated:'));
        for (const role of report.roles) {
          console.log(chalk.dim(`  - ${role}.md`));
        }
      }

      console.log(chalk.green('\n✨ Files generated successfully!'));
      console.log(chalk.dim('Output: src/core/workflows/advanced-elicitation/data/'));

      process.exit(0);
    } catch (error) {
      console.error(chalk.red('\n✗ Generation failed:'), error.message);
      if (options.verbose) {
        console.error(chalk.dim(error.stack));
      }
      process.exit(1);
    }
  },
};
