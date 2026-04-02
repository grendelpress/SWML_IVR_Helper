import { useState, useRef, useEffect } from 'react';
import { Bookmark, BookmarkPlus, X, Check, ChevronDown } from 'lucide-react';
import { Preset, loadPresets, savePreset, deletePreset } from '../utils/presets';

interface PresetManagerProps {
  currentTemplate: string;
  onLoad: (template: string) => void;
}

export default function PresetManager({ currentTemplate, onLoad }: PresetManagerProps) {
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets());
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSaving(false);
        setName('');
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

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

  const handleLoad = (preset: Preset) => {
    onLoad(preset.template);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative mb-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-all duration-150"
        >
          <Bookmark size={11} />
          <span>Presets</span>
          {presets.length > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-300 text-[10px] font-semibold leading-none">
              {presets.length}
            </span>
          )}
          <ChevronDown
            size={11}
            className={`ml-0.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        <button
          onClick={() => { setOpen(true); setSaving(true); }}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
            saved
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-transparent border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500 hover:bg-gray-700/40'
          }`}
          title="Save current template as preset"
        >
          {saved ? <Check size={11} /> : <BookmarkPlus size={11} />}
          {saved ? 'Saved!' : 'Save preset'}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-gray-900 border border-gray-700 shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {presets.length === 0 && !saving && (
            <div className="px-3 py-3 text-xs text-gray-500 italic text-center">
              No presets saved yet
            </div>
          )}

          {presets.length > 0 && (
            <ul className="py-1 max-h-52 overflow-y-auto">
              {presets.map((preset) => (
                <li key={preset.id} className="group flex items-center">
                  <button
                    onClick={() => handleLoad(preset)}
                    className="flex-1 text-left px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-100 truncate"
                    title={`Load "${preset.name}"`}
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={(e) => handleDelete(preset.id, e)}
                    className="flex items-center justify-center w-7 h-7 mr-1 rounded-md text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10 transition-all duration-100"
                    title="Delete preset"
                  >
                    <X size={11} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {saving ? (
            <div className="flex items-center gap-1.5 px-2.5 py-2 border-t border-gray-800">
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Preset name..."
                className="flex-1 h-7 px-2.5 rounded-lg text-xs bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-150"
              />
              <button
                onClick={handleSave}
                disabled={!name.trim()}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
                title="Save preset"
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => { setSaving(false); setName(''); }}
                className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-150"
                title="Cancel"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSaving(true)}
              className="w-full flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 border-t border-gray-800 transition-colors duration-100"
            >
              <BookmarkPlus size={11} />
              Save current as preset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
