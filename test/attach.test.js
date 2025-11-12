import {expect} from 'chai';
import {JSDOM} from 'jsdom';

// Setup DOM environment for tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
	url: 'http://localhost',
});
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;

import {adapt, attach} from '../lib/adapt.js';
import {collect} from '../lib/core.js';

describe('attach', () => {
	it('should attach a new branch to an adapted tree', () => {
		const base = {
			initial: {count: 0},
			increment: () => (state) => ({...state, count: state.count + 1}),
		};

		const actions = adapt(base, 'test.attach.1');

		const userModule = {
			initial: {name: 'Guest'},
			setName: (name) => (state) => ({
				...state,
				user: {name},
			}),
		};

		const extended = attach(actions, ['user'], userModule);

		expect(extended.initial).to.deep.equal({
			count: 0,
			user: {name: 'Guest'},
		});
		expect(extended.user.setName).to.be.a('function');
		expect(extended.increment).to.be.a('function');
	});

	it('should attach using dot notation path', () => {
		const base = {
			initial: {count: 0},
			increment: () => (state) => ({...state, count: state.count + 1}),
		};

		const actions = adapt(base, 'test.attach.2');

		const userModule = {
			initial: {name: 'Guest'},
			setName: (name) => (state) => ({
				...state,
				user: {name},
			}),
		};

		const extended = attach(actions, 'user', userModule);

		expect(extended.initial).to.deep.equal({
			count: 0,
			user: {name: 'Guest'},
		});
		expect(extended.user.setName).to.be.a('function');
	});

	it('should attach to nested path', () => {
		const base = {
			initial: {count: 0},
			increment: () => (state) => ({...state, count: state.count + 1}),
			data: {
				initial: {value: 0},
				setValue: (val) => (state) => ({
					...state,
					data: {value: val},
				}),
			},
		};

		const actions = adapt(base, 'test.attach.3');

		const metaModule = {
			initial: {timestamp: 0},
			setTimestamp: (ts) => (state) => ({
				...state,
				data: {
					...state.data,
					meta: {timestamp: ts},
				},
			}),
		};

		const extended = attach(actions, ['data', 'meta'], metaModule);

		expect(extended.initial).to.deep.equal({
			count: 0,
			data: {
				value: 0,
				meta: {timestamp: 0},
			},
		});
		expect(extended.data.meta.setTimestamp).to.be.a('function');
		expect(extended.data.setValue).to.be.a('function');
	});

	it('should share stream with attached modules', (done) => {
		const base = {
			initial: {count: 0},
			increment: () => (state) => ({...state, count: state.count + 1}),
		};

		const actions = adapt(base, 'test.attach.4');

		const userModule = {
			initial: {name: 'Guest'},
			setName: (name) => (state) => ({
				...state,
				user: {name},
			}),
		};

		const extended = attach(actions, ['user'], userModule);

		// Both base and attached should emit to same stream
		extended.stream.subscribe((event) => {
			if (event.path[0] === 'user') {
				expect(event.path).to.deep.equal(['user', 'setName']);
				expect(event.payload).to.deep.equal(['Alice']);
				done();
			}
		});

		extended.user.setName('Alice');
	});

	it('should dispatch from attached modules', (done) => {
		const base = {
			initial: {count: 0},
			increment: () => (state) => ({...state, count: state.count + 1}),
		};

		const actions = adapt(base, 'test.attach.5');

		const userModule = {
			initial: {name: 'Guest'},
			setName: (name) => (state) => ({
				...state,
				user: {name},
			}),
		};

		const extended = attach(actions, ['user'], userModule);

		// Listen via the action stream instead of collect
		let received = false;
		extended.stream.subscribe((event) => {
			if (event.path && event.path[0] === 'user' && event.path[1] === 'setName' && !received) {
				received = true;
				expect(event.payload).to.deep.equal(['Bob']);
				done();
			}
		});

		setTimeout(() => {
			extended.user.setName('Bob');
		}, 10);
	});

	it('should preserve original tree reference', () => {
		const base = {
			initial: {count: 0},
			increment: () => (state) => ({...state, count: state.count + 1}),
		};

		const actions = adapt(base, 'test.attach.6');
		const originalStream = actions.stream;

		const userModule = {
			initial: {name: 'Guest'},
			setName: (name) => (state) => ({
				...state,
				user: {name},
			}),
		};

		const extended = attach(actions, ['user'], userModule);

		expect(extended.stream).to.equal(originalStream);
	});

	it('should allow multiple attachments', () => {
		const base = {
			initial: {count: 0},
			increment: () => (state) => ({...state, count: state.count + 1}),
		};

		let actions = adapt(base, 'test.attach.7');

		const userModule = {
			initial: {name: 'Guest'},
			setName: (name) => (state) => ({
				...state,
				user: {name},
			}),
		};

		const settingsModule = {
			initial: {theme: 'light'},
			setTheme: (theme) => (state) => ({
				...state,
				settings: {theme},
			}),
		};

		actions = attach(actions, ['user'], userModule);
		actions = attach(actions, ['settings'], settingsModule);

		expect(actions.initial).to.deep.equal({
			count: 0,
			user: {name: 'Guest'},
			settings: {theme: 'light'},
		});
		expect(actions.user.setName).to.be.a('function');
		expect(actions.settings.setTheme).to.be.a('function');
	});
});

