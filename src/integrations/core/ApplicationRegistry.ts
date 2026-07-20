import type { ApplicationAdapter } from './ApplicationAdapter';
import type { ApplicationIconKey } from './ApplicationTypes';

interface AdapterFactoryManifest {
  readonly displayName?: string;
  readonly iconKey?: ApplicationIconKey;
}

interface AdapterRegistration {
  readonly id: string;
  readonly loader: () => Promise<ApplicationAdapter>;
  readonly manifest: AdapterFactoryManifest;
  adapter?: ApplicationAdapter;
  lastError?: string;
}

export interface InstalledAdapterSnapshot {
  readonly id: string;
  readonly displayName: string;
  readonly iconKey: ApplicationIconKey;
  readonly loaded: boolean;
  readonly active: boolean;
  readonly healthy: boolean;
  readonly error?: string;
}

export class ApplicationRegistry {
  private readonly registrations = new Map<string, AdapterRegistration>();
  private activeAdapterId: string | null = null;

  register(id: string, loader: () => Promise<ApplicationAdapter>, manifest: AdapterFactoryManifest = {}): void {
    this.registrations.set(id, { id, loader, manifest });
  }

  unregister(id: string): void {
    this.registrations.delete(id);
    if (this.activeAdapterId === id) {
      this.activeAdapterId = null;
    }
  }

  setActiveAdapter(id: string | null): void {
    this.activeAdapterId = id;
  }

  getActiveAdapterId(): string | null {
    return this.activeAdapterId;
  }

  async load(id: string): Promise<ApplicationAdapter | null> {
    const registration = this.registrations.get(id);
    if (!registration) {
      return null;
    }

    if (!registration.adapter) {
      try {
        registration.adapter = await registration.loader();
        registration.lastError = undefined;
      } catch (error) {
        registration.lastError = error instanceof Error ? error.message : 'Failed to load adapter.';
        return null;
      }
    }

    return registration.adapter;
  }

  async getActiveAdapter(): Promise<ApplicationAdapter | null> {
    if (!this.activeAdapterId) {
      return null;
    }

    return this.load(this.activeAdapterId);
  }

  async resolve(id: string): Promise<ApplicationAdapter | null> {
    const adapter = await this.load(id);
    if (adapter) {
      this.activeAdapterId = id;
    }

    return adapter;
  }

  async listInstalledAdapters(): Promise<InstalledAdapterSnapshot[]> {
    const snapshots: InstalledAdapterSnapshot[] = [];
    for (const [id, registration] of this.registrations.entries()) {
      const adapter = registration.adapter ?? null;
      snapshots.push({
        id,
        displayName: registration.manifest.displayName ?? adapter?.getDisplayName() ?? id,
        iconKey: registration.manifest.iconKey ?? adapter?.getIcon() ?? 'generic',
        loaded: Boolean(adapter),
        active: this.activeAdapterId === id,
        healthy: !registration.lastError,
        error: registration.lastError
      });
    }

    return snapshots;
  }

  async dispose(): Promise<void> {
    for (const registration of this.registrations.values()) {
      if (registration.adapter) {
        await registration.adapter.dispose();
      }
    }
  }
}
