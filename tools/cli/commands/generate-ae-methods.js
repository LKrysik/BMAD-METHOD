/**
 * CLI Command: generate-ae-methods
 *
 * Generates Advanced Elicitation method files from methods.csv
 */

const chalk = require('chalk');
const { AEMethodsGenerator } = require('../lib/ae-methods-generator');
const { getProjectRoot } = require('../lib/project-root');

module.exports = {
  command: 'generate-ae-methods',
  description: 'Generate Advanced Elicitation method files from methods.csv',
  options: [['-v, --verbose', 'Show detailed output']],
  action: async (options) => {
    try {
      const projectRoot = getProjectRoot();
      const generator = new AEMethodsGenerator(projectRoot);

      console.log(chalk.cyan('Generating Advanced Elicitation method files...'));
      console.log(chalk.dim(`Source: src/core/workflows/advanced-elicitation/methods.csv\n`));

      const report = await generator.generate();

      console.log(chalk.green('\n✓ Generation complete!'));
      console.log(chalk.dim(`  Total methods: ${report.totalMethods}`));
      console.log(chalk.dim(`  primary_verify.md: ${report.primaryVerifyCount} methods`));
      console.log(chalk.dim(`  primary_discover.md: ${report.primaryDiscoverCount} methods`));
      console.log(chalk.dim(`  ae_by_categories/: ${report.categoryCount} category files`));

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
      }

      console.log(chalk.green('\n✨ Files generated successfully!'));
      console.log(chalk.dim('Output: src/core/workflows/advanced-elicitation/'));

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
