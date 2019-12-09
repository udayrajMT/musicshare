import { Logger } from "../utils/Logger"

test('log on console', () => {
	const nativeConsoleLog = console.log;
	const target = jest.fn();
	(console as any).log = target;
	const logger = Logger('TestNamespace', true);
	const message = 42

	logger.log(message);

	(console as any).log = nativeConsoleLog;

	expect(target).toBeCalledWith(`[TestNamespace]: 42`)
})

test('log scalar', () => {
	const target = jest.fn()
	const logger = Logger('TestNamespace', true)
	const message = 42

	logger.log(message, target)

	expect(target).toBeCalledWith(`[TestNamespace]: 42`)
})

test('log object', () => {
	const target = jest.fn()
	const logger = Logger('TestNamespace', true)
	const message = { a: 42, b: { c: { d: 'hello world' } } }

	logger.log(message, target)

	expect(target).toBeCalledWith(`[TestNamespace]: ${message}`)
})

test('log custom toString', () => {
	const target = jest.fn()
	const logger = Logger('TestNamespace', true)
	const message = {
		toString: () => 'This was generated by a custom toString method'
	}

	logger.log(message, target)

	expect(target).toBeCalledWith(`[TestNamespace]: This was generated by a custom toString method`)
})