/**
 * Storage utilities for localStorage/sessionStorage
 * @module storage
 */

/**
 * Get item from storage with JSON parsing
 * @memberof module:storage
 * @param {Storage} storage - localStorage or sessionStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @return {*} Parsed value or default
 */
export const get = (storage, key, defaultValue) =>
	(storage.getItem(key) && JSON.parse(storage.getItem(key))) ?? defaultValue;

/**
 * Set item to storage with JSON stringification
 * @memberof module:storage
 * @param {Storage} storage - localStorage or sessionStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @return {void}
 */
export const set = (storage, key, value) =>
	storage.setItem(key, JSON.stringify(value));

/**
 * Initialize storage wrapper
 * @memberof module:storage
 * @param {Storage|null} storage - localStorage, sessionStorage, or null
 * @return {Object|null} Storage wrapper with get/set methods or null
 */
export const init = (storage) => storage ? ({
	storage,
	get: (key, defaultValue) => get(storage, key, defaultValue),
	set: (key, value) => set(storage, key, value),
}) : null;
