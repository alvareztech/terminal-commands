import { Action, ActionPanel, closeMainWindow, Icon, Keyboard, List, open } from "@raycast/api";
import { showFailureToast, useLocalStorage } from "@raycast/utils";
import { randomUUID } from "crypto";
import { useEffect } from "react";
import { CreateCommandForm } from "./create-command-form";
import { DEFAULT_COMMANDS, getScriptPath, SavedCommand, STORAGE_KEY, writeScripts } from "./storage";

const TERMINAL = "com.apple.Terminal";

export default function Command() {
  const {
    value: commands,
    setValue: setCommands,
    isLoading,
  } = useLocalStorage<SavedCommand[]>(STORAGE_KEY, DEFAULT_COMMANDS);

  useEffect(() => {
    if (commands) {
      writeScripts(commands).catch((error) => showFailureToast(error, { title: "Could not save scripts" }));
    }
  }, [commands]);

  async function createCommand(values: Omit<SavedCommand, "id">) {
    await setCommands([...(commands ?? []), { id: randomUUID(), ...values }]);
  }

  async function run(savedCommand: SavedCommand) {
    try {
      await open(getScriptPath(savedCommand), TERMINAL);
      await closeMainWindow();
    } catch (error) {
      await showFailureToast(error, { title: "Could not open Terminal" });
    }
  }

  const createAction = (
    <Action.Push
      title="Create Command"
      icon={Icon.Plus}
      shortcut={Keyboard.Shortcut.Common.New}
      target={<CreateCommandForm onCreate={createCommand} />}
    />
  );

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search commands">
      <List.Section title="Commands">
        {commands?.map((savedCommand) => {
          const lines = savedCommand.command.split("\n");
          return (
            <List.Item
              key={savedCommand.id}
              icon={Icon.Terminal}
              title={savedCommand.name}
              subtitle={lines[0]}
              accessories={lines.length > 1 ? [{ text: `${lines.length} lines` }] : []}
              actions={
                <ActionPanel>
                  <Action title="Run in Terminal" icon={Icon.Play} onAction={() => run(savedCommand)} />
                  <Action.CreateQuicklink
                    quicklink={{ name: savedCommand.name, link: getScriptPath(savedCommand), application: TERMINAL }}
                  />
                  {createAction}
                </ActionPanel>
              }
            />
          );
        })}
      </List.Section>
      <List.Item icon={Icon.Plus} title="Create Command" actions={<ActionPanel>{createAction}</ActionPanel>} />
    </List>
  );
}
