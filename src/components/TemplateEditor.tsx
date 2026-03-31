interface TemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TemplateEditor({ value, onChange }: TemplateEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      autoCorrect="off"
      autoCapitalize="off"
      className="w-full h-full p-5 text-sm font-mono leading-relaxed bg-transparent resize-none focus:outline-none text-emerald-300 caret-white"
    />
  );
}
