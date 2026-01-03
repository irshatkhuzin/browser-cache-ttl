import { CacheAdapter, CacheEntry } from '../types';

/**
 * Adapter for storing data in localStorage with TTL support.
 */
export class LocalStorageAdapter implements CacheAdapter {
    private get timeSecond(){
        return Math.floor(Date.now() / 1000)
    }

    /**
     * Stores a value in localStorage with a TTL.
     * @param key The key to store.
     * @param value The value to store.
     * @param ttlSec The time to live in seconds.
     */
    set<T>(key: string, value: T, ttlSec?: number): void {
        const expiresAt = ttlSec ? this.timeSecond + ttlSec : undefined;

        const entry: CacheEntry<T> = {
            value,
            expiresAt,
        };

        try {
            const serialized = JSON.stringify(entry);
            localStorage.setItem(key, serialized);
        } catch (error) {}
    }

    /**
     * Gets the value from localStorage if it is not expired.
     * @param key The storage key.
     * @returns The value or null.
     */
    get<T>(key: string): T | null {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        try {
            const entry: CacheEntry<T> = JSON.parse(raw);

            if (entry.expiresAt && entry.expiresAt < this.timeSecond) {
                this.delete(key);
                return null;
            }

            return entry.value;
        } catch (error) {
            console.warn(`[LocalStorageAdapter] Ошибка парсинга для ключа "${key}":`, error);
            this.delete(key);
            return null;
        }
    }

    /**
     * Removes a value from localStorage.
     * @param key Storage key.
     */
    delete(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Checks for the presence of an unexpired value by key.
     * @param key Key.
     * @returns true if the value exists and has not expired.
     */
    has(key: string): boolean {
        const raw = localStorage.getItem(key);
        if (!raw) return false;

        try {
            const entry: CacheEntry<unknown> = JSON.parse(raw);

            if (entry.expiresAt && entry.expiresAt < this.timeSecond) {
                this.delete(key);
                return false;
            }

            return true;
        } catch {
            this.delete(key);
            return false;
        }
    }

    cleanupExpired(): void {
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (!key) continue;

            const raw = localStorage.getItem(key);
            if (!raw) continue;

            try {
                const entry = JSON.parse(raw);
                if (entry.expiresAt && entry.expiresAt < this.timeSecond) {
                    localStorage.removeItem(key);
                }
            } catch {
                localStorage.removeItem(key);
            }
        }
    }

    destroy(): void {}
}
