import { useState } from 'react';
import { Bookmark, BookmarkPlus, X, Check } from 'lucide-react';
import { Preset, loadPresets, savePreset, deletePreset } from '../utils/presets';

interface PresetManagerProps {
  currentTemplate: string;
  onLoad: (template: string) => void;
}

export default function PresetManager({ currentTemplate, onLoad }: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets());
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const updated = savePreset(trimmed, currentTemplate);
    setPresets(updated);
    setName('');
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresets(deletePreset(id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setSaving(false);
      setName('');
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap min-h-[30px] mb-3">
      <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
        <Bookmark size={11} />
        Presets
      </span>

      {presets.length === 0 && !saving && (
        <span className="text-xs text-gray-600 italic">None saved yet</span>
      )}

      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onLoad(preset.template)}
          className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/60 border border-gray-600/60 text-gray-300 hover:bg-gray-600/80 hover:border-gray-500 hover:text-white transition-all duration-150"
          title={`Load "${preset.name}"`}
        >
          {preset.name}
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => handleDelete(preset.id, e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                setPresets(deletePreset(preset.id));
              }
            }}
            className="flex items-center justify-center w-3.5 h-3.5 rounded-full text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150"
            title="Delete preset"
          >
            <X size={10} />
          </span>
        </button>
      ))}

      {saving ? (
        <div className="flex items-center gap-1">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Preset name..."
            className="h-7 px-2.5 rounded-lg text-xs bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-150 w-36"
          />
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-xs bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
            title="Save preset"
          >
            <Check size={12} />
          </button>
          <button
            onClick={() => { setSaving(false); setName(''); }}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-150"
            title="Cancel"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setSaving(true)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
            saved
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-transparent border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500 hover:bg-gray-700/40'
          }`}
          title="Save current template as preset"
        >
          {saved ? <Check size={11} /> : <BookmarkPlus size={11} />}
          {saved ? 'Saved!' : 'Save'}
        </button>
      )}
    </div>
  );
}
