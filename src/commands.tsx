import {
  Action,
  ActionPanel,
  closeMainWindow,
  Icon,
  Keyboard,
  LaunchProps,
  List,
  PopToRootType,
  showToast,
  Toast,
} from "@raycast/api";
import { createDeeplink, showFailureToast, useLocalStorage } from "@raycast/utils";
import { randomUUID } from "crypto";
import { useEffect, useState } from "react";
import { CreateCommandForm } from "./create-command-form";
import { DEFAULT_COMMANDS, getSavedCommands, SavedCommand, STORAGE_KEY } from "./storage";
import { runInTerminal } from "./terminal";

export default function Command(props: LaunchProps<{ launchContext?: { id?: string } }>) {
  const id = props.launchContext?.id;
  return id ? <RunSavedCommand id={id} /> : <SavedCommandsList />;
}

async function run(savedCommand: SavedCommand) {
  try {
    await runInTerminal(savedCommand.command);
    await closeMainWindow({ popToRootType: PopToRootType.Immediate });
  } catch (error) {
    await showFailureToast(error, { title: "Could not open Terminal" });
  }
}

// Launched from a quicklink: runs the saved command right away instead of showing the list.
function RunSavedCommand(props: { id: string }) {
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getSavedCommands().then(async (commands) => {
      const savedCommand = commands.find((savedCommand) => savedCommand.id === props.id);
      if (savedCommand) {
        await run(savedCommand);
      } else {
        setNotFound(true);
        await showToast({ style: Toast.Style.Failure, title: "Command not found" });
      }
    });
  }, [props.id]);

  return notFound ? <SavedCommandsList /> : <List isLoading />;
}

function SavedCommandsList() {
  const {
    value: commands,
    setValue: setCommands,
    isLoading,
  } = useLocalStorage<SavedCommand[]>(STORAGE_KEY, DEFAULT_COMMANDS);

  async function createCommand(values: Omit<SavedCommand, "id">) {
    await setCommands([...(commands ?? []), { id: randomUUID(), ...values }]);
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
                    quicklink={{
                      name: savedCommand.name,
                      link: createDeeplink({ command: "commands", context: { id: savedCommand.id } }),
                    }}
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
