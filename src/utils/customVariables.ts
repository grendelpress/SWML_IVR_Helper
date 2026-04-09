export interface CustomVariable {
  id: string;
  key: string;
  value: string;
}

const STORAGE_KEY = 'swml_custom_variables';

export function loadCustomVariables(): CustomVariable[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CustomVariable[];
  } catch {
    return [];
  }
}

function persist(vars: CustomVariable[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
}

export function addCustomVariable(key: string): CustomVariable[] {
  const vars = loadCustomVariables();
  const newVar: CustomVariable = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    key: key.trim(),
    value: '',
  };
  const updated = [...vars, newVar];
  persist(updated);
  return updated;
}

export function updateCustomVariable(id: string, value: string): CustomVariable[] {
  const vars = loadCustomVariables().map((v) => (v.id === id ? { ...v, value } : v));
  persist(vars);
  return vars;
}

export function deleteCustomVariable(id: string): CustomVariable[] {
  const vars = loadCustomVariables().filter((v) => v.id !== id);
  persist(vars);
  return vars;
}
