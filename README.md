# Terminol

Raycast extension to save your own commands and run them in Terminal. The **My Commands** command shows the list (starting with a `ping 8.8.8.8` example); press Enter to run one or `⌘N` to create a new one with a name and a command (multiline commands are supported).

## Global hotkeys

Raycast doesn't let extensions register hotkeys themselves, so hotkeys go through quicklinks:

1. In **My Commands**, open the actions of a command (`⌘K`) and choose **Create Quicklink for Hotkey**.
2. Save the quicklink.
3. Open Raycast Settings → Extensions → Quicklinks, find the quicklink and record a hotkey.

The hotkey then runs the command in Terminal from anywhere, without opening Raycast. The quicklink points to the command by id, so it always runs the latest saved version.

## Development

```bash
npm install
npm run dev
```

`npm run dev` opens the extension in Raycast in development mode with hot reload.

## Publishing

```bash
npm run lint
npm run build
npm run publish
```
