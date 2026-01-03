import {CacheAdapter} from "../types";
import {MemoryAdapter} from "./MemoryAdapter";
import {LocalStorageAdapter} from "./LocalStorageAdapter";

export class CacheManager {
    private adapter: CacheAdapter;
    private cleanupIntervalId: ReturnType<typeof setInterval> | null = null;
    private cleanupIntervalMs = 60 * 1000; // по умолчанию 1 минута

    constructor(options?: { cleanupIntervalMs?: number }) {
        this.adapter = CacheManager.checkLocalStorage()
            ? new LocalStorageAdapter()
            : new MemoryAdapter();

        if (options?.cleanupIntervalMs) {
            this.cleanupIntervalMs = options.cleanupIntervalMs;
        }

        this.startCleanupTask();
    }

    private startCleanupTask(): void {
        this.cleanupIntervalId = setInterval(() => {
            this.adapter.cleanupExpired();
        }, this.cleanupIntervalMs);
    }

    static checkLocalStorage(): boolean {
        if (typeof localStorage === 'undefined') return false;
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    set<T>(key: string, value: T, ttlSecond?: number): void {
        this.adapter.set(key, value, ttlSecond);
    }

    get<T>(key: string): T | null {
        return this.adapter.get(key);
    }

    delete(key: string): void {
        this.adapter.delete(key);
    }

    has(key: string): boolean {
        return this.adapter.has(key);
    }

    destroy(): void {
        if (this.cleanupIntervalId) {
            clearInterval(this.cleanupIntervalId);
            this.cleanupIntervalId = null;
        }
    }
}
