#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import fs from 'fs/promises';
import ora from 'ora';
import prompts from 'prompts';

const execAsync = promisify(exec);

const getPackageManager = () => {
	const userAgent = process.env.npm_config_user_agent;

	if (userAgent) {
		if (userAgent.startsWith('yarn')) {
			return 'yarn';
		}
	}

	return 'npm';
};

const updateScripts = (packageJson, packageManager) => {
	const edgeCommand = packageManager === 'yarn' ? 'yarn edge' : 'npx edge';

	return {
		...packageJson,
		scripts: {
			...packageJson.scripts,
			build: `${edgeCommand} build`,
			component: 'npx shadcn@latest add',
			deploy: `${edgeCommand} deploy`,
			dev: `rm -rf ./node_modules/.vite && ${edgeCommand} dev`,
			lint: `${edgeCommand} lint`,
			logs: `${edgeCommand} logs`,
			test: `${edgeCommand} test`,
			'type-check': `${edgeCommand} type-check`
		}
	};
};

const updateProjectFiles = async projectName => {
	// Update wrangler.toml
	const wranglerPath = './wrangler.jsonc';
	const wranglerContent = await fs.readFile(wranglerPath, 'utf8');
	const updatedWranglerContent = JSON.parse(wranglerContent);
	updatedWranglerContent.name = projectName;

	await fs.writeFile(wranglerPath, JSON.stringify(updatedWranglerContent, null, 2));

	// Update package.json
	const packagePath = './package.json';
	const packageContent = await fs.readFile(packagePath, 'utf8');
	const packageJson = JSON.parse(packageContent);

	// Get package manager and update scripts accordingly
	const packageManager = getPackageManager();
	const updatedPackageJson = updateScripts(packageJson, packageManager);
	updatedPackageJson.name = projectName;

	await fs.writeFile(packagePath, JSON.stringify(updatedPackageJson, null, 2));
};

const createProject = async () => {
	console.log(chalk.bold.white('\n🚀 Create React Edge\n'));

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

		// Update project files
		spinner.text = 'Updating project files...';
		await updateProjectFiles(projectName);

		// Remove existing git history
		spinner.text = 'Cleaning up...';
		await execAsync('rm -rf .git');

		// Initialize new git repository
		spinner.text = 'Initializing new git repository...';
		await execAsync('git init');

		spinner.succeed(chalk.green('✨ React Edge project created successfully!'));

		const packageManager = getPackageManager();

		// Show next steps
		console.log('\n' + chalk.cyan('Next steps:'));
		console.log(chalk.white(`1. cd ${projectName}`));
		console.log(chalk.white(`2. ${packageManager} install`));
		console.log(chalk.white(`3. ${packageManager === 'yarn' ? 'yarn dev' : 'npm run dev'}\n`));
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
