export interface CacheEntry<T> {
    value: T;
    expiresAt?: number | undefined; // timestamp
}

export interface CacheAdapter {
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

