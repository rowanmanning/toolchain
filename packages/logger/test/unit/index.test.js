'use strict';

const assert = require('node:assert/strict');
const td = require('testdouble');

describe('@rmtc/logger', () => {
	let Logger;
	let process;

	before(() => {
		td.reset();

		process = td.replace('node:process', {
			env: {
				LOG_LEVEL: 'debug'
			},
			stdout: {}
		});

		Logger = require('../..').Logger;
	});

	beforeEach(() => {
		process.stdout.write = td.func();
	});

	describe('.Logger', () => {
		it('is a class constructor', () => {
			assert.equal(typeof Logger, 'function');
			assert.equal(typeof Logger.prototype.constructor, 'function');
		});

		describe('new Logger()', () => {
			let logger;

			before(() => {
				logger = new Logger();
			});

			describe('.logLevel', () => {
				it('contains the level set in the LOG_LEVEL environment variable', () => {
					assert.equal(logger.logLevel, 'debug');
				});

				it('is read-only', () => {
					assert.throws(() => {
						logger.logLevel = 'nope';
					}, /cannot set property logLevel/i);
				});
			});

			describe('.prefix', () => {
				it('contains an empty string', () => {
					assert.equal(logger.prefix, '');
				});

				it('is read-only', () => {
					assert.throws(() => {
						logger.prefix = 'nope';
					}, /cannot set property prefix/i);
				});
			});

			describe('.child()', () => {
				it('returns a new logger', () => {
					const child = logger.child();
					assert.ok(child instanceof Logger);
				});
			});

			describe('.child(options)', () => {
				describe('when options.prefix is defined', () => {
					it('returns a new logger with the configured prefix', () => {
						const child = logger.child({ prefix: 'mock-child-prefix' });
						assert.equal(child.prefix, 'mock-child-prefix');
					});
				});
			});

			describe('.error(message)', () => {
				it('writes the message to stdout', () => {
					logger.error('mock error message');
					td.verify(process.stdout.write('mock error message\n'), { times: 1 });
				});
			});

			describe('.error(error)', () => {
				it('writes the stringified error to stdout', () => {
					logger.error(new Error('mock error'));
					td.verify(
						process.stdout.write('An error occurred:\n' + '  └─ Error: mock error\n'),
						{ times: 1 }
					);
				});

				describe('when the error has a cause', () => {
					it('writes the stringified error and cause to stdout', () => {
						logger.error(new Error('mock error', { cause: new Error('mock cause') }));
						td.verify(
							process.stdout.write(
								'An error occurred:\n' +
									'  └─ Error: mock error\n' +
									'    └─ Error: mock cause\n'
							),
							{ times: 1 }
						);
					});
				});
			});

			describe('.warn(message)', () => {
				it('writes the message to stdout', () => {
					logger.warn('mock warn message');
					td.verify(process.stdout.write('mock warn message\n'), { times: 1 });
				});
			});

			describe('.info(message)', () => {
				it('writes the message to stdout', () => {
					logger.info('mock info message');
					td.verify(process.stdout.write('mock info message\n'), { times: 1 });
				});
			});

			describe('.debug(message)', () => {
				it('writes the message to stdout', () => {
					logger.debug('mock debug message');
					td.verify(process.stdout.write('mock debug message\n'), { times: 1 });
				});
			});
		});

		describe('new Logger(options)', () => {
			let logger;

			describe('when options.prefix is defined', () => {
				before(() => {
					logger = new Logger({
						prefix: 'mock-prefix'
					});
				});

				describe('.prefix', () => {
					it('contains the configured prefix', () => {
						assert.equal(logger.prefix, 'mock-prefix');
					});
				});

				describe('.child()', () => {
					it('returns a new logger with the same prefix as the parent', () => {
						const child = logger.child();
						assert.ok(child instanceof Logger);
						assert.equal(child.prefix, 'mock-prefix');
					});
				});

				describe('.child(options)', () => {
					describe('when options.prefix is defined', () => {
						it('returns a new logger with the configured prefix appended', () => {
							const child = logger.child({ prefix: 'mock-child-prefix' });
							assert.equal(child.prefix, 'mock-prefix mock-child-prefix');
						});
					});
				});

				describe('.error(message)', () => {
					it('writes the message to stdout with a prefix', () => {
						logger.error('mock error message');
						td.verify(process.stdout.write('mock-prefix mock error message\n'), {
							times: 1
						});
					});
				});

				describe('.error(error)', () => {
					it('writes the stringified error to stdout with a prefix', () => {
						logger.error(new Error('mock error'));
						td.verify(
							process.stdout.write(
								'mock-prefix An error occurred:\n' + '  └─ Error: mock error\n'
							),
							{ times: 1 }
						);
					});

					describe('when the error has a cause', () => {
						it('writes the stringified error and cause to stdout with a prefix', () => {
							logger.error(
								new Error('mock error', { cause: new Error('mock cause') })
							);
							td.verify(
								process.stdout.write(
									'mock-prefix An error occurred:\n' +
										'  └─ Error: mock error\n' +
										'    └─ Error: mock cause\n'
								),
								{ times: 1 }
							);
						});
					});
				});

				describe('.warn(message)', () => {
					it('writes the message to stdout with a prefix', () => {
						logger.warn('mock warn message');
						td.verify(process.stdout.write('mock-prefix mock warn message\n'), {
							times: 1
						});
					});
				});

				describe('.info(message)', () => {
					it('writes the message to stdout with a prefix', () => {
						logger.info('mock info message');
						td.verify(process.stdout.write('mock-prefix mock info message\n'), {
							times: 1
						});
					});
				});

				describe('.debug(message)', () => {
					it('writes the message to stdout with a prefix', () => {
						logger.debug('mock debug message');
						td.verify(process.stdout.write('mock-prefix mock debug message\n'), {
							times: 1
						});
					});
				});
			});

			describe('when options.logLevel is defined as a string', () => {
				before(() => {
					logger = new Logger({
						logLevel: 'warn'
					});
				});

				describe('.logLevel', () => {
					it('contains the level set in the options', () => {
						assert.equal(logger.logLevel, 'warn');
					});
				});

				describe('.child()', () => {
					it('returns a new logger with the same log level as the parent', () => {
						const child = logger.child();
						assert.equal(child.logLevel, 'warn');
					});
				});

				describe('.warn(message)', () => {
					it('does not write to stdout if the log level is higher than "warn"', () => {
						logger = new Logger({ logLevel: 'error' });
						logger.warn('mock warn message');
						td.verify(process.stdout.write(td.matchers.anything()), { times: 0 });
					});
				});

				describe('.info(message)', () => {
					it('does not write to stdout if the log level is higher than "info"', () => {
						logger = new Logger({ logLevel: 'warn' });
						logger.info('mock info message');
						td.verify(process.stdout.write(td.matchers.anything()), { times: 0 });
					});
				});

				describe('.debug(message)', () => {
					it('does not write to stdout if the log level is higher than "debug"', () => {
						logger = new Logger({ logLevel: 'info' });
						logger.debug('mock debug message');
						td.verify(process.stdout.write(td.matchers.anything()), { times: 0 });
					});
				});
			});

			describe('when options.logLevel is defined as a number', () => {
				before(() => {
					logger = new Logger({
						logLevel: 1
					});
				});

				describe('.logLevel', () => {
					it('contains the corresponding level set in the options', () => {
						assert.equal(logger.logLevel, 'warn');
					});
				});
			});

			describe('when options.logLevel is an unknown string', () => {
				before(() => {
					logger = new Logger({
						logLevel: 'nope'
					});
				});

				describe('.logLevel', () => {
					it('contains a default level of "info"', () => {
						assert.equal(logger.logLevel, 'info');
					});
				});
			});

			describe('when options.logLevel is not a number or string', () => {
				before(() => {
					logger = new Logger({
						logLevel: null
					});
				});

				describe('.logLevel', () => {
					it('contains a default level of "info"', () => {
						assert.equal(logger.logLevel, 'info');
					});
				});
			});
		});
	});
});
