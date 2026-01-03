declare class CacheManager {
    private adapter;
    private cleanupIntervalId;
    private cleanupIntervalMs;
    constructor(options?: {
        cleanupIntervalMs?: number;
    });
    private startCleanupTask;
    static checkLocalStorage(): boolean;
    set<T>(key: string, value: T, ttlSecond?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    has(key: string): boolean;
    destroy(): void;
}

interface CacheEntry<T> {
    value: T;
    expiresAt?: number | undefined;
}
interface CacheAdapter {
    set<T>(key: string, value: T, ttlSeconds?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    has(key: string): boolean;
    /**
     * Removes stale entries from the cache.
     */
    cleanupExpired(): void;
    destroy(): void;
}

declare class MemoryAdapter implements CacheAdapter {
    private store;
    private get timeSecond();
    set<T>(key: string, value: T, ttlSec?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    has(key: string): boolean;
    cleanupExpired(): void;
    destroy(): void;
}

/**
 * Adapter for storing data in localStorage with TTL support.
 */
declare class LocalStorageAdapter implements CacheAdapter {
    private get timeSecond();
    /**
     * Stores a value in localStorage with a TTL.
     * @param key The key to store.
     * @param value The value to store.
     * @param ttlSec The time to live in seconds.
     */
    set<T>(key: string, value: T, ttlSec?: number): void;
    /**
     * Gets the value from localStorage if it is not expired.
     * @param key The storage key.
     * @returns The value or null.
     */
    get<T>(key: string): T | null;
    /**
     * Removes a value from localStorage.
     * @param key Storage key.
     */
    delete(key: string): void;
    /**
     * Checks for the presence of an unexpired value by key.
     * @param key Key.
     * @returns true if the value exists and has not expired.
     */
    has(key: string): boolean;
    cleanupExpired(): void;
    destroy(): void;
}

export { type CacheEntry, CacheManager, LocalStorageAdapter, MemoryAdapter };
