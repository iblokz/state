import {expect} from 'chai';
import {JSDOM} from 'jsdom';

// Setup DOM environment for tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
	url: 'http://localhost',
});
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;

import {dispatch, collect, init} from '../lib/core.js';

describe('core', () => {
	describe('dispatch', () => {
		it('should dispatch a state change event', (done) => {
			const change = (state) => ({...state, count: 1});

			document.addEventListener('state.changes', (ev) => {
				expect(ev.detail).to.equal(change);
				done();
			}, {once: true});

			dispatch(change);
		});

		it('should support custom namespace', (done) => {
			const change = (state) => ({...state, test: true});

			document.addEventListener('custom.namespace', (ev) => {
				expect(ev.detail).to.equal(change);
				done();
			}, {once: true});

			dispatch(change, 'custom.namespace');
		});
	});

	describe('collect', () => {
		it('should collect state change events', (done) => {
			const changes$ = collect('test.collect.1');
			const change = (state) => ({...state, count: 1});

			changes$.subscribe((receivedChange) => {
				expect(receivedChange).to.equal(change);
				done();
			});

			dispatch(change, 'test.collect.1');
		});

		it('should collect from custom namespace', (done) => {
			const changes$ = collect('test.collect.2');
			const change = (state) => ({...state, test: true});

			changes$.subscribe((receivedChange) => {
				expect(receivedChange).to.equal(change);
				done();
			});

			dispatch(change, 'test.collect.2');
		});
	});

	describe('init', () => {
		it('should initialize state with initial value', (done) => {
			const state$ = init({count: 0}, 'test.init.1');

			state$.subscribe((state) => {
				expect(state).to.deep.equal({count: 0});
				done();
			});
		});

		it('should apply state changes via dispatch', (done) => {
			const state$ = init({count: 0}, 'test.init.2');
			let firstEmit = true;

			state$.subscribe((state) => {
				if (firstEmit) {
					firstEmit = false;
					expect(state.count).to.equal(0);
					// Dispatch after receiving initial state
					setTimeout(() => {
						dispatch((s) => ({...s, count: s.count + 1}), 'test.init.2');
					}, 10);
				} else {
					expect(state.count).to.equal(1);
					done();
				}
			});
		});

		it('should handle multiple state changes', (done) => {
			const state$ = init({count: 0, items: []}, 'test.init.3');
			const states = [];

			state$.subscribe((state) => {
				states.push(state);
				if (states.length === 3) {
					expect(states[0]).to.deep.equal({count: 0, items: []});
					expect(states[1]).to.deep.equal({count: 1, items: []});
					expect(states[2]).to.deep.equal({count: 1, items: [1, 2]});
					done();
				}
			});

			setTimeout(() => {
				dispatch((state) => ({...state, count: state.count + 1}), 'test.init.3');
				setTimeout(() => {
					dispatch((state) => ({...state, items: [1, 2]}), 'test.init.3');
				}, 10);
			}, 10);
		});

		it('should support custom namespace', (done) => {
			const state$ = init({test: true}, 'test.init.4');
			let firstEmit = true;

			state$.subscribe((state) => {
				if (firstEmit) {
					firstEmit = false;
					expect(state.test).to.equal(true);
					setTimeout(() => {
						dispatch((s) => ({...s, test: false}), 'test.init.4');
					}, 10);
				} else {
					expect(state.test).to.equal(false);
					done();
				}
			});
		});
	});

	describe('init with storage', () => {
		beforeEach(() => {
			// Clear storage before each test
			localStorage.clear();
			sessionStorage.clear();
		});

		it('should persist to localStorage', (done) => {
			const state$ = init({count: 0}, 'test.storage.1', localStorage);

			state$.subscribe((state) => {
				if (state.count === 1) {
					// Check localStorage has the value
					const stored = JSON.parse(localStorage.getItem('test.storage.1'));
					expect(stored.count).to.equal(1);
					done();
				}
			});

			setTimeout(() => {
				dispatch((s) => ({...s, count: 1}), 'test.storage.1');
			}, 10);
		});

		it('should recover from localStorage', () => {
			// Pre-populate localStorage
			localStorage.setItem('test.storage.2', JSON.stringify({count: 42}));

			const state$ = init({count: 0}, 'test.storage.2', localStorage);

			// Should load from storage, not use initial
			expect(state$.getValue().count).to.equal(42);
		});

		it('should persist to sessionStorage', (done) => {
			const state$ = init({count: 0}, 'test.storage.3', sessionStorage);

			state$.subscribe((state) => {
				if (state.count === 1) {
					const stored = JSON.parse(sessionStorage.getItem('test.storage.3'));
					expect(stored.count).to.equal(1);
					done();
				}
			});

			setTimeout(() => {
				dispatch((s) => ({...s, count: 1}), 'test.storage.3');
			}, 10);
		});

		it('should work without storage (memory only)', (done) => {
			const state$ = init({count: 0}, 'test.storage.4');

			state$.subscribe((state) => {
				if (state.count === 1) {
					// Storage should remain empty
					expect(localStorage.getItem('test.storage.4')).to.be.null;
					expect(sessionStorage.getItem('test.storage.4')).to.be.null;
					done();
				}
			});

			setTimeout(() => {
				dispatch((s) => ({...s, count: 1}), 'test.storage.4');
			}, 10);
		});
	});
});

