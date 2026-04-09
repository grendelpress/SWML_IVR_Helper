export interface SWMLData {
  brand: string;
  salesNumber: string;
  whisperUrl: string;
  hours: string;
  voicemail: string;
  closing: string;
}

const KNOWN_VARIABLES = ['brand', 'salesNumber', 'whisperUrl', 'hours', 'voicemail', 'closing'];

export const DEFAULT_TEMPLATE = `version: 1.0.0

sections:
  main:
    - answer: {}

    - play:
        url: "say:Welcome to {{brand}}. Press 1 for sales, 2 for hours, or 3 to leave a message."

    - prompt:
        play: "say:Press 1 for sales, 2 for hours, or 3 to leave a message."
        max_digits: 1
        speech_hints:
          - one
          - two
          - three

    - switch:
        variable: prompt_value
        case:
          '1':
            - execute:
                dest: sales
          '2':
            - execute:
                dest: hours
          '3':
            - execute:
                dest: voicemail
          one:
            - execute:
                dest: sales
          two:
            - execute:
                dest: hours
          three:
            - execute:
                dest: voicemail
        default:
          - execute:
              dest: repeat

  repeat:
    - play:
        url: "say:Sorry, I didn't catch that."
    - execute:
        dest: main

  sales:
    - play:
        url: "say:Connecting you to sales."

    - connect:
        confirm: "{{whisperUrl}}"
        from: "$\{call.from}"
        to: "{{salesNumber}}"

    - execute:
        dest: voicemail

  hours:
    - play:
        url: "say:{{hours}}"
    - hangup: {}

  voicemail:
    - play:
        url: "say:{{voicemail}}"

    - record:
        max_length: 120
        beep: true

    - play:
        url: "say:{{closing}}"

    - hangup: {}`;

export function compileTemplate(
  template: string,
  data: SWMLData,
  customVars: Record<string, string> = {}
): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const k = key as keyof SWMLData;
    if (data[k] !== undefined) return data[k];
    if (customVars[key] !== undefined) return customVars[key];
    return `{{${key}}}`;
  });
}

export function getUnknownVariables(template: string, customVarKeys: string[] = []): string[] {
  const matches = [...template.matchAll(/\{\{([^}]+)\}\}/g)];
  const found = new Set(matches.map((m) => m[1]));
  return [...found].filter((v) => !KNOWN_VARIABLES.includes(v) && !customVarKeys.includes(v));
}

export function getEmptyKnownVariables(template: string, data: SWMLData): string[] {
  const matches = [...template.matchAll(/\{\{([^}]+)\}\}/g)];
  const found = new Set(matches.map((m) => m[1]));
  return [...found].filter(
    (v) => KNOWN_VARIABLES.includes(v) && !data[v as keyof SWMLData]
  );
}
