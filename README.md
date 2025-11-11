# iblokz-state

[![npm version](https://badge.fury.io/js/iblokz-state.svg)](https://badge.fury.io/js/iblokz-state)
[![CI](https://github.com/iblokz/state/workflows/CI/badge.svg)](https://github.com/iblokz/state/actions)
[![codecov](https://codecov.io/gh/iblokz/state/graph/badge.svg)](https://codecov.io/gh/iblokz/state)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, RxJS-based state management library for JavaScript applications with DOM event integration.

## Features

- 🎯 **Event-driven** - Uses DOM events for cross-component/microfrontend communication
- 🔒 **Immutable updates** - State changes through pure reducer functions
- 📡 **RxJS powered** - Built on RxJS observables for powerful reactive patterns
- 🌐 **Microfrontend ready** - Perfect for distributed applications using localStorage and DOM events
- ✅ **Well-tested** - Comprehensive test coverage

## Installation

```bash
npm install iblokz-state
# or
pnpm install iblokz-state
```

## Usage

This library is published as **ESM-first** with a CommonJS build for compatibility.

### ESM (Recommended)

```javascript
import { init, dispatch } from 'iblokz-state';

// Initialize state with initial value
const state$ = init({ count: 0 });

// Subscribe to state changes (RxJS observable)
state$.subscribe(state => {
  console.log('State changed:', state);
});

// Dispatch state changes using reducer functions
dispatch(state => ({ ...state, count: state.count + 1 }));
```

### CommonJS (Node.js compatibility)

```javascript
const { init, dispatch } = require('iblokz-state');

// Same API as ESM
const state$ = init({ count: 0 });
state$.subscribe(state => console.log('State:', state));
dispatch(state => ({ ...state, count: state.count + 1 }));
```

### With Custom Namespace (for multiple stores)

```javascript
const { init, dispatch } = require('iblokz-state');

// Create isolated state stores with different namespaces
const appState$ = init({ user: null }, 'app.state');
const uiState$ = init({ theme: 'light' }, 'ui.state');

appState$.subscribe(state => console.log('App:', state));
uiState$.subscribe(state => console.log('UI:', state));

dispatch(state => ({ ...state, user: { name: 'John' } }), 'app.state');
dispatch(state => ({ ...state, theme: 'dark' }), 'ui.state');
```

## API

### `dispatch(change, namespace)`

Dispatches a state change via DOM custom event.

**Parameters:**
- `change` (Function) - Reducer function that takes current state and returns new state
- `namespace` (string, optional) - Event namespace (default: 'state.changes')

**Returns:** boolean - Whether dispatch was successful

**Example:**
```javascript
dispatch(state => ({ ...state, count: state.count + 1 }));
dispatch(state => ({ ...state, loading: true }), 'app.state');
```

### `collect(namespace)`

Creates an RxJS observable stream of state change events.

**Parameters:**
- `namespace` (string, optional) - Event namespace (default: 'state.changes')

**Returns:** Observable - Stream of reducer functions

**Example:**
```javascript
const changes$ = collect();
changes$.subscribe(change => {
  console.log('Change function received:', change);
});
```

### `init(initial, namespace, storage)`

Initializes a state observable that responds to dispatched changes.

**Parameters:**
- `initial` (Object) - The initial state (used only if storage is empty)
- `namespace` (string, optional) - Event namespace (default: 'state.changes')
- `storage` (Storage|null, optional) - Storage instance:
  - `localStorage` - Persist across browser sessions
  - `sessionStorage` - Persist only during browser session
  - `null` or omitted - Memory only (no persistence)

**Returns:** BehaviorSubject - RxJS observable of state

**Examples:**

```javascript
// Memory only (default)
const state$ = init({ count: 0 });

// With localStorage persistence
const state$ = init({ count: 0 }, 'state.changes', localStorage);

// With sessionStorage
const state$ = init({ count: 0 }, 'state.changes', sessionStorage);

// Subscribe to state changes
const subscription = state$.subscribe(state => {
  console.log('Current state:', state);
});

// Get current value
const currentState = state$.getValue();

// Unsubscribe when done
subscription.unsubscribe();
```

## Patterns

### Reducer Functions

State changes are applied through reducer functions that take the current state and return a new state:

```javascript
// Simple increment
const increment = state => ({ ...state, count: state.count + 1 });

// Nested update
const updateUser = (name) => state => ({
  ...state,
  user: { ...state.user, name }
});

// Array operations
const addItem = (item) => state => ({
  ...state,
  items: [...state.items, item]
});

store.dispatch(increment);
store.dispatch(updateUser('Alice'));
store.dispatch(addItem({ id: 1, text: 'New item' }));
```

### Organizing State Changes

```javascript
// state/index.js
export const initial = {
  count: 0,
  user: { name: 'Guest' }
};

export const increment = state => ({ ...state, count: state.count + 1 });
export const decrement = state => ({ ...state, count: state.count - 1 });
export const setUser = (name) => state => ({ ...state, user: { name } });

// app.js
import { createStore } from 'iblokz-state';
import { initial, increment, setUser } from './state';

const store = createStore(initial);
store.dispatch(increment);
store.dispatch(setUser('John'));
```

### With UI Libraries

```javascript
// Using with virtual DOM (e.g., Snabbdom)
import { h } from 'snabbdom';
import { init, dispatch } from 'iblokz-state';

const state$ = init({ count: 0 });

const view = (state) => h('div', [
  h('span', `Count: ${state.count}`),
  h('button', {
    on: { click: () => dispatch(s => ({ ...s, count: s.count + 1 })) }
  }, 'Increment')
]);

state$.subscribe(state => {
  const vnode = view(state);
  patch(container, vnode);
});
```

### Microfrontend Communication

The event-based architecture makes it perfect for microfrontend setups:

```javascript
// Microfrontend A
import { init, dispatch } from 'iblokz-state';
const appState$ = init({ cart: [] }, 'shop.cart');

// Microfrontend B (different bundle)
import { dispatch } from 'iblokz-state';
// Can dispatch to the same namespace
dispatch(state => ({
  ...state,
  cart: [...state.cart, { id: 1, name: 'Product' }]
}), 'shop.cart');
```

### With Storage Persistence

The library includes built-in localStorage and sessionStorage support:

```javascript
import { init, dispatch } from 'iblokz-state';

// With localStorage (persists across browser sessions)
const state$ = init({ count: 0 }, 'state.changes', localStorage);

// With sessionStorage (persists only during browser session)
const state$ = init({ count: 0 }, 'state.changes', sessionStorage);

// State automatically:
// - Loads from storage on init (if exists)
// - Saves to storage on every change
// - Uses initial state only if storage is empty
```

**How it works:**
1. On `init()`, tries to load state from storage using the namespace as the key
2. If found, uses stored state (ignores `initial` parameter)
3. If not found, uses `initial` state
4. Every state change is automatically saved to storage

**Using storage utilities directly:**

```javascript
import { storage } from 'iblokz-state';

// Get/set values directly
storage.set(localStorage, 'my-key', { data: 'value' });
const value = storage.get(localStorage, 'my-key', defaultValue);
```

## Examples

Check out the `examples/` folder for interactive examples:

- `examples/example.html` - Basic counter with state display
- `examples/with-storage.html` - Counter with localStorage persistence (survives page refresh!)

To run the examples, serve the project with a local server:
```bash
npx serve .
# Then open:
# - http://localhost:3000/examples/example.html
# - http://localhost:3000/examples/with-storage.html
```

## Development

```bash
# Install dependencies
pnpm install

# Build CommonJS bundles
pnpm build

# Run tests
pnpm test

# Run linter
pnpm run lint

# Generate documentation
pnpm run docs
```

### Project Structure

```
iblokz-state/
├── lib/
│   └── core.js          # Core ESM module
├── dist/                # Built files (auto-generated)
│   ├── index.cjs        # CommonJS bundle
│   └── index.browser.js # Browser ESM bundle
├── test/
│   └── core.test.js     # Test suite
├── examples/
│   └── example.html     # Interactive example
├── index.js             # Main ESM entry point
├── build.js             # Build script
└── package.json         # Package config with dual exports
```

### Module Format

- **Source**: ESM (ES Modules)
- **Distributed**: Both ESM and CommonJS
- **Package exports**:
  - `import` → `index.js` (ESM)
  - `require` → `dist/index.cjs` (CommonJS)

## Releases

We use automated releases via GitHub Actions. See [CHANGELOG.md](CHANGELOG.md) for version history.

To release a new version:

```bash
# Bump version (patch, minor, or major)
pnpm version patch   # or minor, or major

# This automatically:
# - Updates package.json version
# - Generates API documentation
# - Creates a git tag
# - Pushes to GitHub

# GitHub Actions then:
# - Runs CI tests
# - Creates GitHub Release
# - Publishes to npm
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## Links

- **[GitHub Repository](https://github.com/iblokz/state)** - Source code
- **[npm Package](https://www.npmjs.com/package/iblokz-state)** - Published package
- **[Issues](https://github.com/iblokz/state/issues)** - Bug reports & features
- **[Changelog](CHANGELOG.md)** - Version history

## License

MIT © iblokz

