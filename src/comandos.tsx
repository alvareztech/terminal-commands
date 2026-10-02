import { Action, ActionPanel, closeMainWindow, Icon, List, Keyboard } from "@raycast/api";
import { showFailureToast, useLocalStorage } from "@raycast/utils";
import { randomUUID } from "crypto";
import { CrearComando } from "./crear-comando";
import { runInTerminal } from "./terminal";

interface Comando {
  id: string;
  name: string;
  command: string;
}

const COMANDOS_INICIALES: Comando[] = [{ id: "ping-8-8-8-8", name: "Ping 8.8.8.8", command: "ping 8.8.8.8" }];

export default function Command() {
  const {
    value: comandos,
    setValue: setComandos,
    isLoading,
  } = useLocalStorage<Comando[]>("comandos", COMANDOS_INICIALES);

  async function crearComando(values: Omit<Comando, "id">) {
    await setComandos([...(comandos ?? []), { id: randomUUID(), ...values }]);
  }

  async function ejecutar(comando: Comando) {
    try {
      await runInTerminal(comando.command);
      await closeMainWindow();
    } catch (error) {
      await showFailureToast(error, { title: "No se pudo abrir la Terminal" });
    }
  }

  const crearAction = (
    <Action.Push
      title="Crear Comando"
      icon={Icon.Plus}
      shortcut={Keyboard.Shortcut.Common.New}
      target={<CrearComando onCreate={crearComando} />}
    />
  );

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Buscar comandos">
      <List.Section title="Comandos">
        {comandos?.map((comando) => (
          <List.Item
            key={comando.id}
            icon={Icon.Terminal}
            title={comando.name}
            subtitle={comando.command}
            actions={
              <ActionPanel>
                <Action title="Ejecutar" icon={Icon.Play} onAction={() => ejecutar(comando)} />
                {crearAction}
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
      <List.Item icon={Icon.Plus} title="Crear Comando" actions={<ActionPanel>{crearAction}</ActionPanel>} />
    </List>
  );
}
