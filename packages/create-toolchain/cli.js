#!/usr/bin/env node
'use strict';

const {runCommand} = require('.');

runCommand({
	directoryPath: process.cwd(),
	process
});
