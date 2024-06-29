'use strict';

const path = require('node:path');
const { readFile } = require('node:fs/promises');

class Project {
	/** @type {string} */
	#directoryPath;

	/**
	 * @type {string}
	 */
	get directoryPath() {
		return this.#directoryPath;
	}

	/** @type {boolean | null} */
	#isMonorepo = null;

	/** @type {boolean | null} */
	get isMonorepo() {
		return this.#isMonorepo;
	}

	/** @type {boolean | null} */
	#isPrivate = null;

	/** @type {boolean | null} */
	get isPrivate() {
		return this.#isPrivate;
	}

	/** @type {string} */
	#name;

	/** @type {string} */
	get name() {
		return this.#name;
	}

	/**
	 * @param {object} options
	 * @param {string} options.directoryPath
	 */
	constructor({ directoryPath }) {
		this.#directoryPath = directoryPath;
		this.#name = path.basename(directoryPath);
	}

	/**
	 * @returns {Promise<Project>}
	 */
	async init() {
		// Load the package.json file. We don't care if this fails, we'll
		// just log and use default values in this case.
		let packageJson;
		try {
			packageJson = JSON.parse(
				await readFile(path.join(this.#directoryPath, 'package.json'), 'utf-8')
			);
		} catch (_error) {
			return this;
		}

		// If the package.json file is not an object, we don't want it
		if (typeof packageJson !== 'object' || Array.isArray(packageJson) || packageJson === null) {
			return this;
		}

		if (typeof packageJson.name === 'string') {
			this.#name = packageJson?.name;
		}

		this.#isPrivate = Boolean(packageJson?.private);
		this.#isMonorepo =
			Array.isArray(packageJson.workspaces) && Boolean(packageJson?.workspaces?.length > 0);

		return this;
	}

	/**
	 * @param {string} directoryPath
	 * @returns {Promise<Project>}
	 */
	static fromDirectory(directoryPath) {
		const project = new Project({ directoryPath });
		return project.init();
	}
}

exports.Project = Project;
