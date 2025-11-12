## Modules

<dl>
<dt><a href="#module_adapt">adapt</a></dt>
<dd><p>Action tree adapter - converts action trees to auto-dispatching APIs</p>
</dd>
<dt><a href="#module_core">core</a></dt>
<dd><p>State Machine</p>
</dd>
<dt><a href="#module_storage">storage</a></dt>
<dd><p>Storage utilities for localStorage/sessionStorage</p>
</dd>
</dl>

<a name="module_adapt"></a>

## adapt
Action tree adapter - converts action trees to auto-dispatching APIs


* [adapt](#module_adapt)
    * [.exports.adapt](#module_adapt.exports.adapt) ⇒ <code>Object</code>
    * [.exports.createState](#module_adapt.exports.createState) ⇒ <code>Object</code>

<a name="module_adapt.exports.adapt"></a>

### adapt.exports.adapt ⇒ <code>Object</code>
Adapt an action tree to auto-dispatch on method calls

**Kind**: static constant of [<code>adapt</code>](#module_adapt)  
**Returns**: <code>Object</code> - Adapted tree with stream, initial, and auto-dispatching methods  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tree | <code>Object</code> |  | Action tree with initial state and reducer functions |
| [namespace] | <code>string</code> | <code>&quot;&#x27;state.changes&#x27;&quot;</code> | Namespace for state changes |
| [path] | <code>Array</code> | <code>[]</code> | Current path in tree (used internally) |

**Example**  
```js
const actions = {
  initial: { count: 0 },
  increment: () => state => ({ ...state, count: state.count + 1 }),
  add: (n) => state => ({ ...state, count: state.count + n }),
  nested: {
    initial: { value: 0 },
    setValue: (val) => state => ({ ...state, nested: { value: val } })
  }
};

const adapted = adapt(actions);
// adapted.initial = { count: 0, nested: { value: 0 } }
// adapted.stream - Subject that emits action metadata
// adapted.increment() - auto-dispatches
// adapted.nested.setValue(42) - auto-dispatches
```
<a name="module_adapt.exports.createState"></a>

### adapt.exports.createState ⇒ <code>Object</code>
Create adapted actions and initialize state in one call

**Kind**: static constant of [<code>adapt</code>](#module_adapt)  
**Returns**: <code>Object</code> - Object with actions (adapted tree) and state$ (BehaviorSubject)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tree | <code>Object</code> |  | Action tree with initial state and reducer functions |
| [namespace] | <code>string</code> | <code>&quot;&#x27;state.changes&#x27;&quot;</code> | Namespace for state changes |
| [storage] | <code>Storage</code> \| <code>null</code> |  | localStorage, sessionStorage, or null |

**Example**  
```js
import {createState} from 'iblokz-state/lib/adapt';

const actions = {
  initial: { count: 0 },
  increment: () => state => ({ ...state, count: state.count + 1 })
};

const {actions: acts, state$} = createState(actions);
state$.subscribe(state => console.log(state));
acts.increment(); // dispatches and updates state
```
<a name="module_core"></a>

## core
State Machine


* [core](#module_core)
    * [.exports.dispatch](#module_core.exports.dispatch) ⇒ <code>boolean</code>
    * [.exports.collect](#module_core.exports.collect) ⇒ <code>Observable</code>
    * [.exports.init](#module_core.exports.init) ⇒ <code>BehaviorSubject</code>

<a name="module_core.exports.dispatch"></a>

### core.exports.dispatch ⇒ <code>boolean</code>
Dispatch mechanism for state changes via DOM events

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>boolean</code> - Returns a boolean whether the dispatch was successful or not  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| change | <code>function</code> |  | Change reducer for the state |
| [namespace] | <code>string</code> | <code>&quot;&#x27;state.changes&#x27;&quot;</code> | Namespace being used for state changes |

**Example**  
```js
dispatch(state => ({ ...state, count: state.count + 1 }));
```
<a name="module_core.exports.collect"></a>

### core.exports.collect ⇒ <code>Observable</code>
Collect mechanism to listen for state change events

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>Observable</code> - Stream of state changes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [namespace] | <code>string</code> | <code>&quot;&#x27;state.changes&#x27;&quot;</code> | Namespace being used for state changes |

**Example**  
```js
const changes$ = collect();
changes$.subscribe(change => console.log('Change:', change));
```
<a name="module_core.exports.init"></a>

### core.exports.init ⇒ <code>BehaviorSubject</code>
Initialize the state machine

**Kind**: static constant of [<code>core</code>](#module_core)  
**Returns**: <code>BehaviorSubject</code> - Observable stream of state  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| initial | <code>Object</code> |  | The initial state of the state |
| [namespace] | <code>string</code> | <code>&quot;&#x27;state.changes&#x27;&quot;</code> | Namespace being used for state changes |
| [storage] | <code>Storage</code> \| <code>null</code> |  | localStorage, sessionStorage, or null |

**Example**  
```js
// Memory only (default)
const state$ = init({ count: 0 });

// With localStorage persistence
const state$ = init({ count: 0 }, 'state.changes', localStorage);

// With sessionStorage
const state$ = init({ count: 0 }, 'state.changes', sessionStorage);
```
<a name="module_storage"></a>

## storage
Storage utilities for localStorage/sessionStorage


* [storage](#module_storage)
    * [.exports.get](#module_storage.exports.get) ⇒ <code>\*</code>
    * [.exports.set](#module_storage.exports.set) ⇒ <code>void</code>
    * [.exports.init](#module_storage.exports.init) ⇒ <code>Object</code> \| <code>null</code>

<a name="module_storage.exports.get"></a>

### storage.exports.get ⇒ <code>\*</code>
Get item from storage with JSON parsing

**Kind**: static constant of [<code>storage</code>](#module_storage)  
**Returns**: <code>\*</code> - Parsed value or default  

| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Storage</code> | localStorage or sessionStorage |
| key | <code>string</code> | Storage key |
| defaultValue | <code>\*</code> | Default value if not found |

<a name="module_storage.exports.set"></a>

### storage.exports.set ⇒ <code>void</code>
Set item to storage with JSON stringification

**Kind**: static constant of [<code>storage</code>](#module_storage)  

| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Storage</code> | localStorage or sessionStorage |
| key | <code>string</code> | Storage key |
| value | <code>\*</code> | Value to store |

<a name="module_storage.exports.init"></a>

### storage.exports.init ⇒ <code>Object</code> \| <code>null</code>
Initialize storage wrapper

**Kind**: static constant of [<code>storage</code>](#module_storage)  
**Returns**: <code>Object</code> \| <code>null</code> - Storage wrapper with get/set methods or null  

| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Storage</code> \| <code>null</code> | localStorage, sessionStorage, or null |

