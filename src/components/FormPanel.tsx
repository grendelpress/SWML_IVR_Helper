import { SWMLData } from '../utils/generateSWML';
import { CustomVariable } from '../utils/customVariables';
import CustomVariablesPanel from './CustomVariablesPanel';

interface FormPanelProps {
  data: SWMLData;
  onChange: (field: keyof SWMLData, value: string) => void;
  customVariables: CustomVariable[];
  onCustomVariablesChange: (vars: CustomVariable[]) => void;
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';

const textareaClass =
  'w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none';

const labelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';

export default function FormPanel({ data, onChange, customVariables, onCustomVariablesChange }: FormPanelProps) {
  const isValidPhone = data.salesNumber === '' || data.salesNumber.startsWith('+');

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className={labelClass}>Brand Name</label>
        <input
          type="text"
          value={data.brand}
          onChange={(e) => onChange('brand', e.target.value)}
          placeholder="Your company name"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Sales Phone Number</label>
        <input
          type="text"
          value={data.salesNumber}
          onChange={(e) => onChange('salesNumber', e.target.value)}
          placeholder="+15551234567"
          className={`${inputClass} ${!isValidPhone ? 'border-amber-500 focus:ring-amber-500' : ''}`}
        />
        {!isValidPhone && (
          <p className="mt-1.5 text-xs text-amber-400">
            Phone number should be in E.164 format (starts with +)
          </p>
        )}
      </div>

      <div>
        <label className={labelClass}>Whisper URL</label>
        <input
          type="text"
          value={data.whisperUrl}
          onChange={(e) => onChange('whisperUrl', e.target.value)}
          placeholder="https://example.com/whisper.xml"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Hours Message</label>
        <textarea
          rows={3}
          value={data.hours}
          onChange={(e) => onChange('hours', e.target.value)}
          placeholder="We are open Monday through Friday, 9am to 5pm."
          className={textareaClass}
        />
      </div>

      <div>
        <label className={labelClass}>Voicemail Prompt</label>
        <textarea
          rows={3}
          value={data.voicemail}
          onChange={(e) => onChange('voicemail', e.target.value)}
          placeholder="Please leave a message after the tone."
          className={textareaClass}
        />
      </div>

      <div>
        <label className={labelClass}>Closing Message</label>
        <textarea
          rows={2}
          value={data.closing}
          onChange={(e) => onChange('closing', e.target.value)}
          placeholder="Thank you for calling. We will be in touch shortly."
          className={textareaClass}
        />
      </div>

      <div className="border-t border-gray-700/60 pt-5">
        <CustomVariablesPanel
          variables={customVariables}
          onChange={onCustomVariablesChange}
        />
      </div>
    </div>
  );
}
