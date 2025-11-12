/**
 * Action tree adapter - converts action trees to auto-dispatching APIs
 * @module adapt
 */

import {Subject} from 'rxjs';
import {obj} from 'iblokz-data';
import {dispatch, init as initCore} from './core.js';

/**
 * Check if value is a Promise
 * @private
 * @param {*} value - Value to check
 * @return {boolean} True if value is a Promise
 */
const isPromise = (value) => value && typeof value.then === 'function';

/**
 * Adapt an action tree to auto-dispatch on method calls
 * @memberof module:adapt
 * @param {Object} tree - Action tree with initial state and reducer functions
 * @param {string} [namespace='state.changes'] - Namespace for state changes
 * @param {Array} [path=[]] - Current path in tree (used internally)
 * @return {Object} Adapted tree with stream, initial, and auto-dispatching methods
 * @example
 * const actions = {
 *   initial: { count: 0 },
 *   increment: () => state => ({ ...state, count: state.count + 1 }),
 *   add: (n) => state => ({ ...state, count: state.count + n }),
 *   nested: {
 *     initial: { value: 0 },
 *     setValue: (val) => state => ({ ...state, nested: { value: val } })
 *   }
 * };
 *
 * const adapted = adapt(actions);
 * // adapted.initial = { count: 0, nested: { value: 0 } }
 * // adapted.stream - Subject that emits action metadata
 * // adapted.increment() - auto-dispatches
 * // adapted.nested.setValue(42) - auto-dispatches
 */
export const adapt = (tree, namespace = 'state.changes', path = []) => {
	// Create stream for this level (root creates Subject, children reuse parent's)
	const stream = path.length === 0 ? new Subject() : null;
	const rootStream = stream || tree._rootStream;

	const adapted = Object.keys(tree)
		.filter((key) => key !== 'initial' && key !== '_rootStream')
		.reduce((acc, key) => {
			const value = tree[key];

			// Handle functions - wrap to auto-dispatch
			if (typeof value === 'function') {
				acc[key] = function(...args) {
					// Call original function to get reducer
					const result = value(...args);

					// Handle async/Promise results
					const handleResult = (reducer) => {
						// Dispatch the reducer
						dispatch(reducer, namespace);

						// Emit metadata to stream
						rootStream && rootStream.next({
							path: [...path, key],
							payload: args,
							reducer,
						});
					};

					if (isPromise(result)) {
						result.then(handleResult);
					} else {
						handleResult(result);
					}
				};
			} else if (value && typeof value === 'object' && !Array.isArray(value)) {
				// Handle nested objects - recurse
				const nested = adapt(
					{...value, _rootStream: rootStream},
					namespace,
					[...path, key],
				);

				// Merge nested initial into parent
				if (nested.initial) {
					acc.initial = {
						...acc.initial,
						[key]: nested.initial,
					};
				}

				acc[key] = nested;
			} else {
				// Handle other values (primitives, arrays)
				acc[key] = value;
			}

			return acc;
		}, {
			initial: tree.initial || {},
			...(stream ? {stream} : {}),
		});

	return adapted;
};

/**
 * Attach a new action branch to an existing adapted tree
 * @memberof module:adapt
 * @param {Object} tree - Existing adapted action tree
 * @param {Array|string} path - Path where to attach (array or dot notation)
 * @param {Object} node - New action node to attach
 * @return {Object} New tree with attached node
 * @example
 * import {adapt, attach} from 'iblokz-state/lib/adapt';
 *
 * const actions = adapt({
 *   initial: { count: 0 },
 *   increment: () => state => ({ ...state, count: state.count + 1 })
 * });
 *
 * // Later, attach a new module
 * const withUser = attach(actions, ['user'], {
 *   initial: { name: 'Guest' },
 *   setName: (name) => state => ({ ...state, user: { name } })
 * });
 *
 * // Or using dot notation
 * const withUser2 = attach(actions, 'user', {...});
 */
export const attach = (tree, path, node) => {
	// Normalize path to array
	const pathArray = typeof path === 'string' ? path.split('.') : path;

	// Get namespace from tree if available
	const namespace = tree._namespace || 'state.changes';

	// Adapt the new node with the tree's root stream
	const adaptedNode = adapt(
		{...node, _rootStream: tree.stream},
		namespace,
		pathArray,
	);

	// Patch the tree and initial state using iblokz-data
	return {
		...obj.patch(tree, pathArray, adaptedNode),
		initial: obj.patch(tree.initial, pathArray, adaptedNode.initial),
		stream: tree.stream,
		_namespace: namespace,
	};
};

/**
 * Create adapted actions and initialize state in one call
 * @memberof module:adapt
 * @param {Object} tree - Action tree with initial state and reducer functions
 * @param {string} [namespace='state.changes'] - Namespace for state changes
 * @param {Storage|null} [storage] - localStorage, sessionStorage, or null
 * @return {Object} Object with actions (adapted tree) and state$ (BehaviorSubject)
 * @example
 * import {createState} from 'iblokz-state/lib/adapt';
 *
 * const actions = {
 *   initial: { count: 0 },
 *   increment: () => state => ({ ...state, count: state.count + 1 })
 * };
 *
 * const {actions: acts, state$} = createState(actions);
 * state$.subscribe(state => console.log(state));
 * acts.increment(); // dispatches and updates state
 */
export const createState = (tree, namespace = 'state.changes', storage = null) => {
	const actions = adapt(tree, namespace);
	// Store namespace for later use (e.g., with attach)
	actions._namespace = namespace;
	const state$ = initCore(actions.initial, namespace, storage);
	return {actions, state$};
};

