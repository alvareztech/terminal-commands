import { runAppleScript } from "@raycast/utils";

export default async function Command() {
  await runAppleScript(`
    tell application "Terminal"
      if it is running then
        do script "ping 8.8.8.8"
      else
        activate
        do script "ping 8.8.8.8" in window 1
      end if
      activate
    end tell
  `);
}
