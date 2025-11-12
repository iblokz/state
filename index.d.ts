/**
 * TypeScript definitions for iblokz-state
 */

import { BehaviorSubject, Subject } from 'rxjs';

/**
 * Dispatch a state change via DOM custom event
 */
export function dispatch(
	change: (state: any) => any,
	namespace?: string
): boolean;

/**
 * Collect state change events as an Observable stream
 */
export function collect(namespace?: string): any;

/**
 * Initialize the state machine with optional storage persistence
 */
export function init<T = any>(
	initial: T,
	namespace?: string,
	storage?: Storage | null
): BehaviorSubject<T>;

/**
 * Storage utilities
 */
export namespace storage {
	/**
	 * Get item from storage with JSON parsing
	 */
	function get<T = any>(
		storage: Storage,
		key: string,
		defaultValue?: T
	): T;

	/**
	 * Set item to storage with JSON stringification
	 */
	function set(
		storage: Storage,
		key: string,
		value: any
	): void;

	/**
	 * Initialize storage wrapper
	 */
	function init(storage: Storage | null): {
		storage: Storage;
		get<T = any>(key: string, defaultValue?: T): T;
		set(key: string, value: any): void;
	} | null;
}

/**
 * Action metadata emitted by adapted actions
 */
export interface ActionEvent {
	path: string[];
	payload: any[];
	reducer: (state: any) => any;
}

/**
 * Adapted action tree with auto-dispatching methods
 */
export interface AdaptedActions<T = any> {
	initial: T;
	stream: Subject<ActionEvent>;
	[key: string]: any;
}

/**
 * Adapt an action tree to auto-dispatch on method calls
 */
export function adapt<T = any>(
	tree: any,
	namespace?: string,
	path?: string[]
): AdaptedActions<T>;

/**
 * Attach a new action branch to an existing adapted tree
 */
export function attach<T = any>(
	tree: AdaptedActions<any>,
	path: string[] | string,
	node: any
): AdaptedActions<T>;

/**
 * Create adapted actions and initialize state in one call
 */
export function createState<T = any>(
	tree: any,
	namespace?: string,
	storage?: Storage | null
): {
	actions: AdaptedActions<T>;
	state$: BehaviorSubject<T>;
};

