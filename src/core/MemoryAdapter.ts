import {CacheAdapter, CacheEntry} from "../types";

export class MemoryAdapter implements CacheAdapter {
    private store = new Map<string, CacheEntry<any>>();

    private get timeSecond(){
        return Math.floor(Date.now() / 1000)
    }

    set<T>(key: string, value: T, ttlSec?: number): void {
        const expiresAt = ttlSec ? this.timeSecond + ttlSec : undefined;
        this.store.set(key, { value, expiresAt });
    }

    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (entry.expiresAt && entry.expiresAt < this.timeSecond) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    has(key: string): boolean {
        const entry = this.store.get(key);
        if (!entry) return false;

        if (entry.expiresAt && entry.expiresAt < this.timeSecond) {
            this.store.delete(key);
            return false;
        }

        return true;
    }

    cleanupExpired() {
        for (const [key, entry] of this.store.entries()) {
            if (entry.expiresAt && entry.expiresAt < this.timeSecond) {
                this.store.delete(key);
            }
        }
    }
    destroy(): void {}
}
