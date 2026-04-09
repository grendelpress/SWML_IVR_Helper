import { useState } from 'react';
import { Plus, X, Variable } from 'lucide-react';
import {
  CustomVariable,
  addCustomVariable,
  updateCustomVariable,
  deleteCustomVariable,
} from '../utils/customVariables';

interface CustomVariablesPanelProps {
  variables: CustomVariable[];
  onChange: (vars: CustomVariable[]) => void;
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

const labelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';

export default function CustomVariablesPanel({ variables, onChange }: CustomVariablesPanelProps) {
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [keyError, setKeyError] = useState('');

  const RESERVED = ['brand', 'salesNumber', 'whisperUrl', 'hours', 'voicemail', 'closing'];

  const validateKey = (key: string): string => {
    const trimmed = key.trim();
    if (!trimmed) return 'Name is required.';
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed))
      return 'Only letters, numbers, and underscores. Must not start with a number.';
    if (RESERVED.includes(trimmed)) return 'This name is reserved.';
    if (variables.some((v) => v.key === trimmed)) return 'A variable with this name already exists.';
    return '';
  };

  const handleAdd = () => {
    const err = validateKey(newKey);
    if (err) { setKeyError(err); return; }
    onChange(addCustomVariable(newKey.trim()));
    setNewKey('');
    setAdding(false);
    setKeyError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setAdding(false); setNewKey(''); setKeyError(''); }
  };

  const handleValueChange = (id: string, value: string) => {
    onChange(updateCustomVariable(id, value));
  };

  const handleDelete = (id: string) => {
    onChange(deleteCustomVariable(id));
  };

  const handleNewKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKey(e.target.value);
    if (keyError) setKeyError('');
  };

  return (
    <div className="mt-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Variable size={13} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Custom Variables
          </span>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-500 transition-all duration-150"
          >
            <Plus size={11} /> 
            Add variable
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {variables.map((v) => (
          <div key={v.id}>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelClass + ' mb-0'}>
                <span className="text-blue-400/80 mr-0.5">{'{'}</span>
                {v.key}
                <span className="text-blue-400/80 ml-0.5">{'}'}</span>
              </label>
              <button
                onClick={() => handleDelete(v.id)}
                className="flex items-center justify-center w-5 h-5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-100"
                title={`Delete variable "${v.key}"`}
              >
                <X size={11} />
              </button>
            </div>
            <input
              type="text"
              value={v.value}
              onChange={(e) => handleValueChange(v.id, e.target.value)}
              placeholder={`Value for {{${v.key}}}`}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {adding && (
        <div className={`${variables.length > 0 ? 'mt-4' : ''}`}>
          <label className={labelClass}>New Variable Name</label>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono select-none">{'{{'}</span>
                <input
                  autoFocus
                  type="text"
                  value={newKey}
                  onChange={handleNewKeyChange}
                  onKeyDown={handleKeyDown}
                  placeholder="myVariable"
                  className={`${inputClass} pl-9 pr-9 font-mono ${keyError ? 'border-amber-500 focus:ring-amber-500' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono select-none">{'}}'}</span>
              </div>
              {keyError && (
                <p className="mt-1.5 text-xs text-amber-400">{keyError}</p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={!newKey.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 shrink-0"
              title="Add variable"
            >
              <Plus size={15} />
            </button>
            <button
              onClick={() => { setAdding(false); setNewKey(''); setKeyError(''); }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-150 shrink-0"
              title="Cancel"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {variables.length === 0 && !adding && (
        <p className="text-xs text-gray-600 italic">
          No custom variables yet. Add one to use <span className="font-mono text-gray-500">{'{{myVar}}'}</span> in your template.
        </p>
      )}
    </div>
  );
}
