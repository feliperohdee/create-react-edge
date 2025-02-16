#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';

const execAsync = promisify(exec);

const createProject = async () => {
	console.log(chalk.blue('\n📦 Create React Edge\n'));

	// Get project name
	const response = await prompts({
		type: 'text',
		name: 'projectName',
		message: 'What is your project name?',
		initial: 'my-react-edge-app'
	});

	const projectName = response.projectName;
	const REPO_URL = 'https://github.com/feliperohdee/react-edge-demo';

	const spinner = ora('Creating your React Edge project...').start();

	try {
		// Clone the repository
		spinner.text = 'Cloning repository...';
		await execAsync(`git clone ${REPO_URL} ${projectName}`);

		// Change to project directory
		process.chdir(projectName);

		// Remove existing git history
		spinner.text = 'Cleaning up...';
		await execAsync('rm -rf .git');

		// Initialize new git repository
		spinner.text = 'Initializing new git repository...';
		await execAsync('git init');

		// Install dependencies
		spinner.text = 'Installing dependencies...';
		await execAsync('npm install');

		spinner.succeed(chalk.green('✨ React Edge project created successfully!'));

		// Show next steps
		console.log('\n' + chalk.cyan('Next steps:'));
		console.log(chalk.white(`1. cd ${projectName}`));
		console.log(chalk.white('2. npm run dev\n'));
	} catch (error) {
		spinner.fail(chalk.red('Error creating project:'));
		console.error(chalk.red(error.message));
		process.exit(1);
	}
};

createProject().catch(err => {
	console.error('Error:', err);
	process.exit(1);
});
