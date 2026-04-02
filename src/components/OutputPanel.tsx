import { Eye, FileCode, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import CopyButton from './CopyButton';
import TemplateEditor from './TemplateEditor';
import PresetManager from './PresetManager';
import { SWMLData, getUnknownVariables, getEmptyKnownVariables } from '../utils/generateSWML';
import { OutputMode } from '../App';

interface OutputPanelProps {
  template: string;
  compiledSWML: string;
  data: SWMLData;
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
  onTemplateChange: (value: string) => void;
  onResetTemplate: () => void;
}

export default function OutputPanel({
  template,
  compiledSWML,
  data,
  mode,
  onModeChange,
  onTemplateChange,
  onResetTemplate,
}: OutputPanelProps) {
  const unknownVars = getUnknownVariables(template);
  const emptyVars = getEmptyKnownVariables(template, data);

  const copyContent = mode === 'preview' ? compiledSWML : template;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-700">
          <button
            onClick={() => onModeChange('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              mode === 'preview'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Eye size={13} />
            Preview
          </button>
          <button
            onClick={() => onModeChange('template')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              mode === 'template'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileCode size={13} />
            Template
          </button>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'template' && (
            <button
              onClick={onResetTemplate}
              title="Reset to default template"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors duration-200"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
          <CopyButton text={copyContent} />
        </div>
      </div>

      <PresetManager currentTemplate={template} onLoad={onTemplateChange} />

      {mode === 'template' && unknownVars.length > 0 && (
        <div className="flex items-start gap-2 mb-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
          <span>
            Unknown variable{unknownVars.length > 1 ? 's' : ''} in template (will not be
            substituted):{' '}
            {unknownVars.map((v, i) => (
              <span key={v}>
                <code className="font-mono bg-amber-500/20 px-1 rounded">{`{{${v}}}`}</code>
                {i < unknownVars.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </div>
      )}

      {mode === 'template' && emptyVars.length > 0 && (
        <div className="flex items-start gap-2 mb-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          <span>
            Variable{emptyVars.length > 1 ? 's' : ''} not yet filled in the form (will compile
            blank):{' '}
            {emptyVars.map((v, i) => (
              <span key={v}>
                <code className="font-mono bg-blue-500/20 px-1 rounded">{`{{${v}}}`}</code>
                {i < emptyVars.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0 rounded-xl overflow-hidden border border-gray-700 bg-gray-950">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-gray-800 bg-gray-900">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-2 text-xs text-gray-600 font-mono">
              {mode === 'preview' ? 'compiled.yaml' : 'template.yaml'}
            </span>
            {mode === 'template' && (
              <span className="ml-auto text-xs text-amber-500/70 font-mono">
                use {'{{variableName}}'} for placeholders
              </span>
            )}
            {mode === 'preview' && (
              <span className="ml-auto text-xs text-emerald-500/70 font-mono">read-only</span>
            )}
          </div>

          <div className="h-[calc(100%-40px)] overflow-auto">
            {mode === 'preview' ? (
              <pre className="p-5 text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre">
                {compiledSWML}
              </pre>
            ) : (
              <TemplateEditor value={template} onChange={onTemplateChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
