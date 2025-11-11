/**
 * TypeScript definitions for iblokz-state
 */

import { BehaviorSubject } from 'rxjs';

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

