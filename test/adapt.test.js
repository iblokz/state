import {expect} from 'chai';
import {JSDOM} from 'jsdom';

// Setup DOM environment for tests
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
	url: 'http://localhost',
});
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;

import {adapt, createState} from '../lib/adapt.js';
import {collect} from '../lib/core.js';

describe('adapt', () => {
	describe('adapt()', () => {
		it('should extract initial state from tree', () => {
			const actions = {
				initial: {count: 0},
				increment: () => (state) => ({...state, count: state.count + 1}),
			};

			const adapted = adapt(actions, 'test.adapt.1');

			expect(adapted.initial).to.deep.equal({count: 0});
		});

		it('should extract nested initial state', () => {
			const actions = {
				initial: {top: 1},
				nested: {
					initial: {value: 0},
					setValue: (val) => (state) => ({...state, nested: {value: val}}),
				},
			};

			const adapted = adapt(actions, 'test.adapt.2');

			expect(adapted.initial).to.deep.equal({
				top: 1,
				nested: {value: 0},
			});
		});

		it('should auto-dispatch on method call', (done) => {
			const actions = {
				initial: {count: 0},
				increment: () => (state) => ({...state, count: state.count + 1}),
			};

			const adapted = adapt(actions, 'test.adapt.3');

			collect('test.adapt.3').subscribe((change) => {
				const newState = change({count: 0});
				expect(newState.count).to.equal(1);
				done();
			});

			adapted.increment();
		});

		it('should emit metadata to stream', (done) => {
			const actions = {
				initial: {count: 0},
				add: (n) => (state) => ({...state, count: state.count + n}),
			};

			const adapted = adapt(actions, 'test.adapt.4');

			adapted.stream.subscribe((event) => {
				expect(event.path).to.deep.equal(['add']);
				expect(event.payload).to.deep.equal([5]);
				expect(event.reducer).to.be.a('function');
				done();
			});

			adapted.add(5);
		});

		it('should handle nested action calls', (done) => {
			const actions = {
				initial: {top: 0},
				nested: {
					initial: {value: 0},
					setValue: (val) => (state) => ({
						...state,
						nested: {value: val},
					}),
				},
			};

			const adapted = adapt(actions, 'test.adapt.5');

			adapted.stream.subscribe((event) => {
				expect(event.path).to.deep.equal(['nested', 'setValue']);
				expect(event.payload).to.deep.equal([42]);
				done();
			});

			adapted.nested.setValue(42);
		});

		it('should handle async/promise actions', (done) => {
			const actions = {
				initial: {data: null},
				fetchData: () => Promise.resolve(
					(state) => ({...state, data: 'loaded'}),
				),
			};

			const adapted = adapt(actions, 'test.adapt.6');

			collect('test.adapt.6').subscribe((change) => {
				const newState = change({data: null});
				expect(newState.data).to.equal('loaded');
				done();
			});

			adapted.fetchData();
		});
	});

	describe('createState()', () => {
		it('should create adapted actions and state$', () => {
			const actions = {
				initial: {count: 0},
				increment: () => (state) => ({...state, count: state.count + 1}),
			};

			const {actions: acts, state$} = createState(actions, 'test.adapt.7');

			expect(acts.increment).to.be.a('function');
			expect(state$.getValue()).to.deep.equal({count: 0});
		});

		it('should update state on action call', (done) => {
			const actions = {
				initial: {count: 0},
				increment: () => (state) => ({...state, count: state.count + 1}),
			};

			const {actions: acts, state$} = createState(actions, 'test.adapt.8');

			state$.subscribe((state) => {
				if (state.count === 1) {
					done();
				}
			});

			setTimeout(() => {
				acts.increment();
			}, 10);
		});
	});
});

