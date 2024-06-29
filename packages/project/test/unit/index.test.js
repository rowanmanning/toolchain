'use strict';

const assert = require('node:assert/strict');
const td = require('testdouble');

describe('@rmtc/project', () => {
	let fs;
	let path;
	let Project;
	let projectProperties;

	before(() => {
		td.reset();

		fs = td.replace('node:fs/promises');
		path = td.replace('node:path');

		Project = require('../..').Project;
		projectProperties = Object.entries(Object.getOwnPropertyDescriptors(Project.prototype))
			.filter(([key, { get }]) => key !== 'directoryPath' && get)
			.map(([key]) => key);
	});

	describe('.Project', () => {
		it('is a class constructor', () => {
			assert.equal(typeof Project, 'function');
			assert.equal(typeof Project.prototype.constructor, 'function');
		});

		describe('new Project(options)', () => {
			let mockOptions;
			let project;

			before(() => {
				mockOptions = {
					directoryPath: 'mock-directory'
				};
				td.when(path.basename('mock-directory')).thenReturn('mock-basename');
				project = new Project(mockOptions);
			});

			describe('.directoryPath', () => {
				it('is the directory path passed into the constructor', () => {
					assert.equal(project.directoryPath, 'mock-directory');
				});

				it('is read-only', () => {
					assert.throws(() => {
						project.directoryPath = 'nope';
					}, /cannot set property directoryPath/i);
				});
			});

			describe('.name', () => {
				it('is set to the last part of the directory path', () => {
					assert.equal(project.name, 'mock-basename');
				});

				it('is read-only', () => {
					assert.throws(() => {
						project.name = 'nope';
					}, /cannot set property name/i);
				});
			});

			describe('.isPrivate', () => {
				it('is set to `null`', () => {
					assert.equal(project.isPrivate, null);
				});

				it('is read-only', () => {
					assert.throws(() => {
						project.isPrivate = 'nope';
					}, /cannot set property isPrivate/i);
				});
			});

			describe('.isMonorepo', () => {
				it('is set to `null`', () => {
					assert.equal(project.isMonorepo, null);
				});

				it('is read-only', () => {
					assert.throws(() => {
						project.isMonorepo = 'nope';
					}, /cannot set property isMonorepo/i);
				});
			});

			describe('.init()', () => {
				let returnValue;

				before(async () => {
					td.when(path.join('mock-directory', 'package.json')).thenReturn('mock-package');
					td.when(fs.readFile('mock-package', 'utf-8')).thenResolve(
						JSON.stringify({
							name: 'mock-package-name',
							private: true,
							workspaces: ['mock-workspace']
						})
					);
					returnValue = await project.init();
				});

				it('loads the package.json file from the project directory', () => {
					td.verify(fs.readFile('mock-package', 'utf-8'), { times: 1 });
				});

				it('resolves with the project instance', () => {
					assert.equal(returnValue, project);
				});

				describe('.name', () => {
					it('is set to the name property of the package.json file', () => {
						assert.equal(project.name, 'mock-package-name');
					});
				});

				describe('.isPrivate', () => {
					it('is set to the private property of the package.json file', () => {
						assert.equal(project.isPrivate, true);
					});
				});

				describe('.isMonorepo', () => {
					it('is set to `true` if the workspaces property of package.json is a non-empty array', () => {
						assert.equal(project.isMonorepo, true);
					});
				});

				describe('when package.json fails to load', () => {
					before(async () => {
						td.when(fs.readFile('mock-package', 'utf-8')).thenReject(new Error('mock'));
						project = new Project(mockOptions);
						await project.init();
					});

					it('does not set the class properties', () => {
						const newProject = new Project(mockOptions);
						for (const property of projectProperties) {
							assert.equal(project[property], newProject[property]);
						}
					});
				});

				describe('when package.json is invalid JSON', () => {
					before(async () => {
						td.when(fs.readFile('mock-package', 'utf-8')).thenResolve('invalid-json');
						project = new Project(mockOptions);
						await project.init();
					});

					it('does not set the class properties', () => {
						const newProject = new Project(mockOptions);
						for (const property of projectProperties) {
							assert.equal(project[property], newProject[property]);
						}
					});
				});

				describe('when package.json does not contain an object', () => {
					before(async () => {
						td.when(fs.readFile('mock-package', 'utf-8')).thenResolve('[]');
						project = new Project(mockOptions);
						await project.init();
					});

					it('does not set the class properties', () => {
						const newProject = new Project(mockOptions);
						for (const property of projectProperties) {
							assert.equal(project[property], newProject[property]);
						}
					});
				});

				describe('when the package.json name property is a non-string', () => {
					before(async () => {
						td.when(fs.readFile('mock-package', 'utf-8')).thenResolve(
							JSON.stringify({
								name: 123,
								private: true,
								workspaces: ['mock-workspace']
							})
						);
						project = new Project(mockOptions);
						await project.init();
					});

					describe('.name', () => {
						it('is set to the last part of the directory path', () => {
							assert.equal(project.name, 'mock-basename');
						});
					});
				});

				describe('when the package.json private property is a non-boolean', () => {
					before(async () => {
						td.when(fs.readFile('mock-package', 'utf-8')).thenResolve(
							JSON.stringify({
								name: 'mock-package-name',
								private: 'yes',
								workspaces: ['mock-workspace']
							})
						);
						project = new Project(mockOptions);
						await project.init();
					});

					describe('.isPrivate', () => {
						it('is the value of the property cast to a boolean', () => {
							assert.equal(project.isPrivate, true);
						});
					});
				});

				describe('when the package.json workspaces property is an empty array', () => {
					before(async () => {
						td.when(fs.readFile('mock-package', 'utf-8')).thenResolve(
							JSON.stringify({
								name: 'mock-package-name',
								private: true,
								workspaces: []
							})
						);
						project = new Project(mockOptions);
						await project.init();
					});

					describe('.isMonorepo', () => {
						it('is set to `false`', () => {
							assert.equal(project.isMonorepo, false);
						});
					});
				});

				describe('when the package.json workspaces property is a non-array', () => {
					before(async () => {
						td.when(fs.readFile('mock-package', 'utf-8')).thenResolve(
							JSON.stringify({
								name: 'mock-package-name',
								private: true,
								workspaces: 'hello'
							})
						);
						project = new Project(mockOptions);
						await project.init();
					});

					describe('.isMonorepo', () => {
						it('is set to `false`', () => {
							assert.equal(project.isMonorepo, false);
						});
					});
				});
			});
		});
	});

	describe('.fromDirectory(directoryPath)', () => {
		let project;

		before(async () => {
			Project.prototype.init = td.func();
			td.when(Project.prototype.init()).thenResolve('mock-project');
			project = await Project.fromDirectory('mock-directory');
		});

		it('initialises a project', () => {
			td.verify(Project.prototype.init(), { times: 1 });
		});

		it('returns a project instance', () => {
			assert.equal(project, 'mock-project');
		});
	});
});
