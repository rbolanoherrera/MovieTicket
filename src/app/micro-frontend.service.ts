import { initFederation, type NativeFederationResult } from '@angular-architects/native-federation';
import { Injectable } from '@angular/core';

@Injectable()
export class MicroFrontendService {
  private federationPromise: Promise<NativeFederationResult> | null = null;

  constructor() {
    this.federationPromise ??= initFederation('federation.manifest.json');
  }

  async loadRemoteComponent(remoteName: string) {
    try {
      const federation = await this.federationPromise;
      if (!federation) {
        throw new Error('Federation runtime is not initialized');
      }
      return await federation.loadRemoteModule(remoteName, './Component');
    } catch (error) {
      console.error(`Error loading remote component ${remoteName}:`, error);
      throw error;
    }
  }
}
