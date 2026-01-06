const { AEMethodsGenerator } = require('./lib/ae-methods-generator');

async function run() {
  const projectRoot = process.cwd();
  const generator = new AEMethodsGenerator(projectRoot);

  console.log('Generating Advanced Elicitation method files...');
  console.log('Source: src/core/workflows/advanced-elicitation/data/methods.csv\n');

  const report = await generator.generate();

  console.log('\n✓ Generation complete!');
  console.log(`  Total methods: ${report.totalMethods}`);
  console.log(`  primary_verify.md: ${report.primaryVerifyCount} methods`);
  console.log(`  primary_discover.md: ${report.primaryDiscoverCount} methods`);
  console.log(`  ae_by_categories/: ${report.categoryCount} category files`);
  console.log(`  ae_by_roles/: ${report.roleCount} role files`);
  if (report.customListCount > 0) {
    console.log(`  ae_user_lists.md: ${report.customListCount} custom lists`);
  }

  if (report.warnings.length > 0) {
    console.log('\nWarnings:');
    for (const warning of report.warnings) {
      console.log(`  - ${warning}`);
    }
  }

  console.log('\n✨ Files generated successfully!');
}

run().catch(console.error);
