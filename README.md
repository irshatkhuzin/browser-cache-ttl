# Browser Cache with TTL

![Static Badge](https://img.shields.io/badge/irshat-03.01.2025-fffff.svg?labelColor=ffd700)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Git Hub](https://img.shields.io/badge/Git_Hub-Candles-004096.svg?labelColor=000000)](https://github.com/Flippo24/candles)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/browser-cache-ttl.svg)](https://www.npmjs.com/package/browser-cache-ttl)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/browser-cache-ttl)](https://bundlephobia.com/result?p=browser-cache-ttl)

A tiny, dependency-free browser cache with **TTL support**, **automatic expiration**, and **smart fallback**.

- Uses `localStorage` when available
- Falls back to in-memory `Map` (Incognito / restricted environments)
- Written in **TypeScript**
- Automatic cleanup by TTL (not lazy-only)
- Simple and predictable API

---

## Installation

```bash
npm install browser-cache-ttl
```
or
```bash
yarn add browser-cache-ttl
```

```ts
import { CacheManager } from 'browser-cache-ttl';

const cache = new CacheManager();

cache.set('token', 'abc123', 60); // 1 minute

const token = cache.get<string>('token');
// -> 'abc123' or null if expired
```
## TTL (Time To Live)
Each entry must define a TTL in seconds.
```ts
cache.set('user', { id: 1, name: 'Alice' }, 30);
```
After expiration, the value is automatically removed.

## Automatic Cleanup
The cache runs a background cleanup task that removes expired entries.

Default cleanup interval: 60 seconds

You can customize it:
```ts
const cache = new CacheManager({
  cleanupIntervalMs: 30 // every 30 seconds
});
```
You can also stop cleanup if needed:
```ts
cache.destroy();
```
## Type Safety

The cache is fully typed.
```ts
cache.set('settings', { theme: 'dark' }, 10);

const settings = cache.get<{ theme: string }>('settings');
```
## API

```bash
set<T>(key: string, value: T, ttlMs: number): void
```
Stores a value with TTL.

```bash
get<T>(key: string): T | null
```
Returns the value if it exists and is not expired.

```bash
has(key: string): boolean
```
Checks if a key exists and is not expired.

```bash
delete(key: string): void
```
Removes a key from cache.

```bash
stopCleanupTask(): void
```
Stops automatic TTL cleanup.

## Storage Strategy
| Environment            | Storage Used    |
| ---------------------- | --------------- |
| Normal browser mode    | `localStorage`  |
| Incognito / restricted | In-memory `Map` |

## Example: Cache with Fallback 
```ts
const cache = new CacheManager();

cache.set('session', 'active', 200);

setTimeout(() => {
  console.log(cache.get('session')); // null after expiration
}, 300);
```

## Browser Support

- Chrome
- Firefox
- Safari
- Edge
Works in Incognito / Private mode.

## License
### MIT
Free to use. Free to modify. Free for everyone.
