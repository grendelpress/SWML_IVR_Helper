import { useState } from 'react';
import { Radio, Github } from 'lucide-react';
import FormPanel from './components/FormPanel';
import OutputPanel from './components/OutputPanel';
import { compileTemplate, DEFAULT_TEMPLATE, SWMLData } from './utils/generateSWML';

export type OutputMode = 'preview' | 'template';

const DEFAULT_DATA: SWMLData = {
  brand: '',
  salesNumber: '',
  whisperUrl: '',
  hours: '',
  voicemail: '',
  closing: '',
};

export default function App() {
  const [data, setData] = useState<SWMLData>(DEFAULT_DATA);
  const [template, setTemplate] = useState<string>(DEFAULT_TEMPLATE);
  const [mode, setMode] = useState<OutputMode>('preview');

  const compiledSWML = compileTemplate(template, data);

  const handleChange = (field: keyof SWMLData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600">
            <Radio size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">SWML IVR Builder</h1>
            <p className="text-xs text-gray-500 leading-tight">
              SignalWire Markup Language generator for IVR flows
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live preview
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-7rem)]">
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 overflow-y-auto">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-white">Configuration</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Fill in your IVR details to generate the SWML script
              </p>
            </div>
            <FormPanel data={data} onChange={handleChange} />
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 flex flex-col min-h-[500px] lg:min-h-0">
            <OutputPanel
              template={template}
              compiledSWML={compiledSWML}
              data={data}
              mode={mode}
              onModeChange={setMode}
              onTemplateChange={setTemplate}
              onResetTemplate={() => setTemplate(DEFAULT_TEMPLATE)}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-600">SignalWire Markup Language IVR Builder</p>
          <a
            href="https://github.com/grendelpress/SWML_IVR_Helper"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            <Github size={13} />
            grendelpress/SWML_IVR_Helper
          </a>
        </div>
      </footer>
    </div>
  );
}
