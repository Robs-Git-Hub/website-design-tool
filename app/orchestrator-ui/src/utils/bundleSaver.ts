/**
 * WAS Bundle Saver Utilities
 *
 * Handles saving/downloading WAS bundles to local storage and file system
 */

import type { WASBundle } from '../../../common/src/types/was';

/**
 * Generate a filename for a WAS bundle based on keywords and timestamp
 */
export function generateBundleFilename(bundle: WASBundle): string {
  const keywords = bundle.meta.intent_keywords.slice(0, 3).join('_');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const sanitized = keywords.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
  return `was_bundle_${sanitized}_${timestamp}.json`;
}

/**
 * Download a WAS bundle as a JSON file
 */
export function downloadBundle(bundle: WASBundle): void {
  const filename = generateBundleFilename(bundle);
  const json = JSON.stringify(bundle, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Save a bundle to localStorage for history
 */
export function saveBundleToHistory(bundle: WASBundle): void {
  const key = `was_bundle_${Date.now()}`;
  const history = getBundleHistory();

  history.unshift({
    key,
    bundle,
    timestamp: Date.now(),
  });

  // Keep only the last 20 bundles
  const trimmed = history.slice(0, 20);
  localStorage.setItem('was_bundle_history', JSON.stringify(trimmed));
}

/**
 * Get bundle history from localStorage
 */
export function getBundleHistory(): Array<{
  key: string;
  bundle: WASBundle;
  timestamp: number;
}> {
  try {
    const stored = localStorage.getItem('was_bundle_history');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear bundle history
 */
export function clearBundleHistory(): void {
  localStorage.removeItem('was_bundle_history');
}
