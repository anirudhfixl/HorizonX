// Centralized data configuration and provider registry

import type { IDataProvider } from '../providers/data-provider';
import { localDataProvider } from '../providers/local-provider';
import { externalDataProvider } from '../providers/external-provider';
import { hybridDataProvider } from '../providers/hybrid-provider';

export type ProviderMode = 'local' | 'hybrid' | 'external';

export interface DataConfig {
  activeProvider: ProviderMode;
  cacheTtlMs: number;
  enableSimulatedDelay: boolean;
  simulatedDelayMs: number;
}

export const DATA_CONFIG: DataConfig = {
  activeProvider: 'local',
  cacheTtlMs: 30000,
  enableSimulatedDelay: false,
  simulatedDelayMs: 150,
};

let currentProvider: IDataProvider = localDataProvider;

/**
 * Returns the currently active data provider singleton
 */
export function getActiveProvider(): IDataProvider {
  return currentProvider;
}

/**
 * Switches the active data provider dynamically without modifying UI pages
 */
export function setActiveProvider(mode: ProviderMode): IDataProvider {
  DATA_CONFIG.activeProvider = mode;
  if (mode === 'external') {
    currentProvider = externalDataProvider;
  } else if (mode === 'hybrid') {
    currentProvider = hybridDataProvider;
  } else {
    currentProvider = localDataProvider;
  }
  return currentProvider;
}

