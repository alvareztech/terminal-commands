# Terminol

Raycast extension to save your own commands and run them in Terminal. The **My Commands** command shows the list (starting with a `ping 8.8.8.8` example); press Enter to run one or `⌘N` to create a new one with a name and a command (multiline commands are supported).

## Quicklinks

To run a saved command straight from Raycast's root search, open its actions (`⌘K`) in **My Commands** and choose **Create Quicklink**. The quicklink opens the command's script in Terminal directly, without going through the extension.

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
