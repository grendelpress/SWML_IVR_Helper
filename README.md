# SWML IVR Helper

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-8cqz2qhm)

A browser-based tool for generating [SignalWire Markup Language (SWML)](https://developer.signalwire.com/sdks/reference/swml/) scripts for IVR (Interactive Voice Response) phone flows — no coding required.

## What It Does

Fill in your business details and the tool instantly generates a ready-to-deploy SWML YAML file. The generated script handles:

- A main greeting menu (press 1 for sales, 2 for hours, 3 for voicemail)
- Sales call routing with whisper confirmation and caller ID passthrough
- Hours-of-operation playback
- Voicemail recording with a custom prompt and closing message
- Fallback repeat logic for unrecognized input

## Variables

| Variable | Description |
|---|---|
| `{{brand}}` | Your business name, used in the greeting |
| `{{salesNumber}}` | Phone number to connect sales calls to |
| `{{whisperUrl}}` | URL for the whisper audio played to the agent before connecting |
| `{{hours}}` | Text-to-speech message describing your hours |
| `{{voicemail}}` | Prompt played before the voicemail beep |
| `{{closing}}` | Message played after the voicemail recording ends |

> `${call.from}` is a SignalWire runtime variable that passes the caller's number through automatically — it is not a user-configurable field.

## Template Editing

Switch to **Template** mode in the output panel to customize the raw SWML template. Use `{{variableName}}` placeholders anywhere in the template and they will be substituted from the form. The editor warns you if a placeholder is unrecognized or hasn't been filled in yet.

Use the **Reset** button to restore the default template at any time.

## Output

- **Preview** — shows the fully compiled YAML with all variables substituted
- **Template** — shows the raw template with placeholders
- Both modes support **Copy** and **Download** as `.yaml`

## Built With

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SignalWire SWML](https://developer.signalwire.com/sdks/reference/swml/)

## GitHub

[github.com/grendelpress/SWML_IVR_Helper](https://github.com/grendelpress/SWML_IVR_Helper)
