#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { spawn } from 'child_process'

const scaffoldPath = 'https://github.com/AppletsGroup/career.git'; // Replace with your Github repo URL

const program = new Command();
program.version('1.0.0');

function createProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);

  fs.mkdirSync(projectPath);

  console.log(`Creating new project '${projectName}'...`);

  const git = spawn('git', ['clone', scaffoldPath, projectPath]);

  git.on('close', (code) => {

    // Remove the .git folder from the new project directory
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true, force: true });

    console.log(`Finished creating new project '${projectName}'.`);
  });
}

program
  .command('init [projectName]')
  .description('Initialize a new project from the scaffold generator.')
  .action((projectName) => {
    if (!projectName || projectName.length === 0) {
      // Prompt the user for a project name
      inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is the name of your new project?'
        }
      ]).then((answers) => {
        createProject(answers.projectName);
      });
    } else {
      createProject(projectName);
    }
  });

program.parse(process.argv);
