/**
 * State Machine
 * @module core
 */

import {scan, map, startWith, fromEvent, BehaviorSubject} from 'rxjs';

import {init as initStorage} from './storage.js';

/**
 * Dispatch mechanism for state changes via DOM events
 * @memberof module:core
 * @param {Function} change - Change reducer for the state
 * @param {string} [namespace='state.changes'] - Namespace being used for state changes
 * @return {boolean} Returns a boolean whether the dispatch was successful or not
 * @example
 * dispatch(state => ({ ...state, count: state.count + 1 }));
 */
export const dispatch = (change, namespace = 'state.changes') =>
	document.dispatchEvent(new CustomEvent(namespace, {detail: change}));

/**
 * Collect mechanism to listen for state change events
 * @memberof module:core
 * @param {string} [namespace='state.changes'] - Namespace being used for state changes
 * @return {Observable} Stream of state changes
 * @example
 * const changes$ = collect();
 * changes$.subscribe(change => console.log('Change:', change));
 */
export const collect = (namespace = 'state.changes') =>
	fromEvent(document, namespace)
		.pipe(map((ev) => ev.detail));

/**
 * Initialize the state machine
 * @memberof module:core
 * @param {Object} initial - The initial state of the state
 * @param {string} [namespace='state.changes'] - Namespace being used for state changes
 * @param {Storage|null} [storage] - localStorage, sessionStorage, or null
 * @return {BehaviorSubject} Observable stream of state
 * @example
 * // Memory only (default)
 * const state$ = init({ count: 0 });
 *
 * // With localStorage persistence
 * const state$ = init({ count: 0 }, 'state.changes', localStorage);
 *
 * // With sessionStorage
 * const state$ = init({ count: 0 }, 'state.changes', sessionStorage);
 */
export const init = (initial = {}, namespace = 'state.changes', storage = null) => {
	const storageInstance = initStorage(storage);
	const initialState = storageInstance ?
		storageInstance.get(namespace, initial) :
		initial;

	const state$ = new BehaviorSubject(initialState);

	storageInstance && state$.subscribe((state) => {
		storageInstance.set(namespace, state);
	});

	collect(namespace).pipe(
		startWith(() => initialState),
		scan((state, change) => change(state), {}),
	).subscribe(state$);

	return state$;
};

