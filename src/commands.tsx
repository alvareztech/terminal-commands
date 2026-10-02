import { Action, ActionPanel, closeMainWindow, Icon, Keyboard, List } from "@raycast/api";
import { showFailureToast, useLocalStorage } from "@raycast/utils";
import { randomUUID } from "crypto";
import { CreateCommandForm } from "./create-command-form";
import { runInTerminal } from "./terminal";

interface SavedCommand {
  id: string;
  name: string;
  command: string;
}

const DEFAULT_COMMANDS: SavedCommand[] = [{ id: "ping-8-8-8-8", name: "Ping 8.8.8.8", command: "ping 8.8.8.8" }];

export default function Command() {
  const {
    value: commands,
    setValue: setCommands,
    isLoading,
  } = useLocalStorage<SavedCommand[]>("commands", DEFAULT_COMMANDS);

  async function createCommand(values: Omit<SavedCommand, "id">) {
    await setCommands([...(commands ?? []), { id: randomUUID(), ...values }]);
  }

  async function run(savedCommand: SavedCommand) {
    try {
      await runInTerminal(savedCommand.command);
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
        {commands?.map((savedCommand) => (
          <List.Item
            key={savedCommand.id}
            icon={Icon.Terminal}
            title={savedCommand.name}
            subtitle={savedCommand.command}
            actions={
              <ActionPanel>
                <Action title="Run in Terminal" icon={Icon.Play} onAction={() => run(savedCommand)} />
                {createAction}
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
      <List.Item icon={Icon.Plus} title="Create Command" actions={<ActionPanel>{createAction}</ActionPanel>} />
    </List>
  );
}
