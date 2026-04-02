export interface Preset {
  id: string;
  name: string;
  template: string;
}

const STORAGE_KEY = 'swml_presets';

export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Preset[];
  } catch {
    return [];
  }
}

export function savePreset(name: string, template: string): Preset[] {
  const presets = loadPresets();
  const newPreset: Preset = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    template,
  };
  const updated = [...presets, newPreset];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deletePreset(id: string): Preset[] {
  const presets = loadPresets().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}
